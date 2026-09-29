/**
 * src/player/bob.ts — head-bob + FOV walk-kick, split out of controller.ts
 * (v1.2.1 B5 cap fix: controller.ts was 372 lines, over CLAUDE.md's 300-line
 * cap). Pure per-frame effect, parameterized on groundHeight/eyeHeight so it
 * never needs to import controller.ts's module state back (no cycle) — the
 * thin tickBob() wrapper controller.ts still exports (main.ts's own import
 * path, `./player/controller.js`, is unchanged) is the only caller.
 */
import * as THREE from 'three';
import { getState } from '../core/state.js';

/** Current vertical bob offset applied on top of the ground eye height. */
let bobOffset = 0;

/** Reset the bob offset to 0 instantly — controller.ts's exitAnchor() /
 *  standUpInPlace() call this when standing up from a seat so no residual
 *  mid-decay offset is baked in (pre-split behavior, preserved explicitly
 *  since bobOffset is now private to this module). */
export function resetBob(): void {
  bobOffset = 0;
}

/**
 * Captured rest FOV — set on first tickBob call so we never hardcode 75.
 * -1 means "not yet captured".
 */
let _restFov = -1;
/** Current lerped FOV (tracks camera.fov). */
let _currentFov = -1;

/**
 * Tick the head-bob effect + FOV walk kick.
 * When moving: y += sin(elapsed*5.5)*0.022 (≈4.4 cm peak-to-peak at walk pace).
 * When stopped: lerp offset back to 0 at 6 units/s.
 * FOV lerps to restFov+2 when moving, back to restFov when stopped.
 * Applied AFTER collision resolution so it never pushes camera through geometry.
 *
 * @param camera       - active perspective camera
 * @param elapsed      - seconds since scene start
 * @param moving       - true when WASD is held and pointer is locked
 * @param groundHeight - the active world's analytic ground height at (x,z)
 *                       (controller.ts's own `activeGround`, injected so this
 *                       file has zero imports from controller.ts)
 * @param eyeHeight    - standing eye height (controller.ts's EYE_HEIGHT)
 */
export function tickBob(
  camera: THREE.PerspectiveCamera,
  elapsed: number,
  moving: boolean,
  groundHeight: (x: number, z: number) => number,
  eyeHeight: number,
): void {
  // Capture rest FOV on first call (main.ts sets camera.fov before calling us)
  if (_restFov < 0) {
    _restFov = camera.fov;
    _currentFov = camera.fov;
  }

  if (moving) {
    bobOffset = Math.sin(elapsed * 5.5) * 0.022;
  } else {
    // Lerp back to 0 at 6 units/s (using last frame dt approximation via lerp factor)
    bobOffset *= Math.max(0, 1 - 6 * 0.016); // approximate 16ms frame
    if (Math.abs(bobOffset) < 0.0001) bobOffset = 0;
  }
  // ── FOV kick: +2 when walking, back to rest when stopped ─────────────────
  const st = getState();
  // Apply the offset on top of the ground eye height (ship: 0 + EYE_HEIGHT =
  // FLOOR_Y). Guarded while seated: the helm/seat anchor owns camera.position.y
  // then (v1.1 SOVEREIGN D2) — this write would otherwise stomp the seat's eye
  // height every frame.
  if (!st.seated) {
    camera.position.y = groundHeight(camera.position.x, camera.position.z) + eyeHeight + bobOffset;
  }
  // While seated force FOV to rest immediately (no kick from anchor anim)
  const targetFov = (!moving || st.seated) ? _restFov : _restFov + 2;
  const delta = targetFov - _currentFov;
  if (Math.abs(delta) > 0.01) {
    _currentFov += delta * Math.min(1, 8 * 0.016); // ~8 units/s lerp
    camera.fov = _currentFov;
    camera.updateProjectionMatrix();
  } else if (camera.fov !== _restFov && !moving) {
    // Snap to exact rest when converged to avoid permanent drift
    _currentFov = _restFov;
    camera.fov = _restFov;
    camera.updateProjectionMatrix();
  }
}
