/**
 * Cockpit dormant-instrument-panel texture — split out of cockpitConsoles.ts
 * to stay under the 300-line file limit after the v0.9 RADIANCE fix-round
 * M10 addition. Imported exclusively by cockpitConsoles.ts.
 *
 * v0.9 RADIANCE fix-round M10: the overhead switch panels sit at Y=2.55, far
 * from any light source in the (deliberately dim) cockpit — the surrounding
 * gunmetal panel box is a lit-only PBR material, so with no light reaching
 * them they rendered as undiegetic pure-black rectangles on the upper walls.
 * A self-lit (MeshBasicMaterial) dormant-screen inset — dim gradient + faint
 * louver lines + a barely-lit teal scanline — reads regardless of scene
 * lighting, so the panel reads as a dormant instrument bank instead of a
 * void. The existing gunmetal panel box (built in cockpitConsoles.ts,
 * unchanged) becomes the frame margin around this smaller inset.
 */
import * as THREE from 'three';

function makeDormantPanelTexture(): THREE.CanvasTexture {
  const W = 256, H = 80;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(26,30,36,1)');
  grad.addColorStop(0.5, 'rgba(17,20,25,1)');
  grad.addColorStop(1, 'rgba(10,12,16,1)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(60,66,74,0.30)';
  ctx.lineWidth = 1;
  for (let y = 6; y < H; y += 7) {
    ctx.beginPath(); ctx.moveTo(6, y); ctx.lineTo(W - 6, y); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(70,224,216,0.22)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(10, H / 2); ctx.lineTo(W - 10, H / 2); ctx.stroke();
  return new THREE.CanvasTexture(canvas);
}

/** Self-lit dormant-screen material — always visible, no scene light needed. */
export const matDormantPanel: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: makeDormantPanelTexture(),
  toneMapped: true,
});
