/**
 * src/player/controller.ts — First-person controller: WASD movement,
 * pointer-lock, ground clamp, and the per-frame tick that ties collision
 * (./collision.ts), head-bob/FOV-kick (./bob.ts) and the seat/anchor API
 * (./anchor.ts, re-exported below for callers outside this lane) together.
 * Split three ways in v1.2.1 (B5 cap fix) — this file owns only movement +
 * orchestration now; see each module's own header for what it owns.
 *
 * Anchor API (./anchor.ts, cross-lane enabler for pilot-seat / mess-bench
 * sitting): enterAnchor()/exitAnchor() lerp the camera to/from a seated pose;
 * standUpInPlace() (v1.2.1 B1) clears seated WITHOUT the ship-pose teleport,
 * for the real-landing route (flight/landfall.ts).
 *
 * Head-bob (isMoving path, ./bob.ts):
 *   tickBob(camera, elapsed, moving) — applied AFTER collision/position so the
 *   offset never pushes the camera through geometry.
 *   Sway (tickSway) remains the secondary roll layer.
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import type { AABB } from '../world/types.js';
import { getState } from '../core/state.js';
import { tickBob as tickBobEffect } from './bob.js';
import { tryMove } from './collision.js';
import { initAnchor, tickAnchorAnim } from './anchor.js';
// Re-exported (unchanged public surface): helm.ts imports these from
// controller.js, and player/interact.ts (not this lane's file) hardcodes
// `from './controller.js'` for exitAnchor — both must keep resolving.
export { enterAnchor, exitAnchor, standUpInPlace } from './anchor.js';

const EYE_HEIGHT = 1.7;
const WALK_SPEED = 3.5; // m/s
const FLOOR_Y = EYE_HEIGHT; // camera Y when standing on deck

interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

const keys: KeyState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

let controls: PointerLockControls | null = null;
let colliders: AABB[] = [];
let lastTime = performance.now();

// ── Active-world ground + collider swap (WorldManager owns these) ────────────
// Ship is PIXEL-IDENTICAL: default ground is constant 0 and EYE_HEIGHT===FLOOR_Y,
// so `groundHeight(x,z)+EYE_HEIGHT` collapses to the old flat FLOOR_Y clamp.
let activeGround: (x: number, z: number) => number = () => 0;

/** Swap the ground-height function (WorldManager, on world switch). */
export function setGroundHeight(fn: (x: number, z: number) => number): void {
  activeGround = fn;
}

/** Swap the active collider set (WorldManager, on world switch). */
export function setActiveColliders(list: AABB[]): void {
  colliders = list;
}

/** Helm mode (v1.1 SOVEREIGN D2): surrender/return the free-look mouse to
 *  helmInput.ts by disconnecting/reconnecting PointerLockControls' own
 *  mousemove listener (the camera stays anchored at the seat either way). */
export function setPointerLookEnabled(enabled: boolean): void {
  if (!controls) return;
  if (enabled) controls.connect(); else controls.disconnect();
}

// ── Head-bob + FOV-kick (v1.2.1 B5 cap split — src/player/bob.ts) ───────────

/** Thin wrapper preserving the pre-split call signature (main.ts imports
 *  this from './player/controller.js' unchanged) — supplies bob.ts with
 *  controller.ts's own activeGround/EYE_HEIGHT so bob.ts never needs to
 *  import this file back (no cycle). */
export function tickBob(
  camera: THREE.PerspectiveCamera,
  elapsed: number,
  moving: boolean,
): void {
  tickBobEffect(camera, elapsed, moving, activeGround, EYE_HEIGHT);
}

// ── Keyboard handlers ─────────────────────────────────────────────────────────

function onKeyDown(e: KeyboardEvent): void {
  switch (e.code) {
    case 'KeyW': case 'ArrowUp':    keys.forward   = true; break;
    case 'KeyS': case 'ArrowDown':  keys.backward  = true; break;
    case 'KeyA': case 'ArrowLeft':  keys.left      = true; break;
    case 'KeyD': case 'ArrowRight': keys.right     = true; break;
  }
}

function onKeyUp(e: KeyboardEvent): void {
  switch (e.code) {
    case 'KeyW': case 'ArrowUp':    keys.forward   = false; break;
    case 'KeyS': case 'ArrowDown':  keys.backward  = false; break;
    case 'KeyA': case 'ArrowLeft':  keys.left      = false; break;
    case 'KeyD': case 'ArrowRight': keys.right     = false; break;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initController(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  shipColliders: AABB[],
): PointerLockControls {
  colliders = shipColliders;

  controls = new PointerLockControls(camera, renderer.domElement);
  initAnchor(controls); // player/anchor.ts — needs the same controls ref for its own seated-camera lerp
  camera.position.set(0, FLOOR_Y, -19); // Start in cockpit

  renderer.domElement.addEventListener('click', () => {
    controls?.lock();
  });

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  lastTime = performance.now();
  return controls;
}

/** True while the player is actively pressing a movement key AND is locked. */
let _isMoving = false;

/** Returns true when the player is walking this frame (pointer-locked + key held). */
export function isMoving(): boolean {
  return _isMoving;
}

export function tickController(now: number): void {
  if (!controls) return;

  const dt = Math.min((now - lastTime) / 1000, 0.05); // cap dt at 50ms
  lastTime = now;

  const camera = controls.camera as THREE.PerspectiveCamera;
  const st = getState();

  // ── Anchor animation (player/anchor.ts) ───────────────────────────────────
  if (tickAnchorAnim(dt)) {
    _isMoving = false;
    _lastTickGate = 'anchor-anim';
    return;
  }

  // ── Seated: disable WASD movement ─────────────────────────────────────────
  if (st.seated) {
    _isMoving = false;
    _lastTickGate = 'seated';
    return;
  }

  if (!controls.isLocked) {
    _isMoving = false;
    _lastTickGate = 'not-locked';
    return;
  }

  const move = new THREE.Vector3();

  if (keys.forward)  move.z -= 1;
  if (keys.backward) move.z += 1;
  if (keys.left)     move.x -= 1;
  if (keys.right)    move.x += 1;

  _isMoving = move.lengthSq() > 0;

  if (_isMoving) {
    move.normalize().multiplyScalar(WALK_SPEED * dt);
    move.applyEuler(new THREE.Euler(0, camera.rotation.y, 0, 'YXZ'));
    tryMove(camera.position, move.x, move.z, colliders);
  }
  _lastTickGate = _isMoving ? 'moving' : 'idle';

  // Clamp Y to ground eye height (bob is applied separately after this in main.ts).
  // Ship ground is constant 0, so this equals the old flat FLOOR_Y clamp.
  camera.position.y = activeGround(camera.position.x, camera.position.z) + EYE_HEIGHT;
}

/**
 * v1.2.1 B6 test hook — which branch tickController() took THIS frame, in
 * order of precedence. Exists specifically to distinguish "still gated on
 * `seated`" (the B1 bug) from "gated on missing pointer lock" (a harness
 * limitation: Playwright's synthetic canvas click cannot always obtain a real
 * PointerLock, so a headless/headed CI run may never be able to prove REAL
 * WASD movement end-to-end). Asserting `getLastTickGateForTest() !==
 * 'seated'` after a real landing proves the seated early-out is gone even
 * when 'not-locked' is the harness's own ceiling, not a game bug.
 */
export type TickControllerGate = 'anchor-anim' | 'seated' | 'not-locked' | 'moving' | 'idle';
let _lastTickGate: TickControllerGate = 'idle';
export function getLastTickGateForTest(): TickControllerGate {
  return _lastTickGate;
}
