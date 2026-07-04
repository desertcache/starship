/**
 * src/world/worlds/ashfallSky.ts — sky dome, dim red sun, and heat-shimmer
 * boundary rim for the ASHFALL pocket world (Stage C).
 *
 * All geometry/materials are owned here; the caller (ashfall.ts) adds the
 * three meshes/sprite to its own scene and drives `update(t)` + `dispose()`.
 */
import * as THREE from 'three';

/** Fallback scene.background — visible only through any dome gaps. */
export const ASH_HAZE_COLOR = 0x1f1712;

function buildSkyTexture(): THREE.CanvasTexture {
  const w = 4;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  // SphereGeometry maps uv.y=1 → top pole, uv.y=0 → bottom pole, and the
  // visible horizon is the equator (uv.y≈0.5) — so the warm horizon band must
  // sit at the MIDDLE of the canvas (round 1 put the glow at the underground
  // bottom pole and the whole sky read flat near-black).
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0.0, '#14100d');   // zenith — near-black ash-brown
  grad.addColorStop(0.3, '#33241b');   // upper sky — warm ash-brown
  grad.addColorStop(0.44, '#61402a');  // approach band — dusty orange-brown
  grad.addColorStop(0.5, '#96582f');   // horizon glow (equator)
  grad.addColorStop(0.58, '#5c3c28');  // just below horizon
  grad.addColorStop(1.0, '#33241b');   // bottom pole (hidden underground)
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildSunTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  const cx = size / 2;
  const cy = size / 2;
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.5);
  halo.addColorStop(0, 'rgba(255,150,70,0.95)');
  halo.addColorStop(0.1, 'rgba(235,100,45,0.65)');
  halo.addColorStop(0.3, 'rgba(160,55,28,0.25)');
  halo.addColorStop(0.6, 'rgba(110,35,18,0.08)'); // long tail — no visible halo ring
  halo.addColorStop(1, 'rgba(90,20,10,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);
  // Heavy blur pass so the disc reads dim + diffused (ash-choked atmosphere),
  // not a crisp bright sun.
  ctx.filter = 'blur(10px)';
  ctx.globalCompositeOperation = 'lighter';
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.11);
  core.addColorStop(0, 'rgba(255,190,120,0.9)');
  core.addColorStop(1, 'rgba(255,190,120,0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.11, 0, Math.PI * 2);
  ctx.fill();
  ctx.filter = 'none';
  ctx.globalCompositeOperation = 'source-over';
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Radial (V-axis) falloff band — RingGeometry maps V 0(inner)..1(outer). */
function buildRimTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, 'rgba(255,110,40,0)');
  grad.addColorStop(0.5, 'rgba(255,110,40,0.6)');
  grad.addColorStop(1, 'rgba(255,110,40,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export interface AshfallSky {
  dome: THREE.Mesh;
  sun: THREE.Mesh;
  rim: THREE.Mesh;
  update(t: number): void;
  dispose(): void;
}

/** Build the sky dome + dim red sun + heat-shimmer rim at `radius`. */
export function buildAshfallSky(radius: number, groundY: number): AshfallSky {
  const skyTex = buildSkyTexture();
  const domeGeo = new THREE.SphereGeometry(480, 24, 16);
  const domeMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.name = 'ashfall-sky-dome';

  const sunTex = buildSunTexture();
  // MESH plane, NOT a Sprite. GTAOPass's G-buffer hides Points/Lines but not
  // Sprites, and renders them through scene.overrideMaterial WITHOUT the
  // billboard transform — a Sprite here bakes a giant garbage-normal quad
  // into the AO depth/normal buffer and the whole sky region under it gets
  // AO-darkened into a hard-edged slab (round-2 bug, confirmed via ?ssao=0
  // A/B). A fixed plane facing the arena renders coherent G-buffer depth +
  // normals → AO ≈ 1 → clean; parallax at 420m over a 60m arena is nil.
  const sunMat = new THREE.MeshBasicMaterial({
    map: sunTex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    opacity: 0.85,
    // fog defaults TRUE — at 400m+ that fogs the sun to the haze color, and
    // additive-blending a fog-colored quad adds ~nothing (the round-1 "sun is
    // missing" bug). Sky elements opt out; fog is for terrain.
    fog: false,
  });
  const sunGeo = new THREE.PlaneGeometry(300, 300);
  const sun = new THREE.Mesh(sunGeo, sunMat);
  // Low on the horizon (~6° elevation — clears the 3-4m terrain ridge
  // silhouettes from eye height), off-center toward -X, facing the arena.
  sun.position.set(-70, groundY + 48, -420);
  sun.lookAt(0, groundY + 4, 0);
  sun.name = 'ashfall-sun';

  const rimTex = buildRimTexture();
  const rimGeo = new THREE.RingGeometry(radius - 1.4, radius + 2.6, 96);
  const rimMat = new THREE.MeshBasicMaterial({
    map: rimTex,
    color: 0xff6e28,
    transparent: true,
    opacity: 0.38,
    side: THREE.DoubleSide,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false, // rail-radius shimmer must survive the ash haze (20-60m out)
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = -Math.PI / 2;
  rim.position.y = groundY + 0.08;
  rim.name = 'ashfall-rim';

  function update(t: number): void {
    // Two beat frequencies so the shimmer never reads as a metronomic pulse.
    rimMat.opacity = 0.32 + 0.1 * Math.sin(t * 1.3) + 0.06 * Math.sin(t * 3.1 + 1.7);
    sunMat.opacity = 0.78 + 0.08 * Math.sin(t * 0.35);
  }

  function dispose(): void {
    domeGeo.dispose();
    domeMat.dispose();
    skyTex.dispose();
    sunGeo.dispose();
    sunMat.dispose();
    sunTex.dispose();
    rimGeo.dispose();
    rimMat.dispose();
    rimTex.dispose();
  }

  return { dome, sun, rim, update, dispose };
}
