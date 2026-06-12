/**
 * Procedural textures for ceiling fixture geometry — lane B2 "Ceiling & fixtures".
 * Defines its OWN material singletons; never imports from shipMaterials.ts or
 * texturesEmissive.ts (those files are locked to other lanes).
 *
 * Exports:
 *   makeFixtureDiffuserTexture()  — warm emissive diffuser (hot core for bloom)
 *   makeFixtureHousingTexture()   — dark gunmetal housing frame
 *   matFixtureEmissive            — MeshBasicMaterial singleton (toneMapped:false)
 *   matFixtureHousing             — MeshLambertMaterial singleton (dark gunmetal)
 */
import * as THREE from 'three';

// ── Texture cache ──────────────────────────────────────────────────────────────

const _cache = new Map<string, THREE.CanvasTexture>();

function cached(key: string, build: () => THREE.CanvasTexture): THREE.CanvasTexture {
  if (!_cache.has(key)) {
    _cache.set(key, build());
  }
  return _cache.get(key)!;
}

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

    // Hot core radial gradient — very tight bright centre that clears bloom
    const cx = W / 2;
    const cy = H / 2;
    const r  = Math.max(W, H) * 0.55;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0.00, 'rgba(255,252,240,0.92)'); // bloom-clearing hot core
    grad.addColorStop(0.12, 'rgba(255,235,185,0.55)'); // tight warm falloff
    grad.addColorStop(0.30, 'rgba(200,150,60,0.30)');
    grad.addColorStop(0.65, 'rgba(80,45,8,0.60)');
    grad.addColorStop(1.00, 'rgba(20,10,2,0.85)');     // dark cavity rim
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  });
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
  });
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
 * Dark gunmetal housing frame material.
 * MeshLambertMaterial — reads geometry under scene lighting.
 */
export const matFixtureHousing: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
  map: makeFixtureHousingTexture(),
  color: 0x22252A,
  side: THREE.FrontSide,
});
