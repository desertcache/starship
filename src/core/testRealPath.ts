/**
 * src/core/testRealPath.ts — v1.2.1 real-input-path test hooks + sweeps.
 *
 * The v1.2 ultrareview's worst bugs all hid behind test hooks that skip the
 * real input path: __test.interact() falls back to a distance check while the
 * real E key resolves only NAMED meshes; engageLanding() lands without taking
 * the helm; forceDoorAutoCloseCheck() skips tickDoors. These hooks let a test
 * drive the path a player takes instead: pose the real camera, let
 * tickInteract()'s own raycast pick the target, read the live [E] prompt, then
 * press the real key from Playwright (scripts/tests/helpers.mjs).
 */
import type { TestApiDeps } from './testApi.js';
import { getCurrentInteractIdForTest } from '../player/interact.js';
import { getPromptTextForTest } from '../ui/hud.js';
import {
  sweepNameContract,
  sweepDeadHooks,
  type NameViolation,
  type HookViolation,
} from './testSweeps.js';

export interface RealPathTestHooks {
  /** Pose the real camera at (px,py,pz) looking at (tx,ty,tz). While standing,
   *  the controller re-clamps y to ground + 1.7 every frame: pass eye height. */
  aimFrom(px: number, py: number, pz: number, tx: number, ty: number, tz: number): void;
  /** The id the real E key would trigger right now, or null. */
  getInteractTarget(): string | null;
  /** The live HUD prompt text ('' while hidden). */
  getPromptText(): string;
  sweepNameContract(): NameViolation[];
  sweepDeadHooks(): HookViolation[];
}

export function buildRealPathTestHooks(deps: TestApiDeps): RealPathTestHooks {
  const { camera } = deps;
  return {
    aimFrom(px: number, py: number, pz: number, tx: number, ty: number, tz: number): void {
      camera.position.set(px, py, pz);
      camera.lookAt(tx, ty, tz);
    },
    getInteractTarget(): string | null {
      return getCurrentInteractIdForTest();
    },
    getPromptText(): string {
      return getPromptTextForTest();
    },
    sweepNameContract(): NameViolation[] {
      return sweepNameContract();
    },
    sweepDeadHooks(): HookViolation[] {
      return sweepDeadHooks();
    },
  };
}
