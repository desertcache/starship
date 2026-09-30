import type { AABB } from './types.js';

// ── Room constants ─────────────────────────────────────────────────────────────

export const W = 5;   // width  (+X = starboard, -X = port)
export const H = 3;   // height
export const D = 5;   // depth  (-Z = fore, +Z = aft)

// ── Helper: translate local AABB by a room-space offset ───────────────────────

export function shiftAABB(aabb: AABB, dx: number, dy: number, dz: number): AABB {
  return {
    minX: aabb.minX + dx, maxX: aabb.maxX + dx,
    minY: aabb.minY + dy, maxY: aabb.maxY + dy,
    minZ: aabb.minZ + dz, maxZ: aabb.maxZ + dz,
  };
}
