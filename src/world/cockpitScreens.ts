/**
 * Cockpit live screen canvas animation — split from cockpitConsoles.ts.
 * Exports: makeLiveScreenMat (build), liveScreenTick (per-frame update).
 * v0.6 P2: three differentiated screen types:
 *   LEFT   — scrolling waveform (existing)
 *   CENTER — circular radar/scope sweep (new)
 *   RIGHT  — vertical animated bar-graph (new)
 */
import * as THREE from 'three';

// ── Live screen type tag ───────────────────────────────────────────────────────

export type ScreenType = 'waveform' | 'radar' | 'bargraph';

// ── Live screen state ──────────────────────────────────────────────────────────

interface LiveScreen {
  type:    ScreenType;
  texture: THREE.CanvasTexture;
  canvas:  HTMLCanvasElement;
  ctx:     CanvasRenderingContext2D;
  lastPwr: number;
  cursor:  boolean;
  frame:   number;
  // radar state
  sweepAngle: number;
  blips: Array<{ a: number; r: number; age: number }>;
  // bargraph state
  bars: number[];
}

const _liveScreens: LiveScreen[] = [];

// ── Seeded PRNG (local, avoids import of textureHelpers) ──────────────────────
function seededRng(seed: number): () => number {
  let s = seed;
  return (): number => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// ── Waveform screen ────────────────────────────────────────────────────────────

function initWaveformCanvas(canvas: HTMLCanvasElement): void {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#050810';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(70,224,216,0.15)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 16) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 16) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(70,224,216,0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.4);
  for (let x = 0; x <= W; x += 2) {
    ctx.lineTo(x, H * 0.4 + (Math.random() - 0.5) * 20);
  }
  ctx.stroke();
}

function tickWaveform(ls: LiveScreen): void {
  const { canvas, ctx } = ls;
  const W = canvas.width;
  const H = canvas.height;

  const stripH = Math.floor(H * 0.55);
  const stripY = Math.floor(H * 0.1);
  ctx.drawImage(canvas, -4, 0);

  ctx.fillStyle = '#050810';
  ctx.fillRect(W - 4, stripY, 4, stripH);

  ctx.strokeStyle = 'rgba(70,224,216,0.85)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const midY = stripY + stripH * 0.45;
  ctx.moveTo(W - 4, midY + (Math.random() - 0.5) * 18);
  ctx.lineTo(W, midY + (Math.random() - 0.5) * 18);
  ctx.stroke();

  const BAR_Y = H - 20;
  ctx.fillStyle = '#050810';
  ctx.fillRect(0, BAR_Y, W, 20);

  ls.lastPwr = 91 + ((ls.lastPwr - 91 + 1) % 6);
  const cursorChar = ls.cursor ? '_' : ' ';
  ls.cursor = !ls.cursor;
  ctx.fillStyle = 'rgba(70,224,216,0.85)';
  ctx.font = '10px monospace';
  ctx.fillText(`PWR ${ls.lastPwr}%  NAV OK  ${cursorChar}`, 4, H - 5);
}

// ── Radar sweep screen ─────────────────────────────────────────────────────────

function initRadarCanvas(canvas: HTMLCanvasElement, ls: LiveScreen): void {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#020c0b';
  ctx.fillRect(0, 0, W, H);

  // Seed some blips at random angles/radii
  const rand = seededRng(707);
  ls.blips = [];
  for (let i = 0; i < 6; i++) {
    ls.blips.push({
      a: rand() * Math.PI * 2,
      r: 0.15 + rand() * 0.75,
      age: rand() * 60,
    });
  }
  ls.sweepAngle = 0;
}

function tickRadar(ls: LiveScreen): void {
  const { canvas, ctx } = ls;
  const W = canvas.width;
  const H = canvas.height;
  const cx = W * 0.5;
  const cy = H * 0.52;
  const R  = Math.min(W, H) * 0.42;

  // Fade trail
  ctx.fillStyle = 'rgba(2,12,11,0.18)';
  ctx.fillRect(0, 0, W, H);

  // Grid rings
  ctx.strokeStyle = 'rgba(70,224,216,0.12)';
  ctx.lineWidth = 0.8;
  for (const frac of [0.33, 0.66, 1.0]) {
    ctx.beginPath();
    ctx.arc(cx, cy, R * frac, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Cross hairs
  ctx.beginPath();
  ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
  ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
  ctx.stroke();

  // Sweep wedge
  ls.sweepAngle = (ls.sweepAngle + 0.06) % (Math.PI * 2);
  const grad = ctx.createConicGradient
    ? ctx.createConicGradient(ls.sweepAngle - 0.5, cx, cy)
    : null;

  if (grad) {
    grad.addColorStop(0, 'rgba(70,224,216,0.0)');
    grad.addColorStop(1, 'rgba(70,224,216,0.35)');
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, ls.sweepAngle - 0.5, ls.sweepAngle, false);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  } else {
    // Fallback: bright sweep line only
    ctx.save();
    ctx.strokeStyle = 'rgba(70,224,216,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(ls.sweepAngle) * R,
      cy + Math.sin(ls.sweepAngle) * R,
    );
    ctx.stroke();
    ctx.restore();
  }

  // Sweep line always drawn sharp on top
  ctx.save();
  ctx.strokeStyle = 'rgba(70,224,216,0.9)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx + Math.cos(ls.sweepAngle) * R,
    cy + Math.sin(ls.sweepAngle) * R,
  );
  ctx.stroke();
  ctx.restore();

  // Blips — age them, brighten when recently swept
  for (const b of ls.blips) {
    b.age++;
    const bx = cx + Math.cos(b.a) * R * b.r;
    const by = cy + Math.sin(b.a) * R * b.r;
    // Sweep hits blip when sweepAngle ~= b.a mod 2π
    const angleDiff = Math.abs(((ls.sweepAngle - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
    if (angleDiff < 0.12) b.age = 0;
    const brightness = Math.max(0, 1 - b.age / 50);
    if (brightness > 0.05) {
      ctx.beginPath();
      ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(70,224,216,${(brightness * 0.9).toFixed(2)})`;
      ctx.fill();
    }
  }

  // Label strip
  ctx.fillStyle = '#020c0b';
  ctx.fillRect(0, H - 18, W, 18);
  ctx.fillStyle = 'rgba(70,224,216,0.7)';
  ctx.font = '9px monospace';
  ctx.fillText('RADAR — 500 km', 4, H - 4);
}

// ── Bar-graph screen ───────────────────────────────────────────────────────────

function initBargraphCanvas(canvas: HTMLCanvasElement, ls: LiveScreen): void {
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

function tickBargraph(ls: LiveScreen): void {
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

// ── Factory ────────────────────────────────────────────────────────────────────

function makeLiveScreenTexture(type: ScreenType): THREE.CanvasTexture {
  const W = 256;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;

  const tex = new THREE.CanvasTexture(canvas);
  const ls: LiveScreen = {
    type,
    texture: tex,
    canvas,
    ctx: canvas.getContext('2d')!,
    lastPwr: 94,
    cursor: false,
    frame: 0,
    sweepAngle: 0,
    blips: [],
    bars: [],
  };
  _liveScreens.push(ls);

  if (type === 'waveform') initWaveformCanvas(canvas);
  if (type === 'radar')    { initRadarCanvas(canvas, ls); tickRadar(ls); }
  if (type === 'bargraph') { initBargraphCanvas(canvas, ls); tickBargraph(ls); }

  return tex;
}

/** Create a MeshBasicMaterial with a specific screen type. */
export function makeLiveScreenMat(type: ScreenType = 'waveform'): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    map: makeLiveScreenTexture(type),
    side: THREE.FrontSide,
  });
}

/** Called each frame with elapsed time in ms. Updates live screen canvases. */
export function liveScreenTick(elapsed: number): void {
  const frameGate = Math.floor(elapsed / (1000 / 60));
  for (const ls of _liveScreens) {
    if (frameGate % 8 !== ls.frame % 8) continue;
    ls.frame++;

    if (ls.type === 'waveform') tickWaveform(ls);
    if (ls.type === 'radar')    tickRadar(ls);
    if (ls.type === 'bargraph') tickBargraph(ls);

    ls.texture.needsUpdate = true;
  }
}
