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
import { QUALITY_HIGH } from '../core/perf.js';
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

/**
 * QUALITY_HIGH-only: turn a PointLight into a soft shadow caster.
 * 1024² map, near 0.1 / far 12 (room scale). No-op when quality is default.
 */
function configureShadowCaster(light: THREE.PointLight): void {
  if (!QUALITY_HIGH) return;
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 12;
}

/**
 * QUALITY_HIGH-only: flag every mesh under the room groups to cast + receive
 * shadows. Cheap to set; only costs render time when shadowMap is enabled, which
 * is itself gated on QUALITY_HIGH. No-op for the shipped/verify default.
 */
function enableMeshShadows(groups: THREE.Group[]): void {
  if (!QUALITY_HIGH) return;
  for (const g of groups) {
    g.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
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
  // Aimed level through the porthole centre (world ~6.5, 1.6, -16) so space fills
  // the frame rather than the hull wall above it.
  registerCam(
    'porthole-space',
    new THREE.Vector3(5.8, 1.6, -16.0),
    new THREE.Vector3(20, 1.6, -16.0),
  );

  // ── Lighting ─────────────────────────────────────────────────────────────
  // v0.5 Stage 2 (lighting mood) — DARK / POOLED / CINEMATIC.
  // Reference: a corridor that is mostly shadow with warm light POOLS under
  // ceiling fixtures, emissive accents punching through, glossy floor catching
  // each pool. The big move is cutting the global fill HARD and tightening every
  // PointLight into a discrete pool with real falloff (decay=2, short distance).
  //
  // Ship total: 10 PointLights (HARD CAP — unchanged count)
  //   1 cockpit (under-console teal uplight)  5 galley
  //   2 quarters-junction (corridor pool A)   6 engineering reactor (red-orange)
  //   3 quarters port                         7 corridor threshold (pool B, fore)
  //   3b quarters starboard                   9 cargo bay
  //   4 corridor mid (pool C, aft)            + engineering.ts stray (#8)
  //
  // Pool palette: warm tungsten 0xffe2c0 for ceiling fixtures; reactor red-orange;
  // cockpit under-console cool teal so the console screens own the room.
  // decay=2 (physical inverse-square) makes pools fall off fast → shadow between.

  const WARM = 0xffe2c0; // tungsten ceiling-pool colour

  // Global fill — cut ~73% (hemi 0.45→0.12) / ~75% (ambient 0.20→0.05).
  // Ground hemisphere colour darkened/cooled so floors don't get a free lift.
  const hemi = new THREE.HemisphereLight(0xffe9d0, 0x10121c, 0.12);
  scene.add(hemi);

  // 1. Cockpit — console-WASH teal light. Sits in open cabin air just aft of and
  //    above the console bank so it grazes the console face + pilot seats with a
  //    cool glow without embedding in geometry (embedded + decay=2 → bloom blowout).
  //    Dim so the emissive console screens (toneMapped=false) own the room. (ref-05)
  const cockpitPt = new THREE.PointLight(0x5fcfe0, 1.4, 3.4, 2);
  cockpitPt.position.set(0, 1.25, -23.6);
  configureShadowCaster(cockpitPt);
  scene.add(cockpitPt);

  // 2. Quarters junction — CORRIDOR POOL A (aft of the cockpit door, ~Z=-16).
  //    Tight pool: this is the bright spot where the two quarters doors meet.
  const junctionPt = new THREE.PointLight(WARM, 5.0, 7.0, 2);
  junctionPt.position.set(0, 2.5, -16);
  scene.add(junctionPt);

  // 3a. Dedicated quarters port — intimate, tucked low so the bunk side glows
  //     and the far corners fall into shadow (moody crew bunk, not a lit cell).
  const qPortPt = new THREE.PointLight(WARM, 2.0, 4.4, 2);
  qPortPt.position.set(-4, 2.2, -16);
  scene.add(qPortPt);

  // 3b. Dedicated quarters starboard.
  const qStbdPt = new THREE.PointLight(WARM, 2.0, 4.4, 2);
  qStbdPt.position.set(4, 2.2, -16);
  scene.add(qStbdPt);

  // 4. Corridor mid — POOL C (aft end of the corridor, by the galley door ~Z=-8).
  const corridorPt = new THREE.PointLight(WARM, 4.6, 6.5, 2);
  corridorPt.position.set(0, 2.4, -8.5);
  scene.add(corridorPt);

  // 5. Galley — single warm ceiling pool over the counter run.
  const galleyPt = new THREE.PointLight(WARM, 4.6, 7.0, 2);
  galleyPt.position.set(0.5, 2.4, -1);
  scene.add(galleyPt);

  // 6. Engineering reactor (RED-ORANGE) — ANIMATED below via dummy mesh.
  //    Pulsing hot core mood; tight so the corners stay dark around the column.
  const reactorPt = new THREE.PointLight(0xff5a22, 5.2, 7.5, 2);
  reactorPt.position.set(0, 2.4, 5.5);
  configureShadowCaster(reactorPt);
  scene.add(reactorPt);

  // Animate reactor light via a tiny invisible plane's onBeforeRender
  // (self-animating pattern — no main.ts edit required)
  const reactorDummy = new THREE.Mesh(
    new THREE.PlaneGeometry(0.001, 0.001),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  reactorDummy.position.set(0, 2.4, 5.5);
  reactorDummy.onBeforeRender = (): void => {
    const t = performance.now() / 1000;
    reactorPt.intensity = 5.2 + Math.sin(t * 2.1) * 1.0;
  };
  scene.add(reactorDummy);

  // 7. Corridor threshold — POOL B (fore end, by the cockpit door ~Z=-19).
  //    Dimmer than A/C so the eye reads a bright-mid-dim rhythm down the hall.
  const thresholdPt = new THREE.PointLight(WARM, 3.0, 5.5, 2);
  thresholdPt.position.set(0, 2.4, -19);
  scene.add(thresholdPt);

  // (engineering.ts stray reactor glow = light #8 — counted in ship total)

  // 9. Cargo bay — single high warm pool (5H room), dark corners.
  const cargoPt = new THREE.PointLight(0xffe0c0, 6.0, 9.5, 2);
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

  // Ambient fill — cut hard (0.20 → 0.05). Just enough floor to keep deep
  // shadow legible (nothing pitch black) without flattening the pools.
  const ambient = new THREE.AmbientLight(0xfff0e0, 0.05);
  scene.add(ambient);

  // QUALITY_HIGH: flag room meshes to cast/receive shadows (no-op by default).
  enableMeshShadows(groups);

  return { groups, colliders: allColliders, interactables: allInteractables, planet, starfield };
}
