/**
 * src/fx/landfall/chunks.ts — the streaming manager: which chunks exist right
 * now, at what LOD, and when they get (re)built.
 *
 * Determinism deviation from the Stage-2 brief, deliberate: the brief's
 * snapStream() wording is "sync rings 0-1, enqueue ring 2 (async)". This file
 * instead syncs ALL THREE rings (0-2) on every snap (world build, first
 * update(), or a >2-chunk jump). Reasoning: the verify gate requires two
 * `npm run verify` runs to hash-match their landfall screenshots byte-for-
 * byte. If ring-2 chunks were left to trickle in across whatever number of
 * rAF frames happen to land inside the harness's 800ms post-`__setCam` wait,
 * the exact SET of ring-2 chunks built-vs-still-showing-the-far-shell by
 * screenshot time would depend on wall-clock frame timing — real, and
 * exactly the "unresolved streaming" nondeterminism source the gate
 * instructions name. Ring-2 chunks are the cheapest tier (8×8 core), so
 * syncing all three costs a one-time hitch on a big jump/switch, never a
 * steady-state cost — the per-frame budget path below still exists and does
 * all the work for smooth incremental streaming during normal walking.
 */
import * as THREE from 'three';
import type { HeightField } from './heightField.js';
import type { BiomePreset } from './biomes.js';
import { buildChunkInto, type ColorRamp } from './chunkMesh.js';
import {
  CHUNK_SIZE, CHUNK_BUILDS_PER_FRAME, CHUNK_BUILD_BUDGET_MS,
  LOD_RING0, LOD_RING1, LOD_RING2, LOD0_SEGS, LOD1_SEGS, LOD2_SEGS, CHUNK_SKIRT_DEPTH,
} from '../../flight/landfallTuning.js';

type Lod = 0 | 1 | 2;
const LOD_SEGS: readonly [number, number, number] = [LOD0_SEGS, LOD1_SEGS, LOD2_SEGS];
const LOD_BOUNDS: readonly [number, number, number] = [LOD_RING0, LOD_RING1, LOD_RING2];

interface ChunkEntry {
  cx: number;
  cz: number;
  lod: Lod;
  mesh: THREE.Mesh;
}

interface WorkItem {
  cx: number;
  cz: number;
  lod: Lod;
  dist: number;
}

export interface ChunkManager {
  update(playerPos: THREE.Vector3, dtBudgetMs?: number): void;
  /** Force a full synchronous rebuild of everything within LOD_RING2 of
   *  `pos` — the screenshot/test-determinism entry point (see file header). */
  snapStream(pos: THREE.Vector3): void;
  chunksResident(): number;
  dispose(): void;
}

function chebyshev(dx: number, dz: number): number {
  return Math.max(Math.abs(dx), Math.abs(dz));
}

function lodForRing(ring: number): Lod | null {
  if (ring <= LOD_BOUNDS[0]) return 0;
  if (ring <= LOD_BOUNDS[1]) return 1;
  if (ring <= LOD_BOUNDS[2]) return 2;
  return null;
}

/** A resident chunk only reclassifies once the player's ring distance to it
 *  moves ±1 PAST the bound that originally admitted its current LOD — this
 *  is the anti-thrash hysteresis the brief calls for. Returns the LOD to keep
 *  the chunk at, or null if it should despawn entirely. */
function hysteresisLod(ring: number, currentLod: Lod): Lod | null {
  const bound = LOD_BOUNDS[currentLod];
  if (ring <= bound + 1) return currentLod;
  return lodForRing(ring);
}

export function createChunkManager(scene: THREE.Scene, field: HeightField, biome: BiomePreset): ChunkManager {
  const ramp: ColorRamp = biome.terrain.colorRamp;
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0.0 });

  // Free-list geometry pools, one per LOD tier — a despawned chunk's geometry
  // goes back to its tier's pool instead of being disposed, so warmed-up
  // streaming allocates nothing.
  const pools: THREE.BufferGeometry[][] = [[], [], []];
  const acquireGeo = (lod: Lod): THREE.BufferGeometry => pools[lod].pop() ?? new THREE.BufferGeometry();
  const releaseGeo = (lod: Lod, geo: THREE.BufferGeometry): void => { pools[lod].push(geo); };

  const resident = new Map<string, ChunkEntry>();
  const key = (cx: number, cz: number): string => `${cx},${cz}`;

  let lastChunk = { cx: 0, cz: 0 };
  let neverStreamed = true;

  function chunkOf(pos: THREE.Vector3): { cx: number; cz: number } {
    return { cx: Math.floor(pos.x / CHUNK_SIZE), cz: Math.floor(pos.z / CHUNK_SIZE) };
  }

  function buildOne(cx: number, cz: number, lod: Lod): void {
    const k = key(cx, cz);
    const existing = resident.get(k);
    if (existing) {
      if (existing.lod === lod) return;
      scene.remove(existing.mesh);
      releaseGeo(existing.lod, existing.mesh.geometry as THREE.BufferGeometry);
      resident.delete(k);
    }
    const geo = acquireGeo(lod);
    buildChunkInto(geo, field, ramp, cx, cz, LOD_SEGS[lod], CHUNK_SKIRT_DEPTH);
    const mesh = new THREE.Mesh(geo, material);
    mesh.name = `landfall-chunk-${cx}-${cz}`;
    mesh.position.set(cx * CHUNK_SIZE, 0, cz * CHUNK_SIZE);
    mesh.frustumCulled = true;
    scene.add(mesh);
    resident.set(k, { cx, cz, lod, mesh });
  }

  function despawnOne(k: string): void {
    const entry = resident.get(k);
    if (!entry) return;
    scene.remove(entry.mesh);
    releaseGeo(entry.lod, entry.mesh.geometry as THREE.BufferGeometry);
    resident.delete(k);
  }

  /** Everything currently resident that's now outside all rings (with
   *  hysteresis) — cheap (pool return only), never budget-limited. */
  function despawnOutOfRange(pcx: number, pcz: number): void {
    for (const [k, entry] of Array.from(resident.entries())) {
      const ring = chebyshev(entry.cx - pcx, entry.cz - pcz);
      if (hysteresisLod(ring, entry.lod) === null) despawnOne(k);
    }
  }

  /** Missing/wrong-LOD chunks within `maxRing` of (pcx,pcz), sorted nearest
   *  first. New chunks get their freshly-desired LOD outright (no hysteresis
   *  on first arrival — that only applies to chunks already resident). */
  function computeWork(pcx: number, pcz: number, maxRing: number): WorkItem[] {
    const out: WorkItem[] = [];
    for (let dz = -maxRing; dz <= maxRing; dz++) {
      for (let dx = -maxRing; dx <= maxRing; dx++) {
        const ring = chebyshev(dx, dz);
        const targetLod = lodForRing(ring);
        if (targetLod === null || ring > maxRing) continue;
        const cx = pcx + dx;
        const cz = pcz + dz;
        const entry = resident.get(key(cx, cz));
        if (!entry) {
          out.push({ cx, cz, lod: targetLod, dist: ring });
        } else if (entry.lod !== targetLod) {
          const resolved = hysteresisLod(ring, entry.lod);
          if (resolved !== null && resolved !== entry.lod) out.push({ cx, cz, lod: resolved, dist: ring });
        }
      }
    }
    out.sort((a, b) => a.dist - b.dist);
    return out;
  }

  function snapStream(pos: THREE.Vector3): void {
    const { cx: pcx, cz: pcz } = chunkOf(pos);
    despawnOutOfRange(pcx, pcz);
    for (const item of computeWork(pcx, pcz, LOD_RING2)) buildOne(item.cx, item.cz, item.lod);
    lastChunk = { cx: pcx, cz: pcz };
    neverStreamed = false;
  }

  function update(playerPos: THREE.Vector3, dtBudgetMs?: number): void {
    const { cx: pcx, cz: pcz } = chunkOf(playerPos);
    const jumped = chebyshev(pcx - lastChunk.cx, pcz - lastChunk.cz) > 2;
    if (neverStreamed || jumped) {
      snapStream(playerPos);
      return; // fully resolved this tick — nothing left for the budget path
    }
    lastChunk = { cx: pcx, cz: pcz };

    despawnOutOfRange(pcx, pcz);

    const work = computeWork(pcx, pcz, LOD_RING2);
    const budgetMs = dtBudgetMs ?? CHUNK_BUILD_BUDGET_MS;
    const t0 = performance.now();
    let built = 0;
    for (const item of work) {
      if (built >= CHUNK_BUILDS_PER_FRAME) break;
      if (built > 0 && performance.now() - t0 > budgetMs) break;
      buildOne(item.cx, item.cz, item.lod);
      built++;
    }
  }

  function chunksResident(): number {
    return resident.size;
  }

  function dispose(): void {
    for (const [, entry] of resident) {
      scene.remove(entry.mesh);
      entry.mesh.geometry.dispose();
    }
    resident.clear();
    for (const pool of pools) {
      for (const g of pool) g.dispose();
      pool.length = 0;
    }
    material.dispose();
  }

  return { update, snapStream, chunksResident, dispose };
}
