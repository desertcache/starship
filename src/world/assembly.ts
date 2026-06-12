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
import { QUALITY_LOW, SHADOWS_OFF } from '../core/perf.js';
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
 * Configure a SpotLight as a downward shadow-casting pool light.
 * ONE shadow face (vs PointLight's 6) = 6× fewer shadow draw calls.
 * No-op when ?quality=low or ?shadows=0.
 * bias/normalBias prevent self-shadow acne on props. near/far tightened to the
 * actual room depth so the shadow frustum doesn't span empty space.
 */
function configureSpotShadow(light: THREE.SpotLight): void {
  if (QUALITY_LOW || SHADOWS_OFF) return;
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far  = 8;
  light.shadow.bias        = -0.0003;
  light.shadow.normalBias  = 0.02;
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

  // ── Lighting ─────────────────────────────────────────────────────────────
  // v0.5 Stage 2 (lighting mood) — DARK / POOLED / CINEMATIC.
  // v0.6 P2: console teal PointLight added as hero focal anchor (ref-05 gap).
  //          Orchestrator-approved cap raised to 11 for this hero light.
  // Reference: a corridor that is mostly shadow with warm light POOLS under
  // ceiling fixtures, emissive accents punching through, glossy floor catching
  // each pool. The big move is cutting the global fill HARD and tightening every
  // PointLight into a discrete pool with real falloff (decay=2, short distance).
  //
  // Ship total: 11 PointLights (cap amended to 11 — console teal hero)
  //   1  cockpit old uplight (removed — replaced by hero teal below)
  //   1h cockpit console HERO teal (0x46E0D8, intensity 2.5, dist 1.2) ← new
  //   2  quarters-junction (corridor pool A)   6 engineering reactor (red-orange)
  //   3  quarters port                         7 corridor threshold (pool B, fore)
  //   3b quarters starboard                    9 cargo bay
  //   4  corridor mid (pool C, aft)            + engineering.ts stray (#8)
  //   5  galley
  //
  // Pool palette: warm tungsten 0xffe2c0 for ceiling fixtures; reactor red-orange;
  // cockpit console hero teal 0x46E0D8 so console is the brightest in-world element.
  // decay=2 (physical inverse-square) makes pools fall off fast → shadow between.

  const WARM = 0xffe2c0; // tungsten ceiling-pool colour

  // Global fill — cut ~73% (hemi 0.45→0.12) / ~75% (ambient 0.20→0.05).
  // Ground hemisphere colour darkened/cooled so floors don't get a free lift.
  const hemi = new THREE.HemisphereLight(0xffe9d0, 0x10121c, 0.12);
  scene.add(hemi);

  // 1h. Cockpit HERO — teal console PointLight, positioned ~0.05 m proud of the
  //     console face to visibly wash the console top + forward bulkhead.
  //     v0.6 P2: color=0x46E0D8, intensity=2.5, distance=1.2, decay=2.
  //     (Orchestrator cap amended to 11 for this hero — see header comment.)
  // v0.6 P2 final: intensity 3.0, distance 1.5 for visible teal spill on console top.
  const cockpitPt = new THREE.PointLight(0x46E0D8, 3.0, 1.5, 2);
  // Console face is at local Z ≈ -2.48+0.55 = -1.93, world Z = -22.5 + -1.93 = -24.43
  // Move light ~0.05m proud: world Z ≈ -24.38, Y at screen height ≈ 1.15
  cockpitPt.position.set(0, 1.15, -24.38);
  scene.add(cockpitPt);

  // 2. Quarters junction — CORRIDOR POOL A: downward SpotLight at (0,2.5,-16).
  //    Replaces the shadow PointLight: angle=1.1 rad (~63°), penumbra=0.4, decay=2.
  //    ONE shadow face instead of 6 → saves 5 shadow draw passes vs PointLight.
  const junctionSpot = new THREE.SpotLight(WARM, 5.0, 8.0, 1.1, 0.4, 2);
  junctionSpot.position.set(0, 2.5, -16);
  junctionSpot.target.position.set(0, 0, -16); // aim straight down
  scene.add(junctionSpot);
  scene.add(junctionSpot.target);
  configureSpotShadow(junctionSpot);

  // 3a. Dedicated quarters port — intimate, tucked low so the bunk side glows
  //     and the far corners fall into shadow (moody crew bunk, not a lit cell).
  //     0xffd9b0: warmer amber-tungsten vs corridor WARM (0xffe2c0) — domestic/cozy
  //     identity. Intensity unchanged so overall level is unaffected.
  const qPortPt = new THREE.PointLight(0xffd9b0, 2.0, 4.4, 2);
  qPortPt.position.set(-4, 2.2, -16);
  scene.add(qPortPt);

  // 3b. Dedicated quarters starboard — same warmer tint for consistent bedroom identity.
  const qStbdPt = new THREE.PointLight(0xffd9b0, 2.0, 4.4, 2);
  qStbdPt.position.set(4, 2.2, -16);
  scene.add(qStbdPt);

  // 4. Corridor mid — POOL C (aft end of the corridor, by the galley door ~Z=-8).
  // v0.6 P1: intensity 4.6→3.2, distance 6.5→5.0 so pools don't overlap into a wash.
  const corridorPt = new THREE.PointLight(WARM, 3.2, 5.0, 2);
  corridorPt.position.set(0, 2.4, -8.5);
  scene.add(corridorPt);

  // 5. Galley — single warm ceiling pool over the counter run.
  // v0.6 P1: intensity 4.6→3.4 so wall bases fall to shadow.
  const galleyPt = new THREE.PointLight(WARM, 3.4, 7.0, 2);
  galleyPt.position.set(0.5, 2.4, -1);
  scene.add(galleyPt);

  // 6. Engineering reactor (RED-ORANGE) — downward SpotLight, animated.
  //    Replaced shadow PointLight with SpotLight: ONE shadow face not 6.
  //    angle=1.0 rad (~57°), penumbra=0.3 so the column gets crisp shadow ring.
  //    Position stays near-ceiling at Y=2.4 to cast downward on the column + rails.
  const reactorSpot = new THREE.SpotLight(0xff5a22, 5.2, 8.0, 1.0, 0.3, 2);
  reactorSpot.position.set(0, 2.4, 5.5);
  reactorSpot.target.position.set(0, 0, 5.5); // aim straight down
  scene.add(reactorSpot);
  scene.add(reactorSpot.target);
  configureSpotShadow(reactorSpot);

  // Animate reactor light intensity via a tiny invisible plane's onBeforeRender
  // (self-animating pattern — no main.ts edit required)
  const reactorDummy = new THREE.Mesh(
    new THREE.PlaneGeometry(0.001, 0.001),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  reactorDummy.position.set(0, 2.4, 5.5);
  reactorDummy.onBeforeRender = (): void => {
    const t = performance.now() / 1000;
    reactorSpot.intensity = 5.2 + Math.sin(t * 2.1) * 1.0;
  };
  scene.add(reactorDummy);

  // 7. Corridor threshold — POOL B (fore end, by the cockpit door ~Z=-19).
  // v0.6 P1: intensity 3.0→2.0, distance 5.5→5.0 — dimmer than A/C so the eye
  // reads a bright-dim-bright rhythm with shadow between pools.
  const thresholdPt = new THREE.PointLight(WARM, 2.0, 5.0, 2);
  thresholdPt.position.set(0, 2.4, -19);
  scene.add(thresholdPt);

  // (engineering.ts stray reactor glow = light #8 — counted in ship total)

  // 9. Cargo bay — single high pool (5H room), dark corners.
  // v0.6 P1: intensity 6.0→4.5 so wall bases fall to shadow.
  // Density pass: intensity 4.5→5.2 — new mid-floor crates and wall conduits absorb
  // extra light; nudge restores mid-bay brightness lost to added geometry.
  // 0xe8eef2: cool/neutral blue-white vs corridor tungsten — industrial/utilitarian
  // identity. Intensity unchanged; just the temperature shifts.
  const cargoPt = new THREE.PointLight(0xe8eef2, 5.2, 9.5, 2);
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

  // Default-on: flag room meshes to cast/receive shadows. No-op when ?quality=low.
  enableMeshShadows(groups);

  return { groups, colliders: allColliders, interactables: allInteractables, planet, starfield };
}
