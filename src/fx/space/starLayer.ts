/**
 * Streaming star layer — one THREE.Points, one draw call, GPU-side wrap.
 *
 * Shared by the NEAR layer (built in starfield.ts, returned to main) and the
 * FAR layer (built + ticked by the director). Streaming is done in the vertex
 * shader via a uScrollVec vec3 uniform (metres travelled along the current
 * universe-flow vector — v1.1 SOVEREIGN, was a single +Z-only float): each
 * star wraps ALL THREE axes into [uMin, uMin+uSpan) component-wise, so the
 * field flows along whatever direction the universe is streaming forever
 * without any per-star CPU work. At zero scroll (boot) this is a no-op on
 * every axis, so v1.0 t=0 rendering is unchanged.
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

/** v0.9 colour palette + CDF — white-dominant but with more visible colour
 *  temperature spread (blue-white / neutral / warm-orange / red) than the
 *  v0.3 baseline so a dense field reads as a real sky, not white noise. */
export const STAR_PALETTE: StarColor[] = [
  { r: 1.0, g: 1.0, b: 1.0, weight: 0.62 },
  { r: 0.804, g: 0.847, b: 1.0, weight: 0.16 },
  { r: 1.0, g: 0.851, b: 0.69, weight: 0.14 },
  { r: 1.0, g: 0.702, b: 0.627, weight: 0.08 },
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
  attribute float brightness;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform vec3 uScrollVec;
  uniform vec3 uMin;
  uniform vec3 uSpan;
  void main() {
    vColor = color;
    float twinkle = 1.0 + sin(uTime + phase) * 0.15;
    vAlpha = clamp(twinkle * brightness, 0.0, 1.0);

    // Wrap each axis into [uMin, uMin + uSpan) so the field streams along the
    // current universe-flow direction (component-wise vec3 mod — GLSL's mod()
    // is defined component-wise for vecN). At zero scroll this reduces to the
    // identity (position already lies in-range), so boot rendering is exact.
    vec3 p = mod(position - uScrollVec - uMin, uSpan) + uMin;

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
  const brightness = new Float32Array(n);

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
    // Magnitude distribution: cube-skewed toward 0 so most stars are dim and
    // small, with a few bright, large outliers — a real-sky look rather than
    // uniform dot density.
    const mag = Math.pow(rand(), 3);
    sizes[i] = opts.sizeMin + mag * (opts.sizeMax - opts.sizeMin);
    brightness[i] = 0.32 + mag * 0.8;
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
  geo.setAttribute('brightness', new THREE.BufferAttribute(brightness, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScrollVec: { value: new THREE.Vector3(0, 0, 0) },
      uMin: { value: new THREE.Vector3(-opts.xHalf, -opts.yHalf, opts.zMin) },
      uSpan: { value: new THREE.Vector3(opts.xHalf * 2, opts.yHalf * 2, opts.span) },
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

/**
 * Set the streaming/twinkle uniforms on a star layer.
 *
 * `scrollVec` is normally a THREE.Vector3 (the accumulated ∫flowW·dt from
 * starfield.ts/director.ts). A plain `number` is also accepted — legacy +Z-
 * only scroll, kept for the pocket-world callers under src/world/worlds/
 * (e.g. riftSky.ts's `setStarUniforms(stars, t, 0)`, twinkle-only, no forward
 * travel) that this lane does not touch.
 */
export function setStarUniforms(
  points: THREE.Points,
  time: number,
  scrollVec: THREE.Vector3 | number,
): void {
  const mat = points.material;
  if (mat instanceof THREE.ShaderMaterial) {
    (mat.uniforms['uTime'] as THREE.IUniform<number>).value = time;
    const scrollUniform = mat.uniforms['uScrollVec'] as THREE.IUniform<THREE.Vector3>;
    if (typeof scrollVec === 'number') {
      scrollUniform.value.set(0, 0, scrollVec);
    } else {
      scrollUniform.value.copy(scrollVec);
    }
  }
}

/** Dispose a star layer's geometry + material. */
export function disposeStarLayer(points: THREE.Points): void {
  points.geometry.dispose();
  if (points.material instanceof THREE.Material) points.material.dispose();
}
