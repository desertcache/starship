import * as THREE from 'three';
import { setFlightView as setView } from '../flight/flightState.js';
import { syncChaseView, snapChaseConverged } from '../flight/chaseCam.js';

export interface NamedCamera {
  name: string;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

interface RegisteredCamera extends NamedCamera {
  /** Which world owns this shot. Ship cameras default to 'ship'. */
  worldId: string;
  /** v1.1 SOVEREIGN D4: exterior (chase) vs interior (walk) camera view. Defaults to 'interior'. */
  view?: 'interior' | 'exterior';
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
  view?: 'interior' | 'exterior',
): void {
  registry.set(name, {
    name,
    position: new THREE.Vector3(position.x, position.y, position.z),
    lookAt: new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z),
    worldId,
    view,
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

  // v1.1 SOVEREIGN D4: apply the view BEFORE the position/lookAt below —
  // syncChaseView() resets camera.up (and, when leaving exterior, fov +
  // layer 1) so the following lookAt() computes an unbanked orientation for
  // every non-chase camera. Entering exterior stores whatever pose was just
  // active (the walk camera's real pose) for a clean return trip later.
  const view = cam.view ?? 'interior';
  setView(view);
  syncChaseView();

  activeCamera.position.copy(cam.position);
  activeCamera.lookAt(cam.lookAt);

  // The registry only holds a static placeholder pose for 'chase' — the real
  // world-frame lag pose is dynamic, so converge it immediately for a
  // deterministic screenshot (T13b) instead of waiting a frame for tickChaseCam.
  if (view === 'exterior') snapChaseConverged();
  return true;
}

export function installCameraGlobal(): void {
  (window as unknown as Record<string, unknown>)['__setCam'] = (name: string): boolean => {
    return teleportToCamera(name);
  };
}

// Named cam 'chase' (D4 / T13b) — registered here (not world/assembly.ts)
// since it's intrinsically tied to the view feature this file owns. Position/
// lookAt below is only a placeholder: snapChaseConverged() (teleportToCamera,
// above) immediately overrides it with the real world-frame lag pose.
registerCam('chase', new THREE.Vector3(0, 10, 40), new THREE.Vector3(0, 2, 0), 'ship', 'exterior');
