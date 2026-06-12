/**
 * Corridor spine — 3W x 3H x 16D.
 * Doors: fore (to cockpit), aft (to galley), port (to quarters-a), starboard (to quarters-b).
 * Corridor OWNS door frames for all 4 of its doorways (framed flag).
 *
 * Side walls are built manually (porthole cutouts, second porthole in fore section).
 * Density dressing (baseboards, crown, ribs, junction) delegated to corridorDensity.ts.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { buildRoom } from './roomBuilder.js';
import { matWall } from './materials.js';
import { matTealStrip, matDoorFrame } from '../fx/shipMaterials.js';
import { FRAME_TOTAL_DEPTH, FRAME_JAMB_W, FRAME_HEAD_H } from './roomDressing.js';
import { buildCorridorProps } from './corridorProps.js';
import { addBaseboardsAndCrowns, addVerticalRibs, addQuartersJunction } from './corridorDensity.js';
import type { AABB, RoomModule } from './types.js';

// ── Corridor porthole bezel materials (gunmetal PBR) ─────────────────────────
const matCorridorBezel = new THREE.MeshStandardMaterial({
  color: 0x3a3e44, roughness: 0.30, metalness: 0.75, envMapIntensity: 1.0,
});
const matCorridorTube = new THREE.MeshStandardMaterial({
  color: 0x1a1c20, roughness: 0.7, metalness: 0.4, side: THREE.BackSide,
});
const matCorridorBolt = new THREE.MeshStandardMaterial({
  color: 0x4a5058, roughness: 0.35, metalness: 0.85, envMapIntensity: 1.0,
});
const matCorridorCorner = new THREE.MeshStandardMaterial({
  color: 0x0d0e11, roughness: 0.9, metalness: 0.1, side: THREE.DoubleSide,
});

/**
 * Round porthole bezel for corridor side-walls.
 * Porthole opening is W×H rectangular; the bezel frames it with a ring + bolts.
 * The corner mask uses RingGeometry (open centre) so the circular aperture is
 * never occluded — only the square corners outside the circle are covered.
 * @param group  room group to add to
 * @param wX     wall X position (positive = starboard, negative = port)
 * @param pZ     local Z of porthole centre
 * @param pY     local Y of porthole centre
 * @param pW     porthole opening width
 * @param pH     porthole opening height
 */
function buildCorridorPortholeBezel(
  group: THREE.Group,
  wX: number, pZ: number, pY: number, pW: number, pH: number,
): void {
  const sign   = wX < 0 ? -1 : 1;  // which side the face is on
  const faceX  = wX + sign * 0.005; // exterior face of wall (5mm proud — clears z-fight)

  // Inscribed circle radius — clears the rectangular opening
  const WIN_R  = Math.min(pW, pH) / 2 * 0.88;

  // Torus center radius ≈ half cutout diagonal; tube thickness 0.05
  // Capped per spec: P1 outer ≤ 0.58, P2 outer ≤ 0.45
  const TUBE_R   = 0.05;
  const diagHalf = Math.sqrt(pW * pW + pH * pH) / 2;
  const torusR   = Math.min(diagHalf + 0.06, pW > 0.7 ? 0.53 : 0.40);

  // Annulus outerR = just past the cutout corner diagonal (no excess)
  // Stays flush behind the torus ring so the dark backing isn't visible
  const outerR = diagHalf + 0.02;

  // Corner-masking annulus — RingGeometry has an open centre so the circular
  // aperture stays fully transparent. Covers square corners outside the circle.
  const cornerGeo = new THREE.RingGeometry(WIN_R, outerR, 48);
  const cornerMask = new THREE.Mesh(cornerGeo, matCorridorCorner);
  cornerMask.rotation.y = Math.PI / 2;
  // Position AT faceX (already 5mm proud of the wall plane) — no pullback needed.
  // Previously sat exactly at the wall plane (faceX - sign*0.001 ≈ wX) → z-fight.
  cornerMask.position.set(faceX, pY, pZ);
  group.add(cornerMask);

  // Cylindrical reveal tube — open-ended, short depth toward exterior
  const tubeGeo = new THREE.CylinderGeometry(WIN_R, WIN_R, 0.08, 28, 1, true);
  const tube = new THREE.Mesh(tubeGeo, matCorridorTube);
  tube.rotation.z = Math.PI / 2;
  tube.position.set(faceX + sign * 0.04, pY, pZ);
  group.add(tube);

  // Torus ring rim — center radius = torusR, tube thickness = TUBE_R
  const ringGeo = new THREE.TorusGeometry(torusR, TUBE_R, 10, 40);
  const ring = new THREE.Mesh(ringGeo, matCorridorBezel);
  ring.rotation.y = Math.PI / 2;
  ring.position.set(faceX + sign * 0.001, pY, pZ);
  group.add(ring);

  // 8 bolt cylinders placed on the ring outer edge
  const boltGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.032, 7);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const bolt = new THREE.Mesh(boltGeo, matCorridorBolt);
    bolt.rotation.z = Math.PI / 2;
    bolt.position.set(
      faceX + sign * 0.028,
      pY + Math.sin(angle) * torusR,
      pZ + Math.cos(angle) * torusR,
    );
    group.add(bolt);
  }
}

export function buildCorridor(): RoomModule {
  const W = 3;
  const H = 3;
  const D = 16;

  const SIDE_DOOR_Z = -4.0;
  const DOOR_GAP_W  = 1.4;
  const DOOR_GAP_H  = 2.2;
  const WALL_T      = 0.05;
  const halfD       = D / 2; // 8
  const halfW       = W / 2; // 1.5

  const { group, colliders: baseColliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    wallMaterial: matWall,
    doors: [
      { wall: 'fore', gapW: 1.4, gapH: 2.2, offset: 0, framed: true },
      { wall: 'aft',  gapW: 1.4, gapH: 2.2, offset: 0, framed: true },
      { wall: 'port',      gapW: D + 1, gapH: H + 1, offset: 0 },
      { wall: 'starboard', gapW: D + 1, gapH: H + 1, offset: 0 },
    ],
  });

  group.name = 'corridor';

  const colliders: AABB[] = [...baseColliders];

  // ── Porthole definitions ───────────────────────────────────────────────────
  // Primary porthole: aft section, local Z=+3
  const P1_Z    = 3.0;  const P1_W = 0.8;  const P1_H = 0.7;  const P1_SILL = 1.1;
  // Second porthole:  fore section, local Z=-6
  const P2_Z    = -6.0; const P2_W = 0.6;  const P2_H = 0.5;  const P2_SILL = 1.15;

  const DOOR_FORE_EDGE = SIDE_DOOR_Z - DOOR_GAP_W / 2; // -4.7
  const DOOR_AFT_EDGE  = SIDE_DOOR_Z + DOOR_GAP_W / 2; // -3.3
  const DOOR_ABOVE_H   = H - DOOR_GAP_H;

  const p1Left = P1_Z - P1_W / 2;  const p1Right = P1_Z + P1_W / 2;  const p1Top = P1_SILL + P1_H;
  const p2Left = P2_Z - P2_W / 2;  const p2Right = P2_Z + P2_W / 2;  const p2Top = P2_SILL + P2_H;

  // v0.4 defrag: collect side-door frame boxes (both sides) and teal floor strips
  // into geometry arrays, then merge each into ONE draw call after the loop.
  // Previously 6 frame meshes + 4 strip meshes → 2 merged meshes (~-8 draws).
  const frameGeos: THREE.BufferGeometry[] = [];
  const stripGeos: THREE.BufferGeometry[] = [];

  for (const side of ['port', 'starboard'] as const) {
    const wX   = side === 'port' ? -halfW : halfW;
    const rotY = side === 'port' ? Math.PI / 2 : -Math.PI / 2;

    // ── Fore section (-halfD to DOOR_FORE_EDGE) with porthole 2 cutout ──────
    const foreSegA = p2Left - (-halfD);     // left of porthole 2
    const foreSegB = DOOR_FORE_EDGE - p2Right; // right of porthole 2

    if (foreSegA > 0.01) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(foreSegA, H), matWall);
      m.position.set(wX, H / 2, -halfD + foreSegA / 2); m.rotation.y = rotY; group.add(m);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: -halfD, maxX: wX + WALL_T, maxY: H, maxZ: p2Left });
    }
    if (foreSegB > 0.01) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(foreSegB, H), matWall);
      m.position.set(wX, H / 2, p2Right + foreSegB / 2); m.rotation.y = rotY; group.add(m);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: p2Right, maxX: wX + WALL_T, maxY: H, maxZ: DOOR_FORE_EDGE });
    }
    if (P2_SILL > 0.01) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(P2_W, P2_SILL), matWall);
      m.position.set(wX, P2_SILL / 2, P2_Z); m.rotation.y = rotY; group.add(m);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: p2Left, maxX: wX + WALL_T, maxY: P2_SILL, maxZ: p2Right });
    }
    const aboveP2 = H - p2Top;
    if (aboveP2 > 0.01) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(P2_W, aboveP2), matWall);
      m.position.set(wX, p2Top + aboveP2 / 2, P2_Z); m.rotation.y = rotY; group.add(m);
      colliders.push({ minX: wX - WALL_T, minY: p2Top, minZ: p2Left, maxX: wX + WALL_T, maxY: H, maxZ: p2Right });
    }

    // ── Door column (above door strip) ───────────────────────────────────────
    if (DOOR_ABOVE_H > 0.01) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(DOOR_GAP_W, DOOR_ABOVE_H), matWall);
      m.position.set(wX, DOOR_GAP_H + DOOR_ABOVE_H / 2, SIDE_DOOR_Z); m.rotation.y = rotY; group.add(m);
      colliders.push({ minX: wX - WALL_T, minY: DOOR_GAP_H, minZ: DOOR_FORE_EDGE, maxX: wX + WALL_T, maxY: H, maxZ: DOOR_AFT_EDGE });
    }

    // ── Side door frames (collected for a single merged draw call) ───────────
    const lJambZ = SIDE_DOOR_Z - DOOR_GAP_W / 2 - FRAME_JAMB_W / 2;
    const lJambGeo = new THREE.BoxGeometry(FRAME_TOTAL_DEPTH, DOOR_GAP_H, FRAME_JAMB_W);
    lJambGeo.translate(wX, DOOR_GAP_H / 2, lJambZ); frameGeos.push(lJambGeo);

    const rJambZ = SIDE_DOOR_Z + DOOR_GAP_W / 2 + FRAME_JAMB_W / 2;
    const rJambGeo = new THREE.BoxGeometry(FRAME_TOTAL_DEPTH, DOOR_GAP_H, FRAME_JAMB_W);
    rJambGeo.translate(wX, DOOR_GAP_H / 2, rJambZ); frameGeos.push(rJambGeo);

    const headerGeo = new THREE.BoxGeometry(FRAME_TOTAL_DEPTH, FRAME_HEAD_H, DOOR_GAP_W + FRAME_JAMB_W * 2);
    headerGeo.translate(wX, DOOR_GAP_H + FRAME_HEAD_H / 2, SIDE_DOOR_Z); frameGeos.push(headerGeo);

    // ── Aft section (-3.3 to +8) with porthole 1 cutout ─────────────────────
    const aftL = p1Left - DOOR_AFT_EDGE;
    const aftR = halfD - p1Right;

    if (aftL > 0.01) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(aftL, H), matWall);
      m.position.set(wX, H / 2, DOOR_AFT_EDGE + aftL / 2); m.rotation.y = rotY; group.add(m);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: DOOR_AFT_EDGE, maxX: wX + WALL_T, maxY: H, maxZ: p1Left });
    }
    if (aftR > 0.01) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(aftR, H), matWall);
      m.position.set(wX, H / 2, p1Right + aftR / 2); m.rotation.y = rotY; group.add(m);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: p1Right, maxX: wX + WALL_T, maxY: H, maxZ: halfD });
    }
    if (P1_SILL > 0.01) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(P1_W, P1_SILL), matWall);
      m.position.set(wX, P1_SILL / 2, P1_Z); m.rotation.y = rotY; group.add(m);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: p1Left, maxX: wX + WALL_T, maxY: P1_SILL, maxZ: p1Right });
    }
    const aboveP1 = H - p1Top;
    if (aboveP1 > 0.01) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(P1_W, aboveP1), matWall);
      m.position.set(wX, p1Top + aboveP1 / 2, P1_Z); m.rotation.y = rotY; group.add(m);
      colliders.push({ minX: wX - WALL_T, minY: P1_SILL + P1_H, minZ: p1Left, maxX: wX + WALL_T, maxY: H, maxZ: p1Right });
    }

    // ── Teal floor strips (split around door gap, collected for one merge) ──
    const STRIP_H = 0.06; const STRIP_W = 0.04; const STRIP_OFF = 0.025;
    const sX = side === 'port' ? -halfW + STRIP_OFF : halfW - STRIP_OFF;
    const fsl = DOOR_FORE_EDGE - (-halfD);
    const asl = halfD - DOOR_AFT_EDGE;
    if (fsl > 0.05) {
      const g = new THREE.BoxGeometry(STRIP_W, STRIP_H, fsl);
      g.translate(sX, STRIP_H / 2, -halfD + fsl / 2); stripGeos.push(g);
    }
    if (asl > 0.05) {
      const g = new THREE.BoxGeometry(STRIP_W, STRIP_H, asl);
      g.translate(sX, STRIP_H / 2, DOOR_AFT_EDGE + asl / 2); stripGeos.push(g);
    }
  }

  // ── Round porthole bezels (ref-08 model: thick ring + bolts + reveal tube) ──
  // Both sides get bezels on both portholes; corridor is 3W so port=-1.5, stbd=+1.5
  for (const bX of [-halfW, halfW]) {
    buildCorridorPortholeBezel(group, bX, P1_Z, P1_SILL + P1_H / 2, P1_W, P1_H);
    buildCorridorPortholeBezel(group, bX, P2_Z, P2_SILL + P2_H / 2, P2_W, P2_H);
  }

  // ── Merge collected side-door frames + floor strips (2 draw calls total) ────
  if (frameGeos.length > 0) {
    const merged = mergeGeometries(frameGeos);
    for (const g of frameGeos) g.dispose();
    group.add(new THREE.Mesh(merged, matDoorFrame));
  }
  if (stripGeos.length > 0) {
    const merged = mergeGeometries(stripGeos);
    for (const g of stripGeos) g.dispose();
    group.add(new THREE.Mesh(merged, matTealStrip));
  }

  // ── Orange waist bands ────────────────────────────────────────────────────
  const BAND_H = 0.20; const BAND_MID = 0.90 + BAND_H / 2;
  const BAND_D = 0.025; const BAND_OFF = 0.03;

  for (const [wZ] of [[-halfD + BAND_OFF], [halfD - BAND_OFF]] as [number][]) {
    const sl = halfW - 0.7;
    const bm1 = new THREE.Mesh(new THREE.BoxGeometry(sl, BAND_H, BAND_D), matDoorFrame);
    bm1.position.set(-halfW + sl / 2, BAND_MID, wZ); group.add(bm1);
    const bm2 = new THREE.Mesh(new THREE.BoxGeometry(sl, BAND_H, BAND_D), matDoorFrame);
    bm2.position.set( halfW - sl / 2, BAND_MID, wZ); group.add(bm2);
  }
  for (const side of ['port', 'starboard'] as const) {
    const wX = side === 'port' ? -halfW + BAND_OFF : halfW - BAND_OFF;
    const fbl = DOOR_FORE_EDGE - (-halfD); const abl = halfD - DOOR_AFT_EDGE;
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(BAND_D, BAND_H, fbl), matDoorFrame);
    b1.position.set(wX, BAND_MID, -halfD + fbl / 2); group.add(b1);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(BAND_D, BAND_H, abl), matDoorFrame);
    b2.position.set(wX, BAND_MID, DOOR_AFT_EDGE + abl / 2); group.add(b2);
  }

  // ── Density dressing (delegated to corridorDensity.ts) ───────────────────
  addBaseboardsAndCrowns(group, W, H, D);
  addVerticalRibs(group, W);
  const junctionColliders = addQuartersJunction(group, W, H);
  colliders.push(...junctionColliders);

  // ── Props ─────────────────────────────────────────────────────────────────
  buildCorridorProps(group);

  const localCamPos  = new THREE.Vector3(0, 1.95, 5);
  const localCamLook = new THREE.Vector3(0, 2.1, -8);

  return {
    group,
    colliders,
    interactables: [],
    cameras: [{ name: 'corridor', position: localCamPos, lookAt: localCamLook }],
  };
}
