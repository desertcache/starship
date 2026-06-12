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

export interface InteractContext {
  /** World-space camera (player) position at time of interaction. */
  playerPos: THREE.Vector3;
}

export interface Interactable {
  id: string;
  prompt: string;
  /** Radius in world units within which the interactable is reachable. */
  radius: number;
  /** World-space centre of the interactable mesh. */
  position: THREE.Vector3;
  onInteract(ctx: InteractContext): void;
  /**
   * Optional dynamic prompt override. When present, tickInteract() calls this
   * instead of reading `prompt` directly, allowing context-sensitive labels
   * like "Open Door" / "Close Door".
   */
  getPrompt?(): string;
  /**
   * Optional per-interactable state bag for things like animation progress,
   * toggle flags, etc. Typed as Record to avoid any.
   */
  state?: Record<string, boolean | number | string>;
}

export interface RoomModule {
  group: THREE.Group;
  colliders: AABB[];
  interactables: Interactable[];
  cameras: NamedCamera[];
}
