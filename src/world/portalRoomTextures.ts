/**
 * src/world/portalRoomTextures.ts — Dimensional Annex bespoke CanvasTextures.
 *
 * Two generators, both routed through fx/textureHelpers.cached() so they are
 * built once and reused across the room:
 *   - makeSurveyConsoleTexture: the console's idle screen readout (the LIVE
 *     per-world status is a DOM overlay via ui/hudOverlay.ts; this texture is
 *     just the baked "screen is on" look underneath it).
 *   - makeRelicSocketTexture: a dim biome-tinted rune ring for each empty
 *     relic socket — deliberately LOW alpha ("dark/empty now" per spec).
 *
 * All randomness is seeded via textureHelpers.rng() — never Math.random().
 */
import * as THREE from 'three';
import { cached, rng } from './../fx/textureHelpers.js';

const SCREEN_W = 256;
const SCREEN_H = 192;

/** Baked idle readout for the dimensional survey console screen. */
export function makeSurveyConsoleTexture(): THREE.CanvasTexture {
  return cached('portal-survey-screen', () => {
    const cv = document.createElement('canvas');
    cv.width = SCREEN_W; cv.height = SCREEN_H;
    const ctx = cv.getContext('2d')!;

    // Dark-teal glass + soft center glow so the panel reads "on" at range
    ctx.fillStyle = '#0A1A1A';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    const glow = ctx.createRadialGradient(
      SCREEN_W / 2, SCREEN_H / 2, 10, SCREEN_W / 2, SCREEN_H / 2, SCREEN_W * 0.6,
    );
    glow.addColorStop(0, 'rgba(70,224,216,0.22)');
    glow.addColorStop(1, 'rgba(70,224,216,0.0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // Faint scanline grid
    ctx.strokeStyle = 'rgba(70,224,216,0.12)';
    ctx.lineWidth = 1;
    for (let y = 8; y < SCREEN_H; y += 8) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(SCREEN_W, y); ctx.stroke();
    }

    // Bright bezel-edge frame
    ctx.strokeStyle = 'rgba(70,224,216,0.9)';
    ctx.lineWidth = 3;
    ctx.strokeRect(3, 3, SCREEN_W - 6, SCREEN_H - 6);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#7FF4EC';
    ctx.font = 'bold 17px monospace';
    ctx.fillText('DIMENSIONAL SURVEY', 12, 28);
    ctx.strokeStyle = 'rgba(70,224,216,0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(12, 36); ctx.lineTo(SCREEN_W - 12, 36); ctx.stroke();

    const rows = ['VERDANT', 'ASHFALL', 'RIFT'];
    rows.forEach((label, i) => {
      const y = 64 + i * 36;
      ctx.fillStyle = 'rgba(140,240,232,0.95)';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(label, 16, y);
      ctx.fillStyle = 'rgba(240,150,70,0.95)';
      ctx.font = '11px monospace';
      ctx.fillText('· CALIBRATING ·', 16, y + 15);
    });

    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, true); // authored color — sRGB decode
}

const RING_S = 128;

/**
 * Dim biome-tinted rune ring for an empty relic socket. One cached texture
 * per tint (keyed so verdant/ashfall/rift each get their own instance).
 */
export function makeRelicSocketTexture(tintHex: string, seedKey: number): THREE.CanvasTexture {
  return cached(`portal-relic-socket-${tintHex}`, () => {
    const cv = document.createElement('canvas');
    cv.width = RING_S; cv.height = RING_S;
    const ctx = cv.getContext('2d')!;
    const cx = RING_S / 2; const cy = RING_S / 2;

    ctx.clearRect(0, 0, RING_S, RING_S);

    // Outer + inner faint ring
    ctx.strokeStyle = tintHex;
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, RING_S * 0.42, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, RING_S * 0.30, 0, Math.PI * 2); ctx.stroke();

    // Seeded tick marks — reads as an inert rune dial, not fully "lit"
    const rand = rng(seedKey);
    ctx.globalAlpha = 0.16;
    for (let i = 0; i < 10; i++) {
      const a = rand() * Math.PI * 2;
      const r0 = RING_S * 0.34; const r1 = RING_S * 0.40;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, true);
}
