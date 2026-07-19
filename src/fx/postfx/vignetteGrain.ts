/**
 * src/fx/postfx/vignetteGrain.ts — corner vignette + animated film grain.
 * One fullscreen ShaderPass — folding grain into the existing vignette pass
 * keeps the composer's pass count unchanged (v0.9 B1 constraint).
 *
 * Vignette: unchanged from the pre-B1 pass — darkens screen corners with a
 * smooth radial falloff, composited AFTER tone mapping's OutputPass... no —
 * still BEFORE OutputPass (see bloom.ts ordering), so it grades into the
 * tone-mapped result exactly as before.
 *
 * Grain (v0.9 B1, new): subtle animated dither, luminance-weighted so it
 * strengthens in shadow and fades to ~0 in bright/HUD-adjacent regions.
 * Purpose: the darkened, colour-corrected interior (item 1) and the
 * retuned bloom (item 4) both widen dark gradients (wall shadow falloff,
 * bloom halo falloff) — grain breaks up 8-bit banding in those gradients.
 * Amplitude ~1.8% (mid of the 1.5–2% brief), time-uniform driven so it reads
 * as filmic dither, not a static overlay. Flag: ?grain=0.
 *
 * uEntry / uFlash (v1.2 LANDFALL Stage 3, fx/bloom.ts's setEntryAmount()/
 * setFlashAmount() setters): two more display-referred mixes, same "last
 * pass, post-tonemap" placement as grain above. uEntry is atmospheric-entry
 * heat — an orange tint biased to the screen EDGES (reuses the vignette's own
 * `dist` term) so it reads as heat haze framing the view, never washing the
 * center. uFlash is a plain full-frame mix toward white, driven only for a
 * brief touchdown-impact pulse. Both default to 0 (no-op) whenever the
 * descent cinematic isn't running.
 */
import * as THREE from 'three';

const VIGNETTE_FALLOFF  = 2.0;
const VIGNETTE_STRENGTH = 0.12;
/** Amplitude as a fraction of full-scale colour (0..1). ~1.8% mid-brief. */
const GRAIN_AMOUNT = 0.018;

export const VignetteGrainShader = {
  name: 'VignetteGrainShader',
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    /** Falloff power — higher = tighter vignette edge (2.0 = cosine-like). */
    uFalloff: { value: VIGNETTE_FALLOFF },
    /** Darkness at the very corners (0 = none, 1 = black). */
    uStrength: { value: VIGNETTE_STRENGTH },
    /** Seconds elapsed — drives the animated grain pattern. */
    uTime: { value: 0 },
    /** Grain amplitude; set to 0 by ?grain=0 (kill switch, no pass removal). */
    uGrainAmount: { value: GRAIN_AMOUNT },
    /** 0..~1 atmospheric-entry heat mix (orange, screen-edge biased). */
    uEntry: { value: 0 },
    /** 0..1 full-frame white mix (touchdown-impact flash). */
    uFlash: { value: 0 },
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
    uniform float uTime;
    uniform float uGrainAmount;
    uniform float uEntry;
    uniform float uFlash;
    varying vec2 vUv;

    // Cheap hash-based pseudo-random value — no noise texture needed.
    float grainHash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      // Vignette — distance from centre in UV space, corner = 1.0.
      vec2 cuv = vUv - 0.5;
      float dist = length(cuv) * 1.4142;
      float vignette = 1.0 - uStrength * pow(dist, uFalloff);
      vec3 shaded = color.rgb * vignette;

      // Animated film grain — luminance-weighted (stronger in shadow,
      // fades out toward highlights so it never reads on bright walls/HUD-
      // adjacent glass). Screen-space hash + time offset so the pattern
      // changes every frame instead of looking like a printed static overlay.
      float luma = dot(shaded, vec3(0.299, 0.587, 0.114));
      float shadowWeight = 1.0 - smoothstep(0.0, 0.6, luma);
      float n = grainHash(gl_FragCoord.xy + vec2(uTime * 131.7, uTime * 71.3)) * 2.0 - 1.0;
      shaded += n * uGrainAmount * shadowWeight;

      // Entry heat — orange, biased to the edges via the same dist term
      // the vignette above already computed (corner/edge = 1.0, center = 0).
      vec3 entryTint = vec3(1.0, 0.42, 0.12);
      float edgeBias = smoothstep(0.25, 1.1, dist);
      shaded = mix(shaded, entryTint, uEntry * edgeBias * 0.65);

      // Touchdown flash — flat full-frame mix toward white.
      shaded = mix(shaded, vec3(1.0), uFlash);

      gl_FragColor = vec4(shaded, color.a);
    }
  `,
};
