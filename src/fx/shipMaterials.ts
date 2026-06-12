/**
 * Shared ship material instances — Phase 3 palette.
 * Import these singletons everywhere; never create per-room duplicates.
 * Generated ONCE on first import; cached for the session lifetime.
 *
 * Flag: ?materials=pbr  → MeshStandardMaterial with PBR params (default OFF).
 *                          Lambert stays the shipped default.
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

// ── PBR flag — read once at module init ───────────────────────────────────────

const _params = new URLSearchParams(
  typeof window !== 'undefined' ? window.location.search : '',
);
/** True when ?materials=pbr is in the URL. */
export const PBR_ENABLED: boolean = _params.get('materials') === 'pbr';

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
export const matShipWall: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? new THREE.MeshStandardMaterial({
        map: setRepeat(makeCreamWallTexture(), 2, 2),
        roughness: 0.85,
        metalness: 0.05,
        side: THREE.FrontSide,
      })
    : new THREE.MeshLambertMaterial({
        map: setRepeat(makeCreamWallTexture(), 2, 2),
        side: THREE.FrontSide,
      });

/**
 * Cream wall with burnt-orange waist band.
 * repeat(2,1) keeps band proportion; use for corridor + feature walls.
 */
export const matShipWallBand: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? new THREE.MeshStandardMaterial({
        map: setRepeat(makeCreamOrangeBandTexture(), 2, 1),
        roughness: 0.85,
        metalness: 0.05,
        side: THREE.FrontSide,
      })
    : new THREE.MeshLambertMaterial({
        map: setRepeat(makeCreamOrangeBandTexture(), 2, 1),
        side: THREE.FrontSide,
      });

// ── Floor / ceiling materials ──────────────────────────────────────────────────

/** Dark gunmetal floor. */
export const matShipFloor: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? new THREE.MeshStandardMaterial({
        map: setRepeat(makeGunmetalFloorTexture(), 2, 2),
        roughness: 0.45,
        metalness: 0.60,
        side: THREE.FrontSide,
      })
    : new THREE.MeshLambertMaterial({
        map: setRepeat(makeGunmetalFloorTexture(), 2, 2),
        side: THREE.FrontSide,
      });

/** Gunmetal ceiling with panel grid. */
export const matShipCeiling: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? new THREE.MeshStandardMaterial({
        map: setRepeat(makeGunmetalCeilingTexture(), 2, 2),
        roughness: 0.45,
        metalness: 0.60,
        side: THREE.FrontSide,
      })
    : new THREE.MeshLambertMaterial({
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
 * toneMapped=false ensures the emissive value never gets tone-compressed
 * below the bloom threshold after the threshold raise to 0.90.
 */
export const matTealStrip: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: makeTealStripTexture(),
  color: 0x55FFEE,   // slightly boosted from 0x46E0D8 to clear threshold 0.90
  side: THREE.FrontSide,
  toneMapped: false,
});

/**
 * Emissive ceiling light panel (warm white).
 * MeshBasicMaterial — always appears lit.
 * toneMapped=false ensures these panels stay above the 0.90 bloom threshold.
 */
export const matCeilingLight: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: makeCeilingLightTexture(),
  color: 0xFFFFFF,   // pure white to guarantee > 0.90 luminance for bloom
  side: THREE.FrontSide,
  toneMapped: false,
});

// ── Door frame ─────────────────────────────────────────────────────────────────

/** Burnt-orange door frame. */
export const matDoorFrame: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? new THREE.MeshStandardMaterial({
        map: setRepeat(makeOrangeFrameTexture(), 1, 4),
        roughness: 0.30,
        metalness: 0.80,
        side: THREE.FrontSide,
      })
    : new THREE.MeshLambertMaterial({
        map: setRepeat(makeOrangeFrameTexture(), 1, 4),
        side: THREE.FrontSide,
      });

// ── Console screen ─────────────────────────────────────────────────────────────

/**
 * Console / screen emissive material.
 * Room agents apply to screen/console prop faces. MeshBasicMaterial glows.
 * toneMapped=false keeps screen pixels above the 0.90 bloom threshold.
 */
export const matConsoleScreen: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: makeConsoleScreenTexture(),
  side: THREE.FrontSide,
  toneMapped: false,
});
