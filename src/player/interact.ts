/**
 * src/player/interact.ts — Phase 4 interaction raycaster.
 *
 * Each frame, casts a ray from the camera centre into the scene.
 * If it hits a registered interactable within 2.5m, shows the prompt.
 * Pressing E triggers onInteract on the current target.
 *
 * Seated toggle-off: if the player is currently seated (state.seated=true),
 * pressing E calls exitAnchor() to stand up — regardless of raycast target.
 * This is the only addition to the headless raycast/proximity fallback behavior.
 *
 * Headless (no pointer-lock) fallback for window.__test.interact():
 *   falls back to nearest registered interactable within radius.
 */

import * as THREE from 'three';
import type { Interactable } from '../world/types.js';
import { showPrompt, clearPrompt } from '../ui/hud.js';
import { getState } from '../core/state.js';
import { exitAnchor } from './controller.js';
import { setPlayerPosForDoors } from '../world/doors.js';

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

// ── Active-world overrides (WorldManager owns these) ─────────────────────────
//
// Defaults are null → ship behavior is byte-for-byte unchanged (raycast the
// ship scene, proximity over the globally-registered ship+v0.2 interactables).
// On a pocket-world switch the manager swaps in that world's scene + its own
// interactable list; on return to ship it resets both to null.
let worldScene: THREE.Scene | null = null;
let worldInteractables: Interactable[] | null = null;

export function setActiveWorldScene(scene: THREE.Scene | null): void {
  worldScene = scene;
  state.current = null; // drop any stale raycast target across the swap
}

export function setActiveWorldInteractables(list: Interactable[] | null): void {
  worldInteractables = list;
  state.current = null;
}

function effectiveScene(): THREE.Scene | null {
  return worldScene ?? state.scene;
}

function effectiveList(): Interactable[] {
  return worldInteractables ?? state.allInteractables;
}

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
  if (e.code !== 'KeyE') return;

  // Seated toggle-off: press E while seated → stand up
  const shipState = getState();
  if (shipState.seated) {
    exitAnchor();
    return;
  }

  if (state.current) {
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

  // Thread player position to doors.ts for auto-close distance check
  setPlayerPosForDoors(state.camera.position);

  const scene = effectiveScene();
  if (!scene) return;

  // Cast from camera centre into the ACTIVE world's scene
  state.raycaster.setFromCamera(new THREE.Vector2(0, 0), state.camera);
  const hits = state.raycaster.intersectObjects(scene.children, true);

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
    const label = found.getPrompt ? found.getPrompt() : found.prompt;
    showPrompt(`[E]  ${label}`);
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
  const list = effectiveList();
  let node: THREE.Object3D | null = obj;
  while (node) {
    const id = node.name;
    if (id) {
      const match = list.find((ia) => ia.id === id);
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
 * Does NOT trigger seated toggle-off (seated state is not expected in headless tests).
 */
export function headlessInteract(): boolean {
  if (!state.camera) return false;
  const camPos = state.camera.position;

  // First prefer the current raycast target (if any)
  if (state.current) {
    triggerCurrent();
    return true;
  }

  // Fall back: nearest within radius (over the active world's interactables)
  let best: Interactable | null = null;
  let bestDist = Infinity;

  for (const ia of effectiveList()) {
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
