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
import { getState } from './state.js'; // v1.2.1 B6 — isSeated()
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
import { getLastTickGateForTest, type TickControllerGate } from '../player/controller.js'; // v1.2.1 B6
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
import { getLandfallChunkLod } from '../world/worlds/landfall.js'; // v1.2.1 B4

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
  /** v1.2.1 B1/B6 — core/state.ts's seated flag, for the real-landing suite:
   *  asserting this is false at WALK is direct evidence standUpInPlace()
   *  actually cleared it (getFlight() has no seated field — that state lives
   *  in core/state.ts, not flight/flightState.ts). */
  isSeated(): boolean;
  /** v1.2.1 B6 — which branch player/controller.ts's tickController() took
   *  THIS frame; see that file's own doc comment on why this exists (proves
   *  the `seated` early-out is gone even when the harness's own pointer-lock
   *  ceiling — 'not-locked' — is all a headless/headed CI run can reach). */
  getLastTickGate(): TickControllerGate;
  /** v1.2.1 B4 — resident chunk LOD (0=finest..2=coarsest) at world position
   *  (x,z), or null if nothing is resident there right now. */
  getLandfallChunkLodAt(x: number, z: number): number | null;
  /** v1.2.1 B4 — raycasts straight down through the ACTIVE world's rendered
   *  meshes at (x,z) and returns the hit Y, or null if nothing is hit.
   *  Compared against getGroundHeightAt()'s ANALYTIC height to catch the two
   *  drifting apart (chunks.ts's hysteresisLod() bug: a chunk could coarsen
   *  but never refine, so a resident LOD2 chunk under the player's feet
   *  rendered meters off the true terrain height on the mesa terraces). */
  getRenderedGroundHeightAt(x: number, z: number): number | null;
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
    isSeated(): boolean {
      return getState().seated;
    },
    getLastTickGate(): TickControllerGate {
      return getLastTickGateForTest();
    },
    getLandfallChunkLodAt(x: number, z: number): number | null {
      return getLandfallChunkLod(x, z);
    },
    getRenderedGroundHeightAt(x: number, z: number): number | null {
      // Filtered to chunks.ts's own 'landfall-chunk-<cx>-<cz>' mesh names:
      // an unfiltered intersectObjects() over the whole scene hits whatever
      // is UPPERMOST along the ray first — the sky dome / cloud shells sit
      // hundreds of meters up and shadow the actual terrain chunk underneath.
      const ray = new THREE.Raycaster(new THREE.Vector3(x, 2000, z), new THREE.Vector3(0, -1, 0));
      const hits = ray.intersectObjects(getActiveWorld().scene.children, true);
      const chunkHit = hits.find((h) => h.object.name.startsWith('landfall-chunk-'));
      return chunkHit ? chunkHit.point.y : null;
    },
  };
}
