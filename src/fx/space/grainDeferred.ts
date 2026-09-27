/**
 * src/fx/space/grainDeferred.ts — deferred-path entry points for every hero
 * body-texture generator (v1.2.1 Lane D: HERO TEXTURE HITCH).
 *
 * noise.ts's applyGrain (used by rockyTexture/iceTexture/lavaBaseTexture/
 * moonTexture) draws its noise grid from `rng` and THEN runs an O(size²)
 * per-pixel multiply loop — measured ~35-85ms at hero size (1024px), same
 * order of magnitude as giantTexture.ts's own loop. noise.ts isn't a file
 * this lane owns, and applyGrain can't be called at a partial row range, so
 * this file MIRRORS its math (same grid size 40, same cyclesX 6, same
 * octaves 2, same shade formula) split into a params stage (grainParams —
 * draws rng, identical to applyGrain's internal makeNoiseGrid(rng,40) call,
 * at the same point in the sequence) and a pure per-row paint stage
 * (paintGrainRows). If noise.ts's applyGrain ever changes, this must change
 * with it — flagged for the orchestrator; the clean fix is moving this split
 * into noise.ts itself once a lane owns that file.
 *
 * Each generator's rng-consuming "phase 1" (gradient/maria/craters/
 * fractures/blobs — cheap, bounded native canvas calls) already lives in
 * bodyTextures.ts's exported `xxxPhase1` functions; this file's
 * `beginXxxDeferred` wrappers call those, then grainParams, then hand the
 * pure per-row work to heroTextureJobs.ts's row-chunked runner. The gas
 * giant has no grain step (its own per-pixel loop IS the cost), so its
 * wrapper composes giantTexture.ts's params/paint/finish trio instead.
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';
import type { HueFamily } from './palette.js';
import { fbmWrap, makeNoiseGrid } from './noise.js';
import {
  makeCanvas, finalize, applyLimbDarkening, applyTerminator,
  rockyPhase1, icePhase1, lavaBasePhase1, moonPhase1,
  type Phase1Result,
} from './bodyTextures.js';
import {
  gasGiantParams, paintGasGiantRows, finishGasGiant, placeholderGasGiantTexture,
} from './giantTexture.js';
import {
  beginRowPaintJob, PLACEHOLDER_SIZE,
  type HeroTextureJob,
} from './heroTextureJobs.js';

export interface DeferredHeroTexture {
  /** Shown immediately; disposed by the caller once onDone fires. */
  placeholder: THREE.CanvasTexture;
  job: HeroTextureJob;
}

// ── applyGrain mirror (see header) ──────────────────────────────────────────────

interface GrainParams { grid: Float32Array; n: number; cyclesX: number; }

/** Draws the SAME rng as noise.ts applyGrain's internal makeNoiseGrid(rng,40)
 *  call, at the same point in the caller's sequence. */
function grainParams(rng: Rng): GrainParams {
  const n = 40;
  return { grid: makeNoiseGrid(rng, n), n, cyclesX: 6 };
}

function clampByte(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

/** PURE — bit-for-bit identical to one pass of noise.ts applyGrain's loop
 *  body over rows [y0,y1), for the SAME grid/cyclesX/ampColor. No rng. */
function paintGrainRows(data: Uint8ClampedArray, size: number, gp: GrainParams, ampColor: number, y0: number, y1: number): void {
  for (let y = y0; y < y1; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const u = x / size;
      const n1 = fbmWrap(gp.grid, gp.n, u, v, gp.cyclesX, gp.cyclesX, 2);
      const shade = 1 + n1 * ampColor;
      data[idx] = clampByte(data[idx] * shade);
      data[idx + 1] = clampByte(data[idx + 1] * shade);
      data[idx + 2] = clampByte(data[idx + 2] * shade);
    }
  }
}

/** Small immediate preview: a downscale copy of the phase-1-painted (pre-
 *  grain) canvas, then limb+terminator at the small size — cheap, zero extra
 *  rng draws, never compared for byte-identity (see giantTexture.ts's own
 *  placeholder for why that's fine). */
function placeholderFromPhase1(canvas: HTMLCanvasElement, lightU: number, limbFloor: number, size: number): THREE.CanvasTexture {
  const small = makeCanvas(size);
  small.ctx.drawImage(canvas, 0, 0, size, size);
  applyLimbDarkening(small.canvas, small.ctx, limbFloor);
  applyTerminator(small.canvas, small.ctx, lightU);
  return finalize(small.canvas);
}

/** Shared core: phase1 is already painted (immediate); grainParams' rng draw
 *  already happened (immediate, synchronous — see callers below); only the
 *  grain multiply is deferred, then the cheap limb/terminator/finalize tail
 *  runs once painting reaches the bottom row. */
function beginGrainDeferredCore(
  p1: Phase1Result, rng: Rng, ampColor: number, limbFloor: number, size: number,
  onDone: (tex: THREE.CanvasTexture) => void,
): DeferredHeroTexture {
  const placeholder = placeholderFromPhase1(p1.canvas, p1.lightU, limbFloor, PLACEHOLDER_SIZE);
  const gp = grainParams(rng); // rng draw — same position applyGrain's would occupy
  const img = p1.ctx.getImageData(0, 0, size, size); // snapshot of phase-1 pixels
  const job = beginRowPaintJob({
    size,
    paintRows: (y0, y1) => paintGrainRows(img.data, size, gp, ampColor, y0, y1),
    finish: () => {
      p1.ctx.putImageData(img, 0, 0);
      applyLimbDarkening(p1.canvas, p1.ctx, limbFloor);
      applyTerminator(p1.canvas, p1.ctx, p1.lightU);
      return finalize(p1.canvas);
    },
  }, onDone);
  return { placeholder, job };
}

// ── Per-kind deferred entries — ampColor/limbFloor mirror each sync
// wrapper's own applyGrain/applyLimbDarkening call in bodyTextures.ts
// exactly (rockyTexture/iceTexture/lavaBaseTexture/moonTexture). ─────────────────

export function beginRockyDeferred(rng: Rng, size: number, onDone: (tex: THREE.CanvasTexture) => void): DeferredHeroTexture {
  const p1 = rockyPhase1(rng, size);
  return beginGrainDeferredCore(p1, rng, p1.hero ? 0.09 : 0.06, 0.45, size, onDone);
}

export function beginIceDeferred(rng: Rng, size: number, onDone: (tex: THREE.CanvasTexture) => void): DeferredHeroTexture {
  const p1 = icePhase1(rng, size);
  return beginGrainDeferredCore(p1, rng, p1.hero ? 0.07 : 0.05, 0.5, size, onDone);
}

export function beginLavaBaseDeferred(rng: Rng, size: number, onDone: (tex: THREE.CanvasTexture) => void): DeferredHeroTexture {
  const p1 = lavaBasePhase1(rng, size);
  return beginGrainDeferredCore(p1, rng, p1.hero ? 0.12 : 0.08, 0.4, size, onDone);
}

export function beginMoonDeferred(rng: Rng, size: number, onDone: (tex: THREE.CanvasTexture) => void): DeferredHeroTexture {
  const p1 = moonPhase1(rng, size);
  return beginGrainDeferredCore(p1, rng, p1.hero ? 0.06 : 0.04, 0.45, size, onDone);
}

/** Gas giant: no grain step — its OWN per-pixel loop is the cost, already
 *  split in giantTexture.ts. Composed here so bodies.ts has one uniform
 *  `beginXxxDeferred(rng, size, onDone)` shape to call for every kind. */
export function beginGasGiantDeferred(
  rng: Rng, family: HueFamily, size: number, pinnedLightU: number | undefined,
  onDone: (tex: THREE.CanvasTexture) => void,
): DeferredHeroTexture {
  const p = gasGiantParams(rng, family, size, pinnedLightU);
  const placeholder = placeholderGasGiantTexture(p, PLACEHOLDER_SIZE, size);
  const { canvas, ctx } = makeCanvas(size);
  const img = ctx.createImageData(size, size);
  const job = beginRowPaintJob({
    size,
    paintRows: (y0, y1) => paintGasGiantRows(img.data, size, p, y0, y1),
    finish: () => {
      ctx.putImageData(img, 0, 0);
      return finishGasGiant(canvas, ctx, p);
    },
  }, onDone);
  return { placeholder, job };
}
