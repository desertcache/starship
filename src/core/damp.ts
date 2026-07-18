/**
 * src/core/damp.ts — frame-rate-independent exponential damping primitives.
 *
 * v1.1 SOVEREIGN design D3: the campaign's shared "approach target at rate
 * lambda" primitive (`1 - exp(-lambda*dt)`) — used by the flight model
 * (Lane A), the chase camera (Lane D, this file's first consumer), and the
 * planet-approach spike alike. Absent from this worktree (Stage 0's spike
 * lane hasn't merged here yet) — Lane D creates it now because chaseCam.ts
 * needs it; the orchestrator dedupes against Lane A/the spike's copy at
 * merge (same file, same contract, no divergence expected).
 *
 * All three return a NEW value rather than mutating in place — callers
 * reassign (`x = damp(x, target, lambda, dt)`), matching the design doc's
 * pseudocode exactly (see docs/design-v1.1-sovereign.md D4's chase algorithm).
 */
import * as THREE from 'three';

/** Frame-rate-independent exponential approach of a scalar toward `target`. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  const t = 1 - Math.exp(-lambda * dt);
  return THREE.MathUtils.lerp(current, target, t);
}

/** Vector3 version of damp() — per-axis exponential approach toward `target`. */
export function dampVec3(
  current: THREE.Vector3, target: THREE.Vector3, lambda: number, dt: number,
): THREE.Vector3 {
  const t = 1 - Math.exp(-lambda * dt);
  return new THREE.Vector3(
    THREE.MathUtils.lerp(current.x, target.x, t),
    THREE.MathUtils.lerp(current.y, target.y, t),
    THREE.MathUtils.lerp(current.z, target.z, t),
  );
}

/** Quaternion version — frame-rate-independent slerp toward `target`. */
export function slerpDamp(
  current: THREE.Quaternion, target: THREE.Quaternion, lambda: number, dt: number,
): THREE.Quaternion {
  const t = 1 - Math.exp(-lambda * dt);
  return current.clone().slerp(target, t);
}
