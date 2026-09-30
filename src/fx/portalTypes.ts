/** Public portal surface and its internal renderer dependencies. */
import type * as THREE from 'three';
import type { Interactable } from '../world/types.js';
export interface PortalSurface {
  mesh: THREE.Mesh;
  interactable: Interactable;
  update(dt: number, playerPos: THREE.Vector3, camera: THREE.PerspectiveCamera): void;
  /** ~600ms high-energy burst (two-hue flash + filament arcs). Fired on traversal. */
  discharge(): void;
  dispose(): void;
}

export interface PortalDeps {
  renderer: THREE.WebGLRenderer;
  getScene(id: string): THREE.Scene | null;
  /** Destination "arrival portal" transform in the target scene, or null (→ identity). */
  getDestination(id: string): THREE.Matrix4 | null;
  requestSwitch(target: string): void;
}
