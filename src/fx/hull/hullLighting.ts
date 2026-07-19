/**
 * src/fx/hull/hullLighting.ts — dedicated key/rim/fill rig for the exterior
 * hull (v1.1 Stage 5 FEEL/POLISH).
 *
 * WHY THIS EXISTS: the real exterior hull (fx/hull/exterior.ts) lives on
 * THREE.Layers bit 1 and is only ever seen by the chase camera. Before this it
 * was lit solely by the INTERIOR rig (fx/lightingRig.ts — hemi @0.05 +
 * positional lights aimed at cabin walls) plus scene.environment, so in deep
 * space the hull read as a flat, pale, clay-grey slab: no bright/dark gradient,
 * no specular, no sense of painted metal.
 *
 * ISOLATION: every light here is scoped to layer 1 ONLY (light.layers.set(1)).
 * A THREE light illuminates a mesh only when they share a layer bit, so this
 * rig touches the hull and NOTHING on layer 0 — the gate-locked interior stays
 * pixel-identical. This is the same view-exclusive budgeting the pocket worlds
 * use; CLAUDE.md's "do not add SHIP lights without retiring one" governs the
 * interior rig, whereas this is a separate budget only paid when the chase cam
 * renders layer 1. No shadow casters — a directional shadow frustum spanning
 * the whole starfield is wasteful for one convex hull.
 *
 * FRAME: the ship is pinned at the origin and the universe rig rotates around
 * it (v1.1 design), so a fixed 3/4 key in ship/world frame gives stable,
 * flattering hull shading regardless of heading. DirectionalLights aim from
 * their position toward the default target at the origin (where the hull sits).
 */
import * as THREE from 'three';

export interface HullLighting {
  group: THREE.Group;
  dispose(): void;
}

const HULL_LAYER = 1;

export function createHullLighting(scene: THREE.Scene): HullLighting {
  const group = new THREE.Group();
  group.name = 'hull-lighting';

  // Warm 3/4 key, thrown well to starboard for a strong lateral gradient
  // across the boxy hull (more side-modeling = more read of form) — the
  // sheen-maker that gives the hull its bright side and a specular streak
  // along the deck plating.
  const key = new THREE.DirectionalLight(0xfff1dc, 3.2);
  key.position.set(0.78, 0.55, 0.45);
  key.layers.set(HULL_LAYER);

  // Cool rim from lower-aft-port (roughly opposite the key) — catches the
  // silhouette edge so the hull separates from black space instead of dying
  // into it, and cools the shadow side toward starlight blue.
  const rim = new THREE.DirectionalLight(0x9cc4ff, 1.4);
  rim.position.set(-0.62, -0.12, -0.62);
  rim.layers.set(HULL_LAYER);

  // Cool ambient fill so the shadow side reads as dark metal, not crushed
  // black, and the gunmetal/orange detail stays legible off-key.
  const fill = new THREE.HemisphereLight(0x2b3a54, 0x090a10, 0.4);
  fill.layers.set(HULL_LAYER);

  group.add(key, rim, fill);
  scene.add(group);

  return {
    group,
    dispose(): void {
      scene.remove(group);
      key.dispose();
      rim.dispose();
      fill.dispose();
    },
  };
}
