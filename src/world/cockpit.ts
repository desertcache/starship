import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule } from './types.js';

/** Cockpit — fore end of ship. 6W x 3H x 5D. */
export function buildCockpit(): RoomModule {
  const W = 6;
  const H = 3;
  const D = 5;

  const { group, colliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    doors: [
      // Aft wall connects to corridor
      { wall: 'aft', gapW: 1.4, gapH: 2.2, offset: 0 },
    ],
  });

  group.name = 'cockpit';

  // --- Named cameras (in world space — registered after group is positioned) ---
  // Registered by assembly.ts after positioning, but we define them here for clarity.
  // We return NamedCamera descriptors; assembly.ts calls registerCam with world offsets.
  // Main cockpit cam — from aft, looking fore
  const localCamCockpit = new THREE.Vector3(0, 1.7, 1.8);
  const localLookCockpit = new THREE.Vector3(0, 1.7, -2.0);

  // Canopy cam — mid-room, angled up-fore toward where the canopy glass will be
  const localCamCanopy = new THREE.Vector3(0, 1.0, 0.5);
  const localLookCanopy = new THREE.Vector3(0, 2.5, -2.0);

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
