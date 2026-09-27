/**
 * src/fx/space/atmosphere.ts — additive fresnel-rim atmosphere shell (gas
 * giants, ringed giants, hero ice worlds). Split out of bodies.ts (v1.2.1
 * Lane D: the hero-texture deferred-path plumbing pushed that file over the
 * project's 300-line cap).
 *
 * DoubleSide rasterizes both hemispheres of the (slightly larger) shell: the
 * front hemisphere sits just outside the opaque core across the whole
 * visible disc and is depth-tested in front of it, so its own rim term
 * (bright at the grazing silhouette, ~0 dead-centre) paints a soft glow that
 * blends inward over the core's limb-darkened edge; the back hemisphere is
 * occluded by the core everywhere except the thin annulus beyond its
 * silhouette, painting the matching outward feather into space. Both use the
 * same symmetric rim term (1 - |N·V|), so one mesh/material covers both.
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';

const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float ndotv = dot(normalize(vNormal), normalize(vViewDir));
    // Symmetric rim: 1 at the grazing silhouette (ndotv≈0) on EITHER
    // hemisphere, falling to 0 at both the direct-facing near pole (ndotv=1,
    // dead centre of the visible disc) and the hidden far pole (ndotv=-1).
    float rim = clamp(1.0 - abs(ndotv), 0.0, 1.0);
    // Steep power => the glow is only appreciable in a thin band right at
    // the tangent and has already decayed to ~0 a modest way inward (over
    // the core's own limb-darkened edge) and outward (before the shell's own
    // silhouette), so neither side hard-cuts.
    float fresnel = pow(rim, uPower);
    float alpha = fresnel * uIntensity;
    // Desaturate toward white at peak brightness so the line reads as a
    // glow, not a saturated painted stroke.
    vec3 color = mix(uColor, vec3(1.0), fresnel * 0.6);
    gl_FragColor = vec4(color, alpha);
  }
`;

/** Add a coloured additive fresnel atmosphere rim shell to `group`. `track`
 *  registers the created geometry/material with the CALLER's own disposable
 *  bookkeeping (bodies.ts's Disposables) — kept as a callback here so this
 *  file doesn't need to import that internal type. */
export function addAtmosphere(
  group: THREE.Group,
  radius: number,
  colorHex: number,
  rng: Rng,
  track: (geo: THREE.BufferGeometry, mat: THREE.Material) => void,
): void {
  const shellR = radius * (1 + rng.range(0.1, 0.14));
  const geo = new THREE.SphereGeometry(shellR, 28, 20);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(colorHex) },
      uIntensity: { value: rng.range(0.35, 0.5) },
      uPower: { value: rng.range(3.0, 4.0) },
    },
    vertexShader: ATMO_VERT,
    fragmentShader: ATMO_FRAG,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'atmosphere';
  group.add(mesh);
  track(geo, mat);
}
