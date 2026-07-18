/**
 * src/core/damp.ts — frame-rate-independent exponential damp primitive.
 *
 * `1 - Math.exp(-lambda * dt)` converges to the same value regardless of
 * frame rate (Eiserloh GDC / research-flight.md §1) — the shared building
 * block for input smoothing, velocity, camera lag, and FOV across the whole
 * v1.1 SOVEREIGN campaign. λ calibration: ~0.6 dreamy, ~6 responsive,
 * ~40 near-instant.
 */
import * as THREE from 'three';

/** Damp a scalar toward `target` at rate `lambda` over `dt` seconds. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/** Damp a Vector3 toward `target`; writes into (and returns) `out`. */
export function dampVec3(
  current: THREE.Vector3,
  target: THREE.Vector3,
  lambda: number,
  dt: number,
  out: THREE.Vector3 = new THREE.Vector3(),
): THREE.Vector3 {
  return out.copy(current).lerp(target, 1 - Math.exp(-lambda * dt));
}

/** Damp a Quaternion toward `target` via slerp; writes into (and returns) `out`. */
export function slerpDamp(
  current: THREE.Quaternion,
  target: THREE.Quaternion,
  lambda: number,
  dt: number,
  out: THREE.Quaternion = new THREE.Quaternion(),
): THREE.Quaternion {
  return out.copy(current).slerp(target, 1 - Math.exp(-lambda * dt));
}
