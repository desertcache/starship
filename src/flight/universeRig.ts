/**
 * Universe rig — the one quaternion write that realizes ship rotation.
 *
 * Per the frame-of-reference contract (docs/design-v1.1-sovereign.md §2): the
 * ship NEVER moves or rotates in the rendered scene. Instead, ALL space
 * content (near/far starfield, nebula, hero sun, the rolling cast — anything
 * currently added to the scene by buildStarfield()/createSpaceDirector())
 * reparents under this THREE.Group, and the group's quaternion is set to the
 * ship attitude's INVERSE once per frame. From inside the ship, turning the
 * nose then reads as the universe swinging the opposite way — exactly like a
 * real cockpit — and every porthole/canopy sightline gets this for free.
 *
 * Boot-equivalence: with the flight shim's defaults (identity attitude), the
 * rig's quaternion is identity, so every reparented child renders at exactly
 * its pre-rig scene-space position — v1.0-byte-identical at t=0.
 *
 * Interior rooms, colliders, the player, and named cameras are NOT attached
 * here — they stay direct THREE.Scene children, unchanged from v1.0.
 */
import * as THREE from 'three';
// Stage 2 repoint: live flight state (was the static Lane C shim).
import { getAttitudeInverseRef as getAttitudeInverse } from './flightState.js';

export interface UniverseRig {
  /** The rig group itself — reparented content lives under this node. */
  group: THREE.Group;
  /** Reparent `obj` under the rig. THREE auto-detaches it from its old
   *  parent (scene), so callers don't need to scene.remove() first. */
  attach(obj: THREE.Object3D): void;
  /** Call once per frame, ship-world only: rig.quaternion = attitude⁻¹. */
  tick(dt: number): void;
  /** Detach all rig children back to the scene, then remove the rig itself.
   *  Defensive — not a hot path; nothing in Stage 1 calls this yet. */
  dispose(): void;
}

/** Build the universe rig and add it to `scene`. */
export function createUniverseRig(scene: THREE.Scene): UniverseRig {
  const group = new THREE.Group();
  group.name = 'universe-rig';
  scene.add(group);

  function attach(obj: THREE.Object3D): void {
    group.add(obj);
  }

  function tick(_dt: number): void {
    group.quaternion.copy(getAttitudeInverse());
  }

  function dispose(): void {
    for (let i = group.children.length - 1; i >= 0; i--) {
      scene.add(group.children[i]);
    }
    scene.remove(group);
  }

  return { group, attach, tick, dispose };
}
