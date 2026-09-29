/**
 * src/core/testHooksShip.ts — ship-interior hooks of the window.__test verify
 * contract: doors, fridge, quest shortcuts. Moved out of testApi.ts in v1.2.1
 * Stage 0 so the ship-interior hardening lane owns every hook it touches.
 *
 * These are shortcuts: they do NOT prove a player can reach the same state.
 * Prefer real-path tests (scripts/tests/ship.mjs) — see core/testRealPath.ts.
 */
import type { TestApiDeps } from './testApi.js';
import { getFridgeStateForTest, resetFridgeForTest, questAdvanceViaBreaker } from '../world/interactItems.js';
import { questRevealAndReadPanel } from '../world/interactWiring.js';
import {
  isDoorOpen, debugExpireDoorDwell, disarmDoorAutoCloseForTest, getDoorSlabY, getDoorColliderBounds, tickDoorsN,
} from '../world/doors.js';
import { setReactorBreathFreezeForTest } from '../fx/lightingRig.js';
import { getCrateBGroup } from '../world/engineeringProps.js';
import { isOverlayVisibleForTest, getOverlayTitleForTest } from '../ui/hudOverlay.js';
import { isMoving } from '../player/controller.js';

export interface ShipTestHooks {
  getDoorOpen(id: string): boolean;
  getFridgeState(): { state: string; stock: number };
  resetFridge(): void;
  /** v1.2.1: rewinds a door's dwell timer so the NEXT real tickDoors() call
   *  auto-closes it — replaces forceDoorAutoCloseCheck(), which skipped
   *  tickDoors() entirely (see doors.ts for why that hid the real bug). */
  debugExpireDoorDwell(id: string): void;
  /** Test-only suite cleanup after a door is open through the real E path. */
  disarmDoorAutoClose(id: string): void;
  /** A door's live world-space slab Y — proves the real tick actually moves it. */
  getDoorSlabY(id: string): number | null;
  /** A door's live collider Y bounds — for asserting blocking at the
   *  collider level when the harness can't hold a real pointer lock. */
  getDoorColliderBounds(id: string): { minY: number; maxY: number } | null;
  /** Deterministic fast-forward for a door's real 480ms slide animation —
   *  see doors.ts's tickDoorsN for why a wall-clock sleep can't bound it. */
  tickDoorsN(times: number, dtMs: number): void;
  questRevealAndReadPanel(): number;
  questAdvanceViaBreaker(): number;
  /** A7 art check: force the reactor breath to a fixed phase (1 = peak,
   *  -1 = trough, null = release back to the live 2.1 rad/s phase). */
  freezeReactorBreath(wave: number | null): void;
  /** crate-b's live visual-group X (0 at rest, CRATE_B_SLIDE_DIST=0.8 when
   *  fully slid) — proves the A4 tween tick actually moves it over real
   *  frames, order-independent of whichever direction it's currently mid- or
   *  post-tween toward. */
  getCrateBVisualX(): number | null;
  /** Whether the lore/console overlay panel is currently visible. */
  isOverlayVisible(): boolean;
  /** The overlay's current title, '' while hidden. */
  getOverlayTitle(): string;
  /** Diagnostic (A2 WASD-block proof): whether tickController currently
   *  considers the player as walking (pointer-locked + a movement key
   *  held), plus the camera's current yaw — for isolating why a real WASD
   *  hold produced no position change. */
  getMoveDiag(): { moving: boolean; locked: boolean; yaw: number };
}

export function buildShipTestHooks(deps: TestApiDeps): ShipTestHooks {
  return {
    getDoorOpen(id: string): boolean {
      return isDoorOpen(id);
    },
    getFridgeState(): { state: string; stock: number } {
      return getFridgeStateForTest();
    },
    resetFridge(): void {
      resetFridgeForTest();
    },
    debugExpireDoorDwell(id: string): void {
      debugExpireDoorDwell(id);
    },
    disarmDoorAutoClose(id: string): void {
      disarmDoorAutoCloseForTest(id);
    },
    getDoorSlabY(id: string): number | null {
      return getDoorSlabY(id);
    },
    getDoorColliderBounds(id: string): { minY: number; maxY: number } | null {
      return getDoorColliderBounds(id);
    },
    tickDoorsN(times: number, dtMs: number): void {
      tickDoorsN(times, dtMs);
    },
    questRevealAndReadPanel(): number {
      return questRevealAndReadPanel();
    },
    questAdvanceViaBreaker(): number {
      return questAdvanceViaBreaker();
    },
    freezeReactorBreath(wave: number | null): void {
      setReactorBreathFreezeForTest(wave);
    },
    getCrateBVisualX(): number | null {
      return getCrateBGroup()?.position.x ?? null;
    },
    isOverlayVisible(): boolean {
      return isOverlayVisibleForTest();
    },
    getOverlayTitle(): string {
      return getOverlayTitleForTest();
    },
    getMoveDiag(): { moving: boolean; locked: boolean; yaw: number } {
      return {
        moving: isMoving(),
        locked: document.pointerLockElement !== null,
        yaw: deps.camera.rotation.y,
      };
    },
  };
}
