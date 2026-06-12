import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule } from './types.js';

/** Cockpit — fore end of ship. 6W x 3H x 5D. */
export function buildCockpit(): RoomModule {
  const W = 6;
  const H = 3;
  const D = 5;

  // Canopy: nearly full fore wall opening
  // Room is 6 wide, 3 tall — canopy is 4.6w x 1.8h starting at y=0.8
  // Leaves a ~0.7 strip on each side and a 0.8 sill / 0.4 header
  const { group, colliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    doors: [
      // Aft wall connects to corridor
      { wall: 'aft', gapW: 1.4, gapH: 2.2, offset: 0 },
    ],
    windows: [
      {
        wall: 'fore',
        w: 4.6,    // wide canopy
        h: 1.9,    // tall opening
        yBot: 0.7, // sill height
        offset: 0,
      },
    ],
  });

  group.name = 'cockpit';

  // cockpit cam — from aft, looking fore toward canopy
  const localCamCockpit = new THREE.Vector3(0, 1.7, 1.8);
  const localLookCockpit = new THREE.Vector3(0, 1.7, -2.0);

  // cockpit-canopy cam — mid-room, eye level, looking straight at canopy
  // Positioned close enough to the canopy that the opening fills the view
  const localCamCanopy = new THREE.Vector3(0, 1.6, 0.2);
  const localLookCanopy = new THREE.Vector3(0, 1.6, -2.5);

  return {
    group,
    colliders,
    interactables: [],
    cameras: [
      {
        name: 'cockpit',
        position: localCamCockpit,
        lookAt: localLookCockpit,
      },
      {
        name: 'cockpit-canopy',
        position: localCamCanopy,
        lookAt: localLookCanopy,
      },
    ],
  };
}
