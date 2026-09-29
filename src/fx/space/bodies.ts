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
 *
 * v1.2.1 Lane D (HERO TEXTURE HITCH): `deferred=true` (RUNTIME hero spawns
 * only — see cast.ts's HeroOpts.deferred / director.ts's trySpawnHero) time-
 * slices the body-core texture's expensive per-pixel paint across frames
 * instead of blocking the spawning frame for ~35-224ms. Every rng draw the
 * texture depends on still happens HERE, synchronously, in today's exact
 * order (see giantTexture.ts / grainDeferred.ts headers) — deferred only
 * changes WHEN the pixels get painted, never the rng sequence or the final
 * bytes. Boot-time bodies (spawnSignatureHeroes) and destinationVisual.ts's
 * createBody('ROCKY',...) call omit the 6th arg, so they're unaffected:
 * always the original fully-synchronous path.
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';
import { generateBodyName } from './names.js';
import { HUE_FAMILIES, ICE_ATMO_TINT } from './palette.js';
import { gasGiantTexture } from './giantTexture.js';
import {
  rockyTexture,
  iceTexture,
  lavaBaseTexture,
  moonTexture,
} from './bodyTextures.js';
import { ringTexture, lavaCrackTexture } from './overlayTextures.js';
import {
  beginGasGiantDeferred,
  beginRockyDeferred,
  beginIceDeferred,
  beginLavaBaseDeferred,
  beginMoonDeferred,
  type DeferredHeroTexture,
} from './grainDeferred.js';
import { cancelHeroTextureJob, type HeroTextureJob } from './heroTextureJobs.js';
import { addAtmosphere } from './atmosphere.js';

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

/** Build the body-core mesh + material from either a one-shot sync texture
 *  or a deferred job. `begin` is null for the sync path (destination/boot
 *  bodies, ambients, and any hero whose caller didn't ask for deferred).
 *  `onTex`/`onJob` let the caller (createBody) stash the CURRENT texture
 *  (placeholder, then whatever it gets swapped to) and the cancel handle for
 *  dispose() — see this file's header for why the rng sequence never moves. */
function buildCoreMesh(
  mainGeo: THREE.SphereGeometry,
  sync: () => THREE.CanvasTexture,
  begin: ((onDone: (tex: THREE.CanvasTexture) => void) => DeferredHeroTexture) | null,
  onTex: (tex: THREE.Texture) => void,
  onJob: (job: HeroTextureJob) => void,
): { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial } {
  let mat!: THREE.MeshBasicMaterial;
  let tex: THREE.Texture;
  if (begin) {
    const deferred = begin((finalTex) => {
      const old = mat.map;
      mat.map = finalTex;
      mat.needsUpdate = true;
      old?.dispose();
      onTex(finalTex);
    });
    tex = deferred.placeholder;
    onJob(deferred.job);
  } else {
    tex = sync();
  }
  mat = new THREE.MeshBasicMaterial({ map: tex });
  onTex(tex);
  const mesh = new THREE.Mesh(mainGeo, mat);
  mesh.name = 'body-core';
  return { mesh, mat };
}

/**
 * Create a procedural body. `kind` selects the look; `radius` is world units.
 * hero/ambient texture sizing is inferred from radius (>=50 → hero detail).
 * `familyIndex` optionally forces a gas-giant hue family (0..3); else seeded.
 * `pinnedLightU` overrides the seeded terminator direction for GAS_GIANT/RINGED
 * bodies; use 0.25 for a clearly visible terminator across the visible disc.
 * `deferred` (default false): time-slice the body-core texture's paint step
 * across frames instead of generating it synchronously — only meaningful
 * for hero-size bodies (texSize=1024); ignored otherwise. RUNTIME hero
 * spawns only (see this file's header) — never set for boot/destination
 * bodies, whose textures must exist before __ready / the first screenshot.
 */
export function createBody(
  rng: Rng,
  kind: BodyKind,
  radius: number,
  familyIndex?: number,
  pinnedLightU?: number,
  deferred = false,
): Body {
  const group = new THREE.Group();
  group.name = `body-${kind}`;
  const d: Disposables = { geos: [], mats: [], texs: [] };
  const hero = radius >= 50;
  const texSize = hero ? 1024 : 256;
  const useDeferred = deferred && hero;

  let cls = 'Unknown';
  let composition = 'unclassified';
  const spinSpeed = rng.range(0.01, 0.04);

  // The body-core texture currently bound to the material — the placeholder
  // until a deferred job's onDone swaps it, else always the final texture.
  // dispose() releases whichever this is at the time it runs.
  let mainTex: THREE.Texture | null = null;
  let deferredJob: HeroTextureJob | null = null;
  const onTex = (t: THREE.Texture): void => { mainTex = t; };
  const onJob = (j: HeroTextureJob): void => { deferredJob = j; };

  const mainGeo = sphere(radius, hero);

  if (kind === 'GAS_GIANT' || kind === 'RINGED') {
    const fi = familyIndex ?? rng.int(0, HUE_FAMILIES.length - 1);
    const family = HUE_FAMILIES[fi];
    const { mesh, mat } = buildCoreMesh(
      mainGeo,
      () => gasGiantTexture(rng, family, texSize, pinnedLightU),
      useDeferred ? (onDone) => beginGasGiantDeferred(rng, family, texSize, pinnedLightU, onDone) : null,
      onTex,
      onJob,
    );
    group.add(mesh);
    track(d, mainGeo, mat);
    addAtmosphere(group, radius, family.accent, rng, (geo, m) => track(d, geo, m));
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
    const { mesh, mat } = buildCoreMesh(
      mainGeo,
      () => rockyTexture(rng, texSize),
      useDeferred ? (onDone) => beginRockyDeferred(rng, texSize, onDone) : null,
      onTex,
      onJob,
    );
    group.add(mesh);
    track(d, mainGeo, mat);
    cls = 'Rocky / Terrestrial';
    composition = 'silicate, iron oxide';
  } else if (kind === 'ICE') {
    const { mesh, mat } = buildCoreMesh(
      mainGeo,
      () => iceTexture(rng, texSize),
      useDeferred ? (onDone) => beginIceDeferred(rng, texSize, onDone) : null,
      onTex,
      onJob,
    );
    group.add(mesh);
    track(d, mainGeo, mat);
    if (hero) addAtmosphere(group, radius, ICE_ATMO_TINT, rng, (geo, m) => track(d, geo, m));
    cls = 'Ice World';
    composition = 'water ice, ammonia';
  } else if (kind === 'LAVA') {
    const { mesh, mat } = buildCoreMesh(
      mainGeo,
      () => lavaBaseTexture(rng, texSize),
      useDeferred ? (onDone) => beginLavaBaseDeferred(rng, texSize, onDone) : null,
      onTex,
      onJob,
    );
    group.add(mesh);
    track(d, mainGeo, mat);

    // Emissive crack overlay (toneMapped=false so cracks bloom). Cheap
    // (~1-2ms even at hero size — no per-pixel loop), always synchronous.
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
    const { mesh, mat } = buildCoreMesh(
      mainGeo,
      () => moonTexture(rng, texSize),
      useDeferred ? (onDone) => beginMoonDeferred(rng, texSize, onDone) : null,
      onTex,
      onJob,
    );
    group.add(mesh);
    track(d, mainGeo, mat);
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
    // Cancel BEFORE disposing anything — a job whose onDone fires after this
    // would otherwise write mat.map on a (soon to be) disposed material.
    if (deferredJob) cancelHeroTextureJob(deferredJob);
    disposeAll(d);
    mainTex?.dispose();
  }

  return { group, tick, dispose, scan };
}
