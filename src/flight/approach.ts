/**
 * src/flight/approach.ts — Stage 4 APPROACH (Lane E, design doc D5 / §5 Stage
 * 4 / §6 T14). Productionizes src/flight/spikes/planetScale.ts (deleted by
 * this lane): the ONE seeded destination planet, honest trueDist bookkeeping,
 * the render-scaling illusion (renderDist = min(trueDist, PARK_DIST), angular
 * size preserved EXACTLY), the F approach-assist autopilot, the HOLD
 * proximity state machine + hysteresis, and the haze shell that sells "world"
 * at hold range.
 *
 * Mode rules (edge-triggered only, never every frame, so HELM/CRUISE is never
 * fought while neither assist nor hold is active): assist ENGAGE → 'APPROACH';
 * angular size crosses HOLD_ANGULAR_FRAC → 'HOLD' + assist force-disengages;
 * assist DISENGAGE (any reason) or HOLD release past hysteresis → 'HELM' if
 * helmActive else 'CRUISE'. helm.ts's E-stand teardown also unconditionally
 * sets 'CRUISE' (existing Lane B code, untouched) — if the pilot stands up
 * mid-approach/hold that can race this module's next tick() (ungated from
 * helm, same as tickHelm — design §5), which wins the next frame since
 * main.ts calls tickApproach() after tickHelm/tickFlight. Intentional: the
 * autopilot keeps flying while the pilot walks the deck (D2's "stand-up
 * autopilot," extended here) — worst case a single invisible-at-60fps flicker.
 *
 * BEARING = normalize(0.1, 0.95, -0.3), ported VERBATIM from the Stage 0
 * spike, which already vetted it clear of the two signature-hero directions
 * (cast.ts) and the hero-sun bearing (director.ts), with a shared 3-cam
 * vantage confirmed clean of ship structure. Mostly "up" with a slight
 * forward lean keeps it inside the boot canopy cone — discoverable by flying.
 *
 * Own dedicated makeRng(0xE57A) instance (design-mandated seed) — zero shared
 * draw-order risk with the director's seeded sequence (Test 7 / screenshot
 * baselines depend on that sequence staying byte-identical).
 *
 * Cosmetic fixes over the spike (without touching bodies.ts, out of lane
 * scope): the spike's GAS_GIANT reuse baked in createBody's own 28×20-segment
 * addAtmosphere() shell (visibly faceted at HOLD range) over an equirect-UV
 * texture (pole pinch if a pole faces the viewer). Fixed by (1) core body
 * kind = 'ROCKY' (no built-in atmosphere), so this module owns a SINGLE haze
 * shell at 64×48 segments — smooth even filling the canopy at HOLD; (2)
 * body.group's quaternion set ONCE at init so the texture pole axis points
 * perpendicular to BEARING instead of world-up — the seam sits at the limb,
 * never dead-centre in the approach view.
 */
import * as THREE from 'three';
import { damp } from '../core/damp.js';
import { createBody, type Body } from '../fx/space/bodies.js';
import { makeRng } from '../fx/space/rng.js';
import type { UniverseRig } from './universeRig.js';
import {
  getAttitudeInverseRef,
  getFlowWRef,
  getFlight,
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

const BAKED_RADIUS = 100; // createBody's own baked sphere radius (radius>=50 → hero detail)
const MIN_TRUE_DIST = 10; // floor so atan() never sees a degenerate 0
const HAZE_SCALE = 1.16; // haze shell radius as a fraction of BAKED_RADIUS

// Bearing well clear of the signature heroes and the hero sun — see header.
const BEARING = new THREE.Vector3(0.1, 0.95, -0.3).normalize();

const HAZE_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;
const HAZE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float ndotv = dot(normalize(vNormal), normalize(vViewDir));
    float rim = clamp(1.0 - abs(ndotv), 0.0, 1.0);
    // Steeper falloff than bodies.ts's own addAtmosphere (2.4) — at HOLD
    // range the disc fills ~65% of vertical FOV, and a shallower power washes
    // teal across most of the visible disc instead of reading as a thin limb
    // glow (found via verify:headed screenshot review).
    float alpha = pow(rim, 4.0) * uIntensity;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), rim * 0.5), alpha);
  }
`;

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

/** Build the destination planet + haze shell, parented under the universe
 *  rig (same place director content lives, so its fixed bearing rotates with
 *  attitude for free). No-op under ?approach=0. */
export function initApproach(rig: UniverseRig, camera: THREE.PerspectiveCamera): void {
  if (APPROACH_DISABLED) return;

  // Own dedicated rng (design-mandated seed) — never touches the director's
  // seeded sequence, so Test 7 / the screenshot baselines are unaffected.
  const rng = makeRng(0xe57a);
  const body = createBody(rng, 'ROCKY', BAKED_RADIUS);
  body.group.name = 'destination-planet';

  // Pole-pinch fix: tilt the body once so its texture pole axis (local +Y)
  // points perpendicular to the approach bearing instead of world-up.
  const poleAxis = new THREE.Vector3().crossVectors(BEARING, new THREE.Vector3(0, 1, 0)).normalize();
  body.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), poleAxis);

  // Facet fix: a dedicated, generously-tessellated haze shell. ROCKY bodies
  // get no built-in atmosphere from createBody, so this is the only one —
  // no fighting with (or being hidden by) bodies.ts's own 28×20-segment shell.
  const hazeGeo = new THREE.SphereGeometry(BAKED_RADIUS * HAZE_SCALE, 64, 48);
  const hazeMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x9fd8c8) },
      uIntensity: { value: 0.55 },
    },
    vertexShader: HAZE_VERT,
    fragmentShader: HAZE_FRAG,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const haze = new THREE.Mesh(hazeGeo, hazeMat);
  haze.name = 'destination-haze';
  body.group.add(haze);

  rig.attach(body.group);
  ctx = { camera, body };
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

  if (assistEngaged) {
    // Virtual closure (the illusion): arrival always ~APPROACH_T_ARRIVE
    // seconds regardless of remaining distance — real speed/flow untouched.
    const targetRate = THREE.MathUtils.clamp(trueDist / APPROACH_T_ARRIVE, APPROACH_SPEED_MIN, APPROACH_SPEED_MAX);
    closingRate = damp(closingRate, targetRate, APPROACH_RATE_LAMBDA, dt);
    trueDist = Math.max(trueDist - closingRate * dt, MIN_TRUE_DIST);
    steerTowardBearing();
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
    if (assistEngaged) disengageAssist(getFlight().helmActive);
    setFlightMode('HOLD');
  } else if (holdEngaged && angularDeg < HOLD_RELEASE_FRAC * HOLD_ANGULAR_FRAC * ctx.camera.fov) {
    holdEngaged = false;
    setFlightMode(getFlight().helmActive ? 'HELM' : 'CRUISE');
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
    setFlightMode('APPROACH');
  }
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
