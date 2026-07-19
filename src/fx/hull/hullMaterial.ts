/**
 * src/fx/hull/hullMaterial.ts — worn-freighter exterior skin (Lane D, v1.1
 * §5 Stage 3 / design D4).
 *
 * NOT the holo shader (fx/hull/holoMaterial.ts) — that's a hologram-only
 * additive wire effect for the cockpit miniature. This is the REAL exterior
 * skin: an ordinary MeshStandardMaterial with two procedural CanvasTextures
 * (diffuse + emissive), generated ONCE at module load and reused across the
 * whole merged hull mesh, same house pattern as fx/propMaterials.ts.
 *
 * Palette (exterior, per docs/design-v1.1-sovereign.md deliverable 1 — a
 * DIFFERENT read than the interior's darkened-for-mood cream in
 * textureHelpers.ts's PAL): cream `#E8E2D4` base panels + dark seam grid,
 * burnt-orange `#C7641E` trim bands, occasional gunmetal `#1C1E22` plates,
 * scuff/grime noise, subtle emissive teal `#46E0D8` porthole-ring accents.
 *
 * The merged hull geometry (buildHull.ts) carries the loft's own UVs
 * (u=sector/8, v=length-fraction) plus each parametric module's/greeble's
 * default box/cylinder/torus UVs — every piece independently samples this
 * one tileable atlas, so nothing here needs to align to specific 3D anchor
 * positions (the ring accents are ambient skin detail, not the literal
 * porthole glass/torus objects built by buildHullGeometry).
 */
import * as THREE from 'three';
import { cached, rng, addGrime, drawSeams } from '../textureHelpers.js';

const TEX_SIZE = 1024;
const PANEL_PX = 128; // 8x8 seam grid across the atlas

const CREAM = '#E8E2D4';
const ORANGE = '#C7641E';
const GUNMETAL = '#1C1E22';
const TEAL_RGB = '70,224,216'; // #46E0D8

// ── Shared accent layout ────────────────────────────────────────────────────
// Computed ONCE at module load from a fixed seed so the diffuse and emissive
// canvases agree on where the gunmetal plates / teal ring accents sit,
// without needing to share a live rand() stream across two cached() builders.
interface Plate { x: number; y: number; w: number; h: number }
interface Ring { x: number; y: number; r: number }

function layoutPlates(rand: () => number, count: number): Plate[] {
  return Array.from({ length: count }, () => ({
    x: rand() * TEX_SIZE,
    y: rand() * TEX_SIZE,
    w: 90 + rand() * 160,
    h: 70 + rand() * 120,
  }));
}

function layoutRings(rand: () => number, count: number): Ring[] {
  return Array.from({ length: count }, () => ({
    x: rand() * TEX_SIZE,
    y: rand() * TEX_SIZE,
    r: 10 + rand() * 18,
  }));
}

const layoutRand = rng(0x2020);
const GUNMETAL_PLATES = layoutPlates(layoutRand, 10);
const RING_ACCENTS = layoutRings(layoutRand, 7);

// Big soft weathering blotches — vary the cream deck's value so it doesn't
// read as one uniform pale slab (the main residual "clay" tell once the hull
// is lit). Huge + low-alpha so they land as gentle staining, not spots.
interface Mottle { x: number; y: number; r: number; a: number }
const MOTTLES: Mottle[] = Array.from({ length: 7 }, () => ({
  x: layoutRand() * TEX_SIZE,
  y: layoutRand() * TEX_SIZE,
  r: 130 + layoutRand() * 220,
  a: 0.05 + layoutRand() * 0.09,
}));

// A few diagonal hazard-stripe caution patches — freighter character that
// breaks up the blank plating.
interface Hazard { x: number; y: number; w: number; h: number }
const HAZARDS: Hazard[] = Array.from({ length: 3 }, () => ({
  x: layoutRand() * (TEX_SIZE - 180),
  y: layoutRand() * (TEX_SIZE - 60),
  w: 90 + layoutRand() * 80,
  h: 26 + layoutRand() * 14,
}));

function drawPlateBolts(ctx: CanvasRenderingContext2D, p: Plate): void {
  const i = 9;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  for (const [bx, by] of [
    [p.x + i, p.y + i], [p.x + p.w - i, p.y + i],
    [p.x + i, p.y + p.h - i], [p.x + p.w - i, p.y + p.h - i],
  ] as const) {
    ctx.beginPath();
    ctx.arc(bx, by, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHazardPatch(ctx: CanvasRenderingContext2D, hz: Hazard): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(hz.x, hz.y, hz.w, hz.h);
  ctx.clip();
  const step = 15;
  for (let i = -hz.h; i < hz.w + hz.h; i += step) {
    ctx.fillStyle = (Math.round(i / step) % 2 === 0) ? ORANGE : GUNMETAL;
    ctx.beginPath();
    ctx.moveTo(hz.x + i, hz.y);
    ctx.lineTo(hz.x + i + step, hz.y);
    ctx.lineTo(hz.x + i + step - hz.h, hz.y + hz.h);
    ctx.lineTo(hz.x + i - hz.h, hz.y + hz.h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(hz.x, hz.y, hz.w, hz.h);
  ctx.restore();
}

// ── Diffuse (color) ──────────────────────────────────────────────────────────

function buildHullDiffuse(): THREE.CanvasTexture {
  return cached('hull-skin-diffuse', () => {
    const canvas = document.createElement('canvas');
    canvas.width = TEX_SIZE;
    canvas.height = TEX_SIZE;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = CREAM;
    ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);

    // Large soft weathering variation FIRST (sits under the panel detail).
    for (const m of MOTTLES) {
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
      g.addColorStop(0, `rgba(40,34,24,${m.a.toFixed(3)})`);
      g.addColorStop(1, 'rgba(40,34,24,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fine sub-panel seams first, then the bold main plate grid on top — two
    // scales of paneling so the deck reads as riveted plates, not a blank sheet.
    drawSeams(ctx, TEX_SIZE, TEX_SIZE, PANEL_PX / 2, PANEL_PX / 2, 'rgba(20,16,10,0.32)', 1.5);
    drawSeams(ctx, TEX_SIZE, TEX_SIZE, PANEL_PX, PANEL_PX, 'rgba(14,10,6,0.82)', 3);

    // Burnt-orange trim bands (waist-height strips, repeated down the atlas),
    // edged dark so each reads as an applied strip rather than a flat fill.
    const bandH = TEX_SIZE * 0.045;
    for (const frac of [0.2, 0.52, 0.82]) {
      ctx.fillStyle = ORANGE;
      ctx.fillRect(0, TEX_SIZE * frac, TEX_SIZE, bandH);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, TEX_SIZE * frac, TEX_SIZE, 2);
      ctx.fillRect(0, TEX_SIZE * frac + bandH - 2, TEX_SIZE, 2);
    }

    // Occasional gunmetal repair plates, bolted at the corners.
    for (const p of GUNMETAL_PLATES) {
      ctx.fillStyle = GUNMETAL;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = 'rgba(0,0,0,0.65)';
      ctx.lineWidth = 3;
      ctx.strokeRect(p.x + 5, p.y + 5, Math.max(0, p.w - 10), Math.max(0, p.h - 10));
      drawPlateBolts(ctx, p);
    }

    // Hazard-stripe caution patches.
    for (const hz of HAZARDS) drawHazardPatch(ctx, hz);

    // Porthole-ring accents — dim teal outline in the diffuse; the emissive
    // map (below) carries the actual glow.
    for (const r of RING_ACCENTS) {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${TEAL_RGB},0.55)`;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    addGrime(ctx, TEX_SIZE, TEX_SIZE, 931, 0.34);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, true); // COLOR diffuse — decode as sRGB (textureHelpers.ts cached() convention)
}

// ── Emissive (teal porthole-ring glow) ──────────────────────────────────────

function buildHullEmissive(): THREE.CanvasTexture {
  return cached('hull-skin-emissive', () => {
    const canvas = document.createElement('canvas');
    canvas.width = TEX_SIZE;
    canvas.height = TEX_SIZE;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);

    for (const r of RING_ACCENTS) {
      const glow = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, r.r * 1.4);
      glow.addColorStop(0, `rgba(${TEAL_RGB},0.9)`);
      glow.addColorStop(0.6, `rgba(${TEAL_RGB},0.35)`);
      glow.addColorStop(1, `rgba(${TEAL_RGB},0)`);
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${TEAL_RGB},1.0)`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, true); // emissive is also authored COLOR data
}

// ── Material singleton ───────────────────────────────────────────────────────
// Generated once at import (same house pattern as propMaterials.ts's
// module-level `export const mat...` singletons) and reused for the single
// full-scale exterior hull mesh (fx/hull/exterior.ts).
export const hullSkinMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
  map: buildHullDiffuse(),
  emissiveMap: buildHullEmissive(),
  emissive: new THREE.Color(0xffffff), // emissiveMap already carries the teal color
  emissiveIntensity: 0.7,
  // Tuned for the dedicated exterior key rig (fx/hull/hullLighting.ts). The
  // hull is a PAINTED freighter (cream/orange panels), i.e. a dielectric — low
  // metalness + moderate gloss reads as painted metal, whereas high metalness
  // greys the cream toward bare-steel clay. The "metal" impression comes from
  // the key's broad specular sheen at roughness 0.5, not from metalness.
  roughness: 0.5,
  metalness: 0.15,
  // Damp scene.environment (RoomEnvironment PMREM) on the hull: at full
  // strength it floods the whole hull evenly from all directions and WASHES
  // OUT the directional key's bright/dark gradient — the primary cause of the
  // flat-clay read. At 0.4 the key defines the form and the env only fills.
  envMapIntensity: 0.4,
  // DoubleSide (not FrontSide, unlike propMaterials.ts's single convex props):
  // the merged hull (buildHull.ts) combines the custom loft with many
  // primitive pieces (boxes/cylinders/tori/greebles) via mergeGeometries —
  // any one of those sub-pieces having outward-vs-inward winding out of step
  // with the loft would silently cull a face from one viewing side. Confirmed
  // by direct visual check (see exterior.ts comment): FrontSide let the
  // portal-room's dimensional gates read through the stern from the chase
  // cam. DoubleSide costs a bit of overdraw, trivial against the huge p95
  // headroom (D7), and guarantees the hull reads solid from every angle.
  side: THREE.DoubleSide,
});
