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
  tickRegisteredNebulaForTest,
  getNebulaWrapBoundsForTest,
} from '../fx/space/nebula.js';
import { NEBULA_PARALLAX_FACTOR } from '../fx/space/director.js';
import { getFlowWRef } from '../flight/flightState.js';
import { gasGiantTexture } from '../fx/space/giantTexture.js';
import { makeRng } from '../fx/space/rng.js';
import { HUE_FAMILIES } from '../fx/space/palette.js';
import {
  rockyTexture,
  iceTexture,
  lavaBaseTexture,
  moonTexture,
} from '../fx/space/bodyTextures.js';
import { lavaCrackTexture } from '../fx/space/overlayTextures.js';
import {
  beginGasGiantDeferred,
  beginRockyDeferred,
  beginIceDeferred,
  beginLavaBaseDeferred,
  beginMoonDeferred,
} from '../fx/space/grainDeferred.js';
import {
  tickHeroTextureJobs,
  pendingHeroTextureJobCount,
  getCompletedJobCount,
  cancelHeroTextureJob,
} from '../fx/space/heroTextureJobs.js';
import { createBody } from '../fx/space/bodies.js';

/** Drain the ENTIRE shared hero-texture job queue with an effectively
 *  unbounded per-tick budget — every queued job's step() then finishes in
 *  its very next call (the row loop only breaks early on budget, never on
 *  row count), so this always terminates in at most one tick per queued job.
 *  Used by the test hooks below to force deferred work to completion
 *  synchronously, whether or not the queue also holds unrelated real jobs. */
function drainAllHeroTextureJobs(): void {
  let guard = 0;
  while (pendingHeroTextureJobCount() > 0 && guard < 100000) {
    tickHeroTextureJobs(Number.MAX_SAFE_INTEGER);
    guard++;
  }
}

function canvasBytesOf(tex: THREE.Texture): { data: Uint8ClampedArray; width: number; height: number } {
  const canvas = tex.image as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable (test hook)');
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { data: img.data, width: canvas.width, height: canvas.height };
}

export type HeroBodyClass = 'GAS_GIANT' | 'ROCKY' | 'ICE' | 'LAVA' | 'MOON';

export interface WorldsTestHooks {
  /** C2: mirrors the LIGHTFALL vertex shader y computation. */
  lightfallYAt(aY0: number, uTime: number): number;
  /** C3: the ship's 3 persistent nebula sprites' live world positions. */
  getPersistentNebulaPositions(): Array<{ x: number; y: number; z: number }>;
  /** C3: advance the real nebula tick n times using live flowW. */
  tickPersistentNebula(n: number, dtMs: number): void;
  /** C3: the wrap bounds [lo, hi) per axis, straight from nebula.ts. */
  getNebulaWrapBounds(): { x: [number, number]; y: [number, number]; z: [number, number] };
  /** C7: time one deterministic hero-scale gas-giant texture generation. */
  measureHeroTextureGenMs(): number;
  /** Lane D: record sync 1024px generator times with isolated seeds. */
  measureAllHeroTextureGenMs(): Record<string, number>;
  /** Lane D: compare sync/deferred texture bytes and next RNG state. */
  compareHeroTextureByteIdentity(kind: HeroBodyClass): {
    equal: boolean;
    rngEqual: boolean;
    diffCount: number;
    syncLength: number;
    deferredLength: number;
    width: number;
    height: number;
  };
  /** Lane D: measure real createBody setup and queued texture ticks. */
  measureDeferredHeroSpawnBudget(budgetMs: number): {
    frames: number;
    maxFrameMs: number;
    totalMs: number;
    oldSyncMs: number;
    spawnSetupMs: number;
  };
  /** Lane D: cancel a partial job and prove onDone stays silent. */
  testHeroTextureJobCancel(): { onDoneFiredAfterCancel: boolean; jobCancelledFlag: boolean };
  /** Lane D: dispose a real deferred body mid-job and drain safely. */
  testHeroBodyDisposeMidJob(): { threw: boolean; queueDrainedAfter: boolean };
  /** Lane D: prove the final map swap disposes its placeholder. */
  testHeroTextureSwap(): { placeholderDisposed: boolean; matMapIsFinal: boolean; matMapWidth: number };
  /** C8: report whether the holotable projection shows its hologram. */
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
      // Loop the REAL per-frame tick n times at the live flowW (same pattern
      // as core/testApiFlight.ts's flightTickN) — no real-time waiting.
      const dt = dtMs / 1000;
      const delta = new THREE.Vector3();
      for (let i = 0; i < n; i++) {
        delta.copy(getFlowWRef()).multiplyScalar(NEBULA_PARALLAX_FACTOR * dt);
        tickRegisteredNebulaForTest(delta);
      }
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
    measureAllHeroTextureGenMs(): Record<string, number> {
      const time = (fn: () => void): number => {
        const t0 = performance.now();
        fn();
        return performance.now() - t0;
      };
      return {
        gasGiant: time(() => { gasGiantTexture(makeRng(0x1234), HUE_FAMILIES[1], 1024); }),
        rocky: time(() => { rockyTexture(makeRng(0x1234), 1024); }),
        ice: time(() => { iceTexture(makeRng(0x1234), 1024); }),
        lavaBase: time(() => { lavaBaseTexture(makeRng(0x1234), 1024); }),
        lavaCrack: time(() => { lavaCrackTexture(makeRng(0x1234), 1024); }),
        moon: time(() => { moonTexture(makeRng(0x1234), 1024); }),
      };
    },
    compareHeroTextureByteIdentity(kind: HeroBodyClass) {
      const SEED = 0xbeef01;
      const syncRng = makeRng(SEED);
      const deferredRng = makeRng(SEED);
      let syncTex: THREE.CanvasTexture;
      let deferredTex: THREE.CanvasTexture | null = null;
      const onDone = (t: THREE.CanvasTexture): void => { deferredTex = t; };
      if (kind === 'GAS_GIANT') {
        syncTex = gasGiantTexture(syncRng, HUE_FAMILIES[1], 1024);
        beginGasGiantDeferred(deferredRng, HUE_FAMILIES[1], 1024, undefined, onDone);
      } else if (kind === 'ROCKY') {
        syncTex = rockyTexture(syncRng, 1024);
        beginRockyDeferred(deferredRng, 1024, onDone);
      } else if (kind === 'ICE') {
        syncTex = iceTexture(syncRng, 1024);
        beginIceDeferred(deferredRng, 1024, onDone);
      } else if (kind === 'LAVA') {
        syncTex = lavaBaseTexture(syncRng, 1024);
        beginLavaBaseDeferred(deferredRng, 1024, onDone);
      } else {
        syncTex = moonTexture(syncRng, 1024);
        beginMoonDeferred(deferredRng, 1024, onDone);
      }
      const rngEqual = syncRng() === deferredRng();
      drainAllHeroTextureJobs();
      if (deferredTex === null) {
        syncTex.dispose();
        return { equal: false, rngEqual, diffCount: -1, syncLength: 0, deferredLength: 0, width: 0, height: 0 };
      }
      // Cast, not a re-check: TS won't carry non-null narrowing on a
      // closure-mutated `let` past a later statement; onDone already ran
      // synchronously inside drainAllHeroTextureJobs() above.
      const finalTex = deferredTex as THREE.CanvasTexture;
      const a = canvasBytesOf(syncTex);
      const b = canvasBytesOf(finalTex);
      let diffCount = 0;
      const len = Math.min(a.data.length, b.data.length);
      for (let i = 0; i < len; i++) if (a.data[i] !== b.data[i]) diffCount++;
      // Test-only textures, never attached to a material — dispose here
      // rather than leaking a 1024² canvas pair per call (CLAUDE.md: dispose
      // what you replace).
      syncTex.dispose();
      finalTex.dispose();
      return {
        equal: diffCount === 0 && a.data.length === b.data.length && a.width === b.width && a.height === b.height,
        rngEqual,
        diffCount,
        syncLength: a.data.length,
        deferredLength: b.data.length,
        width: b.width,
        height: b.height,
      };
    },
    measureDeferredHeroSpawnBudget(budgetMs: number) {
      const t0sync = performance.now();
      gasGiantTexture(makeRng(0xabcd), HUE_FAMILIES[1], 1024);
      const oldSyncMs = performance.now() - t0sync;

      drainAllHeroTextureJobs();
      const before = getCompletedJobCount();
      const totalStart = performance.now();
      const setup0 = performance.now();
      const body = createBody(makeRng(0xabcd), 'GAS_GIANT', 120, 1, undefined, true);
      let spawnSetupMs = performance.now() - setup0;
      let frames = 0;
      let maxFrameMs = spawnSetupMs;

      // Match director.tick order: advance an existing queued slice, then spawn.
      const firstFrame = performance.now();
      tickHeroTextureJobs(budgetMs);
      const setup1 = performance.now();
      const secondBody = createBody(makeRng(0xabce), 'GAS_GIANT', 120, 1, undefined, true);
      spawnSetupMs = Math.max(spawnSetupMs, performance.now() - setup1);
      maxFrameMs = Math.max(maxFrameMs, performance.now() - firstFrame);
      frames++;

      const targetCompletedCount = before + 2;
      while (getCompletedJobCount() < targetCompletedCount && frames < 100000) {
        const f0 = performance.now();
        tickHeroTextureJobs(budgetMs);
        const dt = performance.now() - f0;
        if (dt > maxFrameMs) maxFrameMs = dt;
        frames++;
      }
      const totalMs = performance.now() - totalStart;
      body.dispose();
      secondBody.dispose();
      return { frames, maxFrameMs, totalMs, oldSyncMs, spawnSetupMs };
    },
    testHeroTextureJobCancel() {
      let fired = false;
      const { job } = beginRockyDeferred(makeRng(0xc0ffee), 1024, () => { fired = true; });
      tickHeroTextureJobs(2); // partial progress only — ~75-85ms of total work at a 2ms budget
      cancelHeroTextureJob(job);
      drainAllHeroTextureJobs(); // must not call onDone for the cancelled job
      return { onDoneFiredAfterCancel: fired, jobCancelledFlag: job.cancelled };
    },
    testHeroBodyDisposeMidJob() {
      let threw = false;
      try {
        const body = createBody(makeRng(0xdead01), 'ICE', 120, undefined, undefined, true);
        tickHeroTextureJobs(2); // partial progress only
        body.dispose(); // cancels the pending job + disposes the placeholder
        drainAllHeroTextureJobs(); // proves ticking past a mid-job dispose never throws
      } catch {
        threw = true;
      }
      return { threw, queueDrainedAfter: pendingHeroTextureJobCount() === 0 };
    },
    testHeroTextureSwap() {
      const body = createBody(makeRng(0xf00d), 'MOON', 120, undefined, undefined, true);
      const mesh = body.group.getObjectByName('body-core') as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const placeholder = mat.map;
      let placeholderDisposed = false;
      if (placeholder) {
        const origDispose = placeholder.dispose.bind(placeholder);
        placeholder.dispose = (): void => {
          placeholderDisposed = true;
          origDispose();
        };
      }
      drainAllHeroTextureJobs();
      const matMapIsFinal = mat.map !== null && mat.map !== placeholder;
      const matMapWidth = (mat.map?.image as HTMLCanvasElement | undefined)?.width ?? 0;
      body.dispose();
      return { placeholderDisposed, matMapIsFinal, matMapWidth };
    },
    getHolotableIgnited(): boolean | null {
      const anchor = scene.getObjectByName('holotable-projection') as THREE.Group | undefined;
      if (!anchor) return null;
      return anchor.children.some((c) => c.visible === true);
    },
  };
}
