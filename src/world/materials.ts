/**
 * Shared world materials — Phase 3 palette.
 * These are the material singletons used by roomBuilder, windowWall, and all room modules.
 * They delegate to src/fx/shipMaterials.ts which holds the actual instances.
 */
import { matShipWall, matShipFloor, matShipCeiling, matShipWallBand } from '../fx/shipMaterials.js';
import type * as THREE from 'three';

/** Standard cream seamed wall. */
export const matWall: THREE.MeshLambertMaterial = matShipWall;

/** Cream wall with burnt-orange horizontal band (use for corridor + feature walls). */
export const matWallBand: THREE.MeshLambertMaterial = matShipWallBand;

/** Gunmetal worn floor. */
export const matFloor: THREE.MeshLambertMaterial = matShipFloor;

/** Gunmetal ceiling with panel grid. */
export const matCeiling: THREE.MeshLambertMaterial = matShipCeiling;
