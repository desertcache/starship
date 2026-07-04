/**
 * src/world/worlds/riftFeatures.ts — RIFT set-dressing: spawn dais, the
 * relic (prismatic shard + pedestal on the side island), the gravity-
 * defying "waterfall of light", and the 4 non-creature scannables. Edge/
 * bridge rail crystals live in riftCrystals.ts (they're just more cluster
 * instances in the same InstancedMesh draw call) — this file is everything
 * ELSE that reads/scans/collects.
 */

import * as THREE from 'three';
import type { Interactable } from '../types.js';
import { recordScan, collectRelic, getCodex } from '../../core/state.js';
import { showRoomToast } from '../../ui/hud.js';
import type { ClusterInfo } from './riftCrystals.js';

/** Shared layout constants so rift.ts can place lights/cameras against the
 *  exact same points without re-deriving coordinates. */
export const RIFT_LAYOUT = {
  spawn: { x: -13, z: -2 },
  portal: { x: -17, z: -4 },
  waterfall: { x: 17, z: 8 },
  undersideView: { x: 0, z: -20.5 },
  relic: { x: 39.5, z: 1.0 },
};

const WATERFALL_H = 7.2;
const WATERFALL_N = 90;

const FALLS_VERT = /* glsl */ `
attribute float aY0;
attribute vec2 aJitter;
uniform float uTime;
varying float vAlpha;
void main() {
  float H = ${WATERFALL_H.toFixed(1)};
  float y = mod(aY0 - uTime * 1.6, H);
  vec3 pos = position + vec3(aJitter.x, y, aJitter.y);
  vAlpha = smoothstep(0.0, 0.9, y) * smoothstep(H, H - 1.4, y);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 5.0 * (36.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const FALLS_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D map;
uniform vec3 uColorLo;
uniform vec3 uColorHi;
varying float vAlpha;
void main() {
  vec4 tex = texture2D(map, gl_PointCoord);
  vec3 col = mix(uColorLo, uColorHi, vAlpha);
  gl_FragColor = vec4(col * 1.4, tex.a * vAlpha * 0.9);
}`;

export interface RiftFeatures {
  group: THREE.Group;
  interactables: Interactable[];
  relicPosition: THREE.Vector3;
  update(dt: number): void;
  dispose(): void;
}

export function buildRiftFeatures(
  groundHeight: (x: number, z: number) => number,
  sparkSprite: THREE.Texture,
  biggestCluster: ClusterInfo,
): RiftFeatures {
  const group = new THREE.Group();
  group.name = 'rift-features';
  const disposers: (() => void)[] = [];
  const interactables: Interactable[] = [];

  // ── Spawn dais ───────────────────────────────────────────────────────────
  const spawnY = groundHeight(RIFT_LAYOUT.spawn.x, RIFT_LAYOUT.spawn.z);
  // Small + dark so the hero shot's near-field platform reads as cut crystal,
  // not a flat lavender pancake (first-pass screenshot failure).
  const daisGeo = new THREE.CylinderGeometry(1.55, 1.75, 0.14, 6);
  const daisMat = new THREE.MeshStandardMaterial({
    color: '#241338', emissive: '#6a4fd0', emissiveIntensity: 0.22, roughness: 0.3, metalness: 0.2,
  });
  const dais = new THREE.Mesh(daisGeo, daisMat);
  dais.position.set(RIFT_LAYOUT.spawn.x, spawnY + 0.08, RIFT_LAYOUT.spawn.z);
  group.add(dais);
  disposers.push(() => { daisGeo.dispose(); daisMat.dispose(); });

  // ── PRISM CHORUS scannable (the biggest crystal cluster) ────────────────
  interactables.push({
    id: 'rift-prism-chorus', prompt: 'Scan PRISM CHORUS', radius: 3.4,
    position: biggestCluster.position.clone().add(new THREE.Vector3(0, 1, 0)),
    onInteract: (): void => {
      const fresh = recordScan('rift-prism-chorus');
      showRoomToast(fresh ? 'CATALOGUED · PRISM CHORUS' : 'KNOWN · PRISM CHORUS');
    },
  });

  // ── The bridge itself (mesh named 'rift-bridge' in riftIslands.ts) ──────
  const bridgeMid = new THREE.Vector3(27, groundHeight(27, 0) + 1, 0);
  interactables.push({
    id: 'rift-bridge', prompt: 'Scan THE THRESHOLD SPAN', radius: 3.2, position: bridgeMid,
    onInteract: (): void => {
      const fresh = recordScan('rift-bridge');
      showRoomToast(fresh ? 'CATALOGUED · THE THRESHOLD SPAN' : 'KNOWN · THE THRESHOLD SPAN');
    },
  });

  // ── Underside overlook marker (small emissive crystal at the south rim) ─
  const uvY = groundHeight(RIFT_LAYOUT.undersideView.x, RIFT_LAYOUT.undersideView.z);
  const markGeo = new THREE.ConeGeometry(0.35, 1.1, 6);
  const markMat = new THREE.MeshStandardMaterial({ color: '#2a1840', emissive: '#5ae6ff', emissiveIntensity: 0.6, roughness: 0.4 });
  const marker = new THREE.Mesh(markGeo, markMat);
  marker.position.set(RIFT_LAYOUT.undersideView.x, uvY + 0.55, RIFT_LAYOUT.undersideView.z);
  group.add(marker);
  disposers.push(() => { markGeo.dispose(); markMat.dispose(); });
  interactables.push({
    id: 'rift-underside', prompt: 'Scan THE HOLLOW ROOT', radius: 3.0,
    position: marker.position.clone(),
    onInteract: (): void => {
      const fresh = recordScan('rift-underside');
      showRoomToast(fresh ? 'CATALOGUED · THE HOLLOW ROOT' : 'KNOWN · THE HOLLOW ROOT');
    },
  });

  // ── Gravity-defying waterfall of light ───────────────────────────────────
  const wfY = groundHeight(RIFT_LAYOUT.waterfall.x, RIFT_LAYOUT.waterfall.z);
  const fPos = new Float32Array(WATERFALL_N * 3);
  const fY0 = new Float32Array(WATERFALL_N);
  const fJit = new Float32Array(WATERFALL_N * 2);
  const fRng = ((): (() => number) => { let s = 0x71F5; return (): number => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; }; })();
  for (let i = 0; i < WATERFALL_N; i++) {
    fPos[i * 3] = RIFT_LAYOUT.waterfall.x;
    fPos[i * 3 + 1] = wfY - 2.2;
    fPos[i * 3 + 2] = RIFT_LAYOUT.waterfall.z;
    fY0[i] = fRng() * WATERFALL_H;
    const a = fRng() * Math.PI * 2, r = fRng() * 0.55;
    fJit[i * 2] = Math.cos(a) * r;
    fJit[i * 2 + 1] = Math.sin(a) * r;
  }
  const fGeo = new THREE.BufferGeometry();
  fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
  fGeo.setAttribute('aY0', new THREE.BufferAttribute(fY0, 1));
  fGeo.setAttribute('aJitter', new THREE.BufferAttribute(fJit, 2));
  const fMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, map: { value: sparkSprite }, uColorLo: { value: new THREE.Color('#7a3fff') }, uColorHi: { value: new THREE.Color('#5ae6ff') } },
    vertexShader: FALLS_VERT, fragmentShader: FALLS_FRAG,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const falls = new THREE.Points(fGeo, fMat);
  falls.name = 'rift-light-falls';
  falls.frustumCulled = false;
  group.add(falls);
  disposers.push(() => { fGeo.dispose(); fMat.dispose(); });
  interactables.push({
    id: 'rift-light-falls', prompt: 'Scan the LIGHTFALL', radius: 3.6,
    position: new THREE.Vector3(RIFT_LAYOUT.waterfall.x, wfY + 1.5, RIFT_LAYOUT.waterfall.z),
    onInteract: (): void => {
      const fresh = recordScan('rift-light-falls');
      showRoomToast(fresh ? 'CATALOGUED · LIGHTFALL' : 'KNOWN · LIGHTFALL');
    },
  });

  // ── Relic: prismatic shard hovering over a pedestal ──────────────────────
  const relicY = groundHeight(RIFT_LAYOUT.relic.x, RIFT_LAYOUT.relic.z);
  const pedGeo = new THREE.CylinderGeometry(0.55, 0.7, 0.9, 8);
  const pedMat = new THREE.MeshStandardMaterial({ color: '#241338', emissive: '#4a2d63', emissiveIntensity: 0.25, roughness: 0.6 });
  const pedestal = new THREE.Mesh(pedGeo, pedMat);
  pedestal.position.set(RIFT_LAYOUT.relic.x, relicY + 0.45, RIFT_LAYOUT.relic.z);
  group.add(pedestal);
  disposers.push(() => { pedGeo.dispose(); pedMat.dispose(); });

  const shardGeo = new THREE.OctahedronGeometry(0.42, 0).toNonIndexed();
  shardGeo.computeVertexNormals();
  // F15 (Stage E): unify relic grammar — verdant's + ashfall's relic
  // materials are already toneMapped:false (bright, readable, ACES-immune);
  // this one wasn't, so it read duller/muddier than the other two pickups.
  const shardMat = new THREE.MeshStandardMaterial({
    color: '#e6d8ff', emissive: '#c060ff', emissiveIntensity: 1.5, roughness: 0.15, metalness: 0.1,
    toneMapped: false,
  });
  const shard = new THREE.Mesh(shardGeo, shardMat);
  const shardBaseY = relicY + 1.6;
  shard.position.set(RIFT_LAYOUT.relic.x, shardBaseY, RIFT_LAYOUT.relic.z);
  shard.scale.set(0.9, 1.8, 0.9);
  group.add(shard);
  disposers.push(() => { shardGeo.dispose(); shardMat.dispose(); });

  const relicPosition = shard.position.clone();
  const relicIA: Interactable = {
    id: 'rift-relic', prompt: 'Take the RIFT SHARD', radius: 2.6, position: relicPosition,
    onInteract: (): void => {
      const fresh = collectRelic('rift');
      if (fresh) { shard.visible = false; showRoomToast('RELIC RECOVERED · RIFT SHARD'); }
      else showRoomToast('RIFT SHARD ALREADY HELD');
    },
  };
  // v1.0 THRESHOLD Stage D: already-collected relics must not be re-offered
  // after a loadState() reload — hide the shard and never hand out the
  // pickup interactable for it.
  const riftRelicHeld = getCodex().relics.includes('rift');
  if (riftRelicHeld) shard.visible = false;
  else interactables.push(relicIA);

  let t = 0;
  return {
    group, interactables, relicPosition,
    update(dt: number): void {
      t += dt;
      (fMat.uniforms['uTime'] as THREE.IUniform<number>).value = t;
      if (shard.visible) {
        shard.rotation.y = t * 0.8;
        shard.position.y = shardBaseY + Math.sin(t * 1.1) * 0.18;
        relicPosition.y = shard.position.y;
      }
    },
    dispose(): void { for (const d of disposers) d(); },
  };
}
