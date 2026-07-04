/**
 * src/world/worlds/verdantLife.ts — the mineral spring scannable + the
 * firefly Points system for the VERDANT glade. Split out of verdantFlora.ts
 * to keep both files under the 300-line cap.
 */
import * as THREE from 'three';
import { makeRng } from '../../fx/space/rng.js';
import { verdantFireflySpriteTexture } from './verdantTextures.js';
import { makeWaveGlowMesh } from './verdantFlora.js';

const FIREFLY_SEED = 0x7b04;
const GLOW_TEAL = 0x66f2e2;
const GLOW_VIOLET = 0xa878ff;

export interface SpringHandle {
  group: THREE.Group;
  glowMesh: THREE.Mesh;
  position: THREE.Vector3;
  dispose(): void;
}

/** A shallow mineral-rich glowing pool — the 4th non-creature scannable. */
export function buildMineralSpring(x: number, z: number, g: (x: number, z: number) => number): SpringHandle {
  const y = g(x, z);
  const group = new THREE.Group();
  group.name = 'verdant-spring';

  const rimGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.22, 16);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x556b5e, roughness: 0.9, metalness: 0.05 });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.set(x, y + 0.08, z);
  rim.castShadow = true;
  group.add(rim);

  const surfGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.02, 20);
  const glowMesh = makeWaveGlowMesh(surfGeo, GLOW_TEAL, 0, 0.6, 0.55, 1.3);
  glowMesh.position.set(x, y + 0.2, z);
  group.add(glowMesh);

  return {
    group,
    glowMesh,
    position: new THREE.Vector3(x, y + 0.2, z),
    dispose(): void {
      rimGeo.dispose(); rimMat.dispose();
      surfGeo.dispose(); (glowMesh.material as THREE.Material).dispose();
    },
  };
}

export interface FireflyHandle {
  points: THREE.Points;
  update(dt: number): void;
  dispose(): void;
}

/** One combined Points system: fireflies drift near every flora cluster center passed in. */
export function buildFireflies(centers: THREE.Vector3[]): FireflyHandle {
  const rng = makeRng(FIREFLY_SEED);
  const perCluster = 9;
  const count = centers.length * perCluster;
  const positions = new Float32Array(count * 3);
  const base = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const teal = new THREE.Color(GLOW_TEAL);
  const violet = new THREE.Color(GLOW_VIOLET);

  let idx = 0;
  for (const c of centers) {
    for (let i = 0; i < perCluster; i++) {
      const ang = rng() * Math.PI * 2;
      const rad = Math.sqrt(rng()) * 2.6;
      const x = c.x + Math.cos(ang) * rad;
      const z = c.z + Math.sin(ang) * rad;
      const y = c.y + rng.range(0.4, 1.9);
      positions[idx * 3] = x; positions[idx * 3 + 1] = y; positions[idx * 3 + 2] = z;
      base[idx * 3] = x; base[idx * 3 + 1] = y; base[idx * 3 + 2] = z;
      phase[idx] = rng() * Math.PI * 2;
      const col = rng() < 0.65 ? teal : violet;
      colors[idx * 3] = col.r; colors[idx * 3 + 1] = col.g; colors[idx * 3 + 2] = col.b;
      idx++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.22,
    sizeAttenuation: true,
    map: verdantFireflySpriteTexture(),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    fog: false, // additive glow motes must not tint toward the fog color
  });
  const points = new THREE.Points(geo, mat);
  points.name = 'verdant-fireflies';
  const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
  const colAttr = geo.getAttribute('color') as THREE.BufferAttribute;

  let t = 0;
  return {
    points,
    update(dt: number): void {
      t += dt;
      for (let i = 0; i < count; i++) {
        const ph = phase[i];
        const bob = Math.sin(t * 0.4 + ph) * 0.3;
        const swirl = t * 0.2 + ph;
        const dx = Math.cos(swirl) * 0.35;
        const dz = Math.sin(swirl) * 0.35;
        posAttr.setXYZ(i, base[i * 3] + dx, base[i * 3 + 1] + bob, base[i * 3 + 2] + dz);
        const flick = 0.55 + 0.45 * Math.sin(t * 2.2 + ph * 3.0);
        colAttr.setXYZ(i, colors[i * 3] * flick, colors[i * 3 + 1] * flick, colors[i * 3 + 2] * flick);
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    },
    dispose(): void {
      geo.dispose();
      mat.map?.dispose();
      mat.dispose();
    },
  };
}
