/**
 * Console / screen readout texture — split from texturesEmissive.ts (v0.9 A2)
 * to keep that file under the 300-line constitution limit.
 * Static (non-animated). Room agents use this on screen/console prop faces.
 */
import * as THREE from 'three';
import { rng, cached } from './textureHelpers.js';

/**
 * Console / screen texture — dark with cyan schematic readout pattern.
 * 512×512.
 *
 * v0.9 A2: content lines get a phosphor-glow treatment — a soft wide low-alpha
 * pass drawn first, then a brighter near-white-teal core line on top — so the
 * readout pops instead of reading as flat cyan lines on a black field.
 */
export function makeConsoleScreenTexture(): THREE.CanvasTexture {
  return cached('console-screen-v2', () => {
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

    // L-shaped schematic routing lines — glow pass (wide, soft) then bright core
    const rand = rng(303);
    const routes: [number, number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const x0 = Math.floor(rand() * (S / gridStep)) * gridStep;
      const y0 = Math.floor(rand() * (S / gridStep)) * gridStep;
      const x1 = Math.floor(rand() * (S / gridStep)) * gridStep;
      const y1 = Math.floor(rand() * (S / gridStep)) * gridStep;
      routes.push([x0, y0, x1, y1]);
    }
    ctx.strokeStyle = 'rgba(70,224,216,0.30)';
    ctx.lineWidth = 4;
    for (const [x0, y0, x1, y1] of routes) {
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(190,255,248,1.0)';
    ctx.lineWidth = 1.5;
    for (const [x0, y0, x1, y1] of routes) {
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }

    // Waveform in upper third — glow pass then bright core
    const waveRand = rng(404);
    const wY = S * 0.20;
    const waveOffsets: number[] = [];
    for (let x = 0; x <= S; x += 4) waveOffsets.push((waveRand() - 0.5) * 30);
    const drawWave = (style: string, width: number): void => {
      ctx.strokeStyle = style;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(0, wY);
      let idx = 0;
      for (let x = 0; x <= S; x += 4) { ctx.lineTo(x, wY + waveOffsets[idx]); idx++; }
      ctx.stroke();
    };
    drawWave('rgba(70,224,216,0.25)', 5);
    drawWave('rgba(200,255,250,0.95)', 2);

    // Junction dots — bright near-white core with a soft colored halo
    const dotRand = rng(505);
    for (let i = 0; i < 18; i++) {
      const x = Math.floor(dotRand() * (S / gridStep)) * gridStep;
      const y = Math.floor(dotRand() * (S / gridStep)) * gridStep;
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(70,224,216,0.35)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220,255,250,1.0)';
      ctx.fill();
    }

    // Status readout strip — brighter phosphor text
    ctx.fillStyle = 'rgba(150,240,232,0.85)';
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
