/**
 * src/world/worlds/riftCrystals.ts — RIFT crystal flora: ONE InstancedMesh
 * (all clusters + edge-rail + bridge-rail crystals share one draw call) with
 * a bespoke ShaderMaterial driving the Livingness T1 propagating wave, plus
 * ONE Points system of drifting spark motes near the flora.
 *
 * Wave math (T1 — never uniform pulses):
 *   - LOCAL:  each instance carries `aPhase` = its distance (m) from its own
 *     cluster's center. `sin(uTime*LOCAL_FREQ - aPhase*LOCAL_K)` is therefore
 *     an outward-expanding ripple that visibly sweeps crystal-to-crystal
 *     within a cluster, continuously.
 *   - GLOBAL: each instance also carries `aClusterDist` = its CLUSTER's
 *     distance (m) from the main island's center. A narrow envelope
 *     `pow(max(0,cos(uTime*GLOBAL_FREQ - aClusterDist*GLOBAL_K)),10)` is near
 *     -zero almost always and spikes into a bright band only when its phase
 *     aligns — reads as an "occasional" surge that visibly travels outward
 *     cluster-to-cluster as uTime advances (bigger aClusterDist = later
 *     spike), not a synchronized blink.
 *
 * No scene-light sampling (self-lit gems, matching this codebase's emissive
 * convention — glow.ts's LED/halation/underglow materials are the same
 * "always self-lit regardless of scene lighting" pattern). Raw linear output
 * (no tonemapping/colorspace includes), matching starLayer.ts/portalShader.ts.
 */

import * as THREE from 'three';
import { makeRng, type Rng } from '../../fx/space/rng.js';
import { riftSparkSprite } from './riftTextures.js';

type ClusterLayout =
  | { kind: 'radial'; id: string; center: [number, number]; count: number; sizeMin: number; sizeMax: number; spread: number }
  | { kind: 'ring'; id: string; centerX: number; centerZ: number; radius: number; count: number; excludeAngle: number; excludeHalfWindow: number; size: number }
  | { kind: 'line'; id: string; x0: number; x1: number; z: number; count: number; size: number };

export interface ClusterInfo { id: string; position: THREE.Vector3; radius: number; biggest?: boolean }

const HUES: [number, number, number][] = [
  [0.62, 0.35, 1.0],  // violet
  [1.0, 0.32, 0.86],  // magenta
  [0.35, 0.95, 1.0],  // cyan
];

const LOCAL_FREQ = 1.6, LOCAL_K = 1.15, GLOBAL_FREQ = 0.16, GLOBAL_K = 0.1;

const VERT = /* glsl */ `
attribute float aPhase;
attribute float aClusterDist;
attribute vec3 aColor;
attribute float aBase;
uniform float uTime;
varying vec3 vColor;
varying float vWave;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
void main() {
  vColor = aColor;
  vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vWorldNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  float localWave = sin(uTime * ${LOCAL_FREQ.toFixed(2)} - aPhase * ${LOCAL_K.toFixed(2)});
  float globalPulse = pow(max(0.0, cos(uTime * ${GLOBAL_FREQ.toFixed(2)} - aClusterDist * ${GLOBAL_K.toFixed(2)})), 10.0);
  vWave = aBase * (0.5 + 0.5 * localWave) * 0.7 + globalPulse * 1.7;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}`;

const FRAG = /* glsl */ `
precision highp float;
varying vec3 vColor;
varying float vWave;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
void main() {
  float fresnel = pow(1.0 - clamp(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0, 1.0), 2.2);
  vec3 core = vColor * (0.5 + vWave);
  vec3 rim = vColor * fresnel * 1.5;
  // F13 (Stage E): cap the peak (never touches the wave math above) — when a
  // cluster sits close to camera, many overlapping crystals each hitting the
  // old uncapped peak bloomed into one solid mass. Capping keeps individual
  // diamond silhouettes readable through bloom at any distance.
  vec3 litColor = min(core + rim, vec3(2.0));
  gl_FragColor = vec4(litColor, 1.0);
}`;

const MOTE_VERT = /* glsl */ `
attribute vec3 aSeed; // x:freq, y:phase, z:amp
attribute vec3 aColor;
uniform float uTime;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vColor = aColor;
  float f = aSeed.x, p = aSeed.y, amp = aSeed.z;
  vec3 pos = position + vec3(
    sin(uTime * f + p) * amp,
    sin(uTime * f * 1.3 + p * 1.7) * amp * 0.6,
    cos(uTime * f * 0.8 + p * 2.1) * amp
  );
  vAlpha = 0.45 + 0.45 * sin(uTime * f * 2.0 + p);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 6.0 * (40.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const MOTE_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D map;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 tex = texture2D(map, gl_PointCoord);
  gl_FragColor = vec4(vColor * 1.3, tex.a * vAlpha * 0.85);
}`;

const CLUSTERS: ClusterLayout[] = [
  { kind: 'radial', id: 'rift-prism-chorus', center: [2, 5], count: 10, sizeMin: 1.1, sizeMax: 2.8, spread: 3.6 },
  { kind: 'radial', id: 'rift-cluster-b', center: [12, -8], count: 6, sizeMin: 0.7, sizeMax: 1.8, spread: 2.4 },
  { kind: 'radial', id: 'rift-cluster-c', center: [-10, 10], count: 5, sizeMin: 0.6, sizeMax: 1.6, spread: 2.0 },
  { kind: 'radial', id: 'rift-cluster-d', center: [-13, -11], count: 5, sizeMin: 0.6, sizeMax: 1.5, spread: 2.0 },
  // Near-field framing for the hero cam (right edge of frame, ~11m out).
  { kind: 'radial', id: 'rift-cluster-e', center: [-6, -9], count: 4, sizeMin: 0.5, sizeMax: 1.3, spread: 1.6 },
  { kind: 'radial', id: 'rift-cluster-relic', center: [38.5, -2.2], count: 4, sizeMin: 0.5, sizeMax: 1.2, spread: 1.6 },
  { kind: 'radial', id: 'rift-cluster-relic-b', center: [36.5, 2.6], count: 3, sizeMin: 0.4, sizeMax: 0.9, spread: 1.0 },
  { kind: 'ring', id: 'rift-main-rail', centerX: 0, centerZ: 0, radius: 21.6, count: 22, excludeAngle: 0, excludeHalfWindow: 0.28, size: 0.55 },
  { kind: 'ring', id: 'rift-side-rail', centerX: 37.5, centerZ: 0, radius: 5.4, count: 12, excludeAngle: Math.PI, excludeHalfWindow: 0.32, size: 0.4 },
  { kind: 'line', id: 'rift-bridge-rail-a', x0: 23.2, x1: 31.8, z: -1.35, count: 6, size: 0.4 },
  { kind: 'line', id: 'rift-bridge-rail-b', x0: 23.2, x1: 31.8, z: 1.35, count: 6, size: 0.4 },
];

export interface RiftCrystals {
  mesh: THREE.InstancedMesh;
  motes: THREE.Points;
  clusters: ClusterInfo[];
  biggest: ClusterInfo;
  update(dt: number): void;
  dispose(): void;
}

export function buildRiftCrystals(seed: number, groundHeight: (x: number, z: number) => number): RiftCrystals {
  const rng = makeRng(seed);
  // Flat-faceted shading (non-indexed + recomputed normals) so each triangle
  // reads as a distinct crystal facet instead of a smooth diamond blob.
  const geo = new THREE.OctahedronGeometry(1, 0).toNonIndexed();
  geo.computeVertexNormals();

  interface Inst { x: number; y: number; z: number; size: number; rotY: number; phase: number; clusterDist: number; hue: [number, number, number]; base: number }
  const insts: Inst[] = [];
  const clusters: ClusterInfo[] = [];

  function pushCluster(cx: number, cz: number, entries: { x: number; z: number; size: number; localR: number }[], id: string, r: number): void {
    const dist = Math.hypot(cx, cz);
    const hue = HUES[rng.int(0, HUES.length - 1)];
    for (const e of entries) {
      insts.push({
        x: e.x, y: groundHeight(e.x, e.z), z: e.z, size: e.size,
        rotY: rng.range(0, Math.PI * 2), phase: e.localR, clusterDist: dist,
        hue: rng.pick([0.6, 0.25, 0.15]) === 0 ? hue : HUES[rng.int(0, HUES.length - 1)], base: rng.range(0.75, 1.15),
      });
    }
    clusters.push({ id, position: new THREE.Vector3(cx, groundHeight(cx, cz), cz), radius: r });
  }

  for (const c of CLUSTERS) {
    if (c.kind === 'radial') {
      const entries = [];
      for (let i = 0; i < c.count; i++) {
        const a = rng.range(0, Math.PI * 2);
        const r = Math.sqrt(rng()) * c.spread;
        const x = c.center[0] + Math.cos(a) * r, z = c.center[1] + Math.sin(a) * r;
        entries.push({ x, z, size: rng.range(c.sizeMin, c.sizeMax), localR: r });
      }
      pushCluster(c.center[0], c.center[1], entries, c.id, c.spread);
    } else if (c.kind === 'ring') {
      const entries = [];
      for (let i = 0; i < c.count; i++) {
        const a = (i / c.count) * Math.PI * 2;
        const diff = Math.atan2(Math.sin(a - c.excludeAngle), Math.cos(a - c.excludeAngle));
        if (Math.abs(diff) < c.excludeHalfWindow) continue;
        const x = c.centerX + Math.cos(a) * c.radius, z = c.centerZ + Math.sin(a) * c.radius;
        entries.push({ x, z, size: c.size * rng.range(0.8, 1.2), localR: a * c.radius });
      }
      pushCluster(c.centerX, c.centerZ, entries, c.id, c.radius);
    } else {
      const entries = [];
      for (let i = 0; i < c.count; i++) {
        const t = i / Math.max(1, c.count - 1);
        const x = THREE.MathUtils.lerp(c.x0, c.x1, t);
        entries.push({ x, z: c.z, size: c.size * rng.range(0.85, 1.15), localR: t * (c.x1 - c.x0) });
      }
      pushCluster((c.x0 + c.x1) / 2, c.z, entries, c.id, (c.x1 - c.x0) / 2);
    }
  }

  const mesh = new THREE.InstancedMesh(geo, makeCrystalMaterial(), insts.length);
  mesh.name = 'rift-crystals';
  const aPhase = new Float32Array(insts.length);
  const aClusterDist = new Float32Array(insts.length);
  const aColor = new Float32Array(insts.length * 3);
  const aBase = new Float32Array(insts.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), euler = new THREE.Euler();
  insts.forEach((it, i) => {
    euler.set(rng.signed(0.12), it.rotY, rng.signed(0.12));
    q.setFromEuler(euler);
    m4.compose(new THREE.Vector3(it.x, it.y + it.size, it.z), q, new THREE.Vector3(it.size * 0.42, it.size * 1.05, it.size * 0.42));
    mesh.setMatrixAt(i, m4);
    aPhase[i] = it.phase; aClusterDist[i] = it.clusterDist; aBase[i] = it.base;
    aColor[i * 3] = it.hue[0]; aColor[i * 3 + 1] = it.hue[1]; aColor[i * 3 + 2] = it.hue[2];
  });
  mesh.instanceMatrix.needsUpdate = true;
  geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(aPhase, 1));
  geo.setAttribute('aClusterDist', new THREE.InstancedBufferAttribute(aClusterDist, 1));
  geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(aColor, 3));
  geo.setAttribute('aBase', new THREE.InstancedBufferAttribute(aBase, 1));

  const biggest = clusters.find((c) => c.id === 'rift-prism-chorus') ?? clusters[0];
  clusters.forEach((c) => { if (c.id === biggest.id) c.biggest = true; });

  const motes = buildMotes(clusters.filter((c) => c.radius <= 4), rng);

  const mats: THREE.Material[] = [mesh.material as THREE.Material, motes.material as THREE.Material];
  let t = 0;
  return {
    mesh, motes, clusters, biggest,
    update(dt: number): void {
      t += dt;
      ((mesh.material as THREE.ShaderMaterial).uniforms['uTime'] as THREE.IUniform<number>).value = t;
      ((motes.material as THREE.ShaderMaterial).uniforms['uTime'] as THREE.IUniform<number>).value = t;
    },
    dispose(): void {
      geo.dispose();
      motes.geometry.dispose();
      for (const m of mats) m.dispose();
    },
  };
}

function makeCrystalMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: VERT,
    fragmentShader: FRAG,
  });
}

function buildMotes(clusters: ClusterInfo[], rng: Rng): THREE.Points {
  const perCluster = 10;
  const n = Math.max(1, clusters.length) * perCluster;
  const positions = new Float32Array(n * 3);
  const seeds = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  let i = 0;
  for (const c of clusters.length ? clusters : [{ position: new THREE.Vector3(0, 1, 0), radius: 3, id: 'x' } as ClusterInfo]) {
    for (let k = 0; k < perCluster; k++, i++) {
      const a = rng.range(0, Math.PI * 2);
      const r = rng.range(0.4, c.radius * 0.9 + 1);
      positions[i * 3] = c.position.x + Math.cos(a) * r;
      positions[i * 3 + 1] = c.position.y + rng.range(0.4, 2.4);
      positions[i * 3 + 2] = c.position.z + Math.sin(a) * r;
      seeds[i * 3] = rng.range(0.15, 0.5);
      seeds[i * 3 + 1] = rng.range(0, Math.PI * 2);
      seeds[i * 3 + 2] = rng.range(0.3, 0.9);
      const hue = HUES[rng.int(0, HUES.length - 1)];
      colors[i * 3] = hue[0]; colors[i * 3 + 1] = hue[1]; colors[i * 3 + 2] = hue[2];
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, map: { value: riftSparkSprite() } },
    vertexShader: MOTE_VERT,
    fragmentShader: MOTE_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(geo, mat);
  pts.name = 'rift-motes';
  pts.frustumCulled = false;
  return pts;
}
