// LANE-D SHIM — replaced by flightState at merge
//
// Stand-in for Lane A's src/flight/flightState.ts (built in a parallel
// worktree, Stage 1). chaseCam.ts and testApi.ts's setFlightView hook import
// flight data ONLY from this module; the orchestrator repoints that one
// import at merge — nothing else in Lane D touches flight internals.
import * as THREE from 'three';

const attitude = new THREE.Quaternion();        // S→W, identity default (boot)
const attitudeInverse = new THREE.Quaternion();  // kept in sync with `attitude`
let speedFrac = 0.35;                            // matches design §9 boot cruise default
let view: 'interior' | 'exterior' = 'interior';

export function getAttitude(): THREE.Quaternion {
  return attitude;
}

export function getAttitudeInverse(): THREE.Quaternion {
  return attitudeInverse;
}

export function getSpeedFrac(): number {
  return speedFrac;
}

export function getView(): 'interior' | 'exterior' {
  return view;
}

export function setView(v: 'interior' | 'exterior'): void {
  view = v;
}

/** Test-only: drive attitude directly (e.g. the money-shot bank check). */
export function __shimSetAttitude(q: THREE.Quaternion): void {
  attitude.copy(q);
  attitudeInverse.copy(q).invert();
}

/** Test-only: drive speed fraction directly (FOV boost / arm stretch tuning). */
export function __shimSetSpeedFrac(f: number): void {
  speedFrac = THREE.MathUtils.clamp(f, 0, 1);
}
