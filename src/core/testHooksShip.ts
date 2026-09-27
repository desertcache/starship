/**
 * src/core/testHooksShip.ts — ship-interior hooks of the window.__test verify
 * contract: doors, fridge, quest shortcuts. Moved out of testApi.ts in v1.2.1
 * Stage 0 so the ship-interior hardening lane owns every hook it touches.
 *
 * These are shortcuts: they do NOT prove a player can reach the same state.
 * forceDoorAutoCloseCheck() in particular skips tickDoors(), which is how the
 * dead door tick survived from v0.2a to v1.2 — prefer real-path tests.
 */
import type { TestApiDeps } from './testApi.js';
import { getFridgeStateForTest, resetFridgeForTest, questAdvanceViaBreaker } from '../world/interactItems.js';
import { questRevealAndReadPanel } from '../world/interactWiring.js';
import { isDoorOpen, forceDoorAutoCloseCheck } from '../world/doors.js';

export interface ShipTestHooks {
  getDoorOpen(id: string): boolean;
  getFridgeState(): { state: string; stock: number };
  resetFridge(): void;
  forceDoorAutoCloseCheck(): string[];
  questRevealAndReadPanel(): number;
  questAdvanceViaBreaker(): number;
}

export function buildShipTestHooks(_deps: TestApiDeps): ShipTestHooks {
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
    forceDoorAutoCloseCheck(): string[] {
      return forceDoorAutoCloseCheck();
    },
    questRevealAndReadPanel(): number {
      return questRevealAndReadPanel();
    },
    questAdvanceViaBreaker(): number {
      return questAdvanceViaBreaker();
    },
  };
}
