/**
 * src/fx/creatures/index.ts — spawnCreatures VISIBLE STUB (Stage A).
 *
 * Each creature = a palette-tinted capsule at a SEEDED position (never
 * Math.random) with a gentle bob, plus a working scannable Interactable whose
 * `.position` is synced every update. The signature is FROZEN; the Stage-C
 * Opus creature lane replaces the internals (builder/animate/behavior) without
 * touching it. World lanes build and art-gate against this stub.
 */

import * as THREE from 'three';
import type { CreatureSpec, CreatureHandles } from '../../core/worldTypes.js';
import type { Interactable } from '../../world/types.js';
import { makeRng } from '../space/rng.js';
import { recordScan } from '../../core/state.js';
import { showRoomToast } from '../../ui/hud.js';

interface Stub {
  root: THREE.Group;
  ia: Interactable;
  baseY: number;
  meshY: number;
  bob: number;
  phase: number;
  gaitHz: number;
}

export function spawnCreatures(
  specs: CreatureSpec[],
  groundHeight: (x: number, z: number) => number,
  center: THREE.Vector3,
): CreatureHandles {
  const group = new THREE.Group();
  group.name = 'creatures';
  const interactables: Interactable[] = [];
  const stubs: Stub[] = [];
  const geos: THREE.BufferGeometry[] = [];
  const mats: THREE.Material[] = [];

  for (const spec of specs) {
    const rng = makeRng(spec.seed);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(spec.palette.primary),
      emissive: new THREE.Color(spec.palette.emissive),
      emissiveIntensity: 0.45,
      roughness: 0.6,
      metalness: 0.05,
    });
    // One shared capsule geometry per species (herd shares geometry).
    const geo = new THREE.CapsuleGeometry(spec.sizeM * 0.28, spec.sizeM * 0.7, 4, 10);
    geos.push(geo);
    mats.push(mat);

    for (let i = 0; i < spec.count; i++) {
      const ang = rng() * Math.PI * 2;
      const rad = Math.sqrt(rng()) * spec.roamRadius; // even area distribution
      const x = center.x + Math.cos(ang) * rad;
      const z = center.z + Math.sin(ang) * rad;
      const gy = groundHeight(x, z);
      const meshY = spec.sizeM * 0.5;
      const id = `${spec.id}#${i}`;

      const root = new THREE.Group();
      root.name = id; // raycast ancestor-name match resolves to this creature
      root.position.set(x, gy, z);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = meshY;
      mesh.castShadow = true;
      root.add(mesh);
      group.add(root);

      const ia: Interactable = {
        id,
        prompt: `Scan ${spec.scanName}`,
        radius: 2.6,
        position: new THREE.Vector3(x, gy + meshY, z),
        onInteract: (): void => {
          const fresh = recordScan(spec.id);
          showRoomToast(fresh ? `CATALOGUED · ${spec.scanName}` : `KNOWN · ${spec.scanName}`);
        },
      };
      interactables.push(ia);
      stubs.push({
        root, ia, baseY: gy, meshY,
        bob: Math.max(0.05, spec.sizeM * 0.08),
        phase: rng() * Math.PI * 2,
        gaitHz: spec.gaitHz,
      });
    }
  }

  let t = 0;
  return {
    group,
    interactables,
    update(dt: number, _playerPos: THREE.Vector3): void {
      t += dt;
      for (const s of stubs) {
        const y = s.baseY + (Math.sin(t * s.gaitHz * Math.PI * 2 + s.phase) * 0.5 + 0.5) * s.bob;
        s.root.position.y = y;
        s.ia.position.set(s.root.position.x, y + s.meshY, s.root.position.z);
      }
    },
    dispose(): void {
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
    },
  };
}
