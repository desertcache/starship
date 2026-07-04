/**
 * src/core/testApi.ts — window.__test functional-test hooks (verify contract).
 *
 * Extracted from main.ts in Stage D (v1.0 THRESHOLD) to respect the 300-line
 * cap. Everything here is harness-only: scripts/verify.mjs drives the game
 * through these hooks because PointerLock/mouse-look are unavailable headless.
 */
import * as THREE from 'three';
import { getState, setHunger, getQuestStep, getCodex } from './state.js';
import { headlessInteract, getActiveInteractablesForTest } from '../player/interact.js';
import { getFridgeStateForTest, resetFridgeForTest, questAdvanceViaBreaker } from '../world/interactItems.js';
import { questRevealAndReadPanel } from '../world/interactWiring.js';
import { isDoorOpen, forceDoorAutoCloseCheck } from '../world/doors.js';
import { getActiveWorldId, switchWorld } from './worlds.js';
import type { ScanData } from '../fx/space/types.js';

interface TestAPI {
  teleport(x: number, y: number, z: number): void;
  interact(): boolean;
  getState(): { clock: number; energy: number; hunger: number; clockString: string; questStep: number };
  getDoorOpen(id: string): boolean;
  getFridgeState(): { state: string; stock: number };
  resetFridge(): void;
  setHunger(v: number): void;
  getScan(): ScanData | null;
  forceDoorAutoCloseCheck(): string[];
  questRevealAndReadPanel(): number;
  questAdvanceViaBreaker(): number;
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
}

const EYE_HEIGHT_MAIN = 1.7;

/** Build and publish window.__test. Call once at boot (after assembleShip). */
export function installTestApi(deps: TestApiDeps): void {
  const { camera, scene } = deps;

  const testAPI: TestAPI = {
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
    getDoorOpen(id: string): boolean {
      return isDoorOpen(id);
    },
    getFridgeState(): { state: string; stock: number } {
      return getFridgeStateForTest();
    },
    resetFridge(): void {
      resetFridgeForTest();
    },
    setHunger(v: number): void {
      setHunger(v);
    },
    getScan(): ScanData | null {
      return deps.getScanData();
    },
    forceDoorAutoCloseCheck(): string[] {
      return forceDoorAutoCloseCheck();
    },
    questRevealAndReadPanel(): number {
      return questRevealAndReadPanel();
    },
    questAdvanceViaBreaker(): number {
      return questAdvanceViaBreaker();
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

  (window as unknown as Record<string, unknown>)['__test'] = testAPI;
}
