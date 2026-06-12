import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule } from './types.js';
import { addGalleyProps } from './galleyProps.js';

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
      // Fore wall connects to corridor aft — corridor already owns that frame
      { wall: 'fore', gapW: 1.4, gapH: 2.2, offset: 0 },
      // Aft wall connects to engineering — galley owns THIS frame
      { wall: 'aft', gapW: 1.4, gapH: 2.2, offset: 0, framed: true },
    ],
  });

  group.name = 'galley';

  const { colliders: propColliders } = addGalleyProps(group);
  colliders.push(...propColliders);

  // Camera: angled to frame counter + upper cabinets + fridge + stove glow.
  // Position on port side looking toward starboard counter run.
  const localCamPos  = new THREE.Vector3(-1.8, 1.55, -0.4);
  const localCamLook = new THREE.Vector3(2.5,  1.20, -0.4);

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
