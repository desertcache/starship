import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule } from './types.js';

/** Build one crew quarter room. 5W x 3H x 5D. */
function buildQuarter(
  side: 'port' | 'starboard',
  camName: string,
): RoomModule {
  const W = 5;
  const H = 3;
  const D = 5;

  // The door connects to the corridor on the inner wall
  const innerWall: 'port' | 'starboard' = side === 'port' ? 'starboard' : 'port';

  const { group, colliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    doors: [
      { wall: innerWall, gapW: 1.4, gapH: 2.2, offset: 0 },
    ],
  });

  group.name = `quarters-${side === 'port' ? 'a' : 'b'}`;

  // Camera positioned on outer wall, looking inward toward the door gap
  const localCamPos = side === 'port'
    ? new THREE.Vector3(-1.5, 1.7, 0)  // near port (outer) wall
    : new THREE.Vector3(1.5, 1.7, 0);  // near starboard (outer) wall
  const localCamLook = side === 'port'
    ? new THREE.Vector3(2.5, 1.2, 0)   // looking at starboard door gap
    : new THREE.Vector3(-2.5, 1.2, 0); // looking at port door gap

  return {
    group,
    colliders,
    interactables: [],
    cameras: [
      {
        name: camName,
        position: localCamPos,
        lookAt: localCamLook,
      },
    ],
  };
}

export function buildQuartersA(): RoomModule {
  return buildQuarter('port', 'quarters-a');
}

export function buildQuartersB(): RoomModule {
  return buildQuarter('starboard', 'quarters-b');
}
