/**
 * Procedural structural surface textures — Phase 3.
 * Covers: cream wall panels, orange-band wall, gunmetal floor, gunmetal ceiling.
 * Emissive + accent textures: see texturesEmissive.ts
 * All CanvasTexture, generated once and cached.
 *
 * v0.8 lane B1: wall textures now delegate to texturesPanels.ts (modular
 * metal panel language).  Floor reworked for 2m×2m plate-grid world UVs.
 * Ceiling texture unchanged.
 *
 * v0.9 A2 (RADIANCE — resolution bump): floor 1024→2048, roughness map
 * 1024→2048, ceiling 512→1024. All physical-size constants (seam width,
 * stamp radii, streak widths, grid step) doubled in lockstep with the
 * canvas so seams/stamps/streaks keep their real-world size — only texel
 * density increases. Plate/panel WORLD scale (1m plate, 2m×2m ceiling tile)
 * is unchanged.
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
 * 2048×2048 (v0.9 A2: doubled from 1024; 1 m plate scale unchanged).
 */
export function makeGunmetalFloorTexture(): THREE.CanvasTexture {
  return cached('gunmetal-floor-v3', () => {
    const S  = 2048;
    const canvas = document.createElement('canvas');
    canvas.width  = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    // Base: dark gunmetal #1C1E22
    ctx.fillStyle = '#1C1E22';
    ctx.fillRect(0, 0, S, S);

    // 1 m plate grid → 1024 px per plate in a 2 m tile (was 512 px at 1024 canvas)
    const PLATE_PX = 1024; // S / 2 plates per tile = 1024
    const SEAM_W   = 10;   // v0.9 A2: doubled from 5 to keep physical seam width
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
        // v0.9 A2: margins/radii doubled to keep physical stamp size on the 2x canvas
        const cx = ox + 80 + rand() * (PLATE_PX - 160);
        const cy = oy + 80 + rand() * (PLATE_PX - 160);
        const rw = 24 + rand() * 36;
        const rh = 10 + rand() * 16;
        const angle = rand() * Math.PI;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rw, rh, angle, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(80,85,90,0.55)';
        ctx.lineWidth = 3;
        ctx.stroke();
        // Inner raised oval (slightly lighter)
        ctx.beginPath();
        ctx.ellipse(cx, cy, rw - 6, rh - 3, angle, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fill();
      }
    }

    // Long fore-aft wear streaks (vertical = fore-aft direction)
    const streakRand = rng(55);
    for (let i = 0; i < 22; i++) {
      const x   = streakRand() * S;
      const w   = 6 + streakRand() * 36; // v0.9 A2: doubled from 3+18
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
 * 2048×2048 grayscale (v0.9 A2: doubled from 1024, matching floor diffuse).
 */
export function makeFloorRoughnessMapTexture(): THREE.CanvasTexture {
  return cached('floor-roughness-map-v3', () => {
    const S = 2048;
    const canvas = document.createElement('canvas');
    canvas.width  = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    // Base: mid roughness (~0.50 → #80)
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, S, S);

    const rand = rng(42);

    // Stage D: streak centres darker = more gloss (~0.22 roughness → #38)
    for (let i = 0; i < 20; i++) {
      const x   = rand() * S;
      const w   = 10 + rand() * 48; // v0.9 A2: doubled from 5+24
      const len = S * (0.4 + rand() * 0.6);
      const y0  = rand() * S;
      const v   = Math.floor(0x30 + rand() * 0x18); // 0x30-0x48 → roughness 0.19-0.28
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
      const r  = 6 + rand() * 24; // v0.9 A2: doubled from 3+12
      const rv = Math.floor(0x90 + rand() * 0x28);
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.3 + rand() * 0.4), rand() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rv},${rv},${rv},0.6)`;
      ctx.fill();
    }

    // Plate seam lines — slightly rougher edges (~0xA8 → 0.66)
    const PLATE_PX = 1024; // v0.9 A2: S/2, keeps 1m plate scale
    ctx.strokeStyle = 'rgba(168,168,168,0.55)';
    ctx.lineWidth   = 10; // v0.9 A2: doubled from 5
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
 * 1024×1024 (v0.9 A2: doubled from 512; grid step/inset doubled in lockstep
 * so the 4×4 panel grid keeps the same physical size).
 */
export function makeGunmetalCeilingTexture(): THREE.CanvasTexture {
  return cached('gunmetal-ceiling-v2', () => {
    const S = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    // v0.6 P1: ceiling base darkened to reduce secondary uplight bounce off ceiling
    ctx.fillStyle = '#1a1c20';
    ctx.fillRect(0, 0, S, S);

    // Simple seam grid
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth   = 4; // v0.9 A2: doubled from 2
    for (let x = 256; x < S; x += 256) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, S); ctx.stroke();
    }
    for (let y = 256; y < S; y += 256) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke();
    }

    // Alternating inset lighter panels
    const rand = rng(77);
    for (let gy = 0; gy < 4; gy++) {
      for (let gx = 0; gx < 4; gx++) {
        if ((gx + gy) % 2 === 0) {
          const v = (rand() * 0.04 + 0.02).toFixed(3);
          ctx.fillStyle = `rgba(255,255,255,${v})`;
          ctx.fillRect(gx * 256 + 8, gy * 256 + 8, 240, 240);
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
