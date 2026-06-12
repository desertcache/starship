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
  // The porthole goes in the outer wall (faces space)
  const outerWall: 'port' | 'starboard' = side;

  const { group, colliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    doors: [
      { wall: innerWall, gapW: 1.4, gapH: 2.2, offset: 0 },
    ],
    windows: [
      {
        wall: outerWall,
        w: 1.0,    // porthole width
        h: 0.8,    // porthole height
        yBot: 1.2, // mid-wall height
        offset: 0, // centered
      },
    ],
  });

  group.name = `quarters-${side === 'port' ? 'a' : 'b'}`;

  // Camera positioned near the inner wall, looking toward the porthole
  const localCamPos = side === 'port'
    ? new THREE.Vector3(1.5, 1.7, 0)   // near starboard (inner) wall
    : new THREE.Vector3(-1.5, 1.7, 0); // near port (inner) wall
  // Look toward the outer wall porthole
  const localCamLook = side === 'port'
    ? new THREE.Vector3(-2.5, 1.6, 0)  // looking at port outer wall
    : new THREE.Vector3(2.5, 1.6, 0);  // looking at starboard outer wall

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
