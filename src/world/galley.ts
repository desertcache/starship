import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule, Interactable } from './types.js';
import { addGalleyProps } from './galleyProps.js';
import { mergeStaticSiblings } from './staticMerge.js';
import { setHunger } from '../core/state.js';
import { fadeTransition } from '../ui/hud.js';
import { buildLightShaft } from '../fx/volumetrics.js';

/** Galley / mess — 6W x 3H x 6D. */
export function buildGalley(): RoomModule {
  const W = 6;
  const H = 3;
  const D = 6;

  const { group, colliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    doors: [
      // Fore wall connects to corridor aft — corridor already owns that frame
      { wall: 'fore', gapW: 1.4, gapH: 2.2, offset: 0 },
      // Aft wall connects to engineering — galley owns THIS frame
      { wall: 'aft', gapW: 1.4, gapH: 2.2, offset: 0, framed: true },
    ],
  });

  group.name = 'galley';

  const { colliders: propColliders } = addGalleyProps(group);
  colliders.push(...propColliders);

  // Volumetric light shaft (v0.9 B2 glow build) — hero counter pool, under
  // galleyPt. v0.9 B3: galleyPt moved onto the counter (world 1.9,2.55,-1.5);
  // shaft follows so the godray sits over the workspace, not the open floor.
  // Local Z = world Z - (-1); local X = world X (galley X-offset is 0).
  buildLightShaft(group, {
    x: 2.0, z: -0.4, topY: 2.6, bottomY: 0.5,
    sourceAtTop: true, radiusSource: 0.14, radiusFar: 0.42,
    color: 0xffe2c0, peakOpacity: 0.028, moteCount: 60, seed: 13,
  });

  // ── Stove interactable — "Eat" ─────────────────────────────────────────────
  // Stove cooktop local position: X≈2.725, Y≈0.91, Z≈-0.60 (STOVE_Z_CTR).
  // World position filled in by assembly.ts offset.
  const stoveInteractable: Interactable = {
    id: 'stove',
    prompt: 'Eat',
    radius: 2.5,
    position: new THREE.Vector3(2.725, 0.91, -0.60), // updated to world space in assembly
    onInteract: () => {
      void fadeTransition(() => {
        setHunger(100);
      }, 280, 150);
    },
  };

  // v0.9 A1 defrag: merge static same-material sibling meshes into fewer
  // draw calls. Zero visual/functional change — see staticMerge.ts.
  mergeStaticSiblings(group);

  // Camera: angled to frame counter + upper cabinets + fridge + stove glow.
  // Position on port side looking toward starboard counter run.
  const localCamPos  = new THREE.Vector3(-1.8, 1.55, -0.4);
  const localCamLook = new THREE.Vector3(2.5,  1.20, -0.4);

  return {
    group,
    colliders,
    interactables: [stoveInteractable],
    cameras: [
      {
        name: 'galley',
        position: localCamPos,
        lookAt: localCamLook,
      },
    ],
  };
}
