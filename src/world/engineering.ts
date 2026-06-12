import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule } from './types.js';

/** Engineering — 6W x 3H x 7D. Aft end of ship. */
export function buildEngineering(): RoomModule {
  const W = 6;
  const H = 3;
  const D = 7;

  const { group, colliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    doors: [
      // Fore wall connects to galley
      { wall: 'fore', gapW: 1.4, gapH: 2.2, offset: 0 },
    ],
  });

  group.name = 'engineering';

  const localCamPos = new THREE.Vector3(0, 1.7, 2.0);
  const localCamLook = new THREE.Vector3(0, 1.7, -2.0);

  return {
    group,
    colliders,
    interactables: [],
    cameras: [
      {
        name: 'engineering',
        position: localCamPos,
        lookAt: localCamLook,
      },
    ],
  };
}
