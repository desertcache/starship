/**
 * Prop material singletons — v0.9 A2 "RADIANCE" lane A2.
 *
 * Fixes near-black prop voids scattered across the ship (locker bodies,
 * counters, seat cushions, crates, reactor housing, catwalk steel, pipes,
 * console housings) — today those render as flat MeshLambertMaterial around
 * #1C1E22 with no texture, which crushes to near-0 RGB under the pooled
 * point lights and reads as a black hole instead of a lit metal surface.
 *
 * Rules honored:
 *  - Albedo floor ~#20232a (32,35,42) — every base color here sits
 *    meaningfully above that so props catch light instead of crushing black.
 *  - Every material gets a procedural diffuse (brush/weave + scuff wear) and
 *    a roughnessMap (blotchy variation), envMapIntensity 0.4-0.6.
 *  - 512px textures — plenty for prop-scale geometry, cheap to generate.
 *
 * NOT wired into any room yet — a later bridge agent wires these into
 * lockers/counters/seats/crates/reactor/catwalk/pipes/consoles across the
 * world/*.ts room files (out of this lane's file-ownership). This file only
 * needs to exist, typecheck, and look right in isolation.
 */
import * as THREE from 'three';
import { cached, rng } from './textureHelpers.js';

const S = 512;

// ── Shared paint helpers ────────────────────────────────────────────────────

/** Directional brushed-metal streaks — 1px columns (vertical) or rows (horizontal). */
function paintBrushedStreaks(
  ctx: CanvasRenderingContext2D,
  seed: number,
  vertical: boolean,
  amp = 0.09,
): void {
  const rand = rng(seed);
  for (let i = 0; i < S; i++) {
    const delta = (rand() - 0.5) * 2 * amp;
    const alpha = 0.10 + rand() * 0.16;
    ctx.fillStyle = delta > 0
      ? `rgba(255,255,255,${(alpha * delta / amp).toFixed(3)})`
      : `rgba(0,0,0,${(alpha * (-delta) / amp).toFixed(3)})`;
    if (vertical) ctx.fillRect(i, 0, 1, S);
    else ctx.fillRect(0, i, S, 1);
  }
}

/** Scattered scuff smudges + fine scratches — wear pass over a base fill. */
function paintScuffs(ctx: CanvasRenderingContext2D, seed: number, count = 26): void {
  const rand = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = rand() * S; const y = rand() * S;
    const r = 8 + rand() * 26;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.3 + rand() * 0.4), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${(0.05 + rand() * 0.09).toFixed(3)})`;
    ctx.fill();
  }
  for (let i = 0; i < count; i++) {
    const x0 = rand() * S; const y0 = rand() * S;
    const len = 14 + rand() * 40; const a = rand() * Math.PI;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + Math.cos(a) * len, y0 + Math.sin(a) * len);
    ctx.strokeStyle = `rgba(255,255,255,${(0.04 + rand() * 0.06).toFixed(3)})`;
    ctx.lineWidth = 1 + rand();
    ctx.stroke();
  }
}

/** Brushed-metal diffuse: base fill + directional streaks + scuff wear. */
function makeBrushedDiffuse(
  key: string, baseHex: string, seed: number, vertical: boolean,
): THREE.CanvasTexture {
  return cached(key, () => {
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, S, S);
    paintBrushedStreaks(ctx, seed, vertical);
    paintScuffs(ctx, seed + 1);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, true); // v0.9 B1: COLOR diffuse — decode as sRGB
}

/** Worn fabric diffuse — crosshatch weave noise + scuffed wear. */
function makeFabricDiffuse(key: string, baseHex: string, seed: number): THREE.CanvasTexture {
  return cached(key, () => {
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, S, S);
    const rand = rng(seed);
    const step = 4;
    for (let y = 0; y < S; y += step) {
      for (let x = 0; x < S; x += step) {
        const v = (rand() - 0.5) * 0.16;
        // Gate fix (orchestrator): weave highlight was near-white (255,225,210)
        // at up to ~20% alpha over half the texels — it dragged ANY base hue
        // toward salmon under GPU lighting. Highlights now stay in the fabric's
        // own warm-dark family and at lower strength; the base hex wins.
        ctx.fillStyle = v > 0
          ? `rgba(126,74,66,${(v * 1.6).toFixed(3)})`
          : `rgba(15,4,2,${(-v * 2.5).toFixed(3)})`;
        ctx.fillRect(x, y, step, step * 0.5);
      }
    }
    paintScuffs(ctx, seed + 1, 18);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, true); // v0.9 B1: COLOR diffuse — decode as sRGB
}

/** Drab olive-gunmetal crate shell + a worn orange stencil band. */
function makeCrateDiffuse(key: string, baseHex: string, seed: number): THREE.CanvasTexture {
  return cached(key, () => {
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, S, S);
    paintScuffs(ctx, seed, 30);
    const rand = rng(seed + 2);
    const bandY = S * 0.40; const bandH = S * 0.14;
    ctx.fillStyle = 'rgba(199,100,30,0.85)'; // PAL.orange accent
    ctx.fillRect(0, bandY, S, bandH);
    for (let i = 0; i < 50; i++) {
      const x = rand() * S; const y = bandY + rand() * bandH;
      const r = 3 + rand() * 12;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${(0.15 + rand() * 0.30).toFixed(3)})`;
      ctx.fill();
    }
    // Abstracted stencil-letter blocks (not real glyphs — reads as lettering at distance)
    ctx.fillStyle = 'rgba(20,18,16,0.55)';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(S * 0.08 + i * S * 0.10, bandY + bandH * 0.25, S * 0.06, bandH * 0.5);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, true); // v0.9 B1: COLOR diffuse — decode as sRGB
}

/** Generic roughness-variation map — blotchy patches around a base gray. */
function makeRoughnessVariation(key: string, baseGray: number, seed: number): THREE.CanvasTexture {
  return cached(key, () => {
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = `rgb(${baseGray},${baseGray},${baseGray})`;
    ctx.fillRect(0, 0, S, S);
    const rand = rng(seed);
    for (let i = 0; i < 50; i++) {
      const x = rand() * S; const y = rand() * S;
      const r = 8 + rand() * 34;
      const v = Math.max(20, Math.min(235, Math.floor(baseGray + (rand() - 0.5) * 90)));
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.4 + rand() * 0.5), rand() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${v},${v},${v},0.55)`;
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
}

// ── Material singletons ─────────────────────────────────────────────────────
// Albedo floor ~#20232a (32,35,42) — every base color below sits above that
// so props catch pooled light instead of crushing to near-black voids.

/** Painted-metal locker body. */
export const matLockerBody: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: makeBrushedDiffuse('prop-locker', '#33373E', 401, false),
  roughnessMap: makeRoughnessVariation('prop-locker-rough', 145, 402),
  roughness: 0.55,
  metalness: 0.35,
  envMapIntensity: 0.5,
  side: THREE.FrontSide,
});

/** Brushed dark-steel counter top. */
export const matCounterTop: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: makeBrushedDiffuse('prop-counter', '#2E3238', 411, true),
  roughnessMap: makeRoughnessVariation('prop-counter-rough', 110, 412),
  roughness: 0.35,
  metalness: 0.55,
  envMapIntensity: 0.55,
  side: THREE.FrontSide,
});

/** Worn oxblood seat fabric.
 * Gate fix (orchestrator): #6B332B read SALMON-PINK on headed GPU under the
 * bright cockpit wash — deepened to true oxblood and trimmed env pickup
 * (fabric shouldn't catch the RoomEnvironment the way metal does). */
export const matSeatFabric: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: makeFabricDiffuse('prop-seat', '#452421', 421),
  roughnessMap: makeRoughnessVariation('prop-seat-rough', 210, 422),
  roughness: 0.9,
  metalness: 0.0,
  envMapIntensity: 0.25,
  side: THREE.FrontSide,
});

/** Drab olive-gunmetal crate shell with a worn orange stencil band. */
export const matCrateShell: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: makeCrateDiffuse('prop-crate', '#3C4130', 431),
  roughnessMap: makeRoughnessVariation('prop-crate-rough', 160, 432),
  roughness: 0.70,
  metalness: 0.15,
  envMapIntensity: 0.45,
  side: THREE.FrontSide,
});

/** Vertical-brushed dark-steel reactor housing. */
export const matReactorHousing: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: makeBrushedDiffuse('prop-reactor-housing', '#2F343B', 441, true),
  roughnessMap: makeRoughnessVariation('prop-reactor-rough', 120, 442),
  roughness: 0.40,
  metalness: 0.50,
  envMapIntensity: 0.55,
  side: THREE.FrontSide,
});

/** Catwalk grating steel. */
export const matCatwalkSteel: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: makeBrushedDiffuse('prop-catwalk', '#33373D', 451, false),
  roughnessMap: makeRoughnessVariation('prop-catwalk-rough', 125, 452),
  roughness: 0.45,
  metalness: 0.55,
  envMapIntensity: 0.5,
  side: THREE.FrontSide,
});

/** Dark pipe metal. */
export const matPipeDark: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: makeBrushedDiffuse('prop-pipe', '#2A2E34', 461, true),
  roughnessMap: makeRoughnessVariation('prop-pipe-rough', 130, 462),
  roughness: 0.50,
  metalness: 0.45,
  envMapIntensity: 0.5,
  side: THREE.FrontSide,
});

/** Console housing — dark painted-metal cabinet around screens/controls. */
export const matConsoleHousing: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: makeBrushedDiffuse('prop-console-housing', '#2C3036', 471, false),
  roughnessMap: makeRoughnessVariation('prop-console-rough', 140, 472),
  roughness: 0.50,
  metalness: 0.30,
  envMapIntensity: 0.5,
  side: THREE.FrontSide,
});
