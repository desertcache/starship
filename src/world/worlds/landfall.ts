/**
 * src/world/worlds/landfall.ts — the World orchestrator that turns Stage 1's
 * contracts into a real, walkable, streamed surface (Stage 2) with a real
 * descent cinematic + landed ship prop on top (Stage 3).
 *
 * Owns: the height field + biome preset, the chunk streaming manager, the far
 * shell, the sky/fog/lights, the roam boundary, and the scorched landing pad.
 * The descent cinematic (fx/landfall/descent.ts), cloud shells
 * (fx/landfall/clouds.ts), and the landed ship prop + hatch
 * (fx/landfall/shipSurface.ts) are attached once below and ticked from
 * update(). `?world=landfall` spawns straight onto the pad via the existing
 * worldBoot.ts dev-spawn path (no descent runs in that case — phase stays
 * 'NONE' — you arrive already standing).
 */
import * as THREE from 'three';
import type { World, WorldSpawn } from '../../core/worldTypes.js';
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
import { LANDFALL_SEED, ROAM_RADIUS, ROAM_WARN_RADIUS, DESCENT_CHUNK_BUDGET_MS } from '../../flight/landfallTuning.js';
import { attachDescent, getPhase, getSkidDeployProgress } from '../../fx/landfall/descent.js';
import { attachClouds } from '../../fx/landfall/clouds.js';
import { attachShip } from '../../fx/landfall/shipSurface.js';

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

  const spawn: WorldSpawn = {
    // SW of the pad, outside the ring, on the hull's sun-lit side (sun azimuth
    // 210°) — the walk-off reveal and ?world=landfall arrivals both frame the
    // lit hull instead of standing under its shadowed flank (orchestrator
    // loop-gate fix; y is clamped to ground+eye next frame).
    position: new THREE.Vector3(-19, 0, -19),
    lookAt: new THREE.Vector3(0, groundY + 3, 0),
  };

  // Stage 3 subsystems — descent cinematic, cloud shells, landed ship prop.
  const descent = attachDescent({ scene, biome, groundY, spawn, chunksResident: chunks.chunksResident });
  const clouds = attachClouds(scene, biome);
  const ship = attachShip(scene, groundY);
  boundaryColliders.push(...ship.colliders);

  // Stage 4: scatter (boulders/spires/shrubs) + weather (storm/rain/
  // lightning) + creatures (existing engine, called not modified). Resident
  // before the first frame, same belt-and-suspenders rationale as chunks'
  // own snapStream() call above (screenshot determinism — see chunks.ts).
  // Stage 5: weather's computed cloudCoverage is now wired into the cloud
  // shells (clouds.tick's `coverage` param, below) — the WEATHER_CLOUD_BUMP
  // consumer this NOTE used to flag as outstanding.
  const scatter = buildScatter(field, biome);
  scene.add(scatter.group);
  scatter.update(new THREE.Vector3(-19, 0, -19));

  const weather = attachWeather(scene, sky, biome);

  const creatures = spawnCreatures(biome.creatures, field.height, new THREE.Vector3(0, 0, 0));
  scene.add(creatures.group);

  const interactables: Interactable[] = [ship.hatch, ...creatures.interactables];

  let roamToastCooldown = 0;

  const cameras: NamedCamera[] = [
    // Hero: pulled back to a 3/4 angle on the parked ship (Stage 3) — the
    // original Stage-2 framing (18,*,14) sat only ~9m outside the pad edge,
    // nearly broadside to the 50m hull at close range (fills the frame with
    // an unreadable flank close-up once the ship exists). -X/-Z side (not
    // the mirror +X/+Z) deliberately: the sun (sky.ts sunAzimuthDeg=210)
    // sits toward -X/-Z, so shooting from that side lights the hull's near
    // face instead of silhouetting it against the sky.
    {
      name: 'landfall',
      position: new THREE.Vector3(-32, field.height(-32, -46) + 6, -46),
      lookAt: new THREE.Vector3(0, groundY + 2.5, 0),
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
    interactables,
    cameras,
    spawn,
    groundHeight: field.height,
    update(dt: number, playerPos: THREE.Vector3): void {
      const phase = getPhase();
      const descending = phase === 'ENTRY' || phase === 'BRAKE' || phase === 'TOUCHDOWN';

      // Descent owns the shared camera (position+orientation) first — chunks/
      // sky/clouds/scatter below all read the resulting playerPos this frame.
      descent.tick(dt, playerPos);
      chunks.update(playerPos, descending ? DESCENT_CHUNK_BUDGET_MS : undefined);
      // Dome follows the player's XZ (+Y too while descending — see sky.ts's
      // DOME_RADIUS note on why altitude needs the same treatment mid-descent).
      sky.dome.position.set(playerPos.x, descending ? playerPos.y : 0, playerPos.z);
      // Stage 5: weather's live cloudCoverage (base + storm/overcast bump,
      // WEATHER_CLOUD_BUMP) drives how many high shells stay resident once
      // walking (walkMode) — clouds.ts falls back to the biome base if omitted.
      clouds.tick(dt, playerPos, !descending, weather.cloudCoverage);
      ship.tick(dt, getSkidDeployProgress());
      // Stage 4: scatter/weather/creatures. Colliders are only re-pushed when
      // scatter.update() reports an actual chunk-crossing (see scatter.ts) —
      // boundaryColliders already carries the hull-footprint AABBs.
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
      clouds.dispose();
      ship.dispose();
      scatter.dispose();
      weather.dispose();
      creatures.dispose();
    },
  };
}
