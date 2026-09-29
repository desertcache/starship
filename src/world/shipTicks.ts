/**
 * src/world/shipTicks.ts — v1.2.1 ship-interior per-frame ticks (new file).
 *
 * Four mechanisms used to live behind an `onBeforeRender` hook on either a
 * THREE.Group or a mesh whose material is `visible: false`. three.js's
 * WebGLRenderer calls Object3D.onBeforeRender from exactly one place,
 * renderObject(), which projectObject() only ever reaches for a
 * Mesh/Line/Points/Sprite whose material is visible — never for a Group, and
 * never for an invisible-material mesh. So none of these four ticks ever
 * ran, from v0.2a (doors, reactor breath, portal latch) or v0.6/0.7 (cockpit
 * screens) through v1.2. See docs/plan-v1.2.1-hardening.md and the
 * ultrareview r1 P1 finding.
 *
 * Call tickShipInterior() once per frame from main.ts's animate() loop,
 * ONLY inside the `activeId === 'ship'` branch: the ship scene doesn't
 * render off-ship, and doors.ts's auto-close compares the player position
 * that tickInteract() threads in every frame, which is POCKET-WORLD
 * coordinates while off-ship.
 */
import { tickDoors } from './doors.js';
import { dustMoteTick, liveScreenTick } from './cockpitProps.js';
import { tickReactorBreath } from '../fx/lightingRig.js';
import { tickPortalLatchGuard } from './portalRoom.js';

/** ~30fps gate for the cockpit screens/dust tick — mirrors the throttle the
 *  old (dead) cockpit.ts hook used, so going live doesn't change their pace. */
let _lastCockpitTickMs = 0;

/**
 * Tick every ship-interior mechanism that needs a real per-frame update.
 * @param dtSeconds - frame delta time in seconds (matches main.ts's clamp).
 * @param nowMs     - performance.now() timestamp for this frame.
 */
export function tickShipInterior(dtSeconds: number, nowMs: number): void {
  tickDoors(dtSeconds);

  if (nowMs - _lastCockpitTickMs > 16) {
    dustMoteTick();
    liveScreenTick(nowMs);
    _lastCockpitTickMs = nowMs;
  }

  tickReactorBreath(nowMs);
  tickPortalLatchGuard();
}
