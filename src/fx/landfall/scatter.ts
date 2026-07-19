/**
 * src/fx/landfall/scatter.ts — Stage 4: per-chunk seeded scatter (boulders,
 * spires, shrubs) for LANDFALL's ROCKY biome.
 *
 * Ownership note / deliberate deviation: the brief names two ways to stream
 * scatter with chunks.ts's own build/despawn (a provider callback, or a thin
 * subscription added to its create options) — neither fits without editing
 * chunks.ts, which is outside this lane's owned-files list. Instead this
 * module tracks the player's chunk coordinate ITSELF (same CHUNK_SIZE grid
 * chunks.ts uses) and (re)populates a Chebyshev-<=SCATTER_RING neighbourhood
 * whenever that coordinate changes — fully decoupled from chunks.ts's own
 * residency bookkeeping. Every instance's transform is a pure function of
 * (cx, cz, kind, slot-index), so it doesn't matter which system reacts to a
 * chunk crossing first or in what order.
 *
 * Seeded + deterministic: `LANDFALL_SEED ^ hashChunk(cx, cz)` seeds one rng
 * per chunk, so re-crossing a boundary re-derives IDENTICAL placements (no
 * drift, no re-roll).
 *
 * Pooling: one InstancedMesh per scatter kind, capacity sized for the whole
 * ring (ring-chunk-count x biome perChunk). A despawned chunk's slots are
 * PARKED (translated far below the world) and pushed back onto that kind's
 * free list rather than shrinking `mesh.count` — capacity is small (well
 * under 300 instances total across all 3 kinds), so this is one draw call
 * per kind, never a per-frame cost.
 *
 * Collider recompose: boulders in the top size tier and every spire (only
 * 1/chunk, always tall enough to matter) contribute an AABB. landfall.ts
 * concatenates `colliders()` with its static boundary ring and re-pushes via
 * player/controller.ts's setActiveColliders ONLY when update() returns true
 * (a chunk crossing actually happened) — see that file's Stage-4 seam.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { HeightField } from './heightField.js';
import type { BiomePreset } from './biomes.js';
import type { AABB } from '../../world/types.js';
import { makeRng, type Rng } from '../space/rng.js';
import { hexToRgb, lerpRgb, type RGB } from '../space/noise.js';
import {
  CHUNK_SIZE, LANDFALL_SEED, SCATTER_RING, SCATTER_PAD_CLEAR_RADIUS,
  SCATTER_BOULDER_COLLIDE_MIN_SCALE, SCATTER_BOULDER_BASE_RADIUS, SCATTER_SPIRE_BASE_RADIUS,
} from '../../flight/landfallTuning.js';

type ScatterKind = 'boulder' | 'spire' | 'shrub';
// Parallel-array order for geos/mats below — keep in sync with KINDS.
const KINDS: readonly ScatterKind[] = ['boulder', 'spire', 'shrub'];

export interface ScatterHandles {
  group: THREE.Group;
  /** Recompute residency for the current player position. Returns true when
   *  the active chunk neighbourhood (and therefore colliders()) changed. */
  update(playerPos: THREE.Vector3): boolean;
  colliders(): AABB[];
  dispose(): void;
}

// ── Chunk hash / key ──────────────────────────────────────────────────────
function hashChunk(cx: number, cz: number): number {
  let h = (Math.imul(cx, 0x9e3779b1) ^ Math.imul(cz, 0x85ebca6b)) | 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h ^ (h >>> 16)) >>> 0;
}
const chunkKey = (cx: number, cz: number): string => `${cx},${cz}`;

// ── Geometry (built once, shared across every instance of a kind) ─────────
function buildBoulderGeometry(): THREE.BufferGeometry {
  return new THREE.IcosahedronGeometry(1, 0);
}
function buildSpireGeometry(): THREE.BufferGeometry {
  const g = new THREE.ConeGeometry(1, 3, 5, 1);
  g.translate(0, 1.5, 0); // base sits at local y=0
  return g;
}
function buildShrubGeometry(): THREE.BufferGeometry {
  const planes: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 3; i++) {
    const p = new THREE.PlaneGeometry(1.2, 1);
    p.translate(0, 0.5, 0);
    p.rotateY((Math.PI / 3) * i);
    planes.push(p);
  }
  const merged = mergeGeometries(planes);
  for (const p of planes) p.dispose();
  return merged;
}

/** Seeded scraggly alpha silhouette — a cluster of tapered twig strokes,
 *  fixed seed so the shrub's shape never changes call to call. */
function buildShrubTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  const rng = makeRng(LANDFALL_SEED ^ 0x53);
  ctx.strokeStyle = 'rgba(255,255,255,1)';
  ctx.lineCap = 'round';
  for (let i = 0; i < 14; i++) {
    const baseX = size * 0.5 + rng.signed(size * 0.28);
    const h = size * rng.range(0.35, 0.95);
    ctx.lineWidth = rng.range(2, 5);
    ctx.beginPath();
    ctx.moveTo(baseX, size);
    ctx.lineTo(baseX + rng.signed(size * 0.18), size - h);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

function buildRockMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0.04 });
}
function buildShrubMaterial(tex: THREE.CanvasTexture): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: tex, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.9, color: '#8a9463',
  });
}

// ── Instance pools ──────────────────────────────────────────────────────
interface Pool {
  mesh: THREE.InstancedMesh;
  freeSlots: number[];
  chunkSlots: Map<string, number[]>;
}
const PARK = new THREE.Matrix4().makeTranslation(0, -5000, 0);

function makePool(geo: THREE.BufferGeometry, mat: THREE.Material, capacity: number): Pool {
  const mesh = new THREE.InstancedMesh(geo, mat, capacity);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  const freeSlots: number[] = [];
  for (let i = 0; i < capacity; i++) {
    mesh.setMatrixAt(i, PARK);
    freeSlots.push(i);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return { mesh, freeSlots, chunkSlots: new Map() };
}

// ── Per-instance transform / tint / collider helpers ─────────────────────
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _scale = new THREE.Vector3();
const _mat = new THREE.Matrix4();

function scaleForKind(kind: ScatterKind, rng: Rng): number {
  if (kind === 'boulder') return rng.range(0.8, 2.6);
  if (kind === 'spire') return rng.range(1.6, 3.4);
  return rng.range(0.7, 1.3);
}

function composeMatrix(x: number, y: number, z: number, kind: ScatterKind, scale: number, rng: Rng): THREE.Matrix4 {
  const yaw = rng.range(0, Math.PI * 2);
  const tilt = kind === 'boulder' ? 0.28 : 0;
  _euler.set(rng.signed(tilt), yaw, rng.signed(tilt));
  _quat.setFromEuler(_euler);
  if (kind === 'boulder') {
    _scale.set(scale * rng.range(0.8, 1.2), scale * rng.range(0.8, 1.2), scale * rng.range(0.8, 1.2));
  } else {
    _scale.set(scale, scale, scale);
  }
  _pos.set(x, y, z);
  return _mat.compose(_pos, _quat, _scale);
}

function tintForKind(kind: ScatterKind, ramp: { low: RGB; mid: RGB; high: RGB }, rng: Rng): THREE.Color {
  if (kind === 'shrub') {
    const j = rng.range(-0.08, 0.08);
    return new THREE.Color(0.42 + j, 0.47 + j, 0.28 + j);
  }
  const t = rng();
  const c = t < 0.5 ? lerpRgb(ramp.low, ramp.mid, t * 2) : lerpRgb(ramp.mid, ramp.high, (t - 0.5) * 2);
  return new THREE.Color(c.r / 255, c.g / 255, c.b / 255);
}

function isTopTier(kind: ScatterKind, scale: number): boolean {
  if (kind === 'spire') return true; // rare (1/chunk) + always tall enough to matter
  if (kind === 'boulder') return scale >= SCATTER_BOULDER_COLLIDE_MIN_SCALE;
  return false;
}

function rockAABB(x: number, groundY: number, z: number, kind: ScatterKind, scale: number): AABB {
  const baseR = kind === 'spire' ? SCATTER_SPIRE_BASE_RADIUS : SCATTER_BOULDER_BASE_RADIUS;
  const half = baseR * scale;
  return { minX: x - half, maxX: x + half, minY: groundY - 1, maxY: groundY + 3, minZ: z - half, maxZ: z + half };
}

// ── Build / populate / despawn ────────────────────────────────────────────

export function buildScatter(field: HeightField, biome: BiomePreset): ScatterHandles {
  const group = new THREE.Group();
  group.name = 'landfall-scatter';
  const ringChunks = (2 * SCATTER_RING + 1) ** 2;
  const ramp = {
    low: hexToRgb(biome.terrain.colorRamp.low),
    mid: hexToRgb(biome.terrain.colorRamp.mid),
    high: hexToRgb(biome.terrain.colorRamp.high),
  };

  const shrubTex = buildShrubTexture();
  const geos: THREE.BufferGeometry[] = [buildBoulderGeometry(), buildSpireGeometry(), buildShrubGeometry()];
  const mats: THREE.Material[] = [buildRockMaterial(), buildRockMaterial(), buildShrubMaterial(shrubTex)];

  const pools = {} as Record<ScatterKind, Pool>;
  KINDS.forEach((kind, i) => {
    const entry = biome.scatter.find((s) => s.kind === kind);
    const perChunk = entry?.perChunk ?? 0;
    const pool = makePool(geos[i], mats[i], Math.max(1, ringChunks * perChunk));
    pools[kind] = pool;
    group.add(pool.mesh);
  });

  const colliderMap = new Map<string, AABB[]>();
  const resident = new Set<string>();
  let flatColliders: AABB[] = [];
  let lastChunk = { cx: Number.NaN, cz: Number.NaN };

  function populateChunk(cx: number, cz: number): void {
    const key = chunkKey(cx, cz);
    const rng = makeRng(LANDFALL_SEED ^ hashChunk(cx, cz));
    const originX = cx * CHUNK_SIZE;
    const originZ = cz * CHUNK_SIZE;
    const chunkColliders: AABB[] = [];

    for (const entry of biome.scatter) {
      const pool = pools[entry.kind];
      const slots: number[] = [];
      for (let i = 0; i < entry.perChunk; i++) {
        const wx = originX + rng() * CHUNK_SIZE;
        const wz = originZ + rng() * CHUNK_SIZE;
        if (Math.hypot(wx, wz) < SCATTER_PAD_CLEAR_RADIUS) continue; // keep the pad clear
        const slot = pool.freeSlots.pop();
        if (slot === undefined) continue; // capacity guard, should not happen
        const gy = field.height(wx, wz);
        const scale = scaleForKind(entry.kind, rng);
        pool.mesh.setMatrixAt(slot, composeMatrix(wx, gy, wz, entry.kind, scale, rng));
        pool.mesh.setColorAt(slot, tintForKind(entry.kind, ramp, rng));
        slots.push(slot);
        if (entry.collide && isTopTier(entry.kind, scale)) {
          chunkColliders.push(rockAABB(wx, gy, wz, entry.kind, scale));
        }
      }
      pool.chunkSlots.set(key, slots);
      pool.mesh.instanceMatrix.needsUpdate = true;
      if (pool.mesh.instanceColor) pool.mesh.instanceColor.needsUpdate = true;
    }
    if (chunkColliders.length > 0) colliderMap.set(key, chunkColliders);
  }

  function despawnChunk(cx: number, cz: number): void {
    const key = chunkKey(cx, cz);
    for (const kind of KINDS) {
      const pool = pools[kind];
      const slots = pool.chunkSlots.get(key);
      if (!slots) continue;
      for (const slot of slots) {
        pool.mesh.setMatrixAt(slot, PARK);
        pool.freeSlots.push(slot);
      }
      pool.mesh.instanceMatrix.needsUpdate = true;
      pool.chunkSlots.delete(key);
    }
    colliderMap.delete(key);
  }

  function recompute(pcx: number, pcz: number): void {
    const want = new Set<string>();
    for (let dz = -SCATTER_RING; dz <= SCATTER_RING; dz++) {
      for (let dx = -SCATTER_RING; dx <= SCATTER_RING; dx++) want.add(chunkKey(pcx + dx, pcz + dz));
    }
    for (const key of Array.from(resident)) {
      if (want.has(key)) continue;
      const [cx, cz] = key.split(',').map(Number);
      despawnChunk(cx, cz);
      resident.delete(key);
    }
    for (const key of want) {
      if (resident.has(key)) continue;
      const [cx, cz] = key.split(',').map(Number);
      populateChunk(cx, cz);
      resident.add(key);
    }
    flatColliders = ([] as AABB[]).concat(...Array.from(colliderMap.values()));
  }

  return {
    group,
    update(playerPos: THREE.Vector3): boolean {
      const pcx = Math.floor(playerPos.x / CHUNK_SIZE);
      const pcz = Math.floor(playerPos.z / CHUNK_SIZE);
      if (pcx === lastChunk.cx && pcz === lastChunk.cz) return false;
      lastChunk = { cx: pcx, cz: pcz };
      recompute(pcx, pcz);
      return true;
    },
    colliders(): AABB[] {
      return flatColliders;
    },
    dispose(): void {
      for (const kind of KINDS) pools[kind].mesh.dispose();
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
      shrubTex.dispose();
    },
  };
}
