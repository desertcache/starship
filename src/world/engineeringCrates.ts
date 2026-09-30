import * as THREE from 'three';
import type { AABB } from './types.js';
import { matCrateShell } from '../fx/propMaterials.js';

const COL_ORANGE = 0xC7641E;
// Singleton materials used inside crate/floor-panel builders
let _mCrateOrange: THREE.MeshBasicMaterial | null = null;
const matCrateOrange = (): THREE.MeshBasicMaterial =>
  _mCrateOrange ?? (_mCrateOrange = new THREE.MeshBasicMaterial({ color: COL_ORANGE }));

let _mFloorPanel: THREE.MeshLambertMaterial | null = null;
const matFloorPanel = (): THREE.MeshLambertMaterial =>
  _mFloorPanel ?? (_mFloorPanel = new THREE.MeshLambertMaterial({ color: 0x0a0c10, side: THREE.FrontSide }));

let _mFloorSeam: THREE.MeshBasicMaterial | null = null;
const matFloorSeam = (): THREE.MeshBasicMaterial =>
  _mFloorSeam ?? (_mFloorSeam = new THREE.MeshBasicMaterial({ color: 0x46e0d8, side: THREE.FrontSide }));

// ── Crates ─────────────────────────────────────────────────────────────────────

export interface CrateResult { group: THREE.Group; collider: AABB; visual: THREE.Group; bodyMesh: THREE.Mesh; }

/**
 * v1.2.1 (found while planning): the slide tween moved the whole `group`
 * below, but the hidden floor panel was ALSO parented to it (buildCrates()),
 * so it slid along by the same offset and was never actually revealed.
 * getCrateBGroup() now returns crate-b's VISUAL sub-group (shell + trim
 * only) — sliding THAT moves just the crate, while the panel, on the outer
 * (never-moved) `group`, stays behind and becomes reachable. */
let _crateBGroup: THREE.Group | null = null;
let _crateBBodyMesh: THREE.Mesh | null = null;
/** Crate-b's VISUAL sub-group — slide THIS, not the outer group (above). */
export function getCrateBGroup(): THREE.Group | null { return _crateBGroup; }
/** Crate-b's shell mesh — a real, visible onBeforeRender host for the tween
 *  tick (a Group's never fires — see world/shipTicks.ts). */
export function getCrateBBodyMesh(): THREE.Mesh | null { return _crateBBodyMesh; }

function buildCrate(x: number, z: number, w: number, h: number, d: number, crateName: string): CrateResult {
  const g = new THREE.Group(); g.name = crateName;
  // v1.2.1: everything that visually slides lives here, not on `g` (see
  // above) — `g` never moves, so crate-b's floor panel stays put on it.
  const visual = new THREE.Group(); visual.name = `${crateName}-visual`;
  g.add(visual);
  const T = 0.04;
  const sm = matCrateOrange();
  // Crate shell — confirmed void offender ("crate shells"). Crate-shell PBR family.
  const bm = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matCrateShell);
  bm.position.set(x, h/2, z); visual.add(bm);
  ([
    [x, h-T/2, z-d/2+T/2, w,T,T], [x, h-T/2, z+d/2-T/2, w,T,T],
    [x-w/2+T/2, h-T/2, z, T,T,d], [x+w/2-T/2, h-T/2, z, T,T,d],
  ] as [number,number,number,number,number,number][]).forEach(([bpx,bpy,bpz,sw,sh,sd]) => {
    const s = new THREE.Mesh(new THREE.BoxGeometry(sw, sh, sd), sm);
    s.position.set(bpx, bpy, bpz); visual.add(s);
  });
  return {
    group: g,
    visual,
    bodyMesh: bm,
    collider: {
      minX: x-w/2, minY: 0, minZ: z-d/2,
      maxX: x+w/2, maxY: h, maxZ: z+d/2,
    },
  };
}

function buildHiddenFloorPanel(g: THREE.Group, x: number, z: number, w: number, d: number): void {
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(w-0.04, d-0.04), matFloorPanel());
  panel.name = 'hidden-floor-panel'; panel.rotation.x = -Math.PI/2;
  panel.position.set(x, 0.001, z); g.add(panel);
  const sm = matFloorSeam(); const st = 0.012;
  ([
    [x, z-d/2+st/2, w-0.04, st], [x, z+d/2-st/2, w-0.04, st],
    [x-w/2+st/2, z, st, d-0.04], [x+w/2-st/2, z, st, d-0.04],
  ] as [number,number,number,number][]).forEach(([sx,sz,sw,sd]) => {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(sw, sd), sm);
    s.rotation.x = -Math.PI/2; s.position.set(sx, 0.002, sz); g.add(s);
  });
}

export function buildCrates(halfW: number, _halfD: number): CrateResult[] {
  const CRATE_B_X = -halfW+1.55; const CRATE_B_Z = -0.3;
  const crateA = buildCrate(-halfW+0.65, -0.5, 0.70, 0.55, 0.55, 'crate-a');
  const crateB = buildCrate(CRATE_B_X, CRATE_B_Z, 0.55, 0.42, 0.55, 'crate-b');
  // Parented to the STATIC outer group, not crateB.visual — see above.
  buildHiddenFloorPanel(crateB.group, CRATE_B_X, CRATE_B_Z, 0.55, 0.55);
  _crateBGroup = crateB.visual;
  _crateBBodyMesh = crateB.bodyMesh;
  return [crateA, crateB];
}
