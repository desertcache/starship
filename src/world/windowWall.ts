import * as THREE from 'three';
import type { AABB } from './types.js';
import { matWall } from './materials.js';

/**
 * WindowSpec — a void opening that does NOT reach the floor.
 * Visually opens to space; AABB collider covers the gap (physical barrier).
 */
export interface WindowSpec {
  /** Which wall */
  wall: 'fore' | 'aft' | 'port' | 'starboard';
  /** Opening width */
  w: number;
  /** Opening height */
  h: number;
  /** Bottom edge height from floor */
  yBot: number;
  /** Lateral offset from wall center: X for fore/aft, Z for port/starboard */
  offset?: number;
}

function addPane(
  group: THREE.Group,
  w: number,
  h: number,
  pos: THREE.Vector3Like,
  rotY: number,
): void {
  const geo = new THREE.PlaneGeometry(w, h);
  const mesh = new THREE.Mesh(geo, matWall);
  mesh.position.set(pos.x, pos.y, pos.z);
  if (rotY !== 0) mesh.rotation.y = rotY;
  group.add(mesh);
}

/**
 * Build a wall with a window opening decomposed into sub-panels.
 * Layout: up to 5 panels around the void (below, above, left, right, + void collider).
 * The void itself has no geometry but gets an AABB collider so the player cannot walk through.
 */
export function buildWindowWall(
  group: THREE.Group,
  spec: WindowSpec,
  roomW: number,
  roomH: number,
  roomD: number,
): AABB[] {
  const WALL_T = 0.05;
  const colliders: AABB[] = [];

  const winOffset = spec.offset ?? 0;
  const yBot = spec.yBot;
  const yTop = yBot + spec.h;
  const halfW = roomW / 2;
  const halfD = roomD / 2;

  const belowH = yBot;
  const aboveH = roomH - yTop;
  const midH   = spec.h;

  if (spec.wall === 'fore' || spec.wall === 'aft') {
    const wZ   = spec.wall === 'fore' ? -halfD : halfD;
    const rotY = spec.wall === 'fore' ? 0 : Math.PI;

    const winLeft  = winOffset - spec.w / 2;
    const winRight = winOffset + spec.w / 2;
    const leftW    = winLeft + halfW;
    const rightW   = halfW - winRight;

    if (belowH > 0.01) {
      addPane(group, roomW, belowH, { x: 0, y: belowH / 2, z: wZ }, rotY);
      colliders.push({ minX: -halfW, minY: 0, minZ: wZ - WALL_T, maxX: halfW, maxY: belowH, maxZ: wZ + WALL_T });
    }
    if (aboveH > 0.01) {
      addPane(group, roomW, aboveH, { x: 0, y: yTop + aboveH / 2, z: wZ }, rotY);
      colliders.push({ minX: -halfW, minY: yTop, minZ: wZ - WALL_T, maxX: halfW, maxY: roomH, maxZ: wZ + WALL_T });
    }
    if (leftW > 0.01) {
      addPane(group, leftW, midH, { x: -halfW + leftW / 2, y: yBot + midH / 2, z: wZ }, rotY);
      colliders.push({ minX: -halfW, minY: yBot, minZ: wZ - WALL_T, maxX: -halfW + leftW, maxY: yTop, maxZ: wZ + WALL_T });
    }
    if (rightW > 0.01) {
      addPane(group, rightW, midH, { x: halfW - rightW / 2, y: yBot + midH / 2, z: wZ }, rotY);
      colliders.push({ minX: halfW - rightW, minY: yBot, minZ: wZ - WALL_T, maxX: halfW, maxY: yTop, maxZ: wZ + WALL_T });
    }
    // Void collider — physical barrier over the window opening
    colliders.push({
      minX: winLeft, minY: yBot, minZ: wZ - WALL_T,
      maxX: winRight, maxY: yTop, maxZ: wZ + WALL_T,
    });

  } else {
    // Port / starboard
    const wX   = spec.wall === 'port' ? -halfW : halfW;
    const rotY = spec.wall === 'port' ? Math.PI / 2 : -Math.PI / 2;

    const winFore    = winOffset - spec.w / 2;
    const winAft     = winOffset + spec.w / 2;
    const foreStripD = winFore + halfD;
    const aftStripD  = halfD - winAft;

    if (belowH > 0.01) {
      addPane(group, roomD, belowH, { x: wX, y: belowH / 2, z: 0 }, rotY);
      colliders.push({ minX: wX - WALL_T, minY: 0, minZ: -halfD, maxX: wX + WALL_T, maxY: belowH, maxZ: halfD });
    }
    if (aboveH > 0.01) {
      addPane(group, roomD, aboveH, { x: wX, y: yTop + aboveH / 2, z: 0 }, rotY);
      colliders.push({ minX: wX - WALL_T, minY: yTop, minZ: -halfD, maxX: wX + WALL_T, maxY: roomH, maxZ: halfD });
    }
    if (foreStripD > 0.01) {
      addPane(group, foreStripD, midH, { x: wX, y: yBot + midH / 2, z: -halfD + foreStripD / 2 }, rotY);
      colliders.push({ minX: wX - WALL_T, minY: yBot, minZ: -halfD, maxX: wX + WALL_T, maxY: yTop, maxZ: -halfD + foreStripD });
    }
    if (aftStripD > 0.01) {
      addPane(group, aftStripD, midH, { x: wX, y: yBot + midH / 2, z: halfD - aftStripD / 2 }, rotY);
      colliders.push({ minX: wX - WALL_T, minY: yBot, minZ: halfD - aftStripD, maxX: wX + WALL_T, maxY: yTop, maxZ: halfD });
    }
    // Void collider
    colliders.push({
      minX: wX - WALL_T, minY: yBot, minZ: winFore,
      maxX: wX + WALL_T, maxY: yTop, maxZ: winAft,
    });
  }

  return colliders;
}
