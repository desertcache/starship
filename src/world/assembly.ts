import * as THREE from 'three';
import { registerCam } from '../core/cameras.js';
import { buildCockpit } from './cockpit.js';
import { buildCorridor } from './corridor.js';
import { buildQuartersA, buildQuartersB } from './quarters.js';
import { buildGalley } from './galley.js';
import { buildEngineering } from './engineering.js';
import { buildCargoBay } from './cargoBay.js';
import { buildDoors, tickDoors } from './doors.js';
import type { DoorEntry } from './doors.js';
import { buildStarfield } from '../fx/starfield.js';
import { buildPlanet } from '../fx/planet.js';
import type { AABB, RoomModule, Interactable } from './types.js';
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
 *   cargo-bay       (0, 0, +13.5)   8W x 5H x 9D
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
  interactables: Interactable[];
  planet: PlanetResult;
  starfield: THREE.Points;
}

export function assembleShip(scene: THREE.Scene): ShipAssembly {
  const placements: RoomPlacement[] = [
    { module: buildCockpit(),      worldPos: new THREE.Vector3(0,  0, -22.5) },
    { module: buildCorridor(),     worldPos: new THREE.Vector3(0,  0, -12)   },
    { module: buildQuartersA(),    worldPos: new THREE.Vector3(-4, 0, -16)   },
    { module: buildQuartersB(),    worldPos: new THREE.Vector3(4,  0, -16)   },
    { module: buildGalley(),       worldPos: new THREE.Vector3(0,  0, -1)    },
    { module: buildEngineering(),  worldPos: new THREE.Vector3(0,  0, 5.5)   },
    { module: buildCargoBay(),     worldPos: new THREE.Vector3(0,  0, 13.5)  },
  ];

  const allColliders: AABB[] = [];
  const allInteractables: Interactable[] = [];
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

    for (const ia of module.interactables) {
      ia.position.add(worldPos);
      allInteractables.push(ia);
    }
  }

  // ── Door specs — 6 doorways ────────────────────────────────────────────────
  // All doors start OPEN. spec.position.y = 0 = floor-level base of slab group.
  const doorSpecs: DoorEntry[] = [
    // (a) cockpit-aft / corridor-fore at world (0, 0, -20), facing Z
    { id: 'cockpit-aft',         position: new THREE.Vector3(0,   0, -20), facing: 'Z' },
    // (b) corridor → quarters-a at (-2.5, 0, -16), facing X
    { id: 'corridor-quarters-a', position: new THREE.Vector3(-2.5, 0, -16), facing: 'X' },
    // (c) corridor → quarters-b at (2.5, 0, -16), facing X
    { id: 'corridor-quarters-b', position: new THREE.Vector3(2.5,  0, -16), facing: 'X' },
    // (d) corridor-aft → galley-fore at (0, 0, -7), facing Z
    { id: 'corridor-galley',     position: new THREE.Vector3(0,   0, -7),  facing: 'Z' },
    // (e) galley-aft → engineering-fore at (0, 0, -1), facing Z
    { id: 'galley-engineering',  position: new THREE.Vector3(0,   0, -1),  facing: 'Z' },
    // (f) engineering-aft → cargo at (0, 0, 9), facing Z
    { id: 'engineering-cargo',   position: new THREE.Vector3(0,   0, 9),   facing: 'Z' },
  ];

  buildDoors(scene, doorSpecs);

  // ── Space environment ──────────────────────────────────────────────────────
  const starfield = buildStarfield();
  scene.add(starfield);

  const planet = buildPlanet();
  scene.add(planet.mesh);

  // ── Lighting ─────────────────────────────────────────────────────────────
  // Ship total: 10 PointLights
  //   Existing (6): cockpit, junction, corridor-mid, galley, engineering, threshold
  //   Stray in engineering.ts (+1 = 7): local reactor glow light (do NOT remove)
  //   New (+3): 2x dedicated quarters + 1 cargo bay  → total = 10
  //
  // Changes vs prior assembly:
  //   - Junction light retargeted: int3.5/dist24 → int1.8/dist14
  //   - Corridor/galley lights lowered Y: 2.8 → 2.0 (wall-wash + floor-pool)
  //   - Engineering reactor light now animated via onBeforeRender dummy mesh
  //   - +2 dedicated quarters lights at (±4, 2.6, -16)
  //   - +1 cargo bay light at (0, 4.2, 13.5)

  const hemi = new THREE.HemisphereLight(0xfff4e0, 0x1a1a2e, 0.45);
  scene.add(hemi);

  // 1. Cockpit
  const cockpitPt = new THREE.PointLight(0xfff4e0, 1.8, 18);
  cockpitPt.position.set(0, 2.8, -22.5);
  scene.add(cockpitPt);

  // 2. Quarters junction — RETARGETED (was int3.5 dist24)
  const junctionPt = new THREE.PointLight(0xfff8f0, 1.8, 14);
  junctionPt.position.set(0, 2.8, -16);
  scene.add(junctionPt);

  // 3a. Dedicated quarters port  (+1 of budget 3)
  const qPortPt = new THREE.PointLight(0xfff4e0, 1.3, 11);
  qPortPt.position.set(-4, 2.6, -16);
  scene.add(qPortPt);

  // 3b. Dedicated quarters starboard  (+2 of budget 3)
  const qStbdPt = new THREE.PointLight(0xfff4e0, 1.3, 11);
  qStbdPt.position.set(4, 2.6, -16);
  scene.add(qStbdPt);

  // 4. Corridor mid — LOWERED to Y=2.0
  const corridorPt = new THREE.PointLight(0xfff4e0, 1.6, 18);
  corridorPt.position.set(0, 2.0, -8);
  scene.add(corridorPt);

  // 5. Galley — LOWERED to Y=2.0
  const galleyPt = new THREE.PointLight(0xfff4e0, 1.6, 18);
  galleyPt.position.set(0, 2.0, -1);
  scene.add(galleyPt);

  // 6. Engineering reactor (warm orange) — ANIMATED below via dummy mesh
  const reactorPt = new THREE.PointLight(0xff7733, 1.6, 18);
  reactorPt.position.set(0, 2.8, 5.5);
  scene.add(reactorPt);

  // Animate reactor light via a tiny invisible plane's onBeforeRender
  // (self-animating pattern — no main.ts edit required)
  const reactorDummy = new THREE.Mesh(
    new THREE.PlaneGeometry(0.001, 0.001),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  reactorDummy.position.set(0, 2.8, 5.5);
  reactorDummy.onBeforeRender = (): void => {
    const t = performance.now() / 1000;
    reactorPt.intensity = 1.6 + Math.sin(t * 2.1) * 0.35;
  };
  scene.add(reactorDummy);

  // 7. Corridor fore / cockpit threshold
  const thresholdPt = new THREE.PointLight(0xfff4e0, 1.2, 18);
  thresholdPt.position.set(0, 2.8, -19);
  scene.add(thresholdPt);

  // (engineering.ts stray reactor glow = light #8 — counted in ship total)

  // 9. Cargo bay — warm-neutral (#FFF0D8), Y=4.2 to reach the 5H ceiling (+3 of budget 3)
  const cargoPt = new THREE.PointLight(0xfff0d8, 1.6, 16);
  cargoPt.position.set(0, 4.2, 13.5);
  scene.add(cargoPt);

  // Door tick via self-animating dummy (same pattern as reactor)
  let lastDoorTime = performance.now();
  const doorDummy = new THREE.Mesh(
    new THREE.PlaneGeometry(0.001, 0.001),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  doorDummy.position.set(0, 0, 0);
  doorDummy.onBeforeRender = (): void => {
    const now = performance.now();
    const dt  = Math.min((now - lastDoorTime) / 1000, 0.05);
    lastDoorTime = now;
    tickDoors(dt);
  };
  scene.add(doorDummy);

  // Ambient fill
  const ambient = new THREE.AmbientLight(0xffffff, 0.20);
  scene.add(ambient);

  return { groups, colliders: allColliders, interactables: allInteractables, planet, starfield };
}
