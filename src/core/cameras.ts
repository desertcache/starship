import * as THREE from 'three';

export interface NamedCamera {
  name: string;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

interface RegisteredCamera extends NamedCamera {
  /** Which world owns this shot. Ship cameras default to 'ship'. */
  worldId: string;
}

const registry = new Map<string, RegisteredCamera>();
let activeCamera: THREE.PerspectiveCamera | null = null;

/**
 * Synchronous world activator, installed by the WorldManager at boot.
 * teleportToCamera() calls it BEFORE moving the view so `__setCam('verdant-qa')`
 * flips to the owning world's scene/colliders/ground first. Kept as an injected
 * callback (not a direct import) to avoid a cameras ↔ worlds import cycle.
 */
let worldActivator: ((worldId: string) => void) | null = null;

export function registerCam(
  name: string,
  position: THREE.Vector3Like,
  lookAt: THREE.Vector3Like,
  worldId = 'ship',
): void {
  registry.set(name, {
    name,
    position: new THREE.Vector3(position.x, position.y, position.z),
    lookAt: new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z),
    worldId,
  });
}

export function setActiveCamera(camera: THREE.PerspectiveCamera): void {
  activeCamera = camera;
}

export function getRegisteredCamNames(): string[] {
  return Array.from(registry.keys());
}

export function setWorldActivator(fn: (worldId: string) => void): void {
  worldActivator = fn;
}

export function teleportToCamera(name: string): boolean {
  const cam = registry.get(name);
  if (!cam || !activeCamera) return false;
  // Activate the owning world synchronously so the correct scene renders and
  // the controller's collider/ground set matches before we place the eye.
  if (worldActivator) worldActivator(cam.worldId);
  activeCamera.position.copy(cam.position);
  activeCamera.lookAt(cam.lookAt);
  return true;
}

export function installCameraGlobal(): void {
  (window as unknown as Record<string, unknown>)['__setCam'] = (name: string): boolean => {
    return teleportToCamera(name);
  };
}
