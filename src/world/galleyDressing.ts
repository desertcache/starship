/**
 * Galley wall dressing — v0.2 fill pass.
 * Port wall pegboard/tool rack + food lockers.
 * Fore/aft door-flank status display panels (MESS DECK / GALLEY stencils).
 *
 * FILE OWNERSHIP: only galleyProps.ts may import this module.
 */
import * as THREE from 'three';
import { cached } from '../fx/textureHelpers.js';

// ── Palette (local) ────────────────────────────────────────────────────────────
const C_GUNMETAL = 0x1c1e22;
const C_ORANGE   = 0xc7641e;

const lm = (c: number): THREE.MeshLambertMaterial =>
  new THREE.MeshLambertMaterial({ color: c, side: THREE.FrontSide });
const matGunmetal = lm(C_GUNMETAL);
const matOrange   = lm(C_ORANGE);

// ── Inline CanvasTextures ──────────────────────────────────────────────────────

function makePegboardTex(): THREE.CanvasTexture {
  return cached('galley-pegboard', () => {
    const S = 256;
    const cv = document.createElement('canvas'); cv.width = S; cv.height = S;
    const c = cv.getContext('2d')!;
    c.fillStyle = '#1A1C20'; c.fillRect(0, 0, S, S);
    c.fillStyle = 'rgba(80,85,95,0.6)';
    for (let y = 24; y < S; y += 24)
      for (let x = 24; x < S; x += 24) {
        c.beginPath(); c.arc(x, y, 3, 0, Math.PI * 2); c.fill();
      }
    const t = new THREE.CanvasTexture(cv);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  });
}

function makeMessDeckTex(): THREE.CanvasTexture {
  return cached('galley-mess-deck', () => {
    const W = 256; const H = 128;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d')!;
    c.fillStyle = '#050a0f'; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(70,224,216,0.3)'; c.lineWidth = 1; c.strokeRect(4, 4, W-8, H-8);
    c.fillStyle = 'rgba(70,224,216,0.85)'; c.font = 'bold 22px monospace'; c.textAlign = 'center';
    c.fillText('MESS DECK', W/2, H/2 - 6);
    c.font = '12px monospace'; c.fillStyle = 'rgba(70,224,216,0.5)';
    c.fillText('DECK B · FWD', W/2, H/2 + 14);
    return new THREE.CanvasTexture(cv);
  });
}

function makeGalleySignTex(): THREE.CanvasTexture {
  return cached('galley-galley-sign', () => {
    const W = 256; const H = 128;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d')!;
    c.fillStyle = '#050a0f'; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(70,224,216,0.3)'; c.lineWidth = 1; c.strokeRect(4, 4, W-8, H-8);
    c.fillStyle = 'rgba(70,224,216,0.85)'; c.font = 'bold 26px monospace'; c.textAlign = 'center';
    c.fillText('GALLEY', W/2, H/2 - 4);
    c.font = '12px monospace'; c.fillStyle = 'rgba(70,224,216,0.5)';
    c.fillText('CAUTION · HOT SURFACES', W/2, H/2 + 16);
    return new THREE.CanvasTexture(cv);
  });
}

// ── Port wall: pegboard + utensils + food lockers ─────────────────────────────

/**
 * Port wall (X=-3) pegboard 1.4×0.9 at Y=1.4 with 6 utensil silhouettes,
 * plus 2 food-supply lockers below (orange handles).
 */
export function buildPortWall(g: THREE.Group): void {
  const PORT_X = -3.0;
  const BOARD_Y = 1.40; const BOARD_Z = -0.20;
  const BOARD_W = 1.40; const BOARD_H = 0.90;

  const pegMat = new THREE.MeshLambertMaterial({ map: makePegboardTex(), side: THREE.FrontSide });
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.04, BOARD_H, BOARD_W), pegMat);
  board.name = 'pegboard';
  board.position.set(PORT_X + 0.02, BOARD_Y, BOARD_Z);
  g.add(board);

  // 6 utensil silhouettes
  type UtItem = [number, number, number, number];
  const utensilData: UtItem[] = [
    [-0.48, 0.18, 0.04, 0.03],
    [-0.22, 0.14, 0.04, 0.03],
    [ 0.02, 0.22, 0.04, 0.03],
    [ 0.22, 0.16, 0.04, 0.03],
    [-0.35, 0.08, 0.025, 0.025],
    [ 0.38, 0.10, 0.025, 0.025],
  ];
  for (let i = 0; i < utensilData.length; i++) {
    const [zOff, hh, ww] = utensilData[i];
    if (i < 4) {
      const u = new THREE.Mesh(new THREE.BoxGeometry(0.02, hh, ww), matGunmetal);
      u.name = `utensil-${i}`;
      u.position.set(PORT_X + 0.055, BOARD_Y, BOARD_Z + zOff);
      g.add(u);
    } else {
      const u = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, hh, 6), matGunmetal);
      u.name = `utensil-${i}`;
      u.position.set(PORT_X + 0.055, BOARD_Y, BOARD_Z + zOff);
      g.add(u);
    }
  }

  // 2 food-supply lockers below board
  for (const lz of [-0.32, 0.32]) {
    const locker = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.80, 0.50), matGunmetal);
    locker.position.set(PORT_X + 0.20, 0.40, BOARD_Z + lz);
    g.add(locker);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.16), matOrange);
    handle.position.set(PORT_X + 0.405, 0.55, BOARD_Z + lz);
    g.add(handle);
  }
}

// ── Door-flank status panels ───────────────────────────────────────────────────

/**
 * Gunmetal 0.8×0.4×0.06 panels with teal emissive stencil faces above each door header.
 * Galley is 6D total; fore door at Z=-3, aft at Z=+3.
 *
 * @param g - galley group
 * @param roomD - room depth (6 for galley)
 */
export function buildDoorFlankPanels(g: THREE.Group, roomD: number): void {
  const PANEL_Y = 2.2 + (3.0 - 2.2) / 2;
  const PW = 0.80; const PH = 0.40; const PD = 0.06;

  // Fore (MESS DECK)
  const forePanel = new THREE.Mesh(new THREE.BoxGeometry(PW, PH, PD), matGunmetal);
  forePanel.position.set(1.5, PANEL_Y, -roomD / 2 + PD / 2 + 0.01);
  g.add(forePanel);
  const foreScr = new THREE.Mesh(new THREE.PlaneGeometry(PW - 0.04, PH - 0.04),
    new THREE.MeshBasicMaterial({ map: makeMessDeckTex() }));
  foreScr.position.set(1.5, PANEL_Y, -roomD / 2 + PD + 0.012);
  g.add(foreScr);

  // Aft (GALLEY)
  const aftPanel = new THREE.Mesh(new THREE.BoxGeometry(PW, PH, PD), matGunmetal);
  aftPanel.position.set(1.5, PANEL_Y, roomD / 2 - PD / 2 - 0.01);
  g.add(aftPanel);
  const aftScr = new THREE.Mesh(new THREE.PlaneGeometry(PW - 0.04, PH - 0.04),
    new THREE.MeshBasicMaterial({ map: makeGalleySignTex() }));
  aftScr.rotation.y = Math.PI;
  aftScr.position.set(1.5, PANEL_Y, roomD / 2 - PD - 0.012);
  g.add(aftScr);
}
