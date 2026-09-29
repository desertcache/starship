/**
 * src/player/anchor.ts — anchor (seat) API, split out of controller.ts
 * (v1.2.1 B5 cap fix: controller.ts was still over CLAUDE.md's 300-line cap
 * even after the bob.ts/collision.ts splits). Owns the seated-camera lerp
 * animation and the enter/exit/stand-up-in-place API; controller.ts's
 * tickController() calls tickAnchorAnim(dt) once per frame and early-outs
 * when it reports the animation consumed the frame — the same behavior the
 * pre-split inline block had.
 *
 * Receives its own PointerLockControls ref via initAnchor() (called from
 * controller.ts's initController()) rather than importing controller.ts, so
 * this file has zero imports from controller.ts (no cycle) — the same
 * injected-ref pattern flight/chaseCam.ts's initChaseCam(camera) uses.
 *
 *   enterAnchor(pos, lookAt, eyeHeight?): smoothly lerps the camera to a
 *     seated pose over 350ms, disables WASD (via the seated flag controller.ts
 *     checks), stores the prior pose in core/state.ts for exitAnchor().
 *   exitAnchor(): restores the prior pose, re-enables WASD.
 *   standUpInPlace(): v1.2.1 B1 — clears seated WITHOUT restoring the prior
 *     pose (see its own doc comment below).
 */
import * as THREE from 'three';
import type { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { setSeated, getState } from '../core/state.js';
import { resetBob } from './bob.js';

let controls: PointerLockControls | null = null;

/** Injected once by controller.ts's initController(). */
export function initAnchor(c: PointerLockControls): void {
  controls = c;
}

/** True while a lerp-to-anchor animation is in flight. */
let anchorAnimating = false;

/** The target pose for the current anchor animation. */
let anchorTargetPos: THREE.Vector3 | null = null;
let anchorTargetQuat: THREE.Quaternion | null = null;

/** Elapsed ms into the current anchor animation. */
let anchorAnimMs = 0;
const ANCHOR_ANIM_MS = 350;

/**
 * Enter an anchor (seated) pose.
 *
 * @param pos       World-space position of the seated camera eye.
 * @param lookAt    World-space point the camera should face when seated.
 * @param eyeHeight Eye height offset from seat position (default 1.1m).
 */
export function enterAnchor(
  pos: THREE.Vector3,
  lookAt: THREE.Vector3,
  eyeHeight = 1.1,
): void {
  if (!controls) return;
  const camera = controls.camera as THREE.PerspectiveCamera;

  // Store return pose
  const returnPose = {
    position: camera.position.clone(),
    quaternion: camera.quaternion.clone(),
  };
  setSeated(true, returnPose);

  // Build target quaternion: look from (pos + eyeHeight) toward lookAt.
  // NOTE: Object3D.lookAt() swaps its eye/target args for anything that
  // isn't a Camera/Light (orienting +Z at the target instead of -Z) — a
  // plain dummy Object3D would face AWAY from `lookAt`. Build the matrix
  // directly with camera-convention eye/target order instead (found via the
  // v1.1 SOVEREIGN helm seat: T13a's first screenshot showed the pilot
  // facing the aft corridor door, back to the canopy).
  const seatPos = pos.clone();
  seatPos.y += eyeHeight;

  const lookMatrix = new THREE.Matrix4().lookAt(seatPos, lookAt, new THREE.Vector3(0, 1, 0));
  const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMatrix);

  anchorTargetPos = seatPos;
  anchorTargetQuat = targetQuat;
  anchorAnimating = true;
  anchorAnimMs = 0;
}

/**
 * Exit the current anchor (return to prior standing pose).
 * Called by interact.ts when E is pressed while seated, or by integration directly.
 */
export function exitAnchor(): void {
  if (!controls) return;
  const st = getState();
  if (!st.seated || !st.anchorReturn) return;

  const camera = controls.camera as THREE.PerspectiveCamera;
  camera.position.copy(st.anchorReturn.position);
  camera.quaternion.copy(st.anchorReturn.quaternion);
  resetBob();

  setSeated(false);
  anchorAnimating = false;
  anchorTargetPos = null;
  anchorTargetQuat = null;
}

/**
 * v1.2.1 B1 fix — stand the player up IN PLACE, with NO ship-pose teleport.
 * exitAnchor() minus the pose restore: the real landing route (flight/
 * landfall.ts's requestLanding()) takes the helm via enterAnchor(), which
 * calls setSeated(true, <pre-helm ship pose>); nothing on the pre-fix route
 * ever cleared it once the world switched to 'landfall', so controller.ts's
 * tickController() kept returning at its `st.seated` early-out on the surface
 * forever (no WASD, no ground clamp) — exitAnchor() was the ONLY thing that
 * ever wrote seated=false, and it ALSO teleports the camera back to the
 * stored ship-frame return pose, which is nonsensical once the active scene
 * is 'landfall' (ship-frame coordinates rendered against the wrong scene).
 *
 * Clears seated + cancels any in-flight anchor lerp, and leaves
 * camera.position/quaternion untouched: the descent's own camera drive
 * (fx/landfall/descent.ts's applyPoseWithShake/beginWalkHandoff, via
 * registerCam+teleportToCamera) re-seeds them regardless, every frame, so
 * whatever this function leaves behind is overwritten before it's ever
 * rendered. Idempotent (no-op while not seated) — safe to call unconditionally
 * from requestLanding(), including the engageLanding() test-hook path that
 * never took the helm in the first place (Test 15).
 */
export function standUpInPlace(): void {
  if (!getState().seated) return;
  resetBob();
  setSeated(false);
  anchorAnimating = false;
  anchorTargetPos = null;
  anchorTargetQuat = null;
}

/**
 * Advance the in-flight anchor lerp (if any) by `dt` seconds. Returns true
 * when it consumed this frame (tickController() should early-out on
 * position/movement, exactly as the pre-split inline block did).
 */
export function tickAnchorAnim(dt: number): boolean {
  if (!anchorAnimating || !anchorTargetPos || !anchorTargetQuat || !controls) return false;
  const camera = controls.camera as THREE.PerspectiveCamera;

  anchorAnimMs += dt * 1000;
  const t = Math.min(anchorAnimMs / ANCHOR_ANIM_MS, 1);
  const easedT = t * t * (3 - 2 * t); // smoothstep

  camera.position.lerp(anchorTargetPos, easedT);
  camera.quaternion.slerp(anchorTargetQuat, easedT);

  if (t >= 1) {
    anchorAnimating = false;
    anchorTargetPos = null;
    anchorTargetQuat = null;
  }
  return true;
}
