/**
 * Ceiling fixture builder — lane B2 "Ceiling & fixtures".
 *
 * Replaces giant-slab ceiling panels with discrete recessed fixtures:
 *   - Gunmetal housing frame (4 thin border boxes, ≥5mm proud of ceiling)
 *   - Dark recess cap (cavity interior face)
 *   - Warm emissive diffuser (hot-core canvas texture, toneMapped:false → bloom)
 *   - Grille variant: 4 thin slats across the opening
 *   - Conduit pipe runs + bracket boxes along ceiling edges (all rooms except corridor)
 *
 * Draw-call discipline: ONE gunmetal mesh + ONE emissive mesh per room.
 * All intermediate geometries are disposed after mergeGeometries().
 *
 * Geometry helpers → ceilingFixtureGeo.ts
 * Material/texture singletons → fx/texturesFixtures.ts
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { matFixtureEmissive, matFixtureEmissiveCool, matFixtureHousing } from '../fx/texturesFixtures.js';
import { addFixtureHalation } from '../fx/glow.js';
import {
  identifyRoom,
  seededRng,
  getFixtureSpecs,
  pushHousingGeos,
  pushSlatGeos,
  makeDiffuserGeo,
  addConduitRuns,
  pushCargoStem,
  RECESS_DEPTH,
} from './ceilingFixtureGeo.js';

/**
 * Build discrete recessed ceiling fixtures for one room and add them to `group`.
 * Produces at most TWO meshes (gunmetal housing + emissive diffuser) keeping
 * draw calls flat.
 *
 * @param group   Room group (local origin = floor center).
 * @param W       Room width  (X)
 * @param H       Room height (Y)
 * @param D       Room depth  (Z)
 */
export function buildCeilingFixtures(
  group: THREE.Group,
  W: number,
  H: number,
  D: number,
): void {
  const room  = identifyRoom(W, D);
  const rand  = seededRng(W * 1000 + D * 100 + H * 10);
  const specs = getFixtureSpecs(room, rand);

  if (specs.length === 0) return;

  // Cargo bay uses pendant-style fixtures that drop 0.15m below the 5m ceiling
  const isPendant   = room === 'cargo';
  const pendantDrop = isPendant ? 0.15 : 0.0;

  // v0.9 B3: cargo's fixtures use the cool-white lens (+ cool halo) so the
  // SOURCE matches its cool-white pool light (cargoPt 0xe8eef2). Every other
  // room keeps the warm amber lens + warm halo.
  const emissiveMat = isPendant ? matFixtureEmissiveCool : matFixtureEmissive;
  const haloColor   = isPendant ? 0xd0e4f2 : undefined;

  const housingGeos: THREE.BufferGeometry[]  = [];
  const emissiveGeos: THREE.BufferGeometry[] = [];

  for (const { x, z, grille } of specs) {
    const topY = H - pendantDrop; // housing top surface (flush with ceiling or pendant)

    // Housing frame: 4 border boxes + recess cap
    pushHousingGeos(housingGeos, x, z, topY);

    // Grille slats across the opening (seeded 50/50)
    if (grille) pushSlatGeos(housingGeos, x, z, topY);

    // Pendant stem (cargo only)
    if (isPendant) pushCargoStem(housingGeos, x, z, H, pendantDrop);

    // Emissive diffuser plane
    emissiveGeos.push(makeDiffuserGeo(x, z, topY));
  }

  // Conduit runs: 2 per room (port/starboard ceiling edges); corridor skipped
  addConduitRuns(housingGeos, room, W, H, D);

  // ── Merge gunmetal batch (housings + conduits) ─────────────────────────────
  if (housingGeos.length > 0) {
    const merged = mergeGeometries(housingGeos);
    for (const g of housingGeos) g.dispose();
    const mesh = new THREE.Mesh(merged, matFixtureHousing);
    mesh.name = `ceiling-housing-${room}`;
    group.add(mesh);
  }

  // ── Merge emissive batch (diffusers) ──────────────────────────────────────
  if (emissiveGeos.length > 0) {
    const merged = mergeGeometries(emissiveGeos);
    for (const g of emissiveGeos) g.dispose();
    const mesh = new THREE.Mesh(merged, emissiveMat);
    mesh.name = `ceiling-emissive-${room}`;
    group.add(mesh);
  }

  // ── Halation (v0.9 B2 glow build) — one glow quad per fixture, floating
  // just below the lens. Shared geometry/material live in fx/glow.ts.
  const diffuserY = (H - pendantDrop) - RECESS_DEPTH;
  addFixtureHalation(group, specs.map(({ x, z }) => ({ x, z })), diffuserY, haloColor);
}
