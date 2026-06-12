import * as THREE from 'three';
import type { AABB } from './types.js';
import { matWall, matFloor, matCeiling } from './materials.js';
import { buildWindowWall } from './windowWall.js';
import { addDoorFrame, addFloorStrips, addCeilingLights } from './roomDressing.js';
import { applyWorldUVs } from './uvWorld.js';

export type { WindowSpec } from './windowWall.js';

export interface DoorSpec {
  /** Which wall: 'fore'|'aft'|'port'|'starboard' */
  wall: 'fore' | 'aft' | 'port' | 'starboard';
  /** Width of the opening */
  gapW?: number;
  /** Height of the opening */
  gapH?: number;
  /** Lateral offset from wall center (default 0) */
  offset?: number;
  /**
   * If true, add a burnt-orange door frame proud of this wall surface.
   * Set on EXACTLY ONE side per doorway to avoid z-fighting.
   * Corridor frames its 4 doorways; galley frames its aft doorway.
   */
  framed?: boolean;
}

/** Room dimensions relative to its own local origin (center of floor). */
export interface RoomSpec {
  width: number;  // X
  height: number; // Y
  depth: number;  // Z
  doors: DoorSpec[];
  windows?: import('./windowWall.js').WindowSpec[];
  /**
   * Override wall material for this room (default: matWall).
   * Pass matWallBand to get the orange-banded corridor look.
   */
  wallMaterial?: THREE.Material;
  /**
   * World-space offset of the room group's local origin along each axis.
   * Used to compute world-aligned UV offsets so panel seams are continuous
   * across rooms that share a wall axis.
   * Default: { x: 0, y: 0, z: 0 }
   */
  worldOffset?: THREE.Vector3Like;
}

// ── UV tile sizes (must match texturesPanels.ts + makeGunmetalFloorTexture) ──
const WALL_TILE_W  = 2; // metres per UV unit along wall width
const WALL_TILE_H  = 3; // metres per UV unit along wall height
const FLOOR_TILE_W = 2; // metres per UV unit on floor X
const FLOOR_TILE_D = 2; // metres per UV unit on floor Z

const GAP_W_DEFAULT = 1.4;
const GAP_H_DEFAULT = 2.2;

/**
 * Make a PlaneGeometry and apply world-aligned UVs.
 * For wall planes the local-to-world mapping is:
 *   fore/aft walls:      horizontal axis = X, vertical axis = Y
 *   port/starboard walls: horizontal axis = Z, vertical axis = Y
 * uOffset/vOffset are the world-space position of the plane's left/bottom edge.
 */
function makePlaneWithUVs(
  w: number,
  h: number,
  tileW: number,
  tileH: number,
  uOffset: number,
  vOffset: number,
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(w, h);
  applyWorldUVs(geo, w, h, tileW, tileH, uOffset, vOffset);
  return geo;
}

function addPlane(
  group: THREE.Group,
  w: number,
  h: number,
  mat: THREE.Material,
  pos: THREE.Vector3Like,
  rotY = 0,
  rotX = 0,
  uOffset = 0,
  vOffset = 0,
  tileW = WALL_TILE_W,
  tileH = WALL_TILE_H,
): void {
  const geo  = makePlaneWithUVs(w, h, tileW, tileH, uOffset, vOffset);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(pos.x, pos.y, pos.z);
  if (rotX !== 0) mesh.rotation.x = rotX;
  if (rotY !== 0) mesh.rotation.y = rotY;
  group.add(mesh);
}

/**
 * Build a single axis-aligned wall with an optional door gap.
 * Returns AABB colliders for the solid wall sections.
 *
 * uWallOrigin: world-space coordinate of the wall's left edge along its
 *              horizontal axis (used for continuous UV offsets).
 */
function buildWall(
  group: THREE.Group,
  wall: 'fore' | 'aft' | 'port' | 'starboard',
  roomW: number,
  roomH: number,
  roomD: number,
  gapSpec: DoorSpec | null,
  wallMat: THREE.Material,
  worldOffset: THREE.Vector3Like,
): AABB[] {
  const WALL_T = 0.05;
  const colliders: AABB[] = [];

  const gapW      = gapSpec?.gapW   ?? GAP_W_DEFAULT;
  const gapH      = gapSpec?.gapH   ?? GAP_H_DEFAULT;
  const gapOffset = gapSpec?.offset ?? 0;
  const framed    = gapSpec?.framed ?? false;

  const halfW = roomW / 2;
  const halfD = roomD / 2;

  // vOffset: place the tile seam nearest to the ceiling AT the ceiling so the
  // scuff band (at tile v=0) only appears at y=0 (true floor), not at false
  // repeat heights inside the wall (e.g. y=3m on a 5m cargo-bay wall).
  // Formula: vOff = ceil(H/tileH)*tileH - H
  // For H=3m: vOff=0 (no shift); for H=5m: vOff=1 (seam lands at ceiling).
  const vOff = Math.ceil(roomH / WALL_TILE_H) * WALL_TILE_H - roomH;

  if (wall === 'fore' || wall === 'aft') {
    const wZ   = wall === 'fore' ? -halfD : halfD;
    const rotY = wall === 'fore' ? 0 : Math.PI;
    // World-space U origin: left edge of wall = world.x - halfW
    const uOrigin = worldOffset.x - halfW;

    if (gapSpec) {
      const leftW  = gapOffset - gapW / 2 + halfW;
      const rightW = halfW - (gapOffset + gapW / 2);
      const aboveH = roomH - gapH;

      if (leftW > 0.01) {
        addPlane(group, leftW, roomH, wallMat,
          { x: -halfW + leftW / 2, y: roomH / 2, z: wZ }, rotY, 0,
          uOrigin, vOff, WALL_TILE_W, WALL_TILE_H,
        );
        colliders.push({ minX: -halfW, minY: 0, minZ: wZ - WALL_T, maxX: -halfW + leftW, maxY: roomH, maxZ: wZ + WALL_T });
      }
      if (rightW > 0.01) {
        // uOffset for right panel = uOrigin + leftW + gapW
        addPlane(group, rightW, roomH, wallMat,
          { x: halfW - rightW / 2, y: roomH / 2, z: wZ }, rotY, 0,
          uOrigin + leftW + gapW, vOff, WALL_TILE_W, WALL_TILE_H,
        );
        colliders.push({ minX: halfW - rightW, minY: 0, minZ: wZ - WALL_T, maxX: halfW, maxY: roomH, maxZ: wZ + WALL_T });
      }
      if (aboveH > 0.01) {
        addPlane(group, gapW, aboveH, wallMat,
          { x: gapOffset, y: gapH + aboveH / 2, z: wZ }, rotY, 0,
          uOrigin + leftW, vOff + gapH, WALL_TILE_W, WALL_TILE_H,
        );
        colliders.push({
          minX: gapOffset - gapW / 2, minY: gapH, minZ: wZ - WALL_T,
          maxX: gapOffset + gapW / 2, maxY: roomH, maxZ: wZ + WALL_T,
        });
      }
    } else {
      addPlane(group, roomW, roomH, wallMat,
        { x: 0, y: roomH / 2, z: wZ }, rotY, 0,
        uOrigin, vOff, WALL_TILE_W, WALL_TILE_H,
      );
      colliders.push({ minX: -halfW, minY: 0, minZ: wZ - WALL_T, maxX: halfW, maxY: roomH, maxZ: wZ + WALL_T });
    }

    if (framed && gapSpec) {
      addDoorFrame(group, wall, roomW, roomD, gapW, gapH, gapOffset);
    }

  } else {
    const wX   = wall === 'port' ? -halfW : halfW;
    const rotY = wall === 'port' ? Math.PI / 2 : -Math.PI / 2;
    // For port/starboard walls horizontal axis = Z, so uOrigin = world.z - halfD
    const uOrigin = worldOffset.z - halfD;

    if (gapSpec) {
      const foreStrip = gapOffset - gapW / 2 + halfD;
      const aftStrip  = halfD - (gapOffset + gapW / 2);
      const aboveH    = roomH - gapH;

      if (foreStrip > 0.01) {
        addPlane(group, foreStrip, roomH, wallMat,
          { x: wX, y: roomH / 2, z: -halfD + foreStrip / 2 }, rotY, 0,
          uOrigin, vOff, WALL_TILE_W, WALL_TILE_H,
        );
        colliders.push({ minX: wX - WALL_T, minY: 0, minZ: -halfD, maxX: wX + WALL_T, maxY: roomH, maxZ: -halfD + foreStrip });
      }
      if (aftStrip > 0.01) {
        addPlane(group, aftStrip, roomH, wallMat,
          { x: wX, y: roomH / 2, z: halfD - aftStrip / 2 }, rotY, 0,
          uOrigin + foreStrip + gapW, vOff, WALL_TILE_W, WALL_TILE_H,
        );
        colliders.push({ minX: wX - WALL_T, minY: 0, minZ: halfD - aftStrip, maxX: wX + WALL_T, maxY: roomH, maxZ: halfD });
      }
      if (aboveH > 0.01) {
        addPlane(group, gapW, aboveH, wallMat,
          { x: wX, y: gapH + aboveH / 2, z: gapOffset }, rotY, 0,
          uOrigin + foreStrip, vOff + gapH, WALL_TILE_W, WALL_TILE_H,
        );
        colliders.push({
          minX: wX - WALL_T, minY: gapH, minZ: gapOffset - gapW / 2,
          maxX: wX + WALL_T, maxY: roomH, maxZ: gapOffset + gapW / 2,
        });
      }
    } else {
      addPlane(group, roomD, roomH, wallMat,
        { x: wX, y: roomH / 2, z: 0 }, rotY, 0,
        uOrigin, vOff, WALL_TILE_W, WALL_TILE_H,
      );
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: -halfD, maxX: wX + WALL_T, maxY: roomH, maxZ: halfD });
    }

    if (framed && gapSpec) {
      addDoorFrame(group, wall, roomW, roomD, gapW, gapH, gapOffset);
    }
  }

  return colliders;
}

/**
 * Build a complete box room group. Returns the group and all wall colliders.
 * The room's local origin is at the center of the floor.
 */
export function buildRoom(spec: RoomSpec): { group: THREE.Group; colliders: AABB[] } {
  const { width: W, height: H, depth: D, doors, windows = [] } = spec;
  const wallMat    = spec.wallMaterial ?? matWall;
  const wOff       = spec.worldOffset ?? { x: 0, y: 0, z: 0 };
  const group      = new THREE.Group();
  const colliders: AABB[] = [];

  // ── Floor — world UV: U=X, V=Z ────────────────────────────────────────────
  {
    const geo = new THREE.PlaneGeometry(W, D);
    applyWorldUVs(geo, W, D, FLOOR_TILE_W, FLOOR_TILE_D, wOff.x - W / 2, wOff.z - D / 2);
    const mesh = new THREE.Mesh(geo, matFloor);
    mesh.rotation.x = -Math.PI / 2;
    group.add(mesh);
    // Also fix roughness map UVs: it shares the same texture tile size
    // (roughnessMap UVs == map UVs — THREE uses the same UV channel)
  }

  // ── Ceiling — world UV: same as floor ─────────────────────────────────────
  {
    const geo = new THREE.PlaneGeometry(W, D);
    // Ceiling uses its own simpler grid; repeat(2,2) via material is fine.
    // No world UV needed here (ceiling texture is uniform enough).
    const mesh = new THREE.Mesh(geo, matCeiling);
    mesh.position.y = H;
    mesh.rotation.x = Math.PI / 2;
    group.add(mesh);
  }

  addCeilingLights(group, W, H, D);

  const doorMap   = new Map<string, DoorSpec>(doors.map((d) => [d.wall, d]));
  const windowMap = new Map<string, typeof windows[number]>(windows.map((w) => [w.wall, w]));

  for (const side of ['fore', 'aft', 'port', 'starboard'] as const) {
    if (windowMap.has(side)) {
      colliders.push(...buildWindowWall(group, windowMap.get(side)!, W, H, D, wallMat, wOff));
    } else {
      colliders.push(...buildWall(group, side, W, H, D, doorMap.get(side) ?? null, wallMat, wOff));
    }
  }

  addFloorStrips(group, W, D, doors);

  return { group, colliders };
}
