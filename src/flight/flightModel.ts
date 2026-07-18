/**
 * src/flight/flightModel.ts — the D3 pipeline, run once per tickFlight(dt)
 * call from flightState.ts. Verbatim pipeline order from the design doc:
 *
 *   1. smooth raw input                       (INPUT_SMOOTH_LAMBDA)
 *   2. angularVel damped toward input×maxRate  (ROT_LAMBDA, asymmetric max rates)
 *   3. auto-bank, an EXTRA roll contribution from yaw input, tracked as its
 *      own persistent angle so it doesn't fight manual roll input
 *                                              (AUTO_BANK_DEG, AUTO_BANK_LAMBDA)
 *   4. attitude integrated via LOCAL quaternion deltas, pitch → yaw → roll
 *      axis order, composed by post-multiplication — NEVER Euler component
 *      writes (the institutionalized sway.ts lesson; roll about local +Z
 *      leaves the nose, (0,0,-1), invariant by construction, which is exactly
 *      why banking doesn't change heading but DOES swing the universe rig)
 *   5. attitude.normalize() every frame — quaternion drift from thousands of
 *      small multiplies must never compound
 *   6. throttle accumulates input.throttleDelta (units/sec, dt-scaled) then
 *      speed exponentially approaches throttle×MAX_SPEED_CRUISE (×BOOST_MULT
 *      when boosting), asymmetric ACCEL/DECEL_LAMBDA
 *   7. lateral bleed: velocityW's DIRECTION damps toward the nose direction
 *      ("drift through the turn" — LATERAL_BLEED_LAMBDA)
 *   8. derive flowW = -velocityW and travelDir (last non-degenerate flow dir)
 *   9. state.setHeading() from the nose projected onto the world XZ plane
 *
 * All persistent pipeline-local values (smoothed input, the auto-bank angle)
 * are THIS module's own closure state — flightState.ts owns only the PUBLIC
 * fields the rest of the campaign consumes (design doc D1).
 */
import * as THREE from 'three';
import { damp, dampVec3 } from '../core/damp.js';
import { setHeading } from '../core/state.js';
import type { InternalFlightState } from './flightState.js';
import {
  INPUT_SMOOTH_LAMBDA,
  ROT_LAMBDA,
  MAX_PITCH_RATE,
  MAX_YAW_RATE,
  MAX_ROLL_RATE,
  AUTO_BANK_DEG,
  AUTO_BANK_LAMBDA,
  MAX_SPEED_CRUISE,
  BOOST_MULT,
  ACCEL_LAMBDA,
  DECEL_LAMBDA,
  LATERAL_BLEED_LAMBDA,
  THROTTLE_RATE,
} from './flightTuning.js';

/** Pipeline step 1 persistent state — smoothed copy of the raw input. */
const smoothed = { pitch: 0, yaw: 0, roll: 0 };
/** Auto-bank's own tracked roll angle (degrees), independent of manual roll. */
let autoBankDeg = 0;

/** Resets this module's closure state. Called by flightState.resetFlightForLoad(). */
export function resetFlightModelInternals(): void {
  smoothed.pitch = 0;
  smoothed.yaw = 0;
  smoothed.roll = 0;
  autoBankDeg = 0;
}

const NOSE_LOCAL = new THREE.Vector3(0, 0, -1);
const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);
const scratchNose = new THREE.Vector3();
const scratchQuat = new THREE.Quaternion();
const scratchNoseVel = new THREE.Vector3();
const scratchDir = new THREE.Vector3();

/** Runs one step of the flight model against the live (mutable) state refs. */
export function tickFlightModel(state: InternalFlightState, dt: number): void {
  if (dt <= 0) return;
  const { input } = state;

  // 1. Input smoothing.
  smoothed.pitch = damp(smoothed.pitch, input.pitch, INPUT_SMOOTH_LAMBDA, dt);
  smoothed.yaw = damp(smoothed.yaw, input.yaw, INPUT_SMOOTH_LAMBDA, dt);
  smoothed.roll = damp(smoothed.roll, input.roll, INPUT_SMOOTH_LAMBDA, dt);

  // 2. Angular velocity damped toward smoothed input × asymmetric max rate.
  state.angularVel.x = damp(state.angularVel.x, smoothed.pitch * MAX_PITCH_RATE, ROT_LAMBDA, dt);
  state.angularVel.y = damp(state.angularVel.y, smoothed.yaw * MAX_YAW_RATE, ROT_LAMBDA, dt);
  state.angularVel.z = damp(state.angularVel.z, smoothed.roll * MAX_ROLL_RATE, ROT_LAMBDA, dt);

  // 3. Auto-bank: an extra roll contribution from yaw input, damped toward
  //    its own target angle independently of the manual roll rate above.
  //    Only THIS FRAME's delta (not the absolute angle) feeds into step 4 —
  //    the absolute bank the HUD reads is decomposed straight from attitude
  //    in flightState.getFlight(), so nothing is double-counted.
  const targetAutoBankDeg = -smoothed.yaw * AUTO_BANK_DEG;
  const prevAutoBankDeg = autoBankDeg;
  autoBankDeg = damp(autoBankDeg, targetAutoBankDeg, AUTO_BANK_LAMBDA, dt);
  const autoBankDeltaRad = THREE.MathUtils.degToRad(autoBankDeg - prevAutoBankDeg);

  // 4. Integrate attitude via LOCAL quaternion deltas, pitch → yaw → roll,
  //    composed by post-multiplication (never Euler component writes).
  const pitchDelta = state.angularVel.x * dt;
  const yawDelta = state.angularVel.y * dt;
  const rollDelta = state.angularVel.z * dt + autoBankDeltaRad;

  scratchQuat.setFromAxisAngle(AXIS_X, pitchDelta);
  state.attitude.multiply(scratchQuat);
  scratchQuat.setFromAxisAngle(AXIS_Y, yawDelta);
  state.attitude.multiply(scratchQuat);
  scratchQuat.setFromAxisAngle(AXIS_Z, rollDelta);
  state.attitude.multiply(scratchQuat);

  // 5. Renormalize every frame.
  state.attitude.normalize();

  // 6. Throttle accumulates input.throttleDelta (units/sec), then speed
  //    exponentially approaches throttle × max speed (× boost).
  state.throttle = THREE.MathUtils.clamp(
    state.throttle + input.throttleDelta * THROTTLE_RATE * dt,
    0,
    1,
  );
  const targetSpeed = state.throttle * MAX_SPEED_CRUISE * (input.boost ? BOOST_MULT : 1);
  const speedLambda = targetSpeed >= state.speed ? ACCEL_LAMBDA : DECEL_LAMBDA;
  state.speed = damp(state.speed, targetSpeed, speedLambda, dt);

  // 7. Lateral bleed: velocityW's DIRECTION damps toward the nose direction —
  //    "drift through the turn" instead of snapping instantly on-rails.
  scratchNose.copy(NOSE_LOCAL).applyQuaternion(state.attitude); // = q·(0,0,-1)
  if (state.velocityW.lengthSq() < 1e-8) {
    state.velocityW.copy(scratchNose).multiplyScalar(state.speed);
  } else {
    scratchDir.copy(state.velocityW).normalize();
    const bledDir = dampVec3(scratchDir, scratchNose, LATERAL_BLEED_LAMBDA, dt).normalize();
    state.velocityW.copy(bledDir).multiplyScalar(state.speed);
  }

  // 8. Derive flowW (apparent universe velocity) and travelDir (last
  //    non-degenerate flow direction — see sign-convention note in
  //    flightState.ts). velocityW = q·(0,0,-1)·speed; flowW = -velocityW.
  scratchNoseVel.copy(state.velocityW).multiplyScalar(-1);
  state.flowW.copy(scratchNoseVel);
  if (state.flowW.lengthSq() > 1e-6) {
    state.travelDir.copy(state.flowW).normalize();
  }

  // 9. Compass heading: nose projected onto the world XZ plane, every frame.
  //    Convention: atan2(nose.x, -nose.z), normalized 0-360 — matches the
  //    identical formula flightState.getFlight() uses to decompose headingDeg,
  //    so state.heading (NAV console) and the FlightSnapshot never disagree.
  const headingDeg = THREE.MathUtils.radToDeg(Math.atan2(scratchNose.x, -scratchNose.z));
  setHeading(headingDeg);
}
