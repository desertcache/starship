/**
 * Procedural body factory.
 *
 * Builds a self-contained THREE.Group per celestial body (gas giant, rocky,
 * ice, lava, ringed, moon) with a per-body CanvasTexture, slow self-spin, and
 * a scan record (name / class / composition). Every body owns its own geometry,
 * materials, and textures so dispose() fully releases them — no shared resources.
 *
 * Bodies do NOT move themselves laterally — the director owns world velocity.
 * tick(dt) only advances the local self-spin.
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';
import { generateBodyName } from './names.js';
import { HUE_FAMILIES } from './palette.js';
import {
  gasGiantTexture,
  rockyTexture,
  iceTexture,
  lavaBaseTexture,
  lavaCrackTexture,
  ringTexture,
  moonTexture,
} from './bodyTextures.js';

export type BodyKind = 'GAS_GIANT' | 'ROCKY' | 'ICE' | 'LAVA' | 'RINGED' | 'MOON';

export interface BodyScan {
  name: string;
  class: string;
  composition: string;
}

export interface Body {
  group: THREE.Group;
  tick(dt: number): void;
  dispose(): void;
  scan: BodyScan;
}

/** Internal disposable bookkeeping. */
interface Disposables {
  geos: THREE.BufferGeometry[];
  mats: THREE.Material[];
  texs: THREE.Texture[];
}

function sphere(radius: number, hero: boolean): THREE.SphereGeometry {
  return hero
    ? new THREE.SphereGeometry(radius, 32, 24)
    : new THREE.SphereGeometry(radius, 24, 16);
}

function track(d: Disposables, geo: THREE.BufferGeometry, mat: THREE.Material, tex?: THREE.Texture): void {
  d.geos.push(geo);
  d.mats.push(mat);
  if (tex) d.texs.push(tex);
}

function disposeAll(d: Disposables): void {
  for (const g of d.geos) g.dispose();
  for (const m of d.mats) m.dispose();
  for (const t of d.texs) t.dispose();
}

/** Add a coloured BackSide additive atmosphere rim shell (gas giants only). */
function addAtmosphere(group: THREE.Group, radius: number, accent: number, d: Disposables, rng: Rng): void {
  const geo = new THREE.SphereGeometry(radius * 1.03, 24, 16);
  const mat = new THREE.MeshBasicMaterial({
    color: accent,
    transparent: true,
    opacity: rng.range(0.12, 0.16),
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'atmosphere';
  group.add(mesh);
  track(d, geo, mat);
}

/**
 * Create a procedural body. `kind` selects the look; `radius` is world units.
 * hero/ambient texture sizing is inferred from radius (>=50 → hero detail).
 * `familyIndex` optionally forces a gas-giant hue family (0..3); else seeded.
 */
export function createBody(
  rng: Rng,
  kind: BodyKind,
  radius: number,
  familyIndex?: number,
): Body {
  const group = new THREE.Group();
  group.name = `body-${kind}`;
  const d: Disposables = { geos: [], mats: [], texs: [] };
  const hero = radius >= 50;
  const texSize = hero ? 512 : 256;

  let cls = 'Unknown';
  let composition = 'unclassified';
  const spinSpeed = rng.range(0.01, 0.04);

  const mainGeo = sphere(radius, hero);

  if (kind === 'GAS_GIANT' || kind === 'RINGED') {
    const fi = familyIndex ?? rng.int(0, HUE_FAMILIES.length - 1);
    const family = HUE_FAMILIES[fi];
    const tex = gasGiantTexture(rng, family, texSize);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const mesh = new THREE.Mesh(mainGeo, mat);
    mesh.name = 'body-core';
    group.add(mesh);
    track(d, mainGeo, mat, tex);
    addAtmosphere(group, radius, family.accent, d, rng);
    cls = kind === 'RINGED' ? 'Ringed Giant' : 'Gas Giant — Class III';
    composition = 'hydrogen, helium, ammonia';

    if (kind === 'RINGED') {
      const ringTex = ringTexture(rng, 256);
      const ringGeo = new THREE.RingGeometry(radius * 1.4, radius * 2.3, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        map: ringTex,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2 + rng.range(0.2, 0.5);
      ring.name = 'ring';
      group.add(ring);
      track(d, ringGeo, ringMat, ringTex);
    }
  } else if (kind === 'ROCKY') {
    const tex = rockyTexture(rng, texSize);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const mesh = new THREE.Mesh(mainGeo, mat);
    mesh.name = 'body-core';
    group.add(mesh);
    track(d, mainGeo, mat, tex);
    cls = 'Rocky / Terrestrial';
    composition = 'silicate, iron oxide';
  } else if (kind === 'ICE') {
    const tex = iceTexture(rng, texSize);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const mesh = new THREE.Mesh(mainGeo, mat);
    mesh.name = 'body-core';
    group.add(mesh);
    track(d, mainGeo, mat, tex);
    cls = 'Ice World';
    composition = 'water ice, ammonia';
  } else if (kind === 'LAVA') {
    const baseTex = lavaBaseTexture(rng, texSize);
    const baseMat = new THREE.MeshBasicMaterial({ map: baseTex });
    const mesh = new THREE.Mesh(mainGeo, baseMat);
    mesh.name = 'body-core';
    group.add(mesh);
    track(d, mainGeo, baseMat, baseTex);

    // Emissive crack overlay (toneMapped=false so cracks bloom).
    const crackTex = lavaCrackTexture(rng, texSize);
    const crackGeo = sphere(radius * 1.001, hero);
    const crackMat = new THREE.MeshBasicMaterial({
      map: crackTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const crack = new THREE.Mesh(crackGeo, crackMat);
    crack.name = 'lava-cracks';
    group.add(crack);
    track(d, crackGeo, crackMat, crackTex);
    cls = 'Volcanic';
    composition = 'basalt, sulfur';
  } else {
    // MOON
    const tex = moonTexture(rng, texSize);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const mesh = new THREE.Mesh(mainGeo, mat);
    mesh.name = 'body-core';
    group.add(mesh);
    track(d, mainGeo, mat, tex);
    cls = 'Moon';
    composition = 'silicate, regolith';
  }

  const scan: BodyScan = { name: generateBodyName(rng), class: cls, composition };

  // Spin every textured surface (core + cracks) about Y; leave rings/atmo as-is
  // (rings keep their tilt; atmosphere is symmetric so spin is invisible there).
  const spinTargets = group.children.filter(
    (c) => c.name === 'body-core' || c.name === 'lava-cracks',
  );

  function tick(dt: number): void {
    for (const t of spinTargets) t.rotation.y += spinSpeed * dt;
  }

  function dispose(): void {
    disposeAll(d);
  }

  return { group, tick, dispose, scan };
}
