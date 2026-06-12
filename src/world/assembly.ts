import * as THREE from 'three';
import { registerCam } from '../core/cameras.js';
import { buildCockpit } from './cockpit.js';
import { buildCorridor } from './corridor.js';
import { buildQuartersA, buildQuartersB } from './quarters.js';
import { buildGalley } from './galley.js';
import { buildEngineering } from './engineering.js';
import type { AABB, RoomModule } from './types.js';

/**
 * Ship layout — all positions are world-space (Y=0 is deck level).
 * Z axis: fore = negative, aft = positive.
 *
 *   cockpit         (0, 0, -22.5)   6W x 3H x 5D
 *   corridor        (0, 0, -12)     3W x 3H x 16D
 *   quarters-a      (-4, 0, -16)    5W x 3H x 5D  (port)
 *   quarters-b      (+4, 0, -16)    5W x 3H x 5D  (starboard)
 *   galley          (0, 0, -1)      6W x 3H x 6D
 *   engineering     (0, 0, +5.5)    6W x 3H x 7D
 */

interface RoomPlacement {
  module: RoomModule;
  worldPos: THREE.Vector3;
}

function translateAABB(aabb: AABB, offset: THREE.Vector3): AABB {
  return {
    minX: aabb.minX + offset.x,
    minY: aabb.minY + offset.y,
    minZ: aabb.minZ + offset.z,
    maxX: aabb.maxX + offset.x,
    maxY: aabb.maxY + offset.y,
    maxZ: aabb.maxZ + offset.z,
  };
}

export interface ShipAssembly {
  groups: THREE.Group[];
  colliders: AABB[];
}

export function assembleShip(scene: THREE.Scene): ShipAssembly {
  const placements: RoomPlacement[] = [
    { module: buildCockpit(),      worldPos: new THREE.Vector3(0,  0, -22.5) },
    { module: buildCorridor(),     worldPos: new THREE.Vector3(0,  0, -12)   },
    { module: buildQuartersA(),    worldPos: new THREE.Vector3(-4, 0, -16)   },
    { module: buildQuartersB(),    worldPos: new THREE.Vector3(4,  0, -16)   },
    { module: buildGalley(),       worldPos: new THREE.Vector3(0,  0, -1)    },
    { module: buildEngineering(),  worldPos: new THREE.Vector3(0,  0, 5.5)   },
  ];

  const allColliders: AABB[] = [];
  const groups: THREE.Group[] = [];

  for (const { module, worldPos } of placements) {
    // Position the group
    module.group.position.copy(worldPos);
    scene.add(module.group);
    groups.push(module.group);

    // Translate local colliders to world space
    for (const localAABB of module.colliders) {
      allColliders.push(translateAABB(localAABB, worldPos));
    }

    // Register named cameras in world space
    for (const cam of module.cameras) {
      const worldPos2 = cam.position.clone().add(worldPos);
      const worldLook = cam.lookAt.clone().add(worldPos);
      registerCam(cam.name, worldPos2, worldLook);
    }
  }

  // Lighting: HemisphereLight + point lights along the ship spine
  const hemi = new THREE.HemisphereLight(0xffffff, 0x303040, 0.5);
  scene.add(hemi);

  // Point lights: cockpit, corridor mid, quarters area, galley, engineering (max 5)
  const pointDefs: [number, number, number, number][] = [
    [0,    2.5, -22.5, 0xfff4e0], // cockpit
    [0,    2.5, -16,   0xfff4e0], // corridor/quarters junction
    [0,    2.5, -8,    0xfff4e0], // corridor mid (aft half)
    [0,    2.5, -1,    0xfff4e0], // galley
    [0,    2.5,  5.5,  0xff8844], // engineering (warmer)
  ];

  for (const [px, py, pz, color] of pointDefs) {
    const light = new THREE.PointLight(color, 1.5, 14);
    light.position.set(px, py, pz);
    scene.add(light);
  }

  // Ambient fill to prevent absolute black
  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambient);

  return { groups, colliders: allColliders };
}
