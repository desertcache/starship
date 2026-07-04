/**
 * src/world/worlds/ashfall.ts — ASHFALL pocket world (Stage C, v1.0 THRESHOLD).
 *
 * A volcanic basalt expanse under an ash sky: a propagating emissive crack
 * network (T1 livingness), ember-rise atmosphere, obsidian shard formations, a
 * cooled lava flow hiding the world's relic, and two creature species (armored
 * beetles + ash-rays, stub bodies during this lane). Implements the frozen
 * World contract (core/worldTypes.ts). Fixed seed throughout — never
 * Math.random — so verify screenshots stay bit-for-bit deterministic.
 */
import * as THREE from 'three';
import type { World, CreatureSpec } from '../../core/worldTypes.js';
import type { NamedCamera } from '../../core/cameras.js';
import { buildTerrain } from '../../fx/terrain.js';
import { createReturnPortal } from '../../fx/portalSurface.js';
import { spawnCreatures } from '../../fx/creatures/index.js';
import { buildAshfallSky, ASH_HAZE_COLOR } from './ashfallSky.js';
import { ashfallBasaltMottle } from './ashfallTextures.js';
import { buildObsidianShards, buildBasaltColumns, buildSpawnPad } from './ashfallProps.js';
import { buildCooledFlowMound, buildFumaroleVents, FUMAROLE_POSITIONS } from './ashfallVolcanics.js';
import { buildCrackOverlay } from './ashfallCracks.js';
import { buildEmberField, buildSmokePlumes } from './ashfallAtmo.js';

const TERRAIN_SEED = 0xa5fa01;
const RADIUS = 60;
const MAX_HEIGHT = 4.2;
const EYE_HEIGHT = 1.7;

const SPAWN_X = 0;
const SPAWN_Z = 40;
// Portal sits beside the spawn sightline (not dead ahead) so the arrival vista
// keeps the sun + crack basin clear; plane stays unrotated → +Z faces arrival.
const PORTAL_X = 4.5;
const PORTAL_Z = 35;

const CREATURE_CENTER = new THREE.Vector3(0, 0, 0);

const CREATURE_SPECS: CreatureSpec[] = [
  {
    id: 'ashfall-beetle',
    scanName: 'EMBERBACK BEETLE',
    lore: 'An armored scavenger that grazes on cooling slag, seams glowing where heat still bleeds through its shell.',
    plan: 'skitterer',
    sizeM: 0.8,
    palette: { primary: '#3a3d42', secondary: '#5a5f66', emissive: '#ff5a1f' },
    gaitHz: 3.2,
    temperament: 'curious',
    count: 4,
    seed: 0xa5be17,
    roamRadius: 30,
  },
  {
    id: 'ashfall-ray',
    scanName: 'ASH-RAY',
    lore: 'A membrane-winged glider that rides thermal columns above the cracks, wingtips tracing faint ember light.',
    plan: 'glider',
    sizeM: 2.2,
    palette: { primary: '#1b1712', secondary: '#3a2e26', emissive: '#ff7a2a' },
    gaitHz: 0.5,
    temperament: 'placid',
    count: 2,
    seed: 0xa5fa12,
    roamRadius: 45,
  },
];

export function buildAshfall(): World {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(ASH_HAZE_COLOR);
  scene.fog = new THREE.Fog(ASH_HAZE_COLOR, 22, 76);

  // ── Terrain: dark basalt, dramatic relief, fixed seed ──────────────────────
  const terrain = buildTerrain({
    seed: TERRAIN_SEED,
    radius: RADIUS,
    maxHeight: MAX_HEIGHT,
    colorRamp: { low: '#0c0909', mid: '#2c211a', high: '#5a4433' },
    texture: ashfallBasaltMottle(),
  });
  scene.add(terrain.mesh);
  const g = terrain.groundHeight;

  // ── Sky: gradient dome + dim red sun + heat-shimmer boundary rim ──────────
  const sky = buildAshfallSky(RADIUS, g(0, 0));
  scene.add(sky.dome, sky.sun, sky.rim);

  // ── Lights: 1 hemi + 5 positional (≤6 positional budget) ───────────────────
  const hemi = new THREE.HemisphereLight(0x6b4a34, 0x0c0a08, 0.85);
  scene.add(hemi);

  const lights: THREE.PointLight[] = [];
  FUMAROLE_POSITIONS.forEach((v) => {
    const l = new THREE.PointLight(0xff5a1f, 20, 26, 2);
    l.position.set(v.x, g(v.x, v.z) + 3, v.z);
    scene.add(l);
    lights.push(l);
  });
  const spawnLight = new THREE.PointLight(0xffb37a, 14, 30, 2);
  spawnLight.position.set(SPAWN_X, g(SPAWN_X, SPAWN_Z) + 4, SPAWN_Z);
  scene.add(spawnLight);
  const relicLight = new THREE.PointLight(0xff5a1f, 9, 12, 2);
  relicLight.position.set(8, g(8, 19.5) + 2.5, 19.5);
  scene.add(relicLight);
  lights.push(spawnLight, relicLight);

  // ── Volcanics: crack overlay, fumaroles, cooled flow + relic ───────────────
  const crackOverlay = buildCrackOverlay(terrain, RADIUS, MAX_HEIGHT, FUMAROLE_POSITIONS);
  scene.add(crackOverlay.mesh);

  const fumaroles = buildFumaroleVents(g);
  scene.add(fumaroles.group);

  const mound = buildCooledFlowMound(g);
  scene.add(mound.group);

  // ── Props: obsidian shards, basalt columns, spawn pad ──────────────────────
  const shards = buildObsidianShards(g);
  scene.add(shards.mesh);

  const columns = buildBasaltColumns(g);
  scene.add(columns.mesh);

  const pad = buildSpawnPad(SPAWN_X, SPAWN_Z, g(SPAWN_X, SPAWN_Z));
  scene.add(pad.mesh);

  // ── Atmosphere: ember rise + smoke plumes ───────────────────────────────────
  const embers = buildEmberField(g, RADIUS, FUMAROLE_POSITIONS);
  scene.add(embers.points);
  const smoke = buildSmokePlumes(g);
  scene.add(smoke.points);

  // ── Return portal near spawn, +Z face toward the arriving player ──────────
  const portal = createReturnPortal(2.2, 2.8);
  portal.mesh.position.set(PORTAL_X, g(PORTAL_X, PORTAL_Z) + 1.5, PORTAL_Z);
  scene.add(portal.mesh);

  // ── Creatures: armored beetles + ash-rays (stub bodies during this lane) ──
  const creatures = spawnCreatures(CREATURE_SPECS, g, CREATURE_CENTER);
  scene.add(creatures.group);

  // ── Cameras (positions at eye height — __setCam snaps y to ground+1.7) ────
  const cameras: NamedCamera[] = [
    // Hero: spawn vista — crack basin sweeping foreground, shard silhouettes
    // left, cooled-flow mass center-right, red sun low right-of-center.
    {
      name: 'ashfall',
      position: new THREE.Vector3(16, g(16, 44) + EYE_HEIGHT, 44),
      lookAt: new THREE.Vector3(-8, g(-8, 8) + 2.5, 8),
    },
    // QA: cooled lava flow (relic gap glow) center + fumarole 0 at right.
    {
      name: 'ashfall-qa',
      position: new THREE.Vector3(17, g(17, 12) + EYE_HEIGHT, 12),
      lookAt: new THREE.Vector3(9, g(9, 21) + 2.0, 21),
    },
  ];

  let elapsed = 0;

  return {
    id: 'ashfall',
    scene,
    colliders: [
      ...terrain.boundaryColliders,
      ...shards.colliders,
      ...columns.colliders,
      ...mound.colliders,
    ],
    interactables: [
      portal.interactable,
      ...(mound.relicInteractable ? [mound.relicInteractable] : []),
      mound.scanInteractable,
      fumaroles.interactable,
      shards.interactable,
      columns.interactable,
      ...creatures.interactables,
    ],
    cameras,
    spawn: {
      // Basalt platform clearing, facing the red sun (azimuth ~10°W of -Z)
      // with the shard field silhouettes off to the left.
      position: new THREE.Vector3(SPAWN_X, g(SPAWN_X, SPAWN_Z) + EYE_HEIGHT, SPAWN_Z),
      lookAt: new THREE.Vector3(-6, g(-6, 10) + 3, 10),
    },
    groundHeight: g,
    update(dt: number, playerPos: THREE.Vector3): void {
      elapsed += dt;
      creatures.update(dt, playerPos);
      sky.update(elapsed);
    },
    dispose(): void {
      terrain.mesh.geometry.dispose();
      (terrain.mesh.material as THREE.Material).dispose();
      sky.dispose();
      crackOverlay.dispose();
      fumaroles.dispose();
      mound.dispose();
      shards.dispose();
      columns.dispose();
      pad.dispose();
      embers.dispose();
      smoke.dispose();
      portal.dispose();
      creatures.dispose();
      scene.remove(hemi, ...lights);
    },
  };
}
