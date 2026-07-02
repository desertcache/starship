/**
 * src/fx/bloom.ts — Post-processing orchestration: GTAO + UnrealBloom +
 * SMAA + vignette/grain.
 *
 * v0.9 B1 (RADIANCE — post stack + color pipeline): replaces the v0.5–v0.8
 * SSAOPass with GTAOPass (see postfx/ao.ts for the why + tuning), adds
 * SMAAPass (no anti-aliasing existed in the composer path before — jagged
 * teal-strip/panel-seam edges), and folds animated film grain into the
 * existing vignette ShaderPass (see postfx/vignetteGrain.ts) so the pass
 * count doesn't grow for that item.
 *
 * Pipeline order: RenderPass → GTAOPass → UnrealBloomPass → OutputPass →
 * SMAAPass → vignette+grain ShaderPass (last).
 *   - GTAO before bloom: occlusion darkening feeds bloom's threshold test,
 *     same reasoning as the old SSAO-before-bloom order it replaces.
 *   - OutputPass before SMAA and vignette/grain (display-referred effects):
 *     SMAA's edge-detection thresholds are tuned for LDR/display-referred
 *     input — running it on tone-mapped, sRGB-encoded output detects the
 *     same edges a viewer sees, not linear-HDR luminance discontinuities
 *     that don't correspond 1:1 to a perceptual edge.
 *   - Grain is LAST, after SMAA: an early implementation folded grain into
 *     the OLD pre-OutputPass vignette pass and it read as heavy chunky
 *     static on the walls, not subtle dither — ACES + sRGB encoding is a
 *     steep curve near black, so a fixed-percentage linear-space noise
 *     addition gets non-linearly amplified in shadow (exactly where the
 *     luminance weighting made it strongest). Grain must be added to
 *     display-referred (post-tonemap) values for the "~1.5-2%" amplitude
 *     spec to mean what it says. Running it after SMAA also avoids feeding
 *     SMAA's edge detector a pre-noised image (grain looks like false edges
 *     to a luma-difference detector).
 *
 * Kill switch: URL param ?bloom=0 disables bloom entirely.
 *   e.g. http://localhost:5173/?bloom=0
 *
 * AO debug flags (?ssao=... kept as the primary name for compatibility;
 * ?ao=... accepted as an alias — see mission brief):
 *   ?ssao=0 / ?ao=0      — skip GTAOPass entirely (isolation run)
 *   ?ssao=only / ?ao=only — render the denoised AO term alone (tuning view;
 *                           no bloom/vignette/grain composited on top)
 *   ?quality=low          — skips AO (existing behavior, unchanged) and SMAA
 *
 * Grain flag: ?grain=0 zeroes grain amplitude without removing the pass
 * (see postfx/vignetteGrain.ts).
 * AA isolation flag: ?aa=0 skips SMAAPass (debug only; SMAA is cheap and on
 * by default whenever the composer runs).
 *
 * Bloom tuning (v0.9 B1 retune — post color-pipeline fix + A2 hot emissive
 * cores): threshold lowered 0.90 → 0.84 and strength/radius raised so
 * ceiling-fixture and teal-strip hot cores halo softly against the now-
 * correctly-dark (post item 1) interior, while cream walls / HUD glass
 * still sit safely under threshold.
 *   threshold: 0.84 — clears emissive hot cores (≥0.98 luminance after the
 *              colorSpace fix) and fixture cores; cream walls (~0.6-0.7
 *              luminance post-darkening) stay under.
 *   strength:  0.60 — visible soft halo, not a blowout.
 *   radius:    0.65 — halo reaches a few texels past the hot core, doesn't
 *              wash the whole panel.
 */

import * as THREE from 'three';
import { EffectComposer }  from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass }      from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { SMAAPass }        from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { QUALITY_LOW }     from '../core/perf.js';
import { createAOPass, type AOHandle } from './postfx/ao.js';
import { VignetteGrainShader } from './postfx/vignetteGrain.js';

// ── Bloom tuning ───────────────────────────────────────────────────────────────

const BLOOM_THRESHOLD = 0.84;
const BLOOM_STRENGTH  = 0.60;
const BLOOM_RADIUS    = 0.65;

// ── BloomSystem interface ──────────────────────────────────────────────────────

export interface BloomSystem {
  /** Replace renderer.render() calls with this. */
  render(): void;
  /** Must be called on window resize. */
  resize(width: number, height: number): void;
  /**
   * Rebind the scene rendered each frame (WorldManager, on world switch).
   * Mutates RenderPass.scene + GTAOPass.scene in place (composer path) or the
   * fast-path closure's scene — no pass reallocation, no RT churn.
   */
  setScene(scene: THREE.Scene): void;
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

  // AO debug flags — ?ssao=... is the compatibility name (SSAOPass's old
  // kill switch), ?ao=... is accepted as an alias per the B1 brief.
  const ssaoParam  = params.get('ssao');
  const aoParam    = params.get('ao');
  const aoOff      = ssaoParam === '0' || aoParam === '0';
  const aoOnlyView = ssaoParam === 'only' || aoParam === 'only';
  const aoEnabled  = !QUALITY_LOW && !aoOff;

  const aaEnabled = !QUALITY_LOW && params.get('aa') !== '0';
  const grainEnabled = params.get('grain') !== '0';

  const needComposer = bloomEnabled || aoEnabled;

  // ── Fast-path: no composer needed ─────────────────────────────────────────
  if (!needComposer) {
    let activeScene = scene;
    return {
      render():                        void { renderer.render(activeScene, camera); },
      resize(_w: number, _h: number):  void { /* no-op */ },
      setScene(next: THREE.Scene):     void { activeScene = next; },
      dispose():                        void { /* no-op */ },
      enabled: false,
    };
  }

  // ── Build composer ─────────────────────────────────────────────────────────
  const composer = new EffectComposer(renderer);

  // 1. RenderPass — always first
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // 2. GTAOPass — default-on, before bloom (contact darkening feeds the
  //    bloom threshold test). Disabled only by ?quality=low or ?ssao=0/?ao=0.
  let aoHandle: AOHandle | null = null;
  if (aoEnabled) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    aoHandle = createAOPass(scene, camera, w, h, aoOnlyView);
    composer.addPass(aoHandle.pass);
  }

  // 3. UnrealBloomPass — only when bloom is enabled
  let bloomPass: UnrealBloomPass | null = null;
  if (bloomEnabled) {
    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    bloomPass = new UnrealBloomPass(resolution, BLOOM_STRENGTH, BLOOM_RADIUS, BLOOM_THRESHOLD);
    composer.addPass(bloomPass);
  }

  // 4. OutputPass — tone-mapping + sRGB conversion. Everything after this
  //    point operates on display-referred values (see file header).
  composer.addPass(new OutputPass());

  // 5. SMAAPass — after tone-mapped/encoded output, before grain (see file
  //    header). Default on whenever the composer runs; ?aa=0 / ?quality=low
  //    skip it.
  let smaaPass: SMAAPass | null = null;
  if (aaEnabled) {
    smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
    composer.addPass(smaaPass);
  }

  // 6. Vignette + grain — LAST. Subtle corner darkening + animated dither,
  //    active whenever the composer runs. Off when ?bloom=0 AND AO off (no
  //    composer path at all) keeps the plain render unaffected, same as
  //    before B1.
  const grainPass = new ShaderPass(VignetteGrainShader);
  if (!grainEnabled) {
    grainPass.material.uniforms.uGrainAmount.value = 0;
  }
  composer.addPass(grainPass);

  return {
    render(): void {
      // Animate grain — cheap uniform update, no-op cost when amount is 0.
      grainPass.material.uniforms.uTime.value = performance.now() / 1000;
      composer.render();
    },

    resize(width: number, height: number): void {
      // composer.setSize() resizes every added pass (RenderPass, GTAOPass,
      // vignette/grain ShaderPass, OutputPass, SMAAPass) via its internal
      // per-pass setSize() loop. UnrealBloomPass.setSize() additionally
      // needs its `.resolution` Vector2 kept in sync manually (it doesn't
      // update that field from the setSize() args itself).
      composer.setSize(width, height);
      if (bloomPass) {
        bloomPass.resolution.set(width, height);
      }
    },

    setScene(next: THREE.Scene): void {
      // In-place scene rebind (chosen over dispose+rebuild — measured stable,
      // see the WorldManager note). GTAOPass re-renders its own G-buffer from
      // whatever `.scene` points at, so updating both refs is sufficient.
      renderPass.scene = next;
      if (aoHandle) aoHandle.pass.scene = next;
    },

    dispose(): void {
      // EffectComposer.dispose() only frees its own ping-pong render
      // targets + internal copyPass — it does NOT dispose passes added via
      // addPass(). Each pass here owns GPU resources (GTAOPass especially:
      // 3 render targets + 2 noise textures), so dispose them explicitly.
      for (const pass of composer.passes) {
        pass.dispose();
      }
      composer.dispose();
    },

    enabled: bloomEnabled,
  };
}
