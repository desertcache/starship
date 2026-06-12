/**
 * Stage D panel surface detail helpers — split from texturesPanels.ts.
 * Grime streak bleed and recessed inset-rectangle detail.
 * Consumed exclusively by texturesPanels.ts.
 */
import { SEAM_PX, BOLT_INSET } from './texturesPanelsShared.js';
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
  const TW = ctx.canvas.width;
  const TH = ctx.canvas.height;

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

  for (const sx of xSeams) {
    for (const sy of ySeams) {
      if (rand() > 0.55) continue;
      const streakLen = 30 + rand() * 90;
      const streakW   = 3 + rand() * 6;
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
        const sl = 20 + rand() * 50;
        const sw = 2 + rand() * 4;
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
    const margin = SEAM_PX + 10;
    const ix = p.x + margin;
    const iy = p.y + margin;
    const iw = p.w - margin * 2;
    const ih = p.h - margin * 2;
    if (iw < 20 || ih < 20) continue;
    ctx.strokeStyle = 'rgba(0,0,0,0.40)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(ix, iy, iw, ih);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(ix + 2, iy + 2, iw - 4, ih - 4);
  }
}
