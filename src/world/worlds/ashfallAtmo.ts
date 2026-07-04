/**
 * src/world/worlds/ashfallAtmo.ts — global ember-rise Points + smoke plume
 * sprites for the ASHFALL pocket world (Stage C).
 *
 * Both systems animate off `performance.now()` inside their own
 * `onBeforeRender` (not `world.update`) so they keep drifting correctly when
 * rendered through the shared live portal-preview RT — same rationale as the
 * crack overlay in ashfallVolcanics.ts.
 */
import * as THREE from 'three';
import { makeRng } from '../../fx/space/rng.js';
import { ashfallEmberSprite, ashfallSmokeSprite } from './ashfallTextures.js';

const EMBER_SEED = 0xa5fa91;
const EMBER_COUNT = 140;
const RISE_HEIGHT = 15;

export interface EmberField {
  points: THREE.Points;
  dispose(): void;
}

/**
 * Ember-rise motes: ~55% seeded near a fumarole (reads as a slow ember column
 * emitted by the vent), the rest scattered across the terrain as ambient
 * atmosphere. Rises with a lateral noise sway, wraps back to its base height.
 */
export function buildEmberField(
  groundHeight: (x: number, z: number) => number,
  radius: number,
  vents: ReadonlyArray<{ x: number; z: number }>,
): EmberField {
  const rng = makeRng(EMBER_SEED);
  const positions = new Float32Array(EMBER_COUNT * 3);
  const baseXZ = new Float32Array(EMBER_COUNT * 2);
  const baseY = new Float32Array(EMBER_COUNT);
  const speed = new Float32Array(EMBER_COUNT);
  const phase = new Float32Array(EMBER_COUNT);
  const swayAmp = new Float32Array(EMBER_COUNT);

  for (let i = 0; i < EMBER_COUNT; i++) {
    let x: number;
    let z: number;
    if (vents.length > 0 && rng() < 0.55) {
      const v = vents[rng.int(0, vents.length - 1)];
      const a = rng() * Math.PI * 2;
      const r = rng.range(0, 3.2);
      x = v.x + Math.cos(a) * r;
      z = v.z + Math.sin(a) * r;
    } else {
      const a = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * radius * 0.9;
      x = Math.cos(a) * r;
      z = Math.sin(a) * r;
    }
    const gy = groundHeight(x, z);
    baseXZ[i * 2] = x;
    baseXZ[i * 2 + 1] = z;
    baseY[i] = gy + rng.range(0.2, 1.5);
    speed[i] = rng.range(0.6, 1.6);
    phase[i] = rng() * Math.PI * 2;
    swayAmp[i] = rng.range(0.4, 1.4);
    positions[i * 3] = x;
    positions[i * 3 + 1] = baseY[i];
    positions[i * 3 + 2] = z;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xff9a4a,
    map: ashfallEmberSprite(),
    size: 0.34,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const points = new THREE.Points(geo, mat);
  points.name = 'ashfall-embers';
  const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
  const start = performance.now();

  points.onBeforeRender = (): void => {
    const t = (performance.now() - start) / 1000;
    for (let i = 0; i < EMBER_COUNT; i++) {
      const rise = (t * speed[i] * 1.4 + phase[i]) % RISE_HEIGHT;
      const sway = Math.sin(t * 0.5 + phase[i]) * swayAmp[i] * 0.4;
      const swayZ = Math.cos(t * 0.4 + phase[i]) * swayAmp[i] * 0.4;
      posAttr.setXYZ(i, baseXZ[i * 2] + sway, baseY[i] + rise, baseXZ[i * 2 + 1] + swayZ);
    }
    posAttr.needsUpdate = true;
  };

  return {
    points,
    // ashfallEmberSprite() is a cached() app-lifetime singleton — not disposed here.
    dispose(): void { geo.dispose(); mat.dispose(); },
  };
}

const SMOKE_PLUMES: ReadonlyArray<{ x: number; z: number; y: number }> = [
  { x: 17, z: 22, y: 18 },
  { x: -20, z: 8, y: 16 },
  { x: 6, z: -18, y: 20 },
  { x: 10, z: 20, y: 14 },
];

export interface SmokeField {
  points: THREE.Points;
  dispose(): void;
}

/**
 * 4 large, slow-drifting smoke plumes high above the vents — ONE THREE.Points
 * system (one vertex per plume), soft additive smoke sprite map.
 *
 * Why Points and not Sprite/Mesh quads: GTAOPass renders its G-buffer through
 * scene.overrideMaterial and only hides `isPoints`/`isLine` objects. Sprite
 * quads bake in un-billboarded (garbage normals → hard AO slab in the sky,
 * round-2 bug); Mesh planes at 25-45m are close enough for real AO sampling
 * and STILL darken into diamonds (round-4 bug). Points are categorically
 * excluded from the AO pass — same proven path as the ember field — and
 * billboard for free. Additive warm wash (nebula.ts pattern): reads as lit
 * ash haze and mathematically can never darken the sky.
 */
export function buildSmokePlumes(groundHeight: (x: number, z: number) => number): SmokeField {
  const positions = new Float32Array(SMOKE_PLUMES.length * 3);
  const base = new Float32Array(SMOKE_PLUMES.length * 3);
  SMOKE_PLUMES.forEach((p, i) => {
    const gy = groundHeight(p.x, p.z);
    base[i * 3] = p.x;
    base[i * 3 + 1] = gy + p.y;
    base[i * 3 + 2] = p.z;
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = gy + p.y;
    positions[i * 3 + 2] = p.z;
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    map: ashfallSmokeSprite(),
    color: 0x6a4a34,
    size: 12, // world-size splats (sizeAttenuation default true)
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
    fog: false, // plumes must survive the ash haze, like the sun/rim
  });
  const points = new THREE.Points(geo, mat);
  points.name = 'ashfall-smoke';
  const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;

  points.onBeforeRender = (): void => {
    const t = performance.now() / 1000;
    for (let i = 0; i < SMOKE_PLUMES.length; i++) {
      const phase = i * 1.7;
      posAttr.setXYZ(
        i,
        base[i * 3] + Math.sin(t * 0.08 + phase) * 3.5,
        base[i * 3 + 1] + Math.sin(t * 0.11 + phase) * 0.8,
        base[i * 3 + 2] + Math.cos(t * 0.07 + phase) * 3.5,
      );
    }
    posAttr.needsUpdate = true;
    mat.opacity = 0.3 + 0.1 * Math.sin(t * 0.15);
  };

  return {
    points,
    // ashfallSmokeSprite() is a cached() app-lifetime singleton — not disposed here.
    dispose(): void { geo.dispose(); mat.dispose(); },
  };
}
