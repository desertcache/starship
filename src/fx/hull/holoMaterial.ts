import * as THREE from 'three';

/**
 * Add a barycentric coordinate attribute to a non-indexed BufferGeometry.
 * This is used for custom edge-glow / wireframe shader effects.
 */
export function addBarycentric(g: THREE.BufferGeometry): void {
  const position = g.attributes.position;
  if (!position) return;
  
  const n = position.count;
  const b = new Float32Array(n * 3);
  
  for (let i = 0; i < n; i += 3) {
    b[i * 3] = 1.0;
    b[(i + 1) * 3 + 1] = 1.0;
    b[(i + 2) * 3 + 2] = 1.0;
  }
  
  g.setAttribute('aBary', new THREE.BufferAttribute(b, 3));
}

const vertexShader = `
  attribute vec3 aBary;
  varying vec3 vBary;
  varying vec3 vNormalV;
  varying vec3 vLocalPos;

  void main() {
    vBary = aBary;
    vNormalV = normalMatrix * normal;
    vLocalPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vBary;
  varying vec3 vNormalV;
  varying vec3 vLocalPos;

  uniform vec3 uColor;
  uniform float uTime;
  uniform float uLineDensity;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  void main() {
    // Edge-glow
    float minB = min(vBary.x, min(vBary.y, vBary.z));
    float wire = 1.0 - smoothstep(0.0, fwidth(minB) * 1.5, minB);

    // Fresnel
    vec3 normalV = normalize(vNormalV);
    float fres = pow(1.0 - clamp(dot(normalV, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.5);

    // Local-space scanlines (Z is the long axis, but scanlines on Y look best vertically)
    float scan = smoothstep(0.35, 0.0, abs(fract(vLocalPos.y * uLineDensity - uTime * 1.5) - 0.5));

    // Slow sweep band
    float sweep = smoothstep(0.12, 0.0, abs(fract(vLocalPos.y * 0.25 - uTime * 0.07) - 0.5));

    // Flicker
    float flick = 0.92 + 0.08 * hash(floor(uTime * 24.0));
    float dropoutHash = hash(floor(uTime * 3.0) + 7.0);
    flick *= mix(1.0, 0.35, step(0.985, dropoutHash));

    vec3 col = uColor * (0.10 + 0.85 * fres + 0.20 * scan + 0.55 * sweep + 0.90 * wire) * flick;

    if (!gl_FrontFacing) {
      col *= 0.3; // volume feel
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * Creates the hologram ShaderMaterial for the ship's exterior hull miniature.
 */
export function createHoloMaterial(
  color: THREE.ColorRepresentation = 0x59d9ff,
): THREE.ShaderMaterial {
  const threeColor = new THREE.Color(color);
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uColor: { value: new THREE.Vector3(threeColor.r, threeColor.g, threeColor.b) },
      uTime: { value: 0 },
      uLineDensity: { value: 60.0 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}
