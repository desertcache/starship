import * as THREE from 'three';
import type { AABB } from './types.js';
import { matCounterTop } from '../fx/propMaterials.js';

const C_TEAL = 0x46e0d8;
const C_MUSTARD = 0xc8931f;
const C_RED_BASE = 0x7a2c1f;

const lm = (c: number): THREE.MeshLambertMaterial =>
  new THREE.MeshLambertMaterial({ color: c, side: THREE.FrontSide });
const bm = (c: number): THREE.MeshBasicMaterial =>
  new THREE.MeshBasicMaterial({ color: c, side: THREE.FrontSide });
// Countertop-clutter + mess-table materials (moved from galleyProps.ts to
// keep it under the 300-line limit — see buildClutter/buildMessTable below).
const matTrayGunmetal: THREE.MeshStandardMaterial = matCounterTop;
const matTealEmit     = bm(C_TEAL);
const matMustard      = lm(C_MUSTARD);
const matMetalTray    = lm(0x3a3d43);
const matCupGrey      = lm(0x3a3d45);
const matFoodPackage  = lm(C_RED_BASE);
// v0.9 RADIANCE fix-round L14: dedicated leg/support material for the mess
// table + benches — a small dark blob was reading as a hole/dropped object
// in the lit floor pool near the galley camera. These thin unlit members are
// near-invisible against the dark floor except where they cross the bright
// pool; more envMapIntensity/roughness lets them catch enough ambient light
// to read as a fixture leg, not a cutout. Scoped to legs/supports only.
const matTableLeg: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: (matCounterTop as THREE.MeshStandardMaterial).map,
  roughnessMap: (matCounterTop as THREE.MeshStandardMaterial).roughnessMap,
  roughness: 0.55,
  metalness: 0.40,
  envMapIntensity: 0.85,
  side: THREE.FrontSide,
});

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

// ── Countertop clutter + mess table (moved from galleyProps.ts) ──────────────

/** Small props scattered on the counter to break up bare surfaces. */
export function buildClutter(
  g: THREE.Group, ctrX: number, ctrH: number, aftCabZ: number, foreCabZ: number,
): void {
  // Stage D: additional props to break bare countertop
  // Metal tray + 2 canisters (existing)
  box(g, 0.28, 0.025, 0.16, ctrX, ctrH + 0.012, -1.80, matMetalTray);
  cyl(g, 0.055, 0.13, ctrX - 0.05, ctrH + 0.065, -1.90, matTealEmit);
  cyl(g, 0.050, 0.12, ctrX + 0.08, ctrH + 0.060, -1.62, matMustard);
  // Extra: ration box on aft counter zone
  box(g, 0.14, 0.10, 0.08, ctrX, ctrH + 0.05, aftCabZ - 0.15, matFoodPackage);
  // Small flat tray with rim on fore zone
  box(g, 0.22, 0.018, 0.14, ctrX - 0.05, ctrH + 0.009, foreCabZ + 0.30, matMetalTray);
  // Tall canister with gunmetal lid
  cyl(g, 0.042, 0.16, ctrX + 0.10, ctrH + 0.08, foreCabZ - 0.20, matTrayGunmetal);
}

/** Mess table + benches on the port side. Returns its AABB collider. */
export function buildMessTable(g: THREE.Group): AABB[] {
  const TX = -1.10; const TZ = -0.40;
  const TW = 1.70; const TD = 0.85; const TH = 0.78;
  const LEG = TH - 0.05;
  box(g, TW, 0.05, TD, TX, TH, TZ, matTrayGunmetal);
  for (const lx of [TX - TW / 2 + 0.08, TX + TW / 2 - 0.08]) {
    for (const lz of [TZ - TD / 2 + 0.08, TZ + TD / 2 + 0.08]) {
      box(g, 0.05, LEG, 0.05, lx, LEG / 2, lz, matTableLeg);
    }
  }
  const BENCH_H = 0.44; const BO = TD / 2 + 0.26;
  for (const [idx, bz] of [[0, TZ - BO], [1, TZ + BO]] as [number, number][]) {
    const bName = idx === 0 ? 'bench-fore' : 'bench-aft';
    box(g, TW * 0.86, 0.05, 0.30, TX, BENCH_H, bz, matTrayGunmetal, bName);
    box(g, TW * 0.78, BENCH_H - 0.025, 0.06, TX, (BENCH_H - 0.025) / 2, bz, matTableLeg);
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
