/**
 * Starfield — NEAR streaming layer (the lane's public entry).
 *
 * v0.4 'Living Cruise' rewrite. This file now builds only the NEAR parallax
 * layer and delegates the streaming shader + per-star colour CDF + twinkle to
 * fx/space/starLayer.ts. The FAR layer is built and ticked by the director.
 *
 * Contract preserved for main.ts (unowned):
 *   buildStarfield():        THREE.Points   — the NEAR layer
 *   tickStarfield(pts, e):   void           — advances twinkle + uScroll
 *   disposeStarfield(pts):   void
 *
 * NEAR layer: 3800 stars (v0.9 density pass) in a slab X[-900,900]
 * Y[-500,500] Z[-900,+900] (v1.1 SOVEREIGN: Z-SYMMETRIZED from [-1400,+400] —
 * the old fore-biased runway was a fixed-+Z optimization that doesn't hold
 * once flow can point anywhere; same span (1800) so density is unchanged),
 * size 0.6-3.4 (magnitude-skewed — few big/bright, many small/dim), streaming
 * along the universe-flow vector so a star at boot flow (0,0,14) takes ~14s
 * to cross from z=-200 to the camera — a majestic capital cruise.
 */

import * as THREE from 'three';
import { buildStarLayer, setStarUniforms, disposeStarLayer } from './space/starLayer.js';
import { getFlowW } from '../flight/flightShim.js'; // LANE-C SHIM — replaced by flightState at merge

// ── Cruise tuning ───────────────────────────────────────────────────────────────

export const SPAN_NEAR = 1800;
/** v1.1 SOVEREIGN: was -1400 (fore-biased); symmetrized to center the slab
 *  on the ship so wrap behaves identically regardless of flow direction. */
export const Z_MIN_NEAR = -900;
/** Boot-equivalence reference value only — no longer drives scroll directly
 *  (getFlowW() does); kept exported since other code may read it. */
export const CRUISE_SPEED_NEAR = 14;

// scroll is advanced from elapsed deltas inside tickStarfield.
let lastElapsed = -1;
/** Accumulated ∫flowW·dt (was a scalar +Z-only accumulator). At boot flowW
 *  is (0,0,14), so the Z component advances identically to the old scalar. */
const scroll = new THREE.Vector3();

/** Build the near streaming starfield layer (one draw call). */
export function buildStarfield(): THREE.Points {
  const stars = buildStarLayer({
    count: 3800,
    xHalf: 900,
    yHalf: 500,
    zMin: Z_MIN_NEAR,
    span: SPAN_NEAR,
    sizeMin: 0.6,
    sizeMax: 3.4,
  });
  stars.name = 'starfield-near';
  return stars;
}

/**
 * Update twinkle time + scroll. Called every frame by main with elapsed seconds.
 * Scroll advances by flowW * dt (was CRUISE_SPEED_NEAR * dt, +Z only); dt is
 * derived from elapsed deltas so the call-site signature (stars, elapsed) is
 * unchanged. With boot flowW=(0,0,14) the Z advance is numerically identical
 * to the old scalar accumulator.
 */
export function tickStarfield(stars: THREE.Points, elapsed: number): void {
  if (lastElapsed < 0) lastElapsed = elapsed;
  const dt = Math.min(Math.max(elapsed - lastElapsed, 0), 0.1);
  lastElapsed = elapsed;
  scroll.addScaledVector(getFlowW(), dt);
  setStarUniforms(stars, elapsed, scroll);
}

/** Dispose a near starfield returned by buildStarfield. */
export function disposeStarfield(stars: THREE.Points): void {
  disposeStarLayer(stars);
  lastElapsed = -1;
  scroll.set(0, 0, 0);
}
