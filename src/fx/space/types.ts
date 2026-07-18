/**
 * Public types for the space lane.
 */

import type * as THREE from 'three';

/** Scan readout for the nearest visible hero body. */
export interface ScanData {
  name: string;
  class: string;
  composition: string;
  /** Distance from the canopy anchor in raw world units (caller labels units). */
  distanceKm: number;
}

/** The 'Living Cruise' encounter director. Drives the whole space system. */
export interface SpaceDirector {
  /** Master tick — call each frame with elapsed seconds (drives everything). */
  tick(elapsed: number): void;
  /** Nearest visible hero scan, or null when none is in scan range. */
  getScanData(): ScanData | null;
  /** Live 'body' cast entry count (heroes + ambients) — used by the T12
   *  universe-coherence test to assert the HERO_CAP invariant. */
  getBodyCount(): number;
  /** Dispose all live cast + far starfield, remove from scene. */
  dispose(): void;
  /** Container the director adds bodies/asteroids/events into. */
  group: THREE.Group;
}
