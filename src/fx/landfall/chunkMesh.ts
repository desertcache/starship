/**
 * src/fx/landfall/chunkMesh.ts — writes one streamed chunk's geometry into a
 * (possibly pooled) BufferGeometry. chunks.ts owns WHEN/WHERE a chunk builds;
 * this file owns HOW.
 *
 * A chunk is a CHUNK_SIZE quad grid (lodSegs×lodSegs cells) at chunk coords
 * (cx,cz), plus a one-ring perimeter "skirt": every border vertex gets a twin
 * dropped by `skirtDepth` with the SAME normal/color as its border twin. That
 * hides the classic LOD crack — a coarser neighbour's straight-line edge
 * doesn't trace this chunk's more detailed border exactly, so without a
 * skirt you can see through the sliver gap between them.
 *
 * Normals come from field.normal() (analytic, matches the collision clamp),
 * NOT geometry.computeVertexNormals() — a per-chunk recompute would average
 * face normals only within THIS chunk's own border ring, producing a visible
 * lighting seam against the neighbour that no skirt hides (skirts only hide
 * a *geometric* gap, not a normal discontinuity).
 */
import * as THREE from 'three';
import type { HeightField } from './heightField.js';
import { hexToRgb, lerpRgb, type RGB } from '../space/noise.js';
import { CHUNK_SIZE } from '../../flight/landfallTuning.js';

/** Horizontal pull-in (meters) applied to each skirt vertex, toward the
 *  chunk's own center — see the skirt-build comment below for why. */
// 0.3 (was 1.0): any nonzero inset breaks the exact same-LOD plane coincidence
// that caused the z-fight seam; 1.0m made the slanted wall itself readable as
// a dark band from the top-down descent view. 0.3 keeps the divergence, cuts
// the visible band to a sliver.
const SKIRT_INSET = 0.3;

export interface ColorRamp {
  low: string;
  mid: string;
  high: string;
}

function rampColor(low: RGB, mid: RGB, high: RGB, t: number): RGB {
  return t < 0.5 ? lerpRgb(low, mid, t * 2) : lerpRgb(mid, high, (t - 0.5) * 2);
}

/** Walk the (lodSegs+1)² grid's perimeter once, in loop order, as [i,j] core
 *  coords. Length is always 4*lodSegs — every boundary vertex exactly once. */
function buildBoundaryLoop(lodSegs: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 0; i < lodSegs; i++) out.push([i, 0]); // bottom edge, left→right
  for (let j = 0; j < lodSegs; j++) out.push([lodSegs, j]); // right edge, bottom→top
  for (let i = lodSegs; i > 0; i--) out.push([i, lodSegs]); // top edge, right→left
  for (let j = lodSegs; j > 0; j--) out.push([0, j]); // left edge, top→bottom
  return out;
}

/** Core-grid quads + a doubled-winding skirt ribbon (so the thin perimeter
 *  curtain reads from either approach angle without a DoubleSide material on
 *  the whole chunk). Pure function of lodSegs — safe to rebuild whenever a
 *  pooled geometry is (re)claimed for a different LOD tier. */
function buildIndices(lodSegs: number): number[] {
  const N = lodSegs + 1;
  const idx = (i: number, j: number): number => j * N + i;
  const indices: number[] = [];
  for (let j = 0; j < lodSegs; j++) {
    for (let i = 0; i < lodSegs; i++) {
      const a = idx(i, j);
      const b = idx(i + 1, j);
      const c = idx(i, j + 1);
      const d = idx(i + 1, j + 1);
      indices.push(a, c, b, b, c, d);
    }
  }
  const coreCount = N * N;
  const loop = buildBoundaryLoop(lodSegs);
  const loopLen = loop.length;
  for (let k = 0; k < loopLen; k++) {
    const k1 = (k + 1) % loopLen;
    const [i0, j0] = loop[k];
    const [i1, j1] = loop[k1];
    const a = idx(i0, j0);
    const b = idx(i1, j1);
    const c = coreCount + k;
    const d = coreCount + k1;
    indices.push(a, c, b, b, c, d); // outward winding
    indices.push(a, b, c, b, d, c); // reversed — visible from inside the crack too
  }
  return indices;
}

/**
 * Write chunk (cx,cz) at LOD `lodSegs` into `geo`. `geo` may be freshly
 * constructed or a pooled geometry previously used by a different chunk (or
 * the same chunk at a different LOD) — attributes are (re)allocated only when
 * the vertex count doesn't already match, otherwise reused in place with
 * needsUpdate, so warmed-up streaming does zero per-rebuild allocation.
 */
export function buildChunkInto(
  geo: THREE.BufferGeometry,
  field: HeightField,
  ramp: ColorRamp,
  cx: number,
  cz: number,
  lodSegs: number,
  skirtDepth: number,
): void {
  const N = lodSegs + 1;
  const coreCount = N * N;
  const skirtCount = 4 * lodSegs;
  const vertCount = coreCount + skirtCount;

  let posAttr = geo.getAttribute('position') as THREE.BufferAttribute | undefined;
  if (!posAttr || posAttr.count !== vertCount) {
    posAttr = new THREE.BufferAttribute(new Float32Array(vertCount * 3), 3);
    const normAttr = new THREE.BufferAttribute(new Float32Array(vertCount * 3), 3);
    const colorAttr = new THREE.BufferAttribute(new Float32Array(vertCount * 3), 3);
    geo.setAttribute('position', posAttr);
    geo.setAttribute('normal', normAttr);
    geo.setAttribute('color', colorAttr);
    geo.setIndex(buildIndices(lodSegs));
  }
  const normAttr = geo.getAttribute('normal') as THREE.BufferAttribute;
  const colorAttr = geo.getAttribute('color') as THREE.BufferAttribute;

  const low = hexToRgb(ramp.low);
  const mid = hexToRgb(ramp.mid);
  const high = hexToRgb(ramp.high);
  const nOut = new THREE.Vector3(); // one scratch, reused every vertex

  const originX = cx * CHUNK_SIZE;
  const originZ = cz * CHUNK_SIZE;
  const idx = (i: number, j: number): number => j * N + i;

  let minH = Infinity;
  let maxH = -Infinity;

  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const lx = (i / lodSegs) * CHUNK_SIZE;
      const lz = (j / lodSegs) * CHUNK_SIZE;
      const wx = originX + lx;
      const wz = originZ + lz;
      const h = field.height(wx, wz);
      if (h < minH) minH = h;
      if (h > maxH) maxH = h;
      const vi = idx(i, j);
      posAttr.setXYZ(vi, lx, h, lz);
      field.normal(wx, wz, nOut);
      normAttr.setXYZ(vi, nOut.x, nOut.y, nOut.z);
      const t = field.colorT(wx, wz, h);
      const c = rampColor(low, mid, high, t);
      colorAttr.setXYZ(vi, c.r / 255, c.g / 255, c.b / 255);
    }
  }

  // Skirt: twin every border vertex, dropped by skirtDepth AND pulled
  // SKIRT_INSET meters toward this chunk's own center, copying its twin's
  // normal/color verbatim (approximation — the skirt is a crack-hider, never
  // meant to be a lit, correctly-shaded surface of its own).
  //
  // The inset matters: two same-LOD neighbours both anchor a skirt at their
  // shared border edge — without it, both skirts drop straight down from the
  // IDENTICAL world-space line (same x/z, same height, same depth, since
  // height() is a pure function of world position), so their wall triangles
  // are perfectly coincident. Two separate meshes rasterizing the exact same
  // surface is a textbook z-fighting setup — GPU depth-test order between the
  // two draw calls is effectively arbitrary per-pixel, which read as a dark
  // flickery seam running along every internal same-LOD chunk boundary (art-
  // gate round 1, the vertical line down landfall-descent.png's center — that
  // shot looks straight down the x=0 boundary between two LOD0 chunks). Only
  // the TOP vertex (still exactly on the border, shared correctly with the
  // neighbour's terrain) stays put; insetting the BOTTOM makes each chunk's
  // wall slant toward its own interior, so the two neighbours' walls diverge
  // instead of overlapping.
  const boundary = buildBoundaryLoop(lodSegs);
  for (let k = 0; k < boundary.length; k++) {
    const [i, j] = boundary[k];
    const coreVi = idx(i, j);
    const skirtVi = coreCount + k;
    const dirX = i === 0 ? 1 : i === lodSegs ? -1 : 0;
    const dirZ = j === 0 ? 1 : j === lodSegs ? -1 : 0;
    const dlen = Math.hypot(dirX, dirZ) || 1;
    const insetX = (dirX / dlen) * SKIRT_INSET;
    const insetZ = (dirZ / dlen) * SKIRT_INSET;
    posAttr.setXYZ(
      skirtVi,
      posAttr.getX(coreVi) + insetX,
      posAttr.getY(coreVi) - skirtDepth,
      posAttr.getZ(coreVi) + insetZ,
    );
    normAttr.setXYZ(skirtVi, normAttr.getX(coreVi), normAttr.getY(coreVi), normAttr.getZ(coreVi));
    colorAttr.setXYZ(skirtVi, colorAttr.getX(coreVi), colorAttr.getY(coreVi), colorAttr.getZ(coreVi));
  }

  posAttr.needsUpdate = true;
  normAttr.needsUpdate = true;
  colorAttr.needsUpdate = true;

  // Manual bounding sphere from the min/max height already gathered above —
  // no separate compute pass over the vertex buffer. CENTER IS GEOMETRY-LOCAL
  // (positions are chunk-local lx/lz; chunks.ts places the mesh at
  // (cx*CHUNK_SIZE, 0, cz*CHUNK_SIZE)) — a world-space center here gets the
  // mesh's world offset applied ON TOP by the frustum-culling transform,
  // doubling every chunk's apparent distance from origin (orchestrator
  // round-3 fix; it mostly escaped notice because doubling along an
  // outward-looking view ray stays in-frustum).
  const half = CHUNK_SIZE / 2;
  const vertRange = maxH - minH + skirtDepth;
  geo.boundingSphere ??= new THREE.Sphere();
  geo.boundingSphere.center.set(half, (minH + maxH) / 2 - skirtDepth / 2, half);
  geo.boundingSphere.radius = Math.hypot(half, half, vertRange / 2) + 0.5;
}
