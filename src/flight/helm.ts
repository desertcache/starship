/**
 * src/flight/helm.ts — helm seat: interactable + enter/exit + per-frame
 * watchdog (design doc D2, Lane B). Reuses the shipped anchor pipeline
 * (enterAnchor/exitAnchor, player/controller.ts) verbatim — this file only
 * layers flight-mode bookkeeping (input attach/detach, pointer-look
 * surrender, HUD strip) on top of the existing seated-camera mechanism.
 *
 * Stand-up autopilot (D2): E-stand exits through interact.ts's OWN hardcoded
 * `exitAnchor()` call (interact.ts:86-89 — not this lane's file to edit), so
 * helm.ts never sees that keypress directly. tickHelm() instead runs a
 * WATCHDOG every ship-frame: whenever helm is (still, locally) active but
 * `getState().seated` has gone false — E-stand, a test teleport, anything —
 * it tears the rest of the helm state down in one place. Flight state itself
 * (attitude/speed/throttle) is untouched by teardown: the ship keeps flying
 * while the pilot walks the deck. That IS the fantasy (D2 "stand-up
 * autopilot"), not a bug to fix.
 */
import * as THREE from 'three';
import type { Interactable, InteractContext } from '../world/types.js';
import { getState } from '../core/state.js';
import { enterAnchor, exitAnchor, setPointerLookEnabled } from '../player/controller.js';
import { playOneShot } from '../fx/audio.js';
import { setHelmActive, setFlightMode, setFlightInput } from './flightState.js';
import { attachHelmInput, detachHelmInput, tickHelmInput } from './helmInput.js';
import { setFlightStripText } from '../ui/hud.js';

// Seat-port positions — byte-identical to the plain seat this replaces in
// world/interactWiring.ts's buildSeatInteractables() (same id/radius so the
// raycast still resolves against the same seat mesh name).
const HELM_INTERACT_POS = new THREE.Vector3(-0.90, 1.0, -22.2);
const HELM_ANCHOR_POS = new THREE.Vector3(-0.90, 0.53, -22.2);
const HELM_LOOK_AT = new THREE.Vector3(0, 1.55, -25.0);
const HELM_EYE_HEIGHT = 1.15;

/** True while THIS module considers the player seated at the helm — a local
 *  mirror of flightState's helmActive, flipped in lockstep by enterHelm() /
 *  teardown() only, so the watchdog below has a zero-alloc flag to check. */
let active = false;

/** Shared teardown path — E-stand watchdog, test-only exit, world switches,
 *  anything that leaves helmActive true but the player no longer seated. */
function teardown(): void {
  if (!active) return;
  active = false;
  setFlightInput({ pitch: 0, yaw: 0, roll: 0, throttleDelta: 0, boost: false });
  setPointerLookEnabled(true);
  detachHelmInput();
  setFlightMode('CRUISE');
  setHelmActive(false);
  setFlightStripText(null);
}

/** Take the helm: seat the camera (existing anchor pipeline), surrender
 *  pointer free-look to the helm input scheme, and enter HELM mode. */
export function enterHelm(): void {
  if (getState().seated) return;
  playOneShot('ui');
  enterAnchor(HELM_ANCHOR_POS, HELM_LOOK_AT, HELM_EYE_HEIGHT);
  setHelmActive(true);
  setPointerLookEnabled(false);
  attachHelmInput();
  setFlightMode('HELM');
  active = true;
}

/** The seat-port interactable — same id/radius/position as the seat it
 *  replaces (design doc D2); only the prompt and the onInteract target
 *  differ ("Sit" → "Take Helm", enterAnchor-direct → enterHelm()). The
 *  `getState().seated` guard lives inside enterHelm() itself, so double-entry
 *  is refused there regardless of caller (this interactable or TestAPI). */
export function buildHelmInteractable(): Interactable {
  return {
    id: 'seat-port',
    prompt: 'Take Helm',
    radius: 1.8,
    position: HELM_INTERACT_POS.clone(),
    onInteract(_ctx: InteractContext): void {
      enterHelm();
    },
  };
}

/** Per-ship-frame tick (main.ts, called BEFORE tickFlight — Stage 2
 *  ordering: this frame's steering must feed this frame's model tick).
 *  No-op unless the helm is (still) active. */
export function tickHelm(dt: number): void {
  if (!active) return;
  if (!getState().seated) {
    teardown();
    return;
  }
  tickHelmInput(dt);
}

/** Test-only: drive the same teardown a real E-stand takes, but
 *  synchronously (no watchdog frame to wait for) — testApi.ts's helmExit(). */
export function helmExitForTest(): void {
  if (!active) return;
  exitAnchor();
  teardown();
}
