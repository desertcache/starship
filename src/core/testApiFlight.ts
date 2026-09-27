/**
 * src/core/testApiFlight.ts — flight / approach / landing hooks of the
 * window.__test verify contract (split from testApi.ts in v1.2.1 Stage 0 for
 * the 300-line cap; hook names and behavior are unchanged).
 *
 * Headless has no pointer lock, so these drive the flight model, approach
 * assist and landing descent directly. Real-input coverage lives in the
 * v1.2.1 real-path suites (scripts/tests/*.mjs) — these hooks do NOT prove a
 * player can reach the same state.
 */
import * as THREE from 'three';
import type { TestApiDeps } from './testApi.js';
import { getActiveWorldId, getActiveWorld } from './worlds.js';
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

export interface FlightTestHooks {
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
  /** v1.1 SOVEREIGN Stage 2 (Lane B) — helm enter/exit test hooks. These call
   *  enterHelm()/helmExitForTest() directly rather than raycasting the
   *  seat-port interactable or driving a real keypress (T13a exercises the
   *  real E-stand path separately). */
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
  /** v1.2 LANDFALL Stage 1 — landing request hook. NOTE: lands WITHOUT the
   *  helm (the v1.2 seated-after-landing bug hid behind exactly this). */
  engageLanding(): boolean;
  getLandingInfo(): LandingDebugInfo | null;
  /** v1.2 LANDFALL Stage 5 — mirrors main.ts's per-frame gate: while
   *  'landfall' is active this calls the SAME World.update() animate() calls
   *  every real frame (descent/chunks/sky/clouds/ship/scatter/weather/
   *  creatures), so a headless caller can fast-forward ENTRY→BRAKE→
   *  TOUCHDOWN→WALK deterministically. The 'ship' branch ticks flight only. */
  landingTickN(n: number, dtMs: number): void;
  /** v1.2 LANDFALL Stage 5 — analytic ground height at world (x,z) from the
   *  ACTIVE world's own `groundHeight` (the descent's pad-constant groundY
   *  diverges from the true local height inside the pad flatten-blend ring). */
  getGroundHeightAt(x: number, z: number): number;
}

export function buildFlightTestHooks(deps: TestApiDeps): FlightTestHooks {
  const { camera, scene } = deps;
  return {
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
        if (getActiveWorldId() === 'ship') {
          tickFlight(dt);
        } else {
          // Stage 5: the landfall world's own per-frame update — same call
          // main.ts's animate() makes while off-ship (activeWorld.update()).
          getActiveWorld().update(dt, camera.position);
        }
      }
    },
    getGroundHeightAt(x: number, z: number): number {
      return getActiveWorld().groundHeight(x, z);
    },
  };
}
