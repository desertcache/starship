import * as THREE from 'three';
import type { AABB } from './types.js';
import { matWall, matFloor, matCeiling } from './materials.js';
import { buildWindowWall } from './windowWall.js';

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
}

/** Room dimensions relative to its own local origin (center of floor). */
export interface RoomSpec {
  width: number;  // X
  height: number; // Y
  depth: number;  // Z
  doors: DoorSpec[];
  windows?: import('./windowWall.js').WindowSpec[];
}

const GAP_W_DEFAULT = 1.4;
const GAP_H_DEFAULT = 2.2;

function addPlane(
  group: THREE.Group,
  w: number,
  h: number,
  mat: THREE.Material,
  pos: THREE.Vector3Like,
  rotY = 0,
  rotX = 0,
): void {
  const geo = new THREE.PlaneGeometry(w, h);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(pos.x, pos.y, pos.z);
  if (rotX !== 0) mesh.rotation.x = rotX;
  if (rotY !== 0) mesh.rotation.y = rotY;
  group.add(mesh);
}

/**
 * Build a wall (axis-aligned plane) with an optional door gap cut into it.
 * Returns an array of AABBs for the solid sections of that wall (thin slabs).
 */
function buildWall(
  group: THREE.Group,
  wall: 'fore' | 'aft' | 'port' | 'starboard',
  roomW: number,
  roomH: number,
  roomD: number,
  gapSpec: DoorSpec | null,
): AABB[] {
  const WALL_T = 0.05;
  const colliders: AABB[] = [];

  const gapW = gapSpec?.gapW ?? GAP_W_DEFAULT;
  const gapH = gapSpec?.gapH ?? GAP_H_DEFAULT;
  const gapOffset = gapSpec?.offset ?? 0;

  const halfW = roomW / 2;
  const halfD = roomD / 2;

  if (wall === 'fore' || wall === 'aft') {
    const wZ = wall === 'fore' ? -halfD : halfD;
    const rotY = wall === 'fore' ? 0 : Math.PI;

    if (gapSpec) {
      const gapCenter = gapOffset;
      const leftX = gapCenter - gapW / 2;
      const rightX = gapCenter + gapW / 2;
      const leftW = leftX + halfW;
      const rightW = halfW - rightX;
      const aboveH = roomH - gapH;

      if (leftW > 0.01) {
        addPlane(group, leftW, roomH, matWall, { x: -halfW + leftW / 2, y: roomH / 2, z: wZ }, rotY);
        colliders.push({ minX: -halfW, minY: 0, minZ: wZ - WALL_T, maxX: -halfW + leftW, maxY: roomH, maxZ: wZ + WALL_T });
      }
      if (rightW > 0.01) {
        addPlane(group, rightW, roomH, matWall, { x: halfW - rightW / 2, y: roomH / 2, z: wZ }, rotY);
        colliders.push({ minX: halfW - rightW, minY: 0, minZ: wZ - WALL_T, maxX: halfW, maxY: roomH, maxZ: wZ + WALL_T });
      }
      if (aboveH > 0.01) {
        addPlane(group, gapW, aboveH, matWall, { x: gapCenter, y: gapH + aboveH / 2, z: wZ }, rotY);
        colliders.push({
          minX: gapCenter - gapW / 2, minY: gapH, minZ: wZ - WALL_T,
          maxX: gapCenter + gapW / 2, maxY: roomH, maxZ: wZ + WALL_T,
        });
      }
    } else {
      addPlane(group, roomW, roomH, matWall, { x: 0, y: roomH / 2, z: wZ }, rotY);
      colliders.push({ minX: -halfW, minY: 0, minZ: wZ - WALL_T, maxX: halfW, maxY: roomH, maxZ: wZ + WALL_T });
    }
  } else {
    const wX = wall === 'port' ? -halfW : halfW;
    const rotY = wall === 'port' ? Math.PI / 2 : -Math.PI / 2;

    if (gapSpec) {
      const gapCenter = gapOffset;
      const foreEdge = gapCenter - gapW / 2;
      const aftEdge = gapCenter + gapW / 2;
      const foreStrip = foreEdge + halfD;
      const aftStrip = halfD - aftEdge;
      const aboveH = roomH - gapH;

      if (foreStrip > 0.01) {
        addPlane(group, foreStrip, roomH, matWall, { x: wX, y: roomH / 2, z: -halfD + foreStrip / 2 }, rotY);
        colliders.push({ minX: wX - WALL_T, minY: 0, minZ: -halfD, maxX: wX + WALL_T, maxY: roomH, maxZ: -halfD + foreStrip });
      }
      if (aftStrip > 0.01) {
        addPlane(group, aftStrip, roomH, matWall, { x: wX, y: roomH / 2, z: halfD - aftStrip / 2 }, rotY);
        colliders.push({ minX: wX - WALL_T, minY: 0, minZ: halfD - aftStrip, maxX: wX + WALL_T, maxY: roomH, maxZ: halfD });
      }
      if (aboveH > 0.01) {
        addPlane(group, gapW, aboveH, matWall, { x: wX, y: gapH + aboveH / 2, z: gapCenter }, rotY);
        colliders.push({
          minX: wX - WALL_T, minY: gapH, minZ: gapCenter - gapW / 2,
          maxX: wX + WALL_T, maxY: roomH, maxZ: gapCenter + gapW / 2,
        });
      }
    } else {
      addPlane(group, roomD, roomH, matWall, { x: wX, y: roomH / 2, z: 0 }, rotY);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: -halfD, maxX: wX + WALL_T, maxY: roomH, maxZ: halfD });
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
  const group = new THREE.Group();
  const colliders: AABB[] = [];

  // Floor
  addPlane(group, W, D, matFloor, { x: 0, y: 0, z: 0 }, 0, -Math.PI / 2);

  // Ceiling
  addPlane(group, W, D, matCeiling, { x: 0, y: H, z: 0 }, 0, Math.PI / 2);

  const doorMap = new Map<string, DoorSpec>(doors.map((d) => [d.wall, d]));
  const windowMap = new Map<string, typeof windows[number]>(windows.map((w) => [w.wall, w]));

  for (const side of ['fore', 'aft', 'port', 'starboard'] as const) {
    if (windowMap.has(side)) {
      const wSpec = windowMap.get(side)!;
      colliders.push(...buildWindowWall(group, wSpec, W, H, D));
    } else {
      colliders.push(...buildWall(group, side, W, H, D, doorMap.get(side) ?? null));
    }
  }

  return { group, colliders };
}
