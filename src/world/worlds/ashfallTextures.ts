/**
 * src/world/worlds/ashfallTextures.ts — procedural CanvasTexture generators for
 * the ASHFALL pocket world (Stage C).
 *
 * The crack overlay reuses `lavaCrackTexture` from fx/space/bodyTextures.ts per
 * the design doc ("note lavaCrackTexture — reuse it"). Ember/smoke/basalt-mottle
 * are small new seeded generators local to this world. Every `cached()` key here
 * is 'ashfall-' prefixed — those textures are app-lifetime singletons (like
 * volumetrics.ts's dust-mote sprite) and are NEVER disposed by world.dispose().
 *
 * All randomness is seeded (makeRng) — never Math.random — so verify
 * screenshots stay bit-for-bit deterministic across runs.
 */
import * as THREE from 'three';
import { makeRng } from '../../fx/space/rng.js';
import { lavaCrackTexture, makeCanvas, finalize } from '../../fx/space/bodyTextures.js';
import { cached } from '../../fx/textureHelpers.js';

const CRACK_SEED = 0xa5fa11;
const MOTTLE_SEED = 0xa5fa33;
const SMOKE_SEED = 0xa5fa55;

/** Dense emissive crack network (adapted lavaCrackTexture), tiled both axes. */
export function ashfallCrackTexture(): THREE.CanvasTexture {
  return cached('ashfall-crack-tex', () => {
    const tex = lavaCrackTexture(makeRng(CRACK_SEED), 1024);
    tex.wrapT = THREE.RepeatWrapping; // wrapS already set by finalize()
    return tex;
  });
}

/** Dark basalt mottling — multiplied over the terrain's vertex-color ramp. */
export function ashfallBasaltMottle(): THREE.CanvasTexture {
  return cached('ashfall-basalt-mottle', () => {
    const rng = makeRng(MOTTLE_SEED);
    const size = 512;
    const { canvas, ctx } = makeCanvas(size);
    ctx.fillStyle = '#5a4a3c';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 46; i++) {
      const x = rng() * size;
      const y = rng() * size;
      const r = rng.range(0.03, 0.12) * size;
      const dark = rng() < 0.55;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, dark ? 'rgba(6,5,5,0.55)' : 'rgba(90,72,56,0.35)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = finalize(canvas);
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 5);
    return tex;
  });
}

/** Soft warm-orange radial sprite — ember-rise Points + fumarole columns. */
export function ashfallEmberSprite(): THREE.CanvasTexture {
  return cached('ashfall-ember-sprite', () => {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2d context unavailable');
    const cx = size / 2;
    const cy = size / 2;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
    grad.addColorStop(0, 'rgba(255,225,170,1)');
    grad.addColorStop(0.35, 'rgba(255,140,50,0.85)');
    grad.addColorStop(1, 'rgba(255,80,20,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  });
}

/** Large soft grey-brown smoke sprite — a few slow drifting plumes high above. */
export function ashfallSmokeSprite(): THREE.CanvasTexture {
  return cached('ashfall-smoke-sprite', () => {
    const rng = makeRng(SMOKE_SEED);
    const size = 256;
    const { canvas, ctx } = makeCanvas(size);
    ctx.clearRect(0, 0, size, size);
    // Blobs are CONTAINED: |center offset| + radius ≤ 0.46·size, so alpha hits
    // zero well inside the canvas. Round 1 let gradients overflow the edge and
    // every plume rendered as a hard-edged dark rectangle in the sky.
    for (let i = 0; i < 4; i++) {
      const cx = size * 0.5 + rng.signed(size * 0.1);
      const cy = size * 0.5 + rng.signed(size * 0.1);
      const r = size * rng.range(0.22, 0.34);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(122,104,90,0.4)');
      grad.addColorStop(0.6, 'rgba(122,104,90,0.18)');
      grad.addColorStop(1, 'rgba(122,104,90,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  });
}
