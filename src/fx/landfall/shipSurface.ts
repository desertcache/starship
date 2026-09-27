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

// v1.2.1 B2 (r3 P1) — real hatch geometry. Bottom edge lands exactly at
// HATCH_INTERACT_Y (the registered interactable's own y, below) so the visual
// and the interact point read as the same object, not two coincidences.
const HATCH_INTERACT_Y = 1.2;
const HATCH_VISUAL_WIDTH = 2.2;  // Z-extent (door opening width)
const HATCH_VISUAL_HEIGHT = 2.6; // Y-extent, bottom at HATCH_INTERACT_Y
const HATCH_FRAME_DEPTH = 0.2;   // X-extent, proud of the hull skin
const HATCH_STRIP_MARGIN = 0.35; // status-strip inset from the frame's edges

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

/**
 * v1.2.1 B2 (r3 P1) — the only NAMED landed-ship object was the hull mesh
 * itself ('landfall-ship'); the 'landfall-ship-hatch' interactable sat 2.5m
 * out from the cargo door in open air with nothing there for the real E
 * key's name-only raycast (player/interact.ts) to hit, so a real landing
 * stranded the player until reload. This builds an actual hatch: an orange
 * frame proud of the hull skin along the cargo door's own outward normal,
 * plus a teal status strip. Returned UNPARENTED — attachShip() adds it as a
 * CHILD of the hull mesh so it inherits yaw/cant/position automatically, the
 * same pattern the strut+skid legs already use below.
 *
 * Materials: the frame is a normal MeshStandardMaterial (lit like the rest of
 * the hull, no lighting cost); the status strip is a plain MeshBasicMaterial
 * (toneMapped:false — the SAME "emissive without a light" trick the landing
 * pad's accent ring already uses) so it reads as lit regardless of the
 * world's fixed 1-hemi/1-directional budget — no new THREE.Light.
 */
function buildHatchVisual(): THREE.Group {
  const [dx, , dz] = interiorAnchors.cargoDoor.position; // -4.0, _, 13.5 — ON the hull skin (mid-height unused: see frame.position below)
  const [nx] = interiorAnchors.cargoDoor.normal; // -1 (outward, port side)

  const group = new THREE.Group();
  group.name = 'landfall-ship-hatch';

  const frameCenterX = dx + nx * (HATCH_FRAME_DEPTH / 2);
  const frameGeo = new THREE.BoxGeometry(HATCH_FRAME_DEPTH, HATCH_VISUAL_HEIGHT, HATCH_VISUAL_WIDTH);
  const frameMat = new THREE.MeshStandardMaterial({ color: '#C7641E', roughness: 0.5, metalness: 0.3 });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  // Centered so the box's bottom edge lands exactly on HATCH_INTERACT_Y
  // (ignores the door anchor's own dy — the visual is sized/placed to match
  // the registered interactable's height, not the interior door's mid-height).
  frame.position.set(frameCenterX, HATCH_INTERACT_Y + HATCH_VISUAL_HEIGHT / 2, dz);
  group.add(frame);

  const stripDepth = 0.03;
  const stripGeo = new THREE.BoxGeometry(
    stripDepth,
    0.18,
    HATCH_VISUAL_WIDTH - HATCH_STRIP_MARGIN * 2,
  );
  const stripMat = new THREE.MeshBasicMaterial({ color: '#46E0D8', toneMapped: false });
  const strip = new THREE.Mesh(stripGeo, stripMat);
  strip.position.set(
    frameCenterX + nx * (HATCH_FRAME_DEPTH / 2 + stripDepth / 2),
    frame.position.y + HATCH_VISUAL_HEIGHT / 2 - 0.35,
    dz,
  );
  group.add(strip);

  return group;
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

  // v1.2.1 B2 — real, named, hittable hatch geometry (see buildHatchVisual's
  // own header) — a child of `mesh` so it inherits yaw/cant/position exactly
  // like the legs above.
  const hatchVisual = buildHatchVisual();
  mesh.add(hatchVisual);

  mesh.updateMatrixWorld(true);
  const colliders = buildFootprintColliders(mesh, groundY);

  const hatchWorld = new THREE.Vector3(
    interiorAnchors.cargoDoor.position[0] + interiorAnchors.cargoDoor.normal[0] * 2.5,
    HATCH_INTERACT_Y,
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
    // v1.2.1 B2 — hatchVisual's frame/strip each own UNIQUE (non-singleton)
    // geometry+material, unlike landedShipMaterial below, so a generic
    // traversal-dispose is the cheapest correct cleanup.
    hatchVisual.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.geometry.dispose();
      const mat = m.material;
      if (Array.isArray(mat)) mat.forEach((mm) => mm.dispose()); else mat.dispose();
    });
    // landedShipMaterial is a module-level singleton (same "not disposed"
    // convention as hullMaterial.ts's own hullSkinMaterial) — not disposed here.
  }

  return { colliders, hatch, tick, dispose };
}
