/**
 * src/world/worlds/landfall.ts — v1.2 LANDFALL Stage 2: the World orchestrator
 * that turns Stage 1's contracts into a real, walkable, streamed surface.
 *
 * Owns: the height field + biome preset, the chunk streaming manager, the far
 * shell, the sky/fog/lights, the roam boundary, and a placeholder scorched
 * landing pad (the ship prop itself lands in Stage 3 — see the update() seam
 * comments below). `?world=landfall` spawns straight onto this pad via the
 * existing worldBoot.ts dev-spawn path; no descent cinematic runs yet — you
 * arrive already standing.
 */
import * as THREE from 'three';
import type { World } from '../../core/worldTypes.js';
import type { NamedCamera } from '../../core/cameras.js';
import type { AABB, Interactable } from '../types.js';
import { makeHeightField } from '../../fx/landfall/heightField.js';
import { createChunkManager } from '../../fx/landfall/chunks.js';
import { buildFarShell } from '../../fx/landfall/farShell.js';
import { buildLandfallSky } from '../../fx/landfall/sky.js';
import { resolveBiome } from '../../fx/landfall/biomes.js';
import { buildScatter } from '../../fx/landfall/scatter.js';
import { attachWeather } from '../../fx/landfall/weather.js';
import { spawnCreatures } from '../../fx/creatures/index.js';
import { setActiveColliders } from '../../player/controller.js';
import { showRoomToast } from '../../ui/hud.js';
import { LANDFALL_SEED, ROAM_RADIUS, ROAM_WARN_RADIUS } from '../../flight/landfallTuning.js';

const BOUNDARY_SEGMENTS = 48;
const BOUNDARY_MIN_Y = -4;
const BOUNDARY_MAX_Y = 30;
const PAD_RADIUS = 14;
const ROAM_TOAST_COOLDOWN = 10; // seconds

/** Overlapping AABB ring at `radius` — same overlapping-chord shape as
 *  fx/terrain.ts's buildRing, scaled up (48 segments, taller boxes) for the
 *  much larger roam radius. Boxes span an ABSOLUTE y range that safely
 *  encloses the height field's entire possible output (0..maxHeight) at any
 *  angle, so the ring works regardless of local terrain relief there. */
function buildBoundaryRing(radius: number): AABB[] {
  const out: AABB[] = [];
  const chord = 2 * radius * Math.sin(Math.PI / BOUNDARY_SEGMENTS);
  const half = chord * 0.9; // > chord/2 — generous overlap, no gaps
  for (let i = 0; i < BOUNDARY_SEGMENTS; i++) {
    const a = (i / BOUNDARY_SEGMENTS) * Math.PI * 2;
    const cx = Math.cos(a) * radius;
    const cz = Math.sin(a) * radius;
    out.push({
      minX: cx - half, maxX: cx + half,
      minY: BOUNDARY_MIN_Y, maxY: BOUNDARY_MAX_Y,
      minZ: cz - half, maxZ: cz + half,
    });
  }
  return out;
}

interface LandingPad {
  group: THREE.Group;
  dispose(): void;
}

/** Flat scorched disc + a glowing ring accent at the origin — the pad the
 *  future ship (Stage 3) will occupy. Sits exactly at groundY (inside
 *  PAD_FLAT_INNER, the height field is flat there by construction). */
function buildLandingPad(groundY: number, accentColor: string): LandingPad {
  const group = new THREE.Group();
  group.name = 'landfall-pad';

  const discGeo = new THREE.CircleGeometry(PAD_RADIUS, 48);
  discGeo.rotateX(-Math.PI / 2);
  const discMat = new THREE.MeshStandardMaterial({ color: '#2a2420', roughness: 0.95, metalness: 0.05 });
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.position.y = groundY + 0.02;
  group.add(disc);

  const ringGeo = new THREE.RingGeometry(PAD_RADIUS - 0.6, PAD_RADIUS + 0.2, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: accentColor, transparent: true, opacity: 0.55, side: THREE.DoubleSide, toneMapped: false,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = groundY + 0.03;
  group.add(ring);

  return {
    group,
    dispose(): void {
      discGeo.dispose(); discMat.dispose();
      ringGeo.dispose(); ringMat.dispose();
    },
  };
}

export function buildLandfall(): World {
  const scene = new THREE.Scene();
  const biome = resolveBiome('ROCKY');

  const sky = buildLandfallSky(scene, biome);

  const field = makeHeightField(LANDFALL_SEED, biome.terrain);
  const chunks = createChunkManager(scene, field, biome);
  // Force the pad + spawn neighbourhood fully resident before the first
  // frame ever renders — belt-and-suspenders on top of update()'s own
  // first-tick snapStream (see chunks.ts header for why the full-ring sync
  // matters for screenshot determinism).
  chunks.snapStream(new THREE.Vector3(12, 0, 0));

  const shell = buildFarShell(field, biome.terrain.colorRamp);
  scene.add(shell.mesh);

  const groundY = field.height(0, 0);
  const pad = buildLandingPad(groundY, biome.entry.glowColor);
  scene.add(pad.group);

  const boundaryColliders = buildBoundaryRing(ROAM_RADIUS);

  // Stage 4: scatter (boulders/spires/shrubs) + weather (storm/rain/
  // lightning) + creatures (existing engine, called not modified). Resident
  // before the first frame, same belt-and-suspenders rationale as chunks'
  // own snapStream() call above (screenshot determinism — see chunks.ts).
  const scatter = buildScatter(field, biome);
  scene.add(scatter.group);
  scatter.update(new THREE.Vector3(12, 0, 0));

  const weather = attachWeather(scene, sky, biome);

  const creatures = spawnCreatures(biome.creatures, field.height, new THREE.Vector3(0, 0, 0));
  scene.add(creatures.group);

  let roamToastCooldown = 0;

  const cameras: NamedCamera[] = [
    // Hero: near the pad looking across it toward the rolling terrain and
    // the horizon dissolving into the dome.
    {
      name: 'landfall',
      position: new THREE.Vector3(18, field.height(18, 14) + 2.2, 14),
      lookAt: new THREE.Vector3(-70, field.height(-70, -50) + 6, -50),
    },
    // QA: 300m+ from spawn, proving snapStream resolved the far ring before
    // this shot — looking further out, toward the horizon.
    {
      name: 'landfall-qa',
      position: new THREE.Vector3(290, field.height(290, 260) + 3, 260),
      lookAt: new THREE.Vector3(470, field.height(290, 260) - 15, 400),
    },
    // Ground-level vista back across the pad valley. NOTE (probe-verified):
    // a REGISTERED elevated camera is impossible in a walk world — the
    // controller's eye clamp re-grounds camera.y the very next frame, so the
    // earlier 400m/180m "altitude shot" was actually staring into dirt from
    // 1.7m. Stage 3's descent driver owns the camera per-frame and can hold
    // real altitude; it re-seeds this name then.
    {
      name: 'landfall-descent',
      position: new THREE.Vector3(110, field.height(110, -30) + 2.0, -30),
      lookAt: new THREE.Vector3(0, field.height(0, 0) + 2, 0),
    },
  ];

  return {
    id: 'landfall',
    scene,
    colliders: [...boundaryColliders, ...scatter.colliders()],
    interactables: [...creatures.interactables] as Interactable[], // Stage 3 adds the ship hatch
    cameras,
    spawn: {
      position: new THREE.Vector3(12, 0, 0),
      lookAt: new THREE.Vector3(0, 2, 0),
    },
    groundHeight: field.height,
    update(dt: number, playerPos: THREE.Vector3): void {
      chunks.update(playerPos);
      // Dome follows the player's XZ — keeps its far side inside the camera
      // far plane across the whole roam (see sky.ts DOME_RADIUS note).
      sky.dome.position.set(playerPos.x, 0, playerPos.z);
      // Stage 3 seam: attachDescent()/attachShip() hook into this tick once
      // the descent cinematic + the landed ship prop exist.
      // Stage 4: scatter/weather/creatures. Colliders are only re-pushed when
      // scatter.update() reports an actual chunk-crossing (see scatter.ts).
      if (scatter.update(playerPos)) {
        setActiveColliders([...boundaryColliders, ...scatter.colliders()]);
      }
      weather.update(dt, playerPos);
      creatures.update(dt, playerPos);

      const distXZ = Math.hypot(playerPos.x, playerPos.z);
      roamToastCooldown = Math.max(0, roamToastCooldown - dt);
      if (distXZ > ROAM_WARN_RADIUS && roamToastCooldown <= 0) {
        showRoomToast('ATMOSPHERIC INTERFERENCE — RETURN TO SHIP');
        roamToastCooldown = ROAM_TOAST_COOLDOWN;
      }
    },
    dispose(): void {
      chunks.dispose();
      shell.dispose();
      pad.dispose();
      sky.dispose();
      scatter.dispose();
      weather.dispose();
      creatures.dispose();
    },
  };
}
