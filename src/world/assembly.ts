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
import { wrapDirectorAsPlanetResult } from '../fx/planet.js';
import { createSpaceDirector } from '../fx/space/director.js';
import { QUALITY_LOW } from '../core/perf.js';
import { buildLightingRig } from '../fx/lightingRig.js';
import type { AABB, RoomModule, Interactable } from './types.js';
import type { PlanetResult } from '../fx/planet.js';

/** Returns true when a mesh should cast shadows based on its name chain. */
function shouldCastShadow(obj: THREE.Mesh): boolean {
  let node: THREE.Object3D | null = obj;
  while (node) {
    const n = node.name.toLowerCase();
    if (n.includes('seat') || n.includes('console') || n.includes('reactor') ||
        n.includes('crate') || n.includes('table') || n.includes('bench') ||
        n.includes('bunk') || n.includes('locker') || n.includes('catwalk') ||
        n.includes('lever') || n.includes('rail') || n.includes('pillar') ||
        n.includes('cabinet') || n.includes('nightstand')) {
      return true;
    }
    node = node.parent;
  }
  return false;
}

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

/**
 * Selective mesh shadow pass — props cast, structural surfaces only receive.
 * Previously: every mesh got castShadow=true → 1323 total draw calls.
 * Now: only named props cast → ~85% shadow draw reduction.
 * No-op when ?quality=low.
 */
function enableMeshShadows(groups: THREE.Group[]): void {
  if (QUALITY_LOW) return;
  for (const g of groups) {
    g.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      obj.receiveShadow = true;
      obj.castShadow = shouldCastShadow(obj);
    });
  }
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
    // (b) corridor → quarters-a at (-1.5, 0, -16), facing X
    // doorway frame plane is at X=-1.5 (corridor halfW=1.5); was -2.5 which placed
    // slabs 1m inside the quarters room instead of at the threshold.
    { id: 'corridor-quarters-a', position: new THREE.Vector3(-1.5, 0, -16), facing: 'X' },
    // (c) corridor → quarters-b at (1.5, 0, -16), facing X
    { id: 'corridor-quarters-b', position: new THREE.Vector3(1.5,  0, -16), facing: 'X' },
    // (d) corridor-aft → galley-fore at (0, 0, -7), facing Z
    { id: 'corridor-galley',     position: new THREE.Vector3(0,   0, -7),  facing: 'Z' },
    // (e) galley-aft → engineering-fore at (0, 0, -1), facing Z
    { id: 'galley-engineering',  position: new THREE.Vector3(0,   0, -1),  facing: 'Z' },
    // (f) engineering-aft → cargo at (0, 0, 9), facing Z
    { id: 'engineering-cargo',   position: new THREE.Vector3(0,   0, 9),   facing: 'Z' },
  ];

  buildDoors(scene, doorSpecs);

  // ── Space environment ──────────────────────────────────────────────────────
  // NEAR streaming starfield — driven by main's tickStarfield(ship.starfield).
  const starfield = buildStarfield();
  scene.add(starfield);

  // 'Living Cruise' encounter director — drives the WHOLE space system through
  // planet.tick(elapsed). Wrapped as a PlanetResult so the main.ts call site
  // (ship.planet.tick) is unchanged. director.group is added as planet.mesh.
  const director = createSpaceDirector(scene, { seed: 0x5747 });
  const planet = wrapDirectorAsPlanetResult(director);
  scene.add(planet.mesh);

  // Starboard-quarters porthole view onto the passing cruise (verify cross-flow).
  // v0.6 P4: camera moved to X=5.8 (was 3.0) — ~0.7m inside the outer wall face
  // (X=6.5, bezel outer radius ~0.44m) so the bezel fills ~80-90% of frame height
  // and space is clearly legible through the aperture.
  registerCam(
    'porthole-space',
    new THREE.Vector3(5.8, 1.6, -16.0),
    new THREE.Vector3(20, 1.6, -16.0),
  );

  // ── QA cameras (v0.8 glitch-kill) ────────────────────────────────────────
  // qa-doorway: frames the corridor→galley doorway header — a known artifact zone.
  registerCam(
    'qa-doorway',
    new THREE.Vector3(0, 1.7, -10),
    new THREE.Vector3(0, 2.6, -7),
  );
  // qa-porthole-oblique: grazing view of a corridor porthole — checks z-fight flicker.
  registerCam(
    'qa-porthole-oblique',
    new THREE.Vector3(0.8, 1.5, -10.8),
    new THREE.Vector3(-1.5, 1.45, -9),
  );
  // qa-jitter-a / qa-jitter-b: 2cm lateral pair — expose depth-tie flips between shots.
  registerCam(
    'qa-jitter-a',
    new THREE.Vector3(0, 1.6, -11),
    new THREE.Vector3(0, 1.9, -7),
  );
  registerCam(
    'qa-jitter-b',
    new THREE.Vector3(0.02, 1.6, -11),
    new THREE.Vector3(0, 1.9, -7),
  );

  // ── Lighting ──────────────────────────────────────────────────────────────
  // Stage C re-tune: extracted to src/fx/lightingRig.ts.
  // Lighting values tuned for new mid-cream (#C6BFAF) wall panels + glossier floors.
  buildLightingRig(scene);

  // ── Door tick via self-animating dummy ────────────────────────────────────
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

  // Default-on: flag room meshes to cast/receive shadows. No-op when ?quality=low.
  enableMeshShadows(groups);

  return { groups, colliders: allColliders, interactables: allInteractables, planet, starfield };
}
