/**
 * src/fx/space/canvasUtil.ts — the two canvas helpers every body/overlay
 * texture generator shares. Split out of bodyTextures.ts (v1.2.1 Lane D) so
 * overlayTextures.ts (ring + lava crack) can depend on them WITHOUT a
 * circular import: bodyTextures.ts re-exports lavaCrackTexture from
 * overlayTextures.ts for backward compatibility (world/worlds/
 * ashfallTextures.ts, not this lane's file, still imports it from
 * bodyTextures.js), and overlayTextures.ts needed these two in return —
 * a cycle either way unless both sides import them from here instead.
 */

import * as THREE from 'three';

export function makeCanvas(size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  return { canvas, ctx };
}

export function finalize(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
