/**
 * Quarters wall dressing — Room-A/B cosmetic props (split from quartersDressing.ts).
 * Contains: toolboard, framed picture, potted plant, light switch plate.
 * Exported from this module AND re-exported through quartersDressing.ts for
 * backward-compat with existing imports in quarters.ts.
 */
import * as THREE from 'three';
import { cached } from '../fx/textureHelpers.js';
import { matRust, matTealEmit, matTealPlant } from './quartersProps.js';

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
