import * as THREE from 'three';

export interface NamedCamera {
  name: string;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

const registry = new Map<string, NamedCamera>();
let activeCamera: THREE.PerspectiveCamera | null = null;

export function registerCam(
  name: string,
  position: THREE.Vector3Like,
  lookAt: THREE.Vector3Like,
): void {
  registry.set(name, {
    name,
    position: new THREE.Vector3(position.x, position.y, position.z),
    lookAt: new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z),
  });
}

export function setActiveCamera(camera: THREE.PerspectiveCamera): void {
  activeCamera = camera;
}

export function getRegisteredCamNames(): string[] {
  return Array.from(registry.keys());
}

export function teleportToCamera(name: string): boolean {
  const cam = registry.get(name);
  if (!cam || !activeCamera) return false;
  activeCamera.position.copy(cam.position);
  activeCamera.lookAt(cam.lookAt);
  return true;
}

export function installCameraGlobal(): void {
  (window as unknown as Record<string, unknown>)['__setCam'] = (name: string): boolean => {
    return teleportToCamera(name);
  };
}
