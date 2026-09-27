/**
 * Gas-giant body texture — domain-warped turbulent latitude bands.
 *
 * Split out of bodyTextures.ts (the turbulence pass pushed that file over
 * the project's line cap). Bands are painted per-pixel via ImageData: a
 * low-frequency fbm warps the latitude coordinate so band boundaries flow
 * and wave instead of sitting on straight lines, and a higher-frequency fbm
 * shades brightness for fine cloud-flow detail — think Jupiter belts/zones,
 * still flat/stylized per the project's comic-industrial look, not PBR.
 *
 * v1.2.1 Lane D (HERO TEXTURE HITCH): the per-pixel loop below measured
 * ~144-224ms at hero size (1024px) — a once-a-minute main-thread stutter a
 * p95 perf gate can't see (ultrareview r2 P3). Split into gasGiantParams()
 * (every rng draw, exactly today's order, storm draws included) + a PURE
 * paintGasGiantRows()/finishGasGiant() pair so bodies.ts can run the params
 * synchronously at spawn (rng sequence untouched) and time-slice the actual
 * painting across frames via heroTextureJobs.ts. gasGiantTexture() below is
 * the original one-shot entry point, unchanged in behaviour, now composed
 * from the same three pieces — every existing caller (destinationVisual.ts's
 * boot-time createBody('ROCKY',...) doesn't call this one, but
 * spawnSignatureHeroes()'s boot-time gas giant does) keeps its exact output.
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

/** Fixed (not seeded) tuning — see the header on why these must never draw
 *  rng: an added draw here shifts every subsequent seeded value for this
 *  body and beyond (names, other bodies' families/positions), breaking
 *  director determinism. */
const WARP_V_SCALE = 1.3;
const BAND_MIX = 0.72; // band colour dominance over the vertical base gradient
const EDGE_FRAC = 0.32; // fraction of each band's height spent blending into the next

/** Optional oval great-spot storm placement (absolute pixel-space, at the
 *  SAME `size` the body was seeded at — see gasGiantParams). */
export interface GasGiantStorm {
  sx: number;
  sy: number;
  sr: number;
  hexAccent: string;
}

/** Every rng-drawn value gasGiantTexture needs, captured up front so the
 *  actual painting (paintGasGiantRows / finishGasGiant) is a pure function
 *  of `size` alone — safe to run now, later, or at a different size (the
 *  placeholder). */
export interface GasGiantParams {
  lightU: number;
  bandCount: number;
  warpGrid: Float32Array;
  warpN: number;
  warpCyclesX: number;
  warpAmp: number;
  flowGrid: Float32Array;
  flowN: number;
  flowCyclesX: number;
  baseStops: RGB[];
  bandCols: RGB[];
  storm: GasGiantStorm | null;
}

/**
 * Draw every rng value gasGiantTexture depends on, IN TODAY'S EXACT ORDER —
 * including the great-spot storm's draws, which today happen textually AFTER
 * the pixel loop. Moving them earlier in program order is safe (the pixel
 * loop itself never draws rng), so the rng SEQUENCE this produces is
 * byte-identical to calling gasGiantTexture() directly.
 */
export function gasGiantParams(
  rng: Rng,
  family: HueFamily,
  size: number,
  pinnedLightU?: number,
): GasGiantParams {
  const lightU = pinnedLightU !== undefined ? pinnedLightU : seedLightU(rng);
  const hero = size >= 512;

  const baseStops = family.base.map(hexToRgb);
  const bandCols = family.bands.map(hexToRgb);
  const bandCount = rng.int(7, 10);

  const warpN = 20;
  const flowN = hero ? 56 : 40;
  const warpGrid = makeNoiseGrid(rng, warpN);
  const flowGrid = makeNoiseGrid(rng, flowN);
  const warpCyclesX = rng.int(2, 3);
  const flowCyclesX = rng.int(10, 16);
  const warpAmp = rng.range(0.015, 0.03);

  // 40% chance: oval great-spot storm in the accent colour. The check ITSELF
  // always draws one rng value regardless of outcome — preserve that even
  // though the paint (finishGasGiant) runs later.
  let storm: GasGiantStorm | null = null;
  if (rng() < 0.4) {
    const sx = rng.range(0.35, 0.75) * size;
    const sy = rng.range(0.35, 0.65) * size;
    const sr = rng.range(0.05, 0.09) * size;
    storm = { sx, sy, sr, hexAccent: `#${family.accent.toString(16).padStart(6, '0')}` };
  }

  return {
    lightU, bandCount, warpGrid, warpN, warpCyclesX, warpAmp,
    flowGrid, flowN, flowCyclesX, baseStops, bandCols, storm,
  };
}

/**
 * PURE — paint rows [y0,y1) of a `size`×`size` RGBA buffer from already-drawn
 * `p`. No rng, no canvas calls: safe to call once for the whole image or in
 * row chunks spread across frames (heroTextureJobs.ts).
 */
export function paintGasGiantRows(data: Uint8ClampedArray, size: number, p: GasGiantParams, y0: number, y1: number): void {
  for (let y = y0; y < y1; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;

      const warp = fbmWrap(p.warpGrid, p.warpN, u, v, p.warpCyclesX, WARP_V_SCALE, 2);
      const vw = Math.min(0.999, Math.max(0, v + warp * p.warpAmp));

      const bandPos = vw * p.bandCount;
      const bi = Math.floor(bandPos);
      const frac = bandPos - bi;
      const g = Math.min(1, Math.max(0, (frac - (1 - EDGE_FRAC)) / EDGE_FRAC));
      const t = g * g * (3 - 2 * g);
      const c0 = p.bandCols[((bi % p.bandCols.length) + p.bandCols.length) % p.bandCols.length];
      const c1 = p.bandCols[(((bi + 1) % p.bandCols.length) + p.bandCols.length) % p.bandCols.length];
      const band = lerpRgb(c0, c1, t);
      const base = baseColorAt(p.baseStops, vw);

      const flow = fbmWrap(p.flowGrid, p.flowN, u, v, p.flowCyclesX, p.flowCyclesX * 1.6, 3);
      const shade = 1 + flow * 0.14;

      const idx = (y * size + x) * 4;
      data[idx] = clampByte((base.r + (band.r - base.r) * BAND_MIX) * shade);
      data[idx + 1] = clampByte((base.g + (band.g - base.g) * BAND_MIX) * shade);
      data[idx + 2] = clampByte((base.b + (band.b - base.b) * BAND_MIX) * shade);
      data[idx + 3] = 255;
    }
  }
}

/**
 * PURE tail — MUST run after paintGasGiantRows has covered the whole image
 * AND that image has been committed via ctx.putImageData (storm/limb/
 * terminator all paint ON TOP of the canvas's current pixels; putImageData
 * is a raw replace, so painting these before it would erase them). Cheap
 * (bounded native canvas calls), so unlike the main loop this never needs
 * chunking. `stormScale` rescales the storm's absolute sx/sy/sr — 1 (default)
 * for the real body (params were drawn at this exact `canvas` size, matching
 * today's code bit-for-bit); the placeholder passes placeholderSize/texSize
 * since it paints the SAME params onto a smaller canvas (see
 * placeholderGasGiantTexture) — a placeholder-only rescale, never applied to
 * the byte-identical final texture.
 */
export function finishGasGiant(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  p: GasGiantParams,
  stormScale = 1,
): THREE.CanvasTexture {
  if (p.storm) {
    const sx = p.storm.sx * stormScale;
    const sy = p.storm.sy * stormScale;
    const sr = p.storm.sr * stormScale;
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
    grad.addColorStop(0, p.storm.hexAccent);
    grad.addColorStop(0.55, p.storm.hexAccent);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(sx, sy, sr, sr * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  applyLimbDarkening(canvas, ctx, 0.4);
  applyTerminator(canvas, ctx, p.lightU);
  return finalize(canvas);
}

/**
 * Turbulent gas-giant face in a seeded hue family; optional oval great-spot
 * storm. `pinnedLightU` overrides the seeded terminator direction — pass
 * 0.25 to lock the sub-solar point at the left quarter of the disc for
 * signature-cast bodies (see director.ts / cast.ts). One-shot synchronous
 * entry point — byte-identical to before the phase split (see header).
 */
export function gasGiantTexture(
  rng: Rng,
  family: HueFamily,
  size: number,
  pinnedLightU?: number,
): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const p = gasGiantParams(rng, family, size, pinnedLightU);
  const img = ctx.createImageData(size, size);
  paintGasGiantRows(img.data, size, p, 0, size);
  ctx.putImageData(img, 0, 0);
  return finishGasGiant(canvas, ctx, p);
}

/**
 * Cheap immediate preview at PLACEHOLDER_SIZE — the SAME pure paint math as
 * the final texture, run at a small size from the SAME drawn `p` (zero extra
 * rng draws). Never compared for byte-identity (that's the final texture's
 * job); this is what a body shows while its real job runs.
 */
export function placeholderGasGiantTexture(p: GasGiantParams, size: number, fullSize: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const img = ctx.createImageData(size, size);
  paintGasGiantRows(img.data, size, p, 0, size);
  ctx.putImageData(img, 0, 0);
  return finishGasGiant(canvas, ctx, p, size / fullSize);
}
