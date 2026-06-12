import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import { addCockpitProps, liveScreenTick, dustMoteTick } from './cockpitProps.js';
import type { RoomModule } from './types.js';

/** Cockpit — fore end of ship. 6W x 3H x 5D. */
export function buildCockpit(): RoomModule {
  const W = 6;
  const H = 3;
  const D = 5;

  // Canopy: nearly full fore wall opening
  // Room is 6 wide, 3 tall — canopy is 4.6w x 1.9h starting at y=0.7
  // Leaves a ~0.7 strip on each side and a 0.7 sill / 0.4 header
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
        yBot: 0.7, // sill height — console bank sits below this line
        offset: 0,
      },
    ],
  });

  group.name = 'cockpit';

  // Add props (console bank, seats, side consoles, pedestal, dust, decals)
  const props = addCockpitProps(group);
  colliders.push(...props.colliders);

  // Per-frame tick for live screens and dust motes (onBeforeRender on the group)
  let _lastFrame = 0;
  group.onBeforeRender = (): void => {
    const elapsed = performance.now();
    // Gate dust mote tick to ~30fps update (every ~33ms)
    if (elapsed - _lastFrame > 16) {
      dustMoteTick();
      liveScreenTick(elapsed);
      _lastFrame = elapsed;
    }
  };

  // cockpit cam — from aft looking fore; eye level sees seats mid-frame,
  // console bank in lower-mid, canopy + planet above
  const localCamCockpit  = new THREE.Vector3(0, 1.55, 1.8);
  const localLookCockpit = new THREE.Vector3(0, 1.10, -1.8);

  // cockpit-canopy cam — from pilot position behind console, canopy fills upper frame,
  // console screens visible in lower portion
  const localCamCanopy  = new THREE.Vector3(0, 1.55, 0.0);
  const localLookCanopy = new THREE.Vector3(0, 1.40, -2.5);

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
