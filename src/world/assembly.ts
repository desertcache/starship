import * as THREE from 'three';
import { registerCam } from '../core/cameras.js';
import { buildCockpit } from './cockpit.js';
import { buildCorridor } from './corridor.js';
import { buildQuartersA, buildQuartersB } from './quarters.js';
import { buildGalley } from './galley.js';
import { buildEngineering } from './engineering.js';
import { buildStarfield } from '../fx/starfield.js';
import { buildPlanet } from '../fx/planet.js';
import type { AABB, RoomModule } from './types.js';
import type { PlanetResult } from '../fx/planet.js';

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
  planet: PlanetResult;
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
    module.group.position.copy(worldPos);
    scene.add(module.group);
    groups.push(module.group);

    for (const localAABB of module.colliders) {
      allColliders.push(translateAABB(localAABB, worldPos));
    }

    for (const cam of module.cameras) {
      const worldPos2 = cam.position.clone().add(worldPos);
      const worldLook = cam.lookAt.clone().add(worldPos);
      registerCam(cam.name, worldPos2, worldLook);
    }
  }

  // ── Space environment ──────────────────────────────────────────────────────
  const starfield = buildStarfield();
  scene.add(starfield);

  const planet = buildPlanet();
  scene.add(planet.mesh);

  // ── Lighting ────────────────────────────────────────────────────────────────
  // Phase 3: emissive ceiling panels carry the ambient look; actual lights just
  // provide key fill to prevent flat pure-black corners.

  // HemisphereLight: slightly raised so quarters and unlit corners aren't pure black
  const hemi = new THREE.HemisphereLight(0xfff4e0, 0x1a1a2e, 0.45);
  scene.add(hemi);

  // 5 PointLights (≤ 6 budget) — one per major zone, warm white except engineering
  // Intensity reduced slightly because emissive panels add warmth.
  // Light positions at ceiling height (Y=2.8) so they reach floor and walls evenly.
  //
  //  1. Cockpit (fore canopy area)
  //  2. Quarters zone — centred between side rooms so both get lit
  //  3. Corridor mid (covers fore/aft corridor halves + junction)
  //  4. Galley/mess
  //  5. Engineering (warmer orange tint)
  //  6. Corridor fore / cockpit-aft transition
  const pointDefs: [number, number, number, number, number][] = [
    [0,    2.8, -22.5, 0xfff4e0, 1.8], // cockpit
    [0,    2.8, -16,   0xfff8f0, 3.5], // quarters/corridor junction — boosted intensity reaches side rooms at x=±4
    [0,    2.8, -8,    0xfff4e0, 1.6], // corridor mid-aft
    [0,    2.8, -1,    0xfff4e0, 1.6], // galley
    [0,    2.8,  5.5,  0xff7733, 1.8], // engineering (warm orange)
    [0,    2.8, -19,   0xfff4e0, 1.2], // corridor fore / cockpit threshold
  ];

  for (const [px, py, pz, color, intensity] of pointDefs) {
    // Quarters junction light gets a larger radius to reach the side rooms at X=±4
    const dist = (pz === -16) ? 24 : 18;
    const light = new THREE.PointLight(color, intensity, dist);
    light.position.set(px, py, pz);
    scene.add(light);
  }

  // Ambient fill — quarters and corridor corners need enough base light to read
  const ambient = new THREE.AmbientLight(0xffffff, 0.20);
  scene.add(ambient);

  return { groups, colliders: allColliders, planet };
}
