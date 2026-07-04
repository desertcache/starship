/**
 * src/fx/creatures/parts.ts — shared primitive factories for every BodyPlan.
 *
 * Materials + generic geometry are minted ONCE per species (herd instances
 * share them). Repeated small parts (leg segments, feet, cones, whip segments)
 * go through per-species InstancePools (pool.ts) so a whole herd's limbs cost
 * one draw call. Emissive markings use a shared unlit `toneMapped:false`
 * material with a PER-MESH instanceColor buffer, so each creature runs an
 * independent propagating glow wave (livingness T1) + startle flash without
 * cloning materials.
 */

import * as THREE from 'three';
import type { CreatureSpec } from '../../core/worldTypes.js';
import { Whip } from './math.js';
import { InstancePool } from './pool.js';
import { floorColor, type Disposables, type LegRig, type MarkingRig } from './rig.js';

export interface Materials {
  body: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  mark: THREE.MeshBasicMaterial;   // unlit glow; instanceColor drives hue
  core: THREE.MeshBasicMaterial;   // bright emissive core / tips
}

/** Generic unit geometries shared across a species (dispose-tracked). */
export interface Geos {
  limb: THREE.CylinderGeometry;    // r=1, h=1, open — scaled per segment
  foot: THREE.SphereGeometry;      // r=1
  mark: THREE.SphereGeometry;      // r=1 glow node
  whip: THREE.CylinderGeometry;    // r=1, h=1, open — tapered per segment
  cone: THREE.ConeGeometry;        // r=1, h=1, apex +Y — snouts / horns / spurs
}

export function makeMaterials(spec: CreatureSpec, disp: Disposables): Materials {
  const emissive = floorColor(spec.palette.emissive, 0.02);
  const body = new THREE.MeshStandardMaterial({
    color: floorColor(spec.palette.primary),
    roughness: 0.58, metalness: 0.05,
    emissive, emissiveIntensity: 0.12,
  });
  const accent = new THREE.MeshStandardMaterial({
    color: floorColor(spec.palette.secondary),
    roughness: 0.5, metalness: 0.08,
    emissive, emissiveIntensity: 0.1,
  });
  const mark = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const core = new THREE.MeshBasicMaterial({ color: emissive.clone(), toneMapped: false });
  disp.mats.push(body, accent, mark, core);
  return { body, accent, mark, core };
}

export function makeGeos(disp: Disposables): Geos {
  // Deliberately low-poly (comic style, ≤600 tris/creature): 5-radial limbs,
  // 5x3 feet, 4x3 glow nodes. Silhouette carries the read, not tessellation.
  const limb = new THREE.CylinderGeometry(1, 1, 1, 5, 1, true);
  const foot = new THREE.SphereGeometry(1, 5, 3);
  const mark = new THREE.SphereGeometry(1, 4, 3);
  const whip = new THREE.CylinderGeometry(1, 0.7, 1, 5, 1, true);
  const cone = new THREE.ConeGeometry(1, 1, 6, 1, false);
  disp.geos.push(limb, foot, mark, whip, cone);
  return { limb, foot, mark, whip, cone };
}

export interface LegDef { x: number; z: number; phase: number; kneeSign: number; }

/**
 * Build one 2-bone leg (hip→knee→foot) under `body`. Pivots are real
 * Object3Ds (animate.ts writes hip/knee pitch); the visible upper/lower
 * segments + foot are pool instances mirroring those pivots each sync.
 */
export function buildLeg(
  body: THREE.Object3D, d: LegDef, upper: number, lower: number,
  reach: number, limbR: number, limbPool: InstancePool, footPool: InstancePool,
): LegRig {
  const hip = new THREE.Object3D();
  hip.position.set(d.x, 0, d.z);
  body.add(hip);
  limbPool.allocNode(hip, new THREE.Vector3(0, -upper * 0.5, 0), new THREE.Vector3(limbR, upper, limbR));
  const knee = new THREE.Object3D();
  knee.position.y = -upper;
  hip.add(knee);
  limbPool.allocNode(knee, new THREE.Vector3(0, -lower * 0.5, 0), new THREE.Vector3(limbR * 0.82, lower, limbR * 0.82));
  footPool.allocNode(knee, new THREE.Vector3(0, -lower, 0), new THREE.Vector3(limbR * 1.15, limbR * 1.15, limbR * 1.15));
  return { hip, knee, upper, lower, reach, phase: d.phase, kneeSign: d.kneeSign };
}

/**
 * Build a springy appendage (tail / antenna / tentacle / streamer): n tapered
 * segments as free slots in the species whip pool, driven by a Whip hung off
 * `anchor` at `baseLocal` (world-space solve — see math.ts).
 */
export function buildWhip(
  anchor: THREE.Object3D, baseLocal: THREE.Vector3,
  n: number, totalLen: number, baseR: number, omega: number, seed: number,
  whipPool: InstancePool,
): Whip {
  const segLen = totalLen / n;
  const slots: number[] = [];
  const radii: number[] = [];
  for (let i = 0; i < n; i++) {
    slots.push(whipPool.allocFree());
    radii.push(baseR * (1 - 0.65 * i / n));
  }
  return new Whip(anchor, baseLocal, { pool: whipPool, slots, radii, segLen }, omega, seed);
}

const _m4 = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();

/**
 * Emissive marking strip: `count` glow nodes evenly placed from `from`→`to` in
 * the parent's local space, one InstancedMesh (1 draw call). `phases[i]` = the
 * node's normalised position for the propagating brightness wave.
 */
export function buildMarkings(
  parent: THREE.Object3D, count: number, from: THREE.Vector3, to: THREE.Vector3,
  size: number, geos: Geos, mat: THREE.MeshBasicMaterial,
): MarkingRig {
  const mesh = new THREE.InstancedMesh(geos.mark, mat, count);
  const phases: number[] = [];
  _q.identity();
  _s.setScalar(size);
  const pos = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0.5;
    pos.lerpVectors(from, to, t);
    _m4.compose(pos, _q, _s);
    mesh.setMatrixAt(i, _m4);
    mesh.setColorAt(i, mat.color);
    phases.push(t);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  parent.add(mesh);
  return { mesh, phases, count };
}

/**
 * Circumferential marking ring (jelly bell rim): `count` glow nodes around a
 * circle of `radius` at height `y`. `phases[i] = i/count` so the wave runs
 * AROUND the rim (livingness T1 for the floater).
 */
export function buildRingMarkings(
  parent: THREE.Object3D, count: number, radius: number, y: number,
  size: number, geos: Geos, mat: THREE.MeshBasicMaterial,
): MarkingRig {
  const mesh = new THREE.InstancedMesh(geos.mark, mat, count);
  const phases: number[] = [];
  _q.identity();
  _s.setScalar(size);
  const pos = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    pos.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
    _m4.compose(pos, _q, _s);
    mesh.setMatrixAt(i, _m4);
    mesh.setColorAt(i, mat.color);
    phases.push(i / count);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  parent.add(mesh);
  return { mesh, phases, count };
}
