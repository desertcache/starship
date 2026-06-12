/**
 * Procedural emissive + accent textures — Phase 3.
 * Covers: teal strip, ceiling light panel, orange door frame,
 *         hazard striping, deep-red accent, console/screen readout.
 * Surface textures (walls, floor, ceiling): see textures.ts
 */
import * as THREE from 'three';
import { PAL, rng, addGrime, drawSeams, cached } from './textureHelpers.js';

/**
 * Emissive teal strip (#46E0D8) with subtle centre-line bloom gradient.
 * 64×64. Used on floor-edge strip geometry via MeshBasicMaterial.
 */
export function makeTealStripTexture(): THREE.CanvasTexture {
  return cached('teal-strip', () => {
    const W = 64;
    const H = 64;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = PAL.teal;
    ctx.fillRect(0, 0, W, H);

    // Soft brighter centre band
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(255,255,255,0.0)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.25)');
    grad.addColorStop(1, 'rgba(255,255,255,0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
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
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.62);
    grad.addColorStop(0.0, 'rgba(255,248,235,0.80)');   // hot bloom-clearing core
    grad.addColorStop(0.18, 'rgba(255,235,200,0.20)');  // tighter falloff
    grad.addColorStop(0.45, 'rgba(140,95,40,0.40)');
    grad.addColorStop(1.0, 'rgba(60,35,10,0.80)');      // dark housing rim
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    return new THREE.CanvasTexture(canvas);
  });
}

/**
 * Burnt-orange door frame texture (#C7641E) with grime.
 * 256×256.
 */
export function makeOrangeFrameTexture(): THREE.CanvasTexture {
  return cached('orange-frame', () => {
    const S = 256;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = PAL.orange;
    ctx.fillRect(0, 0, S, S);
    addGrime(ctx, S, S, 88, 0.20);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
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
  });
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
  });
}

/**
 * Console / screen texture — dark with cyan schematic readout pattern.
 * Static (non-animated). Room agents use this on screen/console prop faces.
 * 512×512.
 */
export function makeConsoleScreenTexture(): THREE.CanvasTexture {
  return cached('console-screen', () => {
    const S = 512;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#050810';
    ctx.fillRect(0, 0, S, S);

    // Faint teal grid
    ctx.strokeStyle = 'rgba(70,224,216,0.15)';
    ctx.lineWidth = 1;
    const gridStep = 32;
    for (let x = 0; x <= S; x += gridStep) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, S); ctx.stroke();
    }
    for (let y = 0; y <= S; y += gridStep) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke();
    }

    // L-shaped schematic routing lines
    const rand = rng(303);
    ctx.strokeStyle = 'rgba(70,224,216,0.9)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 12; i++) {
      const x0 = Math.floor(rand() * (S / gridStep)) * gridStep;
      const y0 = Math.floor(rand() * (S / gridStep)) * gridStep;
      const x1 = Math.floor(rand() * (S / gridStep)) * gridStep;
      const y1 = Math.floor(rand() * (S / gridStep)) * gridStep;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    // Waveform in upper third
    ctx.strokeStyle = 'rgba(70,224,216,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const waveRand = rng(404);
    const wY = S * 0.20;
    ctx.moveTo(0, wY);
    for (let x = 0; x <= S; x += 4) {
      ctx.lineTo(x, wY + (waveRand() - 0.5) * 30);
    }
    ctx.stroke();

    // Junction dots
    ctx.fillStyle = 'rgba(70,224,216,0.95)';
    const dotRand = rng(505);
    for (let i = 0; i < 18; i++) {
      const x = Math.floor(dotRand() * (S / gridStep)) * gridStep;
      const y = Math.floor(dotRand() * (S / gridStep)) * gridStep;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Status readout strip
    ctx.fillStyle = 'rgba(70,224,216,0.6)';
    ctx.font = '13px monospace';
    const labels = ['PWR 94%', 'NAV OK', 'ENG 87%', 'HULL OK', 'ATM 100'];
    for (let i = 0; i < labels.length; i++) {
      ctx.fillText(labels[i], 8 + i * 100, S - 16);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
}
