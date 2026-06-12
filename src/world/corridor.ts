import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule } from './types.js';

/**
 * Corridor spine — 3W x 3H x 16D.
 * Doors: fore (to cockpit), aft (to galley), port (to quarters-a), starboard (to quarters-b).
 * The side doors are centered at Z = -4 (fore half), matching the quarters Z position.
 */
export function buildCorridor(): RoomModule {
  const W = 3;
  const H = 3;
  const D = 16;

  // Side door center in corridor-local Z coords.
  // Corridor local origin = center of floor.
  // Quarters are at -4 from corridor center.
  const SIDE_DOOR_Z = -4.0;

  const { group, colliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    doors: [
      { wall: 'fore', gapW: 1.4, gapH: 2.2, offset: 0 },
      { wall: 'aft', gapW: 1.4, gapH: 2.2, offset: 0 },
      { wall: 'port', gapW: 1.4, gapH: 2.2, offset: SIDE_DOOR_Z },
      { wall: 'starboard', gapW: 1.4, gapH: 2.2, offset: SIDE_DOOR_Z },
    ],
  });

  group.name = 'corridor';

  const localCamPos = new THREE.Vector3(0, 1.7, 0);
  const localCamLook = new THREE.Vector3(0, 1.7, -5);

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
