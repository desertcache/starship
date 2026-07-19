/**
 * src/flight/landfall.ts — v1.2 LANDFALL Stage 1 (contracts + seams).
 *
 * Ships the L-key request path + descent-phase state machine SKELETON only.
 * The 'landfall' world is registered in Stage 2 (streamed surface world);
 * until then requestLanding() ALWAYS declines — helmInput.ts's KeyL and
 * flightHud.ts's HOLD prompt both exist and are reachable, but nothing
 * observable happens when pressed (v1.2 LANDFALL is shipped inert-but-visible
 * this stage, by design — see the campaign brief).
 *
 * No-op-guard shape modeled on approach.ts's toggleApproachAssist(): a single
 * guarded entry point, no per-frame writer. Stage 3 wires the actual
 * descent/walk/return tick chain (tickLandfall) — see the seam marker below.
 */
import { getFlight, setFlightMode } from './flightState.js';
import { hasWorld } from '../core/worlds.js';

export type DescentPhase = 'NONE' | 'ENTRY' | 'BRAKE' | 'TOUCHDOWN' | 'WALK';

/** testApi.getLandingInfo() shape — richer than FlightSnapshot needs, same
 *  "debug info" precedent as approach.ts's ApproachDebugInfo. */
export interface LandingDebugInfo {
  phase: DescentPhase;
  altitude: number;
  padDist: number;
  chunksResident: number;
  weather: string;
}

let phase: DescentPhase = 'NONE';

/** L keybind (helmInput.ts) + testApi.engageLanding(): request descent.
 *  Guard: must be at HOLD (getFlight().approach.holdEngaged) AND the
 *  'landfall' world must be registered. Declines (returns false) otherwise —
 *  in Stage 1 that's unconditional, since hasWorld('landfall') is false until
 *  Stage 2 registers it. The acceptance branch below is therefore unreachable
 *  this stage; it exists so Stage 2/3 only have to wire the descent itself,
 *  not this entry point. */
export function requestLanding(): boolean {
  const atHold = getFlight().approach?.holdEngaged === true;
  if (!atHold || !hasWorld('landfall')) return false;

  setFlightMode('LANDED');
  phase = 'ENTRY';
  // Stage 3 wires the descent here.
  return true;
}

/** testApi.getLandingInfo() — null while no descent is in progress (phase
 *  'NONE'), matching approach.ts's getApproachDebug() null-when-uninitialized
 *  precedent. Numeric fields are Stage-2/3 placeholders until tickLandfall
 *  exists to compute them for real. */
export function getLandingDebug(): LandingDebugInfo | null {
  if (phase === 'NONE') return null;
  return {
    phase,
    altitude: 0, // Stage 2 computes real descent altitude
    padDist: 0, // Stage 2 computes real distance-to-pad
    chunksResident: 0, // Stage 2 populates from the streamed chunk grid
    weather: 'none', // Stage 4 wires weather state
  };
}

/** testApi.resetFlight() chain (mirrors approach.ts's resetApproach()) —
 *  boot-state reset so no test/session carries a stuck descent phase over. */
export function resetLandfall(): void {
  phase = 'NONE';
}
