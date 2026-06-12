/**
 * src/fx/bloom.ts — Post-processing: UnrealBloom + optional SSAO.
 *
 * Kill switch: URL param ?bloom=0 disables bloom entirely.
 *   e.g. http://localhost:5173/?bloom=0
 *
 * Quality gate: ?quality=high adds SSAOPass BEFORE the bloom pass.
 *   Expected cost: +2-4ms @1280x720. Measured separately from bloom cost.
 *   See QUALITY_HIGH in perf.ts for details.
 *
 * Composer is built when (bloomEnabled || QUALITY_HIGH):
 *   - Always: RenderPass, OutputPass
 *   - If quality=high: SSAOPass (before bloom, subtle corner darkening)
 *   - If bloom enabled: UnrealBloomPass
 *
 * Bloom tuning constants (left AS-IS per v0.4 brief; re-tune post space-lane merge):
 *   threshold: 0.90 — cream walls (luminance ≈0.77) never bloom.
 *              Emissive teal (0x55FFEE, lum ≈0.93) clears this.
 *   strength:  0.45 — subtle, not blowout.
 *   radius:    0.55 — tight halo.
 *
 * Integration task (post-merge): re-run verify:headed; if space emissives
 * blow out, lower strength 0.45->0.38 OR raise threshold 0.90->0.92.
 */

import * as THREE from 'three';
import { EffectComposer }  from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SSAOPass }        from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { QUALITY_HIGH }    from '../core/perf.js';

// ── Bloom tuning ───────────────────────────────────────────────────────────────

const BLOOM_THRESHOLD = 0.90;
const BLOOM_STRENGTH  = 0.45;
const BLOOM_RADIUS    = 0.55;

// ── SSAO tuning (room scale ≈3m) ──────────────────────────────────────────────
//
// kernelRadius 8 — moderate sampling radius for ~3m room scale
// minDistance  0.002 — ignore very close occluders (avoids self-occlusion)
// maxDistance  0.08  — subtle contact/corner darkening only (not full haloing)
// Full resolution (no half-res). Expected cost: +2-4ms @1280x720.

const SSAO_KERNEL_RADIUS  = 8;
const SSAO_MIN_DISTANCE   = 0.002;
const SSAO_MAX_DISTANCE   = 0.08;

// ── BloomSystem interface ──────────────────────────────────────────────────────

export interface BloomSystem {
  /** Replace renderer.render() calls with this. */
  render(): void;
  /** Must be called on window resize. */
  resize(width: number, height: number): void;
  /** Dispose composer and all passes. */
  dispose(): void;
  readonly enabled: boolean;
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function initBloom(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
): BloomSystem {
  const params       = new URLSearchParams(window.location.search);
  const bloomEnabled = params.get('bloom') !== '0';
  const needComposer = bloomEnabled || QUALITY_HIGH;

  // ── Fast-path: no composer needed ─────────────────────────────────────────
  if (!needComposer) {
    return {
      render():                        void { renderer.render(scene, camera); },
      resize(_w: number, _h: number):  void { /* no-op */ },
      dispose():                        void { /* no-op */ },
      enabled: false,
    };
  }

  // ── Build composer ─────────────────────────────────────────────────────────
  const composer = new EffectComposer(renderer);

  // 1. RenderPass — always first
  composer.addPass(new RenderPass(scene, camera));

  // 2. SSAOPass — only when quality=high (before bloom so SSAO affects bloom input)
  let ssaoPass: SSAOPass | null = null;
  if (QUALITY_HIGH) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ssaoPass = new SSAOPass(scene, camera, w, h);
    ssaoPass.kernelRadius  = SSAO_KERNEL_RADIUS;
    ssaoPass.minDistance   = SSAO_MIN_DISTANCE;
    ssaoPass.maxDistance   = SSAO_MAX_DISTANCE;
    composer.addPass(ssaoPass);
  }

  // 3. UnrealBloomPass — only when bloom is enabled
  let bloomPass: UnrealBloomPass | null = null;
  if (bloomEnabled) {
    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    bloomPass = new UnrealBloomPass(resolution, BLOOM_STRENGTH, BLOOM_RADIUS, BLOOM_THRESHOLD);
    composer.addPass(bloomPass);
  }

  // 4. OutputPass — tone-mapping + sRGB conversion, always last
  composer.addPass(new OutputPass());

  return {
    render(): void {
      composer.render();
    },

    resize(width: number, height: number): void {
      composer.setSize(width, height);
      if (bloomPass) {
        bloomPass.resolution.set(width, height);
      }
      if (ssaoPass) {
        ssaoPass.setSize(width, height);
      }
    },

    dispose(): void {
      composer.dispose();
      // SSAOPass and UnrealBloomPass are disposed by composer.dispose()
    },

    enabled: bloomEnabled,
  };
}
