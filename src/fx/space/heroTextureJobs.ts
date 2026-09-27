/**
 * src/fx/space/heroTextureJobs.ts — time-sliced finisher for deferred hero
 * body textures (v1.2.1 Lane D: HERO TEXTURE HITCH).
 *
 * Measured 2026-09-27 (this lane's own probe, dev server + window.__test):
 * every HERO-size (1024px) generator is expensive, not just the gas giant —
 * gasGiantTexture ~144-224ms, rockyTexture/lavaBaseTexture/moonTexture
 * ~35-85ms, iceTexture ~35-70ms. lavaCrackTexture (~1ms, no per-pixel loop)
 * and ringTexture (256px only, never hero-sized) are cheap and stay fully
 * synchronous. The ultrareview's own number (188-237ms, r2 P3) matches the
 * gas-giant figure here.
 *
 * Every one of those costs comes ENTIRELY from a per-pixel canvas paint step
 * that runs AFTER every rng draw it depends on (see giantTexture.ts's header
 * and grainDeferred.ts's) — so the paint can be spread across frames with
 * ZERO effect on the rng sequence or the final pixels: chunk boundaries only
 * change WHEN a row is painted, never the math that paints it.
 *
 * This module owns WHEN: a FIFO queue of row-range paint jobs, ticked once
 * per frame from director.ts under a small ms budget — the same
 * "guarantee at least one unit of progress per call, else check the clock"
 * pattern fx/landfall/chunks.ts uses for terrain chunk builds.
 */

/** Per-frame budget for hero-texture job work. Measured 2026-09-27 (this
 *  lane's own probe, 34 runs): a 6ms budget's max observed single-tick cost
 *  ranged 6.3-9ms under heavy concurrent-lane CPU contention (one row's
 *  worth of overshoot plus OS scheduling jitter, not a systemic miss — a
 *  hero row at 1024px costs well under 0.3ms). 4ms leaves more headroom
 *  under the brief's ~8ms/frame ceiling even on a noisy machine, at the cost
 *  of a few more frames to finish (still well under half a second). */
export const HERO_JOB_BUDGET_MS = 4;

/** Placeholder canvas size shown while a deferred job finishes (brief:
 *  "64-128px... reads as the same body from a distance"). */
export const PLACEHOLDER_SIZE = 128;

/** Handle a body's dispose() can cancel — never write to a disposed
 *  material once cancelled=true. */
export interface HeroTextureJob {
  cancelled: boolean;
  /** Set true the instant this job's onDone has fired (or would have, had
   *  it not been cancelled) — test-only observability, see
   *  getCompletedJobCount(). */
  readonly done: boolean;
}

/** A pending paint: `paintRows` mutates pure, already-seeded data for rows
 *  [y0,y1) of a `size`×`size` image (no rng, no canvas calls) — safe to call
 *  in any chunking. `finish()` runs once, after paintRows has covered the
 *  WHOLE image [0,size) — the cheap unchunked tail (single canvas ops:
 *  storm/limb/terminator or grain's one putImageData + limb/terminator) —
 *  and returns the finished texture. */
export interface RowPaintSpec {
  size: number;
  paintRows(y0: number, y1: number): void;
  finish(): THREE.CanvasTexture;
}

// three's types only (no runtime import needed — THREE.CanvasTexture is a
// type-only reference here); import type keeps this file dependency-light.
import type * as THREE from 'three';

interface QueuedJob {
  job: { cancelled: boolean; done: boolean };
  /** Paint up to `budgetMs` more; true once fully finished. */
  step(budgetMs: number): boolean;
  /** Called once, right after the final step() returns true, unless
   *  cancelled meanwhile. */
  onDone(): void;
}

const queue: QueuedJob[] = [];
let completedCount = 0;

/** Build + enqueue a row-chunked paint job from a RowPaintSpec. Returns the
 *  cancel handle; `onDone` fires with the finished texture once painting
 *  reaches size and the cheap tail runs — never if cancelled first. */
export function beginRowPaintJob(spec: RowPaintSpec, onDone: (tex: THREE.CanvasTexture) => void): HeroTextureJob {
  let nextRow = 0;
  const step = (budgetMs: number): boolean => {
    const t0 = performance.now();
    do {
      spec.paintRows(nextRow, nextRow + 1);
      nextRow++;
    } while (nextRow < spec.size && performance.now() - t0 < budgetMs);
    return nextRow >= spec.size;
  };
  const job = { cancelled: false, done: false };
  queue.push({
    job,
    step,
    onDone: () => onDone(spec.finish()),
  });
  return job;
}

/** Cancel a pending job — its onDone will never fire. Safe to call after the
 *  job has already completed (no-op). */
export function cancelHeroTextureJob(job: HeroTextureJob): void {
  job.cancelled = true;
}

/** Tick the front-of-queue job for up to `budgetMs` of work. Call once per
 *  frame from director.tick(). Processes at most one job's worth of "just
 *  finished" work per call — a just-completed job's onDone (a material/map
 *  swap) never cascades into painting the NEXT queued job in the same frame. */
export function tickHeroTextureJobs(budgetMs: number): void {
  while (queue.length > 0) {
    const q = queue[0];
    if (q.job.cancelled) {
      queue.shift();
      continue;
    }
    if (!q.step(budgetMs)) return; // used its slice; resume same job next frame
    queue.shift();
    q.job.done = true;
    completedCount++;
    q.onDone();
    return;
  }
}

/** Test-only: jobs still queued (finished/cancelled ones already shifted out). */
export function pendingHeroTextureJobCount(): number {
  return queue.length;
}

/** Test-only: total jobs that have completed (onDone fired) this session —
 *  a monotonic counter a test can snapshot before spawning and poll after,
 *  independent of whatever ELSE is in the shared queue at the time. */
export function getCompletedJobCount(): number {
  return completedCount;
}
