/**
 * Cargo Bay — aft of engineering.
 * World position (0, 0, 13.5). Room: 8W x 5H x 9D.
 * FORE wall has door back to engineering (handled by doors.ts item 1f).
 * Pressure-hatch framing: FRAME_DEPTH=0.5, JAMB=0.2 + orange threshold floor plate.
 */
import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import { matWall, matFloor, matCeiling } from './materials.js';
import { matDoorFrame } from '../fx/shipMaterials.js';
import { buildCargoBayProps } from './cargoBayProps.js';
import type { RoomModule } from './types.js';

// Heavy pressure-hatch frame constants (deeper than standard)
const HATCH_FRAME_DEPTH = 0.50;
const HATCH_JAMB_W     = 0.20;
const HATCH_HEAD_H     = 0.14;
const DOOR_GAP_W       = 1.34;
const DOOR_GAP_H       = 2.08;

function addHatchFrame(group: THREE.Group, roomW: number, roomD: number): void {
  const halfD = roomD / 2;
  const wZ    = -halfD; // fore wall

  // Left jamb
  const lj = new THREE.Mesh(
    new THREE.BoxGeometry(HATCH_JAMB_W, DOOR_GAP_H, HATCH_FRAME_DEPTH),
    matDoorFrame,
  );
  lj.position.set(-DOOR_GAP_W / 2 - HATCH_JAMB_W / 2, DOOR_GAP_H / 2, wZ);
  group.add(lj);

  // Right jamb
  const rj = new THREE.Mesh(
    new THREE.BoxGeometry(HATCH_JAMB_W, DOOR_GAP_H, HATCH_FRAME_DEPTH),
    matDoorFrame,
  );
  rj.position.set(DOOR_GAP_W / 2 + HATCH_JAMB_W / 2, DOOR_GAP_H / 2, wZ);
  group.add(rj);

  // Header
  const hdr = new THREE.Mesh(
    new THREE.BoxGeometry(DOOR_GAP_W + HATCH_JAMB_W * 2, HATCH_HEAD_H, HATCH_FRAME_DEPTH),
    matDoorFrame,
  );
  hdr.position.set(0, DOOR_GAP_H + HATCH_HEAD_H / 2, wZ);
  group.add(hdr);

  // Orange floor threshold plate 1.7W x 0.05H x 0.5D
  const thresh = new THREE.Mesh(
    new THREE.BoxGeometry(1.70, 0.05, 0.50),
    new THREE.MeshLambertMaterial({ color: 0xC7641E }),
  );
  thresh.position.set(0, 0.025, wZ);
  group.add(thresh);

  void roomW;
}

export function buildCargoBay(): RoomModule {
  const W = 8;
  const H = 5;
  const D = 9;

  // Use standard buildRoom for shell (floor/ceiling/walls with door gap on fore)
  // Pass the door gap spec; the heavy hatch frame is added manually below.
  const { group, colliders } = buildRoom({
    width:       W,
    height:      H,
    depth:       D,
    wallMaterial: matWall,
    doors: [
      { wall: 'fore', gapW: DOOR_GAP_W, gapH: DOOR_GAP_H, offset: 0, framed: false },
    ],
  });

  group.name = 'cargo-bay';

  // Heavy hatch frame on the fore wall
  addHatchFrame(group, W, D);

  // Override floor/ceiling materials — buildRoom already added them, but the
  // cargo bay uses the same matFloor/matCeiling which are singletons (no extra
  // material cost). The 5m ceiling is handled by H=5 in buildRoom automatically.

  // Props
  buildCargoBayProps(group, W, H, D);

  // Cargo bay camera: stand fore, looking aft across the full 5H volume.
  // Eye height 1.7, position at Z=-3 (fore third), look toward catwalk area.
  const localCamPos  = new THREE.Vector3(0.5, 1.7, -3.5);
  const localCamLook = new THREE.Vector3(0.0, 2.5, 0.0);

  // Room collider — tight box for the 8x5x9 shell
  // (individual wall colliders come from buildRoom; the floor/ceiling are implicit)
  void matFloor;
  void matCeiling;

  return {
    group,
    colliders,
    interactables: [],
    cameras: [
      {
        name: 'cargo-bay',
        position: localCamPos,
        lookAt:   localCamLook,
      },
    ],
  };
}
