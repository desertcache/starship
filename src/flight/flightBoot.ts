/**
 * src/flight/flightBoot.ts — v1.2 LANDFALL Stage 0 (Lane P1a). Behavior-
 * neutral extraction of the flight-system boot wiring and the ship-frame
 * per-tick block out of main.ts, which had grown past the constitution's
 * 300-line cap. Preserves the ORIGINAL main.ts call order exactly — the
 * inline comments below are carried over from the extraction site; reorder
 * anything here and it's a functional change, not a refactor.
 *
 * initFlightBoot() owns: universe rig creation + starfield/planet reparent,
 * destination-planet approach init, exterior hull + hull lighting + chase
 * cam init, and (v1.2 Stage 0 Lane P1b) throttle-keyed engine glow — the
 * glow inits AFTER createExteriorHull() because it reads exterior.ts's
 * engineGlowAnchors, which that call populates.
 *
 * tickShipFrame() owns the ship-world per-frame flight tick chain, called
 * from main.ts's animate() only while `activeId === 'ship'`. main.ts still
 * owns tickHelm() (must run UN-gated, even off-ship — see main.ts's comment)
 * and the room-toast/ambience logic (reads camera position against room
 * AABBs, not flight state) — neither belongs in a "flight tick" module.
 *
 * The universe rig, starfield, and planet refs stay MODULE-INTERNAL: nothing
 * outside the original tick chain touched them (verified against the
 * pre-extraction main.ts — universeRig had exactly one non-init call site,
 * its own .tick()), so there's no handle main.ts needs back.
 */
import type * as THREE from 'three';
import type { PlanetResult } from '../fx/planet.js';
import type { UniverseRig } from './universeRig.js';
import { tickFlightHud } from '../ui/flightHud.js';
import { tickStarfield } from '../fx/starfield.js';
import { initApproach, tickApproach, getApproachSnapshot } from './approach.js';
import { tickFlight, setApproachProvider } from './flightState.js';
import { createUniverseRig } from './universeRig.js';
import { createExteriorHull } from '../fx/hull/exterior.js';
import { createHullLighting } from '../fx/hull/hullLighting.js';
import { initChaseCam, tickChaseCam } from './chaseCam.js';
import { initEngineGlow, tickEngineGlow } from '../fx/hull/engineGlow.js';

export interface FlightBootDeps {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  starfield: THREE.Points;
  planet: PlanetResult;
}

let _starfield: THREE.Points | null = null;
let _planet: PlanetResult | null = null;
let _universeRig: UniverseRig | null = null;

/**
 * Wire the whole v1.1/v1.2 flight system at boot. Call once from main.ts,
 * AFTER assembleShip() (needs ship.starfield / ship.planet) and BEFORE
 * bootWorlds() — chase cam's teleportToCamera() at boot needs
 * initChaseCam()'s camera ref already set, the ordering constraint the
 * original main.ts comment documented.
 */
export function initFlightBoot(deps: FlightBootDeps): void {
  _starfield = deps.starfield;
  _planet = deps.planet;

  // ── Universe rig (v1.1 Lane C) — reparents all space content under one
  // group whose quaternion = ship attitude⁻¹ each frame (design §2). No-op at
  // boot (identity attitude), so v1.0 t=0 rendering is unchanged.
  const universeRig = createUniverseRig(deps.scene);
  universeRig.attach(deps.starfield);
  universeRig.attach(deps.planet.mesh);
  _universeRig = universeRig;

  // v1.1 SOVEREIGN Stage 4 (Lane E) — destination planet + F approach-assist +
  // HOLD. Productionizes flight/spikes/planetScale.ts (deleted this stage).
  initApproach(universeRig, deps.camera);
  setApproachProvider(getApproachSnapshot);

  // v1.1 SOVEREIGN Stage 3 (Lane D) — exterior hull (layer 1 only, invisible
  // from inside) + chase camera. Must run before bootWorlds() (main.ts): it
  // calls teleportToCamera() at boot, which needs initChaseCam()'s camera
  // ref set.
  createExteriorHull(deps.scene);
  createHullLighting(deps.scene); // layer-1-scoped key/rim/fill — hull only, interior untouched
  initChaseCam(deps.camera);

  // v1.2 LANDFALL Stage 0 (Lane P1b) — throttle-keyed engine glow at the hull
  // nozzles. Reads exterior.ts's engineGlowAnchors, so this MUST run after
  // createExteriorHull() above populates them. Needs the camera ref (not
  // just the scene) to billboard its camera-facing core disc.
  initEngineGlow(deps.scene, deps.camera);
}

/**
 * Ship-world per-frame flight tick chain (main.ts animate(), `activeId ===
 * 'ship'` only). Order is LOAD-BEARING, preserved verbatim from main.ts:
 * tickFlight FIRST so the rig/starfield/director/glow all read LIVE flight
 * state this frame rather than last frame's attitude/flow.
 */
export function tickShipFrame(dtSeconds: number, elapsed: number): void {
  if (!_universeRig || !_starfield || !_planet) return; // initFlightBoot() not called yet
  tickFlight(dtSeconds); // no-op under ?flight=0 (flightState.ts)
  tickApproach(dtSeconds); // v1.1 SOVEREIGN Stage 4 (Lane E) — no-op under ?approach=0
  tickFlightHud(); // Lane B — helm overlay + flight-strip text
  _universeRig.tick(dtSeconds);
  _planet.tick(elapsed);
  tickStarfield(_starfield, elapsed);
  tickChaseCam(dtSeconds); // Lane D — no-op while view is 'interior'
  tickEngineGlow(dtSeconds); // v1.2 Stage 0 (Lane P1b) — no-op before initEngineGlow()
}
