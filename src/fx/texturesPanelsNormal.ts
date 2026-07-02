/**
 * Panel normal map generation — lane B1 Surfaces (split from texturesPanels.ts).
 * Builds a Sobel-derived normal map matching the panel grid geometry.
 * Exported: makeWallNormalMapTexture()
 */
import * as THREE from 'three';
import { rng, cached } from './textureHelpers.js';
import { buildPanelGrid, TW, TH, SEAM_PX, SEAM_CORE_PX, BOLT_INSET, BOLT_R } from './texturesPanelsShared.js';

// ── Height canvas ──────────────────────────────────────────────────────────────

/**
 * Build a height-map canvas for the panel normal map.
 * Panel face = 0.5 grey, seam floor dark, bevel ramps, bolt bumps.
 */
function buildHeightCanvas(panels: ReturnType<typeof buildPanelGrid>): HTMLCanvasElement {
  const hc = document.createElement('canvas');
  hc.width  = TW;
  hc.height = TH;
  const hx  = hc.getContext('2d')!;

  hx.fillStyle = '#808080'; // panel face neutral
  hx.fillRect(0, 0, TW, TH);

  const half = Math.floor(SEAM_PX / 2);

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

  // Stage D: stronger seam depth to match wider seams.
  // v0.9 A2: bevel ramp width doubled (2px→4px) to match doubled SEAM_PX.
  const bevelW = 4;
  for (const sx of xSeams) {
    const x0 = sx - half;
    // Deep core channel
    hx.fillStyle = 'rgba(10,10,10,1)';
    hx.fillRect(x0 + bevelW, 0, SEAM_CORE_PX, TH);
    // Bevel ramps — wider for stronger normal relief
    hx.fillStyle = 'rgba(60,60,60,1)';
    hx.fillRect(x0, 0, bevelW, TH);
    hx.fillStyle = 'rgba(55,55,55,1)';
    hx.fillRect(x0 + SEAM_PX - bevelW, 0, bevelW, TH);
  }
  for (const sy of ySeams) {
    const y0 = sy - half;
    hx.fillStyle = 'rgba(10,10,10,1)';
    hx.fillRect(0, y0 + bevelW, TW, SEAM_CORE_PX);
    hx.fillStyle = 'rgba(60,60,60,1)';
    hx.fillRect(0, y0, TW, bevelW);
    hx.fillStyle = 'rgba(55,55,55,1)';
    hx.fillRect(0, y0 + SEAM_PX - bevelW, TW, bevelW);
  }

  // Stage D: larger bolt bumps to match BOLT_R=9 (now 18 post-v0.9 A2 doubling).
  for (const p of panels) {
    for (const [bx, by] of [
      [p.x + BOLT_INSET,       p.y + BOLT_INSET],
      [p.x + p.w - BOLT_INSET, p.y + BOLT_INSET],
      [p.x + BOLT_INSET,       p.y + p.h - BOLT_INSET],
      [p.x + p.w - BOLT_INSET, p.y + p.h - BOLT_INSET],
    ] as [number, number][]) {
      if (bx < SEAM_PX || bx > TW - SEAM_PX || by < SEAM_PX || by > TH - SEAM_PX) continue;
      const g = hx.createRadialGradient(bx, by, 0, bx, by, BOLT_R + 8);
      g.addColorStop(0,   'rgba(235,235,235,1)');
      g.addColorStop(0.5, 'rgba(165,165,165,0.9)');
      g.addColorStop(1,   'rgba(128,128,128,0)');
      hx.beginPath();
      hx.arc(bx, by, BOLT_R + 8, 0, Math.PI * 2);
      hx.fillStyle = g;
      hx.fill();
    }
  }

  return hc;
}

// ── Sobel normal map ───────────────────────────────────────────────────────────

/** Convert height-map canvas to a normal map canvas via 3×3 Sobel filter. */
function sobelToNormal(heightCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const W = heightCanvas.width;
  const H = heightCanvas.height;
  const hx = heightCanvas.getContext('2d')!;
  const hData = hx.getImageData(0, 0, W, H).data;

  const nc  = document.createElement('canvas');
  nc.width  = W;
  nc.height = H;
  const nx  = nc.getContext('2d')!;
  const nImg = nx.createImageData(W, H);
  const nd   = nImg.data;

  function getH(x: number, y: number): number {
    const cx = Math.max(0, Math.min(W - 1, x));
    const cy = Math.max(0, Math.min(H - 1, y));
    return hData[(cy * W + cx) * 4] / 255;
  }

  // Stage D: stronger Sobel scale for deeper seam/bolt relief.
  // v0.9 A2: doubled 6.5→13.0. The Sobel kernel differentiates over a fixed
  // 1-texel stencil; at 2x canvas density the same physical bevel now ramps
  // across ~2x more texels, so the per-texel height gradient (and thus the
  // raw normal strength) would roughly halve unless compensated here.
  const scale = 13.0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = (
        -getH(x-1,y-1) - 2*getH(x-1,y) - getH(x-1,y+1)
        +getH(x+1,y-1) + 2*getH(x+1,y) + getH(x+1,y+1)
      );
      const dy = (
        -getH(x-1,y-1) - 2*getH(x,y-1) - getH(x+1,y-1)
        +getH(x-1,y+1) + 2*getH(x,y+1) + getH(x+1,y+1)
      );
      const nx2 = -dx * scale;
      const ny2 = -dy * scale;
      const nz2 = 1.0;
      const len = Math.sqrt(nx2*nx2 + ny2*ny2 + nz2*nz2);
      const idx = (y * W + x) * 4;
      nd[idx]   = Math.round(((nx2/len) * 0.5 + 0.5) * 255);
      nd[idx+1] = Math.round(((ny2/len) * 0.5 + 0.5) * 255);
      nd[idx+2] = Math.round(((nz2/len) * 0.5 + 0.5) * 255);
      nd[idx+3] = 255;
    }
  }

  nx.putImageData(nImg, 0, 0);
  return nc;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Normal map matching the cream panel texture.
 * Derived from a height canvas via Sobel filter.
 * Wire as material.normalMap with normalScale (0.35, 0.35).
 */
export function makeWallNormalMapTexture(): THREE.CanvasTexture {
  return cached('wall-normal-map-v4', () => {
    const rand = rng(37);
    const panels = buildPanelGrid(rand);
    const heightCanvas = buildHeightCanvas(panels);
    const normalCanvas = sobelToNormal(heightCanvas);

    const tex = new THREE.CanvasTexture(normalCanvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  });
}
