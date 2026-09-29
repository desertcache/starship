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
  /** v1.2.1 Lane D (HERO TEXTURE HITCH): synchronous hero-scale (1024px)
   *  generation time for every hero body-class generator, isolated seeds
   *  (never touches the director's own rng stream) — the "old synchronous
   *  number" baseline the deferred job path is measured against. */
  measureAllHeroTextureGenMs(): Record<string, number>;
  /** Lane D: generate `kind` at hero size (1024px) from the SAME seed via
   *  (a) the original one-shot sync generator and (b) the deferred
   *  params/paint split, drained to completion — then byte-compare the two
   *  CanvasTextures' ImageData. Proves constraint 2 (byte-identical final
   *  textures) against the REAL generators, not a reimplementation. */
  compareHeroTextureByteIdentity(kind: HeroBodyClass): {
    equal: boolean;
    rngEqual: boolean;
    diffCount: number;
    syncLength: number;
    deferredLength: number;
    width: number;
    height: number;
  };
  /** Lane D: spawn ONE real deferred hero body (bodies.ts's createBody,
   *  deferred=true — director.ts's own runtime-hero-spawn path) and drive
   *  the SAME shared tickHeroTextureJobs() the real frame loop calls,
   *  budgeted at `budgetMs`, timing every tick. Returns the worst single-
   *  tick cost, how many ticks it took, and the old sync generation time
   *  measured the same run (for the record). */
  measureDeferredHeroSpawnBudget(budgetMs: number): {
    frames: number;
    maxFrameMs: number;
    totalMs: number;
    oldSyncMs: number;
  };
  /** Lane D: begin a deferred texture job directly (bypassing bodies.ts),
   *  advance it partially (never to completion), then cancel it the way a
   *  despawned body's dispose() does — proves onDone (the material/map
   *  swap) never fires once cancelled, i.e. a despawn mid-job can never
   *  write to a disposed material. */
  testHeroTextureJobCancel(): { onDoneFiredAfterCancel: boolean; jobCancelledFlag: boolean };
  /** Lane D: end-to-end version of the same proof through the REAL
   *  createBody(..., deferred=true) + Body.dispose() path — ticks partially,
   *  disposes mid-job, then keeps draining the shared queue and asserts
   *  nothing throws. */
  testHeroBodyDisposeMidJob(): { threw: boolean; queueDrainedAfter: boolean };
  /** Lane D: spawn a real deferred hero body, spy on the placeholder
   *  texture's own dispose(), drain the job to completion, then check the
   *  body-core mesh's material — proves the "Swap" contract: the material's
   *  map is the full-resolution texture (not the 128px placeholder) AND the
   *  placeholder's dispose() was actually called. */
  testHeroTextureSwap(): { placeholderDisposed: boolean; matMapIsFinal: boolean; matMapWidth: number };
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

      const before = getCompletedJobCount();
      const body = createBody(makeRng(0xabcd), 'GAS_GIANT', 120, 1, undefined, true);
      let frames = 0;
      let maxFrameMs = 0;
      const t1 = performance.now();
      while (getCompletedJobCount() === before && frames < 100000) {
        const f0 = performance.now();
        tickHeroTextureJobs(budgetMs);
        const dt = performance.now() - f0;
        if (dt > maxFrameMs) maxFrameMs = dt;
        frames++;
      }
      const totalMs = performance.now() - t1;
      body.dispose();
      return { frames, maxFrameMs, totalMs, oldSyncMs };
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
