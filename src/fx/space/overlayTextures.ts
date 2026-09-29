/**
 * Alpha-overlay CanvasTexture generators: the ring annulus + the lava crack
 * network. Split out of bodyTextures.ts (v1.2.1 Lane D: the hero-texture
 * phase-1/phase-2 split pushed that file back up against the 300-line cap).
 *
 * Neither generator here needs the HERO TEXTURE HITCH deferred treatment:
 * ringTexture is always called at a fixed 256px (bodies.ts never asks for it
 * at hero size), and lavaCrackTexture has no per-pixel loop at all (measured
 * ~1-2.5ms at 1024px — see heroTextureJobs.ts's header). Both stay fully
 * synchronous, unchanged from their pre-split behaviour.
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';
import { applyGrain } from './noise.js';
import { makeCanvas, finalize } from './canvasUtil.js';

/** Transparent crack network in orange (alpha texture for the emissive overlay). */
export function lavaCrackTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  ctx.clearRect(0, 0, size, size);
  ctx.lineCap = 'round';
  const hero = size >= 512;

  const seams = hero ? rng.int(12, 20) : rng.int(8, 14);
  for (let i = 0; i < seams; i++) {
    let x = rng() * size;
    let y = rng() * size;
    const segs = rng.int(6, 12);
    ctx.strokeStyle = rng() < 0.5 ? '#C7641E' : '#ff7a2a';
    ctx.lineWidth = rng.range(1.2, 3.5);
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < segs; s++) {
      x += rng.signed(size * 0.1);
      y += rng.signed(size * 0.1);
      ctx.lineTo(x, y);
      // occasional branch
      if (rng() < 0.3) {
        ctx.lineTo(x + rng.signed(size * 0.06), y + rng.signed(size * 0.06));
        ctx.moveTo(x, y);
      }
    }
    ctx.stroke();
  }
  return finalize(canvas);
}

/** Concentric translucent tan/cream bands+gaps + fine grain (Saturn-like). */
export function ringTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  ctx.clearRect(0, 0, size, size);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2;

  const bands = rng.int(16, 26);
  for (let i = 0; i < bands; i++) {
    const r0 = (i / bands) * maxR;
    const r1 = ((i + 1) / bands) * maxR;
    const isGap = rng() < 0.35;
    if (isGap) continue;
    const shade = rng.choice(['#C8894A', '#D4A052', '#E8E2D4', '#b87040']);
    ctx.globalAlpha = rng.range(0.25, 0.7);
    ctx.strokeStyle = shade;
    ctx.lineWidth = (r1 - r0) * 0.9;
    ctx.beginPath();
    ctx.arc(cx, cy, (r0 + r1) / 2, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  applyGrain(canvas, ctx, rng, 0.22, 0.4);
  return finalize(canvas);
}
