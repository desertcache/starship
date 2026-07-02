/**
 * src/fx/terrain.ts — procedural ground for pocket worlds (Stage A).
 *
 * ANALYTIC fbm: the SAME evaluation drives both the displaced mesh vertices and
 * `groundHeight(x,z)` (no raycasts) so the controller's per-frame eye clamp is
 * exact and free. fbm comes from the existing toroidal noise in space/noise.ts,
 * seeded via space/rng.ts — never Math.random (screenshot determinism).
 *
 * The mesh is a square plane (side = radius*2); worlds hide the square edges
 * with fog + an emissive rim ring (the world's job). Boundary rail colliders
 * are an overlapping axis-aligned box ring at `radius`.
 */

import * as THREE from 'three';
import { makeNoiseGrid, fbmWrap, hexToRgb, lerpRgb, type RGB } from './space/noise.js';
import { makeRng } from './space/rng.js';
import type { AABB } from '../world/types.js';

export interface TerrainOpts {
  seed: number;
  /** Playable radius, ~55-65m (dev disc uses ~30m). */
  radius: number;
  /** Gentle: 2-5m (dev disc uses ~0.12m — effectively flat). */
  maxHeight: number;
  /** Plane subdivisions per side; default 96. */
  segments?: number;
  colorRamp: { low: string; mid: string; high: string };
  /** Optional detail overlay multiplied over the vertex-color ramp. */
  texture?: THREE.CanvasTexture;
}

export interface TerrainResult {
  mesh: THREE.Mesh;
  /** ANALYTIC ground height (same fbm eval as the mesh); no raycasts. */
  groundHeight(x: number, z: number): number;
  /** Invisible rail ring at `radius`. */
  boundaryColliders: AABB[];
}

const GRID_N = 64;
const FBM_CYCLES = 3;
const FBM_OCTAVES = 4;
const RING_SEGMENTS = 24;

export function buildTerrain(opts: TerrainOpts): TerrainResult {
  const segments = opts.segments ?? 96;
  const rng = makeRng(opts.seed);
  const grid = makeNoiseGrid(rng, GRID_N);
  const period = opts.radius * 2;
  const denom = opts.maxHeight > 1e-6 ? opts.maxHeight : 1;

  const groundHeight = (x: number, z: number): number => {
    // Map world XZ into a period-wrapped uv so the toroidal fbm samples
    // continuously and identically for mesh + clamp.
    const u = x / period + 0.5;
    const v = z / period + 0.5;
    const n = fbmWrap(grid, GRID_N, u, v, FBM_CYCLES, FBM_CYCLES, FBM_OCTAVES); // ~[-1,1]
    return (n * 0.5 + 0.5) * opts.maxHeight;
  };

  // ── Mesh: square plane displaced by groundHeight, vertex-colored by ramp ──
  const geo = new THREE.PlaneGeometry(period, period, segments, segments);
  geo.rotateX(-Math.PI / 2); // lie in XZ; +Y up
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const low = hexToRgb(opts.colorRamp.low);
  const mid = hexToRgb(opts.colorRamp.mid);
  const high = hexToRgb(opts.colorRamp.high);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const h = groundHeight(x, z);
    pos.setY(i, h);
    const t = Math.max(0, Math.min(1, h / denom));
    const c: RGB = t < 0.5 ? lerpRgb(low, mid, t * 2) : lerpRgb(mid, high, (t - 0.5) * 2);
    colors[i * 3] = c.r / 255;
    colors[i * 3 + 1] = c.g / 255;
    colors[i * 3 + 2] = c.b / 255;
  }
  pos.needsUpdate = true;
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.95,
    metalness: 0.0,
    map: opts.texture ?? null,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'terrain';
  mesh.receiveShadow = true;

  return { mesh, groundHeight, boundaryColliders: buildRing(opts.radius) };
}

/**
 * Overlapping axis-aligned box ring approximating a circular rail at `radius`.
 * Boxes overlap their neighbours (half-extent > half the chord) so the 0.3m
 * capsule can never slip between segments.
 */
function buildRing(radius: number): AABB[] {
  const out: AABB[] = [];
  const chord = 2 * radius * Math.sin(Math.PI / RING_SEGMENTS);
  const half = chord * 0.9; // > chord/2 → generous overlap
  for (let i = 0; i < RING_SEGMENTS; i++) {
    const a = (i / RING_SEGMENTS) * Math.PI * 2;
    const cx = Math.cos(a) * radius;
    const cz = Math.sin(a) * radius;
    out.push({
      minX: cx - half, maxX: cx + half,
      minY: -2, maxY: 6,
      minZ: cz - half, maxZ: cz + half,
    });
  }
  return out;
}
