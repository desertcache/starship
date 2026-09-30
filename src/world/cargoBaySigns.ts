/** Procedural cargo-bay manifest signs. */
import * as THREE from 'three';

// ── (d) Cargo manifest signs ───────────────────────────────────────────────────

function makeManifestTexture(line1: string, line2: string): THREE.CanvasTexture {
  const W = 256; const H = 64;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d')!;

  // Cream background
  ctx.fillStyle = '#E8E2D4';
  ctx.fillRect(0, 0, W, H);

  // Orange border
  ctx.strokeStyle = '#C7641E';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, W - 4, H - 4);

  // Text
  ctx.fillStyle = '#C7641E';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(line1, W / 2, 24);
  ctx.font = '13px monospace';
  ctx.fillText(line2, W / 2, 48);

  const tex = new THREE.CanvasTexture(cv);
  return tex;
}

export function buildManifestSigns(group: THREE.Group, D: number): void {
  const halfD = D / 2;
  const SIGN_W = 0.90;
  const SIGN_H = 0.22;
  const aftZ   = halfD - 0.01; // on aft wall face

  const signs: Array<{ x: number; line1: string; line2: string }> = [
    { x: -2.0, line1: 'CARGO BAY 01', line2: 'CAPACITY: 4200 kg' },
    { x:  2.0, line1: 'MAG-LOCK ACTIVE', line2: 'SECURE ZONE' },
  ];

  for (const sign of signs) {
    const tex  = makeManifestTexture(sign.line1, sign.line2);
    const mat  = new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(SIGN_W, SIGN_H), mat);
    // Mount on aft wall, facing fore (negative Z direction)
    mesh.position.set(sign.x, 1.8, aftZ);
    mesh.rotation.y = Math.PI; // face fore
    group.add(mesh); // 2 draw calls total
  }
}
