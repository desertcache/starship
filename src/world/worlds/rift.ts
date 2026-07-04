/**
 * src/world/worlds/rift.ts — the RIFT pocket world (v1.0 THRESHOLD, Stage C).
 *
 * Floating crystal islands over an infinite starfield abyss. One main walkable
 * island (~45m across) + a reachable side island over a crystal bridge (the
 * relic lives there) + 3 slowly-drifting unreachable satellites. Prismatic
 * crystal flora pulses with neighbor-to-neighbor propagating waves (Livingness
 * T1 — see riftCrystals.ts for the phase math); spark motes drift around the
 * clusters; a gravity-defying LIGHTFALL pours upward on the eastern rim.
 *
 * Env handling matches devVoid: own scene.background + fog, no environment
 * map. Lights: 1 hemi + 4 points (budget ≤6 positional + 1 hemi). FIXED
 * seeds everywhere — never Math.random.
 */

import * as THREE from 'three';
import type { World } from '../../core/worldTypes.js';
import type { NamedCamera } from '../../core/cameras.js';
import { createReturnPortal } from '../../fx/portalSurface.js';
import { spawnCreatures } from '../../fx/creatures/index.js';
import { buildRiftSky } from './riftSky.js';
import { buildRiftIslands } from './riftIslands.js';
import { buildRiftCrystals } from './riftCrystals.js';
import { buildRiftFeatures, RIFT_LAYOUT } from './riftFeatures.js';
import { riftSparkSprite } from './riftTextures.js';

const CRYSTAL_SEED = 0x71C7;

export function buildRift(): World {
  const scene = new THREE.Scene();

  const sky = buildRiftSky(scene); // sets background + fog, adds stars/nebulae
  const islands = buildRiftIslands();
  scene.add(islands.group);
  const g = islands.groundHeight;

  const crystals = buildRiftCrystals(CRYSTAL_SEED, g);
  scene.add(crystals.mesh, crystals.motes);

  const features = buildRiftFeatures(g, riftSparkSprite(), crystals.biggest);
  scene.add(features.group);

  // ── Lights: dim violet hemi + 4 points (spawn, 2 clusters, relic) ────────
  const hemi = new THREE.HemisphereLight(0x8a6fd8, 0x241536, 0.7);
  const pChorus = new THREE.PointLight(0xb070ff, 50, 30, 2);
  pChorus.position.set(2, g(2, 5) + 2.2, 5);
  const pSpawn = new THREE.PointLight(0x5ae6ff, 30, 25, 2);
  pSpawn.position.set(RIFT_LAYOUT.spawn.x, g(RIFT_LAYOUT.spawn.x, RIFT_LAYOUT.spawn.z) + 3, RIFT_LAYOUT.spawn.z);
  const pRelic = new THREE.PointLight(0xd070ff, 55, 22, 2);
  pRelic.position.set(RIFT_LAYOUT.relic.x, g(RIFT_LAYOUT.relic.x, RIFT_LAYOUT.relic.z) + 2.5, RIFT_LAYOUT.relic.z);
  const pClusterB = new THREE.PointLight(0xff5adc, 30, 24, 2);
  pClusterB.position.set(12, g(12, -8) + 1.8, -8);
  // Below-and-between the islands: rakes the main underside's east faces and
  // the side island's west faces — what the qa camera actually looks at.
  const pUnder = new THREE.PointLight(0x7a4fd0, 70, 55, 2);
  pUnder.position.set(25, -8, 5);
  scene.add(hemi, pChorus, pSpawn, pRelic, pClusterB, pUnder);

  // ── Return portal near spawn, +Z facing the arrival dais ────────────────
  const portal = createReturnPortal(2.2, 2.8);
  const pp = RIFT_LAYOUT.portal;
  portal.mesh.position.set(pp.x, g(pp.x, pp.z) + 1.55, pp.z);
  portal.mesh.rotation.y = Math.atan2(RIFT_LAYOUT.spawn.x - pp.x, RIFT_LAYOUT.spawn.z - pp.z);
  scene.add(portal.mesh);

  // ── Creatures (Stage-A stub capsules; engine lane swaps internals) ──────
  const creatures = spawnCreatures(
    [
      {
        id: 'rift-jelly',
        scanName: 'VOIDBELL',
        lore: 'A placid jelly that mistakes starlight for water.',
        plan: 'floater',
        sizeM: 1.2,
        palette: { primary: '#8a6fe8', secondary: '#c8b8ff', emissive: '#5ae6ff' },
        gaitHz: 0.45,
        temperament: 'placid',
        count: 3,
        seed: 0x71A1,
        roamRadius: 30,
      },
      {
        id: 'rift-mite',
        scanName: 'SHARDLING',
        lore: 'A skittish gem-bodied mite that grazes on crystal resonance.',
        plan: 'skitterer',
        sizeM: 0.25,
        palette: { primary: '#b040d8', secondary: '#5ae6ff', emissive: '#ff5adc' },
        gaitHz: 2.2,
        temperament: 'skittish',
        count: 6,
        seed: 0x71A2,
        roamRadius: 20,
      },
    ],
    g,
    new THREE.Vector3(0, 0, 0),
  );
  scene.add(creatures.group);

  // ── Cameras (eye-height composed — controller clamps y to ground+1.7) ───
  const heroY = g(-19.5, -9.5) + 1.7;
  const qaY = g(26.5, 0) + 1.7; // eye clamps to bridge deck + 1.7
  const cameras: NamedCamera[] = [
    // Hero: spawn vista — PRISM CHORUS + bridge + side island + satellites
    // hanging in the alien starfield, abyss reading bottomless past the rim.
    { name: 'rift', position: new THREE.Vector3(-19.5, heroY, -9.5), lookAt: new THREE.Vector3(6, heroY + 1.4, 2) },
    // QA: standing mid-bridge looking east down the deck — rail crystals
    // converging on the side island, relic beacon on top, the island's rocky
    // underside cone + bottomless starfield below.
    { name: 'rift-qa', position: new THREE.Vector3(26.5, qaY, 0), lookAt: new THREE.Vector3(37.5, qaY - 1.6, 0.6) },
  ];

  return {
    id: 'rift',
    scene,
    colliders: [...islands.boundaryColliders],
    interactables: [portal.interactable, ...features.interactables, ...creatures.interactables],
    cameras,
    spawn: {
      position: new THREE.Vector3(RIFT_LAYOUT.spawn.x, g(RIFT_LAYOUT.spawn.x, RIFT_LAYOUT.spawn.z) + 1.7, RIFT_LAYOUT.spawn.z),
      lookAt: new THREE.Vector3(8, g(8, 1) + 1.2, 1), // facing the bridge + biggest cluster
    },
    groundHeight: g,
    update(dt: number, playerPos: THREE.Vector3): void {
      // Portal swirl/traversal is ticked by main.tickPortals (needs camera).
      creatures.update(dt, playerPos);
      islands.update(dt);   // satellite drift
      crystals.update(dt);  // propagating wave + mote uniforms
      features.update(dt);  // lightfall + relic hover/rotate
      sky.update(dt);       // star twinkle + nebula drift
    },
    dispose(): void {
      portal.dispose();
      creatures.dispose();
      features.dispose();
      crystals.dispose();
      islands.dispose();
      sky.dispose();
      scene.remove(hemi, pChorus, pSpawn, pRelic, pClusterB);
    },
  };
}
