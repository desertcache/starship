/**
 * src/fx/portalShader.ts — the portal swirl ShaderMaterial (Stage A).
 *
 * Livingness directives (docs design "Livingness pass"):
 *   T1 — PROPAGATING waves: intensity = f(uTime - phase(angle,radius)) so
 *        brightness visibly TRAVELS around+inward (no uniform pulse).
 *   T2 — uState continuously ramps saturation/brightness (dormant→live).
 *   T3 — uBurst discharge: two-hue complementary flash (biome tint ↔ near-white
 *        warm) + seeded white filament arcs. Player-action-only → deterministic.
 *   T4 — RAW linear output (no tonemapping/colorspace chunks). The RT sample is
 *        scene-linear HalfFloat; this quad writes linear HDR into the composer
 *        buffer and OutputPass applies ACES exactly once — so bright content
 *        through the portal blooms for free (docs/research-portals.md §4).
 *
 * Live preview uses CAPTURED-VP PROJECTED UVs (research §2), NOT screen-space:
 * the fragment projects portal-plane world points through the view-projection
 * captured at RT render time, pinning content to the PLANE instead of the
 * screen — the fix for "swimming" against our stale 30Hz RT.
 */

import * as THREE from 'three';

export interface SwirlUniforms {
  uTime: { value: number };
  uTint: { value: THREE.Color };
  uTint2: { value: THREE.Color };
  uBurst: { value: number };
  uState: { value: number };
  uLive: { value: THREE.Texture | null };
  uUseLive: { value: number };
  uSeed: { value: number };
  /** vCam.projectionMatrix × vCam.matrixWorldInverse, FROZEN at RT capture. */
  uCapturedVP: { value: THREE.Matrix4 };
  /** dst.matrixWorld × FLIP × src.matrixWorld⁻¹, FROZEN at RT capture. */
  uPortalXform: { value: THREE.Matrix4 };
}

const VERT = /* glsl */ `
uniform mat4 uCapturedVP;
uniform mat4 uPortalXform;
varying vec2 vUv;
varying vec4 vClipCap;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vClipCap = uCapturedVP * (uPortalXform * wp); // divide in the fragment (perspective-correct)
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec3  uTint;
uniform vec3  uTint2;
uniform float uBurst;
uniform float uState;
uniform sampler2D uLive;
uniform float uUseLive;
uniform float uSeed;
varying vec2 vUv;
varying vec4 vClipCap;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 43758.5453);
}

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv) * 1.42;              // 0 center .. ~1 corner
  float ang = atan(uv.y, uv.x);

  // T1 — propagating waves (spiral phase + radial inflow both travel in uTime)
  float waveA = 0.5 + 0.5 * sin(uTime * 2.6 - (ang * 3.0 + r * 9.0));
  float waveR = 0.5 + 0.5 * sin(uTime * 1.7 - r * 12.0);
  float band  = mix(waveA, waveR, 0.5);
  float sw    = 0.5 + 0.5 * sin(ang * 5.0 + uTime * 0.8 + sin(r * 8.0 - uTime));
  band = mix(band, sw, 0.25);

  float edge = max(abs(uv.x), abs(uv.y)) * 2.0; // 0 center .. 1 edge
  float rim  = smoothstep(0.72, 0.98, edge);

  float state = 0.35 + 0.65 * uState;           // T2 ramp
  vec3 col = uTint * (0.22 + 0.9 * band) * state;
  col += uTint * rim * 1.4 * state;

  // live preview — captured-VP projected UVs (research §2)
  if (uUseLive > 0.001) {
    vec2 puv = (vClipCap.xy / vClipCap.w) * 0.5 + 0.5;
    vec3 live = texture2D(uLive, puv).rgb;      // RAW linear HalfFloat sample
    float interior = 1.0 - rim;
    col = mix(col, live, clamp(uUseLive, 0.0, 1.0) * interior);
    col += uTint * rim * 0.8;
  }

  // T3 — discharge burst
  if (uBurst > 0.001) {
    float b = clamp(uBurst, 0.0, 1.0);
    vec3 hot = mix(uTint, uTint2, 0.5 + 0.5 * sin(uTime * 38.0));
    float arcs = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float bucket = floor(uTime * 26.0) + fi * 19.0;
      float a0 = hash(vec2(uSeed + fi * 3.7, bucket)) * 6.2831853;
      float dA = abs(mod(ang - a0 + 3.14159265, 6.2831853) - 3.14159265);
      arcs += smoothstep(0.16, 0.0, dA) * (0.6 + 0.4 * sin(r * 46.0 - uTime * 34.0));
    }
    col = mix(col, hot * 2.6, b * 0.85);
    col += vec3(1.0, 0.95, 0.82) * arcs * b;
  }

  float mask = smoothstep(1.02, 0.86, edge); // soft rectangular edge
  gl_FragColor = vec4(col, mask);
}`;

/** Build a portal swirl material tinted `tintHex`, plus a typed uniform handle. */
export function createSwirlMaterial(tintHex: string): {
  material: THREE.ShaderMaterial;
  uniforms: SwirlUniforms;
} {
  const uniforms: SwirlUniforms = {
    uTime: { value: 0 },
    uTint: { value: new THREE.Color(tintHex) },
    uTint2: { value: new THREE.Color('#FFF2D8') }, // near-white warm complement
    uBurst: { value: 0 },
    uState: { value: 0 },
    uLive: { value: null },
    uUseLive: { value: 0 },
    uSeed: { value: 0 },
    uCapturedVP: { value: new THREE.Matrix4() },
    uPortalXform: { value: new THREE.Matrix4() },
  };
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms as unknown as { [k: string]: THREE.IUniform },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  return { material, uniforms };
}
