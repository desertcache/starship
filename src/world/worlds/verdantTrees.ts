/**
 * src/world/worlds/verdantTrees.ts — the 3 larger tree forms for the VERDANT
 * glade: 2 solid trunks with hanging glow-vine canopies, plus 1 HOLLOW
 * glow-tree big enough to step inside (the relic pod hides in its heartwood).
 *
 * The hollow trunk is built as a partial-theta CylinderGeometry shell (a
 * `thetaLength < 2π` doorway gap) — same "build the gap from real geometry,
 * no CSG, no cutout texture" rule as the corridor porthole gotcha in
 * CLAUDE.md — so the player can walk inside without a fake see-through hole.
 * Collision mirrors terrain.ts's ring-of-overlapping-AABBs technique but
 * leaves the doorway arc open.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { makeRng } from '../../fx/space/rng.js';
import type { AABB } from '../types.js';
import { verdantBarkTexture } from './verdantTextures.js';
import { makeWaveGlowMesh } from './verdantFlora.js';

const VINE_SEED = 0x7b05;
const GLOW_VIOLET = 0xa878ff;
const GLOW_TEAL = 0x66f2e2;
const CANOPY_COLOR = 0x3d6b52;
const TRUNK_RING_SEGMENTS = 10;

interface TreeSite { x: number; z: number; trunkR: number; height: number; hollow?: boolean; doorAngle?: number; }

const SOLID_TREES: TreeSite[] = [
  { x: 8, z: -16, trunkR: 0.85, height: 6.2 },
  { x: -24, z: -20, trunkR: 0.95, height: 6.8 },
];
// doorAngle: CylinderGeometry theta convention is x=sin(θ), z=cos(θ), so the
// doorway arc [doorAngle, doorAngle+gap] centered at θ≈0.12π faces (+0.37,
// +0.93) in XZ — toward the spawn pad AND the verdant-qa camera, which looks
// straight into the hollow at the glowing relic.
const HOLLOW_TREE: TreeSite = { x: -14, z: -8, trunkR: 1.45, height: 7.4, hollow: true, doorAngle: -Math.PI * 0.18 };

function addVines(group: THREE.Group, cx: number, cz: number, topY: number, canopyR: number, rng: ReturnType<typeof makeRng>, ribbonMats: THREE.Matrix4[], glowMeshes: THREE.Mesh[]): void {
  const count = rng.int(4, 6);
  for (let i = 0; i < count; i++) {
    const ang = rng() * Math.PI * 2;
    const r = rng.range(0.2, canopyR * 0.85);
    const x = cx + Math.cos(ang) * r;
    const z = cz + Math.sin(ang) * r;
    const len = rng.range(1.4, 3.0);
    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(x, topY - len * 0.5, z),
      new THREE.Quaternion(),
      new THREE.Vector3(0.05, len, 0.05),
    );
    ribbonMats.push(m);

    const tipGeo = new THREE.SphereGeometry(0.13, 6, 5);
    const phase = r * 1.5 + rng.range(0, 0.7);
    const color = rng() < 0.5 ? GLOW_VIOLET : GLOW_TEAL;
    const tip = makeWaveGlowMesh(tipGeo, color, phase, 1.3);
    tip.position.set(x, topY - len, z);
    group.add(tip);
    glowMeshes.push(tip);
  }
}

export interface TreesHandle {
  group: THREE.Group;
  colliders: AABB[];
  heartwoodMesh: THREE.Mesh;
  heartwoodPosition: THREE.Vector3;
  relicMesh: THREE.Mesh;
  relicPosition: THREE.Vector3;
  fireflyCenters: THREE.Vector3[];
  dispose(): void;
}

export function buildVerdantTrees(g: (x: number, z: number) => number): TreesHandle {
  const rng = makeRng(VINE_SEED);
  const group = new THREE.Group();
  group.name = 'verdant-trees';
  const bark = verdantBarkTexture();
  // Emissive floors (livingness directive "albedo floors — no void-black"):
  // at deep dusk the hemi alone left trunks/canopies as pure black cutouts
  // (art-gate round 1). A faint self-glow keeps their form readable while
  // still silhouetting against the brighter dome.
  const trunkMat = new THREE.MeshStandardMaterial({
    map: bark, color: 0xd8cdb8, roughness: 0.95, metalness: 0.0,
    emissive: 0x2a2018, emissiveIntensity: 0.7,
  });
  const canopyMat = new THREE.MeshStandardMaterial({
    color: CANOPY_COLOR, roughness: 0.85, metalness: 0.0,
    // F5 (Stage E): canopies were reading dead-black — brighter emissive
    // floor while staying below the bloom threshold (silhouette, not glow).
    emissive: 0x1e5238, emissiveIntensity: 1.0,
  });

  const trunkTemplate = new THREE.CylinderGeometry(1, 1.2, 1, 9);
  const canopyTemplate = new THREE.IcosahedronGeometry(1, 1);
  const trunkMats: THREE.Matrix4[] = [];
  const canopyMats: THREE.Matrix4[] = [];
  const ribbonMats: THREE.Matrix4[] = [];
  const ribbonTemplate = new THREE.CylinderGeometry(1, 1, 1, 3);
  const glowMeshes: THREE.Mesh[] = [];
  const colliders: AABB[] = [];
  const fireflyCenters: THREE.Vector3[] = [];

  for (const t of SOLID_TREES) {
    const y = g(t.x, t.z);
    fireflyCenters.push(new THREE.Vector3(t.x, y + t.height * 0.6, t.z));
    trunkMats.push(new THREE.Matrix4().compose(
      new THREE.Vector3(t.x, y + t.height * 0.5, t.z), new THREE.Quaternion(),
      new THREE.Vector3(t.trunkR, t.height, t.trunkR),
    ));
    const canopyR = t.trunkR * 2.6;
    canopyMats.push(new THREE.Matrix4().compose(
      new THREE.Vector3(t.x, y + t.height + canopyR * 0.4, t.z), new THREE.Quaternion(),
      new THREE.Vector3(canopyR, canopyR * 0.7, canopyR),
    ));
    addVines(group, t.x, t.z, y + t.height + 0.4, canopyR, rng, ribbonMats, glowMeshes);
    colliders.push({
      minX: t.x - t.trunkR, maxX: t.x + t.trunkR, minY: y - 1, maxY: y + t.height + 1,
      minZ: t.z - t.trunkR, maxZ: t.z + t.trunkR,
    });
  }

  // ── Hollow heartwood tree (relic + HEARTWOOD SENTINEL scan) ──────────────
  const hx = HOLLOW_TREE.x, hz = HOLLOW_TREE.z, hr = HOLLOW_TREE.trunkR, hh = HOLLOW_TREE.height;
  const hy = g(hx, hz);
  const gapLen = Math.PI * 0.6;
  const doorStart0 = HOLLOW_TREE.doorAngle!;
  // Shell sweeps the COMPLEMENT of the doorway arc [doorStart0, doorStart0+gapLen)
  // — starts right after the gap and wraps all the way back around to it.
  const shellGeo = new THREE.CylinderGeometry(hr, hr * 1.15, hh, 14, 1, true, doorStart0 + gapLen, Math.PI * 2 - gapLen);
  const shellMesh = new THREE.Mesh(shellGeo, trunkMat);
  shellMesh.position.set(hx, hy + hh / 2, hz);
  shellMesh.name = 'verdant-heartwood';
  shellMesh.castShadow = true;
  group.add(shellMesh);

  const floorGeo = new THREE.CylinderGeometry(hr * 0.92, hr * 0.92, 0.1, 14);
  const floorMesh = new THREE.Mesh(floorGeo, canopyMat);
  floorMesh.position.set(hx, hy + 0.05, hz);
  group.add(floorMesh);

  const hCanopyR = hr * 2.8;
  canopyMats.push(new THREE.Matrix4().compose(
    new THREE.Vector3(hx, hy + hh + hCanopyR * 0.4, hz), new THREE.Quaternion(),
    new THREE.Vector3(hCanopyR, hCanopyR * 0.7, hCanopyR),
  ));
  addVines(group, hx, hz, hy + hh + 0.4, hCanopyR, rng, ribbonMats, glowMeshes);
  fireflyCenters.push(new THREE.Vector3(hx, hy + hh * 0.5, hz));

  // Partial ring of overlapping AABBs around the trunk, leaving the doorway
  // open. MUST use the same angular convention as CylinderGeometry —
  // x = sin(θ), z = cos(θ) — or the collider gap rotates away from the
  // visual doorway (caught in art-gate round 1: cos/sin were swapped).
  for (let i = 0; i < TRUNK_RING_SEGMENTS; i++) {
    const a = (i / TRUNK_RING_SEGMENTS) * Math.PI * 2;
    const da = ((a - doorStart0) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    if (da < gapLen) continue; // inside the doorway arc — leave passable
    const cx = hx + Math.sin(a) * hr;
    const cz = hz + Math.cos(a) * hr;
    const half = 0.45;
    colliders.push({
      minX: cx - half, maxX: cx + half, minY: hy - 1, maxY: hy + hh,
      minZ: cz - half, maxZ: cz + half,
    });
  }

  // ── Relic seed-pod, inside the heartwood ──────────────────────────────────
  const relicGeo = new THREE.SphereGeometry(0.28, 12, 10);
  const relicMesh = makeWaveGlowMesh(relicGeo, GLOW_TEAL, 0, 1.0, 0.6, 1.6);
  relicMesh.name = 'verdant-relic-seedpod';
  relicMesh.position.set(hx, hy + 0.55, hz);
  group.add(relicMesh);

  const trunkGeo = mergeGeometries(trunkMats.map((m) => { const c = trunkTemplate.clone(); c.applyMatrix4(m); return c; }));
  trunkTemplate.dispose();
  const trunkMesh = new THREE.Mesh(trunkGeo ?? new THREE.BufferGeometry(), trunkMat);
  trunkMesh.castShadow = true;
  group.add(trunkMesh);

  const canopyGeo = mergeGeometries(canopyMats.map((m) => { const c = canopyTemplate.clone(); c.applyMatrix4(m); return c; }));
  canopyTemplate.dispose();
  const canopyMesh = new THREE.Mesh(canopyGeo ?? new THREE.BufferGeometry(), canopyMat);
  canopyMesh.castShadow = true;
  group.add(canopyMesh);

  const ribbonGeo = mergeGeometries(ribbonMats.map((m) => { const c = ribbonTemplate.clone(); c.applyMatrix4(m); return c; }));
  ribbonTemplate.dispose();
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0x6a8f78, roughness: 0.8 });
  const ribbonMesh = new THREE.Mesh(ribbonGeo ?? new THREE.BufferGeometry(), ribbonMat);
  group.add(ribbonMesh);

  return {
    group,
    colliders,
    heartwoodMesh: shellMesh,
    heartwoodPosition: new THREE.Vector3(hx, hy + 1.6, hz),
    relicMesh,
    relicPosition: relicMesh.position.clone(),
    fireflyCenters,
    dispose(): void {
      trunkGeo?.dispose(); trunkMat.dispose();
      canopyGeo?.dispose(); canopyMat.dispose();
      ribbonGeo?.dispose(); ribbonMat.dispose();
      shellGeo.dispose();
      floorGeo.dispose();
      relicGeo.dispose(); (relicMesh.material as THREE.Material).dispose();
      bark.dispose();
      for (const m of glowMeshes) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
    },
  };
}
