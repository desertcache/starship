/**
 * Procedural emissive + accent textures — Phase 3.
 * Covers: teal strip, ceiling light panel, orange door frame,
 *         hazard striping, deep-red accent.
 * Surface textures (walls, floor, ceiling): see textures.ts
 * Console/screen readout: see texturesConsole.ts (split out v0.9 A2 to stay
 * under the 300-line file limit).
 */
import * as THREE from 'three';
import { PAL, rng, addGrime, drawSeams, cached } from './textureHelpers.js';

export { makeConsoleScreenTexture } from './texturesConsole.js';

/**
 * Emissive teal strip (#46E0D8) with a thin hot core line, not a broad wash.
 * 64×64. Used on floor-edge strip geometry via MeshBasicMaterial.
 *
 * v0.9 A2: replaced the old broad centre-band gradient (25% white blended
 * across roughly a third of the strip's height) with a narrow near-white
 * core (~4px) that falls off to flat base teal within ~20px. A future
 * thresholded bloom pass should halo just this thin line, not the whole
 * strip. Kept energy-limited (narrow + fast falloff) so the average
 * brightness stays at or below the old gradient's — refs are warm-dominant,
 * teal reads as an accent, never louder than the fixture pools.
 */
export function makeTealStripTexture(): THREE.CanvasTexture {
  return cached('teal-strip-v2', () => {
    const W = 64;
    const H = 64;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = PAL.teal;
    ctx.fillRect(0, 0, W, H);

    // Thin hot core line at the vertical centre — true white at the exact
    // centre row, soft falloff to flat teal within ±10px either side.
    const coreY = H / 2;
    const band  = 10;
    const grad = ctx.createLinearGradient(0, coreY - band, 0, coreY + band);
    grad.addColorStop(0.0,  'rgba(255,255,255,0.0)');
    grad.addColorStop(0.40, 'rgba(255,255,255,0.05)');
    grad.addColorStop(0.5,  'rgba(255,255,255,1.0)');
    grad.addColorStop(0.60, 'rgba(255,255,255,0.05)');
    grad.addColorStop(1.0,  'rgba(255,255,255,0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, coreY - band, W, band * 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, true); // v0.9 B1: COLOR emissive — decode as sRGB
}

/**
 * Emissive ceiling light panel — warm tungsten fixture with soft radial falloff.
 * v0.5 Stage 2: warmer core (#FFEAC8 not #FFF8E8) and a darker, deeper edge
 * vignette so each panel reads as a FIXTURE (bright warm centre, dim rim) rather
 * than a flat clinical light-box. The hand-placed warm PointLight below it makes
 * the actual pool on the floor; the panel just needs to glow warm, not flood.
 * 256×128. Used on ceiling panel geometry via MeshBasicMaterial.
 */
export function makeCeilingLightTexture(): THREE.CanvasTexture {
  return cached('ceiling-light', () => {
    const W = 256;
    const H = 128;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // v0.6 P1: base darkened to #C89850 (amber housing, not near-white).
    // The tint color in shipMaterials.ts is 0xF6DCB4 and toneMapped=false —
    // the hot core below still clears 0.90 bloom so fixtures halo; the housing
    // reads as warm tungsten casing, not a white slab.
    ctx.fillStyle = '#C89850';
    ctx.fillRect(0, 0, W, H);

    // Tight hot core: only the very centre clears bloom threshold.
    // Falloff steepened so housing stays dim amber, not white.
    // v0.9 A2: added a true-white 0.0 stop (RGB≥250 composited) so the
    // upcoming thresholded bloom pass halos the core, not the amber slab —
    // old 0.80-alpha stop only reached ~244,229,204 over the amber base.
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.62);
    grad.addColorStop(0.0, 'rgba(255,255,255,1.00)');   // true hot core, RGB≥250
    grad.addColorStop(0.06, 'rgba(255,250,235,0.90)');  // tight hot falloff
    grad.addColorStop(0.18, 'rgba(255,235,200,0.20)');  // tighter falloff
    grad.addColorStop(0.45, 'rgba(140,95,40,0.40)');
    grad.addColorStop(1.0, 'rgba(60,35,10,0.80)');      // dark housing rim
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    return new THREE.CanvasTexture(canvas);
  }, true); // v0.9 B1: COLOR emissive — decode as sRGB
}

/**
 * Burnt-orange door frame — anodized brushed metal.
 * Vertical 1px streaks ±8% luminance, edge-wear highlights, gunmetal chip
 * flecks, bottom-grounding gradient, grime 0.15. 256×256, repeat 1×4.
 */
export function makeOrangeFrameTexture(): THREE.CanvasTexture {
  return cached('orange-frame', () => {
    const W = 256;
    const H = 256;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // 1. Base anodized orange
    ctx.fillStyle = '#C7641E';
    ctx.fillRect(0, 0, W, H);

    // 2. Vertical brushed micro-streaks — 1px columns, seeded ±8% luminance
    // v0.9 RADIANCE fix-round H3: alpha range cut ~55% (0.18-0.40 → 0.08-0.18).
    // This texture's U axis maps to whichever geometry dimension is longest
    // (e.g. the corridor's horizontal handrails, where U = the rail's full
    // length with no repeat) — at that stretch, the streaks read as
    // longitudinal wood-plank grain instead of a subtle anodized brush. Kept
    // "brushed ALONG the rail" (streak direction unchanged) but much lower
    // contrast so it stops reading as discrete planks.
    const streakRand = rng(1127);
    for (let x = 0; x < W; x++) {
      const delta = (streakRand() - 0.5) * 2 * 0.08; // -0.08..+0.08
      const alpha = 0.08 + streakRand() * 0.10;
      ctx.fillStyle = delta > 0
        ? `rgba(255,255,255,${(alpha * delta / 0.08).toFixed(3)})`
        : `rgba(0,0,0,${(alpha * (-delta) / 0.08).toFixed(3)})`;
      const yStart = Math.floor(streakRand() * 4);
      ctx.fillRect(x, yStart, 1, H - yStart - Math.floor(streakRand() * 4));
    }

    // 3. Edge-wear — brighter along both vertical edges (anodizing worn off)
    const edgeW = Math.floor(W * 0.10);
    const leftGrad = ctx.createLinearGradient(0, 0, edgeW, 0);
    leftGrad.addColorStop(0.0, 'rgba(255,210,160,0.50)');
    leftGrad.addColorStop(0.4, 'rgba(255,190,130,0.22)');
    leftGrad.addColorStop(1.0, 'rgba(255,190,130,0.00)');
    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 0, edgeW, H);
    const rightGrad = ctx.createLinearGradient(W, 0, W - edgeW, 0);
    rightGrad.addColorStop(0.0, 'rgba(255,210,160,0.50)');
    rightGrad.addColorStop(0.4, 'rgba(255,190,130,0.22)');
    rightGrad.addColorStop(1.0, 'rgba(255,190,130,0.00)');
    ctx.fillStyle = rightGrad;
    ctx.fillRect(W - edgeW, 0, edgeW, H);

    // 4. Chip flecks revealing gunmetal (#1C1E22)
    const chipRand = rng(2251);
    for (let i = 0; i < 18; i++) {
      const cx = Math.floor(chipRand() * W);
      const cy = Math.floor(chipRand() * H);
      const cw = Math.ceil(2 + chipRand() * 5);
      const ch = Math.ceil(1 + chipRand() * 3);
      ctx.fillStyle = `rgba(28,30,34,${(0.55 + chipRand() * 0.35).toFixed(3)})`;
      ctx.fillRect(cx, cy, cw, ch);
      if (chipRand() > 0.4) { // bare metal gleam above chip
        ctx.fillStyle = 'rgba(220,180,140,0.45)';
        ctx.fillRect(cx, cy - 1, cw, 1);
      }
    }

    // 5. Bottom grounding — darker near floor.
    // v0.9 RADIANCE fix-round H3: was near-black-RED (rgba(30,0,0,...)) — on
    // repeat-tiled long rails this compounded into a red-brown "wood" cast
    // across the whole visible strip. Neutralized toward a dark neutral-warm
    // (less saturated red) and halved alpha so it still grounds tall door
    // frames near the floor without tinting rails red.
    const groundGrad = ctx.createLinearGradient(0, H * 0.55, 0, H);
    groundGrad.addColorStop(0.0, 'rgba(0,0,0,0.00)');
    groundGrad.addColorStop(1.0, 'rgba(18,10,6,0.16)');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, 0, W, H);

    // 6. Grime
    addGrime(ctx, W, H, 88, 0.15);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, true); // v0.9 B1: COLOR diffuse — decode as sRGB
}

/**
 * Hazard striping — alternating burnt-orange and gunmetal diagonal bands.
 * 512×512. For engineering danger zones and warning panels.
 */
export function makeHazardStripingTexture(): THREE.CanvasTexture {
  return cached('hazard-striping', () => {
    const S = 512;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = PAL.gunmetal;
    ctx.fillRect(0, 0, S, S);

    const stripeW = 64;
    ctx.save();
    ctx.rotate(Math.PI / 4);
    for (let x = -S * 2; x < S * 3; x += stripeW * 2) {
      ctx.fillStyle = PAL.orange;
      ctx.fillRect(x, -S * 2, stripeW, S * 5);
    }
    ctx.restore();

    addGrime(ctx, S, S, 201, 0.15);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, true); // v0.9 B1: COLOR diffuse — decode as sRGB
}

/**
 * Deep-red accent panel (#7A2C1F) with seams.
 * 512×512. For structural accent panels and warning sections.
 */
export function makeRedAccentTexture(): THREE.CanvasTexture {
  return cached('red-accent', () => {
    const S = 512;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = PAL.red;
    ctx.fillRect(0, 0, S, S);

    drawSeams(ctx, S, S, 256, 256, 'rgba(0,0,0,0.5)', 2);
    addGrime(ctx, S, S, 177, 0.18);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, true); // v0.9 B1: COLOR diffuse — decode as sRGB
}

