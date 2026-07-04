/**
 * src/world/worlds/ashfallProps.ts — obsidian shard field, basalt column
 * formation, and the spawn platform marker for ASHFALL (Stage C).
 *
 * Shards + columns are each ONE InstancedMesh (one draw call per feature) built
 * from a single flat-shaded base prism, seeded via makeRng — never Math.random.
 */
import * as THREE from 'three';
import { makeRng } from '../../fx/space/rng.js';
import type { AABB, Interactable } from '../types.js';
import { recordScan } from '../../core/state.js';
import { showRoomToast } from '../../ui/hud.js';

const SHARD_SEED = 0xa5fa61;
const COLUMN_SEED = 0xa5fa71;

interface ShardCluster { x: number; z: number; radius: number; count: number }

const SHARD_CLUSTERS: ShardCluster[] = [
  { x: -14, z: 30, radius: 5, count: 14 },
  { x: -24, z: -4, radius: 6, count: 12 },
  { x: 20, z: -26, radius: 5, count: 10 },
];

const COLUMN_CENTER = { x: -30, z: 20, radius: 4.2, count: 9 };

const _m = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scl = new THREE.Vector3();
const _euler = new THREE.Euler();

/** Flat-shaded prism: non-indexed so computeVertexNormals gives per-face facets. */
function makeFlatShadedGeometry(base: THREE.BufferGeometry): THREE.BufferGeometry {
  const geo = base.toNonIndexed();
  geo.computeVertexNormals();
  return geo;
}

export interface ObsidianShards {
  mesh: THREE.InstancedMesh;
  colliders: AABB[];
  /** "Scan OBSIDIAN CHOIR" → recordScan('ashfall-obsidian-choir'). */
  interactable: Interactable;
  dispose(): void;
}

/** Clustered angular obsidian shard formations with a faint warm rim glow. */
export function buildObsidianShards(groundHeight: (x: number, z: number) => number): ObsidianShards {
  const rng = makeRng(SHARD_SEED);
  const geo = makeFlatShadedGeometry(new THREE.ConeGeometry(1, 1, 5, 1));
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0c0a10, roughness: 0.28, metalness: 0.2,
    emissive: 0x3a0f05, emissiveIntensity: 0.2,
  });
  const total = SHARD_CLUSTERS.reduce((n, c) => n + c.count, 0);
  const mesh = new THREE.InstancedMesh(geo, mat, total);
  mesh.name = 'ashfall-obsidian-choir';

  let i = 0;
  const colliders: AABB[] = [];
  for (const c of SHARD_CLUSTERS) {
    for (let k = 0; k < c.count; k++) {
      const ang = rng() * Math.PI * 2;
      const rad = Math.sqrt(rng()) * c.radius;
      const x = c.x + Math.cos(ang) * rad;
      const z = c.z + Math.sin(ang) * rad;
      const gy = groundHeight(x, z);
      const height = rng.range(1.4, 4.4);
      const baseR = rng.range(0.35, 0.9);
      _pos.set(x, gy + height * 0.5, z);
      _euler.set(rng.signed(0.12), rng() * Math.PI * 2, rng.signed(0.12));
      _quat.setFromEuler(_euler);
      _scl.set(baseR, height, baseR);
      _m.compose(_pos, _quat, _scl);
      mesh.setMatrixAt(i, _m);
      i++;
    }
    colliders.push({
      minX: c.x - c.radius - 0.6, maxX: c.x + c.radius + 0.6,
      minY: -2, maxY: 6,
      minZ: c.z - c.radius - 0.6, maxZ: c.z + c.radius + 0.6,
    });
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.castShadow = true;

  const heroCluster = SHARD_CLUSTERS[0];
  const scanGy = groundHeight(heroCluster.x, heroCluster.z);
  const interactable: Interactable = {
    id: 'ashfall-obsidian-choir',
    prompt: 'Scan OBSIDIAN CHOIR',
    radius: 3.2,
    position: new THREE.Vector3(heroCluster.x, scanGy + 1.6, heroCluster.z),
    onInteract: (): void => {
      const fresh = recordScan('ashfall-obsidian-choir');
      showRoomToast(fresh ? 'CATALOGUED · OBSIDIAN CHOIR' : 'KNOWN · OBSIDIAN CHOIR');
    },
  };

  return {
    mesh, colliders, interactable,
    dispose(): void { geo.dispose(); mat.dispose(); mesh.dispose(); },
  };
}

export interface BasaltColumns {
  mesh: THREE.InstancedMesh;
  colliders: AABB[];
  /** "Scan BASALT COLONNADE" → recordScan('ashfall-basalt-columns'). */
  interactable: Interactable;
  dispose(): void;
}

/** A natural hexagonal-basalt colonnade — a scannable feature, not decor. */
export function buildBasaltColumns(groundHeight: (x: number, z: number) => number): BasaltColumns {
  const rng = makeRng(COLUMN_SEED);
  const geo = makeFlatShadedGeometry(new THREE.CylinderGeometry(1, 1, 1, 6, 1));
  const mat = new THREE.MeshStandardMaterial({
    color: 0x141014, roughness: 0.85, metalness: 0.05,
    emissive: 0x2a0d04, emissiveIntensity: 0.12,
  });
  const { x: cx, z: cz, radius, count } = COLUMN_CENTER;
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.name = 'ashfall-basalt-columns';

  for (let i = 0; i < count; i++) {
    const ang = (i / count) * Math.PI * 2 + rng.signed(0.4);
    const rad = radius * rng.range(0.3, 1.0);
    const x = cx + Math.cos(ang) * rad;
    const z = cz + Math.sin(ang) * rad;
    const gy = groundHeight(x, z);
    const height = rng.range(2.2, 4.6);
    const r = rng.range(0.55, 0.95);
    _pos.set(x, gy + height * 0.5, z);
    _euler.set(rng.signed(0.05), rng() * Math.PI * 2, rng.signed(0.05));
    _quat.setFromEuler(_euler);
    _scl.set(r, height, r);
    _m.compose(_pos, _quat, _scl);
    mesh.setMatrixAt(i, _m);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.castShadow = true;

  const centerGy = groundHeight(cx, cz);
  const interactable: Interactable = {
    id: 'ashfall-basalt-columns',
    prompt: 'Scan BASALT COLONNADE',
    radius: 3.0,
    position: new THREE.Vector3(cx, centerGy + 1.8, cz),
    onInteract: (): void => {
      const fresh = recordScan('ashfall-basalt-columns');
      showRoomToast(fresh ? 'CATALOGUED · BASALT COLONNADE' : 'KNOWN · BASALT COLONNADE');
    },
  };

  return {
    mesh,
    colliders: [{
      minX: cx - radius - 0.6, maxX: cx + radius + 0.6,
      minY: -2, maxY: 6,
      minZ: cz - radius - 0.6, maxZ: cz + radius + 0.6,
    }],
    interactable,
    dispose(): void { geo.dispose(); mat.dispose(); mesh.dispose(); },
  };
}

export interface SpawnPad {
  mesh: THREE.Mesh;
  dispose(): void;
}

/** Basalt platform clearing marker at the spawn pad. */
export function buildSpawnPad(x: number, z: number, y: number): SpawnPad {
  const geo = new THREE.RingGeometry(1.1, 1.6, 40);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xff6a28, transparent: true, opacity: 0.5, side: THREE.DoubleSide, toneMapped: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, y + 0.03, z);
  mesh.name = 'ashfall-spawn-pad';
  return { mesh, dispose(): void { geo.dispose(); mat.dispose(); } };
}
