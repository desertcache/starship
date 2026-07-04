/**
 * src/world/worlds/verdantFlora.ts — ground flora for the VERDANT glade:
 * glow-cap mushroom clusters, kelp-like frond clusters, a mineral spring, and
 * the firefly Points system. Tree forms (incl. the hollow relic tree) live in
 * verdantTrees.ts — imports `makeWaveGlowMesh` from here so both files pulse
 * with the same livingness technique.
 *
 * LIVINGNESS (T1): glow caps/tips are each an INDIVIDUAL small mesh with its
 * own MeshBasicMaterial (never shared — glow.ts's blinking-LED pattern), and
 * its own onBeforeRender that recolors it from a phase derived from distance
 * to its cluster center. Neighboring instances share nearly the same phase,
 * so brightness visibly RIPPLES outward through the cluster instead of every
 * cap blinking in lockstep. Non-glow parts (stems/blades) are static and
 * merged into one draw call per species via mergeGeometries (terrain.ts's
 * bake-matrix-then-merge technique) since they never animate.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { makeRng } from '../../fx/space/rng.js';

const MUSHROOM_SEED = 0x7b01;
const FROND_SEED = 0x7b02;

const STEM_COLOR = 0xcfe4d6;
const BLADE_COLOR = 0x9fd0b8;
const GLOW_TEAL = 0x66f2e2;
const GLOW_VIOLET = 0xa878ff;

/** Shared per-instance pulsing glow mesh — never merged (each animates independently). */
export function makeWaveGlowMesh(
  geo: THREE.BufferGeometry,
  baseColorHex: number,
  phase: number,
  speed = 1.5,
  minMul = 0.38,
  maxMul = 1.7,
): THREE.Mesh {
  const base = new THREE.Color(baseColorHex);
  const mat = new THREE.MeshBasicMaterial({ color: base.clone(), toneMapped: false });
  const mesh = new THREE.Mesh(geo, mat);
  const tmp = new THREE.Color();
  mesh.onBeforeRender = (): void => {
    const t = performance.now() / 1000;
    const wave = 0.5 + 0.5 * Math.sin(t * speed - phase);
    const mul = minMul + (maxMul - minMul) * Math.pow(wave, 2.0);
    tmp.copy(base).multiplyScalar(mul);
    mat.color.copy(tmp);
  };
  return mesh;
}

function mergeInstances(template: THREE.BufferGeometry, mats: THREE.Matrix4[]): THREE.BufferGeometry {
  const clones = mats.map((m) => {
    const c = template.clone();
    c.applyMatrix4(m);
    return c;
  });
  const merged = mergeGeometries(clones);
  for (const c of clones) c.dispose();
  return merged ?? template.clone();
}

export interface FloraCluster {
  group: THREE.Group;
  heroMesh: THREE.Mesh;
  heroPosition: THREE.Vector3;
  fireflyCenters: THREE.Vector3[];
  dispose(): void;
}

const MUSHROOM_CLUSTERS = [
  { x: 6, z: 10 }, { x: -18, z: 6 }, { x: 16, z: -22 },
  // Foreground of the verdant-qa frame (appended LAST — earlier clusters'
  // seeded rng draws are untouched, so their layout is stable across rounds).
  { x: -11, z: -4.5 },
];

export function buildMushroomClusters(g: (x: number, z: number) => number): FloraCluster {
  const rng = makeRng(MUSHROOM_SEED);
  const group = new THREE.Group();
  group.name = 'verdant-mushrooms';
  const stemTemplate = new THREE.CylinderGeometry(0.06, 0.09, 1, 6);
  const capTemplate = new THREE.SphereGeometry(1, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const stemMats: THREE.Matrix4[] = [];
  const centers: THREE.Vector3[] = [];
  const glowMeshes: THREE.Mesh[] = [];
  let heroMesh: THREE.Mesh | null = null;
  let heroPos = new THREE.Vector3();

  for (const c of MUSHROOM_CLUSTERS) {
    centers.push(new THREE.Vector3(c.x, g(c.x, c.z), c.z));
    const count = rng.int(4, 7);
    for (let i = 0; i < count; i++) {
      const ang = rng() * Math.PI * 2;
      const rad = rng.range(0.4, 2.4);
      const x = c.x + Math.cos(ang) * rad;
      const z = c.z + Math.sin(ang) * rad;
      const y = g(x, z);
      const scaleY = rng.range(0.55, 1.25);
      const scaleXZ = rng.range(0.7, 1.15) * scaleY;
      const stemH = 0.55 * scaleY;
      const m = new THREE.Matrix4().compose(
        new THREE.Vector3(x, y + stemH * 0.5, z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rng() * Math.PI * 2, 0)),
        new THREE.Vector3(scaleXZ, stemH, scaleXZ),
      );
      stemMats.push(m);

      const capR = 0.24 * scaleXZ;
      const capGeo = capTemplate.clone();
      capGeo.scale(capR, capR * 0.85, capR);
      const phase = rad * 1.6 + rng.range(0, 0.5);
      const color = rng() < 0.6 ? GLOW_TEAL : GLOW_VIOLET;
      const cap = makeWaveGlowMesh(capGeo, color, phase);
      cap.position.set(x, y + stemH, z);
      group.add(cap);
      glowMeshes.push(cap);
      if (!heroMesh) { heroMesh = cap; heroPos = cap.position.clone(); }
    }
  }
  capTemplate.dispose();

  const stemGeo = mergeInstances(stemTemplate, stemMats);
  stemTemplate.dispose();
  const stemMat = new THREE.MeshStandardMaterial({ color: STEM_COLOR, roughness: 0.85, metalness: 0.0 });
  const stemMesh = new THREE.Mesh(stemGeo, stemMat);
  stemMesh.castShadow = true;
  group.add(stemMesh);

  return {
    group,
    heroMesh: heroMesh!,
    heroPosition: heroPos,
    fireflyCenters: centers,
    dispose(): void {
      stemGeo.dispose(); stemMat.dispose();
      for (const m of glowMeshes) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
    },
  };
}

const FROND_CLUSTERS = [
  { x: -20, z: 16 }, { x: 12, z: -6 },
];

export function buildFrondClusters(g: (x: number, z: number) => number): FloraCluster {
  const rng = makeRng(FROND_SEED);
  const group = new THREE.Group();
  group.name = 'verdant-fronds';
  const bladeTemplate = new THREE.CylinderGeometry(0.015, 0.05, 1, 5);
  const tipTemplate = new THREE.OctahedronGeometry(1, 0);
  const bladeMats: THREE.Matrix4[] = [];
  const centers: THREE.Vector3[] = [];
  const glowMeshes: THREE.Mesh[] = [];
  let heroMesh: THREE.Mesh | null = null;
  let heroPos = new THREE.Vector3();

  for (const c of FROND_CLUSTERS) {
    centers.push(new THREE.Vector3(c.x, g(c.x, c.z), c.z));
    const plants = rng.int(5, 8);
    for (let p = 0; p < plants; p++) {
      const pAng = rng() * Math.PI * 2;
      const pRad = rng.range(0.3, 3.0);
      const px = c.x + Math.cos(pAng) * pRad;
      const pz = c.z + Math.sin(pAng) * pRad;
      const py = g(px, pz);
      const blades = rng.int(2, 4);
      for (let b = 0; b < blades; b++) {
        const tilt = rng.range(-0.28, 0.28);
        const yaw = rng() * Math.PI * 2;
        const h = rng.range(1.1, 2.3);
        const r = rng.range(0.85, 1.1);
        const q = new THREE.Quaternion()
          .setFromEuler(new THREE.Euler(tilt, yaw, tilt * 0.6));
        const basePos = new THREE.Vector3(px, py, pz);
        const m = new THREE.Matrix4().compose(
          basePos.clone().add(new THREE.Vector3(0, h * 0.5, 0)),
          q,
          new THREE.Vector3(r, h, r),
        );
        bladeMats.push(m);

        // ONE glow tip per plant (b === 0), not per blade — each tip is an
        // individually-animated mesh (own draw call), and per-blade tips
        // would mint 40-60 draws in this cluster type alone (budget ≤120
        // for the whole scene). The remaining blades read as unlit foliage
        // silhouettes around the lit one, which looks MORE organic anyway.
        if (b === 0) {
          const tipOffset = new THREE.Vector3(0, h, 0).applyQuaternion(q);
          const tipPos = basePos.clone().add(tipOffset);
          const tipR = 0.11 * r;
          const tipGeo = tipTemplate.clone();
          tipGeo.scale(tipR, tipR * 1.6, tipR);
          const phase = pRad * 1.4 + rng.range(0, 0.6);
          const color = rng() < 0.5 ? GLOW_VIOLET : GLOW_TEAL;
          const tip = makeWaveGlowMesh(tipGeo, color, phase, 1.1);
          tip.position.copy(tipPos);
          group.add(tip);
          glowMeshes.push(tip);
          if (!heroMesh) { heroMesh = tip; heroPos = tip.position.clone(); }
        }
      }
    }
  }
  tipTemplate.dispose();

  const bladeGeo = mergeInstances(bladeTemplate, bladeMats);
  bladeTemplate.dispose();
  const bladeMat = new THREE.MeshStandardMaterial({ color: BLADE_COLOR, roughness: 0.8, metalness: 0.0 });
  const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
  bladeMesh.castShadow = true;
  group.add(bladeMesh);

  return {
    group,
    heroMesh: heroMesh!,
    heroPosition: heroPos,
    fireflyCenters: centers,
    dispose(): void {
      bladeGeo.dispose(); bladeMat.dispose();
      for (const m of glowMeshes) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
    },
  };
}

// Mineral spring + firefly Points system live in verdantLife.ts (kept this
// file under the 300-line cap); both import makeWaveGlowMesh from here.
