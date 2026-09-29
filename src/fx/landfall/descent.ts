/**
 * src/fx/landfall/descent.ts — v1.2 LANDFALL Stage 3: the descent phase
 * machine + camera driver.
 *
 * Module singleton (shape of flight/approach.ts / flight/chaseCam.ts):
 * armDescent() (flight/landfall.ts's requestLanding()) starts it, tick() runs
 * every frame from world/worlds/landfall.ts's update() while 'landfall' is
 * active, owning ENTRY→BRAKE→TOUCHDOWN→WALK end to end (pointer-look + the
 * final teleport to the walk spawn included).
 *
 * CAMERA DRIVE (probe-verified): only ONE shared PerspectiveCamera exists,
 * and nothing in this file's ownership chain has a raw ref to it (unlike
 * chaseCam.ts, which got one via flightBoot.ts injection this lane can't
 * touch). core/cameras.ts's registerCam()+teleportToCamera() — both already
 * exported — gives the same effect: registerCam() overwrites a registry
 * entry, teleportToCamera() copies it onto the real camera AND calls its
 * real .lookAt(). Calling both every tick, reusing the world file's own
 * 'landfall-descent' name, drives position+orientation exactly like a direct
 * write (see that file's own comment: "Stage 3's descent driver owns the
 * camera per-frame... it re-seeds this name then" — this is that re-seed).
 * Fast-forward safety: tick() carries dt overflow past a phase boundary into
 * the next phase within the same call (≤3 hops) so a huge dt lands in the
 * correct end state. Timing is accumulated dt only — never wall clock.
 */
import * as THREE from 'three';
import type { BiomePreset } from './biomes.js';
import type { WorldSpawn } from '../../core/worldTypes.js';
import { registerCam, teleportToCamera } from '../../core/cameras.js';
import { setPointerLookEnabled } from '../../player/controller.js';
import { fadeTransition } from '../../ui/hud.js';
import { setEntryAmount, setFlashAmount } from '../bloom.js';
import { makeRng } from '../space/rng.js';
import { createDustBurst } from './descentDust.js'; // v1.2.1 B5 cap split
import {
  DESCENT_START_ALT, DESCENT_BRAKE_ALT, DESCENT_TOUCHDOWN_ALT,
  DESCENT_ENTRY_SECS, DESCENT_BRAKE_SECS, DESCENT_TOUCHDOWN_SECS,
  DESCENT_ENTRY_OFFSET_X, DESCENT_ENTRY_OFFSET_Z, DESCENT_ENTRY_BOW,
  DESCENT_SHAKE_BASE, DESCENT_TOUCHDOWN_SETTLE_ALT,
} from '../../flight/landfallTuning.js';

export type DescentPhase = 'NONE' | 'ENTRY' | 'BRAKE' | 'TOUCHDOWN' | 'WALK';

const CAM_NAME = 'landfall-descent';
const DESCENT_SEED = 0x1a4d ^ 0xde5c;
const FLASH_LIFE = 0.3;
const LOOK_JITTER_SCALE = 0.7; // fraction of DESCENT_SHAKE_BASE applied as yaw/pitch offset

export interface DescentAttachOpts {
  scene: THREE.Scene;
  biome: BiomePreset;
  groundY: number;
  spawn: WorldSpawn;
  chunksResident: () => number;
}

export interface DescentHandle {
  tick(dt: number, playerPos: THREE.Vector3): void;
}

let opts: DescentAttachOpts | null = null;
let phase: DescentPhase = 'NONE';
let phaseT = 0;
let elapsedTotal = 0;
let skidProgress = 0;
let dustFired = false;
let flashT = -1;

let lastAltitude = 0;
let lastPadDist = 0;
// The altitude the DRIVER applied this frame. getAltitude() reports this
// during ENTRY/BRAKE/TOUCHDOWN (orchestrator loop-gate fix): tick()'s
// playerPos arrives post-eye-clamp and pre-pose-write, so a playerPos-derived
// altitude always read ~1.7m even while flying at 700m.
let appliedAltitude = 0;

let shakeF1 = 0, shakeP1 = 0, shakeF2 = 0, shakeP2 = 0, shakeF3 = 0, shakeP3 = 0;

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

// v1.2.1 B5 cap split — the dust-burst system lives in descentDust.ts; these
// thin wrappers keep the call sites below unchanged, passing opts/
// elapsedTotal explicitly so descentDust.ts never imports this file (no cycle).
const dust = createDustBurst();
function disposeDust(): void {
  if (!opts) return;
  dust.dispose(opts.scene);
}
function triggerDustBurst(): void {
  if (!opts) return;
  dust.trigger(opts.scene, opts.groundY, elapsedTotal);
}
function tickDust(dt: number): void {
  if (!opts) return;
  dust.tick(dt, elapsedTotal, opts.scene);
}

function smooth01(t: number): number {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

function tickFlash(dt: number): void {
  if (flashT < 0) return;
  flashT += dt;
  setFlashAmount(Math.max(0, 0.4 * (1 - flashT / FLASH_LIFE)));
  if (flashT >= FLASH_LIFE) flashT = -1;
}

/** Overwrite the 'landfall-descent' registry entry and teleport the shared
 *  camera onto it — see file header for why this is the camera-drive path.
 *  v1.2.1 B5 nit: registerCam() allocates 2 Vector3s + an entry object every
 *  call (core/cameras.ts, not owned by this lane) — reported, not fixed. */
function applyPoseWithShake(x: number, y: number, z: number, shakeAmp: number): void {
  const jitterYaw = shakeAmp > 0
    ? (Math.sin(elapsedTotal * shakeF1 + shakeP1) * 0.6 + Math.sin(elapsedTotal * shakeF2 + shakeP2) * 0.4) * shakeAmp
    : 0;
  const jitterPitch = shakeAmp > 0 ? Math.cos(elapsedTotal * shakeF3 + shakeP3) * 0.5 * shakeAmp : 0;
  _pos.set(x, y, z);
  // FIXED-PITCH look-ahead (orchestrator loop-gate art fix, round 3): any
  // look target derived from fractions of altitude pitched steeper than the
  // 75° FOV can absorb (>37° down = zero horizon in frame = motion-blurred
  // dirt). Instead: aim at a point a fixed 250m ahead along the horizontal
  // path toward the pad, dropped by tan(25°)·250 — a constant ~25° descent
  // gaze that keeps the horizon band + cloud layers in the top of frame all
  // the way down.
  const alt = y - opts!.groundY;
  const horiz = Math.hypot(x, z) || 1;
  const ux = -x / horiz;
  const uz = -z / horiz;
  const AHEAD = 250;
  const DROP = 117; // 250·tan(25°)
  _look.set(
    x + ux * AHEAD + jitterYaw * LOOK_JITTER_SCALE * 40,
    y - DROP + jitterPitch * LOOK_JITTER_SCALE * 25,
    z + uz * AHEAD,
  );
  registerCam(CAM_NAME, _pos, _look, 'landfall');
  teleportToCamera(CAM_NAME);
  appliedAltitude = alt;
}

function applyEntryPose(t: number): void {
  const eT = smooth01(t / DESCENT_ENTRY_SECS);
  const altitude = THREE.MathUtils.lerp(DESCENT_START_ALT, DESCENT_BRAKE_ALT, eT);
  const offsetFrac = THREE.MathUtils.smoothstep(altitude, DESCENT_TOUCHDOWN_ALT, DESCENT_START_ALT);
  const bow = Math.sin(eT * Math.PI) * DESCENT_ENTRY_BOW;
  const x = DESCENT_ENTRY_OFFSET_X * offsetFrac;
  const z = DESCENT_ENTRY_OFFSET_Z * offsetFrac + bow;
  const heat = eT < 0.5 ? eT / 0.5 : 1 - ((eT - 0.5) / 0.5) * 0.6; // 0→1→0.4
  const shakeAmp = opts!.biome.entry.turbulence * DESCENT_SHAKE_BASE;
  applyPoseWithShake(x, opts!.groundY + altitude, z, shakeAmp);
  setEntryAmount(heat);
}

function applyBrakePose(t: number): void {
  const bT = smooth01(t / DESCENT_BRAKE_SECS);
  const altitude = THREE.MathUtils.lerp(DESCENT_BRAKE_ALT, DESCENT_TOUCHDOWN_ALT, bT);
  const offsetFrac = THREE.MathUtils.smoothstep(altitude, DESCENT_TOUCHDOWN_ALT, DESCENT_START_ALT);
  const x = DESCENT_ENTRY_OFFSET_X * offsetFrac;
  const z = DESCENT_ENTRY_OFFSET_Z * offsetFrac;
  const heat = THREE.MathUtils.lerp(0.4, 0, bT);
  const shakeAmp = opts!.biome.entry.turbulence * DESCENT_SHAKE_BASE * (1 - bT);
  applyPoseWithShake(x, opts!.groundY + altitude, z, shakeAmp);
  setEntryAmount(heat);
  skidProgress = bT;
}

function applyTouchdownPose(t: number): void {
  skidProgress = 1;
  const tT = smooth01(t / DESCENT_TOUCHDOWN_SECS);
  const altitude = THREE.MathUtils.lerp(DESCENT_TOUCHDOWN_ALT, DESCENT_TOUCHDOWN_SETTLE_ALT, tT);
  applyPoseWithShake(0, opts!.groundY + altitude, 0, 0);
  if (!dustFired && t >= DESCENT_TOUCHDOWN_SECS * 0.5) {
    dustFired = true;
    triggerDustBurst();
    flashT = 0;
  }
}

function beginWalkHandoff(): void {
  phase = 'WALK';
  const spawn = opts!.spawn;
  void fadeTransition(() => {
    // Walk reveal at EYE height from the hull's SUN-LIT quadrant (orchestrator
    // loop-gate art fix, round 3): the world spawn sits ON the pad ~5m from
    // the hull's shadowed flank — the reveal was a dark wall at point-blank.
    // The sun sits at azimuth 210° (SSW), so frame the hull from the SW,
    // outside the pad ring, aimed at its midsection.
    _pos.set(spawn.position.x, opts!.groundY + 1.7, spawn.position.z);
    _look.set(0, opts!.groundY + 3, 0);
    registerCam(CAM_NAME, _pos, _look, 'landfall');
    teleportToCamera(CAM_NAME);
    setPointerLookEnabled(true);
    setEntryAmount(0);
  });
}

/** Cascades phase completions within one tick() call (≤3 hops) WITHOUT
 *  touching elapsedTotal — that's accumulated once per real call in tick()
 *  itself; re-adding it per hop would inflate it by however many phases a
 *  huge dt crossed. Only the LAST pose in a cascade is ever rendered, so
 *  reusing the already-final elapsedTotal for earlier, overwritten hops is
 *  harmless. */
function advancePhase(dt: number): void {
  phaseT += dt;

  if (phase === 'ENTRY') {
    applyEntryPose(Math.min(phaseT, DESCENT_ENTRY_SECS));
    if (phaseT >= DESCENT_ENTRY_SECS) {
      const overflow = phaseT - DESCENT_ENTRY_SECS;
      phase = 'BRAKE';
      phaseT = 0;
      advancePhase(overflow);
    }
    return;
  }
  if (phase === 'BRAKE') {
    applyBrakePose(Math.min(phaseT, DESCENT_BRAKE_SECS));
    if (phaseT >= DESCENT_BRAKE_SECS) {
      const overflow = phaseT - DESCENT_BRAKE_SECS;
      phase = 'TOUCHDOWN';
      phaseT = 0;
      advancePhase(overflow);
    }
    return;
  }
  if (phase === 'TOUCHDOWN') {
    applyTouchdownPose(Math.min(phaseT, DESCENT_TOUCHDOWN_SECS));
    if (phaseT >= DESCENT_TOUCHDOWN_SECS) beginWalkHandoff();
  }
}

function tick(dt: number, playerPos: THREE.Vector3): void {
  if (!opts) return;
  lastAltitude = playerPos.y - opts.groundY;
  lastPadDist = Math.hypot(playerPos.x, playerPos.z);
  tickDust(dt);
  tickFlash(dt);

  if (phase === 'NONE' || phase === 'WALK') return;

  elapsedTotal += dt;
  advancePhase(dt);
}

/** Called once from world/worlds/landfall.ts's buildLandfall(). */
export function attachDescent(o: DescentAttachOpts): DescentHandle {
  opts = o;
  return { tick };
}

/** flight/landfall.ts's requestLanding() acceptance branch. */
export function armDescent(): void {
  phase = 'ENTRY';
  phaseT = 0;
  elapsedTotal = 0;
  skidProgress = 0;
  dustFired = false;
  flashT = -1;
  disposeDust();
  const seedRng = makeRng(DESCENT_SEED ^ 0x5eed);
  shakeF1 = seedRng.range(1.2, 2.4); shakeP1 = seedRng() * Math.PI * 2;
  shakeF2 = seedRng.range(2.6, 4.0); shakeP2 = seedRng() * Math.PI * 2;
  shakeF3 = seedRng.range(0.8, 1.8); shakeP3 = seedRng() * Math.PI * 2;
  setPointerLookEnabled(false);
  applyEntryPose(0);
}

/** testApi.resetFlight() chain (flight/landfall.ts's resetLandfall()). */
export function resetDescent(): void {
  // v1.2.1 (Lane A debugging finding) — armDescent() disables pointer-look
  // (disconnect() also drops PointerLockControls' OWN pointerlockchange
  // listener), and normally only beginWalkHandoff() re-enables it. A reset
  // that interrupts an ACTIVE descent (resetFlight() mid-phase — Test 15's
  // repeatability check does this) skipped that re-enable: isLocked would
  // never update again, so tickController swallows WASD for the rest of the
  // run. Check the OLD phase before overwriting it below.
  if (phase === 'ENTRY' || phase === 'BRAKE' || phase === 'TOUCHDOWN') {
    setPointerLookEnabled(true); // connect() is idempotent if already connected
  }
  phase = 'NONE';
  phaseT = 0;
  elapsedTotal = 0;
  skidProgress = 0;
  flashT = -1;
  setEntryAmount(0);
  setFlashAmount(0);
  disposeDust();
}

export function getPhase(): DescentPhase { return phase; }
export function getAltitude(): number {
  return phase === 'ENTRY' || phase === 'BRAKE' || phase === 'TOUCHDOWN'
    ? appliedAltitude
    : lastAltitude;
}
export function getPadDist(): number { return lastPadDist; }
export function getChunksResident(): number { return opts?.chunksResident() ?? 0; }
export function getSkidDeployProgress(): number { return skidProgress; }
