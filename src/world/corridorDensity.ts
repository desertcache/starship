/**
 * Corridor density helpers — Phase 3 additions.
 * Baseboard + crown channels, vertical ribs, quarters-junction widening.
 * Called by corridor.ts only.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { matWall } from './materials.js';
import type { AABB } from './types.js';

const BB_H = 0.18;  // baseboard height
const BB_D = 0.04;  // baseboard depth (proud of wall)
const CR_H = 0.12;  // crown height
const CR_D = 0.06;  // crown depth

const RIB_H = 2.6;
const RIB_W = 0.16;
const RIB_D = 0.05;
const RIB_ZS = [-6, -3, 0, 3, 6] as const;

// Junction widening constants
const JCT_Z_FORE = -3.0;
const JCT_Z_AFT  = -1.0;
const JCT_OUT    = 0.65;
const WALL_T     = 0.05;

/**
 * Add baseboard + crown channel strips to both side walls and end caps.
 * Merged per wall → 4 draw calls total (2 sides × baseboard+crown merged).
 */
export function addBaseboardsAndCrowns(
  group: THREE.Group,
  W: number,
  H: number,
  D: number,
): void {
  const halfW = W / 2;
  const halfD = D / 2;
  const matGunmetal = new THREE.MeshLambertMaterial({ color: 0x1C1E22 });

  // Side walls — baseboard + crown merged per side
  for (const side of ['port', 'starboard'] as const) {
    const sign  = side === 'port' ? -1 : 1;
    const wXOuter = sign * (halfW + BB_D / 2);

    const bbGeo = new THREE.BoxGeometry(BB_D, BB_H, D);
    bbGeo.translate(wXOuter, BB_H / 2, 0);

    const crGeo = new THREE.BoxGeometry(CR_D, CR_H, D);
    crGeo.translate(sign * (halfW + CR_D / 2), H - CR_H / 2, 0);

    const merged = mergeGeometries([bbGeo, crGeo]);
    const mesh   = new THREE.Mesh(merged, matGunmetal);
    group.add(mesh);
  }

  // Fore/aft end caps
  for (const [wZEnd, sign] of [[-halfD, -1], [halfD, 1]] as [number, number][]) {
    const bbGeo = new THREE.BoxGeometry(W, BB_H, BB_D);
    bbGeo.translate(0, BB_H / 2, wZEnd + sign * BB_D / 2);
    const crGeo = new THREE.BoxGeometry(W, CR_H, CR_D);
    crGeo.translate(0, H - CR_H / 2, wZEnd + sign * CR_D / 2);
    const merged = mergeGeometries([bbGeo, crGeo]);
    const mesh   = new THREE.Mesh(merged, matGunmetal);
    group.add(mesh);
  }
}

/**
 * Add 5 vertical ribs per side wall, merged per side → 2 draw calls total.
 */
export function addVerticalRibs(
  group: THREE.Group,
  W: number,
): void {
  const halfW   = W / 2;
  const matGunmetal = new THREE.MeshLambertMaterial({ color: 0x1C1E22 });

  for (const side of ['port', 'starboard'] as const) {
    const sign  = side === 'port' ? -1 : 1;
    const wX    = sign * (halfW + RIB_D / 2);

    const ribGeos: THREE.BufferGeometry[] = [];
    for (const rz of RIB_ZS) {
      const g = new THREE.BoxGeometry(RIB_D, RIB_H, RIB_W);
      g.translate(wX, RIB_H / 2, rz);
      ribGeos.push(g);
    }
    const mesh = new THREE.Mesh(mergeGeometries(ribGeos), matGunmetal);
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
