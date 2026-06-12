/**
 * Procedural structural surface textures — Phase 3.
 * Covers: cream wall panels, orange-band wall, gunmetal floor, gunmetal ceiling.
 * Emissive + accent textures: see texturesEmissive.ts
 * All CanvasTexture, 512–1024 px, generated once and cached.
 *
 * v0.8 lane B1: wall textures now delegate to texturesPanels.ts (modular
 * metal panel language).  Floor reworked for 2m×2m plate-grid world UVs.
 * Ceiling texture unchanged.
 */
import * as THREE from 'three';
import { rng, addGrime, cached } from './textureHelpers.js';

// Re-export palette so consumers can reference it
export { PAL } from './textureHelpers.js';

// ── Wall panel textures (delegate to texturesPanels.ts) ───────────────────────

export {
  makeCreamWallTexture,
  makeCreamOrangeBandTexture,
  makeWallNormalMapTexture,
} from './texturesPanels.js';

// ── Floor — 2 m × 2 m plate grid (1024×1024) ──────────────────────────────────

/**
 * Gunmetal floor texture with plate-grid seams, treadplate stamps, and
 * long fore-aft wear streaks.  World UVs tile at 2 m × 2 m; set repeat(1,1).
 * 1024×1024.
 */
export function makeGunmetalFloorTexture(): THREE.CanvasTexture {
  return cached('gunmetal-floor-v2', () => {
    const S  = 1024;
    const canvas = document.createElement('canvas');
    canvas.width  = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    // Base: dark gunmetal #1C1E22
    ctx.fillStyle = '#1C1E22';
    ctx.fillRect(0, 0, S, S);

    // 1 m plate grid → 512 px per plate in a 2 m tile
    const PLATE_PX = 512; // S / 2 plates per tile = 512
    const SEAM_W   = 5;
    const half     = Math.floor(SEAM_W / 2);

    // Draw plate seams with bevel treatment
    for (const positions of [[PLATE_PX]] as number[][]) {
      for (const sp of positions) {
        // Vertical
        ctx.fillStyle = 'rgba(8,7,6,0.9)';
        ctx.fillRect(sp - half + 1, 0, SEAM_W - 2, S);
        ctx.fillStyle = 'rgba(255,255,255,0.07)';
        ctx.fillRect(sp - half, 0, 1, S);
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(sp - half + SEAM_W - 1, 0, 1, S);
        // Horizontal
        ctx.fillStyle = 'rgba(8,7,6,0.9)';
        ctx.fillRect(0, sp - half + 1, S, SEAM_W - 2);
        ctx.fillStyle = 'rgba(255,255,255,0.07)';
        ctx.fillRect(0, sp - half, S, 1);
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(0, sp - half + SEAM_W - 1, S, 1);
      }
    }

    // Treadplate oval stamps on alternating plates
    const rand = rng(88);
    const plateOffsets: [number, number][] = [
      [0, 0], [PLATE_PX, PLATE_PX],   // diagonal alternating
    ];
    for (const [ox, oy] of plateOffsets) {
      const stampCount = 6;
      for (let i = 0; i < stampCount; i++) {
        const cx = ox + 40 + rand() * (PLATE_PX - 80);
        const cy = oy + 40 + rand() * (PLATE_PX - 80);
        const rw = 12 + rand() * 18;
        const rh = 5 + rand() * 8;
        const angle = rand() * Math.PI;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rw, rh, angle, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(80,85,90,0.55)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Inner raised oval (slightly lighter)
        ctx.beginPath();
        ctx.ellipse(cx, cy, rw - 3, rh - 1.5, angle, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fill();
      }
    }

    // Long fore-aft wear streaks (vertical = fore-aft direction)
    const streakRand = rng(55);
    for (let i = 0; i < 22; i++) {
      const x   = streakRand() * S;
      const w   = 3 + streakRand() * 18;
      const len = S * (0.3 + streakRand() * 0.7);
      const y0  = streakRand() * S;
      const bright = 0x28 + Math.floor(streakRand() * 0x18);
      const grad = ctx.createLinearGradient(x - w, y0, x + w, y0);
      grad.addColorStop(0, '#1C1E22');
      grad.addColorStop(0.3, `rgb(${bright},${bright+1},${bright+3})`);
      grad.addColorStop(0.5, `rgb(${bright},${bright+1},${bright+3})`);
      grad.addColorStop(0.7, `rgb(${bright},${bright+1},${bright+3})`);
      grad.addColorStop(1, '#1C1E22');
      ctx.fillStyle = grad;
      ctx.fillRect(x - w, y0, w * 2, len);
    }

    addGrime(ctx, S, S, 55, 0.10);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  });
}

/**
 * Floor roughness variation map — plate-grid aligned.
 * Streak centres ~0.30 (gloss → warm fixture reflections), seams ~0.65.
 * 1024×1024 grayscale.
 */
export function makeFloorRoughnessMapTexture(): THREE.CanvasTexture {
  return cached('floor-roughness-map-v2', () => {
    const S = 1024;
    const canvas = document.createElement('canvas');
    canvas.width  = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    // Base: mid roughness (~0.50 → #80)
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, S, S);

    const rand = rng(42);

    // Long worn streaks — dark = smooth/glossy (roughness ~0.30 → #4D)
    for (let i = 0; i < 20; i++) {
      const x   = rand() * S;
      const w   = 5 + rand() * 24;
      const len = S * (0.4 + rand() * 0.6);
      const y0  = rand() * S;
      const v   = Math.floor(0x40 + rand() * 0x20); // 0x40-0x60 → roughness 0.25-0.38
      const grad = ctx.createLinearGradient(x - w, y0, x + w, y0);
      grad.addColorStop(0, '#808080');
      grad.addColorStop(0.3, `rgb(${v},${v},${v})`);
      grad.addColorStop(0.5, `rgb(${v},${v},${v})`);
      grad.addColorStop(0.7, `rgb(${v},${v},${v})`);
      grad.addColorStop(1, '#808080');
      ctx.fillStyle = grad;
      ctx.fillRect(x - w, y0, w * 2, len);
    }

    // Rough patches (scuffs / scratches — ~0xB0 → roughness ~0.69)
    for (let i = 0; i < 30; i++) {
      const x  = rand() * S;
      const y  = rand() * S;
      const r  = 3 + rand() * 12;
      const rv = Math.floor(0x90 + rand() * 0x28);
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.3 + rand() * 0.4), rand() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rv},${rv},${rv},0.6)`;
      ctx.fill();
    }

    // Plate seam lines — slightly rougher edges (~0xA8 → 0.66)
    const PLATE_PX = 512;
    ctx.strokeStyle = 'rgba(168,168,168,0.55)';
    ctx.lineWidth   = 5;
    ctx.beginPath(); ctx.moveTo(PLATE_PX, 0); ctx.lineTo(PLATE_PX, S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, PLATE_PX); ctx.lineTo(S, PLATE_PX); ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
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

    // Simple seam grid
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth   = 2;
    for (let x = 128; x < S; x += 128) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, S); ctx.stroke();
    }
    for (let y = 128; y < S; y += 128) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke();
    }

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
