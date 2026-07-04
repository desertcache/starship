/**
 * src/world/worlds/ashfallVolcanics.ts — cooled lava flow mound + hidden relic
 * and fumarole vents for the ASHFALL pocket world (Stage C). The propagating
 * crack-network overlay lives in ashfallCracks.ts (300-line cap split); its
 * pulse waves originate at FUMAROLE_POSITIONS exported here.
 */
import * as THREE from 'three';
import { makeRng } from '../../fx/space/rng.js';
import type { AABB, Interactable } from '../types.js';
import { collectRelic, recordScan } from '../../core/state.js';
import { showRoomToast } from '../../ui/hud.js';

/** Fixed, deterministic vent positions — also the crack-wave pulse origins. */
export const FUMAROLE_POSITIONS: ReadonlyArray<{ x: number; z: number }> = [
  { x: 17, z: 22 },
  { x: -20, z: 8 },
  { x: 6, z: -18 },
];

const MOUND_LOBE_A = { x: 3, z: 20, radius: 3.2 };
const MOUND_LOBE_B = { x: 13, z: 20, radius: 3.2 };
export const RELIC_POSITION = new THREE.Vector3(8, 0, 19.5);

const ROCK_SEED = 0xa5fa81;

// ── Cooled lava flow mound + hidden relic ────────────────────────────────────

function makeBlobGeometry(seed: number, detail: 1 | 2): THREE.IcosahedronGeometry {
  const rng = makeRng(seed);
  const geo = new THREE.IcosahedronGeometry(1, detail);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const f = 1 + rng.signed(0.22);
    pos.setXYZ(i, pos.getX(i) * f, pos.getY(i) * f, pos.getZ(i) * f);
  }
  geo.computeVertexNormals();
  return geo;
}

export interface CooledFlowMound {
  group: THREE.Group;
  colliders: AABB[];
  /** "Take the Ember Core" pickup → collectRelic('ashfall'). */
  relicInteractable: Interactable;
  /** "Scan COOLED FLOW" → recordScan('ashfall-cooled-flow'). */
  scanInteractable: Interactable;
  dispose(): void;
}

/** Two flanking rock lobes with a walkable gap; the relic core glows inside it. */
export function buildCooledFlowMound(groundHeight: (x: number, z: number) => number): CooledFlowMound {
  const group = new THREE.Group();
  group.name = 'ashfall-cooled-flow';

  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x171310, roughness: 0.92, metalness: 0.04,
    emissive: 0x220a02, emissiveIntensity: 0.1,
  });
  const geos: THREE.BufferGeometry[] = [];

  for (const [lobe, seed, heightScale] of [
    [MOUND_LOBE_A, ROCK_SEED, 2.6],
    [MOUND_LOBE_B, ROCK_SEED ^ 0x9, 2.9],
  ] as [{ x: number; z: number; radius: number }, number, number][]) {
    const geo = makeBlobGeometry(seed, 1);
    geos.push(geo);
    const mesh = new THREE.Mesh(geo, rockMat);
    const gy = groundHeight(lobe.x, lobe.z);
    mesh.position.set(lobe.x, gy + heightScale * 0.55, lobe.z);
    mesh.scale.set(lobe.radius, heightScale, lobe.radius * 0.9);
    mesh.castShadow = true;
    group.add(mesh);
  }

  // Small connector boulder behind, tying the two lobes into one flow feature.
  const connGeo = makeBlobGeometry(ROCK_SEED ^ 0x3, 1);
  geos.push(connGeo);
  const connGy = groundHeight(8, 22.5);
  const conn = new THREE.Mesh(connGeo, rockMat);
  conn.position.set(8, connGy + 0.9, 22.5);
  conn.scale.set(2.6, 1.5, 2.0);
  conn.castShadow = true;
  group.add(conn);

  // Relic: dark-glass core glowing ember-orange, tucked in the gap.
  const relicGy = groundHeight(RELIC_POSITION.x, RELIC_POSITION.z);
  RELIC_POSITION.y = relicGy + 0.5;
  const relicGeo = new THREE.IcosahedronGeometry(0.24, 1);
  geos.push(relicGeo);
  const relicMat = new THREE.MeshStandardMaterial({
    color: 0x0a0508, roughness: 0.15, metalness: 0.3,
    emissive: 0xff5a1f, emissiveIntensity: 1.3, toneMapped: false,
  });
  const relicMesh = new THREE.Mesh(relicGeo, relicMat);
  relicMesh.position.copy(RELIC_POSITION);
  relicMesh.name = 'ashfall-relic-core';
  relicMesh.onBeforeRender = (): void => {
    const t = performance.now() / 1000;
    relicMat.emissiveIntensity = 1.1 + 0.3 * Math.sin(t * 2.4);
  };
  group.add(relicMesh);

  const relicInteractable: Interactable = {
    id: 'ashfall-relic-core',
    prompt: 'Take the Ember Core',
    radius: 2.2,
    position: relicMesh.position.clone(),
    onInteract: (): void => {
      const fresh = collectRelic('ashfall');
      if (fresh) {
        relicMesh.visible = false;
        showRoomToast('RELIC RECOVERED · EMBER CORE');
      } else {
        showRoomToast('KNOWN · EMBER CORE');
      }
    },
  };

  const flowScanGy = groundHeight(8, 22.5);
  const scanInteractable: Interactable = {
    id: 'ashfall-cooled-flow',
    prompt: 'Scan COOLED FLOW',
    radius: 2.8,
    position: new THREE.Vector3(8, flowScanGy + 1.6, 22.5),
    onInteract: (): void => {
      const fresh = recordScan('ashfall-cooled-flow');
      showRoomToast(fresh ? 'CATALOGUED · COOLED FLOW' : 'KNOWN · COOLED FLOW');
    },
  };

  const colliders: AABB[] = [
    {
      minX: MOUND_LOBE_A.x - MOUND_LOBE_A.radius, maxX: MOUND_LOBE_A.x + MOUND_LOBE_A.radius,
      minY: -2, maxY: 6,
      minZ: MOUND_LOBE_A.z - MOUND_LOBE_A.radius, maxZ: MOUND_LOBE_A.z + MOUND_LOBE_A.radius,
    },
    {
      minX: MOUND_LOBE_B.x - MOUND_LOBE_B.radius, maxX: MOUND_LOBE_B.x + MOUND_LOBE_B.radius,
      minY: -2, maxY: 6,
      minZ: MOUND_LOBE_B.z - MOUND_LOBE_B.radius, maxZ: MOUND_LOBE_B.z + MOUND_LOBE_B.radius,
    },
  ];

  return {
    group, colliders, relicInteractable, scanInteractable,
    dispose(): void {
      for (const g of geos) g.dispose();
      rockMat.dispose();
      relicMat.dispose();
    },
  };
}

// ── Fumarole vents ────────────────────────────────────────────────────────────

export interface FumaroleVents {
  group: THREE.Group;
  interactable: Interactable;
  dispose(): void;
}

/** 3 vent cones with a pulsing ember throat; one (index 0) doubles as the scannable. */
export function buildFumaroleVents(groundHeight: (x: number, z: number) => number): FumaroleVents {
  const group = new THREE.Group();
  group.name = 'ashfall-fumaroles';

  const bodyGeo = new THREE.CylinderGeometry(0.55, 1.3, 1.7, 8, 1);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1c1712, roughness: 0.95, metalness: 0.03 });
  const throatGeo = new THREE.CircleGeometry(0.42, 20);
  const throatMat = new THREE.MeshStandardMaterial({
    color: 0x200a04, emissive: 0xff7a2a, emissiveIntensity: 1.2, toneMapped: false, side: THREE.DoubleSide,
  });

  let interactable: Interactable | null = null;
  FUMAROLE_POSITIONS.forEach((v, idx) => {
    const gy = groundHeight(v.x, v.z);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(v.x, gy + 0.85, v.z);
    body.castShadow = true;
    group.add(body);

    const throat = new THREE.Mesh(throatGeo, throatMat);
    throat.rotation.x = -Math.PI / 2;
    throat.position.set(v.x, gy + 1.72, v.z);
    const phase = idx * 2.1;
    throat.onBeforeRender = (): void => {
      const t = performance.now() / 1000;
      throatMat.emissiveIntensity = 1.0 + 0.45 * Math.sin(t * 2.2 + phase);
    };
    group.add(throat);

    if (idx === 0) {
      interactable = {
        id: 'ashfall-fumarole',
        prompt: 'Scan FUMAROLE',
        radius: 2.6,
        position: new THREE.Vector3(v.x, gy + 1.2, v.z),
        onInteract: (): void => {
          const fresh = recordScan('ashfall-fumarole');
          showRoomToast(fresh ? 'CATALOGUED · FUMAROLE' : 'KNOWN · FUMAROLE');
        },
      };
    }
  });

  if (!interactable) throw new Error('ashfall: no fumarole positions configured');
  const ia = interactable as Interactable;

  return {
    group,
    interactable: ia,
    dispose(): void {
      bodyGeo.dispose(); bodyMat.dispose();
      throatGeo.dispose(); throatMat.dispose();
    },
  };
}
