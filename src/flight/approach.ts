/**
 * src/flight/approach.ts — Stage 4 APPROACH (design D5 / §5 / §6 T14).
 * Productionizes the deleted planetScale spike: honest trueDist bookkeeping,
 * the render-scaling illusion (renderDist = min(trueDist, PARK_DIST), angular
 * size preserved EXACTLY), the F approach-assist autopilot, and the HOLD
 * state machine + hysteresis. Destination-planet CONSTRUCTION (mesh, hero
 * surface, cloud shell, haze) lives in destinationVisual.ts (v1.2 LANDFALL
 * Stage 0 P2 split) — this file owns state/logic only, calling
 * buildDestinationVisual() once at init and tickDestinationVisual() once
 * per tick.
 *
 * Mode rules: assist ENGAGE → 'APPROACH'; angular ≥ HOLD_ANGULAR_FRAC →
 * 'HOLD' (assist drops silently — one transition per frame); disengage/HOLD
 * release → 'HELM' if helmActive else 'CRUISE'. While assist or hold is
 * live, tick() REASSERTS the mode each frame: helm's E-stand teardown writes
 * CRUISE while the autopilot keeps flying (intended — D2 stand-up autopilot
 * extended); without the reassert the HUD reads CRUISE for the whole leg.
 *
 * BEARING ported verbatim from the spike (vetted clear of signature heroes,
 * hero sun, and ship structure); mostly "up" + slight forward lean = inside
 * the boot canopy cone. Own makeRng(0xE57A) — zero draw-order risk to the
 * director's seeded sequence (Test 7 byte-identical); consumed in exactly
 * one place (destinationVisual.ts's createBody() call), so Test 14's
 * target=MERIDIAN-319 XII stays the determinism canary.
 */
import * as THREE from 'three';
import { damp } from '../core/damp.js';
import type { Body } from '../fx/space/bodies.js';
import { makeRng } from '../fx/space/rng.js';
import { buildDestinationVisual, tickDestinationVisual, BAKED_RADIUS } from './destinationVisual.js';
import type { UniverseRig } from './universeRig.js';
import {
  getAttitudeInverseRef,
  getFlowWRef,
  getFlight,
  getFlightMode,
  setFlightInput,
  setFlightMode,
} from './flightState.js';
import type { FlightSnapshot } from './types.js';
import {
  PARK_DIST,
  APPROACH_T_ARRIVE,
  APPROACH_SPEED_MIN,
  APPROACH_SPEED_MAX,
  APPROACH_RATE_LAMBDA,
  APPROACH_STEER_GAIN,
  HOLD_ANGULAR_FRAC,
  HOLD_RELEASE_FRAC,
  DEST_TRUE_RADIUS,
  DEST_TRUE_DIST,
} from './flightTuning.js';

// ── Kill switch (house pattern — see core/perf.ts / flightState.ts's ?flight=0) ─
const _params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
const APPROACH_DISABLED: boolean = _params.get('approach') === '0';

const MIN_TRUE_DIST = 10; // floor so atan() never sees a degenerate 0

// Bearing well clear of the signature heroes and the hero sun — see header.
const BEARING = new THREE.Vector3(0.1, 0.95, -0.3).normalize();

/** Test/debug hook shape (testApi.ts) — richer than the frozen FlightSnapshot
 *  field; the angular-size invariant needs renderDist alongside renderScale. */
export interface ApproachDebugInfo {
  targetName: string;
  trueDist: number;
  renderDist: number;
  renderScale: number;
  angErr: number;
  holdEngaged: boolean;
}

interface Ctx {
  camera: THREE.PerspectiveCamera;
  body: Body;
}

let ctx: Ctx | null = null;
let trueDist = DEST_TRUE_DIST;
let closingRate = 0;
let assistEngaged = false;
let holdEngaged = false;
let lastRenderDist = PARK_DIST;
let lastRenderScale = 0;

const _bLocal = new THREE.Vector3();

/** Build the destination planet (destinationVisual.ts) and parent it under
 *  the universe rig (same place director content lives, so its fixed bearing
 *  rotates with attitude for free). No-op under ?approach=0. */
export function initApproach(rig: UniverseRig, camera: THREE.PerspectiveCamera): void {
  if (APPROACH_DISABLED) return;

  // Own dedicated rng (design-mandated seed) — never touches the director's
  // seeded sequence, so Test 7 / the screenshot baselines are unaffected.
  // Consumed by buildDestinationVisual() in exactly one place — see header.
  const rng = makeRng(0xe57a);
  const visual = buildDestinationVisual(rng, BEARING);

  rig.attach(visual.group);
  ctx = { camera, body: visual.body };
  recomputeRender();
}

/** Signed bearing error in ship-local frame — atan2(x,-z)/asin(y), the same
 *  conventions flightState's heading/pitch decomposition uses (yaw needs a
 *  sign flip to match flightModel's rotation direction; pitch does not). */
function steerTowardBearing(): void {
  _bLocal.copy(BEARING).applyQuaternion(getAttitudeInverseRef());
  const yawError = Math.atan2(_bLocal.x, -_bLocal.z); // target-minus-current heading, radians
  const pitchError = Math.asin(THREE.MathUtils.clamp(_bLocal.y, -1, 1));
  setFlightInput({
    yaw: THREE.MathUtils.clamp(-yawError * APPROACH_STEER_GAIN, -1, 1),
    pitch: THREE.MathUtils.clamp(pitchError * APPROACH_STEER_GAIN, -1, 1),
  });
}

/** Shared disengage path — zeroes the assist's own input channel and hands
 *  mode back to whichever of HELM/CRUISE is currently appropriate. */
function disengageAssist(toHelm: boolean): void {
  assistEngaged = false;
  setFlightInput({ pitch: 0, yaw: 0 });
  setFlightMode(toHelm ? 'HELM' : 'CRUISE');
}

/** Per-ship-frame tick (main.ts, right after tickFlight, ship-world only —
 *  design §5: "approach state ticks regardless of helm, in the ship world
 *  only"). No-op under ?approach=0 or before initApproach(). */
export function tickApproach(dt: number): void {
  if (APPROACH_DISABLED || !ctx) return;
  ctx.body.tick(dt); // self-spin, always
  tickDestinationVisual(dt); // cloud-shell spin, always — dt-accumulated, never wall-clock

  if (assistEngaged) {
    // Virtual closure (the illusion): arrival always ~APPROACH_T_ARRIVE
    // seconds regardless of remaining distance — real speed/flow untouched.
    const targetRate = THREE.MathUtils.clamp(trueDist / APPROACH_T_ARRIVE, APPROACH_SPEED_MIN, APPROACH_SPEED_MAX);
    closingRate = damp(closingRate, targetRate, APPROACH_RATE_LAMBDA, dt);
    trueDist = Math.max(trueDist - closingRate * dt, MIN_TRUE_DIST);
    steerTowardBearing();
    // Reassert vs helm's E-stand CRUISE write — see header mode rules.
    if (getFlightMode() !== 'APPROACH') setFlightMode('APPROACH');
  } else {
    // Honest closure: trueDist -= dot(velocityW,bearing)*dt; velocityW=-flowW
    // (flightState.ts convention) → equivalent to += dot(flowW,bearing)*dt.
    // HOLD clamps the INWARD half to zero (eaten); outward passes through.
    const closureDelta = getFlowWRef().dot(BEARING) * dt;
    const applied = holdEngaged ? Math.max(closureDelta, 0) : closureDelta;
    trueDist = Math.max(trueDist + applied, MIN_TRUE_DIST);
  }

  const angularDeg = THREE.MathUtils.radToDeg(2 * Math.atan(DEST_TRUE_RADIUS / trueDist));
  if (!holdEngaged && angularDeg >= HOLD_ANGULAR_FRAC * ctx.camera.fov) {
    holdEngaged = true;
    // Assist drops WITHOUT its mode write — one transition, APPROACH→HOLD.
    assistEngaged = false;
    setFlightInput({ pitch: 0, yaw: 0 });
    setFlightMode('HOLD');
  } else if (holdEngaged && angularDeg < HOLD_RELEASE_FRAC * HOLD_ANGULAR_FRAC * ctx.camera.fov) {
    holdEngaged = false;
    setFlightMode(getFlight().helmActive ? 'HELM' : 'CRUISE');
  } else if (holdEngaged && getFlightMode() !== 'HOLD') {
    // Same reassert rule as APPROACH above: E-stand mid-hold wrote CRUISE.
    setFlightMode('HOLD');
  }

  recomputeRender();
}

/** Recompute render position/scale from `trueDist` — renderDist =
 *  min(trueDist, PARK_DIST); renderScale preserves the angular size EXACTLY. */
function recomputeRender(): void {
  if (!ctx) return;
  const renderDist = Math.min(trueDist, PARK_DIST);
  const renderScale = trueDist >= PARK_DIST
    ? DEST_TRUE_RADIUS * (PARK_DIST / trueDist)
    : DEST_TRUE_RADIUS;
  ctx.body.group.position.copy(BEARING).multiplyScalar(renderDist);
  ctx.body.group.scale.setScalar(renderScale / BAKED_RADIUS);
  lastRenderDist = renderDist;
  lastRenderScale = renderScale;
}

/** F keybind (helmInput.ts) + testApi.engageApproach(): toggle. No-op while
 *  HOLD is engaged or disabled/uninitialized. */
export function toggleApproachAssist(): void {
  if (APPROACH_DISABLED || !ctx || holdEngaged) return;
  if (assistEngaged) {
    disengageAssist(getFlight().helmActive);
  } else {
    assistEngaged = true;
    closingRate = 0; // fresh λ-ramp — a stale rate would snap to speed instantly
    setFlightMode('APPROACH');
  }
}

/** helmInput.ts: while the assist owns the pitch/yaw channel, the helm's
 *  decaying virtual stick must not overwrite it (writer-conflict rule). */
export function isApproachAssistEngaged(): boolean {
  return assistEngaged;
}

/** helmInput.ts: called on REAL mouse/arrow input only — NMS-style manual
 *  override. Only invoked while helm listeners are attached, so 'HELM' is
 *  safe here without an extra getFlight() allocation. */
export function approachNoteManualInput(): void {
  if (assistEngaged) disengageAssist(true);
}

/** flightState's injected provider (getFlight().approach) — the FROZEN
 *  shape only; richer test/debug fields live in getApproachDebug(). */
export function getApproachSnapshot(): FlightSnapshot['approach'] {
  if (APPROACH_DISABLED || !ctx) return null;
  return {
    targetName: ctx.body.scan.name,
    trueDist,
    renderScale: lastRenderScale,
    holdEngaged,
  };
}

/** Test/debug hook (testApi.ts) — the angular-size invariant is only
 *  test-assertable with renderDist + angErr alongside the frozen fields. */
export function getApproachDebug(): ApproachDebugInfo | null {
  if (APPROACH_DISABLED || !ctx) return null;
  const trueAngular = 2 * Math.atan(DEST_TRUE_RADIUS / trueDist);
  const renderAngular = 2 * Math.atan(lastRenderScale / lastRenderDist);
  return {
    targetName: ctx.body.scan.name,
    trueDist,
    renderDist: lastRenderDist,
    renderScale: lastRenderScale,
    angErr: Math.abs(trueAngular - renderAngular),
    holdEngaged,
  };
}

/** testApi.resetFlight() — boot-state reset so nothing downstream (or the
 *  next test on the shared page) sees a swollen planet or a stuck assist/hold. */
export function resetApproach(): void {
  if (APPROACH_DISABLED || !ctx) return;
  trueDist = DEST_TRUE_DIST;
  closingRate = 0;
  assistEngaged = false;
  holdEngaged = false;
  recomputeRender();
}
