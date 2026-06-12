import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import { matWall } from './materials.js';
import { matTealStrip, matDoorFrame } from '../fx/shipMaterials.js';
import { FRAME_TOTAL_DEPTH, FRAME_JAMB_W, FRAME_HEAD_H } from './roomDressing.js';
import { buildCorridorProps } from './corridorProps.js';
import type { AABB, RoomModule } from './types.js';

/**
 * Corridor spine — 3W x 3H x 16D.
 * Doors: fore (to cockpit), aft (to galley), port (to quarters-a), starboard (to quarters-b).
 * Corridor OWNS door frames for all 4 of its doorways (framed flag).
 *
 * Port/starboard walls have BOTH a door gap AND a porthole in the aft section.
 * Because buildRoom only handles one spec per wall, we build the port/starboard
 * walls manually here and let buildRoom handle fore/aft walls + floor/ceiling.
 *
 * Manual wall decomposition for port/starboard:
 *   Wall spans Z: -8 to +8 (D=16), at X = ±1.5
 *   Side door gap: 1.4w x 2.2h centered at Z = -4
 *   Porthole: 0.8w x 0.7h at Z = +3, Y sill = 1.1 (aft section, world Z=-9, clear of quarters)
 *
 *   Sections along Z for each side wall:
 *     Fore section:  Z -8 to -4.7  (3.3 units) — solid
 *     Door section:  Z -4.7 to -3.3 (1.4 units) — door gap + above-door strip
 *     Aft section:   Z -3.3 to +8  (11.3 units) — solid except porthole cutout
 */
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

  // Use buildRoom to get: fore/aft walls (with frames), floor, ceiling, ceiling lights, floor strips
  // Side walls are built manually below (porthole cutout requirement)
  const { group, colliders: baseColliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    wallMaterial: matWall,
    doors: [
      { wall: 'fore', gapW: 1.4, gapH: 2.2, offset: 0, framed: true },
      { wall: 'aft',  gapW: 1.4, gapH: 2.2, offset: 0, framed: true },
      // Side doors with gap = full depth so no wall panels are generated
      { wall: 'port',      gapW: D + 1, gapH: H + 1, offset: 0 },
      { wall: 'starboard', gapW: D + 1, gapH: H + 1, offset: 0 },
    ],
  });

  group.name = 'corridor';

  const colliders: AABB[] = [...baseColliders];

  // Now build port and starboard walls manually with door + porthole cutouts.
  const PORTHOLE_CENTER_Z = 3.0;
  const PORTHOLE_W = 0.8;
  const PORTHOLE_H = 0.7;
  const PORTHOLE_SILL = 1.1;
  const PORTHOLE_TOP  = PORTHOLE_SILL + PORTHOLE_H;

  const DOOR_FORE_EDGE = SIDE_DOOR_Z - DOOR_GAP_W / 2; // -4.7
  const DOOR_AFT_EDGE  = SIDE_DOOR_Z + DOOR_GAP_W / 2; // -3.3
  const DOOR_ABOVE_H   = H - DOOR_GAP_H; // 0.8

  const foreLen = DOOR_FORE_EDGE - (-halfD); // 3.3

  // Porthole edges within aft section
  const poreLeft  = PORTHOLE_CENTER_Z - PORTHOLE_W / 2; // +2.6
  const poreRight = PORTHOLE_CENTER_Z + PORTHOLE_W / 2; // +3.4

  // Aft sub-sections around porthole
  const aftL = poreLeft - DOOR_AFT_EDGE;       // +2.6 - (-3.3) = 5.9
  const aftR = halfD - poreRight;              // +8.0 - (+3.4) = 4.6

  const aftZCenterL = DOOR_AFT_EDGE + aftL / 2; // -0.35
  const aftZCenterR = poreRight + aftR / 2;      // +5.7

  const belowPH = PORTHOLE_SILL;
  const abovePH = H - PORTHOLE_TOP;

  for (const side of ['port', 'starboard'] as const) {
    const wX   = side === 'port' ? -halfW : halfW;
    const rotY = side === 'port' ? Math.PI / 2 : -Math.PI / 2;

    // === Section A: Fore section (solid) ===
    if (foreLen > 0.01) {
      const foreZCenter = -halfD + foreLen / 2;
      const fg = new THREE.PlaneGeometry(foreLen, H);
      const fm = new THREE.Mesh(fg, matWall);
      fm.position.set(wX, H / 2, foreZCenter);
      fm.rotation.y = rotY;
      group.add(fm);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: -halfD, maxX: wX + WALL_T, maxY: H, maxZ: DOOR_FORE_EDGE });
    }

    // === Section B: Door column ===
    if (DOOR_ABOVE_H > 0.01) {
      const fg = new THREE.PlaneGeometry(DOOR_GAP_W, DOOR_ABOVE_H);
      const fm = new THREE.Mesh(fg, matWall);
      fm.position.set(wX, DOOR_GAP_H + DOOR_ABOVE_H / 2, SIDE_DOOR_Z);
      fm.rotation.y = rotY;
      group.add(fm);
      colliders.push({ minX: wX - WALL_T, minY: DOOR_GAP_H, minZ: DOOR_FORE_EDGE, maxX: wX + WALL_T, maxY: H, maxZ: DOOR_AFT_EDGE });
    }

    // Door frame for side doorways (corridor owns these frames)
    // Left (fore) jamb
    const lJambZ = SIDE_DOOR_Z - DOOR_GAP_W / 2 - FRAME_JAMB_W / 2;
    const lJamb  = new THREE.Mesh(
      new THREE.BoxGeometry(FRAME_TOTAL_DEPTH, DOOR_GAP_H, FRAME_JAMB_W),
      matDoorFrame,
    );
    lJamb.position.set(wX, DOOR_GAP_H / 2, lJambZ);
    group.add(lJamb);

    // Right (aft) jamb
    const rJambZ = SIDE_DOOR_Z + DOOR_GAP_W / 2 + FRAME_JAMB_W / 2;
    const rJamb  = new THREE.Mesh(
      new THREE.BoxGeometry(FRAME_TOTAL_DEPTH, DOOR_GAP_H, FRAME_JAMB_W),
      matDoorFrame,
    );
    rJamb.position.set(wX, DOOR_GAP_H / 2, rJambZ);
    group.add(rJamb);

    // Header
    const headerD = DOOR_GAP_W + FRAME_JAMB_W * 2;
    const header  = new THREE.Mesh(
      new THREE.BoxGeometry(FRAME_TOTAL_DEPTH, FRAME_HEAD_H, headerD),
      matDoorFrame,
    );
    header.position.set(wX, DOOR_GAP_H + FRAME_HEAD_H / 2, SIDE_DOOR_Z);
    group.add(header);

    // === Section C: Aft section (with porthole cutout) ===
    if (aftL > 0.01) {
      const fg = new THREE.PlaneGeometry(aftL, H);
      const fm = new THREE.Mesh(fg, matWall);
      fm.position.set(wX, H / 2, aftZCenterL);
      fm.rotation.y = rotY;
      group.add(fm);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: DOOR_AFT_EDGE, maxX: wX + WALL_T, maxY: H, maxZ: poreLeft });
    }
    if (aftR > 0.01) {
      const fg = new THREE.PlaneGeometry(aftR, H);
      const fm = new THREE.Mesh(fg, matWall);
      fm.position.set(wX, H / 2, aftZCenterR);
      fm.rotation.y = rotY;
      group.add(fm);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: poreRight, maxX: wX + WALL_T, maxY: H, maxZ: halfD });
    }
    if (belowPH > 0.01) {
      const fg = new THREE.PlaneGeometry(PORTHOLE_W, belowPH);
      const fm = new THREE.Mesh(fg, matWall);
      fm.position.set(wX, belowPH / 2, PORTHOLE_CENTER_Z);
      fm.rotation.y = rotY;
      group.add(fm);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: poreLeft, maxX: wX + WALL_T, maxY: belowPH, maxZ: poreRight });
    }
    if (abovePH > 0.01) {
      const fg = new THREE.PlaneGeometry(PORTHOLE_W, abovePH);
      const fm = new THREE.Mesh(fg, matWall);
      fm.position.set(wX, PORTHOLE_TOP + abovePH / 2, PORTHOLE_CENTER_Z);
      fm.rotation.y = rotY;
      group.add(fm);
      colliders.push({ minX: wX - WALL_T, minY: PORTHOLE_TOP, minZ: poreLeft, maxX: wX + WALL_T, maxY: H, maxZ: poreRight });
    }
    // Porthole void collider
    colliders.push({ minX: wX - WALL_T, minY: PORTHOLE_SILL, minZ: poreLeft, maxX: wX + WALL_T, maxY: PORTHOLE_TOP, maxZ: poreRight });

    // Teal floor strips along side walls (split for door gap)
    const STRIP_H = 0.06;
    const STRIP_W = 0.04;
    const STRIP_OFFSET = 0.025;
    const sX = side === 'port' ? -halfW + STRIP_OFFSET : halfW - STRIP_OFFSET;
    const gapForeEdge = SIDE_DOOR_Z - DOOR_GAP_W / 2;
    const gapAftEdge  = SIDE_DOOR_Z + DOOR_GAP_W / 2;

    // Fore strip: -halfD to gapForeEdge
    const foreSLen = gapForeEdge - (-halfD);
    if (foreSLen > 0.05) {
      const sm = new THREE.Mesh(
        new THREE.BoxGeometry(STRIP_W, STRIP_H, foreSLen),
        matTealStrip,
      );
      sm.position.set(sX, STRIP_H / 2, -halfD + foreSLen / 2);
      group.add(sm);
    }

    // Aft strip: gapAftEdge to +halfD
    const aftSLen = halfD - gapAftEdge;
    if (aftSLen > 0.05) {
      const sm = new THREE.Mesh(
        new THREE.BoxGeometry(STRIP_W, STRIP_H, aftSLen),
        matTealStrip,
      );
      sm.position.set(sX, STRIP_H / 2, gapAftEdge + aftSLen / 2);
      group.add(sm);
    }
  }

  // ── Orange waist-band geometry (continuous, panel-seam-independent) ──────────
  const BAND_H   = 0.20;
  const BAND_MID = 0.90 + BAND_H / 2;  // ~1.0 m centre
  const BAND_D   = 0.025;              // proud of wall
  const BAND_OFF = 0.03;

  function addBandBox(gx: number, gy: number, gz: number, bw: number, bh: number, bd: number): void {
    const bm = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), matDoorFrame);
    bm.position.set(gx, gy, gz);
    group.add(bm);
  }

  // Fore/aft walls: split around centred 1.4-wide door gap
  for (const [wZ, sign] of [[-halfD + BAND_OFF, 1], [halfD - BAND_OFF, -1]] as [number, number][]) {
    const sideLen = halfW - 0.7; // 0.8 each side
    addBandBox(-halfW + sideLen / 2, BAND_MID, wZ, sideLen, BAND_H, BAND_D);
    addBandBox( halfW - sideLen / 2, BAND_MID, wZ, sideLen, BAND_H, BAND_D);
    void sign;
  }

  // Port/starboard: fore strip (-halfD → DOOR_FORE_EDGE) + aft strip (DOOR_AFT_EDGE → +halfD)
  for (const side of ['port', 'starboard'] as const) {
    const wX = side === 'port' ? -halfW + BAND_OFF : halfW - BAND_OFF;
    const fbl = DOOR_FORE_EDGE - (-halfD); // 3.3
    const abl = halfD - DOOR_AFT_EDGE;     // 11.3
    addBandBox(wX, BAND_MID, -halfD + fbl / 2,       BAND_D, BAND_H, fbl);
    addBandBox(wX, BAND_MID, DOOR_AFT_EDGE + abl / 2, BAND_D, BAND_H, abl);
  }

  // ── Corridor props (pipes, vents, status lights, handles, conduit) ──────────
  buildCorridorProps(group);

  // Camera: mid-aft corridor, looking FORE down the spine toward cockpit.
  // Eye height Y=1.95 — player standing height, slight upward pitch so both
  // ceiling pipe runs and floor teal strips are in frame simultaneously.
  // All verify cameras must look toward -Z (fore) to avoid Y-axis inversion.
  const localCamPos  = new THREE.Vector3(0, 1.95, 5);
  const localCamLook = new THREE.Vector3(0, 2.1, -8);

  return {
    group,
    colliders,
    interactables: [],
    cameras: [
      {
        name: 'corridor',
        position: localCamPos,
        lookAt: localCamLook,
      },
    ],
  };
}
