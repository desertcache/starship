/**
 * src/flight/types.ts — FROZEN interfaces for v1.1 SOVEREIGN flight
 * (design doc §4). Stage 1 Lane A authors this file; NOBODY else edits it —
 * every downstream lane (HUD, consoles, tests, universeRig, chase cam,
 * approach) imports these types and treats them as a hard contract.
 *
 * Types only. The functions `getFlight` / `tickFlight` / `setFlightInput`
 * that share these signatures are IMPLEMENTED in `flightState.ts`, not here —
 * see that file for the actual exports.
 *
 * The universe consumes exactly two things per frame:
 * `rig.quaternion.copy(attitudeInverse)` and `flowW` — nothing in
 * `src/fx/space/` may import helm/input/camera code.
 *
 * v1.2 LANDFALL deliberate amendment (Stage 1, contracts + seams): FlightMode
 * gains 'LANDED' below. This is the one sanctioned exception to "NOBODY else
 * edits it" — LANDFALL's design explicitly extends the frozen v1.1 contract
 * rather than routing around it; every other field/shape here is unchanged.
 */
import type * as THREE from 'three';

export type FlightMode = 'CRUISE' | 'HELM' | 'BOOST' | 'APPROACH' | 'HOLD' | 'LANDED';

/** Every writer (mouse/keys/TestAPI) fills this; setFlightInput takes a Partial. */
export interface FlightInput {
  pitch: number; yaw: number; roll: number;   // -1..1
  throttleDelta: number;                      // W/S accumulation
  boost: boolean;
}

/** Read-only view for HUD/consoles/tests. Returned fresh — never a live ref. */
export interface FlightSnapshot {
  mode: FlightMode;
  speed: number; throttle: number;
  headingDeg: number; pitchDeg: number; bankDeg: number;
  attitude: THREE.Quaternion;           // S→W
  flowW: THREE.Vector3;                 // apparent universe velocity, world frame
  travelDir: THREE.Vector3;             // unit, never degenerate
  helmActive: boolean; view: 'interior' | 'exterior';
  approach: { targetName: string; trueDist: number; renderScale: number; holdEngaged: boolean } | null;
}
