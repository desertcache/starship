/**
 * Galley prop geometry — Phase 3b / v0.2 fill pass + v0.3 fridge hinge.
 * Stage D: cabinet face textures, warm-amber under-counter strip, extra props.
 * Counter along starboard wall (X = +3), doors fore/aft stay clear.
 * Port wall dressing and door-flank panels → galleyDressing.ts
 * FILE OWNERSHIP: only galley.ts and galleyProps.ts (+ galleyDressing.ts).
 *
 * v0.3 changes:
 *   - buildFridge: frame+body + separate hinged door in a hinge Group.
 *   - Interior: dark cavity, 2 shelf slabs, up to 3 ration box meshes.
 *   - getFridgeHingeGroup / getFridgeRationMeshes exported for interactItems.ts.
 */
import * as THREE from 'three';
import type { AABB } from './types.js';
import { matShipWall } from '../fx/shipMaterials.js';
import { buildPortWall, buildDoorFlankPanels, matCabFaceCream, matCabFaceGunmetal, matCabFaceOrange, matWarmAmber } from './galleyDressing.js';
import { createPropTween } from './propTween.js';
import type { PropTween } from './propTween.js';

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
const matMustard      = lm(C_MUSTARD);
const matMetalTray    = lm(C_METAL_TRAY);
const matCupGrey      = lm(0x3a3d45);
const matFoodPackage  = lm(C_RED_BASE);

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

  // Stage D: cabinet face planes — textured panel-seam treatment
  // Fore cabinet face (FORE_CAB — cream with seams)
  const fFace = new THREE.Mesh(new THREE.PlaneGeometry(FORE_CAB_LEN, CAB_H), matCabFaceCream);
  fFace.rotation.y = Math.PI / 2;
  fFace.position.set(CTR_FACE - 0.001, CAB_H / 2, FORE_CAB_Z);
  g.add(fFace);

  // Aft cabinet face (AFT_CAB — gunmetal alternate)
  const aFace = new THREE.Mesh(new THREE.PlaneGeometry(AFT_CAB_LEN, CAB_H), matCabFaceGunmetal);
  aFace.rotation.y = Math.PI / 2;
  aFace.position.set(CTR_FACE - 0.001, CAB_H / 2, AFT_CAB_Z);
  g.add(aFace);

  // Stage D: warm-amber emissive under-counter strip along counter front edge
  const warmStrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.015, 0.025, NF_LEN),
    matWarmAmber,
  );
  warmStrip.position.set(CTR_FACE + 0.008, 0.035, NF_Z);
  g.add(warmStrip);

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

  // Stage D: upper cabinet face — orange variant for accent
  const uFace = new THREE.Mesh(new THREE.PlaneGeometry(UPR_LEN, UPR_H), matCabFaceOrange);
  uFace.rotation.y = Math.PI / 2;
  uFace.position.set(UPR_FACE - 0.001, UPR_Y_BOT + UPR_H / 2, UPR_Z_CTR);
  g.add(uFace);

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

// ── Fridge hinge state (module-level singletons) ───────────────────────────────

let _fridgeHingeGroup: THREE.Group | null = null;
let _fridgeRationMeshes: THREE.Mesh[] = [];
let _fridgeTween: PropTween | null = null;

/** World-space interactable position for wiring. */
export const FRIDGE_INTERACT_POS = new THREE.Vector3(CTR_FACE - 0.30, FRIDGE_H * 0.55, FRIDGE_Z_CTR);

/** Get the hinge group (door pivots around its +Z edge, swings -X into room). */
export function getFridgeHingeGroup(): THREE.Group | null { return _fridgeHingeGroup; }

/** Get ration box meshes (up to 3 visible when door is open). */
export function getFridgeRationMeshes(): THREE.Mesh[] { return _fridgeRationMeshes; }

/** Get the door tween for open/close animation. */
export function getFridgeTween(): PropTween | null { return _fridgeTween; }

function buildFridgeInterior(g: THREE.Group, bodyD: number, frameT: number): void {
  const iW = bodyD - 0.04; const iZ = FRIDGE_Z_CTR; const iX = CTR_X - frameT / 2;
  const iD = (FRIDGE_Z_MAX - FRIDGE_Z_MIN) - frameT * 2 - 0.04;
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x080a0c });
  const shelfMat = new THREE.MeshLambertMaterial({ color: 0x1a1c20 });
  const bp = new THREE.Mesh(new THREE.BoxGeometry(0.01, FRIDGE_H - frameT * 2 - 0.04, iD), darkMat);
  bp.position.set(iX - iW / 2, FRIDGE_H / 2, iZ); g.add(bp);
  for (const sy of [FRIDGE_H * 0.35, FRIDGE_H * 0.62]) {
    const sh = new THREE.Mesh(new THREE.BoxGeometry(iW - 0.02, 0.018, iD - 0.02), shelfMat);
    sh.position.set(iX, sy, iZ); g.add(sh);
  }
  _fridgeRationMeshes = [];
  const rm = new THREE.MeshLambertMaterial({ color: 0x6a2a18 });
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.07, 0.08), rm);
    r.name = `fridge-ration-${i}`;
    r.position.set(iX, FRIDGE_H * 0.35 + 0.053, FRIDGE_Z_MIN + frameT + 0.06 + i * 0.12);
    r.visible = false; g.add(r); _fridgeRationMeshes.push(r);
  }
}

function buildFridge(g: THREE.Group): AABB[] {
  const fLen = FRIDGE_Z_MAX - FRIDGE_Z_MIN;
  const fg = new THREE.Group(); fg.name = 'fridge';
  const FT = 0.045; const BD = CTR_DEPTH - FT;
  // Frame: back + top + bottom + fore/aft jambs
  box(fg, BD, FRIDGE_H, fLen, CTR_X - FT/2, FRIDGE_H/2, FRIDGE_Z_CTR, matGunmetal);
  box(fg, CTR_DEPTH, FT, fLen, CTR_X, FRIDGE_H - FT/2, FRIDGE_Z_CTR, matGunmetal);
  box(fg, CTR_DEPTH, FT, fLen, CTR_X, FT/2, FRIDGE_Z_CTR, matGunmetal);
  box(fg, CTR_DEPTH, FRIDGE_H-FT*2, FT, CTR_X, FRIDGE_H/2, FRIDGE_Z_MIN+FT/2, matGunmetal);
  box(fg, CTR_DEPTH, FRIDGE_H-FT*2, FT, CTR_X, FRIDGE_H/2, FRIDGE_Z_MAX-FT/2, matGunmetal);
  buildFridgeInterior(fg, BD, FT);
  // Hinge group — pivot at X=CTR_FACE+DW/2, Z=FRIDGE_Z_MIN+FT
  const DW = CTR_DEPTH - FT; const DH = FRIDGE_H - FT*2 - 0.008; const DD = fLen - FT*2;
  _fridgeHingeGroup = new THREE.Group(); _fridgeHingeGroup.name = 'fridge-hinge';
  _fridgeHingeGroup.position.set(CTR_FACE + DW/2, 0, FRIDGE_Z_MIN + FT);
  const dp = new THREE.Mesh(new THREE.BoxGeometry(DW, DH, DD), matGunmetal);
  dp.position.set(-DW/2, FRIDGE_H/2, DD/2); _fridgeHingeGroup.add(dp);
  const st = new THREE.Mesh(new THREE.BoxGeometry(0.022, DH*0.88, 0.06), matTealEmit);
  st.position.set(-DW - 0.012, FRIDGE_H/2, DD/2); _fridgeHingeGroup.add(st);
  const hnd = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.045, 0.20), matOrange);
  hnd.position.set(-DW - 0.018, FRIDGE_H*0.72, DD/2); _fridgeHingeGroup.add(hnd);
  fg.add(_fridgeHingeGroup);
  // Tween: hinge.rotation.y 0→PI/2
  const hr = _fridgeHingeGroup;
  _fridgeTween = createPropTween(400, (v) => { hr.rotation.y = v * (Math.PI / 2); });
  const tw = _fridgeTween;
  dp.onBeforeRender = (): void => { tw.tick(); };
  g.add(fg);
  return [{ minX: CTR_FACE, minY: 0, minZ: FRIDGE_Z_MIN, maxX: WALL_X, maxY: FRIDGE_H, maxZ: FRIDGE_Z_MAX }];
}

function buildClutter(g: THREE.Group): void {
  // Stage D: additional props to break bare countertop
  // Metal tray + 2 canisters (existing)
  box(g, 0.28, 0.025, 0.16, CTR_X, CTR_H + 0.012, -1.80, matMetalTray);
  cyl(g, 0.055, 0.13, CTR_X - 0.05, CTR_H + 0.065, -1.90, matTealEmit);
  cyl(g, 0.050, 0.12, CTR_X + 0.08, CTR_H + 0.060, -1.62, matMustard);
  // Extra: ration box on aft counter zone
  box(g, 0.14, 0.10, 0.08, CTR_X, CTR_H + 0.05, AFT_CAB_Z - 0.15, matFoodPackage);
  // Small flat tray with rim on fore zone
  box(g, 0.22, 0.018, 0.14, CTR_X - 0.05, CTR_H + 0.009, FORE_CAB_Z + 0.30, matMetalTray);
  // Tall canister with gunmetal lid
  cyl(g, 0.042, 0.16, CTR_X + 0.10, CTR_H + 0.08, FORE_CAB_Z - 0.20, matGunmetal);
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
  cyl(g, 0.036, 0.085, TX + 0.42, TH + 0.042, TZ - 0.20, matCupGrey);
  box(g, 0.14, 0.10, 0.08, TX, TH + 0.05, TZ, matFoodPackage);

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
