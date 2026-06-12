/**
 * Shared ship material instances — Phase 3 palette.
 * Import these singletons everywhere; never create per-room duplicates.
 * Generated ONCE on first import; cached for the session lifetime.
 */
import * as THREE from 'three';
import {
  makeCreamWallTexture,
  makeCreamOrangeBandTexture,
  makeGunmetalFloorTexture,
  makeGunmetalCeilingTexture,
} from './textures.js';
import {
  makeHazardStripingTexture,
  makeRedAccentTexture,
  makeConsoleScreenTexture,
  makeTealStripTexture,
  makeCeilingLightTexture,
  makeOrangeFrameTexture,
} from './texturesEmissive.js';

// ── Helper ─────────────────────────────────────────────────────────────────────

/** Apply UV repeat to a texture and return it. */
function setRepeat(tex: THREE.CanvasTexture, rx: number, ry: number): THREE.CanvasTexture {
  tex.repeat.set(rx, ry);
  return tex;
}

// ── Wall materials ─────────────────────────────────────────────────────────────

/**
 * Standard cream seamed wall panel.
 * repeat(2,2) → 1 seam panel ≈ 0.5 m of wall.
 */
export const matShipWall: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
  map: setRepeat(makeCreamWallTexture(), 2, 2),
  side: THREE.FrontSide,
});

/**
 * Cream wall with burnt-orange waist band.
 * repeat(2,1) keeps band proportion; use for corridor + feature walls.
 */
export const matShipWallBand: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
  map: setRepeat(makeCreamOrangeBandTexture(), 2, 1),
  side: THREE.FrontSide,
});

// ── Floor / ceiling materials ──────────────────────────────────────────────────

/** Dark gunmetal floor. */
export const matShipFloor: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
  map: setRepeat(makeGunmetalFloorTexture(), 2, 2),
  side: THREE.FrontSide,
});

/** Gunmetal ceiling with panel grid. */
export const matShipCeiling: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
  map: setRepeat(makeGunmetalCeilingTexture(), 2, 2),
  side: THREE.FrontSide,
});

// ── Accent / feature materials ─────────────────────────────────────────────────

/** Hazard striping — engineering danger zones. */
export const matHazardStriping: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
  map: setRepeat(makeHazardStripingTexture(), 2, 2),
  side: THREE.FrontSide,
});

/** Deep-red accent panel. */
export const matRedAccent: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
  map: setRepeat(makeRedAccentTexture(), 2, 2),
  side: THREE.FrontSide,
});

// ── Emissive materials ─────────────────────────────────────────────────────────

/**
 * Emissive teal floor strip (#46E0D8).
 * MeshBasicMaterial — always reads bright regardless of lighting.
 */
export const matTealStrip: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: makeTealStripTexture(),
  color: 0x46E0D8,
  side: THREE.FrontSide,
});

/**
 * Emissive ceiling light panel (warm white).
 * MeshBasicMaterial — always appears lit.
 */
export const matCeilingLight: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: makeCeilingLightTexture(),
  color: 0xFFF8E8,
  side: THREE.FrontSide,
});

// ── Door frame ─────────────────────────────────────────────────────────────────

/** Burnt-orange door frame. */
export const matDoorFrame: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
  map: setRepeat(makeOrangeFrameTexture(), 1, 4),
  side: THREE.FrontSide,
});

// ── Console screen ─────────────────────────────────────────────────────────────

/**
 * Console / screen emissive material.
 * Room agents apply to screen/console prop faces. MeshBasicMaterial glows.
 */
export const matConsoleScreen: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: makeConsoleScreenTexture(),
  side: THREE.FrontSide,
});
