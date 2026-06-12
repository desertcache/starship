import * as THREE from 'three';

/**
 * Barely-perceptible ship sway — applies ±0.2° roll oscillation to a camera
 * each frame so the planet drift reads as motion from inside.
 *
 * PointerLockControls only uses YXZ euler's X and Y components, so we can
 * safely set Z (roll) each frame without conflicting with mouse-look.
 */
export function tickSway(camera: THREE.Camera, elapsed: number): void {
  const MAX_ANGLE = (0.2 * Math.PI) / 180; // 0.2 degrees in radians
  // Two overlapping sines for organic feel
  const roll = Math.sin(elapsed * 0.23) * MAX_ANGLE
             + Math.sin(elapsed * 0.11 + 0.7) * MAX_ANGLE * 0.4;
  camera.rotation.z = roll;
}
