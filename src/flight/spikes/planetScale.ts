/**
 * src/flight/spikes/planetScale.ts — Stage 0 SPIKE (v1.1 SOVEREIGN, see
 * docs/design-v1.1-sovereign.md §5 Stage 0 and D5).
 *
 * Proves (or disproves) the single-scene fixed-render-distance planet-scaling
 * illusion BEFORE any campaign lane is written: renderDist = min(trueDist,
 * PARK_DIST); while parked (trueDist >= PARK_DIST) renderScale shrinks/grows
 * so the ANGULAR size the camera sees stays EXACTLY what the true distance
 * would give — angular size IS distance. Inside PARK_DIST the body renders
 * 1:1 at its true distance.
 *
 * Active only under ?spike=planet (house pattern, see core/perf.ts /
 * fx/glow.ts) — a no-op import otherwise, byte-identical to today.
 * THROWAWAY: deleted in Stage 4 when flight/approach.ts productionizes this.
 */
import * as THREE from 'three';
import { damp } from '../../core/damp.js';
import { registerCam } from '../../core/cameras.js';
import { createBody, type Body } from '../../fx/space/bodies.js';
import { makeRng } from '../../fx/space/rng.js';

// ── Kill switch (house pattern) ──────────────────────────────────────────────
const _params = new URLSearchParams(
  typeof window !== 'undefined' ? window.location.search : '',
);
export const SPIKE_PLANET_ENABLED: boolean = _params.get('spike') === 'planet';

// ── Spike-only tuning (NOT flightTuning.ts — this whole file is throwaway) ───
const TRUE_RADIUS = 4000; // u — DEST_TRUE_RADIUS (design §9)
const BOOT_TRUE_DIST = 90000; // u — DEST_TRUE_DIST (design §9)
const PARK_DIST = 1500; // u — PARK_DIST (design §9)
const T_ARRIVE = 12; // s — APPROACH_T_ARRIVE, arrival-time-normalized closure
const RATE_MIN = 20; // u/s closure floor
const RATE_MAX = 4000; // u/s closure ceiling
const RATE_LAMBDA = 2; // damp() smoothing applied to the closing rate itself
const HOLD_ANGULAR_FRAC = 0.65; // × vertical FOV — HOLD_ANGULAR_FRAC (design §9)
const MIN_TRUE_DIST = 10; // floor so atan() never sees a degenerate 0
const BAKED_RADIUS = 100; // createBody()'s own baked sphere radius; renderScale is applied via group.scale

// Bearing well clear of the two signature-hero directions from cast.ts
// ((-165,30,-710) ~15° away, (640,30,-120) ~79° away from the naive
// (-0.35,0.25,-0.9) example bearing) — mostly "up", slightly forward-right,
// so the destination planet never shares sky with a signature hero.
const BEARING = new THREE.Vector3(0.1, 0.95, -0.3).normalize();

interface SpikeReport {
  trueDist: number;
  renderDist: number;
  renderScale: number;
  angularDeg: number;
  maxAngErr: number;
  samples: number;
  holdEngaged: boolean;
}

interface SpikeApi {
  setDist(d: number): void;
  getReport(): SpikeReport;
  resume(): void;
}

interface SpikeCtx {
  camera: THREE.PerspectiveCamera;
  body: Body;
}

let ctx: SpikeCtx | null = null;

const state = {
  trueDist: BOOT_TRUE_DIST,
  closingRate: 0,
  running: true,
  renderDist: PARK_DIST,
  renderScale: 0,
  angularDeg: 0,
  maxAngErr: 0,
  samples: 0,
  holdEngaged: false,
};

/** Recompute render position/scale + the angular-size invariant from `state.trueDist`. */
function recompute(): void {
  if (!ctx) return;
  const renderDist = Math.min(state.trueDist, PARK_DIST);
  const renderScale = state.trueDist >= PARK_DIST
    ? TRUE_RADIUS * (PARK_DIST / state.trueDist)
    : TRUE_RADIUS;

  ctx.body.group.position.copy(BEARING).multiplyScalar(renderDist);
  ctx.body.group.scale.setScalar(renderScale / BAKED_RADIUS);

  // Angular-size invariant, radians (design gate: |Δ| < 1e-6 sampled through
  // the whole run) — exact by construction, tracked here to prove it stays so.
  const trueAngular = 2 * Math.atan(TRUE_RADIUS / state.trueDist);
  const renderAngular = 2 * Math.atan(renderScale / renderDist);
  state.maxAngErr = Math.max(state.maxAngErr, Math.abs(trueAngular - renderAngular));
  state.samples += 1;

  state.renderDist = renderDist;
  state.renderScale = renderScale;
  state.angularDeg = THREE.MathUtils.radToDeg(trueAngular);
  state.holdEngaged = state.angularDeg >= HOLD_ANGULAR_FRAC * ctx.camera.fov;
}

/** Build the spike destination planet + its 3 named cams + window.__spike. No-op unless ?spike=planet. */
export function initPlanetScaleSpike(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
  if (!SPIKE_PLANET_ENABLED) return;

  // Fixed seed (independent of the real director's rng — this spike never
  // touches cast.ts, so no draw-order concern here; that's a Stage 4 rule).
  const rng = makeRng(0x50c7e7a);
  const body = createBody(rng, 'GAS_GIANT', BAKED_RADIUS, 1, 0.25); // jade/teal family, clear terminator
  body.group.name = 'spike-destination-planet';
  scene.add(body.group); // the scene, not a starfield layer (frustumCulled default true is fine)

  ctx = { camera, body };
  recompute();

  // All three reference distances (90000 / 9000 / hold-range ~8800) are
  // >= PARK_DIST, so the mesh's RENDERED position never moves off this one
  // parked point — only renderScale changes. That IS the illusion; the three
  // cams differ only in vantage/backoff to frame small vs huge discs well.
  // Shared vantage (confirmed clean of ship structure by inspection — the
  // ship's own hull/mast geometry intrudes on nearby-but-different offsets):
  // all three named cams look at the SAME point. That's not a shortcut, it's
  // the finding — the parked mesh's rendered POSITION never moves while
  // trueDist >= PARK_DIST (90000, 9000, and the ~8800u hold-range are all
  // parked at this one point); only renderScale changes size.
  const lookAt = BEARING.clone().multiplyScalar(PARK_DIST);
  const vantage = new THREE.Vector3(2, 16, 32);
  registerCam('spike-far', vantage, lookAt);
  registerCam('spike-mid', vantage, lookAt);
  registerCam('spike-hold', vantage, lookAt);

  const api: SpikeApi = {
    setDist(d: number): void {
      state.running = false; // pauses the scripted closure
      state.trueDist = Math.max(d, MIN_TRUE_DIST);
      recompute();
    },
    getReport(): SpikeReport {
      return {
        trueDist: state.trueDist,
        renderDist: state.renderDist,
        renderScale: state.renderScale,
        angularDeg: state.angularDeg,
        maxAngErr: state.maxAngErr,
        samples: state.samples,
        holdEngaged: state.holdEngaged,
      };
    },
    resume(): void {
      state.running = true;
    },
  };
  (window as unknown as Record<string, unknown>)['__spike'] = api;
}

/** Advance the scripted arrival-time-normalized approach + self-spin. No-op unless ?spike=planet. */
export function tickPlanetScaleSpike(dt: number): void {
  if (!SPIKE_PLANET_ENABLED || !ctx) return;
  ctx.body.tick(dt); // slow self-rotation, always — reads as a world at HOLD

  if (state.running && !state.holdEngaged) {
    const targetRate = THREE.MathUtils.clamp(state.trueDist / T_ARRIVE, RATE_MIN, RATE_MAX);
    state.closingRate = damp(state.closingRate, targetRate, RATE_LAMBDA, dt);
    state.trueDist = Math.max(state.trueDist - state.closingRate * dt, MIN_TRUE_DIST);
  }
  // else: HOLD — closure clamps to zero, angular size (and holdEngaged) hold steady.

  recompute();
}
