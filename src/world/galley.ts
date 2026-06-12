import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule } from './types.js';

/** Galley / mess — 6W x 3H x 6D. */
export function buildGalley(): RoomModule {
  const W = 6;
  const H = 3;
  const D = 6;

  const { group, colliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    doors: [
      // Fore wall connects to corridor aft
      { wall: 'fore', gapW: 1.4, gapH: 2.2, offset: 0 },
      // Aft wall connects to engineering
      { wall: 'aft', gapW: 1.4, gapH: 2.2, offset: 0 },
    ],
  });

  group.name = 'galley';

  const localCamPos = new THREE.Vector3(0, 1.7, 1.5);
  const localCamLook = new THREE.Vector3(0, 1.7, -2.0);

  return {
    group,
    colliders,
    interactables: [],
    cameras: [
      {
        name: 'galley',
        position: localCamPos,
        lookAt: localCamLook,
      },
    ],
  };
}
