/**
 * Galley wall dressing — v0.2 fill pass + Stage D cabinet face textures.
 * Port wall pegboard/tool rack + food lockers.
 * Fore/aft door-flank status display panels (MESS DECK / GALLEY stencils).
 * Cabinet face textured materials (panel-seam + vent-slat CanvasTextures).
 *
 * FILE OWNERSHIP: only galleyProps.ts may import this module.
 */
import * as THREE from 'three';
import { cached } from '../fx/textureHelpers.js';
import { matLockerBody, matConsoleHousing } from '../fx/propMaterials.js';

// ── Palette (local) ────────────────────────────────────────────────────────────
const C_ORANGE   = 0xc7641e;

const lm = (c: number): THREE.MeshLambertMaterial =>
  new THREE.MeshLambertMaterial({ color: c, side: THREE.FrontSide });
// v0.9 A-bridge: was flat near-black Lambert (#1C1E22) — used for the food
// lockers + pegboard utensils. Now the shared locker-body PBR singleton.
const matGunmetal: THREE.MeshStandardMaterial = matLockerBody;
const matOrange   = lm(C_ORANGE);

// ── Stage D: Cabinet face textures ────────────────────────────────────────────

/** Cabinet face CanvasTexture: panel seams + vent slats. 256×256. */
function makeCabFaceTex(variant: 'cream' | 'gunmetal' | 'orange'): THREE.CanvasTexture {
  return cached(`galley-cab-face-${variant}`, () => {
    const W = 256; const H = 256;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d')!;
    const base = variant === 'cream' ? '#C8C1AF'
               : variant === 'gunmetal' ? '#2E3238'
               : '#C7641E';
    c.fillStyle = base; c.fillRect(0, 0, W, H);
    const seams  = [W / 2];
    const hSeams = [H * 0.38, H * 0.72];
    c.fillStyle = 'rgba(4,3,2,0.90)';
    for (const sx of seams) c.fillRect(sx - 3, 0, 6, H);
    for (const sy of hSeams) c.fillRect(0, sy - 3, W, 6);
    c.fillStyle = 'rgba(255,255,255,0.22)';
    for (const sx of seams) c.fillRect(sx - 5, 0, 2, H);
    for (const sy of hSeams) c.fillRect(0, sy - 5, W, 2);
    c.fillStyle = 'rgba(0,0,0,0.40)';
    for (const sx of seams) c.fillRect(sx + 3, 0, 2, H);
    for (const sy of hSeams) c.fillRect(0, sy + 3, W, 2);
    if (variant === 'cream') {
      const nSlats = 5; const panelH = hSeams[0] - 14; const step = panelH / (nSlats + 1);
      for (let i = 1; i <= nSlats; i++) {
        const sy = 8 + step * i;
        c.fillStyle = 'rgba(10,8,5,0.80)'; c.fillRect(16, sy - 2, W - 32, 4);
        c.fillStyle = 'rgba(255,220,180,0.18)'; c.fillRect(16, sy - 2, W - 32, 1);
      }
    }
    const margin = 12;
    const px = margin; const py = hSeams[1] + margin;
    const pw = W - margin * 2; const ph = H - hSeams[1] - margin * 2;
    if (pw > 10 && ph > 10) {
      c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 1.5; c.strokeRect(px, py, pw, ph);
      c.strokeStyle = 'rgba(255,255,255,0.14)'; c.lineWidth = 1; c.strokeRect(px+2, py+2, pw-4, ph-4);
    }
    for (let i = 0; i < 6; i++) {
      const sx = 20 + Math.random() * (W - 40);
      c.fillStyle = `rgba(0,0,0,${(0.04 + Math.random() * 0.06).toFixed(3)})`;
      c.fillRect(sx, 0, 2 + Math.random() * 3, H);
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
}

/** Cream panel-seam textured cabinet face material. */
export const matCabFaceCream    = new THREE.MeshLambertMaterial({ map: makeCabFaceTex('cream'), side: THREE.FrontSide });
/** Gunmetal cabinet face material — alternate panel accent. */
export const matCabFaceGunmetal = new THREE.MeshLambertMaterial({ map: makeCabFaceTex('gunmetal'), side: THREE.FrontSide });
/** Burnt-orange cabinet face material — accent alternate. */
export const matCabFaceOrange   = new THREE.MeshLambertMaterial({ map: makeCabFaceTex('orange'), side: THREE.FrontSide });
/** Warm-amber emissive under-counter strip material. */
export const matWarmAmber = new THREE.MeshBasicMaterial({ color: 0xffb060, side: THREE.FrontSide, toneMapped: false });

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

  // Fore (MESS DECK) — wall-mounted panel housing, console-family PBR so it
  // reads as a lit box rather than a rectangular hole in the wall.
  const forePanel = new THREE.Mesh(new THREE.BoxGeometry(PW, PH, PD), matConsoleHousing);
  forePanel.position.set(1.5, PANEL_Y, -roomD / 2 + PD / 2 + 0.01);
  g.add(forePanel);
  const foreScr = new THREE.Mesh(new THREE.PlaneGeometry(PW - 0.04, PH - 0.04),
    new THREE.MeshBasicMaterial({ map: makeMessDeckTex() }));
  foreScr.position.set(1.5, PANEL_Y, -roomD / 2 + PD + 0.012);
  g.add(foreScr);

  // Aft (GALLEY)
  const aftPanel = new THREE.Mesh(new THREE.BoxGeometry(PW, PH, PD), matConsoleHousing);
  aftPanel.position.set(1.5, PANEL_Y, roomD / 2 - PD / 2 - 0.01);
  g.add(aftPanel);
  const aftScr = new THREE.Mesh(new THREE.PlaneGeometry(PW - 0.04, PH - 0.04),
    new THREE.MeshBasicMaterial({ map: makeGalleySignTex() }));
  aftScr.rotation.y = Math.PI;
  aftScr.position.set(1.5, PANEL_Y, roomD / 2 - PD - 0.012);
  g.add(aftScr);
}
