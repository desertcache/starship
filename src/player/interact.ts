/**
 * src/player/interact.ts — Phase 4 interaction raycaster.
 *
 * Each frame, casts a ray from the camera centre into the scene.
 * If it hits a registered interactable within 2.5m, shows the prompt.
 * Pressing E triggers onInteract on the current target.
 *
 * Headless (no pointer-lock) fallback for window.__test.interact():
 *   falls back to nearest registered interactable within radius.
 */

import * as THREE from 'three';
import type { Interactable } from '../world/types.js';
import { showPrompt, clearPrompt } from '../ui/hud.js';

const MAX_INTERACT_DIST = 2.5; // metres

interface InteractState {
  camera: THREE.PerspectiveCamera | null;
  scene: THREE.Scene | null;
  raycaster: THREE.Raycaster;
  allInteractables: Interactable[];
  current: Interactable | null;
}

const state: InteractState = {
  camera: null,
  scene: null,
  raycaster: new THREE.Raycaster(),
  allInteractables: [],
  current: null,
};

export function initInteract(
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
): void {
  state.camera = camera;
  state.scene = scene;
  window.addEventListener('keydown', onKeyDown);
}

export function registerInteractables(list: Interactable[]): void {
  state.allInteractables.push(...list);
}

function onKeyDown(e: KeyboardEvent): void {
  if (e.code === 'KeyE' && state.current) {
    triggerCurrent();
  }
}

function triggerCurrent(): void {
  if (!state.current || !state.camera) return;
  state.current.onInteract({ playerPos: state.camera.position.clone() });
}

/**
 * Tick — called every frame.
 * Uses centre-screen raycast when camera available; falls back to proximity.
 */
export function tickInteract(): void {
  if (!state.camera || !state.scene) return;

  // Cast from camera centre
  state.raycaster.setFromCamera(new THREE.Vector2(0, 0), state.camera);
  const hits = state.raycaster.intersectObjects(state.scene.children, true);

  let found: Interactable | null = null;

  for (const hit of hits) {
    if (hit.distance > MAX_INTERACT_DIST) break;
    // Walk up the ancestor chain to see if any hit mesh is inside an interactable group
    const interactable = findInteractableForObject(hit.object);
    if (interactable) {
      found = interactable;
      break;
    }
  }

  state.current = found;

  if (found) {
    showPrompt(`[E]  ${found.prompt}`);
  } else {
    clearPrompt();
  }
}

/**
 * Resolve which registered interactable (if any) owns a given mesh.
 * Checks the mesh and all its ancestors by matching world-space proximity
 * to the interactable's registered position.
 */
function findInteractableForObject(obj: THREE.Object3D): Interactable | null {
  // Walk up to find a named group matching a registered id
  let node: THREE.Object3D | null = obj;
  while (node) {
    const id = node.name;
    if (id) {
      const match = state.allInteractables.find((ia) => ia.id === id);
      if (match) return match;
    }
    node = node.parent;
  }
  return null;
}

/**
 * Headless interact — used by window.__test.interact().
 * Finds the nearest interactable within its declared radius from the camera.
 * This bypasses pointer-lock so it works in the Playwright harness.
 */
export function headlessInteract(): boolean {
  if (!state.camera) return false;
  const camPos = state.camera.position;

  // First prefer the current raycast target (if any)
  if (state.current) {
    triggerCurrent();
    return true;
  }

  // Fall back: nearest within radius
  let best: Interactable | null = null;
  let bestDist = Infinity;

  for (const ia of state.allInteractables) {
    const dist = camPos.distanceTo(ia.position);
    if (dist <= ia.radius && dist < bestDist) {
      best = ia;
      bestDist = dist;
    }
  }

  if (best) {
    best.onInteract({ playerPos: camPos.clone() });
    return true;
  }
  return false;
}
