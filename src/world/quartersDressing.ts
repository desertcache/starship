/**
 * Quarters wall dressing builders — v0.2 fill pass.
 * Bunk surround, porthole reveal, overhead cabinet, wall tablet,
 * hooks, toolboard, framed picture, potted plant, light switch plate.
 * All use shared materials from quartersProps.ts; inline CanvasTextures here.
 *
 * Coordinate conventions: X port(−)/starboard(+), Y deck=0, Z fore(−)/aft(+).
 */
import * as THREE from 'three';
import { cached } from '../fx/textureHelpers.js';
import {
  matGunmetal, matCream, matTealEmit, matOrange, matRust,
  matTealPlant,
} from './quartersProps.js';

// ── Inline CanvasTextures ──────────────────────────────────────────────────────

function makeToolboardTex(): THREE.CanvasTexture {
  return cached('qtr-toolboard', () => {
    const S = 256;
    const cv = document.createElement('canvas'); cv.width = S; cv.height = S;
    const c = cv.getContext('2d')!;
    c.fillStyle = '#1A1C20'; c.fillRect(0, 0, S, S);
    c.fillStyle = 'rgba(80,85,95,0.5)';
    for (let y = 32; y < S; y += 32)
      for (let x = 32; x < S; x += 32) {
        c.beginPath(); c.arc(x, y, 3, 0, Math.PI * 2); c.fill();
      }
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  });
}

function makeTabletScreenTex(): THREE.CanvasTexture {
  return cached('qtr-tablet-scr', () => {
    const W = 128; const H = 96;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d')!;
    c.fillStyle = '#071816'; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(70,224,216,0.3)'; c.lineWidth = 1;
    for (let y = 16; y < H; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    for (let x = 16; x < W; x += 16) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    c.fillStyle = 'rgba(70,224,216,0.85)'; c.font = '9px monospace';
    c.fillText('STATUS OK', 6, 14); c.fillText('BRG 247°', 6, 26); c.fillText('ALT 3.2k', 6, 38);
    return new THREE.CanvasTexture(cv);
  });
}

function makePictureTex(): THREE.CanvasTexture {
  return cached('qtr-picture', () => {
    const S = 128;
    const cv = document.createElement('canvas'); cv.width = S; cv.height = S;
    const c = cv.getContext('2d')!;
    c.fillStyle = '#2a1a0a'; c.fillRect(0, 0, S, S);
    const g = c.createRadialGradient(S/2, S/2, 0, S/2, S/2, S*0.55);
    g.addColorStop(0, 'rgba(200,160,100,0.9)'); g.addColorStop(1, 'rgba(60,40,20,0.7)');
    c.fillStyle = g; c.fillRect(6, 6, S-12, S-12);
    c.fillStyle = 'rgba(30,60,80,0.6)'; c.fillRect(6, S/2, S-12, S/2-6);
    return new THREE.CanvasTexture(cv);
  });
}

// ── Shared mesh helper ─────────────────────────────────────────────────────────

function bx(geo: THREE.BufferGeometry, mat: THREE.Material, name?: string): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  if (name) m.name = name;
  return m;
}

// ── Bunk surround ──────────────────────────────────────────────────────────────

/**
 * Gunmetal recessed surround 0.08m proud from fore wall (Z=-2.5).
 * Jambs + header + cream sill + teal reading-light strip.
 */
export function buildBunkSurround(roomGroup: THREE.Group, bunkXCenter: number, _bunkZPos: number): void {
  const WALL_Z = -2.5;
  const SURR_DEPTH = 0.08;
  const SURR_CTR_Z = WALL_Z + SURR_DEPTH / 2;
  const FACE_Z = WALL_Z + SURR_DEPTH;
  const BUNK_W = 2.00;
  const BUNK_H_LOWER = 0.76;
  const BUNK_H_UPPER = 1.08;
  const JAMB_W = 0.12;
  const HEADER_H = 0.12;
  const SILL_H = 0.05;
  const SILL_D = 0.12;

  const lJamb = bx(new THREE.BoxGeometry(JAMB_W, BUNK_H_UPPER, SURR_DEPTH), matGunmetal);
  lJamb.position.set(bunkXCenter - BUNK_W / 2 - JAMB_W / 2, BUNK_H_UPPER / 2, SURR_CTR_Z);
  roomGroup.add(lJamb);

  const rJamb = bx(new THREE.BoxGeometry(JAMB_W, BUNK_H_UPPER, SURR_DEPTH), matGunmetal);
  rJamb.position.set(bunkXCenter + BUNK_W / 2 + JAMB_W / 2, BUNK_H_UPPER / 2, SURR_CTR_Z);
  roomGroup.add(rJamb);

  const header = bx(new THREE.BoxGeometry(BUNK_W + JAMB_W * 2, HEADER_H, SURR_DEPTH), matGunmetal);
  header.position.set(bunkXCenter, BUNK_H_UPPER + HEADER_H / 2, SURR_CTR_Z);
  roomGroup.add(header);

  const sill = bx(new THREE.BoxGeometry(BUNK_W, SILL_H, SILL_D), matCream);
  sill.position.set(bunkXCenter, BUNK_H_LOWER + SILL_H / 2, FACE_Z + SILL_D / 2);
  roomGroup.add(sill);

  const strip = bx(new THREE.BoxGeometry(0.60, 0.03, 0.02), matTealEmit);
  strip.position.set(bunkXCenter, BUNK_H_UPPER - 0.04, FACE_Z - 0.01);
  roomGroup.add(strip);
}

// ── Porthole reveal ────────────────────────────────────────────────────────────

/**
 * 4 gunmetal reveal panels + orange rim flange + cream sill around porthole.
 * Window: 1.0W × 0.8H centred at Y=1.6, Z=0 in outer wall (X=±2.5).
 */
export function buildPortholeReveal(roomGroup: THREE.Group, xWall: number): void {
  const DEPTH = 0.08; const WIN_W = 1.00; const WIN_H = 0.80;
  const WIN_Y = 1.60; const WIN_Z = 0.00; const FLANGE = 0.04;
  const REVEAL_H = WIN_H + 0.08 * 2;
  const sign = xWall < 0 ? 1 : -1;
  const revX = xWall + sign * DEPTH / 2;
  const T = 0.06;

  const top = bx(new THREE.BoxGeometry(DEPTH + FLANGE, T, WIN_W), matGunmetal);
  top.position.set(revX, WIN_Y + WIN_H / 2 + T / 2, WIN_Z); roomGroup.add(top);
  const bot = bx(new THREE.BoxGeometry(DEPTH + FLANGE, T, WIN_W), matGunmetal);
  bot.position.set(revX, WIN_Y - WIN_H / 2 - T / 2, WIN_Z); roomGroup.add(bot);
  const left = bx(new THREE.BoxGeometry(DEPTH + FLANGE, REVEAL_H, T), matGunmetal);
  left.position.set(revX, WIN_Y, WIN_Z - WIN_W / 2 - T / 2); roomGroup.add(left);
  const right = bx(new THREE.BoxGeometry(DEPTH + FLANGE, REVEAL_H, T), matGunmetal);
  right.position.set(revX, WIN_Y, WIN_Z + WIN_W / 2 + T / 2); roomGroup.add(right);

  const ft = 0.025;
  const rimX = xWall + sign * (DEPTH + FLANGE + ft / 2);
  const rimTop = bx(new THREE.BoxGeometry(ft, ft, WIN_W + ft * 2 + 0.05), matOrange);
  rimTop.position.set(rimX, WIN_Y + WIN_H / 2 + ft / 2, WIN_Z); roomGroup.add(rimTop);
  const rimBot = bx(new THREE.BoxGeometry(ft, ft, WIN_W + ft * 2 + 0.05), matOrange);
  rimBot.position.set(rimX, WIN_Y - WIN_H / 2 - ft / 2, WIN_Z); roomGroup.add(rimBot);
  const rimL = bx(new THREE.BoxGeometry(ft, WIN_H + ft * 2, ft), matOrange);
  rimL.position.set(rimX, WIN_Y, WIN_Z - WIN_W / 2 - ft / 2); roomGroup.add(rimL);
  const rimR = bx(new THREE.BoxGeometry(ft, WIN_H + ft * 2, ft), matOrange);
  rimR.position.set(rimX, WIN_Y, WIN_Z + WIN_W / 2 + ft / 2); roomGroup.add(rimR);

  const sill = bx(new THREE.BoxGeometry(DEPTH, 0.05, 0.70), matCream);
  sill.position.set(revX, WIN_Y - WIN_H / 2 - 0.025 + 0.03, WIN_Z);
  roomGroup.add(sill);
}

// ── Overhead storage cabinet ───────────────────────────────────────────────────

/**
 * 0.35D × 0.45H × 2.0L cabinet at Y=2.3 against outer wall, 3 orange nubs.
 */
export function buildOverheadCabinet(roomGroup: THREE.Group, xWall: number, bunkZPos: number): void {
  const CW = 2.00; const CH = 0.45; const CD = 0.35; const Y = 2.3;
  const sign = xWall < 0 ? 1 : -1;
  const cabX = xWall + sign * CD / 2;

  const body = bx(new THREE.BoxGeometry(CD, CH, CW), matGunmetal);
  body.position.set(cabX, Y + CH / 2, bunkZPos);
  roomGroup.add(body);

  const face = bx(new THREE.BoxGeometry(0.01, CH - 0.04, CW - 0.04), matCream);
  face.position.set(xWall + sign * (CD + 0.005), Y + CH / 2, bunkZPos);
  roomGroup.add(face);

  for (const nz of [-0.65, 0, 0.65]) {
    const nub = bx(new THREE.BoxGeometry(0.03, 0.06, 0.12), matOrange);
    nub.position.set(xWall + sign * (CD + 0.015), Y + CH / 2, bunkZPos + nz);
    roomGroup.add(nub);
  }
}

// ── Wall-bolted tablet ─────────────────────────────────────────────────────────

/**
 * 0.30×0.22×0.03 gunmetal tablet with teal screen + cream bezel.
 * Named dataPadName for geometry-only identification.
 */
export function buildWallTablet(roomGroup: THREE.Group, xWall: number, tabletZ: number, dataPadName: string): void {
  const sign = xWall < 0 ? 1 : -1;
  const D = 0.03; const WT = 0.30; const HT = 0.22;

  const body = bx(new THREE.BoxGeometry(D, HT, WT), matGunmetal, dataPadName);
  body.position.set(xWall + sign * D / 2, 1.4, tabletZ);
  roomGroup.add(body);

  const bezel = bx(new THREE.BoxGeometry(0.005, HT - 0.02, WT - 0.02), matCream);
  bezel.position.set(xWall + sign * (D + 0.003), 1.4, tabletZ);
  roomGroup.add(bezel);

  const screenMat = new THREE.MeshBasicMaterial({ map: makeTabletScreenTex(), color: 0x46e0d8 });
  const screen = bx(new THREE.BoxGeometry(0.004, HT - 0.04, WT - 0.06), screenMat);
  screen.position.set(xWall + sign * (D + 0.006), 1.4, tabletZ);
  roomGroup.add(screen);
}

// ── Hanging hooks + coat ───────────────────────────────────────────────────────

/**
 * 3 torus hooks on inner wall + coat-shape box hanging from middle hook.
 */
export function buildHooks(roomGroup: THREE.Group, xWall: number, hookZ: number): void {
  const sign = xWall < 0 ? 1 : -1;
  const mountX = xWall + sign * 0.05;

  for (let i = 0; i < 3; i++) {
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 6, 12), matGunmetal);
    hook.position.set(mountX, 1.85, hookZ + (i - 1) * 0.22);
    hook.rotation.y = Math.PI / 2;
    roomGroup.add(hook);
  }

  const coat = bx(new THREE.BoxGeometry(0.04, 0.32, 0.28),
    new THREE.MeshLambertMaterial({ color: 0x3a2a1a }));
  coat.position.set(mountX + sign * 0.025, 1.55, hookZ);
  roomGroup.add(coat);
}

// ── Room-A toolboard ───────────────────────────────────────────────────────────

/**
 * Gunmetal toolboard 1.0×0.7 with 5 hung-tool silhouettes (room A, maintenance vibe).
 */
export function buildToolboard(roomGroup: THREE.Group, xWall: number, toolZ: number): void {
  const sign = xWall < 0 ? 1 : -1;
  const bX = xWall + sign * 0.03;

  const board = bx(new THREE.BoxGeometry(0.03, 0.70, 1.00),
    new THREE.MeshLambertMaterial({ map: makeToolboardTex() }));
  board.position.set(bX, 1.70, toolZ);
  roomGroup.add(board);

  const toolZs = [-0.38, -0.19, 0.0, 0.19, 0.38];
  const toolH  = [0.30, 0.22, 0.35, 0.20, 0.28];
  for (let i = 0; i < 5; i++) {
    const t = bx(new THREE.BoxGeometry(0.025, toolH[i], 0.04), matRust);
    t.position.set(bX + sign * 0.025, 1.72, toolZ + toolZs[i]);
    roomGroup.add(t);
  }
}

// ── Room-B framed picture + teal potted plant ──────────────────────────────────

/**
 * Small framed picture on inner wall (room B personal vibe).
 */
export function buildFramedPicture(roomGroup: THREE.Group, xWall: number, picZ: number): void {
  const sign = xWall < 0 ? 1 : -1;

  const frame = bx(new THREE.BoxGeometry(0.03, 0.30, 0.26),
    new THREE.MeshLambertMaterial({ color: 0x2a1a0a }));
  frame.position.set(xWall + sign * 0.015, 1.72, picZ);
  roomGroup.add(frame);

  const pic = bx(new THREE.BoxGeometry(0.005, 0.22, 0.18),
    new THREE.MeshBasicMaterial({ map: makePictureTex() }));
  pic.position.set(xWall + sign * 0.032, 1.72, picZ);
  roomGroup.add(pic);
}

/**
 * Teal cylinder pot + dark green foliage sphere.
 */
export function buildPottedPlant(roomGroup: THREE.Group, x: number, z: number): void {
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.12, 10), matTealPlant);
  pot.position.set(x, 0.06, z);
  roomGroup.add(pot);

  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 10),
    new THREE.MeshLambertMaterial({ color: 0x1a1008 }));
  soil.position.set(x, 0.125, z);
  roomGroup.add(soil);

  const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 6),
    new THREE.MeshLambertMaterial({ color: 0x1a5a30 }));
  foliage.position.set(x, 0.26, z);
  roomGroup.add(foliage);
}

// ── Light switch plate ─────────────────────────────────────────────────────────

/**
 * Small wall plate for a future 'Toggle Lights' switch (integrationTask).
 * Named 'light-switch-plate'.
 */
export function buildLightSwitchPlate(roomGroup: THREE.Group, xWall: number, plateZ: number): void {
  const sign = xWall < 0 ? 1 : -1;
  const plate = bx(new THREE.BoxGeometry(0.02, 0.12, 0.08),
    new THREE.MeshLambertMaterial({ color: 0x2c3038 }), 'light-switch-plate');
  plate.position.set(xWall + sign * 0.01, 1.20, plateZ);
  roomGroup.add(plate);

  const pip = bx(new THREE.BoxGeometry(0.008, 0.02, 0.02), matTealEmit);
  pip.position.set(xWall + sign * 0.025, 1.20, plateZ);
  roomGroup.add(pip);
}
