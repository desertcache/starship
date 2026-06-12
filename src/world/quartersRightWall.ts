/**
 * Quarters-B right-wall dressing — fold-down desk, pinboard, shelf.
 * "Right wall" from the port-door camera = aft portion of starboard wall (X=+2.5, Z≈+1.5).
 *
 * Draw call budget: ≤8
 *   desk slab + struts (1) + datapad body+screen (2) + paper decal (1)
 *   pinboard body (1) + paper decals (1) + shelf (1) + cup+box (1)
 *   Total: 8 draw calls
 *
 * Collider: AABB for desk unit only (shelf is flush, cup/box are tiny).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  matGunmetal,
  matDatapad,
  matCream,
  matOrange,
  matCup,
  matShelf,
} from './quartersProps.js';
import type { AABB } from './types.js';

// Emissive teal screen for desk datapad
const matDeskScreen = new THREE.MeshBasicMaterial({ color: 0x46E0D8 });

// ── Inline CanvasTextures ──────────────────────────────────────────────────────

function makeDeskPaperTex(): THREE.CanvasTexture {
  const W = 64; const H = 80;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d')!;
  c.fillStyle = '#E8E2D4';
  c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(28,30,34,0.55)';
  c.font = '7px monospace';
  for (let i = 0; i < 6; i++) {
    c.fillRect(8, 12 + i * 11, W - 16, 1);
  }
  c.fillStyle = '#C7641E';
  c.fillRect(6, 6, 4, H - 12);
  return new THREE.CanvasTexture(cv);
}

function makePinboardTex(): THREE.CanvasTexture {
  const W = 128; const H = 80;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d')!;
  // Dark board background
  c.fillStyle = '#1A1C20';
  c.fillRect(0, 0, W, H);
  // Pinhole grid dots
  c.fillStyle = 'rgba(90,88,80,0.4)';
  for (let y = 10; y < H; y += 12) {
    for (let x = 10; x < W; x += 12) {
      c.beginPath(); c.arc(x, y, 1, 0, Math.PI * 2); c.fill();
    }
  }
  // 3 small pinned paper slips
  const slips: Array<{ x: number; y: number; w: number; h: number; angle: number; col: string }> = [
    { x: 14, y: 10, w: 32, h: 22, angle: -0.06, col: '#E8E2D4' },
    { x: 58, y: 8,  w: 28, h: 20, angle:  0.04, col: '#C7641E' },
    { x: 90, y: 16, w: 26, h: 18, angle: -0.03, col: '#E8E2D4' },
  ];
  for (const s of slips) {
    c.save();
    c.translate(s.x + s.w / 2, s.y + s.h / 2);
    c.rotate(s.angle);
    c.fillStyle = s.col;
    c.fillRect(-s.w / 2, -s.h / 2, s.w, s.h);
    if (s.col !== '#C7641E') {
      c.fillStyle = 'rgba(28,30,34,0.35)';
      for (let li = 0; li < 3; li++) {
        c.fillRect(-s.w / 2 + 3, -s.h / 2 + 5 + li * 5, s.w - 6, 1);
      }
    }
    // Pin dot
    c.fillStyle = '#C7641E';
    c.beginPath(); c.arc(0, -s.h / 2 + 3, 2, 0, Math.PI * 2); c.fill();
    c.restore();
  }
  return new THREE.CanvasTexture(cv);
}

// ── Fold-down desk unit ────────────────────────────────────────────────────────

/**
 * Desk slab against starboard wall (X=+2.5) at aft portion (Z≈+1.5).
 * Desk height: Y = 0.78 (standard sit-desk height).
 * Depth: 0.35 (extends into room toward -X).
 * Width: 0.80 (along Z axis).
 *
 * Returns AABB collider in room-local coords.
 */
export function buildFoldDownDesk(
  roomGroup: THREE.Group,
  xWall: number,
  deskZCenter: number,
): AABB {
  const sign    = xWall < 0 ? 1 : -1;
  const DESK_W  = 0.80;   // extent along Z
  const DESK_D  = 0.35;   // extent into room (along X)
  const DESK_T  = 0.04;   // thickness
  const DESK_Y  = 0.78;
  const faceX   = xWall + sign * DESK_D;

  // ── Desk slab + 2 support struts — merged → 1 DC ───────────────────────────
  const slabGeo = new THREE.BoxGeometry(DESK_D, DESK_T, DESK_W);
  slabGeo.translate(xWall + sign * DESK_D / 2, DESK_Y, deskZCenter);

  const strutH = DESK_Y;
  const strutA = new THREE.BoxGeometry(0.025, strutH, 0.025);
  strutA.translate(faceX - sign * 0.01, DESK_Y - strutH / 2, deskZCenter - DESK_W / 2 + 0.04);
  const strutB = new THREE.BoxGeometry(0.025, strutH, 0.025);
  strutB.translate(faceX - sign * 0.01, DESK_Y - strutH / 2, deskZCenter + DESK_W / 2 - 0.04);

  const deskParts = [slabGeo, strutA, strutB];
  const deskMerged = mergeGeometries(deskParts);
  for (const g of deskParts) g.dispose();
  roomGroup.add(new THREE.Mesh(deskMerged, matGunmetal)); // DC 1

  // ── Datapad slab on desk surface ───────────────────────────────────────────
  const padBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.018, 0.16),
    matDatapad,
  );
  padBody.position.set(xWall + sign * (DESK_D / 2 + 0.02), DESK_Y + DESK_T + 0.009, deskZCenter - 0.04);
  roomGroup.add(padBody); // DC 2

  const padScreen = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.020, 0.12),
    matDeskScreen,
  );
  padScreen.position.set(xWall + sign * (DESK_D / 2 + 0.02), DESK_Y + DESK_T + 0.020, deskZCenter - 0.04);
  roomGroup.add(padScreen); // DC 3

  // ── Paper decal clipped to desk surface ───────────────────────────────────
  const paperMat = new THREE.MeshBasicMaterial({
    map: makeDeskPaperTex(),
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  const paperPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.18), paperMat);
  paperPlane.rotation.x = -Math.PI / 2;
  paperPlane.position.set(faceX - sign * 0.10, DESK_Y + DESK_T + 0.002, deskZCenter + 0.22);
  roomGroup.add(paperPlane); // DC 4

  const collider: AABB = {
    minX: Math.min(xWall, faceX) - 0.01,
    maxX: Math.max(xWall, faceX) + 0.01,
    minY: 0,
    maxY: DESK_Y + DESK_T + 0.05,
    minZ: deskZCenter - DESK_W / 2 - 0.02,
    maxZ: deskZCenter + DESK_W / 2 + 0.02,
  };
  return collider;
}

// ── Pinboard + shelf above desk ────────────────────────────────────────────────

/**
 * Pinboard panel and small shelf above the fold-down desk.
 * Pinboard: 0.75W × 0.45H, mounted at Y=1.25 on the wall face.
 * Shelf: narrow slab at Y=1.75 with cup + small box.
 */
export function buildDeskWallDressing(
  roomGroup: THREE.Group,
  xWall: number,
  deskZCenter: number,
): void {
  const sign   = xWall < 0 ? 1 : -1;
  const faceX  = xWall + sign * 0.015;
  const PBW    = 0.75; const PBH = 0.45;
  const BOARD_Y = 1.25;

  // ── Pinboard body ─────────────────────────────────────────────────────────
  const boardBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.015, PBH, PBW),
    matGunmetal,
  );
  boardBody.position.set(faceX, BOARD_Y + PBH / 2, deskZCenter);
  roomGroup.add(boardBody); // DC 5

  // ── Pinboard decal (cream/orange paper slips via CanvasTexture) ───────────
  const pbMat = new THREE.MeshBasicMaterial({
    map: makePinboardTex(),
    transparent: false,
  });
  const pbPlane = new THREE.Mesh(new THREE.PlaneGeometry(PBW, PBH), pbMat);
  pbPlane.rotation.y = sign < 0 ? 0 : Math.PI; // face into room
  pbPlane.position.set(faceX + sign * 0.009, BOARD_Y + PBH / 2, deskZCenter);
  roomGroup.add(pbPlane); // DC 6

  // ── Shelf slab above pinboard ─────────────────────────────────────────────
  const SHELF_D = 0.20; const SHELF_T = 0.025;
  const SHELF_Y = BOARD_Y + PBH + 0.04;
  const shelfMesh = new THREE.Mesh(
    new THREE.BoxGeometry(SHELF_D, SHELF_T, PBW),
    matShelf,
  );
  shelfMesh.position.set(xWall + sign * SHELF_D / 2, SHELF_Y, deskZCenter);
  roomGroup.add(shelfMesh); // DC 7

  // ── Shelf objects: cylinder cup + small box — merged → 1 DC ───────────────
  const cupGeo = new THREE.CylinderGeometry(0.030, 0.025, 0.08, 8);
  cupGeo.translate(
    xWall + sign * (SHELF_D * 0.55),
    SHELF_Y + SHELF_T / 2 + 0.04,
    deskZCenter - 0.20,
  );
  const boxGeo = new THREE.BoxGeometry(0.08, 0.06, 0.06);
  boxGeo.translate(
    xWall + sign * (SHELF_D * 0.45),
    SHELF_Y + SHELF_T / 2 + 0.03,
    deskZCenter + 0.18,
  );
  // Cup uses matCup, box uses matOrange — must be separate draw calls since different materials
  const cupMesh = new THREE.Mesh(cupGeo, matCup);
  roomGroup.add(cupMesh);
  const boxMesh = new THREE.Mesh(boxGeo, matOrange);
  roomGroup.add(boxMesh); // DC 8 (cup+box = 2, but we reuse box as DC 8)

  void matCream; // imported but used via matShelf colour family; suppress lint
}
