/**
 * src/core/worldBoot.ts — one-shot world-system wiring, extracted from main.ts.
 *
 * Builds the ship World adapter, installs the WorldManager + portal deps,
 * registers all worlds (ship first, then the dev-void proof world), publishes
 * window.__camNames AFTER registration (so dev cameras are captured by verify),
 * and applies the `?world=<id>` dev-spawn flag (else the corridor start cam).
 */

import * as THREE from 'three';
import type { World } from './worldTypes.js';
import type { BloomSystem } from '../fx/bloom.js';
import type { AABB, Interactable } from '../world/types.js';
import { getRegisteredCamNames, teleportToCamera } from './cameras.js';
import {
  initWorldManager, registerWorld, switchWorld,
  getWorldScene, getWorldSpawn, hasWorld,
} from './worlds.js';
import { configurePortals } from '../fx/portalSurface.js';
import { buildDevVoid } from '../world/worlds/devVoid.js';
import { getAnnexArrivalSpawn } from '../world/portalRoom.js';

export interface WorldBootDeps {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  bloom: BloomSystem;
  shipColliders: AABB[];
  shipInteractables: Interactable[];
}

export function bootWorlds(d: WorldBootDeps): void {
  // Ship-as-World adapter: groundHeight → 0, scene = main scene, cameras already
  // registered. update/dispose are no-ops (main drives ship ticks). Switching to
  // 'ship' resets interaction overrides to null → byte-for-byte ship behavior.
  //
  // v1.0 THRESHOLD: spawn moved from cargo bay (0,1.7,16) to the Dimensional
  // Annex arrival pad — this is where players land returning from any pocket
  // world (Stage A note). Single source of truth: portalRoom.getAnnexArrivalSpawn().
  const shipWorld: World = {
    id: 'ship',
    scene: d.scene,
    colliders: d.shipColliders,
    interactables: d.shipInteractables,
    cameras: [],
    spawn: getAnnexArrivalSpawn(),
    groundHeight: (): number => 0,
    update: (): void => { /* ship ticks run in the main loop */ },
    dispose: (): void => { /* ship is never disposed */ },
  };

  initWorldManager(d.camera, d.bloom);

  // Portal destination = an "arrival portal" transform from the target world's
  // spawn. Reused scratch (one live portal/frame, copied immediately downstream).
  const destUp = new THREE.Vector3(0, 1, 0);
  const destM = new THREE.Matrix4();
  configurePortals({
    renderer: d.renderer,
    getScene: (id: string): THREE.Scene | null => getWorldScene(id),
    getDestination: (id: string): THREE.Matrix4 | null => {
      const spawn = getWorldSpawn(id);
      if (!spawn) return null;
      destM.lookAt(spawn.position, spawn.lookAt, destUp);
      destM.setPosition(spawn.position);
      return destM;
    },
    requestSwitch: (target: string): void => { void switchWorld(target); },
  });

  registerWorld(shipWorld);
  registerWorld(buildDevVoid());

  const camNames = getRegisteredCamNames();
  (window as unknown as Record<string, unknown>)['__camNames'] = camNames;

  const worldParam = new URLSearchParams(window.location.search).get('world');
  if (worldParam && hasWorld(worldParam)) {
    void switchWorld(worldParam, { instant: true }); // spawn directly into the world
  } else {
    const startCam = camNames.includes('corridor') ? 'corridor' : camNames[0];
    if (startCam) {
      teleportToCamera(startCam);
    }
  }
}
