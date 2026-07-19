/**
 * src/fx/landfall/heightField.ts — v1.2 LANDFALL Stage 2: the ONE closure that
 * drives everything about the streamed surface (mesh displacement, analytic
 * groundHeight, vertex color, vertex normal). Same "one analytic evaluation
 * feeds both the mesh AND the collision clamp" design as fx/terrain.ts, just
 * unbounded (infinite integer-lattice hash instead of a fixed toroidal grid)
 * so it can be sampled continuously across a km-scale streamed world without
 * a wrap seam.
 *
 * Determinism: every noise sample below is a PURE function of (x, z, seed) —
 * no Math.random, no cached mutable grid, nothing time-based. Two chunks that
 * both sample the same world (x,z) — whether they're neighbours built in the
 * same frame or the same chunk rebuilt a hundred frames later — get bit-for-
 * bit identical height/normal/color. That is what makes chunk borders seam-
 * free "by construction" and what makes the verify screenshot-determinism
 * gate (two `npm run verify` runs, same PNG hash) possible at all.
 */
import * as THREE from 'three';
import { PAD_FLAT_INNER, PAD_FLAT_OUTER } from '../../flight/landfallTuning.js';

/** Per-biome terrain shaping knobs (biomes.ts's BiomePreset.terrain). */
export interface BiomeTerrain {
  /** Vertical scale, meters. */
  maxHeight: number;
  /** fbm octave-0 wavelength, meters (~400 for ROCKY). */
  baseWavelength: number;
  /** 0..1 blend toward the ridged (mesa) shape. */
  ridgeWeight: number;
  colorRamp: { low: string; mid: string; high: string };
}

export interface HeightField {
  /** Analytic ground height at world (x,z). Same eval the mesh displaces by. */
  height(x: number, z: number): number;
  /** 0..1 ramp position for vertex-color lookup, given a precomputed h. */
  colorT(x: number, z: number, h: number): number;
  /** Central-difference surface normal at (x,z), written into `out`. */
  normal(x: number, z: number, out: THREE.Vector3): THREE.Vector3;
}

const FBM_OCTAVES = 5;
const LACUNARITY = 2;
// Gain 0.68 (not the "textbook" 0.5): at gain 0.5 the sum of octave amplitudes
// (1 + .5 + .25 + .125 + .0625 = 1.9375) gives the 25m-wavelength top octave
// only ~3.2% of the normalized signal — from eye height, within a single
// ~100m view, that's not enough high-frequency energy to read as relief at
// all (art-gate round 1: verified numerically, a 100x80m box around the hero
// camera spanned under 1m of height). 0.68 (sum 2.669) roughly triples that
// top-octave share to ~8%, which is what actually shows up as near-field
// bumps rather than only kilometer-scale swells.
const GAIN = 0.68;
const MASK_WAVELENGTH = 1600; // very-low-freq plains/highlands alternation
// Amplitude-mask floor: 0.5 (not the original 0.35) — combined with the
// higher gain above, a floor much lower than this let "low mask" stretches
// read as near-flat even with the bigger maxHeight (biomes.ts's ROCKY is 60).
const MASK_FLOOR = 0.5;
// Color normalization ceiling: colorT divides by maxHeight * this factor
// (not maxHeight alone). shaped01 and mask both hitting ~1 at the SAME point
// is rare, so normalizing by the literal theoretical max compresses nearly
// every real sample into the ramp's low-mid band ("every pixel is the same
// mid-brown" — art-gate round 1). 0.78 widens the mapping so the ramp's low
// and high stops actually get reached across a normal play area.
const COLOR_NORM = 0.78;
const NORMAL_EPS = 1.5; // meters, central-difference step

// Mesa terracing (orchestrator round-3 art fix): soft value-noise fbm reads as
// SAND DUNES no matter how tall it gets — the ROCKY character comes from
// quantizing height into strata steps (flat bench, soft riser, repeat), the
// classic mesa/badlands profile. Pure function of h, so mesh/clamp/normals all
// agree; central-difference normals pick the benches up automatically. The
// same terrace fraction drives colorT's strata banding below, which is what
// finally makes the ramp EXPRESS (contour-following color bands).
const TERRACE_STEP = 9; // meters per stratum
const TERRACE_SHARP = 2.4; // pow on the riser — >1 = flat bench, steeper rise
const TERRACE_WEIGHT = 0.55; // blend toward the terraced profile

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Deterministic integer-lattice hash → [-1, 1]. imul/xorshift avalanche
 *  mixing (same family as space/rng.ts's mulberry32 step) so nearby (ix,iz)
 *  produce uncorrelated values; allocation-free.
 *
 * `ix`/`iz` are XORed with a nonzero constant BEFORE the imul term — art-gate
 * round 1 found a real seam sitting exactly on world x=0 (and, by the same
 * mechanism, would show one on z=0 too): `Math.imul(ix, C)` is identically 0
 * whenever ix===0, silently dropping that whole term from the mix. Every fbm
 * octave's lattice cell has an edge at ix=floor(x/wavelength)=0 for ANY
 * wavelength when x=0 exactly — so x=0 is where every octave, the ridge term,
 * and the mask term all simultaneously hit this weakened hash at once,
 * measurably (empirically verified — see the round-1 diagnostic) more erratic
 * against its neighbours than an ordinary lattice line. XORing first means no
 * input value can ever zero out a term. */
function hash2(ix: number, iz: number, seed: number): number {
  let h = (Math.imul(ix ^ 0x8da6b343, 0x27d4eb2d) ^ Math.imul(iz ^ 0xd8163841, 0x165667b1) ^ Math.imul(seed, 0x85ebca6b)) | 0;
  h = Math.imul(h ^ (h >>> 15), 1 | h);
  h = (h ^ (h + Math.imul(h ^ (h >>> 7), 61 | h))) | 0;
  h ^= h >>> 14;
  return ((h >>> 0) / 4294967296) * 2 - 1;
}

/** Smoothstep-interpolated bilinear sample of the infinite hash lattice at a
 *  given wavelength (meters). Continuous everywhere — no tiling, no seam. */
function valueNoise2D(seed: number, x: number, z: number, wavelength: number): number {
  const gx = x / wavelength;
  const gz = z / wavelength;
  const ix0 = Math.floor(gx);
  const iz0 = Math.floor(gz);
  const fx = THREE.MathUtils.smoothstep(gx - ix0, 0, 1);
  const fz = THREE.MathUtils.smoothstep(gz - iz0, 0, 1);
  const v00 = hash2(ix0, iz0, seed);
  const v10 = hash2(ix0 + 1, iz0, seed);
  const v01 = hash2(ix0, iz0 + 1, seed);
  const v11 = hash2(ix0 + 1, iz0 + 1, seed);
  const a = v00 + (v10 - v00) * fx;
  const b = v01 + (v11 - v01) * fx;
  return a + (b - a) * fz;
}

export function makeHeightField(seed: number, terrain: BiomeTerrain): HeightField {
  // 5-octave fbm, lacunarity 2, gain 0.5 — a distinct hash seed per octave
  // (seed + o*7) avoids the low-frequency-corner correlation naive fbm can
  // show where every octave's lattice happens to land on (0,0) at the origin.
  function fbm(x: number, z: number): number {
    let amp = 1;
    let freq = 1;
    let sum = 0;
    let norm = 0;
    for (let o = 0; o < FBM_OCTAVES; o++) {
      sum += valueNoise2D(seed + o * 7, x, z, terrain.baseWavelength / freq) * amp;
      norm += amp;
      amp *= GAIN;
      freq *= LACUNARITY;
    }
    return norm > 0 ? sum / norm : 0; // ~[-1, 1]
  }

  // Raw (unflattened) height: fbm base blended toward a ridged (1-|n|) mesa
  // shape by terrain.ridgeWeight, then multiplied by a very-low-frequency
  // amplitude mask (plains vs highlands alternation) and scaled to maxHeight.
  // Ridge wavelength is deliberately MEDIUM-scale (0.4x base, ~120m for
  // ROCKY's 300m base) — the ridge term is what breaks a 300m-out horizon
  // with mesa silhouettes; a wavelength close to baseWavelength itself barely
  // varies within any single screenshot's field of view (art-gate round 1).
  function rawHeight(x: number, z: number): number {
    const base01 = fbm(x, z) * 0.5 + 0.5; // [0,1]
    const ridgeN = valueNoise2D(seed + 9973, x, z, terrain.baseWavelength * 0.4);
    const ridged01 = 1 - Math.abs(ridgeN); // ridges/mesas at zero-crossings
    const shaped01 = THREE.MathUtils.lerp(base01, ridged01, terrain.ridgeWeight);
    const maskN = valueNoise2D(seed + 31337, x, z, MASK_WAVELENGTH);
    const mask = MASK_FLOOR + (maskN * 0.5 + 0.5) * (1 - MASK_FLOOR);
    const smooth = shaped01 * mask * terrain.maxHeight;

    // Mesa terracing — see the TERRACE_* comment block above.
    const tf = smooth / TERRACE_STEP;
    const bench = Math.floor(tf);
    const riser = Math.pow(tf - bench, TERRACE_SHARP);
    const terraced = (bench + riser) * TERRACE_STEP;
    return THREE.MathUtils.lerp(smooth, terraced, TERRACE_WEIGHT);
  }

  // Pad flattening composed INSIDE height(): a pure function of (x,z), so
  // every caller (mesh build, groundHeight clamp, normal central-difference)
  // sees the exact same flattened surface — no separate "is this the pad"
  // branch anywhere else in the codebase.
  const padH = rawHeight(0, 0);

  function height(x: number, z: number): number {
    const d = Math.hypot(x, z);
    const t = THREE.MathUtils.smoothstep(d, PAD_FLAT_INNER, PAD_FLAT_OUTER);
    return THREE.MathUtils.lerp(padH, rawHeight(x, z), t);
  }

  function colorT(x: number, z: number, h: number): number {
    const base = terrain.maxHeight > 1e-6 ? h / (terrain.maxHeight * COLOR_NORM) : 0;
    // Strata banding: the terrace fraction of THIS height — color follows the
    // benches, so every mesa shows contour bands (the thing that finally makes
    // the ramp express instead of averaging to one mid-brown).
    const strata = ((h / TERRACE_STEP) % 1 - 0.5) * 0.14;
    // Higher-frequency rock-grain perturbation on top.
    const perturb = valueNoise2D(seed + 54321, x, z, 22) * 0.08;
    return clamp01(base + strata + perturb);
  }

  function normal(x: number, z: number, out: THREE.Vector3): THREE.Vector3 {
    const hL = height(x - NORMAL_EPS, z);
    const hR = height(x + NORMAL_EPS, z);
    const hD = height(x, z - NORMAL_EPS);
    const hU = height(x, z + NORMAL_EPS);
    const dx = (hR - hL) / (2 * NORMAL_EPS);
    const dz = (hU - hD) / (2 * NORMAL_EPS);
    return out.set(-dx, 1, -dz).normalize();
  }

  return { height, colorT, normal };
}
