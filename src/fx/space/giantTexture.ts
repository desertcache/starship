/**
 * Gas-giant body texture — domain-warped turbulent latitude bands.
 *
 * Split out of bodyTextures.ts (the turbulence pass pushed that file over
 * the project's line cap). Bands are painted per-pixel via ImageData: a
 * low-frequency fbm warps the latitude coordinate so band boundaries flow
 * and wave instead of sitting on straight lines, and a higher-frequency fbm
 * shades brightness for fine cloud-flow detail — think Jupiter belts/zones,
 * still flat/stylized per the project's comic-industrial look, not PBR.
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';
import type { HueFamily } from './palette.js';
import { makeCanvas, finalize, applyTerminator, applyLimbDarkening, seedLightU } from './bodyTextures.js';
import { makeNoiseGrid, fbmWrap, hexToRgb, lerpRgb, type RGB } from './noise.js';

/** 3-stop vertical base gradient colour at (possibly warped) latitude v (0..1). */
function baseColorAt(stops: RGB[], v: number): RGB {
  if (v < 0.5) return lerpRgb(stops[0], stops[1], v / 0.5);
  return lerpRgb(stops[1], stops[2], (v - 0.5) / 0.5);
}

function clampByte(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

/**
 * Turbulent gas-giant face in a seeded hue family; optional oval great-spot
 * storm. `pinnedLightU` overrides the seeded terminator direction — pass
 * 0.25 to lock the sub-solar point at the left quarter of the disc for
 * signature-cast bodies (see director.ts / cast.ts).
 */
export function gasGiantTexture(
  rng: Rng,
  family: HueFamily,
  size: number,
  pinnedLightU?: number,
): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const lightU = pinnedLightU !== undefined ? pinnedLightU : seedLightU(rng);
  const hero = size >= 512;

  const baseStops = family.base.map(hexToRgb);
  const bandCols = family.bands.map(hexToRgb);
  const bandCount = rng.int(7, 10);

  // Domain-warp grid (low-freq — bends band boundaries into flowing waves)
  // + flow grid (higher-freq — fine cloud-flow brightness shading).
  const warpN = 20;
  const flowN = hero ? 56 : 40;
  const warpGrid = makeNoiseGrid(rng, warpN);
  const flowGrid = makeNoiseGrid(rng, flowN);
  const warpCyclesX = rng.int(2, 3);
  const flowCyclesX = rng.int(10, 16);
  const warpAmp = rng.range(0.05, 0.09);
  const bandMix = 0.72; // band colour dominance over the vertical base gradient

  const img = ctx.createImageData(size, size);
  const data = img.data;

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;

      const warp = fbmWrap(warpGrid, warpN, u, v, warpCyclesX, 5, 2);
      const vw = Math.min(0.999, Math.max(0, v + warp * warpAmp));

      const bandPos = vw * bandCount;
      const bi = Math.floor(bandPos);
      const frac = bandPos - bi;
      const t = frac * frac * (3 - 2 * frac);
      const c0 = bandCols[((bi % bandCols.length) + bandCols.length) % bandCols.length];
      const c1 = bandCols[(((bi + 1) % bandCols.length) + bandCols.length) % bandCols.length];
      const band = lerpRgb(c0, c1, t);
      const base = baseColorAt(baseStops, vw);

      const flow = fbmWrap(flowGrid, flowN, u, v, flowCyclesX, flowCyclesX * 1.6, 3);
      const shade = 1 + flow * 0.14;

      const idx = (y * size + x) * 4;
      data[idx] = clampByte((base.r + (band.r - base.r) * bandMix) * shade);
      data[idx + 1] = clampByte((base.g + (band.g - base.g) * bandMix) * shade);
      data[idx + 2] = clampByte((base.b + (band.b - base.b) * bandMix) * shade);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // 40% chance: oval great-spot storm in the accent colour.
  if (rng() < 0.4) {
    const sx = rng.range(0.35, 0.75) * size;
    const sy = rng.range(0.35, 0.65) * size;
    const sr = rng.range(0.05, 0.09) * size;
    const hexAccent = `#${family.accent.toString(16).padStart(6, '0')}`;
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
    grad.addColorStop(0, hexAccent);
    grad.addColorStop(0.55, hexAccent);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(sx, sy, sr, sr * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  applyLimbDarkening(canvas, ctx, 0.4);
  applyTerminator(canvas, ctx, lightU);
  return finalize(canvas);
}
