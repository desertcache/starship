/**
 * src/fx/bloom.ts — Optional UnrealBloomPass post-processing.
 *
 * Only the emissive elements should glow (teal strips, screens, reactor core,
 * ceiling panels). The high threshold ensures cream walls and structural trim
 * are NOT bloomed; only things that exceed the threshold (emissive colours like
 * #46E0D8 teal and bright panel highlights) pick up the halo.
 *
 * Kill switch: URL param ?bloom=0 disables it entirely.
 *   e.g. http://localhost:5173/?bloom=0
 *
 * Returns null when bloom is disabled so the caller falls back to
 * renderer.render() directly.
 */

import * as THREE from 'three';
import { EffectComposer }  from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/examples/jsm/postprocessing/OutputPass.js';

// ── Bloom tuning constants ─────────────────────────────────────────────────────
//
// Goal: gentle halos on emissives only.
//
//   threshold: 0.90 — raised from 0.80 so cream walls (#E8E2D4, luminance ≈0.77)
//              can NEVER bloom. Emissive materials (teal strips, ceiling lights,
//              console screens) use toneMapped=false and a slightly boosted colour
//              so they still clear this threshold and produce a halo.
//              The teal #55FFEE (boosted from #46E0D8) converts to luminance ≈0.93.
//              Ceiling lights use pure white (0xFFFFFF, luminance 1.0).
//   strength:  0.45 — subtle halo, not white blowout.
//   radius:    0.55 — tight spread so the glow hugs the source geometry.

const BLOOM_THRESHOLD = 0.90;
const BLOOM_STRENGTH  = 0.45;
const BLOOM_RADIUS    = 0.55;

// ── Bloom result ──────────────────────────────────────────────────────────────

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
  // ── Kill switch ─────────────────────────────────────────────────────────────
  const params = new URLSearchParams(window.location.search);
  const bloomEnabled = params.get('bloom') !== '0';

  if (!bloomEnabled) {
    return {
      render():                    void { renderer.render(scene, camera); },
      resize(_w: number, _h: number): void { /* no-op */ },
      dispose():                   void { /* no-op */ },
      enabled: false,
    };
  }

  // ── Build composer ──────────────────────────────────────────────────────────
  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
  const bloomPass  = new UnrealBloomPass(
    resolution,
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD,
  );
  composer.addPass(bloomPass);

  // OutputPass handles tone-mapping and sRGB conversion after bloom
  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  return {
    render(): void {
      composer.render();
    },

    resize(width: number, height: number): void {
      composer.setSize(width, height);
      bloomPass.resolution.set(width, height);
    },

    dispose(): void {
      composer.dispose();
    },

    enabled: true,
  };
}
