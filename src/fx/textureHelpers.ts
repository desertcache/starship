/**
 * Shared helpers for procedural texture generation.
 * Internal module — not part of the public API.
 */
import * as THREE from 'three';

// ── Palette ────────────────────────────────────────────────────────────────────
export const PAL = {
  // v0.6 P1: cream darkened ~75% (E8E2D4 → 383430) — near-charcoal to match
  // ref-02 wall tone. Hue preserved (warm dark), luminance only.
  cream:   '#383430',
  orange:  '#C7641E',
  teal:    '#46E0D8',
  gunmetal:'#1C1E22',
  red:     '#7A2C1F',
  space:   '#0A0B10',
} as const;

// ── Seeded PRNG ────────────────────────────────────────────────────────────────

/** Generate a simple seeded pseudo-random value in [0,1). */
export function rng(seed: number): () => number {
  let s = seed;
  return (): number => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// ── Grime / seam painters ──────────────────────────────────────────────────────

/**
 * Add grime/scuff noise to a canvas context — scattered semi-transparent
 * dark smudges and scratches that give the "worn freighter" look.
 */
export function addGrime(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
  intensity = 0.18,
): void {
  const rand = rng(seed);

  // Smudge patches
  const smudgeCount = Math.floor(w * h / 1200);
  for (let i = 0; i < smudgeCount; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 4 + rand() * 16;
    const alpha = (0.03 + rand() * 0.09) * intensity * 6;
    ctx.beginPath();
    ctx.ellipse(x, y, r * (0.5 + rand()), r * (0.3 + rand() * 0.4), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
    ctx.fill();
  }

  // Scratch lines
  const scratchCount = Math.floor(w / 60);
  for (let i = 0; i < scratchCount; i++) {
    const x0 = rand() * w;
    const y0 = rand() * h;
    const len = 10 + rand() * 60;
    const angle = rand() * Math.PI;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + Math.cos(angle) * len, y0 + Math.sin(angle) * len);
    ctx.strokeStyle = `rgba(0,0,0,${(0.04 + rand() * 0.06) * intensity * 6})`;
    ctx.lineWidth = 0.5 + rand();
    ctx.stroke();
  }

  // Fine pixel noise
  const noiseData = ctx.getImageData(0, 0, w, h);
  const d = noiseData.data;
  const step = 3; // skip pixels for performance
  for (let i = 0; i < d.length; i += 4 * step) {
    const n = (rand() - 0.5) * intensity * 40;
    d[i]   = Math.max(0, Math.min(255, d[i]   + n));
    d[i+1] = Math.max(0, Math.min(255, d[i+1] + n));
    d[i+2] = Math.max(0, Math.min(255, d[i+2] + n));
  }
  ctx.putImageData(noiseData, 0, 0);
}

/** Draw seam lines on a panel texture — horizontal and vertical grid. */
export function drawSeams(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  panelPxW: number,
  panelPxH: number,
  seamColor = 'rgba(30,20,10,0.55)',
  seamWidth = 2,
): void {
  ctx.strokeStyle = seamColor;
  ctx.lineWidth = seamWidth;

  for (let x = panelPxW; x < w; x += panelPxW) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = panelPxH; y < h; y += panelPxH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

// ── Texture cache ──────────────────────────────────────────────────────────────

const _cache = new Map<string, THREE.CanvasTexture>();

// v0.9 A2: every texture minted via `cached()` self-registers here so a single
// applyMaxAnisotropy() sweep (called once from main.ts after the renderer
// exists) can enable anisotropic filtering everywhere without every texture
// call site needing to know about the renderer.
const _registry: THREE.CanvasTexture[] = [];

export function cached(key: string, build: () => THREE.CanvasTexture): THREE.CanvasTexture {
  if (!_cache.has(key)) {
    const tex = build();
    _registry.push(tex);
    _cache.set(key, tex);
  }
  return _cache.get(key)!;
}

/**
 * Enable max anisotropic filtering on every CanvasTexture ever minted via
 * `cached()`. Call once, right after the renderer is constructed — by the
 * time this module graph has loaded, all module-level texture singletons
 * (walls, floor, ceiling, fixtures, props) already exist, so a single sweep
 * covers them all. Fixes grazing-angle floor/wall mush.
 */
export function applyMaxAnisotropy(renderer: THREE.WebGLRenderer): void {
  const max = renderer.capabilities.getMaxAnisotropy();
  for (const tex of _registry) {
    tex.anisotropy = max;
    tex.needsUpdate = true;
  }
}
