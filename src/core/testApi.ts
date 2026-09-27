/**
 * src/core/testApi.ts — window.__test functional-test hooks (verify contract).
 *
 * Extracted from main.ts in Stage D (v1.0 THRESHOLD) to respect the 300-line
 * cap. Everything here is harness-only: scripts/verify.mjs drives the game
 * through these hooks because PointerLock/mouse-look are unavailable headless.
 *
 * v1.2.1 Stage 0 (ultrareview hardening): split for the cap and for parallel
 * lanes. This file keeps the core hooks and publishes window.__test as the
 * merge of every hook group below; hook NAMES must stay unique across files.
 *   testApiFlight.ts   — flight / approach / landing hooks
 *   testRealPath.ts    — real-input-path helpers + contract sweeps
 *   testHooksShip.ts   — doors, fridge, quest shortcuts (ship-interior lane)
 *   testHooksWorlds.ts — pocket-world + space hooks (worlds lane)
 */
import * as THREE from 'three';
import { getState, setHunger, getQuestStep, getCodex } from './state.js';
import { headlessInteract, getActiveInteractablesForTest } from '../player/interact.js';
import { getActiveWorldId, switchWorld } from './worlds.js';
import type { ScanData } from '../fx/space/types.js';
import { buildFlightTestHooks } from './testApiFlight.js';
import { buildRealPathTestHooks } from './testRealPath.js';
import { buildShipTestHooks } from './testHooksShip.js';
import { buildWorldsTestHooks } from './testHooksWorlds.js';

interface CoreTestHooks {
  teleport(x: number, y: number, z: number): void;
  /** Headless interact: the current raycast target if any, else the nearest
   *  interactable within its radius. The distance fallback ignores the name
   *  contract the real E key depends on, so passing through this hook does
   *  NOT prove a player can interact (see testRealPath.ts). */
  interact(): boolean;
  getState(): { clock: number; energy: number; hunger: number; clockString: string; questStep: number };
  setHunger(v: number): void;
  getScan(): ScanData | null;
  getActiveWorld(): string;
  switchWorld(id: string): Promise<void>;
  getCodex(): { scans: string[]; relics: string[] };
  getPlayerPos(): { x: number; y: number; z: number };
  getActiveInteractables(): Array<{ id: string; x: number; y: number; z: number }>;
  getRelicSocketColor(worldId: string): { r: number; g: number; b: number } | null;
}

export interface TestApiDeps {
  camera: THREE.PerspectiveCamera;
  /** The SHIP scene (relic sockets live in the annex room group). */
  scene: THREE.Scene;
  getScanData(): ScanData | null;
  /** v1.1 SOVEREIGN Lane C: live body count (heroes+ambients). */
  getBodyCount(): number;
}

const EYE_HEIGHT_MAIN = 1.7;

function buildCoreTestHooks(deps: TestApiDeps): CoreTestHooks {
  const { camera, scene } = deps;
  return {
    teleport(x: number, y: number, z: number): void {
      camera.position.set(x, EYE_HEIGHT_MAIN, z);
      // Allow explicit Y override when y significantly differs from eye height
      if (Math.abs(y - EYE_HEIGHT_MAIN) > 0.5) camera.position.y = y;
      // Reset facing to a near-straight-down look. Without this, tickInteract's
      // center-screen raycast keeps whatever STALE orientation the camera had
      // before this teleport, and headlessInteract() prefers that raycast
      // target over its proximity fallback — so a teleport into a tight prop
      // cluster (e.g. the verdant hollow tree: relic + heartwood scan both in
      // range) can silently trigger the WRONG interactable if the inherited
      // facing grazes a nearby named mesh. Looking at the floor makes the ray
      // hit unnamed terrain/floor (no match) → every headless interact()
      // resolves via the intended proximity path. The +Z epsilon avoids the
      // lookAt() singularity at dead-straight-down (parallel to camera up).
      camera.lookAt(x, camera.position.y - 5, z + 0.01);
    },
    interact(): boolean {
      return headlessInteract();
    },
    getState(): { clock: number; energy: number; hunger: number; clockString: string; questStep: number } {
      const s = getState();
      return {
        clock: s.shipMinutes,
        energy: s.energy,
        hunger: s.hunger,
        clockString: `${String(Math.floor(s.shipMinutes / 60) % 24).padStart(2, '0')}:${String(Math.floor(s.shipMinutes) % 60).padStart(2, '0')}`,
        questStep: getQuestStep(),
      };
    },
    setHunger(v: number): void {
      setHunger(v);
    },
    getScan(): ScanData | null {
      return deps.getScanData();
    },
    getActiveWorld(): string {
      return getActiveWorldId();
    },
    switchWorld(id: string): Promise<void> {
      // Tests switch SYNCHRONOUSLY (no fade); resolves immediately.
      return switchWorld(id, { instant: true });
    },
    getCodex(): { scans: string[]; relics: string[] } {
      return getCodex();
    },
    getPlayerPos(): { x: number; y: number; z: number } {
      return { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    },
    getActiveInteractables(): Array<{ id: string; x: number; y: number; z: number }> {
      return getActiveInteractablesForTest();
    },
    getRelicSocketColor(worldId: string): { r: number; g: number; b: number } | null {
      const mesh = scene.getObjectByName(`relic-socket-${worldId}`) as THREE.Mesh | undefined;
      if (!mesh) return null;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      return { r: mat.color.r, g: mat.color.g, b: mat.color.b };
    },
  };
}

/** Build and publish window.__test. Call once at boot (after assembleShip). */
export function installTestApi(deps: TestApiDeps): void {
  const testAPI = {
    ...buildCoreTestHooks(deps),
    ...buildFlightTestHooks(deps),
    ...buildRealPathTestHooks(deps),
    ...buildShipTestHooks(deps),
    ...buildWorldsTestHooks(deps),
  };
  (window as unknown as Record<string, unknown>)['__test'] = testAPI;
}
