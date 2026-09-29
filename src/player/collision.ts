/**
 * src/player/collision.ts — AABB capsule-footprint collision, split out of
 * controller.ts (v1.2.1 B5 cap fix: controller.ts was 372 lines, over
 * CLAUDE.md's 300-line cap). Pure functions: the active collider list is
 * passed in as a parameter rather than read from controller.ts's module
 * state, so this file has zero imports from controller.ts (no cycle risk)
 * and stays trivially testable in isolation.
 */
import * as THREE from 'three';
import type { AABB } from '../world/types.js';

const CAPSULE_RADIUS = 0.3;

/**
 * Check if a point (treated as a capsule base in XZ) collides with any AABB.
 * Camera Y is fixed at eye height; body occupies Y 0..2.0.
 */
function collidesAABB(x: number, z: number, aabb: AABB): boolean {
  const bodyMinY = 0.1;
  const bodyMaxY = 1.9;
  if (bodyMinY > aabb.maxY || bodyMaxY < aabb.minY) return false;

  const closestX = Math.max(aabb.minX, Math.min(x, aabb.maxX));
  const closestZ = Math.max(aabb.minZ, Math.min(z, aabb.maxZ));
  const dx = x - closestX;
  const dz = z - closestZ;
  return dx * dx + dz * dz < CAPSULE_RADIUS * CAPSULE_RADIUS;
}

/**
 * Try a full XZ move against `colliders`; slides along X-only or Z-only when
 * the full move is blocked (unchanged pre-split behavior). Mutates `pos`.
 */
export function tryMove(pos: THREE.Vector3, dx: number, dz: number, colliders: AABB[]): void {
  const nx = pos.x + dx;
  const nz = pos.z + dz;

  let blocked = false;
  for (const aabb of colliders) {
    if (collidesAABB(nx, nz, aabb)) { blocked = true; break; }
  }
  if (!blocked) {
    pos.x = nx;
    pos.z = nz;
    return;
  }

  let blockedX = false;
  for (const aabb of colliders) {
    if (collidesAABB(nx, pos.z, aabb)) { blockedX = true; break; }
  }
  if (!blockedX) { pos.x = nx; return; }

  let blockedZ = false;
  for (const aabb of colliders) {
    if (collidesAABB(pos.x, nz, aabb)) { blockedZ = true; break; }
  }
  if (!blockedZ) { pos.z = nz; }
}
