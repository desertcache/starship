import { seededRng } from './cockpitScreensShared.js';
import type { LiveScreen } from './cockpitScreensShared.js';

// ── Bar-graph screen ───────────────────────────────────────────────────────────

export function initBargraphCanvas(canvas: HTMLCanvasElement, ls: LiveScreen): void {
  const ctx = canvas.getContext('2d')!;
  const W = canvas.width;
  const H = canvas.height;

  // 7 animated bars: hull, eng, nav, atm, pwr, shld, fuel
  const rand = seededRng(808);
  ls.bars = Array.from({ length: 7 }, () => 0.55 + rand() * 0.4);

  ctx.fillStyle = '#060a08';
  ctx.fillRect(0, 0, W, H);
}

const BAR_LABELS = ['HULL', 'ENG', 'NAV', 'ATM', 'PWR', 'SHLD', 'FUEL'];
const BAR_COLORS = [
  'rgba(70,224,216,0.9)',   // teal
  'rgba(255,160,60,0.85)',  // amber — ENG
  'rgba(70,224,216,0.9)',
  'rgba(70,224,216,0.9)',
  'rgba(255,200,60,0.85)',  // yellow — PWR
  'rgba(70,224,216,0.9)',
  'rgba(120,220,120,0.85)', // green — FUEL
];

export function tickBargraph(ls: LiveScreen): void {
  const { canvas, ctx } = ls;
  const W = canvas.width;
  const H = canvas.height;

  ctx.fillStyle = '#060a08';
  ctx.fillRect(0, 0, W, H);

  // Faint grid
  ctx.strokeStyle = 'rgba(70,224,216,0.08)';
  ctx.lineWidth = 0.5;
  for (let y = H * 0.1; y < H * 0.85; y += (H * 0.75) / 4) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  const n = ls.bars.length;
  const PAD_X = 6;
  const CHART_W = W - PAD_X * 2;
  const BAR_W = Math.floor((CHART_W / n) * 0.6);
  const GAP   = Math.floor((CHART_W / n) * 0.4);
  const CHART_TOP = H * 0.08;
  const CHART_BOT = H * 0.82;
  const CHART_H = CHART_BOT - CHART_TOP;

  for (let i = 0; i < n; i++) {
    // Drift bars slowly
    ls.bars[i] = Math.max(0.1, Math.min(1.0,
      ls.bars[i] + (Math.random() - 0.5) * 0.04,
    ));

    const x = PAD_X + i * (BAR_W + GAP);
    const barH = ls.bars[i] * CHART_H;
    const y = CHART_BOT - barH;

    // Bar background track
    ctx.fillStyle = 'rgba(70,224,216,0.08)';
    ctx.fillRect(x, CHART_TOP, BAR_W, CHART_H);

    // Bar fill — gradient from bottom
    const barGrad = ctx.createLinearGradient(0, CHART_BOT, 0, y);
    barGrad.addColorStop(0, BAR_COLORS[i]);
    barGrad.addColorStop(1, 'rgba(70,224,216,0.3)');
    ctx.fillStyle = barGrad;
    ctx.fillRect(x, y, BAR_W, barH);

    // Top cap highlight
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(x, y, BAR_W, 2);

    // Label
    ctx.fillStyle = 'rgba(70,224,216,0.65)';
    ctx.font = '7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(BAR_LABELS[i], x + BAR_W / 2, H - 4);
    ctx.textAlign = 'left';

    // Value pct
    const pct = Math.round(ls.bars[i] * 100);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${pct}`, x + BAR_W / 2, y - 2);
    ctx.textAlign = 'left';
  }

  // Title strip
  ctx.fillStyle = 'rgba(70,224,216,0.5)';
  ctx.font = '9px monospace';
  ctx.fillText('SYS STATUS', 4, H * 0.06);
}
