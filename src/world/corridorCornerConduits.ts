/**
 * Corridor ceiling-corner conduit bundles — Stage D Fix 6.
 * Dark gunmetal cylinder bundles hugging both ceiling-wall corners
 * for the corridor's full length. Silhouette against cream panels like ref-2/8.
 * Consumed exclusively by corridorProps.ts.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const CORNER_Y_OFFSETS = [-0.035, -0.085, -0.145]; // stagger below ceiling
const CORNER_RADII     = [0.040, 0.028, 0.025];
const CLAMP_R          = 0.015;
const CLAMP_SPACING    = 2.0;

const matCornerConduit = new THREE.MeshLambertMaterial({ color: 0x18191e });
const matCornerClamp   = new THREE.MeshLambertMaterial({ color: 0x22242a });

/**
 * Add 2-3 parallel gunmetal conduit cylinders + clamp rings at both
 * upper ceiling-wall corners for the full corridor length.
 *
 * @param group   Corridor group (local origin = floor center)
 * @param halfW   Half-width of corridor (=1.5 for 3m corridor)
 * @param halfD   Half-depth of corridor (=8 for 16m corridor)
 * @param H       Room height (=3 for corridor)
 */
export function buildCornerConduits(
  group: THREE.Group,
  halfW: number,
  halfD: number,
  H: number,
): void {
  const D = halfD * 2;
  const clampCount = Math.ceil(D / CLAMP_SPACING) + 1;

  for (const side of [-1, 1] as const) {
    const cornerX = side * (halfW - 0.04);
    const conduitGeos: THREE.BufferGeometry[] = [];
    const clampGeos: THREE.BufferGeometry[]   = [];

    for (let ci = 0; ci < CORNER_RADII.length; ci++) {
      const r  = CORNER_RADII[ci];
      const cy = H + CORNER_Y_OFFSETS[ci];

      const pg = new THREE.CylinderGeometry(r, r, D, 6, 1);
      pg.rotateX(Math.PI / 2);
      pg.translate(cornerX, cy, 0);
      conduitGeos.push(pg);

      for (let k = 0; k < clampCount; k++) {
        const pz = -halfD + k * CLAMP_SPACING;
        const cg = new THREE.TorusGeometry(r + CLAMP_R, CLAMP_R, 5, 8);
        cg.rotateY(Math.PI / 2);
        cg.translate(cornerX, cy, pz);
        clampGeos.push(cg);
      }
    }

    if (conduitGeos.length > 0) {
      const merged = mergeGeometries(conduitGeos);
      for (const g of conduitGeos) g.dispose();
      const mesh = new THREE.Mesh(merged, matCornerConduit);
      mesh.name = `corner-conduits-${side === -1 ? 'port' : 'stbd'}`;
      group.add(mesh);
    }
    if (clampGeos.length > 0) {
      const merged = mergeGeometries(clampGeos);
      for (const g of clampGeos) g.dispose();
      const mesh = new THREE.Mesh(merged, matCornerClamp);
      mesh.name = `corner-clamps-${side === -1 ? 'port' : 'stbd'}`;
      group.add(mesh);
    }
  }
}
