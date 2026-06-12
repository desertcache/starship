/**
 * Galley prop geometry — Phase 3b / v0.2 fill pass.
 * Counter along starboard wall (X = +3), doors fore/aft stay clear.
 * Port wall dressing and door-flank panels → galleyDressing.ts
 * FILE OWNERSHIP: only galley.ts and galleyProps.ts (+ galleyDressing.ts).
 *
 * v0.2 additions (counter/table area):
 *   - Mess table items: 2 trays, 2 cups (teal 'coffee-cup' + plain), food package
 *   - Stove: cooking pot (gunmetal cylinder, teal emissive on-pip)
 *   - Upper shelf above cabinets: 3 storage canisters (mustard/teal/gunmetal)
 *   - Fridge group named 'fridge'
 *   - Bench meshes named 'bench-fore' / 'bench-aft'
 */
import * as THREE from 'three';
import type { AABB } from './types.js';
import { matShipWall } from '../fx/shipMaterials.js';
import { buildPortWall, buildDoorFlankPanels } from './galleyDressing.js';

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
  x: number, y: number, z: number, mat: THREE.Material, name?: string): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 12, 1), mat);
  m.position.set(x, y, z);
  if (name) m.name = name;
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
  box(g, CTR_DEPTH, 0.06, NF_LEN, CTR_X, CTR_H - 0.03, NF_Z, matGunmetal);
  box(g, CTR_DEPTH - 0.02, 0.04, STOVE_LEN, CTR_X, CTR_H + 0.01, STOVE_Z_CTR, matRedBase, 'stove');
  box(g, CTR_DEPTH, CAB_H, FORE_CAB_LEN, CTR_X, CAB_H / 2, FORE_CAB_Z, matCream);
  box(g, CTR_DEPTH, CAB_H, AFT_CAB_LEN,  CTR_X, CAB_H / 2, AFT_CAB_Z,  matCream);
  const HX = CTR_FACE - 0.015;
  for (let i = 0; i < 2; i++) {
    box(g, 0.03, 0.50, 0.06, HX, CAB_H / 2, CTR_Z_MIN + (FORE_CAB_LEN / 3) * (i + 1), matOrange);
  }
  box(g, 0.03, 0.50, 0.06, HX, CAB_H / 2, STOVE_Z_MAX + AFT_CAB_LEN / 2, matOrange);
  box(g, CTR_DEPTH, 0.10, NF_LEN, CTR_X, 0.05, NF_Z, matDark);
  const splashH = UPR_Y_BOT - CTR_H;
  box(g, 0.025, splashH, UPR_LEN, WALL_X - 0.012, CTR_H + splashH / 2, UPR_Z_CTR, matShipWall);
  return [{ minX: CTR_FACE, minY: 0, minZ: CTR_Z_MIN, maxX: WALL_X, maxY: CTR_H + 0.10, maxZ: CTR_Z_MAX }];
}

function buildUpperCabinets(g: THREE.Group): void {
  box(g, UPR_DEPTH, UPR_H, UPR_LEN, UPR_X, UPR_Y_BOT + UPR_H / 2, UPR_Z_CTR, matCream);
  for (let i = 1; i < 3; i++) {
    box(g, UPR_DEPTH + 0.006, UPR_H + 0.008, 0.028,
      UPR_X, UPR_Y_BOT + UPR_H / 2, CTR_Z_MIN + (UPR_LEN / 3) * i, matGunmetal);
  }
  const HX = UPR_FACE - 0.015;
  for (let i = 0; i < 3; i++) {
    box(g, 0.03, 0.38, 0.06, HX, UPR_Y_BOT + UPR_H / 2, CTR_Z_MIN + (UPR_LEN / 4) * (i + 1), matOrange);
  }
  const strip = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.04, UPR_LEN), matTealEmit);
  strip.position.set(UPR_FACE + 0.05, UPR_Y_BOT - 0.02, UPR_Z_CTR);
  g.add(strip);

  // Upper shelf above cabinets + 3 storage canisters
  const SHELF_Y = UPR_Y_BOT + UPR_H + 0.04;
  const SHELF_LEN = 1.10;
  box(g, UPR_DEPTH - 0.05, 0.04, SHELF_LEN, UPR_X, SHELF_Y + 0.02, CTR_Z_MIN + SHELF_LEN / 2 + 0.10, matGunmetal);

  const CANISTER_MATS = [matMustard, matTealEmit, matGunmetal];
  const CAN_Z_START = CTR_Z_MIN + 0.20;
  for (let i = 0; i < 3; i++) {
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.18, 10), CANISTER_MATS[i]);
    can.position.set(UPR_X, SHELF_Y + 0.04 + 0.09, CAN_Z_START + i * 0.30);
    g.add(can);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.025, 10), matGunmetal);
    lid.position.set(UPR_X, SHELF_Y + 0.04 + 0.18 + 0.012, CAN_Z_START + i * 0.30);
    g.add(lid);
  }
}

function buildStove(g: THREE.Group): void {
  for (const cz of [STOVE_Z_MIN + 0.28, STOVE_Z_MIN + 0.82]) {
    for (const cx of [CTR_X - 0.12, CTR_X + 0.12]) {
      const coil = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.020, 6, 14), matCoilGlow);
      coil.position.set(cx, CTR_H + 0.035, cz);
      coil.rotation.x = Math.PI / 2;
      g.add(coil);
    }
  }
  // Cooking pot
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.14, 14), matGunmetal);
  pot.position.set(CTR_X, CTR_H + 0.07 + 0.01, STOVE_Z_MIN + 0.82);
  g.add(pot);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.015, 6, 16), matGunmetal);
  rim.position.set(CTR_X, CTR_H + 0.07 + 0.13, STOVE_Z_MIN + 0.82);
  rim.rotation.x = Math.PI / 2;
  g.add(rim);
  const pip = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.01, 8), matTealEmit);
  pip.position.set(CTR_X, CTR_H + 0.07 + 0.145, STOVE_Z_MIN + 0.82);
  g.add(pip);
}

function buildFridge(g: THREE.Group): AABB[] {
  const fLen = FRIDGE_Z_MAX - FRIDGE_Z_MIN;
  const fridgeGroup = new THREE.Group(); fridgeGroup.name = 'fridge';
  box(fridgeGroup, CTR_DEPTH, FRIDGE_H, fLen, CTR_X, FRIDGE_H / 2, FRIDGE_Z_CTR, matDark);
  box(fridgeGroup, 0.030, FRIDGE_H * 0.88, 0.07, CTR_FACE - 0.015, FRIDGE_H * 0.50, FRIDGE_Z_CTR, matTealEmit);
  box(fridgeGroup, 0.030, 0.045, 0.20, CTR_FACE - 0.02, FRIDGE_H * 0.72, FRIDGE_Z_CTR, matOrange);
  g.add(fridgeGroup);
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
    for (const lz of [TZ - TD / 2 + 0.08, TZ + TD / 2 + 0.08]) {
      box(g, 0.05, LEG, 0.05, lx, LEG / 2, lz, matGunmetal);
    }
  }
  const BENCH_H = 0.44; const BO = TD / 2 + 0.26;
  for (const [idx, bz] of [[0, TZ - BO], [1, TZ + BO]] as [number, number][]) {
    const bName = idx === 0 ? 'bench-fore' : 'bench-aft';
    box(g, TW * 0.86, 0.05, 0.30, TX, BENCH_H, bz, matDark, bName);
    box(g, TW * 0.78, BENCH_H - 0.025, 0.06, TX, (BENCH_H - 0.025) / 2, bz, matGunmetal);
  }

  // Table items
  box(g, 0.28, 0.02, 0.20, TX - 0.35, TH + 0.01, TZ - 0.10, matMetalTray);
  box(g, 0.28, 0.02, 0.20, TX + 0.30, TH + 0.01, TZ + 0.15, matMetalTray);
  cyl(g, 0.038, 0.09, TX - 0.42, TH + 0.045, TZ + 0.18, matTealEmit, 'coffee-cup');
  cyl(g, 0.036, 0.085, TX + 0.42, TH + 0.042, TZ - 0.20,
    new THREE.MeshLambertMaterial({ color: 0x3a3d45 }));
  box(g, 0.14, 0.10, 0.08, TX, TH + 0.05, TZ,
    new THREE.MeshLambertMaterial({ color: 0x7a2c1f }));

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
  buildPortWall(group);
  buildDoorFlankPanels(group, 6);
  return { colliders };
}
