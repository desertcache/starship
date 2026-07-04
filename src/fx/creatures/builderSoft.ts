/**
 * src/fx/creatures/builderSoft.ts — seeded assembly for the SOFT plans:
 * floater (jelly: squash/stretch bell + rim tentacles + emissive core) and
 * glider (ray: flat delta body + 2-segment flexing wing halves + tail
 * streamer). Shares parts.ts factories with builder.ts; geometry/materials
 * built once per species, nodes per instance.
 */

import * as THREE from 'three';
import type { CreatureSpec } from '../../core/worldTypes.js';
import { makeRng } from '../space/rng.js';
import { InstancePool } from './pool.js';
import type { CreatureRig, Disposables, GaitParams } from './rig.js';
import { makeMaterials, makeGeos, buildWhip, buildMarkings, buildRingMarkings } from './parts.js';
import type { InstanceBuild, Species } from './builder.js';

/** Legless plans still carry GaitParams (unused fields zeroed) to keep rig uniform. */
const NO_GAIT: GaitParams = { strideMin: 1, strideMax: 1, strideGain: 0, stepHeight: 0, duty: 0.5 };

// ── Floater (jelly) ──────────────────────────────────────────────────────────

export function makeFloater(spec: CreatureSpec, disp: Disposables): Species {
  const S = spec.sizeM;
  const mats = makeMaterials(spec, disp);
  const geos = makeGeos(disp);
  const bellR = S * 0.5;
  // Bell: dome = sphere upper hemisphere (open below the rim); slight overshoot
  // past the equator (0.62π) gives a skirt lip so it reads as a medusa.
  const bellGeo = new THREE.SphereGeometry(bellR, 10, 5, 0, Math.PI * 2, 0, Math.PI * 0.62);
  disp.geos.push(bellGeo);
  const coreGeo = new THREE.SphereGeometry(bellR * 0.34, 6, 4);
  disp.geos.push(coreGeo);
  // Translucent bell material (per-species, shared by the herd).
  const bellMat = new THREE.MeshStandardMaterial({
    color: mats.body.color.clone(),
    emissive: mats.body.emissive.clone(), emissiveIntensity: 0.25,
    roughness: 0.35, metalness: 0.0,
    transparent: true, opacity: 0.82, side: THREE.DoubleSide,
  });
  disp.mats.push(bellMat);
  // Tentacle count is seeded per instance (5-7) — pool sized for the max;
  // finalize() trims the draw count to used slots.
  const whipPool = new InstancePool(geos.whip, mats.accent, spec.count * 7 * 5);

  return {
    pools: [whipPool],
    assemble(index: number): InstanceBuild {
      const rng = makeRng((spec.seed ^ 0xf10a) + index * 71);
      const root = new THREE.Group();
      const body = new THREE.Group();
      root.add(body);

      const bell = new THREE.Group();          // scale target (squash/stretch)
      body.add(bell);
      const dome = new THREE.Mesh(bellGeo, bellMat);
      dome.castShadow = true;
      bell.add(dome);
      const core = new THREE.Mesh(coreGeo, mats.core);
      core.position.y = bellR * 0.12;
      bell.add(core);

      // 5-7 tentacles hung from the rim (rim y ≈ bell skirt line).
      const nTent = 5 + rng.int(0, 2);
      const rimY = -bellR * 0.28;
      const rimR = bellR * 0.85;
      const whips = [];
      for (let i = 0; i < nTent; i++) {
        const a = (i / nTent) * Math.PI * 2 + rng.signed(0.2);
        whips.push(buildWhip(
          bell,
          new THREE.Vector3(Math.cos(a) * rimR, rimY, Math.sin(a) * rimR),
          5, S * (0.85 + rng() * 0.3), bellR * 0.09, 7,
          (spec.seed + index * 29 + i * 3) & 0xffff, whipPool,
        ));
      }

      // Circumferential rim glow ring — the wave runs AROUND the bell rim.
      const markings = buildRingMarkings(bell, 8, rimR * 0.98, rimY * 0.7, S * 0.05, geos, mats.mark);

      const rig: CreatureRig = {
        plan: 'floater', body, standH: 0, legs: [], head: null,
        whips, bell, wings: null, markings,
        emissive: mats.core.color, gait: NO_GAIT,
      };
      return { root, rig };
    },
  };
}

// ── Glider (ray) ─────────────────────────────────────────────────────────────

export function makeGlider(spec: CreatureSpec, disp: Disposables): Species {
  const S = spec.sizeM;
  const mats = makeMaterials(spec, disp);
  const geos = makeGeos(disp);
  // Flat delta fuselage: squashed capsule along +Z.
  const fuseGeo = new THREE.CapsuleGeometry(S * 0.14, S * 0.5, 3, 7);
  fuseGeo.rotateX(Math.PI / 2);
  fuseGeo.scale(1.15, 0.45, 1);
  disp.geos.push(fuseGeo);
  // Wing panels: thin boxes, tapered by non-uniform scale at placement.
  const wingGeo = new THREE.BoxGeometry(1, 1, 1);
  disp.geos.push(wingGeo);

  const span = S * 0.62;       // per-side reach
  const innerW = span * 0.55;
  const outerW = span * 0.45;
  const whipPool = new InstancePool(geos.whip, mats.accent, spec.count * 4);

  return {
    pools: [whipPool],
    assemble(index: number): InstanceBuild {
      const root = new THREE.Group();
      const body = new THREE.Group();
      root.add(body);

      const fuse = new THREE.Mesh(fuseGeo, mats.body);
      fuse.castShadow = true;
      body.add(fuse);

      // Head wedge at the nose.
      const nose = new THREE.Mesh(geos.cone, mats.accent);
      nose.scale.set(S * 0.09, S * 0.18, S * 0.05);
      nose.rotation.x = Math.PI / 2;
      nose.position.set(0, 0, S * 0.42);
      body.add(nose);

      const mkWing = (side: 1 | -1): { rootP: THREE.Object3D; outP: THREE.Object3D } => {
        const rootP = new THREE.Object3D();
        rootP.position.set(side * S * 0.12, 0, S * 0.02);
        body.add(rootP);
        const inner = new THREE.Mesh(wingGeo, mats.body);
        inner.scale.set(innerW, S * 0.035, S * 0.46);
        inner.position.set(side * innerW * 0.5, 0, -S * 0.04);
        inner.castShadow = true;
        rootP.add(inner);
        const outP = new THREE.Object3D();
        outP.position.set(side * innerW, 0, -S * 0.04);
        rootP.add(outP);
        const outer = new THREE.Mesh(wingGeo, mats.accent);
        outer.scale.set(outerW, S * 0.028, S * 0.3);
        outer.position.set(side * outerW * 0.5, 0, -S * 0.03);
        outer.castShadow = true;
        outP.add(outer);
        return { rootP, outP };
      };
      const L = mkWing(-1);
      const R = mkWing(1);

      const streamer = buildWhip(
        body, new THREE.Vector3(0, 0, -S * 0.42),
        4, S * 0.7, S * 0.045, 8, (spec.seed + index * 17) & 0xffff, whipPool,
      );

      const markings = buildMarkings(
        body, 5,
        new THREE.Vector3(0, S * 0.05, S * 0.34),
        new THREE.Vector3(0, S * 0.05, -S * 0.38),
        S * 0.035, geos, mats.mark,
      );

      const rig: CreatureRig = {
        plan: 'glider', body, standH: 0, legs: [], head: null,
        whips: [streamer], bell: null,
        wings: { l: L.rootP, r: R.rootP, lOut: L.outP, rOut: R.outP },
        markings, emissive: mats.core.color, gait: NO_GAIT,
      };
      return { root, rig };
    },
  };
}
