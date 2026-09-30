import type * as THREE from 'three';

// ── Live screen type tag ───────────────────────────────────────────────────────

export type ScreenType = 'waveform' | 'radar' | 'bargraph';

// ── Live screen state ──────────────────────────────────────────────────────────

export interface LiveScreen {
  type:    ScreenType;
  texture: THREE.CanvasTexture;
  canvas:  HTMLCanvasElement;
  ctx:     CanvasRenderingContext2D;
  lastPwr: number;
  cursor:  boolean;
  frame:   number;
  // radar state
  sweepAngle: number;
  blips: Array<{ a: number; r: number; age: number }>;
  // bargraph state
  bars: number[];
}

// ── Seeded PRNG (local, avoids import of textureHelpers) ──────────────────────
export function seededRng(seed: number): () => number {
  let s = seed;
  return (): number => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}
