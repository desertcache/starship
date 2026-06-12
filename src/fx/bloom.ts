/**
 * src/fx/bloom.ts — Post-processing: UnrealBloom + SSAO (default) + vignette.
 *
 * Kill switch: URL param ?bloom=0 disables bloom entirely.
 *   e.g. http://localhost:5173/?bloom=0
 *
 * SSAO: DEFAULT ON (v0.5 Stage 3 promotion — headed measurement showed negligible
 *   cost at 132fps/8.2ms p95). Disable with ?quality=low.
 *   kernelRadius 8, minDistance 0.002, maxDistance 0.08 — subtle contact/corner
 *   darkening without haloing. Expected cost: ~0ms measured at 1280×720.
 *
 * Composer is built when (bloomEnabled || !QUALITY_LOW):
 *   - Always: RenderPass, OutputPass
 *   - Unless ?quality=low: SSAOPass (before bloom, subtle corner darkening)
 *   - If bloom enabled: UnrealBloomPass
 *
 * Bloom tuning constants (left AS-IS per v0.4 brief; re-tune post space-lane merge):
 *   threshold: 0.90 — cream walls (luminance ≈0.77) never bloom.
 *              Emissive teal (0x55FFEE, lum ≈0.93) clears this.
 *   strength:  0.45 — subtle, not blowout.
 *   radius:    0.55 — tight halo.
 */

import * as THREE from 'three';
import { EffectComposer }  from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass }      from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { SSAOPass }        from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { QUALITY_LOW }     from '../core/perf.js';

// ── Bloom tuning ───────────────────────────────────────────────────────────────

const BLOOM_THRESHOLD = 0.90;
const BLOOM_STRENGTH  = 0.45;
const BLOOM_RADIUS    = 0.55;

// ── Vignette shader ────────────────────────────────────────────────────────────
//
// Darkens screen corners ~18% with a smooth radial falloff.
// One fullscreen quad — negligible GPU cost.
// Applied BEFORE OutputPass so it composites into the tone-mapped result.

const VignetteShader = {
  name: 'VignetteShader',
  uniforms: {
    tDiffuse:   { value: null as THREE.Texture | null },
    /** Falloff power — higher = tighter vignette edge (2.0 = cosine-like). */
    uFalloff:   { value: 2.0 },
    /** Darkness at the very corners (0 = none, 1 = black). */
    uStrength:  { value: 0.18 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uFalloff;
    uniform float uStrength;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      // Distance from centre in UV space, normalised so corner = 1.0
      vec2 uv = vUv - 0.5;
      float dist = length(uv) * 1.4142; // scale so corner touches 1.0
      float vignette = 1.0 - uStrength * pow(dist, uFalloff);
      gl_FragColor = vec4(color.rgb * vignette, color.a);
    }
  `,
};

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
  // SSAO is default-on; composer needed whenever bloom is on OR SSAO is on.
  const ssaoEnabled  = !QUALITY_LOW;
  const needComposer = bloomEnabled || ssaoEnabled;

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

  // 2. SSAOPass — default-on (before bloom so SSAO affects bloom input).
  //    Disabled only when ?quality=low.
  let ssaoPass: SSAOPass | null = null;
  if (ssaoEnabled) {
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

  // 4. Vignette — subtle corner darkening (~18%), active whenever composer runs.
  //    Off when ?bloom=0 (no composer path) keeps plain render unaffected.
  const vigPass = new ShaderPass(VignetteShader);
  composer.addPass(vigPass);

  // 5. OutputPass — tone-mapping + sRGB conversion, always last
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
