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
import { standUpInPlace } from '../player/controller.js';
import {
  armDescent, resetDescent, getPhase, getAltitude, getPadDist, getChunksResident,
  type DescentPhase,
} from '../fx/landfall/descent.js';

export type { DescentPhase };

// v1.2.1 B1 — bound by flight/helm.ts at its own module load (house pattern,
// core/cameras.ts's setWorldActivator): tears the helm down (detach input,
// pointer-look on, mode->CRUISE, HUD strip clear) atomically with the world
// switch below, WITHOUT this file importing helm.ts directly. A direct import
// would close a cycle — helmInput.ts already imports requestLanding FROM this
// file for the real L key, and helm.ts imports helmInput.ts. Stays null (a
// no-op call site below) only if helm.ts's module somehow never loads, which
// main.ts's static import graph rules out.
let tearDownHelm: (() => void) | null = null;
export function setHelmTeardownProvider(fn: () => void): void {
  tearDownHelm = fn;
}

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
  void fadeTransition(() => {
    switchWorld('landfall', { instant: true, teleport: false });

    // v1.2.1 B1 (r2 P1, the release headline) — after a REAL L-key landing,
    // taking the helm called enterAnchor() -> setSeated(true), and nothing on
    // the pre-fix route ever cleared it: player/controller.ts's
    // tickController() early-outs on `seated` every frame on the surface (no
    // WASD, no ground clamp), and helm.ts's watchdog only tears the helm down
    // once `seated` goes false — which never happened here, so helm keys
    // (world-agnostic, helmInput.ts) kept acting on the planet: W/S drove
    // throttle, V toggled view, and L re-ran requestLanding() (HOLD reads
    // frozen true off-ship, since tickApproach never runs there) and
    // RESTARTED THE DESCENT. The only escape was E, via exitAnchor()'s
    // hardcoded teleport back to the pre-helm SHIP pose (nonsensical once the
    // active scene is 'landfall'), and even then the watchdog's teardown
    // wrote CRUISE over LANDED on the very next frame.
    //
    // Fix: stand up IN PLACE (clear seated, no ship-pose teleport — the
    // descent's own camera drive owns position/orientation from here on) and
    // tear the helm down explicitly, BOTH before writing LANDED. Both are
    // no-ops when landing arrives without ever taking the helm
    // (engageLanding(), Test 15's own path) — standUpInPlace() checks
    // `seated`, and helm.ts's registered teardown checks its own `active`.
    standUpInPlace();
    tearDownHelm?.();

    // setFlightMode('LANDED') is INSIDE the callback, AFTER the switch
    // (orchestrator loop-gate fix): during the fade-out the ship world still
    // ticks, and tickApproach's HOLD-reassert (approach.ts:212-214) stomps any
    // LANDED written before the switch — the same writer-conflict class agy
    // caught in Stage 4. Off-ship, nothing ticks approach, so LANDED sticks.
    // v1.2.1 B1 adds a SECOND writer LANDED must outlive: the helm teardown
    // just above sets mode CRUISE, so this write must also come after THAT,
    // not just after the switch.
    setFlightMode('LANDED');
    // armDescent() also disables pointer-look for the descent cinematic —
    // must run after tearDownHelm() above, whose teardown() re-enables it
    // (setPointerLookEnabled(true)), or the descent would start with
    // pointer-look wrongly back on mid ENTRY/BRAKE/TOUCHDOWN.
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
