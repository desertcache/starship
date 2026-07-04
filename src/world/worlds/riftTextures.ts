/**
 * src/world/worlds/riftTextures.ts — procedural textures + color helpers for
 * the RIFT pocket world (floating crystal islands over a starfield abyss).
 *
 * All cached() keys are namespaced 'rift-' per the World lane contract.
 * FIXED seeds only — never Math.random (screenshot determinism).
 */

import * as THREE from 'three';
import { cached } from '../../fx/textureHelpers.js';
import { makeRng } from '../../fx/space/rng.js';

/** Alien star palette — violet/magenta/cyan, replacing the default white-ish
 *  ship-space palette on a buildStarLayer() Points object post-construction
 *  (reuses the shared streaming-star shader; only the baked color attribute
 *  is remapped, so starLayer.ts itself is untouched). */
const ALIEN_STAR_PALETTE: [number, number, number, number][] = [
  // r, g, b, cdf-weight (cumulative applied below)
  [0.72, 0.55, 1.0, 0.34],   // violet
  [1.0, 0.48, 0.92, 0.28],   // magenta
  [0.5, 0.92, 1.0, 0.24],    // cyan
  [1.0, 1.0, 1.0, 0.14],     // a few true-white outliers so it doesn't read monochrome
];

/** Remap a buildStarLayer() Points object's baked `color` attribute from the
 *  default warm-white ship palette to the RIFT alien palette. Deterministic
 *  given `seed`. Leaves geometry/positions/sizes/phases untouched. */
export function tintStarsAlien(points: THREE.Points, seed: number): void {
  const rng = makeRng(seed);
  const attr = points.geometry.attributes['color'] as THREE.BufferAttribute | undefined;
  if (!attr) return;
  const arr = attr.array as Float32Array;
  const n = attr.count;
  for (let i = 0; i < n; i++) {
    const r = rng();
    let acc = 0;
    let picked = ALIEN_STAR_PALETTE[0];
    for (const p of ALIEN_STAR_PALETTE) {
      acc += p[3];
      if (r < acc) { picked = p; break; }
    }
    arr[i * 3] = picked[0];
    arr[i * 3 + 1] = picked[1];
    arr[i * 3 + 2] = picked[2];
  }
  attr.needsUpdate = true;
}

/** Soft radial-gradient dot — spark-mote sprite. Points geometry NEEDS a
 *  sprite map or gl_PointCoord squares render as hard squares. */
export function riftSparkSprite(): THREE.CanvasTexture {
  return cached('rift-spark-sprite', () => {
    const S = 64;
    const cv = document.createElement('canvas');
    cv.width = S; cv.height = S;
    const ctx = cv.getContext('2d')!;
    const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0.0, 'rgba(255,255,255,1.0)');
    g.addColorStop(0.35, 'rgba(220,200,255,0.75)');
    g.addColorStop(1.0, 'rgba(180,120,255,0.0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  });
}

/** Dark violet-grey rock with seeded glowing magenta/cyan crack veins — used
 *  as the emissive+color map on the island rocky undersides. */
export function riftRockVeinTexture(seed: number): THREE.CanvasTexture {
  return cached(`rift-rock-veins-${seed}`, () => {
    const S = 512;
    const cv = document.createElement('canvas');
    cv.width = S; cv.height = S;
    const ctx = cv.getContext('2d')!;
    // Base bright enough that, used as an emissiveMap, the rock mass itself
    // reads as a dim violet silhouette against the abyss (not just the veins).
    ctx.fillStyle = '#3f2a5e';
    ctx.fillRect(0, 0, S, S);

    // Mottled base shading (large soft blobs)
    const rng = makeRng(seed);
    for (let i = 0; i < 40; i++) {
      const x = rng() * S, y = rng() * S, r = 30 + rng() * 90;
      const shade = 0.6 + rng() * 0.5;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${Math.floor(64 * shade)},${Math.floor(38 * shade)},${Math.floor(92 * shade)},0.5)`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Seeded crack veins, alternating magenta/cyan, branching polylines.
    const veinCount = 9;
    for (let v = 0; v < veinCount; v++) {
      const cyan = v % 2 === 0;
      // Veins at ~3:1 over the base — glowing cracks IN rock, not floating
      // neon lines (first-pass qa screenshot failure).
      ctx.strokeStyle = cyan ? 'rgba(90,230,255,0.5)' : 'rgba(255,90,220,0.48)';
      ctx.lineWidth = 1.2 + rng() * 1.8;
      ctx.beginPath();
      let x = rng() * S, y = rng() * S;
      ctx.moveTo(x, y);
      const steps = 5 + Math.floor(rng() * 6);
      for (let s = 0; s < steps; s++) {
        x += (rng() - 0.5) * 120;
        y += (rng() - 0.5) * 120;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      // Faint glow halo along the same path
      ctx.strokeStyle = cyan ? 'rgba(90,230,255,0.11)' : 'rgba(255,90,220,0.1)';
      ctx.lineWidth = 6 + rng() * 4;
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, true);
}
