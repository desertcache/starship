/**
 * Lightweight seeded value noise + fbm for procedural surface turbulence.
 *
 * Grids are toroidal (wrap-around indexing) so any fbm sample built from an
 * integer `cyclesX` horizontal frequency tiles seamlessly across a texture's
 * U axis — important since body textures set wrapS = RepeatWrapping and spin
 * about Y (the seam would otherwise show as a hard vertical line).
 */

import type { Rng } from './rng.js';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** Build an n×n grid of random values in [-1, 1]. */
export function makeNoiseGrid(rng: Rng, n: number): Float32Array {
  const g = new Float32Array(n * n);
  for (let i = 0; i < n * n; i++) g[i] = rng() * 2 - 1;
  return g;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Bilinear sample of a toroidal (wrapping) noise grid at fractional grid coords. */
function sampleGrid(grid: Float32Array, n: number, gx: number, gy: number): number {
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gy);
  const fx = smoothstep(gx - x0);
  const fy = smoothstep(gy - y0);
  const x0w = ((x0 % n) + n) % n;
  const x1w = (x0w + 1) % n;
  const y0w = ((y0 % n) + n) % n;
  const y1w = (y0w + 1) % n;
  const v00 = grid[y0w * n + x0w];
  const v10 = grid[y0w * n + x1w];
  const v01 = grid[y1w * n + x0w];
  const v11 = grid[y1w * n + x1w];
  const a = v00 + (v10 - v00) * fx;
  const b = v01 + (v11 - v01) * fx;
  return a + (b - a) * fy;
}

/**
 * Fractal Brownian motion sampled from a toroidal grid. `cyclesX` is the
 * integer number of horizontal repeats across a texture (u in 0..1) at
 * octave 0 — each octave doubles it, which stays an integer, so the result
 * tiles seamlessly along U regardless of octave count. `vScale` sets the
 * vertical frequency (no wrap needed on V — poles aren't a seam). Returns a
 * value in roughly [-1, 1].
 */
export function fbmWrap(
  grid: Float32Array,
  n: number,
  u: number,
  v: number,
  cyclesX: number,
  vScale: number,
  octaves: number,
): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    const gx = u * cyclesX * freq * n;
    const gy = v * vScale * freq * n;
    sum += sampleGrid(grid, n, gx, gy) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return norm > 0 ? sum / norm : 0;
}

/** Parse a '#RRGGBB' string into 0-255 components. */
export function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return { r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) };
}

function clampByte(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

/**
 * Multiply the existing canvas contents by seeded fbm grain — turns flat
 * painted surfaces (craters, ice fractures, lava mottling, ring bands) into
 * something with fine "alive" turbulent detail instead of a clean airbrushed
 * look. Pass `ampAlpha` to also jitter alpha (used for the ring texture);
 * omit it for opaque body textures. Skips fully-transparent pixels so it's
 * cheap on sparse alpha textures like rings.
 */
export function applyGrain(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  rng: Rng,
  ampColor: number,
  ampAlpha?: number,
): void {
  const size = canvas.width;
  const grid = makeNoiseGrid(rng, 40);
  const cyclesX = 6;
  const img = ctx.getImageData(0, 0, size, size);
  const data = img.data;
  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      if (ampAlpha !== undefined && data[idx + 3] === 0) continue;
      const u = x / size;
      const n1 = fbmWrap(grid, 40, u, v, cyclesX, cyclesX, 2);
      const shade = 1 + n1 * ampColor;
      data[idx] = clampByte(data[idx] * shade);
      data[idx + 1] = clampByte(data[idx + 1] * shade);
      data[idx + 2] = clampByte(data[idx + 2] * shade);
      if (ampAlpha !== undefined) {
        data[idx + 3] = clampByte(data[idx + 3] * (1 + n1 * ampAlpha));
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}
