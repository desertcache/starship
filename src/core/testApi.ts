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
import {
  getFlight,
  setFlightInput,
  tickFlight,
  getFlowAxisRef,
  resetFlightForLoad,
  setFlightView as setFlightViewState,
  __testSetFlight,
} from '../flight/flightState.js'; // Stage 2: shims deleted, all hooks drive live flight state
import type { FlightInput, FlightSnapshot } from '../flight/types.js';
import { enterHelm, helmExitForTest } from '../flight/helm.js'; // Stage 2 (Lane B)
import {
  toggleApproachAssist,
  getApproachDebug,
  resetApproach,
  tickApproach,
  type ApproachDebugInfo,
} from '../flight/approach.js'; // v1.1 SOVEREIGN Stage 4 (Lane E)
import {
  requestLanding,
  getLandingDebug,
  resetLandfall,
  type LandingDebugInfo,
} from '../flight/landfall.js'; // v1.2 LANDFALL Stage 1 (contracts + seams)

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
  // v1.1 SOVEREIGN — flight model hooks (Stage 1 Lane A). Headless has no
  // pointer lock, so setFlightInput + flightTickN drive the model directly.
  getFlight(): FlightSnapshot;
  setFlightInput(partial: Partial<FlightInput>): void;
  flightTickN(n: number, dtMs: number): void;
  /** v1.1 SOVEREIGN Lane C (T12): live body count + flow axis + hero-sun
   *  bearing, for the universe-coherence rig-rotation test. */
  getUniverseInfo(): {
    bodyCount: number;
    flowDir: [number, number, number];
    sunBearing: [number, number, number];
  };
  /** T12: plant a 180° yaw attitude at the current speed. Post-repoint the
   *  flow is DERIVED, so it flips with the nose — physically correct. */
  shimYaw180(): void;
  /** T12: plant identity attitude at speed=|v| → flowW=(0,0,+|v|). Speeds
   *  above cruise max settle back toward it (throttle clamps at 1). */
  shimSetFlow(x: number, y: number, z: number): void;
  setFlightView(v: 'interior' | 'exterior'): void;
  getHullInfo(): { present: boolean; layer1: boolean; tris: number };
  /** Stage 2: full flight reset (attitude → identity, speed → boot cruise).
   *  Tests share ONE page, so anything that asserts against boot-state
   *  bearings/poses (T12, T13b) MUST call this first — T11 deliberately
   *  leaves a yawed attitude and elevated speed behind. */
  resetFlight(): void;
  /** v1.1 SOVEREIGN Stage 2 (Lane B) — helm enter/exit test hooks. Headless
   *  has no pointer lock, so these call enterHelm()/helmExitForTest()
   *  directly rather than raycasting the seat-port interactable or driving a
   *  real keypress (T13a exercises the real E-stand path separately). */
  helmEnter(): void;
  helmExit(): void;
  /** v1.1 SOVEREIGN Stage 4 (Lane E) — approach-assist test hooks. */
  engageApproach(): void;
  getApproachInfo(): ApproachDebugInfo | null;
  /** Deterministic fast-forward (mirrors flightTickN): ticks flight model +
   *  approach together each iteration, in main.ts's real per-frame order, so
   *  headless tests don't wait real wall-clock seconds for the assist's
   *  ~12s-normalized closure or the HOLD hysteresis to resolve. */
  approachTickN(n: number, dtMs: number): void;
  /** v1.2 LANDFALL Stage 1 — L-key landing request test hook. Declines
   *  (returns false) until Stage 2 registers the 'landfall' world. */
  engageLanding(): boolean;
  getLandingInfo(): LandingDebugInfo | null;
  /** Stage-1 skeleton (mirrors approachTickN's shape): ticks flight model
   *  only for now — Stage 3 adds the descent tick once it exists. */
  landingTickN(n: number, dtMs: number): void;
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
    getFlight(): FlightSnapshot {
      return getFlight();
    },
    setFlightInput(partial: Partial<FlightInput>): void {
      setFlightInput(partial);
    },
    flightTickN(n: number, dtMs: number): void {
      const dt = dtMs / 1000;
      for (let i = 0; i < n; i++) tickFlight(dt);
    },
    getUniverseInfo(): {
      bodyCount: number;
      flowDir: [number, number, number];
      sunBearing: [number, number, number];
    } {
      const axis = getFlowAxisRef();
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
      __testSetFlight(yaw180, getFlight().speed);
    },
    shimSetFlow(x: number, y: number, z: number): void {
      __testSetFlight(new THREE.Quaternion(), Math.hypot(x, y, z));
    },
    // v1.1 SOVEREIGN Stage 3 (Lane D) — exterior hull / chase-cam view hooks.
    setFlightView(v: 'interior' | 'exterior'): void {
      setFlightViewState(v);
    },
    resetFlight(): void {
      resetFlightForLoad();
      resetApproach();
      resetLandfall(); // v1.2 LANDFALL Stage 1
    },
    getHullInfo(): { present: boolean; layer1: boolean; tris: number } {
      const mesh = scene.getObjectByName('exterior-hull') as THREE.Mesh | undefined;
      const tris = mesh ? (mesh.geometry as THREE.BufferGeometry).attributes.position.count / 3 : 0;
      return {
        present: !!mesh,
        layer1: camera.layers.isEnabled(1),
        tris,
      };
    },
    helmEnter(): void {
      enterHelm();
    },
    helmExit(): void {
      helmExitForTest();
    },
    engageApproach(): void {
      toggleApproachAssist();
    },
    getApproachInfo(): ApproachDebugInfo | null {
      return getApproachDebug();
    },
    approachTickN(n: number, dtMs: number): void {
      const dt = dtMs / 1000;
      for (let i = 0; i < n; i++) {
        tickFlight(dt);
        tickApproach(dt);
      }
    },
    engageLanding(): boolean {
      return requestLanding();
    },
    getLandingInfo(): LandingDebugInfo | null {
      return getLandingDebug();
    },
    landingTickN(n: number, dtMs: number): void {
      const dt = dtMs / 1000;
      for (let i = 0; i < n; i++) {
        tickFlight(dt);
        // Stage 3 adds tickLandfall
      }
    },
  };

  (window as unknown as Record<string, unknown>)['__test'] = testAPI;
}
