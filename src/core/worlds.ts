/**
 * src/core/worlds.ts — WorldManager (Stage A).
 *
 * Owns world registration, the active-world pointer, and the switch sequence:
 *   fadeTransition → rebind composer scene → swap controller collider set +
 *   groundHeight → swap interaction scene/list → teleport to spawn → fade in.
 * Headless (__setCam, tests) switches SYNCHRONOUSLY with no fade.
 *
 * The ship is registered as a World via an adapter (groundHeight → 0, scene =
 * the main scene, cameras already registered). Switching to 'ship' resets the
 * interaction overrides to null so ship behavior is byte-for-byte unchanged.
 *
 * Ids are strings (not WorldId) so the throwaway 'dev' proof world flows
 * through registration/switching/cameras without touching the frozen WorldId.
 */

import * as THREE from 'three';
import type { World } from './worldTypes.js';
import type { WorldSpawn } from './worldTypes.js';
import type { BloomSystem } from '../fx/bloom.js';
import { fadeTransition } from '../ui/hud.js';
import { registerCam, setWorldActivator } from './cameras.js';
import { setGroundHeight, setActiveColliders } from '../player/controller.js';
import { setActiveWorldScene, setActiveWorldInteractables } from '../player/interact.js';
import { resetPortalTraversalLatch } from '../fx/portalSurface.js';

export interface SwitchOpts {
  /** Skip the fade and switch synchronously (headless / tests). */
  instant?: boolean;
  /** Teleport the player to the world's spawn. Default true; false for camera activation. */
  teleport?: boolean;
}

const worlds = new Map<string, World>();
let activeId = 'ship';
let camera: THREE.PerspectiveCamera | null = null;
let bloom: BloomSystem | null = null;
let switching = false;

/** Install the camera-driven world activator. Call once, after bloom exists. */
export function initWorldManager(cam: THREE.PerspectiveCamera, bloomSystem: BloomSystem): void {
  camera = cam;
  bloom = bloomSystem;
  setWorldActivator((id: string): void => activateForCamera(id));
}

export function registerWorld(world: World): void {
  worlds.set(world.id, world);
  for (const c of world.cameras) {
    registerCam(c.name, c.position, c.lookAt, world.id);
  }
}

export function getActiveWorldId(): string {
  return activeId;
}

export function getActiveWorld(): World {
  const w = worlds.get(activeId);
  if (!w) throw new Error(`No active world '${activeId}' registered`);
  return w;
}

export function hasWorld(id: string): boolean {
  return worlds.has(id);
}

export function getWorldScene(id: string): THREE.Scene | null {
  return worlds.get(id)?.scene ?? null;
}

export function getWorldSpawn(id: string): WorldSpawn | null {
  return worlds.get(id)?.spawn ?? null;
}

/** Synchronous core of a switch: rebind everything, optionally teleport. */
function applySwitch(id: string, teleport: boolean): void {
  const target = worlds.get(id);
  if (!target || !camera || !bloom) return;

  bloom.setScene(target.scene);
  setActiveColliders(target.colliders);
  setGroundHeight(target.groundHeight);

  if (id === 'ship') {
    setActiveWorldScene(null);           // null → ship scene + globally-registered list
    setActiveWorldInteractables(null);
  } else {
    setActiveWorldScene(target.scene);
    setActiveWorldInteractables(target.interactables);
  }

  activeId = id;
  resetPortalTraversalLatch();

  if (teleport) {
    camera.position.copy(target.spawn.position);
    camera.lookAt(target.spawn.lookAt);
  }
}

/** Camera activation path (__setCam): flip the world with NO spawn teleport —
 *  teleportToCamera sets the exact shot position immediately afterwards. */
function activateForCamera(id: string): void {
  if (id === activeId || !worlds.has(id)) return;
  applySwitch(id, false);
}

/**
 * Switch to world `id`. Fades by default; `opts.instant` (headless/tests) skips
 * the fade. Same-world calls apply synchronously. Concurrent fades are ignored.
 */
export function switchWorld(id: string, opts: SwitchOpts = {}): Promise<void> {
  if (!worlds.has(id)) return Promise.resolve();
  const teleport = opts.teleport !== false;

  if (opts.instant || id === activeId) {
    applySwitch(id, teleport);
    return Promise.resolve();
  }
  if (switching) return Promise.resolve();

  switching = true;
  return fadeTransition(() => applySwitch(id, teleport)).then((): void => {
    switching = false;
  });
}
