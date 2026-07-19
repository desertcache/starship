/**
 * src/flight/landfall.ts — v1.2 LANDFALL Stage 3: the L-key request path,
 * wired to a real descent + a real return-to-orbit.
 *
 * Thin orchestrator over fx/landfall/descent.ts, which owns the actual phase
 * machine/camera drive (module singleton, one-way dependency — this file
 * never gets imported back by descent.ts, so there's no cycle). requestLanding()
 * fades, switches worlds (no teleport — the camera keeps whatever pose HOLD
 * left it at, since armDescent() immediately re-seeds it to the ENTRY start
 * pose during the SAME fade-black hold), and arms the descent. takeOff()
 * (fx/landfall/shipSurface.ts's hatch interactable) does the mirror trip back
 * to the ship's cargo bay. Nothing here writes flight mode on takeoff —
 * approach.ts's tickApproach() REASSERTS HOLD automatically once ship-frame
 * ticks resume (holdEngaged never got touched by any of this).
 */
import * as THREE from 'three';
import { getFlight, setFlightMode } from './flightState.js';
import { hasWorld, switchWorld } from '../core/worlds.js';
import { fadeTransition } from '../ui/hud.js';
import { registerCam, teleportToCamera } from '../core/cameras.js';
import {
  armDescent, resetDescent, getPhase, getAltitude, getPadDist, getChunksResident,
  type DescentPhase,
} from '../fx/landfall/descent.js';

export type { DescentPhase };

const SHIP_REBOARD_CAM = 'ship-reboard';
const CARGO_BAY_POS = new THREE.Vector3(0, 1.7, 16);
const CARGO_BAY_LOOK = new THREE.Vector3(0, 1.7, 15); // facing -Z

/** testApi.getLandingInfo() shape — richer than FlightSnapshot needs, same
 *  "debug info" precedent as approach.ts's ApproachDebugInfo. */
export interface LandingDebugInfo {
  phase: DescentPhase;
  altitude: number;
  padDist: number;
  chunksResident: number;
  weather: string;
}

/** L keybind (helmInput.ts) + testApi.engageLanding(): request descent.
 *  Guard: must be at HOLD (getFlight().approach.holdEngaged) AND the
 *  'landfall' world must be registered — both true since Stage 2. */
export function requestLanding(): boolean {
  const atHold = getFlight().approach?.holdEngaged === true;
  if (!atHold || !hasWorld('landfall')) return false;

  // Own fadeTransition (not switchWorld's built-in one, via {instant:true})
  // so the world-switch AND the descent's start-pose seed both happen inside
  // the SAME black hold — one fade, no visible pop when it lifts.
  // setFlightMode('LANDED') is INSIDE the callback, AFTER the switch
  // (orchestrator loop-gate fix): during the fade-out the ship world still
  // ticks, and tickApproach's HOLD-reassert (approach.ts:212-214) stomps any
  // LANDED written before the switch — the same writer-conflict class agy
  // caught in Stage 4. Off-ship, nothing ticks approach, so LANDED sticks.
  void fadeTransition(() => {
    switchWorld('landfall', { instant: true, teleport: false });
    setFlightMode('LANDED');
    armDescent();
  });
  return true;
}

/** shipSurface.ts's 'landfall-ship-hatch' interactable. Fades, switches back
 *  to the ship world, and teleports the shared camera to the cargo bay. */
export function takeOff(): void {
  void fadeTransition(() => {
    switchWorld('ship', { instant: true, teleport: false });
    registerCam(SHIP_REBOARD_CAM, CARGO_BAY_POS, CARGO_BAY_LOOK, 'ship');
    teleportToCamera(SHIP_REBOARD_CAM);
    resetDescent();
  });
}

/** testApi.getLandingInfo() — null while no descent has ever started (phase
 *  'NONE'), matching approach.ts's getApproachDebug() null-when-uninitialized
 *  precedent. weather is a Stage-4 placeholder — real weather cycling wires
 *  in then. */
export function getLandingDebug(): LandingDebugInfo | null {
  const phase = getPhase();
  if (phase === 'NONE') return null;
  return {
    phase,
    altitude: getAltitude(),
    padDist: getPadDist(),
    chunksResident: getChunksResident(),
    weather: 'clear',
  };
}

/** testApi.resetFlight() chain (mirrors approach.ts's resetApproach()) —
 *  boot-state reset so no test/session carries a stuck descent over. */
export function resetLandfall(): void {
  resetDescent();
}
