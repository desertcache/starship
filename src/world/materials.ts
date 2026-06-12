/**
 * Shared world materials — Phase 3 palette.
 * These are the material singletons used by roomBuilder, windowWall, and all room modules.
 * They delegate to src/fx/shipMaterials.ts which holds the actual instances.
 *
 * When ?materials=pbr is set, the underlying types are MeshStandardMaterial.
 * Consumers should treat these as THREE.Material for material assignment.
 */
import { matShipWall, matShipFloor, matShipCeiling, matShipWallBand } from '../fx/shipMaterials.js';
import type * as THREE from 'three';

/** Standard cream seamed wall. Lambert (default) or PBR Standard (?materials=pbr). */
export const matWall: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial = matShipWall;

/** Cream wall with burnt-orange horizontal band. Lambert or PBR Standard. */
export const matWallBand: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial = matShipWallBand;

/** Gunmetal worn floor. Lambert or PBR Standard. */
export const matFloor: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial = matShipFloor;

/** Gunmetal ceiling with panel grid. Lambert or PBR Standard. */
export const matCeiling: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial = matShipCeiling;
