/**
 * Modular metal panel textures — lane B1 Surfaces.
 *
 * Canvas tile: 1024×1536 px representing 2 m wide × 3 m tall.
 * tileW=2, tileH=3 — used with world-aligned UVs so the grid is continuous.
 *
 * Exports (consumed by textures.ts which re-exports to shipMaterials.ts):
 *   makeCreamWallTexture()        — standard light cream panel wall
 *   makeCreamOrangeBandTexture()  — same panel system + orange waist band
 *
 * Normal map: see texturesPanelsNormal.ts → makeWallNormalMapTexture()
 */
import * as THREE from 'three';
import { rng, addGrime, cached } from './textureHelpers.js';
import {
  TW, TH, MPY, SCUFF_PX, SEAM_PX, SEAM_CORE_PX, BOLT_INSET, BOLT_R,
  buildPanelGrid,
} from './texturesPanelsShared.js';
import type { PanelRect } from './texturesPanelsShared.js';

export { makeWallNormalMapTexture } from './texturesPanelsNormal.js';

const ORANGE_HEX = '#C7641E';
const GUN_HEX    = '#2A2D33';

// ── Seam drawing ───────────────────────────────────────────────────────────────

function drawRecessed(ctx: CanvasRenderingContext2D, panels: PanelRect[]): void {
  const xSeams = new Set<number>();
  const ySeams = new Set<number>();
  for (const p of panels) {
    if (p.x > 0) xSeams.add(p.x);
    if (p.y > 0) ySeams.add(p.y);
    xSeams.add(p.x + p.w);
    ySeams.add(p.y + p.h);
  }
  xSeams.delete(TW);
  ySeams.delete(TH);

  const half = Math.floor(SEAM_PX / 2);

  for (const sx of xSeams) {
    const x0 = sx - half;
    ctx.fillStyle = 'rgba(12,9,6,0.85)';
    ctx.fillRect(x0 + 1, 0, SEAM_CORE_PX, TH);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(x0, 0, 1, TH);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(x0 + SEAM_PX - 1, 0, 1, TH);
  }
  for (const sy of ySeams) {
    const y0 = sy - half;
    ctx.fillStyle = 'rgba(12,9,6,0.85)';
    ctx.fillRect(0, y0 + 1, TW, SEAM_CORE_PX);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(0, y0, TW, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, y0 + SEAM_PX - 1, TW, 1);
  }
}

// ── Corner bolts ───────────────────────────────────────────────────────────────

function drawBolts(ctx: CanvasRenderingContext2D, panels: PanelRect[]): void {
  for (const p of panels) {
    for (const [bx, by] of [
      [p.x + BOLT_INSET,       p.y + BOLT_INSET],
      [p.x + p.w - BOLT_INSET, p.y + BOLT_INSET],
      [p.x + BOLT_INSET,       p.y + p.h - BOLT_INSET],
      [p.x + p.w - BOLT_INSET, p.y + p.h - BOLT_INSET],
    ] as [number, number][]) {
      if (bx < SEAM_PX || bx > TW - SEAM_PX || by < SEAM_PX || by > TH - SEAM_PX) continue;
      const g = ctx.createRadialGradient(bx - 1, by - 1, 0, bx, by, BOLT_R);
      g.addColorStop(0,   'rgba(200,195,185,0.9)');
      g.addColorStop(0.5, 'rgba(140,135,125,0.8)');
      g.addColorStop(1,   'rgba(60,55,50,0.7)');
      ctx.beginPath();
      ctx.arc(bx, by, BOLT_R, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx, by, BOLT_R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}

// ── Accent panels ─────────────────────────────────────────────────────────────

function fillPanel(ctx: CanvasRenderingContext2D, p: PanelRect, color: string): void {
  const inset = Math.ceil(SEAM_PX / 2) + 1;
  ctx.fillStyle = color;
  ctx.fillRect(p.x + inset, p.y + inset, p.w - inset * 2, p.h - inset * 2);
}

function drawVentSlats(ctx: CanvasRenderingContext2D, p: PanelRect, rand: () => number): void {
  const nSlats = 5 + Math.floor(rand() * 3);
  const inset  = Math.ceil(SEAM_PX / 2) + 4;
  const panelH = p.h - inset * 2;
  const step   = panelH / (nSlats + 1);
  const slotH  = 4;
  const slotW  = Math.max(20, p.w - inset * 4);
  const slotX  = p.x + inset + (p.w - inset * 2 - slotW) / 2;
  for (let i = 1; i <= nSlats; i++) {
    const sy = p.y + inset + step * i - slotH / 2;
    ctx.fillStyle = 'rgba(10,8,5,0.88)';
    ctx.fillRect(slotX, sy, slotW, slotH);
    ctx.fillStyle = 'rgba(255,220,180,0.22)';
    ctx.fillRect(slotX, sy, slotW, 1);
  }
}

function drawWearScratches(ctx: CanvasRenderingContext2D, p: PanelRect, rand: () => number): void {
  const n = 3 + Math.floor(rand() * 4);
  for (let i = 0; i < n; i++) {
    const x0 = p.x + rand() * p.w;
    const y0 = p.y + rand() * p.h;
    const len = 6 + rand() * 20;
    const a = (rand() - 0.5) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + Math.cos(a) * len, y0 + Math.sin(a) * len);
    ctx.strokeStyle = `rgba(255,200,150,${(0.15 + rand() * 0.15).toFixed(3)})`;
    ctx.lineWidth = 0.5 + rand() * 0.5;
    ctx.stroke();
  }
}

function drawAccentPanels(
  ctx: CanvasRenderingContext2D,
  panels: PanelRect[],
  rand: () => number,
): void {
  for (const p of panels) {
    const r = rand();
    if (r < 0.08) {
      fillPanel(ctx, p, ORANGE_HEX);
      drawVentSlats(ctx, p, rand);
      drawWearScratches(ctx, p, rand);
    } else if (r < 0.12) {
      fillPanel(ctx, p, GUN_HEX);
    }
  }
}

// ── Scuff band ─────────────────────────────────────────────────────────────────

function drawScuffBand(ctx: CanvasRenderingContext2D, rand: () => number): void {
  const bandY = TH - SCUFF_PX;
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, bandY, TW, SCUFF_PX);
  for (let i = 0; i < 28; i++) {
    const x = rand() * TW;
    const y = bandY + rand() * SCUFF_PX;
    ctx.beginPath();
    ctx.ellipse(x, y, 10 + rand() * 40, 3 + rand() * 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${(0.06 + rand() * 0.10).toFixed(3)})`;
    ctx.fill();
  }
  for (let i = 0; i < 18; i++) {
    const y = bandY + rand() * SCUFF_PX;
    ctx.beginPath();
    ctx.moveTo(rand() * TW, y);
    ctx.lineTo(rand() * TW, y + (rand() - 0.5) * 4);
    ctx.strokeStyle = `rgba(0,0,0,${(0.06 + rand() * 0.08).toFixed(3)})`;
    ctx.lineWidth = 1 + rand() * 2;
    ctx.stroke();
  }
}

// ── Per-panel cream fill ───────────────────────────────────────────────────────

function fillCreamPanels(
  ctx: CanvasRenderingContext2D,
  panels: PanelRect[],
  rand: () => number,
  baseL = 198,
): void {
  ctx.fillStyle = `rgb(${baseL},${baseL - 6},${baseL - 17})`;
  ctx.fillRect(0, 0, TW, TH);
  const inset = Math.ceil(SEAM_PX / 2) + 1;
  for (const p of panels) {
    const jitter = (rand() - 0.5) * 0.10 * 255;
    const l  = Math.round(Math.max(150, Math.min(220, baseL + jitter)));
    const r2 = l;
    const g2 = Math.round(Math.max(140, Math.min(210, l - 6)));
    const b2 = Math.round(Math.max(125, Math.min(200, l - 17)));
    const px = p.x + inset; const py = p.y + inset;
    const pw = p.w - inset * 2; const ph = p.h - inset * 2;
    if (pw <= 0 || ph <= 0) continue;
    const grad = ctx.createLinearGradient(px, py, px, py + ph);
    grad.addColorStop(0, `rgb(${Math.min(255,r2+8)},${Math.min(255,g2+8)},${Math.min(255,b2+8)})`);
    grad.addColorStop(1, `rgb(${r2},${g2},${b2})`);
    ctx.fillStyle = grad;
    ctx.fillRect(px, py, pw, ph);
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────

/** Standard cream modular panel wall texture (2 m × 3 m tile). */
export function makeCreamWallTexture(): THREE.CanvasTexture {
  return cached('cream-wall-v2', () => {
    const canvas = document.createElement('canvas');
    canvas.width  = TW; canvas.height = TH;
    const ctx  = canvas.getContext('2d')!;
    const rand = rng(37);
    const panels = buildPanelGrid(rand);
    fillCreamPanels(ctx, panels, rand);
    drawAccentPanels(ctx, panels, rng(71));
    drawRecessed(ctx, panels);
    drawBolts(ctx, panels);
    addGrime(ctx, TW, TH, 7, 0.12);
    drawScuffBand(ctx, rng(199));
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  });
}

/**
 * Cream wall with burnt-orange waist-band identity.
 * Same panel system; orange band row at waist height (0.7–1.1 m from floor).
 */
export function makeCreamOrangeBandTexture(): THREE.CanvasTexture {
  return cached('cream-orange-band-v2', () => {
    const canvas = document.createElement('canvas');
    canvas.width  = TW; canvas.height = TH;
    const ctx  = canvas.getContext('2d')!;
    const rand = rng(53);
    const panels = buildPanelGrid(rand);
    fillCreamPanels(ctx, panels, rand);

    // Tint waist-band panels (y 0.7–1.1 m from bottom, canvas Y inverted)
    const bandBotPx = TH - Math.round((1.1 / 3) * TH);
    const bandTopPx = TH - Math.round((0.7 / 3) * TH);
    const inset     = Math.ceil(SEAM_PX / 2) + 1;
    for (const p of panels) {
      const cY = p.y + p.h / 2;
      if (cY >= bandBotPx && cY <= bandTopPx) {
        ctx.fillStyle = ORANGE_HEX;
        ctx.fillRect(p.x + inset, p.y + inset, p.w - inset * 2, p.h - inset * 2);
        drawVentSlats(ctx, p, rng(p.x + p.y));
      }
    }

    drawAccentPanels(ctx, panels, rng(83));
    drawRecessed(ctx, panels);
    drawBolts(ctx, panels);
    addGrime(ctx, TW, TH, 13, 0.12);
    drawScuffBand(ctx, rng(211));
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  });
}

// suppress unused import warning for MPY (used only in shared)
void MPY;
