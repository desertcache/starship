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
 * NEAR layer: 2200 stars in a slab X[-900,900] Y[-500,500] Z[-1400,+400],
 * size 1.0-2.6, brighter, streaming toward +Z (aft) at CRUISE_SPEED_NEAR so a
 * star at z=-200 passes the camera in ~14s — a majestic capital cruise.
 */

import * as THREE from 'three';
import { buildStarLayer, setStarUniforms, disposeStarLayer } from './space/starLayer.js';

// ── Cruise tuning ───────────────────────────────────────────────────────────────

export const SPAN_NEAR = 1800;
export const Z_MIN_NEAR = -1400;
/** A star at z=-200 takes ~14s to reach the camera (majestic, not warp). */
export const CRUISE_SPEED_NEAR = 14;

// uScroll is advanced from elapsed deltas inside tickStarfield.
let lastElapsed = -1;
let scroll = 0;

/** Build the near streaming starfield layer (one draw call). */
export function buildStarfield(): THREE.Points {
  const stars = buildStarLayer({
    count: 2200,
    xHalf: 900,
    yHalf: 500,
    zMin: Z_MIN_NEAR,
    span: SPAN_NEAR,
    sizeMin: 1.0,
    sizeMax: 2.6,
  });
  stars.name = 'starfield-near';
  return stars;
}

/**
 * Update twinkle time + scroll. Called every frame by main with elapsed seconds.
 * Scroll advances by CRUISE_SPEED_NEAR * dt; dt is derived from elapsed deltas so
 * the call-site signature (stars, elapsed) is unchanged.
 */
export function tickStarfield(stars: THREE.Points, elapsed: number): void {
  if (lastElapsed < 0) lastElapsed = elapsed;
  const dt = Math.min(Math.max(elapsed - lastElapsed, 0), 0.1);
  lastElapsed = elapsed;
  scroll += CRUISE_SPEED_NEAR * dt;
  setStarUniforms(stars, elapsed, scroll);
}

/** Dispose a near starfield returned by buildStarfield. */
export function disposeStarfield(stars: THREE.Points): void {
  disposeStarLayer(stars);
  lastElapsed = -1;
  scroll = 0;
}
