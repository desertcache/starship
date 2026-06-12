import * as THREE from 'three';

/**
 * Barely-perceptible ship sway — applies ±0.2° roll oscillation to a camera
 * each frame so the planet drift reads as motion from inside.
 *
 * Applied as a per-frame DELTA via rotateZ (local-space quaternion compose),
 * never by writing camera.rotation.z: assigning the Euler z component flips
 * the camera upside down whenever the current orientation decomposes with
 * z≈π in XYZ order (e.g. yawed ~180° to face aft).
 */
let prevRoll = 0;

export function tickSway(camera: THREE.Camera, elapsed: number): void {
  const MAX_ANGLE = (0.2 * Math.PI) / 180; // 0.2 degrees in radians
  // Two overlapping sines for organic feel
  const roll = Math.sin(elapsed * 0.23) * MAX_ANGLE
             + Math.sin(elapsed * 0.11 + 0.7) * MAX_ANGLE * 0.4;
  camera.rotateZ(roll - prevRoll);
  prevRoll = roll;
}
