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
import { getFlowAxis, getFlowW, __shimSet } from '../flight/flightShim.js'; // LANE-C SHIM — replaced by flightState at merge

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
  /** v1.1 SOVEREIGN Lane C (T12): live body count + flow axis + hero-sun
   *  bearing, for the universe-coherence rig-rotation test. */
  getUniverseInfo(): {
    bodyCount: number;
    flowDir: [number, number, number];
    sunBearing: [number, number, number];
  };
  /** T12: __shimSet's a 180° yaw quaternion, preserving current flowW. */
  shimYaw180(): void;
  /** T12: __shimSet's identity attitude + an elevated flowW (0,0,z-ish),
   *  for the fast-flight despawn-bound check. */
  shimSetFlow(x: number, y: number, z: number): void;
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
    getUniverseInfo(): {
      bodyCount: number;
      flowDir: [number, number, number];
      sunBearing: [number, number, number];
    } {
      const axis = getFlowAxis();
      const sunObj = scene.getObjectByName('hero-sun');
      const bearing = new THREE.Vector3();
      if (sunObj) {
        sunObj.getWorldPosition(bearing);
        if (bearing.lengthSq() > 1e-8) bearing.normalize();
      }
      return {
        bodyCount: deps.getBodyCount(),
        flowDir: [axis.x, axis.y, axis.z],
        sunBearing: [bearing.x, bearing.y, bearing.z],
      };
    },
    shimYaw180(): void {
      const yaw180 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
      __shimSet(yaw180, getFlowW());
    },
    shimSetFlow(x: number, y: number, z: number): void {
      __shimSet(new THREE.Quaternion(), new THREE.Vector3(x, y, z));
    },
  };

  (window as unknown as Record<string, unknown>)['__test'] = testAPI;
}
