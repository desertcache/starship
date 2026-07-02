/**
 * Procedural CanvasTexture generators for rocky/ice/lava/moon/ring bodies.
 * Gas giants live in giantTexture.ts (split out — its turbulence pass pushed
 * this file past the 300-line cap; it re-imports the canvas/terminator/limb
 * helpers below). All functions return a CanvasTexture; caller owns dispose().
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';
import { applyGrain } from './noise.js';

export function makeCanvas(size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  return { canvas, ctx };
}

export function finalize(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Bake a seeded longitudinal lit→dark gradient so MeshBasicMaterial bodies
// read like painted, self-lit planets rather than flat unlit spheres.
// lightU = seeded sub-solar longitude (U wraps around the equator).
const DARK_FLOOR = 0.30; // dark side floor (30% brightness — readable shadow)

export function applyTerminator(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  lightU: number,
): void {
  const size = canvas.width;
  const prevOp = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 1;
  for (let x = 0; x < size; x++) {
    let d = x / size - lightU;
    if (d > 0.5) d -= 1;
    if (d < -0.5) d += 1;
    const lit = (Math.cos(d * Math.PI * 2) + 1) * 0.5;
    const shade = DARK_FLOOR + (1 - DARK_FLOOR) * Math.pow(lit, 2.2);
    const g = Math.round(shade * 255);
    ctx.fillStyle = `rgb(${g},${g},${g})`;
    ctx.fillRect(x, 0, 1, size);
  }
  ctx.globalCompositeOperation = prevOp;
}

/** Seeded sub-solar longitude (0..1) for one body. */
export function seedLightU(rng: Rng): number {
  return rng();
}

// Equirect UV has no real view-dependent limb, so fake it with a latitude
// vignette: brightest at the equator (v=0.5, the usual mid-disc framing),
// darker toward the poles (v=0/1, near the silhouette edge in most views).
// Multiplies on top of the terminator.
export function applyLimbDarkening(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  floor = 0.45,
): void {
  const size = canvas.height;
  const prevOp = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = 'multiply';
  for (let y = 0; y < size; y++) {
    const v = y / size;
    const d = Math.abs(v - 0.5) * 2;
    const shade = 1 - (1 - floor) * Math.pow(d, 1.8);
    const g = Math.round(shade * 255);
    ctx.fillStyle = `rgb(${g},${g},${g})`;
    ctx.fillRect(0, y, size, 1);
  }
  ctx.globalCompositeOperation = prevOp;
}

/** Shared radial-gradient crater painter used by rockyTexture + moonTexture. */
interface CraterStop { stop: number; rgb: string; alphaMul: number; }

function paintCraters(
  ctx: CanvasRenderingContext2D,
  rng: Rng,
  size: number,
  count: number,
  rRange: [number, number],
  aRange: [number, number],
  stops: CraterStop[],
): void {
  for (let i = 0; i < count; i++) {
    const cx = rng() * size;
    const cy = rng() * size;
    const cr = rng.range(rRange[0], rRange[1]) * size;
    const a = rng.range(aRange[0], aRange[1]);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    for (const s of stops) grad.addColorStop(s.stop, `rgba(${s.rgb},${a * s.alphaMul})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Rocky / cratered ───────────────────────────────────────────────────────────

export function rockyTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const lightU = seedLightU(rng);
  const hero = size >= 512;

  const baseShades = ['#6a5a4a', '#776657', '#8a7a66', '#5e5042'];
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, rng.choice(baseShades));
  bg.addColorStop(1, rng.choice(baseShades));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Darker mare patches.
  const mareCount = hero ? rng.int(5, 8) : rng.int(3, 6);
  for (let i = 0; i < mareCount; i++) {
    const mx = rng() * size;
    const my = rng() * size;
    const mr = rng.range(0.08, 0.18) * size;
    const grad = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
    grad.addColorStop(0, 'rgba(40,34,28,0.5)');
    grad.addColorStop(1, 'rgba(40,34,28,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fill();
  }

  const craterCount = hero ? rng.int(32, 48) : rng.int(18, 30);
  paintCraters(ctx, rng, size, craterCount, [0.015, 0.06], [0.2, 0.45], [
    { stop: 0, rgb: '30,24,20', alphaMul: 1 },
    { stop: 0.6, rgb: '60,52,44', alphaMul: 0.5 },
    { stop: 0.85, rgb: '160,150,138', alphaMul: 0.5 },
  ]);

  applyGrain(canvas, ctx, rng, hero ? 0.09 : 0.06);
  applyLimbDarkening(canvas, ctx);
  applyTerminator(canvas, ctx, lightU);
  return finalize(canvas);
}

// ── Ice world ──────────────────────────────────────────────────────────────────

export function iceTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const lightU = seedLightU(rng);
  const hero = size >= 512;

  const bg = ctx.createLinearGradient(0, 0, 0, size);
  bg.addColorStop(0, '#cfe6f2');
  bg.addColorStop(0.5, '#a9cfe0');
  bg.addColorStop(1, '#cfe6f2');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Thin teal-tinted fracture polylines.
  const fractures = hero ? rng.int(16, 26) : rng.int(10, 18);
  ctx.lineCap = 'round';
  for (let i = 0; i < fractures; i++) {
    let x = rng() * size;
    let y = rng() * size;
    const segs = rng.int(3, 7);
    ctx.strokeStyle = rng() < 0.5 ? 'rgba(70,224,216,0.5)' : 'rgba(255,255,255,0.6)';
    ctx.lineWidth = rng.range(0.8, 2.2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < segs; s++) {
      x += rng.signed(size * 0.12);
      y += rng.signed(size * 0.12);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  applyGrain(canvas, ctx, rng, hero ? 0.07 : 0.05);
  applyLimbDarkening(canvas, ctx, 0.5);
  applyTerminator(canvas, ctx, lightU);
  return finalize(canvas);
}

// ── Lava base (dark) — cracks are a separate overlay texture ───────────────────

export function lavaBaseTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const lightU = seedLightU(rng);
  const hero = size >= 512;
  ctx.fillStyle = '#1C1E22';
  ctx.fillRect(0, 0, size, size);
  // Subtle near-black mottling.
  const blobs = hero ? rng.int(10, 16) : rng.int(6, 12);
  for (let i = 0; i < blobs; i++) {
    const bx = rng() * size;
    const by = rng() * size;
    const br = rng.range(0.05, 0.15) * size;
    const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    grad.addColorStop(0, 'rgba(8,8,10,0.6)');
    grad.addColorStop(1, 'rgba(8,8,10,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
  applyGrain(canvas, ctx, rng, hero ? 0.12 : 0.08);
  applyLimbDarkening(canvas, ctx, 0.4);
  applyTerminator(canvas, ctx, lightU);
  return finalize(canvas);
}

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

// ── Ring annulus (alpha texture for the ring plane) ────────────────────────────

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

// ── Moon (reuse of the v0.3 grey cratered approach) ────────────────────────────

export function moonTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const lightU = seedLightU(rng);
  const hero = size >= 512;
  // Lift grey base so the lit hemisphere reads bright after the terminator.
  ctx.fillStyle = '#9a9ca2';
  ctx.fillRect(0, 0, size, size);

  const craters = hero ? rng.int(10, 18) : rng.int(6, 12);
  paintCraters(ctx, rng, size, craters, [0.05, 0.14], [0.25, 0.42], [
    { stop: 0, rgb: '40,42,46', alphaMul: 1 },
    { stop: 0.6, rgb: '60,62,66', alphaMul: 0.5 },
  ]);

  applyGrain(canvas, ctx, rng, hero ? 0.06 : 0.04);
  applyLimbDarkening(canvas, ctx);
  applyTerminator(canvas, ctx, lightU);
  return finalize(canvas);
}
