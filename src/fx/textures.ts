/**
 * Procedural structural surface textures — Phase 3.
 * Covers: cream wall panels, orange-band wall, gunmetal floor, gunmetal ceiling.
 * Emissive + accent textures: see texturesEmissive.ts
 * All CanvasTexture, 512–1024 px, generated once and cached.
 */
import * as THREE from 'three';
import { PAL, rng, addGrime, drawSeams, cached } from './textureHelpers.js';

// Re-export palette so consumers can reference it
export { PAL } from './textureHelpers.js';

/**
 * Cream wall panel texture (#E8E2D4) with dark seam grid + grime/scuff.
 * 1024×1024. Set material repeat = (wallWidthInMeters, wallHeightInMeters)
 * so 1 seam panel ≈ 0.5 m of wall surface.
 */
export function makeCreamWallTexture(): THREE.CanvasTexture {
  return cached('cream-wall', () => {
    const S = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = PAL.cream;
    ctx.fillRect(0, 0, S, S);

    // Subtle lighter vertical band variation
    const bandRand = rng(42);
    for (let x = 0; x < S; x += 128) {
      const v = (bandRand() - 0.5) * 10;
      ctx.fillStyle = `rgba(255,255,255,${(Math.abs(v) * 0.003).toFixed(4)})`;
      ctx.fillRect(x, 0, 128, S);
    }

    // Seam grid: 256 px = 4 panels per tile; tiled at repeat(W,H) → 1 panel ≈ 0.5 m
    drawSeams(ctx, S, S, 256, 256);
    addGrime(ctx, S, S, 7, 0.22);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
}

/**
 * Cream wall with burnt-orange (#C7641E) horizontal waist-height band.
 * Band occupies lower 30% of texture height. Same seam grid + grime.
 * Set repeat = (wallWidth, 1) to keep the band proportion correct.
 */
export function makeCreamOrangeBandTexture(): THREE.CanvasTexture {
  return cached('cream-orange-band', () => {
    const W = 1024;
    const H = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Upper 70% cream
    ctx.fillStyle = PAL.cream;
    ctx.fillRect(0, 0, W, H);

    // Lower 30% orange band
    const bandTop = Math.floor(H * 0.70);
    ctx.fillStyle = PAL.orange;
    ctx.fillRect(0, bandTop, W, H - bandTop);

    // Thin dark stripe at band boundary
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, bandTop - 2, W, 4);

    drawSeams(ctx, W, H, 256, 256, 'rgba(20,10,0,0.50)', 2);
    addGrime(ctx, W, H, 13, 0.20);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
}

/**
 * Gunmetal floor texture (#1C1E22) with wear highlights and scuffs.
 * 512×512.
 */
export function makeGunmetalFloorTexture(): THREE.CanvasTexture {
  return cached('gunmetal-floor', () => {
    const S = 512;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = PAL.gunmetal;
    ctx.fillRect(0, 0, S, S);

    // Subtle tile grid
    drawSeams(ctx, S, S, 128, 128, 'rgba(255,255,255,0.06)', 1);

    // Light-coloured wear scratches
    const rand = rng(99);
    for (let i = 0; i < 60; i++) {
      const x0 = rand() * S;
      const y0 = rand() * S;
      const len = 8 + rand() * 40;
      const angle = rand() * Math.PI;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + Math.cos(angle) * len, y0 + Math.sin(angle) * len);
      ctx.strokeStyle = `rgba(200,200,220,${(0.04 + rand() * 0.08).toFixed(3)})`;
      ctx.lineWidth = 0.5 + rand();
      ctx.stroke();
    }

    addGrime(ctx, S, S, 55, 0.12);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
}

/**
 * Floor roughness variation map — streaky worn-deck variation.
 * Encodes roughness in the red channel: bright = rough (0.55-0.6),
 * dark = smooth (0.28-0.35), producing light-panel reflections as worn streaks.
 * 512×512, grayscale.
 */
export function makeFloorRoughnessMapTexture(): THREE.CanvasTexture {
  return cached('floor-roughness-map', () => {
    const S = 512;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    // Base: mid roughness (~0.50 in linear → #80 grey)
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, S, S);

    const rand = rng(42);

    // Long worn streaks along the walk path (vertical in texture = fore-aft on floor)
    // Smooth streaks: dark value = lower roughness = specular gloss
    const streakCount = 18;
    for (let i = 0; i < streakCount; i++) {
      const x = rand() * S;
      const w = 4 + rand() * 22;
      const len = S * (0.4 + rand() * 0.6);
      const yStart = rand() * S;
      // Smooth centre (low roughness = dark = ~0x48)
      const smoothVal = Math.floor(0x40 + rand() * 0x28);
      const grad = ctx.createLinearGradient(x - w, yStart, x + w, yStart);
      grad.addColorStop(0, '#808080');
      grad.addColorStop(0.3, `rgb(${smoothVal},${smoothVal},${smoothVal})`);
      grad.addColorStop(0.5, `rgb(${smoothVal},${smoothVal},${smoothVal})`);
      grad.addColorStop(0.7, `rgb(${smoothVal},${smoothVal},${smoothVal})`);
      grad.addColorStop(1, '#808080');
      ctx.fillStyle = grad;
      ctx.fillRect(x - w, yStart, w * 2, len);
    }

    // Rough patches (scuffs / scratches — raised roughness = bright = ~0xB0)
    const scuffCount = 35;
    for (let i = 0; i < scuffCount; i++) {
      const x = rand() * S;
      const y = rand() * S;
      const r = 3 + rand() * 14;
      const roughVal = Math.floor(0x90 + rand() * 0x30);
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.3 + rand() * 0.4), rand() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${roughVal},${roughVal},${roughVal},0.6)`;
      ctx.fill();
    }

    // Tile seam lines — slightly rough edges
    for (let x = 128; x < S; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, S);
      ctx.strokeStyle = 'rgba(160,160,160,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    for (let y = 128; y < S; y += 128) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(S, y);
      ctx.strokeStyle = 'rgba(160,160,160,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
}

/**
 * Gunmetal ceiling texture (#25282e) — slightly lighter than floor,
 * with a rectangular panel grid and alternating inset highlights.
 * 512×512.
 */
export function makeGunmetalCeilingTexture(): THREE.CanvasTexture {
  return cached('gunmetal-ceiling', () => {
    const S = 512;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    // v0.6 P1: ceiling base darkened to reduce secondary uplight bounce off ceiling
    ctx.fillStyle = '#1a1c20';
    ctx.fillRect(0, 0, S, S);

    drawSeams(ctx, S, S, 128, 128, 'rgba(0,0,0,0.6)', 2);

    // Alternating inset lighter panels
    const rand = rng(77);
    for (let gy = 0; gy < 4; gy++) {
      for (let gx = 0; gx < 4; gx++) {
        if ((gx + gy) % 2 === 0) {
          const v = (rand() * 0.04 + 0.02).toFixed(3);
          ctx.fillStyle = `rgba(255,255,255,${v})`;
          ctx.fillRect(gx * 128 + 4, gy * 128 + 4, 120, 120);
        }
      }
    }

    addGrime(ctx, S, S, 33, 0.08);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
}
