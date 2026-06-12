/**
 * Procedural CanvasTexture generators for space bodies.
 *
 * Generalises planet.ts's banded-noise approach across body kinds. Each body
 * owns its own CanvasTexture (none shared) so disposal is per-body.
 *
 * All functions return a THREE.CanvasTexture; callers own .dispose().
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';
import type { HueFamily } from './palette.js';

function makeCanvas(size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  return { canvas, ctx };
}

function finalize(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ── Day/night terminator ────────────────────────────────────────────────────────
// Bake a seeded longitudinal lit→dark gradient into the canvas so the
// MeshBasicMaterial bodies read like painted, self-lit planets (No Man's Sky)
// rather than flat unlit spheres. Lit side keeps full brightness; the dark side
// falls to DARK_FLOOR. U wraps around the equator, so a horizontal gradient is a
// real day/night terminator. lightU = seeded sub-solar longitude (0..1).
//
// v0.6 P5 — strengthened: DARK_FLOOR 0.25→0.30, falloff power 0.85→2.2, gradient
// coverage extended so ~45% of the disc is in deep shadow. The steeper power curve
// keeps the lit hemisphere bright while creating a crisp, visible terminator line
// rather than the previous near-uniform tint. Consistent sun direction is implicit
// since lightU is seeded per-body and the gradient is always left→right (U axis).

const DARK_FLOOR = 0.30; // dark side floor (30% brightness — readable shadow)

function applyTerminator(
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
    // cos maps sub-solar (d=0) → lit=1, anti-solar (d=±0.5) → lit=0.
    // Power 2.2 steepens the falloff: lit hemisphere stays near-white until
    // ~35% longitude from the terminator, then drops fast into shadow.
    // This pushes ~45% of the disc below the midpoint for clear shadow coverage.
    const lit = (Math.cos(d * Math.PI * 2) + 1) * 0.5;
    const shade = DARK_FLOOR + (1 - DARK_FLOOR) * Math.pow(lit, 2.2);
    const g = Math.round(shade * 255);
    ctx.fillStyle = `rgb(${g},${g},${g})`;
    ctx.fillRect(x, 0, 1, size);
  }
  ctx.globalCompositeOperation = prevOp;
}

/** Seeded sub-solar longitude (0..1) for one body. */
function seedLightU(rng: Rng): number {
  return rng();
}

// ── Gas giant — wavy sin-noise latitude bands ──────────────────────────────────

/** Banded gas-giant face in a seeded hue family; optional oval great-spot storm. */
export function gasGiantTexture(rng: Rng, family: HueFamily, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const lightU = seedLightU(rng);

  const bg = ctx.createLinearGradient(0, 0, 0, size);
  bg.addColorStop(0, family.base[0]);
  bg.addColorStop(0.5, family.base[1]);
  bg.addColorStop(1, family.base[2]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  const bandCount = rng.int(8, 10);
  for (let i = 0; i < bandCount; i++) {
    const yC = ((i + 0.5) / bandCount) * size;
    const h = (size / bandCount) * rng.range(0.55, 0.95);
    const color = family.bands[i % family.bands.length];
    const phase = rng.range(0, Math.PI * 2);
    const f1 = rng.range(0.025, 0.05);
    const f2 = rng.range(0.008, 0.016);
    const amp = h * 0.28;

    ctx.globalAlpha = rng.range(0.38, 0.6);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, yC - h / 2);
    for (let x = 0; x <= size; x += 4) {
      const n = (Math.sin(x * f1 + phase) + Math.sin(x * f2 + phase * 1.7)) * amp * 0.5;
      ctx.lineTo(x, yC - h / 2 + n);
    }
    for (let x = size; x >= 0; x -= 4) {
      const n = (Math.sin(x * f1 + phase) + Math.sin(x * f2 + phase * 1.7)) * amp * 0.5;
      ctx.lineTo(x, yC + h / 2 + n);
    }
    ctx.closePath();
    ctx.fill();
  }

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
  }

  ctx.globalAlpha = 1;
  applyTerminator(canvas, ctx, lightU);
  return finalize(canvas);
}

// ── Rocky / cratered ───────────────────────────────────────────────────────────

export function rockyTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const lightU = seedLightU(rng);

  const baseShades = ['#6a5a4a', '#776657', '#8a7a66', '#5e5042'];
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, rng.choice(baseShades));
  bg.addColorStop(1, rng.choice(baseShades));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Darker mare patches.
  const mareCount = rng.int(3, 6);
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

  // 18-30 radial-gradient craters.
  const craterCount = rng.int(18, 30);
  for (let i = 0; i < craterCount; i++) {
    const cx = rng() * size;
    const cy = rng() * size;
    const cr = rng.range(0.015, 0.06) * size;
    const a = rng.range(0.2, 0.45);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    grad.addColorStop(0, `rgba(30,24,20,${a})`);
    grad.addColorStop(0.6, `rgba(60,52,44,${a * 0.5})`);
    grad.addColorStop(0.85, `rgba(160,150,138,${a * 0.5})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }

  applyTerminator(canvas, ctx, lightU);
  return finalize(canvas);
}

// ── Ice world ──────────────────────────────────────────────────────────────────

export function iceTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const lightU = seedLightU(rng);

  const bg = ctx.createLinearGradient(0, 0, 0, size);
  bg.addColorStop(0, '#cfe6f2');
  bg.addColorStop(0.5, '#a9cfe0');
  bg.addColorStop(1, '#cfe6f2');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Thin teal-tinted fracture polylines.
  const fractures = rng.int(10, 18);
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

  applyTerminator(canvas, ctx, lightU);
  return finalize(canvas);
}

// ── Lava base (dark) — cracks are a separate overlay texture ───────────────────

export function lavaBaseTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const lightU = seedLightU(rng);
  ctx.fillStyle = '#1C1E22';
  ctx.fillRect(0, 0, size, size);
  // Subtle near-black mottling.
  const blobs = rng.int(6, 12);
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
  applyTerminator(canvas, ctx, lightU);
  return finalize(canvas);
}

/** Transparent crack network in orange (alpha texture for the emissive overlay). */
export function lavaCrackTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  ctx.clearRect(0, 0, size, size);
  ctx.lineCap = 'round';

  const seams = rng.int(8, 14);
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

/** Concentric translucent tan/cream bands+gaps for a ring system. */
export function ringTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  ctx.clearRect(0, 0, size, size);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2;

  const bands = rng.int(14, 22);
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
  return finalize(canvas);
}

// ── Moon (reuse of the v0.3 grey cratered approach) ────────────────────────────

export function moonTexture(rng: Rng, size: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size);
  const lightU = seedLightU(rng);
  // Lift grey base so the lit hemisphere reads bright after the terminator.
  ctx.fillStyle = '#9a9ca2';
  ctx.fillRect(0, 0, size, size);

  const craters = rng.int(6, 12);
  for (let i = 0; i < craters; i++) {
    const cx = rng() * size;
    const cy = rng() * size;
    const cr = rng.range(0.05, 0.14) * size;
    const a = rng.range(0.25, 0.42);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    grad.addColorStop(0, `rgba(40,42,46,${a})`);
    grad.addColorStop(0.6, `rgba(60,62,66,${a * 0.5})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }
  applyTerminator(canvas, ctx, lightU);
  return finalize(canvas);
}
