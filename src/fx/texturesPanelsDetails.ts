/**
 * Stage D panel surface detail helpers — split from texturesPanels.ts.
 * Grime streak bleed, recessed inset-rectangle detail, accent panel fill
 * (vent slats / wear scratches), and the bottom scuff band. Consumed
 * exclusively by texturesPanels.ts.
 *
 * v0.9 A2: literal px constants (streak length/width, inset margin, vent
 * slot size, scuff ellipse/scratch dims) doubled to match the 2x panel
 * canvas (texturesPanelsShared.ts) so these details keep their physical
 * size. drawGrimeStreaks/drawInsetDetail read TW/TH from ctx.canvas so they
 * already reflect the doubled resolution automatically; drawScuffBand uses
 * the shared TW/TH/SCUFF_PX constants directly (moved here from
 * texturesPanels.ts to keep that file under the 300-line limit).
 */
import { SEAM_PX, BOLT_INSET, TW, TH, SCUFF_PX, ORANGE_HEX, GUN_HEX } from './texturesPanelsShared.js';
import type { PanelRect } from './texturesPanelsShared.js';

/**
 * Draw faint vertical grime streaks bleeding down from seam intersections
 * and below bolt positions — Stage D surface amplitude boost.
 */
export function drawGrimeStreaks(
  ctx: CanvasRenderingContext2D,
  panels: PanelRect[],
  rand: () => number,
): void {
  const canvasW = ctx.canvas.width;
  const canvasH = ctx.canvas.height;

  const xSeams = new Set<number>();
  const ySeams = new Set<number>();
  for (const p of panels) {
    if (p.x > 0) xSeams.add(p.x);
    if (p.y > 0) ySeams.add(p.y);
    xSeams.add(p.x + p.w);
    ySeams.add(p.y + p.h);
  }
  xSeams.delete(canvasW);
  ySeams.delete(canvasH);

  for (const sx of xSeams) {
    for (const sy of ySeams) {
      if (rand() > 0.55) continue;
      const streakLen = 60 + rand() * 180;  // v0.9 A2: doubled from 30+90
      const streakW   = 6 + rand() * 12;    // v0.9 A2: doubled from 3+6
      const alpha     = 0.07 + rand() * 0.10;
      const grad = ctx.createLinearGradient(sx, sy, sx, sy + streakLen);
      grad.addColorStop(0,   `rgba(8,6,4,${alpha.toFixed(3)})`);
      grad.addColorStop(0.6, `rgba(8,6,4,${(alpha * 0.4).toFixed(3)})`);
      grad.addColorStop(1,   'rgba(8,6,4,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(sx - streakW / 2, sy, streakW, streakLen);
    }
    // Streaks below bolt positions at this seam X
    for (const p of panels) {
      if (p.x !== sx && p.x + p.w !== sx) continue;
      for (const by of [p.y + BOLT_INSET, p.y + p.h - BOLT_INSET]) {
        if (rand() > 0.40) continue;
        const sl = 40 + rand() * 100; // v0.9 A2: doubled from 20+50
        const sw = 4 + rand() * 8;    // v0.9 A2: doubled from 2+4
        const a  = 0.05 + rand() * 0.08;
        const g2 = ctx.createLinearGradient(sx, by, sx, by + sl);
        g2.addColorStop(0, `rgba(8,6,4,${a.toFixed(3)})`);
        g2.addColorStop(1, 'rgba(8,6,4,0)');
        ctx.fillStyle = g2;
        ctx.fillRect(sx - sw / 2, by, sw, sl);
      }
    }
  }
}

/**
 * Draw recessed inner-rectangle inset detail on ~15% of panels — Stage D.
 * Double-line: outer dark border + inner light bevel highlight.
 */
export function drawInsetDetail(
  ctx: CanvasRenderingContext2D,
  panels: PanelRect[],
  rand: () => number,
): void {
  for (const p of panels) {
    if (rand() > 0.15) continue;
    const margin = SEAM_PX + 20; // v0.9 A2: doubled the +10 additive term
    const ix = p.x + margin;
    const iy = p.y + margin;
    const iw = p.w - margin * 2;
    const ih = p.h - margin * 2;
    if (iw < 40 || ih < 40) continue; // v0.9 A2: doubled min-size guard
    ctx.strokeStyle = 'rgba(0,0,0,0.40)';
    ctx.lineWidth = 3;
    ctx.strokeRect(ix, iy, iw, ih);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2;
    ctx.strokeRect(ix + 4, iy + 4, iw - 8, ih - 8);
  }
}

// ── Accent panel fill (vents, wear, gunmetal) ───────────────────────────────────
// v0.9 A2: moved here from texturesPanels.ts (file was over the 300-line
// limit); literal px constants doubled alongside SEAM_PX so panel insets,
// vent slots, and scratch marks keep their physical size.

function fillPanel(ctx: CanvasRenderingContext2D, p: PanelRect, color: string): void {
  const inset = Math.ceil(SEAM_PX / 2) + 2;
  ctx.fillStyle = color;
  ctx.fillRect(p.x + inset, p.y + inset, p.w - inset * 2, p.h - inset * 2);
}

// Exported: also called directly by texturesPanels.ts's orange waist-band fill.
export function drawVentSlats(ctx: CanvasRenderingContext2D, p: PanelRect, rand: () => number): void {
  const nSlats = 5 + Math.floor(rand() * 3);
  const inset  = Math.ceil(SEAM_PX / 2) + 8;
  const panelH = p.h - inset * 2;
  const step   = panelH / (nSlats + 1);
  const slotH  = 8;
  const slotW  = Math.max(40, p.w - inset * 4);
  const slotX  = p.x + inset + (p.w - inset * 2 - slotW) / 2;
  for (let i = 1; i <= nSlats; i++) {
    const sy = p.y + inset + step * i - slotH / 2;
    ctx.fillStyle = 'rgba(10,8,5,0.88)';
    ctx.fillRect(slotX, sy, slotW, slotH);
    ctx.fillStyle = 'rgba(255,220,180,0.22)';
    ctx.fillRect(slotX, sy, slotW, 2);
  }
}

function drawWearScratches(ctx: CanvasRenderingContext2D, p: PanelRect, rand: () => number): void {
  const n = 3 + Math.floor(rand() * 4);
  for (let i = 0; i < n; i++) {
    const x0 = p.x + rand() * p.w;
    const y0 = p.y + rand() * p.h;
    const len = 12 + rand() * 40;
    const a = (rand() - 0.5) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + Math.cos(a) * len, y0 + Math.sin(a) * len);
    ctx.strokeStyle = `rgba(255,200,150,${(0.15 + rand() * 0.15).toFixed(3)})`;
    ctx.lineWidth = 1 + rand() * 1;
    ctx.stroke();
  }
}

export function drawAccentPanels(
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
// v0.9 A2: scuff ellipse/scratch dimensions doubled to keep physical size
// (SCUFF_PX band height already auto-scales via MPY).
export function drawScuffBand(ctx: CanvasRenderingContext2D, rand: () => number): void {
  const bandY = TH - SCUFF_PX;
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, bandY, TW, SCUFF_PX);
  for (let i = 0; i < 28; i++) {
    const x = rand() * TW;
    const y = bandY + rand() * SCUFF_PX;
    ctx.beginPath();
    ctx.ellipse(x, y, 20 + rand() * 80, 6 + rand() * 24, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${(0.06 + rand() * 0.10).toFixed(3)})`;
    ctx.fill();
  }
  for (let i = 0; i < 18; i++) {
    const y = bandY + rand() * SCUFF_PX;
    ctx.beginPath();
    ctx.moveTo(rand() * TW, y);
    ctx.lineTo(rand() * TW, y + (rand() - 0.5) * 8);
    ctx.strokeStyle = `rgba(0,0,0,${(0.06 + rand() * 0.08).toFixed(3)})`;
    ctx.lineWidth = 2 + rand() * 4;
    ctx.stroke();
  }
}
