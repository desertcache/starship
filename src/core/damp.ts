/**
 * src/core/damp.ts — the campaign's shared frame-rate-independent exponential
 * damp primitive (v1.1 SOVEREIGN, design doc D3 / docs/research-flight.md §1).
 *
 * Authored by Stage 1 Lane A because `src/flight/flightModel.ts` needs it
 * immediately and this file did not yet exist in this worktree at the time of
 * writing (a parallel Stage 0 spike agent may also be authoring it on another
 * branch per the design doc — the orchestrator dedupes identical files at
 * merge; this implementation matches the spec verbatim so either copy is safe
 * to keep).
 *
 * All three functions are NON-MUTATING: they return a new value/instance and
 * never write through `current`. Callers assign the result back
 * (`x = damp(x, target, lambda, dt)`), same as the scalar case — this keeps
 * the primitive predictable when the same Vector3/Quaternion is damped from
 * multiple call sites in one frame.
 */
import * as THREE from 'three';

/** Frame-rate-independent exponential approach of a scalar toward `target`. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/** Frame-rate-independent exponential approach of a Vector3 toward `target`. */
export function dampVec3(
  current: THREE.Vector3,
  target: THREE.Vector3,
  lambda: number,
  dt: number,
): THREE.Vector3 {
  const t = 1 - Math.exp(-lambda * dt);
  return current.clone().lerp(target, t);
}

/** Frame-rate-independent exponential slerp of a Quaternion toward `target`. */
export function slerpDamp(
  current: THREE.Quaternion,
  target: THREE.Quaternion,
  lambda: number,
  dt: number,
): THREE.Quaternion {
  const t = 1 - Math.exp(-lambda * dt);
  return current.clone().slerp(target, t);
}
