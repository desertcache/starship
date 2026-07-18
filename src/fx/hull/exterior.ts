/**
 * src/fx/hull/exterior.ts — full-scale exterior hull instance (Lane D, v1.1
 * §5 Stage 3 / design D4).
 *
 * Builds the SAME lofted hull geometry used for the cockpit hologram
 * (buildHullGeometry + interiorAnchors, see world/portalRoom.ts) at scale
 * 1.0, added to the main ship scene at the origin. No position offset is
 * needed: interiorAnchors' slice/anchor coordinates ARE the interior room
 * modules' actual world-space placements (world/assembly.ts positions every
 * room directly in world space, no group wrapper) — buildHullGeometry lofts
 * around those coordinates, so the hull wraps the interior exactly wherever
 * it's added. Verify visually: verify/shots/chase.png must show the whole
 * hull with no gap/overlap against the rooms glimpsed through its portholes.
 *
 * THREE.Layers bit 1 ONLY (mesh.layers.set(1) — clears layer 0 too): the
 * main/walk camera defaults to layer 0 alone, so it never sees this mesh —
 * portholes and every interior view stay pixel-identical to v1.0. Only the
 * chase camera (chaseCam.ts) enables layers 0+1 while active.
 *
 * HOLO_SEED (0x1704) matches world/portalRoom.ts's cockpit-hologram seed —
 * intentional continuity between the miniature bridge prop and the real
 * exterior (same greeble scatter, same silhouette).
 */
import * as THREE from 'three';
import { buildHullGeometry } from './buildHull.js';
import { interiorAnchors } from './anchors.js';
import { hullSkinMaterial } from './hullMaterial.js';

const HOLO_SEED = 0x1704;

export interface ExteriorHull {
  mesh: THREE.Mesh;
  dispose(): void;
}

/** World/ship-frame engine anchor — position + outward normal, no light attached. */
export interface EngineGlowAnchor {
  position: THREE.Vector3;
  normal: THREE.Vector3;
}

/**
 * Engine-glow anchor points, positions only (Stage 5 polish consumes these to
 * place throttle-keyed glow cones — no lights here, per D4/D6). Mirrors the
 * port/starboard nozzle placement buildHullGeometry() itself uses.
 */
export let engineGlowAnchors: EngineGlowAnchor[] = [];

function buildEngineGlowAnchors(): EngineGlowAnchor[] {
  const e = interiorAnchors.engineAxis;
  const base = new THREE.Vector3(...e.position);
  const normal = new THREE.Vector3(...e.normal);
  return [-1, 1].map((sx) => ({
    position: base.clone().add(new THREE.Vector3(sx * 1.2, 0, 0.6)),
    normal: normal.clone(),
  }));
}

/**
 * Instantiate the full-scale exterior hull ONCE, in the main ship scene.
 * Call once at boot (main.ts) — there is no world-switch or teardown path
 * for it in v1.1 (the ship scene, and therefore this mesh, lives for the
 * whole session).
 */
export function createExteriorHull(scene: THREE.Scene): ExteriorHull {
  const build = buildHullGeometry(HOLO_SEED, interiorAnchors);

  const mesh = new THREE.Mesh(build.geometry, hullSkinMaterial);
  mesh.name = 'exterior-hull';
  mesh.layers.set(1);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  scene.add(mesh);

  engineGlowAnchors = buildEngineGlowAnchors();

  return {
    mesh,
    dispose(): void {
      scene.remove(mesh);
      build.geometry.dispose();
      // hullSkinMaterial is a shared module singleton (fx/hull/hullMaterial.ts,
      // same pattern as fx/propMaterials.ts) — NOT disposed here. It's built
      // once at import and owned by nothing that ever replaces it.
    },
  };
}
