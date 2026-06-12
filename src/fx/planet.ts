/**
 * planet.ts — the space lane's public PlanetResult entry, now a thin adapter
 * over the v0.4 SpaceDirector.
 *
 * v0.3 returned a single gas-giant mesh. v0.4 'Living Cruise' replaces that
 * static body with the full streaming encounter system. To preserve the hard
 * contract — main.ts (unowned) calls `ship.planet.tick(elapsed)` every frame —
 * assembly.ts wraps the director as a PlanetResult via wrapDirectorAsPlanetResult.
 *
 * PlanetResult keeps its existing members (mesh, tick, dispose) and is WIDENED
 * with an optional getScanData() so the scan readout survives the tick chain.
 */

import type * as THREE from 'three';
import type { SpaceDirector, ScanData } from './space/types.js';

export interface PlanetResult {
  /** assembly.ts does scene.add(planet.mesh); for v0.4 this is director.group. */
  mesh: THREE.Mesh;
  /** Call each frame with elapsed seconds — drives the ENTIRE space system. */
  tick(elapsed: number): void;
  dispose(): void;
  /** Nearest visible hero scan, or null. Widened member (optional). */
  getScanData?(): ScanData | null;
}

/**
 * Adapt a SpaceDirector to the PlanetResult shape main.ts expects.
 * director.group is added to the scene (as planet.mesh); director.tick drives
 * the whole system through the unchanged main.ts call site.
 */
export function wrapDirectorAsPlanetResult(director: SpaceDirector): PlanetResult {
  return {
    mesh: director.group as unknown as THREE.Mesh,
    tick: (elapsed: number): void => director.tick(elapsed),
    dispose: (): void => director.dispose(),
    getScanData: (): ScanData | null => director.getScanData(),
  };
}
