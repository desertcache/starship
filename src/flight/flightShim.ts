/**
 * LANE-C SHIM — replaced by flightState at merge.
 *
 * Stands in for Lane A's src/flight/flightState.ts (authored in a parallel
 * worktree) so universeRig.ts / starfield.ts / director.ts / cast.ts can be
 * built and tested against the frozen frame contract (docs/design-v1.1-
 * sovereign.md §2) today. At merge the orchestrator repoints the imports
 * below from this shim to the real flightState module — the four function
 * shapes match, so nothing downstream should need to change.
 *
 * Sign convention (fixed by the frame contract): boot flowW = (0,0,+14),
 * identical to today's +Z scroll; flowAxis = normalize(flowW) is the
 * spawn/despawn axis (not travelDir), so existing band numbers keep signs.
 *
 * `?flight=0` kill switch: freezes attitude=identity + flowW=(0,0,14)
 * permanently (v1.0-identical) by making __shimSet a no-op — tests that call
 * __shimSet directly (T12) never run under this flag during normal verify.
 */
import * as THREE from 'three';

const FLIGHT_DISABLED =
  new URLSearchParams(window.location.search).get('flight') === '0';

const _attitudeInverse = new THREE.Quaternion();
const _flowW = new THREE.Vector3(0, 0, 14);
const _flowAxis = new THREE.Vector3(0, 0, 1);

/** Ship attitude inverse (q⁻¹, S→W inverted) — what the universe rig writes
 *  to its group quaternion once per frame. Identity until Lane A/tests set it. */
export function getAttitudeInverse(): THREE.Quaternion {
  return _attitudeInverse;
}

/** Apparent universe velocity, world frame. Boot default (0,0,14). */
export function getFlowW(): THREE.Vector3 {
  return _flowW;
}

/** Unit spawn/despawn axis = normalize(flowW). Boot default (0,0,1). */
export function getFlowAxis(): THREE.Vector3 {
  return _flowAxis;
}

/** Test-only driver: sets ship attitude (stored inverted) + flowW (and the
 *  derived flowAxis). No-op under `?flight=0`. */
export function __shimSet(attitude: THREE.Quaternion, flowW: THREE.Vector3): void {
  if (FLIGHT_DISABLED) return;
  _attitudeInverse.copy(attitude).invert();
  _flowW.copy(flowW);
  _flowAxis.copy(flowW.lengthSq() > 1e-8 ? flowW : _flowAxis).normalize();
}
