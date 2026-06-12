/**
 * Streaming star layer — one THREE.Points, one draw call, GPU-side wrap.
 *
 * Shared by the NEAR layer (built in starfield.ts, returned to main) and the
 * FAR layer (built + ticked by the director). Streaming is done in the vertex
 * shader via a single uScroll uniform (metres travelled +Z): each star wraps
 * its z into [Z_MIN, Z_MIN+SPAN) so the field flows toward +Z (aft) forever
 * without any per-star CPU work.
 *
 * Twinkle keeps the v0.3 per-star phase + per-star colour CDF.
 */

import * as THREE from 'three';

export interface StarColor {
  r: number;
  g: number;
  b: number;
  weight: number;
}

/** v0.3 colour palette + CDF (white-dominant with pale blue/orange/red). */
export const STAR_PALETTE: StarColor[] = [
  { r: 1.0, g: 1.0, b: 1.0, weight: 0.8 },
  { r: 0.804, g: 0.847, b: 1.0, weight: 0.1 },
  { r: 1.0, g: 0.851, b: 0.69, weight: 0.07 },
  { r: 1.0, g: 0.702, b: 0.627, weight: 0.03 },
];

const _cdf: number[] = [];
{
  let acc = 0;
  for (const p of STAR_PALETTE) {
    acc += p.weight;
    _cdf.push(acc);
  }
}

function pickColour(rand: number): StarColor {
  for (let i = 0; i < _cdf.length; i++) {
    if (rand < _cdf[i]) return STAR_PALETTE[i];
  }
  return STAR_PALETTE[0];
}

const VERT_SHADER = /* glsl */ `
  attribute float size;
  attribute float phase;
  attribute vec3 color;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform float uScroll;
  uniform float uSpan;
  uniform float uZMin;
  void main() {
    vColor = color;
    float twinkle = 1.0 + sin(uTime + phase) * 0.15;
    vAlpha = clamp(twinkle * 0.92, 0.0, 1.0);

    // Wrap z into [uZMin, uZMin + uSpan) so the field streams toward +Z.
    vec3 p = position;
    p.z = mod(position.z - uScroll - uZMin, uSpan) + uZMin;

    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = size * twinkle * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const FRAG_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float alpha = (1.0 - dist * 2.0) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export interface StarLayerOpts {
  count: number;
  /** Slab half-extent on X (full width = 2*xHalf). */
  xHalf: number;
  /** Slab half-extent on Y. */
  yHalf: number;
  /** z spans [zMin, zMin + span). */
  zMin: number;
  span: number;
  sizeMin: number;
  sizeMax: number;
  /** When true, positions are scattered uniformly on a sphere of radius `span/2`
   *  centred on z-mid instead of a box slab (far shell look). */
  spherical?: boolean;
  /** Optional seeded random source; defaults to Math.random. */
  rand?: () => number;
}

/** Build a streaming star layer (geometry + shader material). One draw call. */
export function buildStarLayer(opts: StarLayerOpts): THREE.Points {
  const rand = opts.rand ?? Math.random;
  const n = opts.count;
  const positions = new Float32Array(n * 3);
  const sizes = new Float32Array(n);
  const phases = new Float32Array(n);
  const colors = new Float32Array(n * 3);

  const zMid = opts.zMin + opts.span / 2;
  const shellR = opts.span / 2;

  for (let i = 0; i < n; i++) {
    if (opts.spherical) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = shellR * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = shellR * Math.sin(phi) * Math.sin(theta) * (opts.yHalf / shellR);
      positions[i * 3 + 2] = zMid + shellR * Math.cos(phi);
    } else {
      positions[i * 3] = (rand() * 2 - 1) * opts.xHalf;
      positions[i * 3 + 1] = (rand() * 2 - 1) * opts.yHalf;
      positions[i * 3 + 2] = opts.zMin + rand() * opts.span;
    }
    sizes[i] = opts.sizeMin + rand() * (opts.sizeMax - opts.sizeMin);
    phases[i] = rand() * Math.PI * 2;
    const c = pickColour(rand());
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uSpan: { value: opts.span },
      uZMin: { value: opts.zMin },
    },
    vertexShader: VERT_SHADER,
    fragmentShader: FRAG_SHADER,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  points.renderOrder = -1;
  points.frustumCulled = false; // streaming wrap moves verts; bounds are stale
  return points;
}

/** Set the streaming/twinkle uniforms on a star layer. */
export function setStarUniforms(points: THREE.Points, time: number, scroll: number): void {
  const mat = points.material;
  if (mat instanceof THREE.ShaderMaterial) {
    (mat.uniforms['uTime'] as THREE.IUniform<number>).value = time;
    (mat.uniforms['uScroll'] as THREE.IUniform<number>).value = scroll;
  }
}

/** Dispose a star layer's geometry + material. */
export function disposeStarLayer(points: THREE.Points): void {
  points.geometry.dispose();
  if (points.material instanceof THREE.Material) points.material.dispose();
}
