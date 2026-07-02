/**
 * src/player/controller.ts — First-person controller + anchor seat API.
 *
 * Anchor API (cross-lane enabler for pilot-seat / mess-bench sitting):
 *
 *   enterAnchor(pos: Vector3, lookAt: Vector3, eyeHeight?: number): void
 *     Smoothly lerps the camera to a seated pose over 350ms.
 *     Disables WASD while anchored.
 *     Stores prior position+quaternion in state for exitAnchor().
 *
 *   exitAnchor(): void
 *     Restores prior position and quaternion, re-enables WASD.
 *     The integration agent calls these after wiring named seat groups.
 *
 * Head-bob (isMoving path):
 *   tickBob(camera, elapsed, moving) — applied AFTER collision/position so the
 *   offset never pushes the camera through geometry.
 *   Sway (tickSway) remains the secondary roll layer.
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import type { AABB } from '../world/types.js';
import { setSeated, getState } from '../core/state.js';

const EYE_HEIGHT = 1.7;
const WALK_SPEED = 3.5; // m/s
const CAPSULE_RADIUS = 0.3;
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

// ── Head-bob state ────────────────────────────────────────────────────────────

/** Current vertical bob offset applied on top of FLOOR_Y. */
let bobOffset = 0;

// ── FOV kick state ────────────────────────────────────────────────────────────

/**
 * Captured rest FOV — set on first tickBob call so we never hardcode 75.
 * -1 means "not yet captured".
 */
let _restFov = -1;
/** Current lerped FOV (tracks camera.fov). */
let _currentFov = -1;

/**
 * Tick the head-bob effect + FOV walk kick.
 * When moving: y += sin(elapsed*5.5)*0.022 (≈4.4 cm peak-to-peak at walk pace).
 * When stopped: lerp offset back to 0 at 6 units/s.
 * FOV lerps to restFov+2 when moving, back to restFov when stopped.
 * Applied AFTER collision resolution so it never pushes camera through geometry.
 *
 * @param camera  - active perspective camera
 * @param elapsed - seconds since scene start
 * @param moving  - true when WASD is held and pointer is locked
 */
export function tickBob(
  camera: THREE.PerspectiveCamera,
  elapsed: number,
  moving: boolean,
): void {
  // Capture rest FOV on first call (main.ts sets camera.fov before calling us)
  if (_restFov < 0) {
    _restFov = camera.fov;
    _currentFov = camera.fov;
  }

  if (moving) {
    bobOffset = Math.sin(elapsed * 5.5) * 0.022;
  } else {
    // Lerp back to 0 at 6 units/s (using last frame dt approximation via lerp factor)
    bobOffset *= Math.max(0, 1 - 6 * 0.016); // approximate 16ms frame
    if (Math.abs(bobOffset) < 0.0001) bobOffset = 0;
  }
  // Apply the offset on top of the ground eye height (ship: 0 + EYE_HEIGHT = FLOOR_Y)
  camera.position.y = activeGround(camera.position.x, camera.position.z) + EYE_HEIGHT + bobOffset;

  // ── FOV kick: +2 when walking, back to rest when stopped ─────────────────
  const st = getState();
  // While seated force FOV to rest immediately (no kick from anchor anim)
  const targetFov = (!moving || st.seated) ? _restFov : _restFov + 2;
  const delta = targetFov - _currentFov;
  if (Math.abs(delta) > 0.01) {
    _currentFov += delta * Math.min(1, 8 * 0.016); // ~8 units/s lerp
    camera.fov = _currentFov;
    camera.updateProjectionMatrix();
  } else if (camera.fov !== _restFov && !moving) {
    // Snap to exact rest when converged to avoid permanent drift
    _currentFov = _restFov;
    camera.fov = _restFov;
    camera.updateProjectionMatrix();
  }
}

// ── Anchor (seat) API ─────────────────────────────────────────────────────────

/** True while a lerp-to-anchor animation is in flight. */
let anchorAnimating = false;

/** The target pose for the current anchor animation. */
let anchorTargetPos: THREE.Vector3 | null = null;
let anchorTargetQuat: THREE.Quaternion | null = null;

/** Elapsed ms into the current anchor animation. */
let anchorAnimMs = 0;
const ANCHOR_ANIM_MS = 350;

/**
 * Enter an anchor (seated) pose.
 *
 * Integration signature (called by integration agent after wiring seat groups):
 *   enterAnchor(pos: THREE.Vector3, lookAt: THREE.Vector3, eyeHeight?: number): void
 *
 * @param pos       World-space position of the seated camera eye.
 * @param lookAt    World-space point the camera should face when seated.
 * @param eyeHeight Eye height offset from seat position (default 1.1m).
 */
export function enterAnchor(
  pos: THREE.Vector3,
  lookAt: THREE.Vector3,
  eyeHeight = 1.1,
): void {
  if (!controls) return;
  const camera = controls.camera as THREE.PerspectiveCamera;

  // Store return pose
  const returnPose = {
    position: camera.position.clone(),
    quaternion: camera.quaternion.clone(),
  };
  setSeated(true, returnPose);

  // Build target quaternion: look from (pos + eyeHeight) toward lookAt
  const seatPos = pos.clone();
  seatPos.y += eyeHeight;

  const targetQuat = new THREE.Quaternion();
  const dummyCam = new THREE.Object3D();
  dummyCam.position.copy(seatPos);
  dummyCam.lookAt(lookAt);
  targetQuat.copy(dummyCam.quaternion);

  anchorTargetPos = seatPos;
  anchorTargetQuat = targetQuat;
  anchorAnimating = true;
  anchorAnimMs = 0;
}

/**
 * Exit the current anchor (return to prior standing pose).
 * Called by interact.ts when E is pressed while seated, or by integration directly.
 */
export function exitAnchor(): void {
  if (!controls) return;
  const st = getState();
  if (!st.seated || !st.anchorReturn) return;

  const camera = controls.camera as THREE.PerspectiveCamera;
  camera.position.copy(st.anchorReturn.position);
  camera.quaternion.copy(st.anchorReturn.quaternion);
  bobOffset = 0;

  setSeated(false);
  anchorAnimating = false;
  anchorTargetPos = null;
  anchorTargetQuat = null;
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

// ── Collision ─────────────────────────────────────────────────────────────────

/**
 * Check if a point (treated as a capsule base in XZ) collides with any AABB.
 * We test a cylinder footprint: the camera XZ position ± CAPSULE_RADIUS.
 */
function collidesAABB(x: number, z: number, aabb: AABB): boolean {
  // Camera Y is fixed at EYE_HEIGHT; body occupies Y 0..2.0
  const bodyMinY = 0.1;
  const bodyMaxY = 1.9;
  if (bodyMinY > aabb.maxY || bodyMaxY < aabb.minY) return false;

  const closestX = Math.max(aabb.minX, Math.min(x, aabb.maxX));
  const closestZ = Math.max(aabb.minZ, Math.min(z, aabb.maxZ));
  const dx = x - closestX;
  const dz = z - closestZ;
  return dx * dx + dz * dz < CAPSULE_RADIUS * CAPSULE_RADIUS;
}

function tryMove(pos: THREE.Vector3, dx: number, dz: number): void {
  // Try full move
  const nx = pos.x + dx;
  const nz = pos.z + dz;
  let blocked = false;
  for (const aabb of colliders) {
    if (collidesAABB(nx, nz, aabb)) { blocked = true; break; }
  }
  if (!blocked) {
    pos.x = nx;
    pos.z = nz;
    return;
  }

  // Try X only
  let blockedX = false;
  for (const aabb of colliders) {
    if (collidesAABB(nx, pos.z, aabb)) { blockedX = true; break; }
  }
  if (!blockedX) { pos.x = nx; return; }

  // Try Z only
  let blockedZ = false;
  for (const aabb of colliders) {
    if (collidesAABB(pos.x, nz, aabb)) { blockedZ = true; break; }
  }
  if (!blockedZ) { pos.z = nz; }
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initController(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  shipColliders: AABB[],
): PointerLockControls {
  colliders = shipColliders;

  controls = new PointerLockControls(camera, renderer.domElement);
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

  // ── Anchor animation ───────────────────────────────────────────────────────
  if (anchorAnimating && anchorTargetPos && anchorTargetQuat) {
    anchorAnimMs += dt * 1000;
    const t = Math.min(anchorAnimMs / ANCHOR_ANIM_MS, 1);
    const easedT = t * t * (3 - 2 * t); // smoothstep

    camera.position.lerp(anchorTargetPos, easedT);
    camera.quaternion.slerp(anchorTargetQuat, easedT);

    if (t >= 1) {
      anchorAnimating = false;
      anchorTargetPos = null;
      anchorTargetQuat = null;
    }
    _isMoving = false;
    return;
  }

  // ── Seated: disable WASD movement ─────────────────────────────────────────
  if (st.seated) {
    _isMoving = false;
    return;
  }

  if (!controls.isLocked) {
    _isMoving = false;
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
    tryMove(camera.position, move.x, move.z);
  }

  // Clamp Y to ground eye height (bob is applied separately after this in main.ts).
  // Ship ground is constant 0, so this equals the old flat FLOOR_Y clamp.
  camera.position.y = activeGround(camera.position.x, camera.position.z) + EYE_HEIGHT;
}
