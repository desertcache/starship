/**
 * Procedural textures for ceiling fixture geometry — lane B2 "Ceiling & fixtures".
 * Defines its OWN material singletons; never imports from shipMaterials.ts or
 * texturesEmissive.ts (those files are locked to other lanes).
 *
 * Exports:
 *   makeFixtureDiffuserTexture()      — warm emissive diffuser (hot core for bloom)
 *   makeFixtureDiffuserCoolTexture()  — cool-white variant (v0.9 B3, cargo bay)
 *   makeFixtureHousingTexture()       — dark gunmetal housing frame
 *   matFixtureEmissive                — MeshBasicMaterial singleton (warm, toneMapped:false)
 *   matFixtureEmissiveCool            — MeshBasicMaterial singleton (cool-white, cargo)
 *   matFixtureHousing                 — MeshLambertMaterial singleton (dark gunmetal)
 *
 * v0.9 A2: `cached()` now comes from textureHelpers.ts (neutral shared utility,
 * not another lane's file) so these textures register into the anisotropy
 * sweep in main.ts. No lane-ownership rule is crossed — textureHelpers.ts is
 * the shared low-level helper file, not shipMaterials/texturesEmissive.
 */
import * as THREE from 'three';
import { cached } from './textureHelpers.js';

// ── Diffuser texture ───────────────────────────────────────────────────────────

/**
 * Warm emissive diffuser for recessed fixture opening.
 * Hot tungsten core (clears bloom threshold 0.90 with toneMapped:false).
 * 128×64 — landscape to match fixture aspect.
 */
export function makeFixtureDiffuserTexture(): THREE.CanvasTexture {
  return cached('fixture-diffuser', () => {
    const W = 128;
    const H = 64;
    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Deep amber base — recess cavity dark amber
    ctx.fillStyle = '#8B5A10';
    ctx.fillRect(0, 0, W, H);

    // Hot core radial gradient — very tight bright centre that clears bloom.
    // v0.9 A2: stop 0 pushed to fully opaque white so the composited core
    // pixel is RGB≥250 on every channel (old 0.92-alpha stop only reached
    // ~246,239,222 over the amber base — just under most bloom thresholds).
    const cx = W / 2;
    const cy = H / 2;
    const r  = Math.max(W, H) * 0.55;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0.00, 'rgba(255,255,255,1.00)'); // bloom-clearing hot core, RGB≥250
    grad.addColorStop(0.08, 'rgba(255,250,235,0.85)'); // tight hot falloff
    grad.addColorStop(0.20, 'rgba(255,235,185,0.50)'); // tight warm falloff
    grad.addColorStop(0.35, 'rgba(200,150,60,0.30)');
    grad.addColorStop(0.65, 'rgba(80,45,8,0.60)');
    grad.addColorStop(1.00, 'rgba(20,10,2,0.85)');     // dark cavity rim
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, true); // v0.9 B1: COLOR emissive — decode as sRGB
}

/**
 * Cool blue-white emissive diffuser — cargo bay industrial identity (v0.9 B3).
 * Same hot-white core (bloom gate) as the warm variant, but the cavity and
 * falloff are cool blue-grey instead of amber, so the fixture SOURCE matches the
 * cool-white pool light (cargoPt 0xe8eef2) it casts — no more warm-lens /
 * cool-light diegetic mismatch.
 */
export function makeFixtureDiffuserCoolTexture(): THREE.CanvasTexture {
  return cached('fixture-diffuser-cool', () => {
    const W = 128;
    const H = 64;
    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Cool steel-blue cavity base
    ctx.fillStyle = '#1B3038';
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const r  = Math.max(W, H) * 0.55;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0.00, 'rgba(255,255,255,1.00)'); // bloom-clearing hot core, RGB≥250
    grad.addColorStop(0.08, 'rgba(238,246,252,0.85)'); // tight cool-white falloff
    grad.addColorStop(0.20, 'rgba(200,224,240,0.50)'); // cool falloff
    grad.addColorStop(0.35, 'rgba(120,168,196,0.30)');
    grad.addColorStop(0.65, 'rgba(30,60,76,0.60)');
    grad.addColorStop(1.00, 'rgba(6,16,22,0.85)');     // dark cavity rim
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, true); // v0.9 B1: COLOR emissive — decode as sRGB
}

// ── Housing / gunmetal texture ─────────────────────────────────────────────────

/**
 * Dark gunmetal fixture housing with worn scratches.
 * 128×128.
 */
export function makeFixtureHousingTexture(): THREE.CanvasTexture {
  return cached('fixture-housing', () => {
    const S = 128;
    const canvas = document.createElement('canvas');
    canvas.width  = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    // Dark gunmetal base
    ctx.fillStyle = '#1C1E22';
    ctx.fillRect(0, 0, S, S);

    // Subtle brushed-metal streaks
    ctx.strokeStyle = 'rgba(50,55,65,0.35)';
    ctx.lineWidth   = 1;
    for (let i = 0; i < 12; i++) {
      const y = (i / 12) * S;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(S, y + (Math.sin(i * 2.3) * 4));
      ctx.stroke();
    }

    // Edge highlight (slightly lighter)
    ctx.strokeStyle = 'rgba(60,65,75,0.5)';
    ctx.lineWidth   = 2;
    ctx.strokeRect(1, 1, S - 2, S - 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, true); // v0.9 B1: COLOR diffuse — decode as sRGB
}

// ── Material singletons ────────────────────────────────────────────────────────

/**
 * Emissive diffuser material — toneMapped:false so the hot core clears
 * the 0.90 bloom threshold even after tone mapping.
 * Warm amber tint matches tungsten pool lights below.
 */
export const matFixtureEmissive: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: makeFixtureDiffuserTexture(),
  color: 0xF0C878,   // warm amber tint — aligns with existing warm PointLight pools
  side: THREE.FrontSide,
  toneMapped: false, // must stay false — bloom gate
});

/**
 * Cool-white diffuser material — cargo bay only (v0.9 B3). toneMapped:false so
 * the hot core still clears bloom. Cool tint matches the cargo cool-white pool.
 */
export const matFixtureEmissiveCool: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: makeFixtureDiffuserCoolTexture(),
  color: 0xD8E8F2,   // cool blue-white — matches cargoPt (0xe8eef2)
  side: THREE.FrontSide,
  toneMapped: false, // must stay false — bloom gate
});

/**
 * Dark gunmetal housing frame material.
 * MeshLambertMaterial — reads geometry under scene lighting.
 */
export const matFixtureHousing: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
  map: makeFixtureHousingTexture(),
  color: 0x22252A,
  side: THREE.FrontSide,
});
