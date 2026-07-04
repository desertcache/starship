/**
 * src/fx/creatures/pool.ts — per-species instanced draw pools.
 *
 * Every repeated small part (leg segments, feet, head cones, whip segments)
 * across a species' whole population renders as ONE InstancedMesh instead of
 * a mesh per part. Articulation is untouched: the transform HIERARCHY still
 * poses Object3D pivots; pools just mirror the resulting world matrices into
 * instance slots each frame. This is what keeps a herd inside the pocket-world
 * draw budget (≤120/world) — a 3-strong quadruped herd fell from ~66 draws to
 * ~13 with pools.
 *
 * Two slot kinds:
 *  - node slots: mirror a scene-graph node's matrixWorld on sync() (limbs,
 *    feet, cones — children of the posed hips/knees/heads).
 *  - free slots: written directly with setPose() by the Whip solver (segments
 *    live in world space, no node needed).
 */

import * as THREE from 'three';

const _m4 = new THREE.Matrix4();
const _s = new THREE.Vector3();

export class InstancePool {
  readonly mesh: THREE.InstancedMesh;
  private used = 0;
  private nodes: (THREE.Object3D | null)[] = [];

  constructor(geo: THREE.BufferGeometry, mat: THREE.Material, capacity: number) {
    this.mesh = new THREE.InstancedMesh(geo, mat, capacity);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // Instances span the species' whole roam area — skip per-mesh culling.
    this.mesh.frustumCulled = false;
    this.mesh.castShadow = true;
  }

  /**
   * Node-backed slot: creates an invisible Object3D at (pos, scale[, rot])
   * under `parent`; sync() mirrors its matrixWorld into the instance.
   */
  allocNode(
    parent: THREE.Object3D,
    pos: THREE.Vector3,
    scale: THREE.Vector3,
    rot?: THREE.Euler,
  ): THREE.Object3D {
    const n = new THREE.Object3D();
    n.position.copy(pos);
    n.scale.copy(scale);
    if (rot) n.rotation.copy(rot);
    parent.add(n);
    this.nodes[this.used] = n;
    this.used++;
    return n;
  }

  /** Manually-driven slot (world-space whip segments). Returns the slot id. */
  allocFree(): number {
    this.nodes[this.used] = null;
    return this.used++;
  }

  /** Write a free slot's world transform directly. */
  setPose(slot: number, pos: THREE.Vector3, quat: THREE.Quaternion, sx: number, sy: number, sz: number): void {
    _s.set(sx, sy, sz);
    _m4.compose(pos, quat, _s);
    this.mesh.setMatrixAt(slot, _m4);
  }

  /** Call once after all instances of the species are assembled. */
  finalize(): void {
    this.mesh.count = this.used;
  }

  /** Mirror node slots + flag the buffer. Node matrixWorlds must be fresh. */
  sync(): void {
    for (let i = 0; i < this.used; i++) {
      const n = this.nodes[i];
      if (n) this.mesh.setMatrixAt(i, n.matrixWorld);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    this.mesh.dispose();
  }
}
