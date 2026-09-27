/**
 * src/core/testHooksWorlds.ts — pocket-world + space hooks of the window.__test
 * verify contract (v1.2.1: the worlds/space hardening lane's own hooks).
 *
 * Each hook here proves a fix against the PRODUCTION function/state it
 * touches (the real shader-mirroring math, the real nebula field instance,
 * the real hero-texture generator, the real annex scene) rather than a
 * reimplementation — see scripts/tests/worlds.mjs for how they're driven.
 */
import * as THREE from 'three';
import type { TestApiDeps } from './testApi.js';
import { lightfallYForTest } from '../world/worlds/riftFeatures.js';
import {
  getPersistentNebulaPositionsForTest,
  tickPersistentNebulaForTest,
} from '../fx/space/director.js';
import { getNebulaWrapBoundsForTest } from '../fx/space/nebula.js';
import { gasGiantTexture } from '../fx/space/giantTexture.js';
import { makeRng } from '../fx/space/rng.js';
import { HUE_FAMILIES } from '../fx/space/palette.js';

export interface WorldsTestHooks {
  /** C2: mirrors the LIGHTFALL vertex shader's y computation for a given
   *  (aY0, uTime) — see riftFeatures.ts's FALLS_VERT + lightfallYForTest(). */
  lightfallYAt(aY0: number, uTime: number): number;
  /** C3: the ship's 3 persistent nebula sprites' live world positions. */
  getPersistentNebulaPositions(): Array<{ x: number; y: number; z: number }>;
  /** C3: advance the real nebula.tick() n times at the given per-tick dt
   *  (ms), using the LIVE flowW each call — same "loop the real per-frame
   *  function" pattern as __test.flightTickN. */
  tickPersistentNebula(n: number, dtMs: number): void;
  /** C3: the wrap bounds [lo, hi) per axis, straight from nebula.ts. */
  getNebulaWrapBounds(): { x: [number, number]; y: [number, number]; z: [number, number] };
  /** C7: one synchronous hero-scale (1024px) gas-giant texture generation,
   *  timed with performance.now() — the SAME family/size real hero spawns
   *  use (bodies.ts: texSize = hero ? 1024 : 256; HUE_FAMILIES[1] is the
   *  deterministic t=0 signature canopy giant's family). Returns elapsed ms. */
  measureHeroTextureGenMs(): number;
  /** C8 (read-only — the annex room belongs to Lane A): is the holotable
   *  hologram ignited? Reads the 'holotable-projection' anchor's children
   *  directly rather than duplicating portalRoom.ts's ignition logic. Null
   *  if the annex isn't built (should not happen post-boot). */
  getHolotableIgnited(): boolean | null;
}

export function buildWorldsTestHooks(deps: TestApiDeps): WorldsTestHooks {
  const { scene } = deps;
  return {
    lightfallYAt(aY0: number, uTime: number): number {
      return lightfallYForTest(aY0, uTime);
    },
    getPersistentNebulaPositions(): Array<{ x: number; y: number; z: number }> {
      return getPersistentNebulaPositionsForTest();
    },
    tickPersistentNebula(n: number, dtMs: number): void {
      tickPersistentNebulaForTest(n, dtMs);
    },
    getNebulaWrapBounds(): { x: [number, number]; y: [number, number]; z: [number, number] } {
      return getNebulaWrapBoundsForTest();
    },
    measureHeroTextureGenMs(): number {
      const rng = makeRng(0x1234);
      const t0 = performance.now();
      gasGiantTexture(rng, HUE_FAMILIES[1], 1024);
      return performance.now() - t0;
    },
    getHolotableIgnited(): boolean | null {
      const anchor = scene.getObjectByName('holotable-projection') as THREE.Group | undefined;
      if (!anchor) return null;
      return anchor.children.some((c) => c.visible === true);
    },
  };
}
