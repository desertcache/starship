/**
 * src/core/worldTypes.ts — FROZEN v1.0 "THRESHOLD" interfaces.
 *
 * Stage A authors this file; NOBODY else edits it. Every campaign lane
 * (annex, worlds, creature engine, codex) programs against these contracts.
 * See docs/design-v1.0-threshold.md.
 */

import type * as THREE from 'three';
import type { AABB, Interactable } from '../world/types.js';
import type { NamedCamera } from './cameras.js';

/** Canonical worlds. The throwaway `dev-void` proof world keys itself 'dev'
 *  (a localized cast in src/world/worlds/devVoid.ts) and is deleted in Stage D;
 *  it is intentionally NOT a member here. */
export type WorldId = 'ship' | 'verdant' | 'ashfall' | 'rift';

export interface WorldSpawn {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

export interface World {
  id: WorldId;
  /** Own background/fog/lights/env. Only the active world's scene renders. */
  scene: THREE.Scene;
  /** Props + boundary rails, in world space. */
  colliders: AABB[];
  /** Return portal, relic, scannables (creature interactables come from CreatureHandles). */
  interactables: Interactable[];
  /** Names MUST be prefixed `${id}-`. */
  cameras: NamedCamera[];
  /** Arrival pad, facing something good. */
  spawn: WorldSpawn;
  /** Analytic ground height at (x,z). Ship adapter returns 0. */
  groundHeight(x: number, z: number): number;
  update(dt: number, playerPos: THREE.Vector3): void;
  dispose(): void;
}

// ── Creature contract (Stage A ships a visible stub; Stage C swaps internals) ──

export type BodyPlan = 'quadruped' | 'skitterer' | 'floater' | 'glider';
export type Temperament = 'placid' | 'skittish' | 'curious';

export interface CreatureSpec {
  /** Codex id, e.g. 'verdant-grazer' — UNIQUE across worlds. */
  id: string;
  /** e.g. 'LOAMSTRIDER'. */
  scanName: string;
  /** One codex line. */
  lore: string;
  plan: BodyPlan;
  /** Body length, meters. */
  sizeM: number;
  palette: { primary: string; secondary: string; emissive: string };
  gaitHz: number;
  temperament: Temperament;
  /** Population (herds share geometry / instance). */
  count: number;
  seed: number;
  /** Stay within this radius of spawn center. */
  roamRadius: number;
}

export interface CreatureHandles {
  group: THREE.Group;
  /** One per creature; `.position` synced every update. */
  interactables: Interactable[];
  update(dt: number, playerPos: THREE.Vector3): void;
  dispose(): void;
}
