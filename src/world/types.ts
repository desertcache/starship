import type * as THREE from 'three';
import type { NamedCamera } from '../core/cameras.js';

export interface AABB {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

export interface Interactable {
  id: string;
  prompt: string;
  radius: number;
  position: THREE.Vector3;
  onInteract(): void;
}

export interface RoomModule {
  group: THREE.Group;
  colliders: AABB[];
  interactables: Interactable[];
  cameras: NamedCamera[];
}
