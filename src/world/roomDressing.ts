/**
 * Room dressing helpers — Phase 3.
 * Adds teal floor strips, discrete recessed ceiling fixtures, and burnt-orange door frames.
 * Called by roomBuilder.ts and corridor.ts.
 *
 * Geometry strategy (v0.4 defrag / v0.8 B2 lane):
 *   addFloorStrips   — collects all strip BoxGeometries, merges into ONE mesh/room.
 *   addDoorFrame     — merges 3 pieces (left jamb, right jamb, header) into ONE mesh/frame.
 *   addCeilingLights — delegates to buildCeilingFixtures (discrete recessed fixtures).
 *
 * Disposal: all input geometries are disposed after mergeGeometries().
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { matTealStrip, matDoorFrame } from '../fx/shipMaterials.js';
import { buildCeilingFixtures } from './ceilingFixtures.js';
import type { DoorSpec } from './roomBuilder.js';

const GAP_W_DEFAULT = 1.4;

// Frame geometry constants (exported so corridor.ts can reuse them)
export const FRAME_TOTAL_DEPTH = 0.30;  // spans both coincident wall planes
export const FRAME_JAMB_W      = 0.12;  // width of left/right jamb strips
export const FRAME_HEAD_H      = 0.10;  // height of header strip

// ── Door frames ────────────────────────────────────────────────────────────────

/**
 * Add a burnt-orange door frame around a doorway gap.
 * Merges left jamb, right jamb, and header into ONE BufferGeometry → ONE draw call.
 * Previously 3 separate BoxGeometry meshes → saves 2 geos + 2 draws per frame.
 */
export function addDoorFrame(
  group: THREE.Group,
  wall: 'fore' | 'aft' | 'port' | 'starboard',
  roomW: number,
  roomD: number,
  gapW: number,
  gapH: number,
  gapOffset: number,
): void {
  const halfW = roomW / 2;
  const halfD = roomD / 2;
  const depth = FRAME_TOTAL_DEPTH;

  // Build the three sub-geometries translated to their final positions,
  // then merge them into a single draw call.

  const pieces: THREE.BufferGeometry[] = [];

  if (wall === 'fore' || wall === 'aft') {
    const wZ = wall === 'fore' ? -halfD : halfD;

    // Left jamb
    const lJambGeo = new THREE.BoxGeometry(FRAME_JAMB_W, gapH, depth);
    lJambGeo.translate(gapOffset - gapW / 2 - FRAME_JAMB_W / 2, gapH / 2, wZ);
    pieces.push(lJambGeo);

    // Right jamb
    const rJambGeo = new THREE.BoxGeometry(FRAME_JAMB_W, gapH, depth);
    rJambGeo.translate(gapOffset + gapW / 2 + FRAME_JAMB_W / 2, gapH / 2, wZ);
    pieces.push(rJambGeo);

    // Header
    const headerGeo = new THREE.BoxGeometry(gapW + FRAME_JAMB_W * 2, FRAME_HEAD_H, depth);
    headerGeo.translate(gapOffset, gapH + FRAME_HEAD_H / 2, wZ);
    pieces.push(headerGeo);

  } else {
    const wX = wall === 'port' ? -halfW : halfW;

    // Left jamb
    const lJambGeo = new THREE.BoxGeometry(depth, gapH, FRAME_JAMB_W);
    lJambGeo.translate(wX, gapH / 2, gapOffset - gapW / 2 - FRAME_JAMB_W / 2);
    pieces.push(lJambGeo);

    // Right jamb
    const rJambGeo = new THREE.BoxGeometry(depth, gapH, FRAME_JAMB_W);
    rJambGeo.translate(wX, gapH / 2, gapOffset + gapW / 2 + FRAME_JAMB_W / 2);
    pieces.push(rJambGeo);

    // Header
    const headerGeo = new THREE.BoxGeometry(depth, FRAME_HEAD_H, gapW + FRAME_JAMB_W * 2);
    headerGeo.translate(wX, gapH + FRAME_HEAD_H / 2, gapOffset);
    pieces.push(headerGeo);
  }

  const merged = mergeGeometries(pieces);
  for (const g of pieces) g.dispose();
  group.add(new THREE.Mesh(merged, matDoorFrame));
}

// ── Floor strips ───────────────────────────────────────────────────────────────

/**
 * Add teal emissive floor-edge strips along all four walls.
 * Door gap sections are skipped so strips don't block doorways.
 *
 * v0.4 defrag: all strip BoxGeometries are collected, translated in place,
 * merged into ONE geometry, inputs disposed, ONE mesh added to group.
 * Saves ~5 geos + ~5 draws per room vs the old per-strip approach.
 */
export function addFloorStrips(
  group: THREE.Group,
  roomW: number,
  roomD: number,
  doors: DoorSpec[],
): void {
  const STRIP_H = 0.06;
  const STRIP_D = 0.04;
  const halfW   = roomW / 2;
  const halfD   = roomD / 2;
  const OFFSET  = 0.025;

  const doorMap = new Map<string, DoorSpec>(doors.map((d) => [d.wall, d]));
  const stripGeos: THREE.BufferGeometry[] = [];

  // ── Fore / aft walls ──────────────────────────────────────────────────────
  for (const side of ['fore', 'aft'] as const) {
    const door   = doorMap.get(side);
    const wZ     = side === 'fore' ? -halfD + OFFSET : halfD - OFFSET;
    const gapW   = door ? (door.gapW ?? GAP_W_DEFAULT) : 0;
    const gapOff = door ? (door.offset ?? 0) : 0;

    if (door) {
      const leftLen  = gapOff - gapW / 2 + halfW;
      const rightLen = halfW - (gapOff + gapW / 2);
      if (leftLen > 0.05) {
        const g = new THREE.BoxGeometry(leftLen, STRIP_H, STRIP_D);
        g.translate(-halfW + leftLen / 2, STRIP_H / 2, wZ);
        stripGeos.push(g);
      }
      if (rightLen > 0.05) {
        const g = new THREE.BoxGeometry(rightLen, STRIP_H, STRIP_D);
        g.translate(halfW - rightLen / 2, STRIP_H / 2, wZ);
        stripGeos.push(g);
      }
    } else {
      const g = new THREE.BoxGeometry(roomW, STRIP_H, STRIP_D);
      g.translate(0, STRIP_H / 2, wZ);
      stripGeos.push(g);
    }
  }

  // ── Port / starboard walls ────────────────────────────────────────────────
  for (const side of ['port', 'starboard'] as const) {
    const door   = doorMap.get(side);
    const wX     = side === 'port' ? -halfW + OFFSET : halfW - OFFSET;
    const gapW   = door ? (door.gapW ?? GAP_W_DEFAULT) : 0;
    const gapOff = door ? (door.offset ?? 0) : 0;

    if (door) {
      const foreLen = gapOff - gapW / 2 + halfD;
      const aftLen  = halfD - (gapOff + gapW / 2);
      if (foreLen > 0.05) {
        const g = new THREE.BoxGeometry(STRIP_D, STRIP_H, foreLen);
        g.translate(wX, STRIP_H / 2, -halfD + foreLen / 2);
        stripGeos.push(g);
      }
      if (aftLen > 0.05) {
        const g = new THREE.BoxGeometry(STRIP_D, STRIP_H, aftLen);
        g.translate(wX, STRIP_H / 2, halfD - aftLen / 2);
        stripGeos.push(g);
      }
    } else {
      const g = new THREE.BoxGeometry(STRIP_D, STRIP_H, roomD);
      g.translate(wX, STRIP_H / 2, 0);
      stripGeos.push(g);
    }
  }

  // ── Merge all strips into a single draw call ──────────────────────────────
  if (stripGeos.length > 0) {
    const merged = mergeGeometries(stripGeos);
    for (const g of stripGeos) g.dispose();
    group.add(new THREE.Mesh(merged, matTealStrip));
  }
}

// ── Ceiling fixture panels (v0.8 B2 lane) ─────────────────────────────────────

/**
 * Replace the old giant ceiling slab panels with discrete recessed fixtures.
 * Signature unchanged — roomBuilder.ts calls addCeilingLights(group, W, H, D)
 * and that call site does NOT need to change.
 *
 * Delegates entirely to buildCeilingFixtures (ceilingFixtures.ts) which
 * identifies the room from W×D, selects fixture positions, and emits
 * exactly TWO merged meshes per room (gunmetal housing + emissive diffuser).
 */
export function addCeilingLights(
  group: THREE.Group,
  roomW: number,
  roomH: number,
  roomD: number,
): void {
  buildCeilingFixtures(group, roomW, roomH, roomD);
}
