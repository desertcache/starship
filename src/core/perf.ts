import type * as THREE from 'three';

// ── Quality flags ─────────────────────────────────────────────────────────────
//
// v0.5 Stage 3: SSAO and shadow maps are DEFAULT ON after measurement confirmed
// their headed cost is negligible (baseline 132.1fps/8.2ms p95 vs quality-high
// 131.9fps/8.2ms — within noise). Both features stay inside the ≥60fps/≤18ms
// budget with enormous headroom.
//
// Opt-out: ?quality=low disables SSAO + shadow maps for low-end hardware.
// The old ?quality=high flag continues to read correctly (QUALITY_HIGH stays
// true when set), but the default path no longer checks it — both features are
// on unless QUALITY_LOW is true.
//
const _qParams = new URLSearchParams(
  typeof window !== 'undefined' ? window.location.search : '',
);

/**
 * True when ?quality=high is in the URL.
 * Kept for harness/verify compatibility (--quality flag appends ?quality=high).
 * No longer the primary gate for SSAO/shadows — see QUALITY_LOW.
 */
export const QUALITY_HIGH: boolean = _qParams.get('quality') === 'high';

/**
 * True when ?quality=low is in the URL.
 * When true, SSAO and shadow maps are disabled for low-end / headless paths.
 * Default: false — both SSAO and shadows are ON by default.
 */
export const QUALITY_LOW: boolean = _qParams.get('quality') === 'low';

/**
 * True when ?shadows=0 is in the URL.
 * Disables shadow maps entirely regardless of quality setting — isolation flag
 * for the glitch-kill isolation matrix (Step 2). Honored in main.ts renderer
 * setup and assembly.ts configureSpotShadow().
 */
export const SHADOWS_OFF: boolean = _qParams.get('shadows') === '0';

export interface PerfReport {
  avgFps: number;
  p95FrameTime: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  sampleDurationMs: number;
}

interface PerfState {
  renderer: THREE.WebGLRenderer | null;
  frameTimes: number[];
  lastTimestamp: number;
  windowMs: number;
}

const state: PerfState = {
  renderer: null,
  frameTimes: [],
  lastTimestamp: performance.now(),
  windowMs: 2000,
};

export function initPerf(renderer: THREE.WebGLRenderer): void {
  state.renderer = renderer;
}

export function recordFrame(now: number): void {
  const dt = now - state.lastTimestamp;
  state.lastTimestamp = now;
  if (dt > 0 && dt < 1000) {
    state.frameTimes.push(dt);
    // Trim older frames outside the rolling window
    let elapsed = 0;
    let i = state.frameTimes.length - 1;
    while (i >= 0 && elapsed < state.windowMs) {
      elapsed += state.frameTimes[i];
      i--;
    }
    if (i >= 0) {
      state.frameTimes.splice(0, i);
    }
  }
}

function computeP95(times: number[]): number {
  if (times.length === 0) return 0;
  const sorted = [...times].sort((a, b) => a - b);
  const idx = Math.floor(sorted.length * 0.95);
  return sorted[Math.min(idx, sorted.length - 1)];
}

function snapshotReport(sampleDurationMs: number): PerfReport {
  const times = state.frameTimes;
  const avgFrameTime = times.length > 0
    ? times.reduce((s, t) => s + t, 0) / times.length
    : 16.67;
  const avgFps = avgFrameTime > 0 ? 1000 / avgFrameTime : 0;
  const p95FrameTime = computeP95(times);
  const info = state.renderer?.info;
  return {
    avgFps: Math.round(avgFps * 10) / 10,
    p95FrameTime: Math.round(p95FrameTime * 100) / 100,
    drawCalls: info?.render.calls ?? 0,
    triangles: info?.render.triangles ?? 0,
    geometries: info?.memory.geometries ?? 0,
    textures: info?.memory.textures ?? 0,
    sampleDurationMs,
  };
}

export function installPerfGlobal(): void {
  (window as unknown as Record<string, unknown>)['__perf'] = {
    sample(ms: number): Promise<PerfReport> {
      return new Promise((resolve) => {
        const start = performance.now();
        // Clear existing frame times so the sample window is fresh
        state.frameTimes = [];
        setTimeout(() => {
          const elapsed = performance.now() - start;
          resolve(snapshotReport(elapsed));
        }, ms);
      });
    },
  };
}
