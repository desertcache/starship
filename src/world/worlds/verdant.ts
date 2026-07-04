/**
 * src/world/worlds/verdant.ts — VERDANT: a bioluminescent alien glade at deep
 * dusk (v1.0 THRESHOLD, world lane). Implements the frozen World contract
 * (src/core/worldTypes.ts).
 *
 * Layout (all seeded — no Math.random anywhere in this world):
 *   spawn pad (0,26) facing -Z toward the glade's best vista: the hollow
 *   HEARTWOOD SENTINEL (-14,-8), glow-cap clusters, kelp fronds, two moons
 *   low over the -Z horizon. Return portal 4m behind-right of the pad, its
 *   +Z aimed at the pad (player sees the swirl on turning around).
 *
 * Env: like devVoid, this scene deliberately does NOT set scene.environment —
 * pocket worlds are lit purely by their own hemi + points + emissives (the
 * ship's PMREM RoomEnvironment belongs to the ship scene only).
 *
 * Livingness: every glow element (caps, frond tips, vine tips, relic, spring)
 * pulses via makeWaveGlowMesh with phase derived from distance-to-cluster-
 * center, so brightness ripples outward through each cluster — never uniform
 * blinking (design doc T1). Fireflies drift + flicker near flora. All of it
 * self-ticks via onBeforeRender (cheap, time-based) so live portal previews
 * from the ship animate for free.
 */
import * as THREE from 'three';
import type { World } from '../../core/worldTypes.js';
import type { NamedCamera } from '../../core/cameras.js';
import type { Interactable } from '../types.js';
import { buildTerrain } from '../../fx/terrain.js';
import { createReturnPortal } from '../../fx/portalSurface.js';
import { spawnCreatures } from '../../fx/creatures/index.js';
import { recordScan, collectRelic, getCodex } from '../../core/state.js';
import { showRoomToast } from '../../ui/hud.js';
import { buildVerdantSky } from './verdantSky.js';
import { buildMushroomClusters, buildFrondClusters } from './verdantFlora.js';
import { buildMineralSpring, buildFireflies } from './verdantLife.js';
import { buildVerdantTrees } from './verdantTrees.js';
import { verdantGroundDetailTexture, verdantRimGradientTexture } from './verdantTextures.js';

const TERRAIN_SEED = 0x7e4d;
const RADIUS = 60;

function scannable(
  id: string,
  scanName: string,
  position: THREE.Vector3,
): Interactable {
  return {
    id,
    prompt: `Scan ${scanName}`,
    radius: 3.0,
    position: position.clone(),
    onInteract: (): void => {
      const fresh = recordScan(id);
      showRoomToast(fresh ? `CATALOGUED · ${scanName}` : `KNOWN · ${scanName}`);
    },
  };
}

export function buildVerdant(): World {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1430); // violet-indigo fallback behind the dome
  // Teal ground fog. Color MATCHES the dome's horizon band (#1c4a46) so the
  // far terrain rim dissolves seamlessly into sky instead of silhouetting as
  // a jagged dark edge (art-gate round 1 fix).
  scene.fog = new THREE.Fog(0x1c4a46, 20, 80);

  // ── Terrain: gentle mossy hills ────────────────────────────────────────────
  const terrain = buildTerrain({
    seed: TERRAIN_SEED,
    radius: RADIUS,
    maxHeight: 3.0,
    segments: 96,
    colorRamp: { low: '#234a3c', mid: '#37684f', high: '#5e8f74' },
    texture: verdantGroundDetailTexture(),
  });
  scene.add(terrain.mesh);
  const g = terrain.groundHeight;

  // ── Sky: dusk dome + 2 moons ───────────────────────────────────────────────
  const sky = buildVerdantSky();
  scene.add(sky.group);

  // ── Lights: 1 hemi + 4 points (≤6 positional + 1 hemi budget) ─────────────
  const hemi = new THREE.HemisphereLight(0x7b68b8, 0x2a5c50, 0.8); // dusk violet / ground teal
  scene.add(hemi);
  const lights: THREE.PointLight[] = [
    new THREE.PointLight(0x46e0d8, 30, 24, 2),   // spawn pad
    new THREE.PointLight(0xa878ff, 26, 18, 2),   // inside the heartwood hollow
    new THREE.PointLight(0x66f2e2, 32, 26, 2),   // mushroom cluster nearest spawn
    new THREE.PointLight(0x9a7fe8, 26, 24, 2),   // frond cluster west
  ];
  lights[0].position.set(0, g(0, 26) + 3.0, 26);
  lights[1].position.set(-14, g(-14, -8) + 2.4, -8);
  lights[2].position.set(6, g(6, 10) + 2.2, 10);
  lights[3].position.set(-20, g(-20, 16) + 2.6, 16);
  for (const l of lights) scene.add(l);

  // ── Boundary: soft glow WALL at the terrain rail radius ───────────────────
  // A vertical gradient cylinder (bright at the ground, feathering to nothing
  // ~5m up) reads from eye height in a way a flat ring can't (art-gate round 1:
  // the edge-on ring was invisible). fog:false so the rim glows THROUGH the
  // mist instead of being swallowed at 60m.
  const rimGeo = new THREE.CylinderGeometry(RADIUS - 0.5, RADIUS - 0.5, 5, 96, 1, true);
  const rimMat = new THREE.MeshBasicMaterial({
    map: verdantRimGradientTexture(),
    color: 0x46e0d8, transparent: true, opacity: 0.5,
    side: THREE.BackSide, toneMapped: false, fog: false,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.y = 2.5; // spans y 0..5 — covers every hill height at the rail
  scene.add(rim);

  // ── Spawn pad: landing clearing at (0, 26), facing the vista ──────────────
  const padGeo = new THREE.RingGeometry(0.9, 1.3, 40);
  const padMat = new THREE.MeshBasicMaterial({
    color: 0x46e0d8, transparent: true, opacity: 0.6, side: THREE.DoubleSide, toneMapped: false,
  });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, g(0, 26) + 0.03, 26);
  scene.add(pad);

  // ── Return portal: near spawn, +Z facing the arrival pad ──────────────────
  const portal = createReturnPortal(2.2, 2.8);
  const portalY = g(5, 30) + 1.5;
  portal.mesh.position.set(5, portalY, 30);
  portal.mesh.lookAt(0, portalY, 26); // plane +Z → the player's arrival point
  scene.add(portal.mesh);

  // ── Flora ──────────────────────────────────────────────────────────────────
  const mushrooms = buildMushroomClusters(g);
  scene.add(mushrooms.group);
  const fronds = buildFrondClusters(g);
  scene.add(fronds.group);
  const trees = buildVerdantTrees(g);
  scene.add(trees.group);
  const spring = buildMineralSpring(22, 8, g);
  scene.add(spring.group);
  const fireflies = buildFireflies([
    ...mushrooms.fireflyCenters,
    ...fronds.fireflyCenters,
    ...trees.fireflyCenters,
  ]);
  scene.add(fireflies.points);

  // ── Scannables (4 non-creature) — mesh names MUST equal interactable ids
  // (interact.ts raycast resolves by walking ancestor .name chains) ──────────
  mushrooms.heroMesh.name = 'verdant-flora-1';
  const iaLumenCap = scannable('verdant-flora-1', 'LUMEN CAP', mushrooms.heroPosition);
  fronds.heroMesh.name = 'verdant-flora-2';
  const iaWhisperFrond = scannable('verdant-flora-2', 'WHISPER FROND', fronds.heroPosition);
  trees.heartwoodMesh.name = 'verdant-flora-3';
  const iaHeartwood = scannable('verdant-flora-3', 'HEARTWOOD SENTINEL', trees.heartwoodPosition);
  spring.group.name = 'verdant-flora-4';
  const iaSpring = scannable('verdant-flora-4', 'GLIMMER SPRING', spring.position);

  // ── Relic: glowing seed-pod inside the hollow heartwood ───────────────────
  // v1.0 THRESHOLD Stage D: after loadState() a previously-collected relic
  // must not be re-offered — hide the pod and drop its interactable from the
  // returned list (never even reaches the raycast/proximity systems).
  trees.relicMesh.name = 'verdant-relic';
  const verdantRelicHeld = getCodex().relics.includes('verdant');
  if (verdantRelicHeld) trees.relicMesh.visible = false;
  const iaRelic: Interactable = {
    id: 'verdant-relic',
    prompt: 'Take VERDANT SEED-POD',
    radius: 2.4,
    position: trees.relicPosition.clone(),
    state: { collected: false },
    onInteract: (): void => {
      const fresh = collectRelic('verdant');
      trees.relicMesh.visible = false;         // pod leaves the heartwood
      iaRelic.state!['collected'] = true;      // socket state for the annex holotable lane
      showRoomToast(fresh ? 'RELIC ACQUIRED · VERDANT SEED-POD' : 'RELIC ALREADY HELD');
    },
  };

  // ── Creatures (stub during lanes; real engine lands at merge) ─────────────
  const creatures = spawnCreatures(
    [
      {
        id: 'verdant-grazer',
        scanName: 'LOAMSTRIDER',
        lore: 'A placid herd-walker that combs the moss for mineral dew.',
        plan: 'quadruped',
        sizeM: 1.6,
        palette: { primary: '#7a8b85', secondary: '#4a5d57', emissive: '#a878ff' },
        gaitHz: 0.9,
        temperament: 'placid',
        count: 5,
        seed: 0x7c01,
        roamRadius: 35,
      },
      {
        id: 'verdant-skitterer',
        scanName: 'SPRIG SKITTERER',
        lore: 'A twig-legged mite that bolts between glow-caps when startled.',
        plan: 'skitterer',
        sizeM: 0.35,
        palette: { primary: '#5a7a4e', secondary: '#8fae6f', emissive: '#66f2e2' },
        gaitHz: 2.6,
        temperament: 'skittish',
        count: 6,
        seed: 0x7c02,
        roamRadius: 25,
      },
    ],
    g,
    new THREE.Vector3(0, 0, 0),
  );
  scene.add(creatures.group);

  // ── Cameras (registerWorld prefixes ownership; y snaps to ground + 1.7) ───
  const cameras: NamedCamera[] = [
    // Hero: from the spawn pad across the glade — terrain rolls, glow clusters,
    // heartwood silhouette, both moons over the -Z horizon.
    { name: 'verdant', position: new THREE.Vector3(0, 1.7, 26), lookAt: new THREE.Vector3(-10, 3.2, -18) },
    // QA: looks straight into the heartwood's doorway (relic glow inside)
    // with the (-11,-4.5) glow-cap cluster in the near-left foreground.
    { name: 'verdant-qa', position: new THREE.Vector3(-9.5, 1.7, 0.5), lookAt: new THREE.Vector3(-14, 1.3, -8) },
  ];

  return {
    id: 'verdant',
    scene,
    colliders: [...terrain.boundaryColliders, ...trees.colliders],
    interactables: [
      portal.interactable,
      ...(verdantRelicHeld ? [] : [iaRelic]),
      iaLumenCap, iaWhisperFrond, iaHeartwood, iaSpring,
      ...creatures.interactables,
    ],
    cameras,
    spawn: {
      position: new THREE.Vector3(0, 0, 26),
      lookAt: new THREE.Vector3(-10, 1.6, -8),
    },
    groundHeight: g,
    update(dt: number, playerPos: THREE.Vector3): void {
      // Portal swirl/preview ticked by main.tickPortals (needs the camera).
      creatures.update(dt, playerPos);
      fireflies.update(dt);
      sky.update(dt);
      // Flora wave glow self-ticks via each mesh's onBeforeRender.
    },
    dispose(): void {
      terrain.mesh.geometry.dispose();
      (terrain.mesh.material as THREE.Material).dispose();
      rimGeo.dispose(); rimMat.dispose();
      padGeo.dispose(); padMat.dispose();
      portal.dispose();
      mushrooms.dispose();
      fronds.dispose();
      trees.dispose();
      spring.dispose();
      fireflies.dispose();
      creatures.dispose();
      sky.dispose();
      scene.remove(hemi, ...lights);
    },
  };
}
