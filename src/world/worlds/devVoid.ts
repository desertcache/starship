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

  // ── Creature-engine menagerie: one species per BodyPlan, distinct palettes,
  // separate spawn centers — all kept well clear of the portal at (0,-6) so
  // Test 9's proximity interact at (0,-5) can never be stolen by a wanderer
  // (nearest legged/floater roam edge ≥ ~7m; the glider passes overhead but
  // its altitude band keeps it beyond both raycast reach and scan radius).
  const menagerie = [
    spawnCreatures([{
      id: 'dev-grazer', scanName: 'DUNEGRAZER',
      lore: 'A placid herd-walker of the between.',
      plan: 'quadruped', sizeM: 1.4,
      palette: { primary: '#7a5c3e', secondary: '#d9a066', emissive: '#ffb84d' },
      gaitHz: 1.2, temperament: 'placid', count: 3, seed: 0x5151, roamRadius: 6,
    }], g, new THREE.Vector3(-9, 0, 4)),
    spawnCreatures([{
      id: 'dev-skitter', scanName: 'GLASSMITE',
      lore: 'Six legs, zero trust.',
      plan: 'skitterer', sizeM: 0.55,
      palette: { primary: '#3e4a52', secondary: '#9fd0c8', emissive: '#46e0d8' },
      gaitHz: 2.5, temperament: 'skittish', count: 3, seed: 0xa7a7, roamRadius: 4.5,
    }], g, new THREE.Vector3(10, 0, 2)),
    spawnCreatures([{
      id: 'dev-jelly', scanName: 'VOIDMEDUSA',
      lore: 'It breathes the dark and exhales light.',
      plan: 'floater', sizeM: 0.9,
      palette: { primary: '#3a6ea5', secondary: '#9fd0ff', emissive: '#7fd8ff' },
      gaitHz: 0.45, temperament: 'placid', count: 2, seed: 0x3c3c, roamRadius: 4,
    }], g, new THREE.Vector3(-11, 0, -4)),
    spawnCreatures([{
      id: 'dev-ray', scanName: 'ASHWING',
      lore: 'It writes figure-eights on the sky.',
      plan: 'glider', sizeM: 1.6,
      palette: { primary: '#5c3a66', secondary: '#c9a0dd', emissive: '#d98cff' },
      gaitHz: 0.4, temperament: 'curious', count: 1, seed: 0xe1e1, roamRadius: 8,
    }], g, new THREE.Vector3(6, 0, -6)),
  ];
  for (const m of menagerie) scene.add(m.group);

  const cameras: NamedCamera[] = [
    // Art hero — ~15m from the portal → dormant swirl (fully seeded/deterministic),
    // framing portal + monolith + the glider's figure-8.
    { name: 'dev-void', position: new THREE.Vector3(7, 1.7, 10), lookAt: new THREE.Vector3(0, 1.3, -3) },
    // QA — ~4m from the portal → exercises the live-preview tier (ship through the portal).
    { name: 'dev-void-qa', position: new THREE.Vector3(0, 1.7, -2), lookAt: new THREE.Vector3(0, 1.5, -6) },
    // Gait judging — side-on view of the quadruped herd (legs in profile).
    { name: 'dev-void-herd', position: new THREE.Vector3(-9, 1.2, 11), lookAt: new THREE.Vector3(-9, 0.7, 4) },
    // Menagerie 3/4 — skitterers foreground, glider figure-8 + portal beyond.
    { name: 'dev-void-menagerie', position: new THREE.Vector3(14, 4.5, 6), lookAt: new THREE.Vector3(2, 1.5, -5) },
  ];

  return {
    // 'dev' is deliberately outside the frozen WorldId union — see file header.
    id: 'dev' as WorldId,
    scene,
    colliders: [...terrain.boundaryColliders],
    interactables: [portal.interactable, monoIA, ...menagerie.flatMap((m) => m.interactables)],
    cameras,
    spawn: { position: new THREE.Vector3(0, 0, 8), lookAt: new THREE.Vector3(0, 1.4, -6) },
    groundHeight: g,
    update(dt: number, playerPos: THREE.Vector3): void {
      // Portals are ticked by main.tickPortals (needs camera); creatures here.
      for (const m of menagerie) m.update(dt, playerPos);
    },
    dispose(): void {
      terrain.mesh.geometry.dispose();
      (terrain.mesh.material as THREE.Material).dispose();
      rimGeo.dispose(); rimMat.dispose();
      padGeo.dispose(); padMat.dispose();
      monoGeo.dispose(); monoMat.dispose();
      portal.dispose();
      for (const m of menagerie) m.dispose();
      scene.remove(hemi, point);
    },
  };
}
