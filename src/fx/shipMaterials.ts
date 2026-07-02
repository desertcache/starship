/**
 * Shared ship material instances — Phase 3 palette.
 * Import these singletons everywhere; never create per-room duplicates.
 * Generated ONCE on first import; cached for the session lifetime.
 *
 * v0.5: MeshStandardMaterial is now the DEFAULT.
 * Flag: ?materials=flat → Lambert fallback (performance / debug).
 *
 * v0.8 B1: updated wall roughness/metalness to painted-metal, added normal map.
 *          Kill switch: set WALL_NORMAL_MAP = false to disable normal map wiring.
 */
import * as THREE from 'three';
import {
  makeCreamWallTexture,
  makeCreamOrangeBandTexture,
  makeGunmetalFloorTexture,
  makeGunmetalCeilingTexture,
  makeFloorRoughnessMapTexture,
  makeWallNormalMapTexture,
} from './textures.js';
import {
  makeHazardStripingTexture,
  makeRedAccentTexture,
  makeConsoleScreenTexture,
  makeTealStripTexture,
  makeCeilingLightTexture,
  makeOrangeFrameTexture,
} from './texturesEmissive.js';

// ── Kill switch — set false to disable wall normal maps ───────────────────────
const WALL_NORMAL_MAP = true;

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
 * v0.8: world UVs carry tiling — repeat(1,1). Painted metal: rough 0.80, metal 0.08.
 */
export const matShipWall: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? (() => {
        const wallTex = makeCreamWallTexture();
        wallTex.repeat.set(1, 1);
        const mat = new THREE.MeshStandardMaterial({
          map: wallTex,
          roughness: 0.80,
          metalness: 0.08,
          envMapIntensity: 0.2,
          side: THREE.FrontSide,
        });
        if (WALL_NORMAL_MAP) {
          const nMap = makeWallNormalMapTexture();
          nMap.repeat.set(1, 1);
          mat.normalMap       = nMap;
          // Stage D: 0.35→0.50 — stronger seam/bolt relief at viewing distance
          mat.normalScale.set(0.50, 0.50);
        }
        return mat;
      })()
    : new THREE.MeshLambertMaterial({
        map: setRepeat(makeCreamWallTexture(), 1, 1),
        side: THREE.FrontSide,
      });

/**
 * Cream wall with burnt-orange waist band.
 * v0.8: world UVs — repeat(1,1).
 */
export const matShipWallBand: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? (() => {
        const wallTex = makeCreamOrangeBandTexture();
        wallTex.repeat.set(1, 1);
        const mat = new THREE.MeshStandardMaterial({
          map: wallTex,
          roughness: 0.80,
          metalness: 0.08,
          envMapIntensity: 0.2,
          side: THREE.FrontSide,
        });
        if (WALL_NORMAL_MAP) {
          const nMap = makeWallNormalMapTexture();
          nMap.repeat.set(1, 1);
          mat.normalMap       = nMap;
          mat.normalScale.set(0.50, 0.50);
        }
        return mat;
      })()
    : new THREE.MeshLambertMaterial({
        map: setRepeat(makeCreamOrangeBandTexture(), 1, 1),
        side: THREE.FrontSide,
      });

// ── Floor / ceiling materials ──────────────────────────────────────────────────

/** Dark gunmetal floor — worn metal deck plates.
 * v0.9 RADIANCE fix-round H5: roughness 0.40→0.65, metalness 0.58→0.40,
 * envMapIntensity 0.9→0.50 — the glossier Stage D tune produced near-blown
 * specular pools at grazing angles (corridor/galley/quarters, 2 critics),
 * making the floor the brightest region in every room and out-competing the
 * fixture pools for the "bright anchor" read. Retuned toward matte
 * tread-plate; the roughnessMap streaks (set below) still carry the "worn
 * metal" life, they just no longer blow out.
 */
export const matShipFloor: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? new THREE.MeshStandardMaterial({
        map:           setRepeat(makeGunmetalFloorTexture(), 1, 1),
        roughnessMap:  setRepeat(makeFloorRoughnessMapTexture(), 1, 1),
        roughness:     0.65,
        metalness:     0.40,
        envMapIntensity: 0.50,
        side: THREE.FrontSide,
      })
    : new THREE.MeshLambertMaterial({
        map: setRepeat(makeGunmetalFloorTexture(), 1, 1),
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

/**
 * Hazard striping — engineering danger zones.
 * v0.9 A2: Lambert → Standard for env-map consistency with the rest of the
 * PBR ship materials (painted-metal family: matte, low env pickup).
 */
export const matHazardStriping: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: setRepeat(makeHazardStripingTexture(), 2, 2),
  roughness: 0.75,
  metalness: 0.10,
  envMapIntensity: 0.25,
  side: THREE.FrontSide,
});

/**
 * Deep-red accent panel.
 * v0.9 A2: Lambert → Standard, same painted-metal family as the wall panels.
 */
export const matRedAccent: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: setRepeat(makeRedAccentTexture(), 2, 2),
  roughness: 0.75,
  metalness: 0.10,
  envMapIntensity: 0.25,
  side: THREE.FrontSide,
});

// ── Emissive materials ─────────────────────────────────────────────────────────

/**
 * Emissive teal floor strip (#46E0D8).
 * MeshBasicMaterial — always reads bright regardless of lighting.
 * toneMapped=false ensures the emissive value never gets tone-compressed
 * below the bloom threshold after the threshold raise to 0.90.
 */
// Stage D: subordinate strips — reduced ~35% brightness, desaturated toward
// muted #3FBFB5 family. Must read as glowing accent lines but BELOW warm
// fixture pools in loudness. Was 0x4FFAEA (too bright/saturated vs refs).
export const matTealStrip: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: makeTealStripTexture(),
  color: 0x2E9E98,
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

/** Burnt-orange door frame / rail trim — anodised metal channel.
 * v0.9 RADIANCE fix-round H3: roughness 0.30→0.40, metalness 0.78→0.65,
 * envMapIntensity 0.8→0.55 — the old high-gloss/high-metal combo produced a
 * glossy "varnished" sheen on the corridor's long handrails (this same
 * material) that read as lacquered wood rather than anodized metal. Semi-gloss
 * per the palette spec keeps the orange accent identity without the varnish read.
 */
export const matDoorFrame: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial =
  PBR_ENABLED
    ? new THREE.MeshStandardMaterial({
        map: setRepeat(makeOrangeFrameTexture(), 1, 4),
        roughness: 0.40,
        metalness: 0.65,
        envMapIntensity: 0.55,
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
