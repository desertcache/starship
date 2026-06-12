/**
 * Galley prop geometry — Phase 3b.
 * Counter along starboard wall (X = +3), doors fore/aft stay clear.
 * FILE OWNERSHIP: only galley.ts and galleyProps.ts.
 */
import * as THREE from 'three';
import type { AABB } from './types.js';
import { matShipWall } from '../fx/shipMaterials.js';

// Palette
const C_GUNMETAL   = 0x1c1e22;
const C_CREAM      = 0xe8e2d4;
const C_ORANGE     = 0xc7641e;
const C_TEAL       = 0x46e0d8;
const C_DARK       = 0x111214;
const C_RED_BASE   = 0x7a2c1f;
const C_RED_GLOW   = 0xcc3322;
const C_MUSTARD    = 0xc8931f;
const C_METAL_TRAY = 0x3a3d43;

const lm = (c: number): THREE.MeshLambertMaterial =>
  new THREE.MeshLambertMaterial({ color: c, side: THREE.FrontSide });
const bm = (c: number): THREE.MeshBasicMaterial =>
  new THREE.MeshBasicMaterial({ color: c, side: THREE.FrontSide });

const matGunmetal  = lm(C_GUNMETAL);
const matCream     = lm(C_CREAM);
const matOrange    = lm(C_ORANGE);
const matDark      = lm(C_DARK);
const matRedBase   = lm(C_RED_BASE);
const matTealEmit  = bm(C_TEAL);
const matCoilGlow  = bm(C_RED_GLOW);
const matMustard   = lm(C_MUSTARD);
const matMetalTray = lm(C_METAL_TRAY);

function box(
  g: THREE.Group, w: number, h: number, d: number,
  x: number, y: number, z: number,
  mat: THREE.Material, name?: string,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  if (name) m.name = name;
  g.add(m);
  return m;
}

function cyl(g: THREE.Group, r: number, h: number,
  x: number, y: number, z: number, mat: THREE.Material): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 12, 1), mat);
  m.position.set(x, y, z);
  g.add(m);
  return m;
}

// Layout constants
const WALL_X = 3.0;
const CTR_DEPTH = 0.55;
const CTR_H = 0.90;
const CTR_X = WALL_X - CTR_DEPTH / 2;
const CTR_FACE = WALL_X - CTR_DEPTH;

const CTR_Z_MIN   = -2.20;
const CTR_Z_MAX   =  1.40;
const FRIDGE_Z_MIN =  0.70;
const FRIDGE_Z_MAX = CTR_Z_MAX;
const FRIDGE_Z_CTR = (FRIDGE_Z_MIN + FRIDGE_Z_MAX) / 2;
const FRIDGE_H     = 2.10;
const STOVE_Z_MIN  = -1.20;
const STOVE_Z_MAX  =  0.00;
const STOVE_Z_CTR  = (STOVE_Z_MIN + STOVE_Z_MAX) / 2;
const STOVE_LEN    = STOVE_Z_MAX - STOVE_Z_MIN;

const FORE_CAB_LEN = STOVE_Z_MIN - CTR_Z_MIN;
const FORE_CAB_Z   = (CTR_Z_MIN + STOVE_Z_MIN) / 2;
const AFT_CAB_LEN  = FRIDGE_Z_MIN - STOVE_Z_MAX;
const AFT_CAB_Z    = (STOVE_Z_MAX + FRIDGE_Z_MIN) / 2;
const NF_LEN = FRIDGE_Z_MIN - CTR_Z_MIN;
const NF_Z   = (CTR_Z_MIN + FRIDGE_Z_MIN) / 2;

const UPR_Y_BOT = 1.50;
const UPR_H     = 1.05;
const UPR_DEPTH = 0.38;
const UPR_X     = WALL_X - UPR_DEPTH / 2;
const UPR_FACE  = WALL_X - UPR_DEPTH;
const UPR_LEN   = FRIDGE_Z_MIN - CTR_Z_MIN;
const UPR_Z_CTR = (CTR_Z_MIN + FRIDGE_Z_MIN) / 2;

function buildCounterRun(g: THREE.Group): AABB[] {
  const CAB_H = CTR_H - 0.06;
  // Worktop slab
  box(g, CTR_DEPTH, 0.06, NF_LEN, CTR_X, CTR_H - 0.03, NF_Z, matGunmetal);
  // Stove cooktop (named for Phase 4 interaction)
  box(g, CTR_DEPTH - 0.02, 0.04, STOVE_LEN, CTR_X, CTR_H + 0.01, STOVE_Z_CTR, matRedBase, 'stove');
  // Lower cabinet bodies (cream)
  box(g, CTR_DEPTH, CAB_H, FORE_CAB_LEN, CTR_X, CAB_H / 2, FORE_CAB_Z, matCream);
  box(g, CTR_DEPTH, CAB_H, AFT_CAB_LEN,  CTR_X, CAB_H / 2, AFT_CAB_Z,  matCream);
  // Orange handles on front face of lower cabs
  const HX = CTR_FACE - 0.015;
  for (let i = 0; i < 2; i++) {
    box(g, 0.03, 0.50, 0.06, HX, CAB_H / 2, CTR_Z_MIN + (FORE_CAB_LEN / 3) * (i + 1), matOrange);
  }
  box(g, 0.03, 0.50, 0.06, HX, CAB_H / 2, STOVE_Z_MAX + AFT_CAB_LEN / 2, matOrange);
  // Kick plate + backsplash
  box(g, CTR_DEPTH, 0.10, NF_LEN, CTR_X, 0.05, NF_Z, matDark);
  const splashH = UPR_Y_BOT - CTR_H;
  box(g, 0.025, splashH, UPR_LEN, WALL_X - 0.012, CTR_H + splashH / 2, UPR_Z_CTR, matShipWall);
  return [{ minX: CTR_FACE, minY: 0, minZ: CTR_Z_MIN, maxX: WALL_X, maxY: CTR_H + 0.10, maxZ: CTR_Z_MAX }];
}

function buildUpperCabinets(g: THREE.Group): void {
  // Cream cabinet body
  box(g, UPR_DEPTH, UPR_H, UPR_LEN, UPR_X, UPR_Y_BOT + UPR_H / 2, UPR_Z_CTR, matCream);
  // Gunmetal divider seams
  for (let i = 1; i < 3; i++) {
    box(g, UPR_DEPTH + 0.006, UPR_H + 0.008, 0.028,
      UPR_X, UPR_Y_BOT + UPR_H / 2, CTR_Z_MIN + (UPR_LEN / 3) * i, matGunmetal);
  }
  // Orange handle strips on front face
  const HX = UPR_FACE - 0.015;
  for (let i = 0; i < 3; i++) {
    box(g, 0.03, 0.38, 0.06, HX, UPR_Y_BOT + UPR_H / 2, CTR_Z_MIN + (UPR_LEN / 4) * (i + 1), matOrange);
  }
  // Under-cabinet emissive teal strip (horizontal, at bottom of uppers)
  const strip = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.04, UPR_LEN), matTealEmit);
  strip.position.set(UPR_FACE + 0.05, UPR_Y_BOT - 0.02, UPR_Z_CTR);
  g.add(strip);
}

function buildStove(g: THREE.Group): void {
  // 2×2 red emissive coil rings on cooktop
  for (const cz of [STOVE_Z_MIN + 0.28, STOVE_Z_MIN + 0.82]) {
    for (const cx of [CTR_X - 0.12, CTR_X + 0.12]) {
      const coil = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.020, 6, 14), matCoilGlow);
      coil.position.set(cx, CTR_H + 0.035, cz);
      coil.rotation.x = Math.PI / 2;
      g.add(coil);
    }
  }
}

function buildFridge(g: THREE.Group): AABB[] {
  const fLen = FRIDGE_Z_MAX - FRIDGE_Z_MIN;
  box(g, CTR_DEPTH, FRIDGE_H, fLen, CTR_X, FRIDGE_H / 2, FRIDGE_Z_CTR, matDark);
  // Teal stripe + orange handle on front face
  box(g, 0.030, FRIDGE_H * 0.88, 0.07, CTR_FACE - 0.015, FRIDGE_H * 0.50, FRIDGE_Z_CTR, matTealEmit);
  box(g, 0.030, 0.045, 0.20, CTR_FACE - 0.02, FRIDGE_H * 0.72, FRIDGE_Z_CTR, matOrange);
  return [{ minX: CTR_FACE, minY: 0, minZ: FRIDGE_Z_MIN, maxX: WALL_X, maxY: FRIDGE_H, maxZ: FRIDGE_Z_MAX }];
}

function buildClutter(g: THREE.Group): void {
  box(g, 0.28, 0.025, 0.16, CTR_X, CTR_H + 0.012, -1.80, matMetalTray);
  cyl(g, 0.055, 0.13, CTR_X - 0.05, CTR_H + 0.065, -1.90, matTealEmit);
  cyl(g, 0.050, 0.12, CTR_X + 0.08, CTR_H + 0.060, -1.62, matMustard);
}

function buildMessTable(g: THREE.Group): AABB[] {
  const TX = -1.10; const TZ = -0.40;
  const TW = 1.70; const TD = 0.85; const TH = 0.78;
  const LEG = TH - 0.05;
  box(g, TW, 0.05, TD, TX, TH, TZ, matGunmetal);
  for (const lx of [TX - TW / 2 + 0.08, TX + TW / 2 - 0.08]) {
    for (const lz of [TZ - TD / 2 + 0.08, TZ + TD / 2 - 0.08]) {
      box(g, 0.05, LEG, 0.05, lx, LEG / 2, lz, matGunmetal);
    }
  }
  const BENCH_H = 0.44; const BO = TD / 2 + 0.26;
  for (const bz of [TZ - BO, TZ + BO]) {
    box(g, TW * 0.86, 0.05, 0.30, TX, BENCH_H, bz, matDark);
    box(g, TW * 0.78, BENCH_H - 0.025, 0.06, TX, (BENCH_H - 0.025) / 2, bz, matGunmetal);
  }
  return [{ minX: TX - TW / 2, minY: 0, minZ: TZ - TD / 2 - BO - 0.18,
            maxX: TX + TW / 2, maxY: TH, maxZ: TZ + TD / 2 + BO + 0.18 }];
}

export interface GalleyPropResult { colliders: AABB[] }

/** Add all galley props. Returns AABB colliders for counter, fridge, table. */
export function addGalleyProps(group: THREE.Group): GalleyPropResult {
  const colliders: AABB[] = [];
  colliders.push(...buildCounterRun(group));
  buildUpperCabinets(group);
  buildStove(group);
  colliders.push(...buildFridge(group));
  buildClutter(group);
  colliders.push(...buildMessTable(group));
  return { colliders };
}
