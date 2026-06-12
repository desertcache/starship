import type * as THREE from 'three';

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
