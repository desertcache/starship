/**
 * src/world/worlds/verdantTextures.ts — procedural CanvasTexture generators for
 * the VERDANT bioluminescent glade. All cache keys are namespaced 'verdant-'
 * (cache keys in textureHelpers.ts's cached() are global at merge — the
 * campaign's other two world lanes mint their own biome textures under their
 * own prefixes, so collisions would silently swap art between worlds).
 *
 * Seeded via makeRng(seed) — never Math.random (screenshot determinism, see
 * CLAUDE.md + design-v1.0-threshold.md "seeded RNG everywhere").
 */
import * as THREE from 'three';
import { cached } from '../../fx/textureHelpers.js';
import { makeRng } from '../../fx/space/rng.js';
import { fbmWrap, makeNoiseGrid, hexToRgb, lerpRgb } from '../../fx/space/noise.js';

const BARK_SEED = 0x7aaa;
const GROUND_SEED = 0x7a99;

/** Mossy dusk bark: warm-dark base, vertical ridge striation, teal-lichen patches. */
export function verdantBarkTexture(): THREE.CanvasTexture {
  return cached('verdant-bark', () => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const rng = makeRng(BARK_SEED);

    ctx.fillStyle = '#332920';
    ctx.fillRect(0, 0, size, size);

    // Vertical ridge striation (bark grain runs along V/height).
    const ridges = rng.int(22, 30);
    for (let i = 0; i < ridges; i++) {
      const x = (i / ridges) * size + rng.signed(6);
      const w = rng.range(3, 9);
      const light = rng() < 0.5;
      ctx.strokeStyle = light ? 'rgba(120,96,72,0.22)' : 'rgba(10,8,6,0.28)';
      ctx.lineWidth = w;
      ctx.beginPath();
      let x0 = x;
      ctx.moveTo(x0, 0);
      for (let y = 24; y <= size; y += 24) {
        x0 += rng.signed(5);
        ctx.lineTo(x0, y);
      }
      ctx.stroke();
    }

    // Teal-violet lichen/moss patches clinging to the bark.
    const patches = rng.int(14, 22);
    for (let i = 0; i < patches; i++) {
      const cx = rng() * size;
      const cy = rng() * size;
      const r = rng.range(0.02, 0.07) * size;
      const hue = rng() < 0.6 ? '70,220,210' : '150,110,230';
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `rgba(${hue},0.35)`);
      grad.addColorStop(1, `rgba(${hue},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fine grain via seeded fbm for a non-airbrushed surface.
    const grid = makeNoiseGrid(rng, 48);
    const img = ctx.getImageData(0, 0, size, size);
    const d = img.data;
    for (let y = 0; y < size; y += 2) {
      for (let x = 0; x < size; x += 2) {
        const n = fbmWrap(grid, 48, x / size, y / size, 6, 6, 3);
        const shade = 1 + n * 0.12;
        const idx = (y * size + x) * 4;
        d[idx] = Math.max(0, Math.min(255, d[idx] * shade));
        d[idx + 1] = Math.max(0, Math.min(255, d[idx + 1] * shade));
        d[idx + 2] = Math.max(0, Math.min(255, d[idx + 2] * shade));
      }
    }
    ctx.putImageData(img, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 2);
    return tex;
  }, true);
}

/**
 * Neutral-bright moss-speckle overlay multiplied over the terrain's vertex
 * color ramp (terrain.ts `texture` slot). Kept near-white on average so it
 * adds detail without crushing the underlying ramp toward black.
 */
export function verdantGroundDetailTexture(): THREE.CanvasTexture {
  return cached('verdant-ground-detail', () => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const rng = makeRng(GROUND_SEED);

    ctx.fillStyle = '#d8dccc';
    ctx.fillRect(0, 0, size, size);

    const grid = makeNoiseGrid(rng, 56);
    const low = hexToRgb('#8fa088');
    const high = hexToRgb('#e8ecd8');
    const img = ctx.getImageData(0, 0, size, size);
    const d = img.data;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const n = fbmWrap(grid, 56, x / size, y / size, 8, 8, 4);
        const t = Math.max(0, Math.min(1, n * 0.5 + 0.5));
        const c = lerpRgb(low, high, t);
        const idx = (y * size + x) * 4;
        d[idx] = c.r;
        d[idx + 1] = c.g;
        d[idx + 2] = c.b;
      }
    }
    ctx.putImageData(img, 0, 0);

    // Scattered darker moss dapples on top.
    const dapples = rng.int(60, 90);
    for (let i = 0; i < dapples; i++) {
      const cx = rng() * size;
      const cy = rng() * size;
      const r = rng.range(0.01, 0.035) * size;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(40,60,44,0.30)');
      grad.addColorStop(1, 'rgba(40,60,44,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }, true);
}

/**
 * Vertical alpha gradient for the boundary glow wall: bright at the bottom
 * (ground level), feathering to fully transparent at the top edge.
 */
export function verdantRimGradientTexture(): THREE.CanvasTexture {
  return cached('verdant-rim-gradient', () => {
    const W = 16;
    const H = 64;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0.0, 'rgba(255,255,255,0.0)');   // top — vanish
    grad.addColorStop(0.55, 'rgba(255,255,255,0.12)');
    grad.addColorStop(1.0, 'rgba(255,255,255,0.65)');  // bottom — ground glow
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  });
}

/** Soft feathered disc — required so firefly Points render as glowing motes, not squares. */
export function verdantFireflySpriteTexture(): THREE.CanvasTexture {
  return cached('verdant-firefly-sprite', () => {
    const S = 32;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;
    const cx = S / 2;
    const cy = S / 2;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, S / 2);
    grad.addColorStop(0.0, 'rgba(255,255,255,1.0)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1.0, 'rgba(255,255,255,0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, S, S);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  });
}
