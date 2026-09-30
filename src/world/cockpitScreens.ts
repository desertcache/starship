/**
 * Cockpit live screen canvas animation — split from cockpitConsoles.ts.
 * Exports: makeLiveScreenMat (build), liveScreenTick (per-frame update).
 * v0.6 P2: three differentiated screen types:
 *   LEFT   — scrolling waveform (existing)
 *   CENTER — circular radar/scope sweep (new)
 *   RIGHT  — vertical animated bar-graph (new)
 */
import * as THREE from 'three';
import { seededRng } from './cockpitScreensShared.js';
import type { LiveScreen, ScreenType } from './cockpitScreensShared.js';
export type { ScreenType } from './cockpitScreensShared.js';
import { initBargraphCanvas, tickBargraph } from './cockpitScreensBargraph.js';

const _liveScreens: LiveScreen[] = [];

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
