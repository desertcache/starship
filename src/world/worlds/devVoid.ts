/**
 * src/world/worlds/devVoid.ts — THROWAWAY Stage A proof world.
 *
 * Proves the ENTIRE World spine end-to-end: terrain + analytic groundHeight,
 * a return portal (dormant swirl → live preview → traversal + discharge), one
 * stub creature (bob + scannable), one scannable feature, a spawn pad, and its
 * own scene/lights. Reachable via `?world=dev` and cameras dev-void /
 * dev-void-qa. Deleted in Stage D (Test 9 repoints at verdant).
 *
 * 'dev' is intentionally NOT a WorldId (the frozen union is the 4 real worlds),
 * so World.id is a localized cast here and NOWHERE else.
 */

import * as THREE from 'three';
import type { World, WorldId } from '../../core/worldTypes.js';
import type { NamedCamera } from '../../core/cameras.js';
import type { Interactable } from '../types.js';
import { buildTerrain } from '../../fx/terrain.js';
import { createReturnPortal } from '../../fx/portalSurface.js';
import { spawnCreatures } from '../../fx/creatures/index.js';
import { recordScan } from '../../core/state.js';
import { showRoomToast } from '../../ui/hud.js';

export function buildDevVoid(): World {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0d1a);
  scene.fog = new THREE.Fog(0x0b0d1a, 16, 52);

  // ── Terrain (near-flat disc; groundHeight ≈ 0 so eye ≈ 1.7 everywhere) ──
  const terrain = buildTerrain({
    seed: 0x0d3f,
    radius: 30,
    maxHeight: 0.12,
    segments: 72,
    colorRamp: { low: '#12303a', mid: '#1c4a52', high: '#2f6b6b' },
  });
  scene.add(terrain.mesh);
  const g = terrain.groundHeight;

  // ── Lights: 1 hemi + 1 point (within the pocket-world budget) ──
  const hemi = new THREE.HemisphereLight(0x7fd8ff, 0x0a0a12, 0.55);
  scene.add(hemi);
  const point = new THREE.PointLight(0x46e0d8, 45, 90, 2);
  point.position.set(0, 9, 0);
  scene.add(point);

  // ── Emissive rim ring (presents the disc boundary; fog hides the square) ──
  const rimGeo = new THREE.RingGeometry(29.4, 30, 96);
  const rimMat = new THREE.MeshBasicMaterial({
    color: 0x46e0d8, transparent: true, opacity: 0.5, side: THREE.DoubleSide, toneMapped: false,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = -Math.PI / 2;
  rim.position.y = g(0, 0) + 0.05;
  scene.add(rim);

  // ── Spawn pad ──
  const padGeo = new THREE.RingGeometry(0.85, 1.25, 40);
  const padMat = new THREE.MeshBasicMaterial({
    color: 0x46e0d8, transparent: true, opacity: 0.6, side: THREE.DoubleSide, toneMapped: false,
  });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, g(0, 8) + 0.03, 8);
  scene.add(pad);

  // ── Return portal (faces +Z toward the spawn) ──
  const portal = createReturnPortal(2.2, 2.8);
  portal.mesh.position.set(0, g(0, -6) + 1.5, -6);
  scene.add(portal.mesh);

  // ── Scannable monolith feature ──
  const monoGeo = new THREE.BoxGeometry(0.6, 2.4, 0.6);
  const monoMat = new THREE.MeshStandardMaterial({
    color: 0x22323c, emissive: 0x46e0d8, emissiveIntensity: 0.5, roughness: 0.4, metalness: 0.1,
  });
  const mono = new THREE.Mesh(monoGeo, monoMat);
  mono.name = 'dev-monolith';
  mono.position.set(4, g(4, 0) + 1.2, 0);
  mono.castShadow = true;
  scene.add(mono);
  const monoIA: Interactable = {
    id: 'dev-monolith',
    prompt: 'Scan MONOLITH',
    radius: 2.6,
    position: mono.position.clone(),
    onInteract: (): void => {
      const fresh = recordScan('dev-monolith');
      showRoomToast(fresh ? 'CATALOGUED · MONOLITH' : 'KNOWN · MONOLITH');
    },
  };

  // ── Stub creature (1 species, herd of 3) ──
  const creatures = spawnCreatures(
    [{
      id: 'dev-wisp',
      scanName: 'VOIDWISP',
      lore: 'A drifting mote of the between.',
      plan: 'floater',
      sizeM: 0.9,
      palette: { primary: '#3a6ea5', secondary: '#9fd0ff', emissive: '#7fd8ff' },
      gaitHz: 0.4,
      temperament: 'placid',
      count: 3,
      seed: 0x5151,
      roamRadius: 8,
    }],
    g,
    new THREE.Vector3(0, 0, 0),
  );
  scene.add(creatures.group);

  const cameras: NamedCamera[] = [
    // Art hero — ~15m from the portal → dormant swirl (fully seeded/deterministic),
    // framing portal + monolith + wisps.
    { name: 'dev-void', position: new THREE.Vector3(7, 1.7, 10), lookAt: new THREE.Vector3(0, 1.3, -3) },
    // QA — ~4m from the portal → exercises the live-preview tier (ship through the portal).
    { name: 'dev-void-qa', position: new THREE.Vector3(0, 1.7, -2), lookAt: new THREE.Vector3(0, 1.5, -6) },
  ];

  return {
    // 'dev' is deliberately outside the frozen WorldId union — see file header.
    id: 'dev' as WorldId,
    scene,
    colliders: [...terrain.boundaryColliders],
    interactables: [portal.interactable, monoIA, ...creatures.interactables],
    cameras,
    spawn: { position: new THREE.Vector3(0, 0, 8), lookAt: new THREE.Vector3(0, 1.4, -6) },
    groundHeight: g,
    update(dt: number, playerPos: THREE.Vector3): void {
      // Portals are ticked by main.tickPortals (needs camera); creatures here.
      creatures.update(dt, playerPos);
    },
    dispose(): void {
      terrain.mesh.geometry.dispose();
      (terrain.mesh.material as THREE.Material).dispose();
      rimGeo.dispose(); rimMat.dispose();
      padGeo.dispose(); padMat.dispose();
      monoGeo.dispose(); monoMat.dispose();
      portal.dispose();
      creatures.dispose();
      scene.remove(hemi, point);
    },
  };
}
