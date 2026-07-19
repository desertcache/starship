/**
 * src/fx/landfall/shipSurface.ts — v1.2 LANDFALL Stage 3: the landed ship
 * prop parked on the pad, its deploying strut+skid legs, hull-footprint
 * colliders, and the reboard hatch.
 *
 * Reuses fx/hull/buildHull.ts's buildHullGeometry() + interiorAnchors + the
 * SAME HOLO_SEED (0x1704) fx/hull/exterior.ts's real ship-scene hull uses —
 * same silhouette everywhere the player sees "the ship". Unlike that mesh
 * (layer 1 only, chase-view-only), this one stays on the DEFAULT layer 0 —
 * the walk camera must see it.
 *
 * OWN material, not exterior.ts's shared hullSkinMaterial singleton (probe-
 * verified regression): that material is compiled against the SHIP scene's
 * own lighting rig, and Three.js's WebGLPrograms cache keys a material's
 * compiled program on the active scene's light configuration. Sharing ONE
 * material instance between the ship scene (rig of ~12 positional lights)
 * and this scene (2 lights) forced a program recompile on EVERY render of
 * either scene once both had been visited — a many-hundred-ms stall each
 * frame that starved unrelated setTimeout-driven state (broke Test 2's
 * "eat" hunger restore, nothing to do with this file on its face). A plain
 * unshared MeshStandardMaterial in the same palette avoids the cross-scene
 * cache thrash entirely.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { buildHullGeometry, hullEnvelopeAt } from '../hull/buildHull.js';
import { interiorAnchors } from '../hull/anchors.js';
import { makeRng } from '../space/rng.js';
import type { AABB, Interactable } from '../../world/types.js';
import { takeOff } from '../../flight/landfall.js';

const SHIP_SEED = 0x1704; // matches fx/hull/exterior.ts's HOLO_SEED
const HATCH_RADIUS = 3;
const LEG_STOWED_SCALE = 0.15;
const FOOTPRINT_MARGIN = 1.5;

// Own module-level singleton (same house pattern as hullMaterial.ts's own
// export) — cream/worn-freighter tone, no shared CanvasTexture needed for a
// prop seen from walking distance rather than up close.
const landedShipMaterial = new THREE.MeshStandardMaterial({
  color: '#cfc7b3', roughness: 0.6, metalness: 0.12, side: THREE.DoubleSide,
});
// Ship-local Z bands (from anchors.slices' 9 stations) used to build the
// hull-footprint AABBs — every other slice, so 9 stations → 4 bands.
const FOOTPRINT_SLICE_STEP = 2;

export interface ShipSurfaceHandle {
  colliders: AABB[];
  hatch: Interactable;
  tick(dt: number, skidDeployProgress: number): void;
  dispose(): void;
}

function buildLeg(): THREE.BufferGeometry {
  const strut = new THREE.CylinderGeometry(0.15, 0.15, 3, 8);
  strut.translate(0, -1.5, 0);
  const skid = new THREE.BoxGeometry(0.8, 0.15, 0.4);
  skid.translate(0, -3, 0);
  const merged = mergeGeometries([strut, skid]);
  strut.dispose();
  skid.dispose();
  return merged;
}

/** 4-6 axis-aligned hull-footprint colliders, safe against the mesh's own
 *  small seeded yaw+cant: each band's corners are transformed to world space
 *  via the mesh's real matrixWorld before taking the AABB envelope, so a
 *  rotated hull still gets a gap-free approximate footprint. */
function buildFootprintColliders(mesh: THREE.Object3D, groundY: number): AABB[] {
  const slices = interiorAnchors.slices;
  const out: AABB[] = [];
  const corner = new THREE.Vector3();
  for (let i = 0; i + FOOTPRINT_SLICE_STEP < slices.length; i += FOOTPRINT_SLICE_STEP) {
    const zA = slices[i].x;
    const zB = slices[Math.min(i + FOOTPRINT_SLICE_STEP, slices.length - 1)].x;
    const halfW = Math.max(hullEnvelopeAt(zA, interiorAnchors).halfW, hullEnvelopeAt(zB, interiorAnchors).halfW) + FOOTPRINT_MARGIN;
    const halfH = Math.max(interiorAnchors.slices[i].halfH, interiorAnchors.slices[Math.min(i + FOOTPRINT_SLICE_STEP, slices.length - 1)].halfH);
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const lz of [zA, zB]) {
      for (const lx of [-halfW, halfW]) {
        corner.set(lx, 0, lz);
        mesh.localToWorld(corner);
        minX = Math.min(minX, corner.x); maxX = Math.max(maxX, corner.x);
        minZ = Math.min(minZ, corner.z); maxZ = Math.max(maxZ, corner.z);
      }
    }
    out.push({ minX, maxX, minY: groundY, maxY: groundY + halfH * 2 + 1, minZ, maxZ });
  }
  return out;
}

export function attachShip(scene: THREE.Scene, groundY: number): ShipSurfaceHandle {
  const rng = makeRng(SHIP_SEED ^ 0x5e17);
  const build = buildHullGeometry(SHIP_SEED, interiorAnchors);
  const mesh = new THREE.Mesh(build.geometry, landedShipMaterial);
  mesh.name = 'landfall-ship';
  mesh.position.set(0, groundY, 0);
  const yaw = rng.signed(0.15);
  const cant = THREE.MathUtils.degToRad(rng.range(1, 2)) * (rng() < 0.5 ? 1 : -1);
  mesh.rotation.set(0, yaw, cant);
  scene.add(mesh);

  // ── 3 strut+skid legs — children of `mesh`, inherit its yaw/cant/position.
  const legGeo = buildLeg();
  const legPositions: Array<[number, number]> = [
    [0, -16], // nose gear
    [-(hullEnvelopeAt(10, interiorAnchors).halfW - 0.6), 10], // port aft
    [hullEnvelopeAt(10, interiorAnchors).halfW - 0.6, 10], // starboard aft
  ];
  const legs: THREE.Group[] = legPositions.map(([lx, lz]) => {
    const group = new THREE.Group();
    group.add(new THREE.Mesh(legGeo, landedShipMaterial));
    group.position.set(lx, 0, lz);
    group.scale.y = LEG_STOWED_SCALE;
    mesh.add(group);
    return group;
  });

  mesh.updateMatrixWorld(true);
  const colliders = buildFootprintColliders(mesh, groundY);

  const hatchWorld = new THREE.Vector3(
    interiorAnchors.cargoDoor.position[0] + interiorAnchors.cargoDoor.normal[0] * 2.5,
    1.2,
    interiorAnchors.cargoDoor.position[2],
  );
  mesh.localToWorld(hatchWorld);

  const hatch: Interactable = {
    id: 'landfall-ship-hatch',
    prompt: 'Board ship',
    radius: HATCH_RADIUS,
    position: hatchWorld,
    onInteract: (): void => { takeOff(); },
  };

  function tick(_dt: number, skidDeployProgress: number): void {
    const s = THREE.MathUtils.lerp(LEG_STOWED_SCALE, 1, skidDeployProgress);
    for (const g of legs) g.scale.y = s;
  }

  function dispose(): void {
    scene.remove(mesh);
    build.geometry.dispose();
    legGeo.dispose();
    // landedShipMaterial is a module-level singleton (same "not disposed"
    // convention as hullMaterial.ts's own hullSkinMaterial) — not disposed here.
  }

  return { colliders, hatch, tick, dispose };
}
