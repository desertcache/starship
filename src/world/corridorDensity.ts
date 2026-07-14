/**
 * Corridor density helpers — Phase 3 additions.
 * Baseboard + crown channels, vertical ribs, quarters-junction widening.
 * Called by corridor.ts only.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { matWall } from './materials.js';
import { matPipeDark } from '../fx/propMaterials.js';
import { SURFACE_EPS } from './constants.js';
import type { AABB } from './types.js';

const BB_H = 0.18;  // baseboard height
const BB_D = 0.04;  // baseboard depth (proud of wall)
const CR_H = 0.12;  // crown height
const CR_D = 0.06;  // crown depth

const RIB_H = 2.6;
// v0.9 RADIANCE fix-round H1: cross-section widened (0.16/0.05 → 0.22/0.11)
// for sub-pixel-at-distance margin in general.
const RIB_W = 0.22;
const RIB_D = 0.11;
// v0.9 RADIANCE fix-round H1 (root-cause pass): the original [-6,-3,0,3,6]
// put two ribs EXACTLY at the two porthole centers (P1_Z=3.0, P2_Z=-6.0 in
// corridor.ts) — the rib box's Z-band overlaps the porthole bezel torus's
// Z-reach there (bezel1 spans Z≈[2.42,3.58], bezel2 spans Z≈[-6.45,-5.55]),
// a genuine 3D geometry intersection, not a pure aliasing artifact — a prior
// pass already tried a material swap for this exact "black bar slicing the
// porthole" symptom and it didn't fix the z-fighting comb edge (crop-proven
// again on qa-jitter-a/b, headed GPU). Repositioned to clear BOTH porthole
// Z-bands and the quarters-junction widened span (JCT_Z_FORE/AFT below) with
// margin, while keeping 5 ribs spread across the 16m corridor.
const RIB_ZS = [-7.0, -4.2, 0, 4.6, 7.2] as const;

// Module-level material singleton — do not allocate inside functions.
// v0.9 A-bridge: was flat near-black Lambert (#1C1E22) — the vertical ribs in
// particular were confirmed on real-GPU screenshots as a solid black bar
// slicing through the aft porthole (rib at Z=3 aligns exactly with the
// porthole at P1_Z=3.0). Dark pipe-metal PBR family, same as the corridor's
// other structural trim fixes.
const _matGunmetal = matPipeDark;

// Junction widening constants
const JCT_Z_FORE = -3.0;
const JCT_Z_AFT  = -1.0;
const JCT_OUT    = 0.65;
const WALL_T     = 0.05;

/**
 * Add baseboard + crown channel strips to both side walls and end caps.
 * Merged per wall → 4 draw calls total (2 sides × baseboard+crown merged).
 * Room-facing faces sit SURFACE_EPS proud of the wall planes and baseboard
 * bottoms sink SURFACE_EPS into the floor; exact coplanarity here caused the
 * doorway-header sawtooth z-fight (a prior material swap could not fix —
 * see rib comment above).
 */
export function addBaseboardsAndCrowns(
  group: THREE.Group,
  W: number,
  H: number,
  D: number,
): void {
  const halfW = W / 2;
  const halfD = D / 2;

  // Side walls — baseboard + crown merged per side
  for (const side of ['port', 'starboard'] as const) {
    const sign  = side === 'port' ? -1 : 1;
    const wXOuter = sign * (halfW + BB_D / 2 - SURFACE_EPS);

    const bbGeo = new THREE.BoxGeometry(BB_D, BB_H, D);
    bbGeo.translate(wXOuter, BB_H / 2 - SURFACE_EPS, 0);

    const crGeo = new THREE.BoxGeometry(CR_D, CR_H, D);
    // Crown Y stays at H: top face is opposite-facing vs ceiling (no fight); lowering would open a visible slit.
    crGeo.translate(sign * (halfW + CR_D / 2 - SURFACE_EPS), H - CR_H / 2, 0);

    const parts = [bbGeo, crGeo];
    const merged = mergeGeometries(parts);
    for (const g of parts) g.dispose();
    const mesh   = new THREE.Mesh(merged, _matGunmetal);
    group.add(mesh);
  }

  // Fore/aft end caps
  for (const [wZEnd, sign] of [[-halfD, -1], [halfD, 1]] as [number, number][]) {
    const bbGeo = new THREE.BoxGeometry(W, BB_H, BB_D);
    bbGeo.translate(0, BB_H / 2 - SURFACE_EPS, wZEnd + sign * (BB_D / 2 - SURFACE_EPS));
    const crGeo = new THREE.BoxGeometry(W, CR_H, CR_D);
    crGeo.translate(0, H - CR_H / 2, wZEnd + sign * (CR_D / 2 - SURFACE_EPS));
    const parts = [bbGeo, crGeo];
    const merged = mergeGeometries(parts);
    for (const g of parts) g.dispose();
    const mesh   = new THREE.Mesh(merged, _matGunmetal);
    group.add(mesh);
  }
}

/**
 * Add 5 vertical ribs per side wall, merged per side → 2 draw calls total.
 * Rib faces sit SURFACE_EPS proud of the wall plane — flush placement made
 * ribs render only by WINNING a depth tie vs the wall; any change to the
 * merged matPipeDark bucket flips the tie and ribs comb/vanish.
 */
export function addVerticalRibs(
  group: THREE.Group,
  W: number,
): void {
  const halfW   = W / 2;

  for (const side of ['port', 'starboard'] as const) {
    const sign  = side === 'port' ? -1 : 1;
    const wX    = sign * (halfW + RIB_D / 2 - SURFACE_EPS);

    const ribGeos: THREE.BufferGeometry[] = [];
    for (const rz of RIB_ZS) {
      const g = new THREE.BoxGeometry(RIB_D, RIB_H, RIB_W);
      g.translate(wX, RIB_H / 2, rz);
      ribGeos.push(g);
    }
    const mesh = new THREE.Mesh(mergeGeometries(ribGeos), _matGunmetal);
    for (const g of ribGeos) g.dispose();
    group.add(mesh);
  }
}

/**
 * Widen the corridor at the quarters junction (local Z=-3 to -1).
 * Adds outer face panels + fore/aft return walls on each side.
 * Returns additional colliders for the expanded section.
 */
export function addQuartersJunction(
  group: THREE.Group,
  W: number,
  H: number,
): AABB[] {
  const halfW = W / 2;
  const jctLen = JCT_Z_AFT - JCT_Z_FORE; // 2.0
  const colliders: AABB[] = [];

  for (const side of ['port', 'starboard'] as const) {
    const sign     = side === 'port' ? -1 : 1;
    const wXInner  = sign * halfW;
    const wXOuter  = sign * (halfW + JCT_OUT);
    const rotYFace = side === 'port' ? Math.PI / 2 : -Math.PI / 2;

    // Outer face panel (facing into corridor)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(jctLen, H), matWall);
    face.position.set(wXOuter, H / 2, (JCT_Z_FORE + JCT_Z_AFT) / 2);
    face.rotation.y = rotYFace;
    group.add(face);

    // Fore return wall (bridging inner → outer at Z=JCT_Z_FORE)
    const retX     = side === 'port' ? wXInner - JCT_OUT / 2 : wXInner + JCT_OUT / 2;
    const foreRet  = new THREE.Mesh(new THREE.PlaneGeometry(JCT_OUT, H), matWall);
    foreRet.position.set(retX, H / 2, JCT_Z_FORE);
    foreRet.rotation.y = Math.PI;
    group.add(foreRet);

    // Aft return wall
    const aftRet  = new THREE.Mesh(new THREE.PlaneGeometry(JCT_OUT, H), matWall);
    aftRet.position.set(retX, H / 2, JCT_Z_AFT);
    aftRet.rotation.y = 0;
    group.add(aftRet);

    // Collider for the widened section
    const cMinX = side === 'port' ? wXOuter - WALL_T : wXInner;
    const cMaxX = side === 'port' ? wXInner + WALL_T : wXOuter + WALL_T;
    colliders.push({
      minX: cMinX, minY: 0, minZ: JCT_Z_FORE,
      maxX: cMaxX, maxY: H, maxZ: JCT_Z_AFT,
    });
  }

  return colliders;
}
