/**
 * Shared ship material instances — Phase 3 palette.
 * Import these singletons everywhere; never create per-room duplicates.
 * Generated ONCE on first import; cached for the session lifetime.
 *
 * v0.5: MeshStandardMaterial is now the DEFAULT.
 * Flag: ?materials=flat → Lambert fallback (performance / debug).
 */
import * as THREE from 'three';
import {
  makeCreamWallTexture,
  makeCreamOrangeBandTexture,
  makeGunmetalFloorTexture,
  makeGunmetalCeilingTexture,
  makeFloorRoughnessMapTexture,
} from './textures.js';
import {
  makeHazardStripingTexture,
  makeRedAccentTexture,
  makeConsoleScreenTexture,
  makeTealStripTexture,
  makeCeilingLightTexture,
  makeOrangeFrameTexture,
} from './texturesEmissive.js';

// ── PBR flag — PBR is DEFAULT; ?materials=flat forces Lambert ────────────────

const _params = new URLSearchParams(
  typeof window !== 'undefined' ? window.location.search : '',
);
/** True unless ?materials=flat is in the URL. Standard is the shipped default. */
export const PBR_ENABLED: boolean = _params.get('materials') !== 'flat';

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
 * PBR: painted surface — high roughness, near-zero metalness, low envMap pickup.
 */
export const matShipWall: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? new THREE.MeshStandardMaterial({
        map: setRepeat(makeCreamWallTexture(), 2, 2),
        roughness: 0.88,
        metalness: 0.0,
        envMapIntensity: 0.2,
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
        roughness: 0.88,
        metalness: 0.0,
        envMapIntensity: 0.2,
        side: THREE.FrontSide,
      })
    : new THREE.MeshLambertMaterial({
        map: setRepeat(makeCreamOrangeBandTexture(), 2, 1),
        side: THREE.FrontSide,
      });

// ── Floor / ceiling materials ──────────────────────────────────────────────────

/** Dark gunmetal floor — worn metal deck plates.
 * roughnessMap adds streaky variation 0.3-0.6 so light panels reflect in streaks.
 * High envMapIntensity so the floor picks up the room environment specular.
 */
export const matShipFloor: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? new THREE.MeshStandardMaterial({
        map: setRepeat(makeGunmetalFloorTexture(), 2, 2),
        roughnessMap: setRepeat(makeFloorRoughnessMapTexture(), 2, 2),
        roughness: 0.42,
        metalness: 0.55,
        envMapIntensity: 0.9,
        side: THREE.FrontSide,
      })
    : new THREE.MeshLambertMaterial({
        map: setRepeat(makeGunmetalFloorTexture(), 2, 2),
        side: THREE.FrontSide,
      });

/** Gunmetal ceiling with panel grid — brushed metal panels.
 * Moderate env pickup for subtle reflections from ceiling lights.
 */
export const matShipCeiling: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? new THREE.MeshStandardMaterial({
        map: setRepeat(makeGunmetalCeilingTexture(), 2, 2),
        roughness: 0.55,
        metalness: 0.45,
        envMapIntensity: 0.5,
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
// v0.6 P6: color stepped down from 0x55FFEE toward 0x46E0D8 (nav-accent, not
// the brightest teal in frame). Using 0x4FFAEA — a mid-point that reduces the
// over-saturated white-teal while keeping enough brightness to clear bloom
// threshold 0.90 via the toneMapped:false path + texture centre highlight.
// If strips go flat in verify shots, step back up toward 0x55FFEE.
export const matTealStrip: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: makeTealStripTexture(),
  color: 0x4FFAEA,
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
  // v0.5 Stage 2: warm amber tint (was pure white). The hot texture core still
  // clears the 0.90 bloom threshold so fixtures halo, but the panel body reads
  // as a dim warm tungsten housing — matching the WARM pools — not a white slab.
  color: 0xF6DCB4,
  side: THREE.FrontSide,
  toneMapped: false,
});

// ── Door frame ─────────────────────────────────────────────────────────────────

/** Burnt-orange door frame — anodised metal channel.
 * Low roughness + high metalness + high envMap = clear specular highlight.
 */
export const matDoorFrame: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? new THREE.MeshStandardMaterial({
        map: setRepeat(makeOrangeFrameTexture(), 1, 4),
        roughness: 0.35,
        metalness: 0.7,
        envMapIntensity: 0.8,
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
