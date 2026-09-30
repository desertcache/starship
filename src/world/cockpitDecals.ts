/** Procedural canvas decals for cockpit consoles. */
import * as THREE from 'three';

// ── Decal helpers ──────────────────────────────────────────────────────────────

function makeDecalTexture(
  text: string,
  opts: { w: number; h: number; font?: string; textColor?: string; bgAlpha?: number },
): THREE.CanvasTexture {
  const { w, h, font = '13px monospace', textColor = '#C7641E', bgAlpha = 0.0 } = opts;
  const canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  if (bgAlpha > 0) {
    ctx.fillStyle = `rgba(28,30,34,${bgAlpha})`;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.fillStyle = textColor;
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.textAlign    = 'center';
  ctx.fillText(text, w / 2, h / 2);

  return new THREE.CanvasTexture(canvas);
}

export function addDecal(
  group: THREE.Group,
  text: string,
  w: number,
  h: number,
  pos: THREE.Vector3,
  rotY = 0,
  rotX = 0,
  opts?: { font?: string; textColor?: string; bgAlpha?: number; texW?: number; texH?: number },
): void {
  const texW = opts?.texW ?? 256;
  const texH = opts?.texH ?? 64;
  const tex  = makeDecalTexture(text, {
    w: texW, h: texH,
    font: opts?.font,
    textColor: opts?.textColor,
    bgAlpha: opts?.bgAlpha ?? 0.6,
  });
  const mat  = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });
  const geo  = new THREE.PlaneGeometry(w, h);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(pos);
  mesh.rotation.y = rotY;
  mesh.rotation.x = rotX;
  group.add(mesh);
}
