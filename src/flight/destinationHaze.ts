/** Close-range Fresnel haze shell for the seeded destination body. */
import * as THREE from 'three';
const HAZE_SCALE = 1.16;

// Steeper than bodies.ts's addAtmosphere (2.4) — a shallower power washed
// teal across the whole disc at HOLD's ~65%-of-FOV size (verify:headed
// finding). Intensity + white-mix tuned down from the pre-art-pass 0.55/0.5
// (task 2.4) — the brighter hero surface needs less rim wash to avoid
// blowing out the limb.
const HAZE_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;
const HAZE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float ndotv = dot(normalize(vNormal), normalize(vViewDir));
    float rim = clamp(1.0 - abs(ndotv), 0.0, 1.0);
    float alpha = pow(rim, 4.0) * uIntensity;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), rim * 0.35), alpha);
  }
`;

/** Fresnel haze shell — ported verbatim from the pre-split approach.ts
 *  (task 2.4 retunes uIntensity/white-mix only; geometry/blending unchanged). */
export function addDestinationHaze(group: THREE.Group, radius: number): void {
  const hazeGeo = new THREE.SphereGeometry(radius * HAZE_SCALE, 64, 48);
  const hazeMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x9fd8c8) },
      uIntensity: { value: 0.45 },
    },
    vertexShader: HAZE_VERT,
    fragmentShader: HAZE_FRAG,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const haze = new THREE.Mesh(hazeGeo, hazeMat);
  haze.name = 'destination-haze';
  group.add(haze);
}
