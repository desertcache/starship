/**
 * Room dressing helpers — Phase 3.
 * Adds teal floor strips, emissive ceiling panels, and burnt-orange door frames.
 * Called by roomBuilder.ts and corridor.ts.
 */
import * as THREE from 'three';
import { matTealStrip, matCeilingLight, matDoorFrame } from '../fx/shipMaterials.js';
import type { DoorSpec } from './roomBuilder.js';

const GAP_W_DEFAULT = 1.4;

// Frame geometry constants (exported so corridor.ts can reuse them)
export const FRAME_TOTAL_DEPTH = 0.30;  // spans both coincident wall planes
export const FRAME_JAMB_W      = 0.12;  // width of left/right jamb strips
export const FRAME_HEAD_H      = 0.10;  // height of header strip

// ── Door frames ────────────────────────────────────────────────────────────────

/**
 * Add a burnt-orange door frame around a doorway gap.
 * Three BoxGeometry pieces (left jamb, right jamb, header) proud of both wall planes.
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

  if (wall === 'fore' || wall === 'aft') {
    const wZ = wall === 'fore' ? -halfD : halfD;

    const lJamb = new THREE.Mesh(
      new THREE.BoxGeometry(FRAME_JAMB_W, gapH, depth),
      matDoorFrame,
    );
    lJamb.position.set(gapOffset - gapW / 2 - FRAME_JAMB_W / 2, gapH / 2, wZ);
    group.add(lJamb);

    const rJamb = new THREE.Mesh(
      new THREE.BoxGeometry(FRAME_JAMB_W, gapH, depth),
      matDoorFrame,
    );
    rJamb.position.set(gapOffset + gapW / 2 + FRAME_JAMB_W / 2, gapH / 2, wZ);
    group.add(rJamb);

    const header = new THREE.Mesh(
      new THREE.BoxGeometry(gapW + FRAME_JAMB_W * 2, FRAME_HEAD_H, depth),
      matDoorFrame,
    );
    header.position.set(gapOffset, gapH + FRAME_HEAD_H / 2, wZ);
    group.add(header);

  } else {
    const wX = wall === 'port' ? -halfW : halfW;

    const lJamb = new THREE.Mesh(
      new THREE.BoxGeometry(depth, gapH, FRAME_JAMB_W),
      matDoorFrame,
    );
    lJamb.position.set(wX, gapH / 2, gapOffset - gapW / 2 - FRAME_JAMB_W / 2);
    group.add(lJamb);

    const rJamb = new THREE.Mesh(
      new THREE.BoxGeometry(depth, gapH, FRAME_JAMB_W),
      matDoorFrame,
    );
    rJamb.position.set(wX, gapH / 2, gapOffset + gapW / 2 + FRAME_JAMB_W / 2);
    group.add(rJamb);

    const header = new THREE.Mesh(
      new THREE.BoxGeometry(depth, FRAME_HEAD_H, gapW + FRAME_JAMB_W * 2),
      matDoorFrame,
    );
    header.position.set(wX, gapH + FRAME_HEAD_H / 2, gapOffset);
    group.add(header);
  }
}

// ── Floor strips ───────────────────────────────────────────────────────────────

/**
 * Add teal emissive floor-edge strips along all four walls.
 * Door gap sections are skipped so strips don't block doorways.
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

  for (const side of ['fore', 'aft'] as const) {
    const door   = doorMap.get(side);
    const wZ     = side === 'fore' ? -halfD + OFFSET : halfD - OFFSET;
    const gapW   = door ? (door.gapW ?? GAP_W_DEFAULT) : 0;
    const gapOff = door ? (door.offset ?? 0) : 0;

    if (door) {
      const leftLen  = gapOff - gapW / 2 + halfW;
      const rightLen = halfW - (gapOff + gapW / 2);
      if (leftLen > 0.05) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(leftLen, STRIP_H, STRIP_D), matTealStrip);
        m.position.set(-halfW + leftLen / 2, STRIP_H / 2, wZ);
        group.add(m);
      }
      if (rightLen > 0.05) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(rightLen, STRIP_H, STRIP_D), matTealStrip);
        m.position.set(halfW - rightLen / 2, STRIP_H / 2, wZ);
        group.add(m);
      }
    } else {
      const m = new THREE.Mesh(new THREE.BoxGeometry(roomW, STRIP_H, STRIP_D), matTealStrip);
      m.position.set(0, STRIP_H / 2, wZ);
      group.add(m);
    }
  }

  for (const side of ['port', 'starboard'] as const) {
    const door   = doorMap.get(side);
    const wX     = side === 'port' ? -halfW + OFFSET : halfW - OFFSET;
    const gapW   = door ? (door.gapW ?? GAP_W_DEFAULT) : 0;
    const gapOff = door ? (door.offset ?? 0) : 0;

    if (door) {
      const foreLen = gapOff - gapW / 2 + halfD;
      const aftLen  = halfD - (gapOff + gapW / 2);
      if (foreLen > 0.05) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(STRIP_D, STRIP_H, foreLen), matTealStrip);
        m.position.set(wX, STRIP_H / 2, -halfD + foreLen / 2);
        group.add(m);
      }
      if (aftLen > 0.05) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(STRIP_D, STRIP_H, aftLen), matTealStrip);
        m.position.set(wX, STRIP_H / 2, halfD - aftLen / 2);
        group.add(m);
      }
    } else {
      const m = new THREE.Mesh(new THREE.BoxGeometry(STRIP_D, STRIP_H, roomD), matTealStrip);
      m.position.set(wX, STRIP_H / 2, 0);
      group.add(m);
    }
  }
}

// ── Ceiling light panels ───────────────────────────────────────────────────────

/**
 * Add emissive ceiling light panels in a grid scaled to the room dimensions.
 */
export function addCeilingLights(
  group: THREE.Group,
  roomW: number,
  roomH: number,
  roomD: number,
): void {
  const PANEL_W = 0.8;
  const PANEL_D = 1.6;
  const INSET   = 0.01;
  const Y       = roomH - INSET;

  const cols  = Math.max(1, Math.round(roomW / 2));
  const rows  = Math.max(1, Math.round(roomD / 2.5));
  const stepX = roomW / cols;
  const stepZ = roomD / rows;

  for (let ci = 0; ci < cols; ci++) {
    for (let ri = 0; ri < rows; ri++) {
      const cx    = -roomW / 2 + stepX * (ci + 0.5);
      const cz    = -roomD / 2 + stepZ * (ri + 0.5);
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(PANEL_W, PANEL_D),
        matCeilingLight,
      );
      panel.position.set(cx, Y, cz);
      panel.rotation.x = Math.PI / 2;
      group.add(panel);
    }
  }
}
