import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import { matWall } from './materials.js';
import type { AABB, RoomModule } from './types.js';

/**
 * Corridor spine — 3W x 3H x 16D.
 * Doors: fore (to cockpit), aft (to galley), port (to quarters-a), starboard (to quarters-b).
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

  // Build the base room (fore/aft walls + floor/ceiling only — no side walls yet)
  // We achieve this by passing dummy side doors that span the full wall, then
  // removing those panels and rebuilding manually.
  // SIMPLER: build room without side walls by using a special approach —
  // build fore/aft walls + floor/ceiling via a minimal room, then add custom side walls.

  // Actually the cleanest: use buildRoom with all 4 doors to get fore/aft/floor/ceiling,
  // then explicitly reconstruct the port/starboard walls ourselves.
  // buildRoom will build port/starboard as door-gap walls; we just add extra porthole panels on top.
  // But z-fighting... unless we skip those walls entirely and build them custom.

  // We'll build a corridor with fore/aft doors and no side walls, then add side walls manually.
  // To skip side walls: pass side doors that consume the entire wall (offset=0, full width).
  // When gapW >= roomD, all panels become 0-width and nothing is drawn.
  const { group, colliders: baseColliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    doors: [
      { wall: 'fore', gapW: 1.4, gapH: 2.2, offset: 0 },
      { wall: 'aft',  gapW: 1.4, gapH: 2.2, offset: 0 },
      // Side doors with gap = full depth so no wall panels are generated
      { wall: 'port',      gapW: D + 1, gapH: H + 1, offset: 0 },
      { wall: 'starboard', gapW: D + 1, gapH: H + 1, offset: 0 },
    ],
  });

  group.name = 'corridor';

  const colliders: AABB[] = [...baseColliders];

  // Now build port and starboard walls manually with door + porthole cutouts.
  // Porthole spec: centered at Z=+3, 0.8w x 0.7h, sill at Y=1.1
  // World Z = corridor-center(-12) + local(+3) = -9, comfortably in exposed stretch -13.5..-4
  const PORTHOLE_CENTER_Z = 3.0;
  const PORTHOLE_W = 0.8;
  const PORTHOLE_H = 0.7;
  const PORTHOLE_SILL = 1.1;
  const PORTHOLE_TOP  = PORTHOLE_SILL + PORTHOLE_H;

  const DOOR_FORE_EDGE = SIDE_DOOR_Z - DOOR_GAP_W / 2; // -4.7
  const DOOR_AFT_EDGE  = SIDE_DOOR_Z + DOOR_GAP_W / 2; // -3.3
  const DOOR_ABOVE_H   = H - DOOR_GAP_H; // 0.8

  // Z regions:
  // [A] Fore section:  -8.0 to DOOR_FORE_EDGE (-4.7)  length=3.3 — solid
  // [B] Door column:   DOOR_FORE_EDGE to DOOR_AFT_EDGE (-4.7 to -3.3)  length=1.4
  //     [B1] Above door: Y from 2.2 to 3.0, Z range 1.4
  // [C] Aft section:   DOOR_AFT_EDGE (-3.3) to +8.0   length=11.3 — has porthole at Z=+3

  const foreLen = DOOR_FORE_EDGE - (-halfD);    // 3.3

  // Porthole edges within aft section
  const poreLeft  = PORTHOLE_CENTER_Z - PORTHOLE_W / 2; // +2.6
  const poreRight = PORTHOLE_CENTER_Z + PORTHOLE_W / 2; // +3.4

  // Aft sub-sections around porthole
  const aftL = poreLeft - DOOR_AFT_EDGE;        // +2.6 - (-3.3) = 5.9
  const aftR = halfD - poreRight;               // +8.0 - (+3.4) = 4.6

  const aftZCenterL = DOOR_AFT_EDGE + aftL / 2; // -3.3 + 2.95 = -0.35
  const aftZCenterR = poreRight + aftR / 2;      // +3.4 + 2.3  = +5.7

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
    // Below-door gap: nothing (player can walk through)
    // Above-door strip:
    if (DOOR_ABOVE_H > 0.01) {
      const fg = new THREE.PlaneGeometry(DOOR_GAP_W, DOOR_ABOVE_H);
      const fm = new THREE.Mesh(fg, matWall);
      fm.position.set(wX, DOOR_GAP_H + DOOR_ABOVE_H / 2, SIDE_DOOR_Z);
      fm.rotation.y = rotY;
      group.add(fm);
      colliders.push({ minX: wX - WALL_T, minY: DOOR_GAP_H, minZ: DOOR_FORE_EDGE, maxX: wX + WALL_T, maxY: H, maxZ: DOOR_AFT_EDGE });
    }
    // Collider for door space below gap (none — door gap is walkable)

    // === Section C: Aft section (with porthole cutout at Z=+3) ===
    // [C-left]:  full height, Z DOOR_AFT_EDGE to poreLeft   length=aftL
    if (aftL > 0.01) {
      const fg = new THREE.PlaneGeometry(aftL, H);
      const fm = new THREE.Mesh(fg, matWall);
      fm.position.set(wX, H / 2, aftZCenterL);
      fm.rotation.y = rotY;
      group.add(fm);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: DOOR_AFT_EDGE, maxX: wX + WALL_T, maxY: H, maxZ: poreLeft });
    }
    // [C-right]: full height, Z poreRight to halfD          length=aftR
    if (aftR > 0.01) {
      const fg = new THREE.PlaneGeometry(aftR, H);
      const fm = new THREE.Mesh(fg, matWall);
      fm.position.set(wX, H / 2, aftZCenterR);
      fm.rotation.y = rotY;
      group.add(fm);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: poreRight, maxX: wX + WALL_T, maxY: H, maxZ: halfD });
    }
    // [C-below]: below porthole sill, Z poreLeft..poreRight
    if (belowPH > 0.01) {
      const fg = new THREE.PlaneGeometry(PORTHOLE_W, belowPH);
      const fm = new THREE.Mesh(fg, matWall);
      fm.position.set(wX, belowPH / 2, PORTHOLE_CENTER_Z);
      fm.rotation.y = rotY;
      group.add(fm);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: poreLeft, maxX: wX + WALL_T, maxY: belowPH, maxZ: poreRight });
    }
    // [C-above]: above porthole top, Z poreLeft..poreRight
    if (abovePH > 0.01) {
      const fg = new THREE.PlaneGeometry(PORTHOLE_W, abovePH);
      const fm = new THREE.Mesh(fg, matWall);
      fm.position.set(wX, PORTHOLE_TOP + abovePH / 2, PORTHOLE_CENTER_Z);
      fm.rotation.y = rotY;
      group.add(fm);
      colliders.push({ minX: wX - WALL_T, minY: PORTHOLE_TOP, minZ: poreLeft, maxX: wX + WALL_T, maxY: H, maxZ: poreRight });
    }
    // Porthole void collider (physical barrier — blocks player from stepping through)
    colliders.push({ minX: wX - WALL_T, minY: PORTHOLE_SILL, minZ: poreLeft, maxX: wX + WALL_T, maxY: PORTHOLE_TOP, maxZ: poreRight });
  }

  // Camera: positioned in the aft section, looking directly at the port porthole
  // Port porthole is at X=-1.5, Y=1.45, Z=+3 in local space (world Z=-9)
  // Camera stands at corridor centre at eye height, angled to frame the porthole clearly
  const localCamPos = new THREE.Vector3(0.6, 1.6, 3.0);
  const localCamLook = new THREE.Vector3(-1.5, 1.45, 3.0);

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
