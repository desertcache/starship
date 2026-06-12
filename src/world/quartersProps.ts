/**
 * Quarters prop builders — core furniture (Phase 3b / v0.2).
 * Bunk, lockers, nightstand. Materials are singletons shared with quartersDressing.ts.
 * Wall dressing (surround, reveal, cabinet, tablet, hooks, etc.) → quartersDressing.ts
 *
 * Coordinate conventions (all in room-local space):
 *   X: -2.5 port / +2.5 starboard
 *   Y: 0 = deck
 *   Z: -2.5 fore / +2.5 aft
 *
 * Bunk group: origin at centre of bunk footprint, head = -Z, foot = +Z.
 *   Caller positions group: bunk back face touching fore wall.
 *   → group.position.z = -1.98
 *
 * Locker group: origin at back face (Z = 0), lockers spread along X axis.
 *   → group.position.z = +2.5, lockers face -Z into room.
 *
 * Nightstand group: origin at floor center of stand base.
 */
import * as THREE from 'three';
import type { AABB } from './types.js';

// ── Material singletons (shared with quartersDressing.ts) ─────────────────────

/** Dark gunmetal — bunk frame posts, rails, locker bodies. */
export const matGunmetal     = new THREE.MeshLambertMaterial({ color: 0x1c1e22 });
/** Slightly lighter slab for mattress. */
export const matMattress     = new THREE.MeshLambertMaterial({ color: 0x2e3038 });
/** Deep-red blanket band — Room A. */
export const matBlanketA     = new THREE.MeshLambertMaterial({ color: 0x7a2c1f });
/** Burnt-orange blanket band — Room B. */
export const matBlanketB     = new THREE.MeshLambertMaterial({ color: 0xc7641e });
/** Off-white pillow. */
export const matPillow       = new THREE.MeshLambertMaterial({ color: 0xd8d2c4 });
/** Locker body — dark gunmetal, slightly lighter than walls. */
export const matLockerBody   = new THREE.MeshLambertMaterial({ color: 0x2c3038 });
/** Orange handle stripe on lockers. */
export const matLockerHandle = new THREE.MeshLambertMaterial({ color: 0xc7641e });
/** Shelf / nightstand surface. */
export const matShelf        = new THREE.MeshLambertMaterial({ color: 0x252830 });
/** Cup / mug body. */
export const matCup          = new THREE.MeshLambertMaterial({ color: 0x3a3d45 });
/** Datapad body. */
export const matDatapad      = new THREE.MeshLambertMaterial({ color: 0x181a1e });
/** Emissive screen face — faint teal glow. */
export const matDataScreen   = new THREE.MeshBasicMaterial({ color: 0x1e8070 });
/** Teal emissive — reading light strip, tablet screen. */
export const matTealEmit     = new THREE.MeshBasicMaterial({ color: 0x46e0d8 });
/** Cream bezel for tablet / sill. */
export const matCream        = new THREE.MeshLambertMaterial({ color: 0xe8e2d4 });
/** Orange rim / flange / cabinet handles. */
export const matOrange       = new THREE.MeshLambertMaterial({ color: 0xc7641e });
/** Rust / red — toolboard hung-tool silhouettes for room A. */
export const matRust         = new THREE.MeshLambertMaterial({ color: 0x7a2c1f });
/** Teal potted plant (room B accent). */
export const matTealPlant    = new THREE.MeshLambertMaterial({ color: 0x2aaa96 });

// ── Geometry singletons (reused across both rooms) ─────────────────────────────

// Bunk
const geoPost      = new THREE.BoxGeometry(0.07, 0.76, 0.07);
const geoRailX     = new THREE.BoxGeometry(2.00, 0.05, 0.05);
const geoRailZ     = new THREE.BoxGeometry(0.05, 0.05, 1.00);
const geoMattress  = new THREE.BoxGeometry(1.90, 0.16, 0.98);
const geoBlanket   = new THREE.BoxGeometry(1.90, 0.18, 0.28);
const geoPillow    = new THREE.BoxGeometry(0.82, 0.10, 0.28);

// Lockers
const geoLockBody  = new THREE.BoxGeometry(0.50, 1.86, 0.35);
const geoLockSeam  = new THREE.BoxGeometry(0.007, 1.86, 0.01);
const geoLockHndl  = new THREE.BoxGeometry(0.10, 0.70, 0.06);

// Nightstand
const geoNstand    = new THREE.BoxGeometry(0.44, 0.54, 0.38);
const geoCup       = new THREE.BoxGeometry(0.09, 0.14, 0.09);
const geoPadBody   = new THREE.BoxGeometry(0.30, 0.026, 0.22);
const geoPadScr    = new THREE.BoxGeometry(0.24, 0.029, 0.16);

import { createPropTween } from './propTween.js';
import type { PropTween } from './propTween.js';

// ── Helper ─────────────────────────────────────────────────────────────────────

function b(geo: THREE.BufferGeometry, mat: THREE.Material): THREE.Mesh {
  return new THREE.Mesh(geo, mat);
}

// ── Bunk ───────────────────────────────────────────────────────────────────────

export interface BunkResult {
  /** Group root — mesh.name = 'bunk' for Phase 4 interaction hook. */
  group: THREE.Group;
  /** AABB in group-local space. */
  collider: AABB;
}

/**
 * Build a sturdy freighter bunk.
 * Head at -Z, foot at +Z. Frame width 2.0 along X, depth 1.0 along Z.
 * Posts run Y = 0..0.76. Mattress top at Y ≈ 0.96.
 *
 * @param blanketMat - room-specific blanket material.
 */
export function buildBunk(blanketMat: THREE.MeshLambertMaterial): BunkResult {
  const g = new THREE.Group();
  g.name = 'bunk';

  // Corner posts — X=±0.93, Z=±0.46
  const postXZ: [number, number][] = [[-0.93, -0.46], [0.93, -0.46], [-0.93, 0.46], [0.93, 0.46]];
  for (const [px, pz] of postXZ) {
    const m = b(geoPost, matGunmetal);
    m.position.set(px, 0.38, pz);
    g.add(m);
  }

  // Side rails (along X)
  const ry = 0.74;
  const rfore = b(geoRailX, matGunmetal); rfore.position.set(0, ry, -0.46); g.add(rfore);
  const raft  = b(geoRailX, matGunmetal); raft.position.set(0, ry, 0.46);  g.add(raft);

  // End rails (along Z)
  const rl = b(geoRailZ, matGunmetal); rl.position.set(-0.93, ry, 0); g.add(rl);
  const rr = b(geoRailZ, matGunmetal); rr.position.set( 0.93, ry, 0); g.add(rr);

  // Mattress slab
  const mat = b(geoMattress, matMattress);
  mat.position.set(0, 0.84, 0);
  g.add(mat);

  // Blanket band at foot
  const blanket = b(geoBlanket, blanketMat);
  blanket.position.set(0, 0.94, 0.35);
  g.add(blanket);

  // Pillow at head
  const pillow = b(geoPillow, matPillow);
  pillow.position.set(0, 0.945, -0.32);
  g.add(pillow);

  const collider: AABB = {
    minX: -1.00, maxX: 1.00,
    minY: 0,     maxY: 1.02,
    minZ: -0.53, maxZ: 0.53,
  };

  return { group: g, collider };
}

// ── Lockers ────────────────────────────────────────────────────────────────────

export interface LockersResult {
  group: THREE.Group;
  colliders: AABB[];
}

/**
 * Build a bank of lockers.
 * Geometry: lockers spread along X axis, back face at Z=0, face at Z=-0.35.
 * Place group at Z = +2.5 (aft wall) so back flush to wall, face into room.
 *
 * @param count - 2 or 3 lockers.
 * @param xCenter - X offset to centre the bank (default 0).
 * @param namePrefix - mesh.name on the group (default 'lockers').
 */
export function buildLockers(count: 2 | 3, xCenter = 0, namePrefix = 'lockers'): LockersResult {
  const g = new THREE.Group();
  g.name = namePrefix;
  const colliders: AABB[] = [];

  const step = 0.54;
  const half = (count - 1) * step / 2;

  for (let i = 0; i < count; i++) {
    const xOff = xCenter + (-half + i * step);

    const body = b(geoLockBody, matLockerBody);
    body.position.set(xOff, 0.93, -0.175);
    g.add(body);

    const seam = b(geoLockSeam, matGunmetal);
    seam.position.set(xOff, 0.93, -0.352);
    g.add(seam);

    const handle = b(geoLockHndl, matLockerHandle);
    handle.position.set(xOff, 0.93, -0.375);
    g.add(handle);

    colliders.push({
      minX: xOff - 0.25,  maxX: xOff + 0.25,
      minY: 0,             maxY: 1.88,
      minZ: -0.38,         maxZ: 0.02,
    });
  }

  return { group: g, colliders };
}

// ── Single interactable locker with hinged door ────────────────────────────────

export interface LockerWithDoorResult {
  group: THREE.Group;
  collider: AABB;
  tween: PropTween;
  /** Locker id — used by interactWiring to name the interactable. */
  id: string;
}

/** Build one interactable locker with hinged door. roomKind='A'→toolbox, 'B'→photo. */
export function buildLockerWithDoor(
  xCenter: number, lockerId: string, roomKind: 'A' | 'B',
): LockerWithDoorResult {
  const LW = 0.50; const LH = 1.86; const LD = 0.35; const FT = 0.03;
  const g = new THREE.Group(); g.name = lockerId;
  const fm = matLockerBody;
  // Frame: back panel + top + bottom + two jambs
  const panels: [number,number,number,number,number,number][] = [
    [xCenter+LW/2-FT/2, LH/2, -LD/2, FT, LH, LD],
    [xCenter, LH-FT/2, -LD/2, LW, FT, LD],
    [xCenter, FT/2, -LD/2, LW, FT, LD],
    [xCenter-LW/2+FT/2, LH/2, -LD+FT/2, FT, LH-FT*2, FT],
    [xCenter+LW/2-FT/2, LH/2, -LD+FT/2, FT, LH-FT*2, FT],
  ];
  for (const [px,py,pz,pw,ph,pd] of panels) {
    const m = b(new THREE.BoxGeometry(pw,ph,pd), fm);
    m.position.set(px,py,pz); g.add(m);
  }
  // Interior: jacket silhouette + shelf
  const jm = b(new THREE.BoxGeometry(0.04, 0.38, 0.24),
    new THREE.MeshLambertMaterial({ color: 0x2a1a0a }));
  jm.position.set(xCenter, LH*0.6, -LD/2); g.add(jm);
  const sh = b(new THREE.BoxGeometry(LW-FT*3, FT, LD-FT*2), fm);
  sh.position.set(xCenter, LH*0.38, -LD/2); g.add(sh);
  if (roomKind === 'A') {
    const tb = b(new THREE.BoxGeometry(0.18, 0.12, 0.15), matGunmetal);
    tb.position.set(xCenter, LH*0.38+FT+0.06, -LD/2); g.add(tb);
  } else {
    const ph2 = b(new THREE.BoxGeometry(0.01, 0.18, 0.14),
      new THREE.MeshLambertMaterial({ color: 0x2a1a0a }));
    ph2.position.set(xCenter+LW/2-FT, LH*0.55, -LD/2); g.add(ph2);
  }
  // Hinge group: pivot at -X edge, Z face. Door swings +X (along wall = no trap risk).
  const hg = new THREE.Group(); hg.name = `${lockerId}-hinge`;
  hg.position.set(xCenter-LW/2, 0, -LD+FT);
  const DW = LW-FT; const DH = LH-FT*2;
  const door = b(new THREE.BoxGeometry(DW, DH, FT), fm);
  door.position.set(DW/2, LH/2, 0); hg.add(door);
  const st = b(new THREE.BoxGeometry(0.022, DH*0.8, FT+0.005), matLockerHandle);
  st.position.set(DW-0.04, LH/2, 0); hg.add(st);
  g.add(hg);
  const tween = createPropTween(400, (v) => { hg.rotation.y = -v*(Math.PI/2); });
  const tw = tween;
  door.onBeforeRender = (): void => { tw.tick(); };
  const collider: AABB = {
    minX: xCenter-LW/2, maxX: xCenter+LW/2, minY: 0, maxY: LH, minZ: -LD, maxZ: 0,
  };
  return { group: g, collider, tween, id: lockerId };
}

// ── Nightstand ─────────────────────────────────────────────────────────────────

export interface NightstandResult {
  group: THREE.Group;
  collider: AABB;
}

/**
 * Small bedside shelf.
 * Origin at floor center of stand base.
 */
export function buildNightstand(): NightstandResult {
  const g = new THREE.Group();

  const stand = b(geoNstand, matShelf);
  stand.position.set(0, 0.27, 0);
  g.add(stand);

  // Cup on top
  const cup = b(geoCup, matCup);
  cup.position.set(-0.13, 0.61, 0.06);
  g.add(cup);

  // Datapad flat on top
  const pad = b(geoPadBody, matDatapad);
  pad.position.set(0.05, 0.553, -0.03);
  g.add(pad);

  // Emissive screen face
  const scr = b(geoPadScr, matDataScreen);
  scr.position.set(0.05, 0.568, -0.03);
  g.add(scr);

  const collider: AABB = {
    minX: -0.22, maxX: 0.22,
    minY: 0,     maxY: 0.70,
    minZ: -0.19, maxZ: 0.19,
  };

  return { group: g, collider };
}
