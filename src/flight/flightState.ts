/**
 * src/flight/flightState.ts — module singleton owning ALL v1.1 SOVEREIGN
 * flight state (design doc D1, §4). Everything downstream (HUD, consoles,
 * tests, universeRig, chase cam) reads via getFlight(); flightModel.ts is
 * the only writer, via the private `state` object handed to it below.
 *
 * ── SIGN CONVENTION (frame contract §2 — read before touching this file) ────
 * Nose in ship frame S is -Z. attitude (q) rotates S → W.
 *   velocityW = q · (0,0,-1) · speed        (ship's true motion through W)
 *   flowW     = -velocityW                  (apparent universe velocity — the
 *                                             universe moves OPPOSITE the ship)
 * At boot (q = identity, throttle = BOOT_THROTTLE → speed = 14 u/s):
 *   velocityW = (0,0,-14)   flowW = (0,0,+14)
 * flowW's sign at boot matches today's v1.0 +Z universe scroll BY
 * CONSTRUCTION — this is what keeps t=0 determinism (Test 7 hero bearings,
 * near-slab wrap) intact across the refactor.
 *
 * getFlowAxis() = normalize(flowW) — NOT travelDir. Lane C's spawn/despawn
 * bands and driftW math key off flowW's direction so the design's fixed band
 * numbers (§3) hold unchanged. travelDir instead tracks the LAST
 * non-degenerate flow direction and exists so a stopped ship (speed ≈ 0,
 * flowW ≈ 0) doesn't lose a usable "facing" for cast/orientation purposes —
 * it boots at (0,0,1), matching flowW's boot direction.
 * ─────────────────────────────────────────────────────────────────────────
 */
import * as THREE from 'three';
import type { FlightInput, FlightMode, FlightSnapshot } from './types.js';
import { tickFlightModel, resetFlightModelInternals } from './flightModel.js';
import { BOOT_THROTTLE, MAX_SPEED_CRUISE } from './flightTuning.js';

/** Mutable flight state. flightModel.ts is the only writer (via tickFlight). */
export interface InternalFlightState {
  attitude: THREE.Quaternion;
  angularVel: THREE.Vector3;
  speed: number;
  throttle: number;
  velocityW: THREE.Vector3;
  flowW: THREE.Vector3;
  travelDir: THREE.Vector3;
  trauma: number;
  mode: FlightMode;
  helmActive: boolean;
  view: 'interior' | 'exterior';
  input: FlightInput;
}

const BOOT_SPEED = BOOT_THROTTLE * MAX_SPEED_CRUISE; // 14 u/s — v1.0-identical

function freshState(): InternalFlightState {
  return {
    attitude: new THREE.Quaternion(),
    angularVel: new THREE.Vector3(),
    speed: BOOT_SPEED,
    throttle: BOOT_THROTTLE,
    velocityW: new THREE.Vector3(0, 0, -BOOT_SPEED),
    flowW: new THREE.Vector3(0, 0, BOOT_SPEED),
    travelDir: new THREE.Vector3(0, 0, 1),
    trauma: 0,
    mode: 'CRUISE',
    helmActive: false,
    view: 'interior',
    input: { pitch: 0, yaw: 0, roll: 0, throttleDelta: 0, boost: false },
  };
}

let state: InternalFlightState = freshState();

// ── Cached derived refs (Stage 2 shim repoint) ──────────────────────────────
// Zero-alloc per-frame reads for the universe rig / starfield / director /
// cast / chase cam — the same ref-return semantics the Lane C/D shims had.
// Recomputed after every state write (tickFlight, reset, __testSetFlight) and
// initialized at boot, so under `?flight=0` (tickFlight no-ops) they serve
// frozen boot values forever: identity attitude, flowW (0,0,14) — the
// v1.0-identical kill-switch behavior the shims guaranteed.
const _attitudeInverse = new THREE.Quaternion();
const _flowAxis = new THREE.Vector3(0, 0, 1);

function refreshDerived(): void {
  _attitudeInverse.copy(state.attitude).invert();
  if (state.flowW.lengthSq() > 1e-8) {
    _flowAxis.copy(state.flowW).normalize();
  } else {
    _flowAxis.copy(state.travelDir);
  }
}
refreshDerived();

// `?flight=0` kill-switch (house pattern — see core/perf.ts QUALITY_LOW).
// tickFlight() no-ops entirely when set; no other call site needs to know
// (main.ts always calls tickFlight() unconditionally, gated only on
// activeId === 'ship').
const _flightParams = new URLSearchParams(
  typeof window !== 'undefined' ? window.location.search : '',
);
const FLIGHT_DISABLED: boolean = _flightParams.get('flight') === '0';

/** Aircraft-instrument-style angle extraction. Heading/pitch come straight
 *  off the nose vector; bank compares the actual "up" against the up you'd
 *  have at zero roll for that same nose direction — robust to gimbal/order
 *  ambiguity that a raw Euler decomposition of `attitude` would carry. */
const WORLD_UP = new THREE.Vector3(0, 1, 0);
function computeAngles(attitude: THREE.Quaternion): { headingDeg: number; pitchDeg: number; bankDeg: number } {
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(attitude);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(attitude);
  const headingRaw = THREE.MathUtils.radToDeg(Math.atan2(forward.x, -forward.z));
  const pitchDeg = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(forward.y, -1, 1)));
  const right = new THREE.Vector3().crossVectors(WORLD_UP, forward);
  if (right.lengthSq() < 1e-8) right.set(1, 0, 0); // degenerate: nose ~vertical
  right.normalize();
  const zeroBankUp = new THREE.Vector3().crossVectors(forward, right).normalize();
  const bankDeg = THREE.MathUtils.radToDeg(Math.atan2(up.dot(right), up.dot(zeroBankUp)));
  return { headingDeg: ((headingRaw % 360) + 360) % 360, pitchDeg, bankDeg };
}

/** Fresh, read-only snapshot — clones every vector/quat, no live refs out. */
export function getFlight(): FlightSnapshot {
  const { headingDeg, pitchDeg, bankDeg } = computeAngles(state.attitude);
  return {
    mode: state.mode,
    speed: state.speed,
    throttle: state.throttle,
    headingDeg,
    pitchDeg,
    bankDeg,
    attitude: state.attitude.clone(),
    flowW: state.flowW.clone(),
    travelDir: state.travelDir.clone(),
    helmActive: state.helmActive,
    view: state.view,
    approach: null, // Stage 4 (Lane E) fills this in; no destination planet yet
  };
}

/** Merge a partial FlightInput into the persistent input struct. Mouse, keys,
 *  and TestAPI (flightTickN) are interchangeable writers (design doc D2). */
export function setFlightInput(partial: Partial<FlightInput>): void {
  Object.assign(state.input, partial);
}

/** Ticks the flight model once. No-op when `?flight=0` (v1.0-identical). */
export function tickFlight(dt: number): void {
  if (FLIGHT_DISABLED) return;
  tickFlightModel(state, dt);
  refreshDerived();
}

/** Apparent universe flow direction (unit) — the axis Lane C's spawn/despawn
 *  and driftW math use, NOT travelDir (see sign-convention note above). */
export function getFlowAxis(): THREE.Vector3 {
  return state.flowW.lengthSq() > 1e-8
    ? state.flowW.clone().normalize()
    : state.travelDir.clone();
}

/** World-load hook: attitude → identity, speed → cruise default. Heading
 *  persistence lives in state.ts only (design doc D3) — the cast isn't
 *  persisted either, so a mid-turn save isn't a state worth honoring. */
export function resetFlightForLoad(): void {
  state = freshState();
  resetFlightModelInternals();
  refreshDerived();
}

// ── Zero-alloc ref getters (Stage 2 — the live replacements for the Lane C/D
// shims). Returned objects are LIVE INTERNAL REFS: read-only by contract,
// never mutate, never cache across frames. HUD/tests wanting safe copies use
// getFlight() instead. ─────────────────────────────────────────────────────

/** Ship attitude q (S→W). Live ref — do not mutate. */
export function getAttitudeRef(): THREE.Quaternion {
  return state.attitude;
}

/** q⁻¹ — what the universe rig writes to its group quaternion. Live ref. */
export function getAttitudeInverseRef(): THREE.Quaternion {
  return _attitudeInverse;
}

/** Apparent universe velocity, world frame. Live ref. */
export function getFlowWRef(): THREE.Vector3 {
  return state.flowW;
}

/** Unit spawn/despawn axis = normalize(flowW), travelDir fallback. Live ref. */
export function getFlowAxisRef(): THREE.Vector3 {
  return _flowAxis;
}

/** Speed as a 0..1 fraction of cruise max — boots 0.35, byte-matching the
 *  old Lane D shim default so chase FOV/arm visuals are unchanged. Boost
 *  saturates at 1 (its smoothstep consumers clamp anyway). */
export function getSpeedFrac(): number {
  return THREE.MathUtils.clamp(state.speed / MAX_SPEED_CRUISE, 0, 1);
}

/** Current camera view mode (D4). */
export function getView(): 'interior' | 'exterior' {
  return state.view;
}

/** Direct throttle write — the helm's X all-stop. Speed then exponentially
 *  approaches the new target via the model's DECEL_LAMBDA (a satisfying
 *  coast, not a brake slam). */
export function setThrottle(v: number): void {
  state.throttle = THREE.MathUtils.clamp(v, 0, 1);
}

/** TEST-ONLY driver (replaces the shims' __shimSet): plant an attitude and
 *  speed, then derive velocityW/flowW/travelDir/throttle consistently so the
 *  next tickFlightModel doesn't erode the planted state (flowW is DERIVED
 *  from attitude+speed every tick — a raw flow write would last one frame).
 *  Speeds above MAX_SPEED_CRUISE settle back toward it (throttle clamps at
 *  1); T12's fast-flight segment only needs sustained fast flow, not an
 *  exact number. No-op under `?flight=0`, preserving the kill-switch
 *  semantics __shimSet had. */
export function __testSetFlight(attitude: THREE.Quaternion, speed: number): void {
  if (FLIGHT_DISABLED) return;
  state.attitude.copy(attitude).normalize();
  state.speed = Math.max(0, speed);
  state.throttle = THREE.MathUtils.clamp(state.speed / MAX_SPEED_CRUISE, 0, 1);
  const nose = new THREE.Vector3(0, 0, -1).applyQuaternion(state.attitude);
  state.velocityW.copy(nose).multiplyScalar(state.speed);
  state.flowW.copy(state.velocityW).multiplyScalar(-1);
  if (state.flowW.lengthSq() > 1e-6) {
    state.travelDir.copy(state.flowW).normalize();
  }
  refreshDerived();
}

// ── Narrow setters for the fields other lanes assign (design doc D2/D4/D5) ──
// Lane A does not call these; they exist so Lane B/D/E have a stable surface
// into this singleton without reaching into module-private state directly.

export function setHelmActive(active: boolean): void {
  state.helmActive = active;
}

export function setFlightView(view: 'interior' | 'exterior'): void {
  state.view = view;
}

export function setFlightMode(mode: FlightMode): void {
  state.mode = mode;
}
