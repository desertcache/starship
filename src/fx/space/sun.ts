/**
 * Hero sun — one distant, brilliant background star. A single additive
 * CanvasTexture sprite (soft halo + 4-point cross-flare), deliberately NOT a
 * THREE.Light — the bodies are self-lit MeshBasic already, and a light this
 * far away would only cost a uniform slot for zero visual return.
 *
 * Persistent for the whole run (not part of the rolling despawn cast) — the
 * director creates one at a fixed, deterministic world position and disposes
 * it alongside everything else it owns.
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';

function buildSunTexture(rng: Rng): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  const cx = size / 2;
  const cy = size / 2;

  // Warm-white core fading through pale blue to transparent — soft halo.
  // v0.9 RADIANCE fix-round M9: blue halo tightened (stops pulled in + outer
  // blue alpha nearly halved) — the old wide pale-blue ring read as a
  // "decal"-like circular disc rather than a distant brilliant glint.
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.5);
  halo.addColorStop(0, 'rgba(255,255,255,1)');
  halo.addColorStop(0.07, 'rgba(255,246,222,0.95)');
  halo.addColorStop(0.18, 'rgba(200,220,255,0.22)');
  halo.addColorStop(0.42, 'rgba(140,180,255,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);

  // 4-point cross-flare: two perpendicular tapered beams, additive.
  // v0.9 RADIANCE fix-round M9: beam length cut ~40% (0.92-1.0 → 0.55-0.60)
  // and edges softened via a canvas blur pass so the spikes read as fine
  // glints rather than oversized hard-edged blades.
  ctx.globalCompositeOperation = 'lighter';
  const beamLenJ = rng.range(0.55, 0.60);
  ctx.filter = 'blur(4px)';
  for (const rot of [0, Math.PI / 2]) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const w = size * beamLenJ;
    const h = size * 0.022;
    const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(255,250,235,0.80)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
  ctx.filter = 'none';
  ctx.globalCompositeOperation = 'source-over';

  // Small punchy core dot so the very centre reads bright at any distance.
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.06);
  core.addColorStop(0, 'rgba(255,255,255,1)');
  core.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.06, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface HeroSun {
  sprite: THREE.Sprite;
  /** Gentle brightness pulse — call each frame with elapsed seconds. */
  tick(elapsed: number): void;
  dispose(): void;
}

/** Create the one persistent hero sun sprite at a fixed world position. */
export function createHeroSun(rng: Rng, position: THREE.Vector3, scale = 460): HeroSun {
  const tex = buildSunTexture(rng);
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scale, scale, 1);
  sprite.position.copy(position);
  sprite.name = 'hero-sun';
  sprite.renderOrder = -2;

  function tick(elapsed: number): void {
    mat.opacity = 0.92 + 0.08 * Math.sin(elapsed * 0.5);
  }

  function dispose(): void {
    tex.dispose();
    mat.dispose();
  }

  return { sprite, tick, dispose };
}
