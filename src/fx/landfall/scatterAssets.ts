/** Shared meshes, texture, and materials for the landfall scatter pools. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { makeRng } from '../space/rng.js';
import { LANDFALL_SEED } from '../../flight/landfallTuning.js';
export type ScatterKind = 'boulder' | 'spire' | 'shrub';
// Parallel-array order for geos/mats below — keep in sync with KINDS.
export const KINDS: readonly ScatterKind[] = ['boulder', 'spire', 'shrub'];
// ── Geometry (built once, shared across every instance of a kind) ─────────
export function buildBoulderGeometry(): THREE.BufferGeometry {
  return new THREE.IcosahedronGeometry(1, 0);
}
export function buildSpireGeometry(): THREE.BufferGeometry {
  const g = new THREE.ConeGeometry(1, 3, 5, 1);
  g.translate(0, 1.5, 0); // base sits at local y=0
  return g;
}
export function buildShrubGeometry(): THREE.BufferGeometry {
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
export function buildShrubTexture(): THREE.CanvasTexture {
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

export function buildRockMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0.04 });
}
export function buildShrubMaterial(tex: THREE.CanvasTexture): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: tex, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.9, color: '#8a9463',
  });
}
