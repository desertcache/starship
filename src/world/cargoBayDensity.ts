/**
 * Cargo Bay density pass — mid-floor and wall zone fill (≤14 draw calls).
 * (e) Port crate cluster (4 DC), (f) wall conduits+breaker+pips (6 DC),
 * (g) hanging hook/chain (2 DC), (h) floor zone decals (3 DC) = 15 total.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { matCatwalkSteel, matCrateShell } from '../fx/propMaterials.js';
import type { AABB } from './types.js';

const COL_ORANGE   = 0xC7641E;
const COL_TEAL     = 0x46E0D8;
const CREAM_STR    = '#E8E2D4';

// Wall conduits, breaker box, hanging hook/chain — same catwalk-steel PBR
// family as cargoBayProps.ts's matGun() (v0.9 A-bridge; was flat near-black
// Lambert #1C1E22, a confirmed void offender in this room).
const mGun = (): THREE.MeshStandardMaterial => matCatwalkSteel;
let _mOrg: THREE.MeshLambertMaterial | null = null;
const mOrg = (): THREE.MeshLambertMaterial =>
  _mOrg ?? (_mOrg = new THREE.MeshLambertMaterial({ color: COL_ORANGE }));

// ── (e) Mid-floor port crate cluster ──────────────────────────────────────────

function buildMidFloorCrates(group: THREE.Group): AABB[] {
  const CX = -1.8; const CZ = -1.2; const CS = 0.82;
  // Shared rust material (was 2 separate instances) so crateA/crateC can merge.
  const matRustCrate = new THREE.MeshLambertMaterial({ color: 0x7A2C1F });
  const crateA = new THREE.Mesh(new THREE.BoxGeometry(CS, CS, CS), matRustCrate);
  crateA.position.set(CX, CS / 2, CZ);
  group.add(crateA);

  // Floor crate — confirmed void offender ("floor crates"); crate-shell PBR family.
  const crateB = new THREE.Mesh(new THREE.BoxGeometry(CS, CS * 0.88, CS), matCrateShell);
  crateB.rotation.y = Math.PI / 6;
  crateB.position.set(CX + 0.85, CS * 0.44, CZ + 0.1);
  group.add(crateB);

  const crateC = new THREE.Mesh(new THREE.BoxGeometry(CS, CS * 1.1, CS * 0.9), matRustCrate);
  crateC.position.set(CX - 0.05, CS * 0.55, CZ + 0.86);
  group.add(crateC);

  const strap = new THREE.Mesh(new THREE.BoxGeometry(CS + 0.01, 0.04, CS * 0.9 + 0.01), mOrg());
  strap.position.set(CX - 0.05, CS * 0.55 + 0.18, CZ + 0.86);
  group.add(strap);

  return [
    { minX: CX - 0.50, maxX: CX + 0.50, minY: 0, maxY: CS + 0.05, minZ: CZ - 0.50, maxZ: CZ + 0.50 },
    { minX: CX + 0.38, maxX: CX + 1.32, minY: 0, maxY: CS * 0.88, minZ: CZ - 0.38, maxZ: CZ + 0.55 },
    { minX: CX - 0.52, maxX: CX + 0.42, minY: 0, maxY: CS * 1.1,  minZ: CZ + 0.42, maxZ: CZ + 1.32 },
  ];
}

// ── (f) Wall conduits + hazard stripe + breaker box ───────────────────────────

function makeHazardTex(): THREE.CanvasTexture {
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 64;
  const c = cv.getContext('2d')!;
  for (let i = 0; i < 9; i++) {
    c.fillStyle = i % 2 === 0 ? '#C7641E' : '#1C1E22';
    c.fillRect(i * 16, 0, 16, 64);
  }
  return new THREE.CanvasTexture(cv);
}

function buildWallConduits(group: THREE.Group, W: number, D: number): AABB[] {
  const halfW = W / 2; const halfD = D / 2;
  const PIPE_R = 0.025; const PIPE_H = 1.60;
  const BOX_W = 0.28; const BOX_H = 0.22; const BOX_D = 0.08;

  const conduitGeos: THREE.BufferGeometry[] = [];
  const portX = -halfW + 0.04;
  for (const z of [-1.8, 0.8] as const) {
    const hb = new THREE.BoxGeometry(0.08, 0.12, 0.12); hb.translate(portX, 1.70, z);
    const vp = new THREE.CylinderGeometry(PIPE_R, PIPE_R, PIPE_H, 6);
    vp.translate(portX, 1.70 - PIPE_H / 2, z);
    conduitGeos.push(hb, vp);
  }
  const stbdX = halfW - 0.04;
  for (const z of [-1.2, 1.2] as const) {
    const hb = new THREE.BoxGeometry(0.08, 0.12, 0.12); hb.translate(stbdX, 1.70, z);
    const vp = new THREE.CylinderGeometry(PIPE_R, PIPE_R, PIPE_H, 6);
    vp.translate(stbdX, 1.70 - PIPE_H / 2, z);
    conduitGeos.push(hb, vp);
  }
  const merged = mergeGeometries(conduitGeos);
  for (const g of conduitGeos) g.dispose();
  group.add(new THREE.Mesh(merged, mGun())); // DC 1

  const hazardMat = new THREE.MeshBasicMaterial({ map: makeHazardTex(), side: THREE.FrontSide });
  const hazardPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.60, 0.40), hazardMat);
  hazardPlane.position.set(-1.2, 0.20, -halfD + 0.01);
  group.add(hazardPlane); // DC 2

  const breakerGeos: THREE.BufferGeometry[] = [];
  const bb = new THREE.BoxGeometry(BOX_D, BOX_H, BOX_W); bb.translate(stbdX, 1.55, 1.8);
  breakerGeos.push(bb);
  const merged2 = mergeGeometries(breakerGeos);
  for (const g of breakerGeos) g.dispose();
  group.add(new THREE.Mesh(merged2, mGun())); // DC 3

  const accentMesh = new THREE.Mesh(
    new THREE.BoxGeometry(BOX_D + 0.002, 0.025, BOX_W + 0.002), mOrg());
  accentMesh.position.set(stbdX, 1.55 + BOX_H / 2 - 0.0125, 1.8);
  group.add(accentMesh); // DC 4

  const pipTeal = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 5, 4),
    new THREE.MeshBasicMaterial({ color: COL_TEAL }));
  pipTeal.position.set(stbdX + 0.042, 1.60, 1.72);
  group.add(pipTeal); // DC 5

  const pipAmber = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 5, 4),
    new THREE.MeshBasicMaterial({ color: 0xE08820 }));
  pipAmber.position.set(stbdX + 0.042, 1.52, 1.88);
  group.add(pipAmber); // DC 6

  return [{
    minX: stbdX - 0.01, maxX: stbdX + BOX_D + 0.01,
    minY: 1.55 - BOX_H / 2, maxY: 1.55 + BOX_H / 2,
    minZ: 1.8 - BOX_W / 2,  maxZ: 1.8 + BOX_W / 2,
  }];
}

// ── (g) Hanging cargo hook/chain ──────────────────────────────────────────────

function buildHangingHook(group: THREE.Group): void {
  const LINK_R = 0.018; const LINK_H = 0.10;
  const linkGeos: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 4; i++) {
    const lg = new THREE.CylinderGeometry(LINK_R, LINK_R, LINK_H, 6);
    lg.translate(0.5, 2.50 - 0.06 - i * (LINK_H + 0.01), -0.8);
    linkGeos.push(lg);
  }
  const chainMerged = mergeGeometries(linkGeos);
  for (const g of linkGeos) g.dispose();
  group.add(new THREE.Mesh(chainMerged, mGun())); // DC 1

  const hookY = 2.50 - 0.06 - 4 * (LINK_H + 0.01) - 0.06;
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 6, 12), mGun());
  hook.rotation.x = Math.PI / 2;
  hook.position.set(0.5, hookY, -0.8);
  group.add(hook); // DC 2
}

// ── (h) Floor zone decals ─────────────────────────────────────────────────────

function makeZoneDecalTex(label: string): THREE.CanvasTexture {
  const W = 256; const H = 128; const BW = 18;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d')!;
  for (let i = 0; i < W / BW + 1; i++) {
    c.fillStyle = i % 2 === 0 ? '#C7641E' : '#1C1E22';
    c.fillRect(i * BW, 0, BW, BW); c.fillRect(i * BW, H - BW, BW, BW);
  }
  for (let j = 0; j < H / BW + 1; j++) {
    c.fillStyle = j % 2 === 0 ? '#C7641E' : '#1C1E22';
    c.fillRect(0, j * BW, BW, BW); c.fillRect(W - BW, j * BW, BW, BW);
  }
  c.fillStyle = '#1A1C20'; c.fillRect(BW, BW, W - BW * 2, H - BW * 2);
  c.fillStyle = CREAM_STR; c.font = 'bold 22px monospace'; c.textAlign = 'center';
  c.fillText(label, W / 2, H / 2 - 4);
  c.fillStyle = '#C7641E';
  c.beginPath(); c.moveTo(W/2 - 20, H/2 + 12); c.lineTo(W/2, H/2 + 28);
  c.lineTo(W/2 + 20, H/2 + 12); c.closePath(); c.fill();
  return new THREE.CanvasTexture(cv);
}

function buildFloorDecals(group: THREE.Group): void {
  const configs = [
    { label: 'BAY 01',    x:  0.0, z:  0.5, ry: 0,            pw: 1.6, pd: 0.8 },
    { label: 'LOAD ZONE', x: -1.8, z:  1.8, ry: Math.PI / 4,  pw: 1.2, pd: 0.6 },
    { label: 'CAUTION',   x:  1.5, z: -2.2, ry: 0,            pw: 1.0, pd: 0.5 },
  ] as const;
  for (const cfg of configs) {
    const mat = new THREE.MeshBasicMaterial({
      map: makeZoneDecalTex(cfg.label), transparent: true, opacity: 0.82, depthWrite: false,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(cfg.pw, cfg.pd), mat);
    plane.rotation.x = -Math.PI / 2;
    plane.rotation.z = cfg.ry;
    plane.position.set(cfg.x, 0.003, cfg.z);
    group.add(plane); // 1 DC each
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────

export interface CargoDensityResult { colliders: AABB[] }

/** Add density-pass props to the cargo bay group after buildCargoBayProps(). */
export function buildCargoBayDensity(
  group: THREE.Group,
  W: number,
  D: number,
): CargoDensityResult {
  const colliders: AABB[] = [];
  colliders.push(...buildMidFloorCrates(group));
  colliders.push(...buildWallConduits(group, W, D));
  buildHangingHook(group);
  buildFloorDecals(group);
  return { colliders };
}
