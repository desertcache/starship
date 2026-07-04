/**
 * src/fx/creatures/builder.ts — seeded procedural assembly for the LEGGED plans
 * (quadruped, skitterer) plus the species dispatcher. Soft-body plans (floater,
 * glider) live in builderSoft.ts. NO SkinnedMesh / AnimationMixer — everything
 * is a transform hierarchy of shared primitives so animate.ts can pose it with
 * plain rotations + our own 2-bone IK.
 *
 * Geometry + materials are built ONCE per species; repeated small parts render
 * through per-species InstancePools (limbs/feet/cones/whip segments), so a herd
 * costs a handful of draw calls. assemble(index) only mints pivots + the few
 * unique meshes (torso, skull). ≤600 tris/creature.
 */

import * as THREE from 'three';
import type { CreatureSpec } from '../../core/worldTypes.js';
import { makeRng } from '../space/rng.js';
import { InstancePool } from './pool.js';
import type { CreatureRig, Disposables, GaitParams } from './rig.js';
import { makeMaterials, makeGeos, buildLeg, buildWhip, buildMarkings, type LegDef } from './parts.js';
import { makeFloater, makeGlider } from './builderSoft.js';

export interface InstanceBuild {
  root: THREE.Group; // named by the facade with the interactable id
  rig: CreatureRig;
}
export interface Species {
  assemble(index: number): InstanceBuild;
  /** Per-species instanced draw pools; the facade finalizes, adds and syncs. */
  pools: InstancePool[];
}

/** Torso capsule laid along +Z (forward), built once and shared. */
function torsoGeo(r: number, len: number, disp: Disposables): THREE.CapsuleGeometry {
  const g = new THREE.CapsuleGeometry(r, len, 3, 7);
  g.rotateX(Math.PI / 2); // Y-axis capsule → Z-axis (forward)
  disp.geos.push(g);
  return g;
}

// ── Quadruped ────────────────────────────────────────────────────────────────

function makeQuadruped(spec: CreatureSpec, disp: Disposables): Species {
  const S = spec.sizeM;
  const n = spec.count;
  const mats = makeMaterials(spec, disp);
  const geos = makeGeos(disp);
  const rBody = S * 0.16;
  const bodyLen = S * 0.5;
  const tGeo = torsoGeo(rBody, bodyLen, disp);
  const headGeo = new THREE.SphereGeometry(S * 0.13, 7, 6);
  disp.geos.push(headGeo);
  const upper = S * 0.21;
  const lower = S * 0.21;
  const reach = (upper + lower) * 0.8;
  const standH = reach; // torso pivot at hip line above the foot plane
  // Phase stays DISTANCE-driven (no skate); spec.gaitHz sets CADENCE by scaling
  // stride inversely — higher gaitHz = shorter, quicker steps at a given speed.
  const sf = THREE.MathUtils.clamp(1.2 / Math.max(spec.gaitHz, 0.2), 0.35, 2);
  const gait: GaitParams = {
    strideMin: S * 0.28 * sf, strideMax: S * 0.62 * sf, strideGain: 0.55 * sf,
    stepHeight: S * 0.13, duty: 0.55,
  };
  const half = bodyLen * 0.5 + rBody;
  const xS = rBody * 0.95;
  // Trot: diagonal pairs move together (FL+HR @0, FR+HL @0.5).
  const legDefs: LegDef[] = [
    { x: -xS, z: half * 0.62, phase: 0.0, kneeSign: 1 },   // FL
    { x: xS, z: half * 0.62, phase: 0.5, kneeSign: 1 },    // FR
    { x: -xS, z: -half * 0.62, phase: 0.5, kneeSign: -1 }, // HL
    { x: xS, z: -half * 0.62, phase: 0.0, kneeSign: -1 },  // HR
  ];

  const limbPool = new InstancePool(geos.limb, mats.body, n * 8);
  const footPool = new InstancePool(geos.foot, mats.accent, n * 4);
  const conePool = new InstancePool(geos.cone, mats.accent, n * 3);
  const whipPool = new InstancePool(geos.whip, mats.body, n * 5);

  return {
    pools: [limbPool, footPool, conePool, whipPool],
    assemble(index: number): InstanceBuild {
      const rng = makeRng((spec.seed ^ 0x9e37) + index * 101);
      const root = new THREE.Group();
      const body = new THREE.Group();
      body.position.y = standH;
      root.add(body);

      const torso = new THREE.Mesh(tGeo, mats.body);
      torso.castShadow = true;
      body.add(torso);

      // Neck + head (pivot at front-top of torso; head look-at drives it live).
      const head = new THREE.Group();
      head.position.set(0, rBody * 0.5 + S * 0.14, half - rBody * 0.2);
      const skull = new THREE.Mesh(headGeo, mats.body);
      skull.castShadow = true;
      head.add(skull);
      conePool.allocNode( // snout, apex forward (+Z)
        head, new THREE.Vector3(0, -S * 0.02, S * 0.12),
        new THREE.Vector3(S * 0.06, S * 0.16, S * 0.06), new THREE.Euler(Math.PI / 2, 0, 0),
      );
      // Seed variant: horns (up) or ears (back-swept cones).
      const horns = rng() < 0.5;
      for (const sx of [-1, 1]) {
        if (horns) {
          conePool.allocNode(
            head, new THREE.Vector3(sx * S * 0.05, S * 0.11, S * 0.02),
            new THREE.Vector3(S * 0.03, S * 0.11, S * 0.03), new THREE.Euler(0, 0, -sx * 0.3),
          );
        } else {
          conePool.allocNode(
            head, new THREE.Vector3(sx * S * 0.07, S * 0.08, -S * 0.02),
            new THREE.Vector3(S * 0.025, S * 0.09, S * 0.05), new THREE.Euler(-0.5, 0, -sx * 0.5),
          );
        }
      }
      body.add(head);

      const legs = legDefs.map((d) => buildLeg(body, d, upper, lower, reach, rBody * 0.36, limbPool, footPool));

      const tail = buildWhip(
        body, new THREE.Vector3(0, rBody * 0.4, -half + rBody * 0.2),
        5, S * 0.5, rBody * 0.5, 9, (spec.seed + index * 7) & 0xffff, whipPool,
      );

      const markings = buildMarkings(
        body, 5,
        new THREE.Vector3(0, rBody * 0.9, half * 0.5),
        new THREE.Vector3(0, rBody * 0.9, -half * 0.75),
        S * 0.045, geos, mats.mark,
      );

      const rig: CreatureRig = {
        plan: 'quadruped', body, standH, legs, head,
        whips: [tail], bell: null, wings: null, markings,
        emissive: mats.core.color, gait,
      };
      return { root, rig };
    },
  };
}

// ── Skitterer (6-leg alternating tripod) ──────────────────────────────────────

function makeSkitterer(spec: CreatureSpec, disp: Disposables): Species {
  const S = spec.sizeM;
  const n = spec.count;
  const mats = makeMaterials(spec, disp);
  const geos = makeGeos(disp);
  const rBody = S * 0.28;
  const bodyGeo = new THREE.SphereGeometry(1, 9, 6);
  disp.geos.push(bodyGeo);
  const upper = S * 0.2;
  const lower = S * 0.2;
  const reach = (upper + lower) * 0.62;
  const standH = reach;
  // Same cadence rule as the quadruped (see comment there).
  const sf = THREE.MathUtils.clamp(1.2 / Math.max(spec.gaitHz, 0.2), 0.35, 2);
  const gait: GaitParams = {
    strideMin: S * 0.2 * sf, strideMax: S * 0.5 * sf, strideGain: 0.6 * sf,
    stepHeight: S * 0.1, duty: 0.6,
  };
  const xS = rBody * 1.05;
  // Alternating tripod: {FL, MR, RL}@0 vs {FR, ML, RR}@0.5.
  const legDefs: LegDef[] = [
    { x: -xS, z: rBody * 1.1, phase: 0.0, kneeSign: 1 },
    { x: xS, z: rBody * 1.1, phase: 0.5, kneeSign: 1 },
    { x: -xS, z: 0, phase: 0.5, kneeSign: 1 },
    { x: xS, z: 0, phase: 0.0, kneeSign: 1 },
    { x: -xS, z: -rBody * 1.1, phase: 0.0, kneeSign: -1 },
    { x: xS, z: -rBody * 1.1, phase: 0.5, kneeSign: -1 },
  ];

  const limbPool = new InstancePool(geos.limb, mats.body, n * 12);
  const footPool = new InstancePool(geos.foot, mats.accent, n * 6);
  const whipPool = new InstancePool(geos.whip, mats.accent, n * 8);

  return {
    pools: [limbPool, footPool, whipPool],
    assemble(index: number): InstanceBuild {
      const root = new THREE.Group();
      const body = new THREE.Group();
      body.position.y = standH;
      root.add(body);

      const shell = new THREE.Mesh(bodyGeo, mats.body);
      shell.scale.set(rBody * 1.15, rBody * 0.6, rBody * 1.45); // low ellipsoid
      shell.castShadow = true;
      body.add(shell);

      // Head node at the front — anchors the antennae + a tiny face bump.
      const head = new THREE.Group();
      head.position.set(0, rBody * 0.2, rBody * 1.4);
      const face = new THREE.Mesh(geos.foot, mats.accent);
      face.scale.setScalar(rBody * 0.4);
      head.add(face);
      body.add(head);

      const legs = legDefs.map((d) => buildLeg(body, d, upper, lower, reach, rBody * 0.16, limbPool, footPool));

      const ant: ReturnType<typeof buildWhip>[] = [];
      for (const sx of [-1, 1]) {
        ant.push(buildWhip(
          head, new THREE.Vector3(sx * rBody * 0.25, rBody * 0.3, rBody * 0.2),
          4, S * 0.34, rBody * 0.12, 16, ((spec.seed + index * 13) ^ (sx > 0 ? 7 : 3)) & 0xffff,
          whipPool,
        ));
      }

      const markings = buildMarkings(
        body, 4,
        new THREE.Vector3(0, rBody * 0.5, rBody * 1.1),
        new THREE.Vector3(0, rBody * 0.5, -rBody * 1.2),
        S * 0.05, geos, mats.mark,
      );

      const rig: CreatureRig = {
        plan: 'skitterer', body, standH, legs, head,
        whips: ant, bell: null, wings: null, markings,
        emissive: mats.core.color, gait,
      };
      return { root, rig };
    },
  };
}

/** Dispatch to the right builder for a species. */
export function buildSpecies(spec: CreatureSpec, disp: Disposables): Species {
  switch (spec.plan) {
    case 'quadruped': return makeQuadruped(spec, disp);
    case 'skitterer': return makeSkitterer(spec, disp);
    case 'floater': return makeFloater(spec, disp);
    case 'glider': return makeGlider(spec, disp);
  }
}
