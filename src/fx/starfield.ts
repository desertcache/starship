/**
 * Starfield — per-star colour, per-star twinkle, one draw call.
 *
 * Colour distribution (vertexColors):
 *   80% white   #ffffff
 *   10% pale blue  #cdd8ff
 *    7% pale orange #ffd9b0
 *    3% faint red   #ffb3a0
 *
 * Twinkle: ShaderMaterial modulates size/opacity with per-star phase offset.
 * Sine amplitude 0.05–0.15, unique phase per star (packed into geometry attribute).
 * One draw call total.
 */
import * as THREE from 'three';

// ── Star colour palette ────────────────────────────────────────────────────────

const PALETTE: Array<{ r: number; g: number; b: number; weight: number }> = [
  { r: 1.000, g: 1.000, b: 1.000, weight: 0.80 },  // white
  { r: 0.804, g: 0.847, b: 1.000, weight: 0.10 },  // pale blue  #cdd8ff
  { r: 1.000, g: 0.851, b: 0.690, weight: 0.07 },  // pale orange #ffd9b0
  { r: 1.000, g: 0.702, b: 0.627, weight: 0.03 },  // faint red   #ffb3a0
];

// Build CDF for weighted colour selection
const _cdf: number[] = [];
{
  let acc = 0;
  for (const p of PALETTE) { acc += p.weight; _cdf.push(acc); }
}

function pickColour(rand: number): { r: number; g: number; b: number } {
  for (let i = 0; i < _cdf.length; i++) {
    if (rand < _cdf[i]) return PALETTE[i];
  }
  return PALETTE[0];
}

// ── Twinkle shader ─────────────────────────────────────────────────────────────

const VERT_SHADER = /* glsl */`
  attribute float size;
  attribute float phase;
  attribute vec3 color;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  void main() {
    vColor = color;
    // Sine modulation in range [0.85, 1.15] for opacity/size
    float twinkle = 1.0 + sin(uTime + phase) * 0.15;
    vAlpha = clamp(twinkle * 0.92, 0.0, 1.0);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * twinkle * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const FRAG_SHADER = /* glsl */`
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    // Circular disc with soft edge
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float alpha = (1.0 - dist * 2.0) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// ── Public API ─────────────────────────────────────────────────────────────────

/** Build a starfield of ~4000 stars on a large sphere surrounding the ship. */
export function buildStarfield(): THREE.Points {
  const STAR_COUNT = 4000;
  const RADIUS = 800;

  const positions = new Float32Array(STAR_COUNT * 3);
  const sizes     = new Float32Array(STAR_COUNT);
  const phases    = new Float32Array(STAR_COUNT);
  const colors    = new Float32Array(STAR_COUNT * 3);

  for (let i = 0; i < STAR_COUNT; i++) {
    // Uniform distribution on sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = RADIUS;

    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    // Subtle size variation for depth feel
    sizes[i] = 0.8 + Math.random() * 1.6;

    // Unique twinkle phase per star
    phases[i] = Math.random() * Math.PI * 2;

    // Per-star colour
    const { r: cr, g: cg, b: cb } = pickColour(Math.random());
    colors[i * 3]     = cr;
    colors[i * 3 + 1] = cg;
    colors[i * 3 + 2] = cb;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('phase',    new THREE.BufferAttribute(phases, 1));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader:   VERT_SHADER,
    fragmentShader: FRAG_SHADER,
    transparent:    true,
    depthWrite:     false,
  });

  const stars = new THREE.Points(geo, mat);
  stars.name = 'starfield';
  // Ensure stars render behind everything
  stars.renderOrder = -1;

  return stars;
}

/** Update twinkle time uniform. Call each frame with elapsed seconds. */
export function tickStarfield(stars: THREE.Points, elapsed: number): void {
  if (stars.material instanceof THREE.ShaderMaterial) {
    (stars.material.uniforms['uTime'] as THREE.IUniform<number>).value = elapsed;
  }
}

/** Dispose a starfield returned by buildStarfield. */
export function disposeStarfield(stars: THREE.Points): void {
  stars.geometry.dispose();
  if (stars.material instanceof THREE.Material) {
    stars.material.dispose();
  }
}
