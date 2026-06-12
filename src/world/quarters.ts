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

  // Camera positioned near the aft wall, looking fore — shows ceiling panels on
  // the ceiling, teal strips along the floor perimeter, and the inner/outer walls.
  const localCamPos = new THREE.Vector3(0, 1.65, 1.8);   // aft-ish, centred
  const localCamLook = new THREE.Vector3(0, 1.5, -2.5);  // looking toward fore wall

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
