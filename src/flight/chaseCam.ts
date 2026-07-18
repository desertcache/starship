/**
 * src/flight/chaseCam.ts — world-frame lag chase camera (Lane D, v1.1 §5
 * Stage 3 / design D4). Implements the algorithm VERBATIM:
 *
 *   qCam  = slerpDamp(qCam, q, CAM_ROT_LAMBDA, dt)     // rotation lags SLOWER
 *   armW  = qCam · (0, ARM_Y, +ARM_Z) * armStretch      // behind = +Z (nose -Z)
 *   pCam  = dampVec3(pCam, armW, CAM_POS_LAMBDA, dt)
 *   cam.position = q⁻¹ · pCam
 *   lookAt = (0, LEAD_Y, -LEAD_DIST)                    // constant in ship frame S
 *   cam.up = q⁻¹ · (qCam · (0,1,0))                     // the lag delta banks the frame
 *
 * The ship never moves/rotates in-scene (§2 frame contract) — a naive
 * scene-space chase cam would show a statue. qCam trailing the real attitude
 * q, then converted back through q⁻¹, is what makes the hull visibly bank
 * inside the frame before the camera "catches up" — the whole trick.
 *
 * Tuning constants below mirror the reserved names in flightTuning.ts
 * (design §9, Lane A's file — absent from this worktree; orchestrator hoists
 * at merge, this lane just needs working numbers now).
 *
 * Only ONE shared PerspectiveCamera exists (main.ts) — chase mode drives it
 * directly (position/quaternion/up/fov + layers.enable(1)) rather than
 * swapping in a second camera object. See fx/bloom.ts's setCamera note for
 * why this made bloom.setCamera() unnecessary.
 */
import * as THREE from 'three';
import { damp, dampVec3, slerpDamp } from '../core/damp.js';
import { getAttitude, getAttitudeInverse, getSpeedFrac, getView } from './flightShimD.js';

// ── Tuning (design §9) ──────────────────────────────────────────────────────
const CAM_ROT_LAMBDA = 3;
const CAM_POS_LAMBDA = 6;
const CHASE_ARM = new THREE.Vector3(0, 10, 40);
const ARM_STRETCH_MAX = 0.25;   // +25% arm length at speedFrac 1
const ARM_STRETCH_LAMBDA = 2.5;
const LEAD_DIST = 25;
const LEAD_Y = 2;
const CHASE_FOV_BASE = 62;
const FOV_BOOST = 16;
const FOV_WIDEN_LAMBDA = 4;
const FOV_NARROW_LAMBDA = 2.5;

const UP = new THREE.Vector3(0, 1, 0);
const LEAD_TARGET = new THREE.Vector3(0, LEAD_Y, -LEAD_DIST);

// ── World-frame lag state ────────────────────────────────────────────────────
let qCam = new THREE.Quaternion();
let pCam = new THREE.Vector3();
let armStretch = 1;
let currentFov = CHASE_FOV_BASE;
let seeded = false; // has qCam/pCam ever been seeded from a real attitude?

// ── Interior handoff state ───────────────────────────────────────────────────
let cam: THREE.PerspectiveCamera | null = null;
let trackedView: 'interior' | 'exterior' = 'interior';
const storedPos = new THREE.Vector3();
const storedQuat = new THREE.Quaternion();
const storedUp = new THREE.Vector3(0, 1, 0);
let storedFov = CHASE_FOV_BASE;

export function initChaseCam(camera: THREE.PerspectiveCamera): void {
  cam = camera;
}

function targetArmScale(speedFrac: number): number {
  return 1 + ARM_STRETCH_MAX * speedFrac;
}

function targetFov(speedFrac: number): number {
  return CHASE_FOV_BASE + FOV_BOOST * THREE.MathUtils.smoothstep(speedFrac, 0.4, 1.0);
}

function armWorld(): THREE.Vector3 {
  return CHASE_ARM.clone().multiplyScalar(armStretch).applyQuaternion(qCam);
}

/** Apply the current lag state (qCam/pCam/armStretch/currentFov) onto `camera`. */
function applyPose(camera: THREE.PerspectiveCamera): void {
  const qInv = getAttitudeInverse();
  camera.position.copy(pCam).applyQuaternion(qInv);
  camera.up.copy(UP).applyQuaternion(qCam).applyQuaternion(qInv);
  camera.lookAt(LEAD_TARGET);
  camera.fov = currentFov;
  camera.updateProjectionMatrix();
}

function enterExterior(camera: THREE.PerspectiveCamera): void {
  storedPos.copy(camera.position);
  storedQuat.copy(camera.quaternion);
  storedUp.copy(camera.up);
  storedFov = camera.fov;
  camera.layers.enable(1);
  if (!seeded) {
    // First-ever activation: seed the lag state at the CURRENT attitude so
    // there's no visible snap on entry (an identity-quaternion qCam would
    // otherwise jump hard toward whatever q already is).
    const speedFrac = getSpeedFrac();
    qCam.copy(getAttitude());
    armStretch = targetArmScale(speedFrac);
    pCam.copy(armWorld());
    currentFov = targetFov(speedFrac);
    seeded = true;
  }
}

function exitExterior(camera: THREE.PerspectiveCamera): void {
  camera.position.copy(storedPos);
  camera.quaternion.copy(storedQuat);
  camera.up.copy(storedUp);
  camera.fov = storedFov;
  camera.layers.disable(1);
  camera.updateProjectionMatrix();
}

/**
 * Idempotent enter/exit bookkeeping — safe to call every frame (tickChaseCam)
 * AND synchronously right after the shim's setView() (core/cameras.ts's
 * teleportToCamera, for the `chase` named cam / __setCam path). Whichever
 * caller observes the transition first fires enterExterior/exitExterior
 * exactly once; the other sees trackedView already matching and no-ops.
 */
export function syncChaseView(): void {
  if (!cam) return;
  const view = getView();
  if (view === trackedView) return;
  if (view === 'exterior') enterExterior(cam);
  else exitExterior(cam);
  trackedView = view;
}

/** Per-frame tick. No-op (after handling any pending transition) when interior. */
export function tickChaseCam(dt: number): void {
  if (!cam) return;
  syncChaseView();
  if (getView() === 'interior') return;

  const q = getAttitude();
  const speedFrac = getSpeedFrac();

  qCam = slerpDamp(qCam, q, CAM_ROT_LAMBDA, dt);
  armStretch = damp(armStretch, targetArmScale(speedFrac), ARM_STRETCH_LAMBDA, dt);
  pCam = dampVec3(pCam, armWorld(), CAM_POS_LAMBDA, dt);

  const wantFov = targetFov(speedFrac);
  currentFov = damp(currentFov, wantFov, wantFov > currentFov ? FOV_WIDEN_LAMBDA : FOV_NARROW_LAMBDA, dt);

  applyPose(cam);
}

/**
 * Jump the lag state straight to its converged pose — used by the `chase`
 * named camera (core/cameras.ts) for deterministic headless/headed
 * screenshots. Safe to call standalone: syncs the enter/exit bookkeeping
 * first, then no-ops unless the (now-synced) view is exterior.
 */
export function snapChaseConverged(): void {
  if (!cam) return;
  syncChaseView();
  if (getView() !== 'exterior') return;

  const speedFrac = getSpeedFrac();
  qCam.copy(getAttitude());
  armStretch = targetArmScale(speedFrac);
  pCam.copy(armWorld());
  currentFov = targetFov(speedFrac);
  seeded = true;
  applyPose(cam);
}
