/**
 * Cockpit live screen canvas animation — split from cockpitConsoles.ts.
 * Exports: makeLiveScreenMat (build), liveScreenTick (per-frame update).
 */
import * as THREE from 'three';

// ── Live screen state ──────────────────────────────────────────────────────────

interface LiveScreen {
  texture: THREE.CanvasTexture;
  canvas:  HTMLCanvasElement;
  ctx:     CanvasRenderingContext2D;
  lastPwr: number;
  cursor:  boolean;
  frame:   number;
}

const _liveScreens: LiveScreen[] = [];

function makeLiveScreenTexture(): THREE.CanvasTexture {
  const W = 256;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#050810';
  ctx.fillRect(0, 0, W, H);

  // Faint teal grid
  ctx.strokeStyle = 'rgba(70,224,216,0.15)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 16) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 16) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Initial waveform
  ctx.strokeStyle = 'rgba(70,224,216,0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.4);
  for (let x = 0; x <= W; x += 2) {
    const y = H * 0.4 + (Math.random() - 0.5) * 20;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  const ls: LiveScreen = { texture: tex, canvas, ctx, lastPwr: 94, cursor: false, frame: 0 };
  _liveScreens.push(ls);
  return tex;
}

/** Create a MeshBasicMaterial with a fresh live screen canvas texture. */
export function makeLiveScreenMat(): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    map: makeLiveScreenTexture(),
    side: THREE.FrontSide,
  });
}

/** Called each frame with elapsed time in ms. Updates live screen canvases. */
export function liveScreenTick(elapsed: number): void {
  const frameGate = Math.floor(elapsed / (1000 / 60));
  for (const ls of _liveScreens) {
    if (frameGate % 8 !== ls.frame % 8) continue;
    ls.frame++;

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

    ls.texture.needsUpdate = true;
  }
}
