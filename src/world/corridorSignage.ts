/**
 * Corridor signage and save-terminal geometry — split from corridorProps.ts.
 * Contains sections 8 (decal plaques) and 9 (save terminal shell).
 * Imported exclusively by corridorProps.ts.
 */
import * as THREE from 'three';
import { matConsoleScreen } from '../fx/shipMaterials.js';

// ── Internal decal helpers ────────────────────────────────────────────────────

function makeDecalTex(
  text: string,
  w: number,
  h: number,
  textColor = '#C7641E',
  bgAlpha = 0.65,
  font = '11px monospace',
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  if (bgAlpha > 0) {
    ctx.fillStyle = `rgba(232,226,212,${bgAlpha})`;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
  }
  ctx.fillStyle = textColor;
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.textAlign    = 'center';
  ctx.fillText(text, w / 2, h / 2);
  return new THREE.CanvasTexture(canvas);
}

function addDecal(
  group: THREE.Group,
  text: string,
  planeW: number,
  planeH: number,
  pos: THREE.Vector3,
  rotY = 0,
  font = '11px monospace',
  textColor = '#C7641E',
  texW = 192,
  texH = 48,
): void {
  const tex = makeDecalTex(text, texW, texH, textColor, 0.7, font);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(planeW, planeH), mat);
  mesh.position.copy(pos);
  mesh.rotation.y = rotY;
  group.add(mesh);
}

function addCautionStrip(
  group: THREE.Group,
  planeW: number,
  planeH: number,
  pos: THREE.Vector3,
  rotY = 0,
): void {
  const W = 256, H = 32;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1C1E22';
  ctx.fillRect(0, 0, W, H);

  const stripeW = 18;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  ctx.clip();
  for (let x = -H; x < W + H; x += stripeW * 2) {
    ctx.fillStyle = '#E8C020';
    ctx.save();
    ctx.translate(x, 0);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(0, -H, stripeW, H * 4);
    ctx.restore();
  }
  ctx.restore();

  ctx.strokeStyle = '#E8C020';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  ctx.fillStyle = '#1C1E22';
  ctx.font = 'bold 10px monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('CAUTION', W / 2, H / 2);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({
    map: tex, transparent: true, depthWrite: false, side: THREE.FrontSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(planeW, planeH), mat);
  mesh.position.copy(pos);
  mesh.rotation.y = rotY;
  group.add(mesh);
}

// ── Public builder ─────────────────────────────────────────────────────────────

/**
 * Build corridor signage decals and save-terminal shell.
 * @param gunmetalMat - shared gunmetal material from corridorProps
 */
export function buildCorridorSignage(
  group: THREE.Group,
  halfW: number,
  halfD: number,
  H: number,
  DOOR_FORE_Z: number,
  DOOR_AFT_Z: number,
  gunmetalMat: THREE.MeshLambertMaterial,
): void {
  // ── 8. SIGNAGE DECALS ─────────────────────────────────────────────────────────

  addDecal(group, 'CREW QTR A', 0.40, 0.08,
    new THREE.Vector3(-halfW + 0.01, 2.0, DOOR_FORE_Z - 0.30),
    Math.PI / 2, '10px monospace', '#C7641E', 192, 40);

  addDecal(group, 'CREW QTR B', 0.40, 0.08,
    new THREE.Vector3(-halfW + 0.01, 2.0, DOOR_AFT_Z + 0.30),
    Math.PI / 2, '10px monospace', '#C7641E', 192, 40);

  addDecal(group, 'GALLEY ▸', 0.40, 0.08,
    new THREE.Vector3(halfW - 0.01, 2.0, DOOR_FORE_Z - 0.30),
    -Math.PI / 2, '10px monospace', '#C7641E', 192, 40);

  addDecal(group, '◂ COCKPIT', 0.45, 0.08,
    new THREE.Vector3(0, 2.10, -halfD + 0.01),
    0, '10px monospace', '#C7641E', 192, 40);

  addDecal(group, '→ MAIN ←', 0.45, 0.06,
    new THREE.Vector3(0, H - 0.05, -2.0),
    0, '9px monospace', '#46E0D8', 192, 32);

  addCautionStrip(group, 0.60, 0.06,
    new THREE.Vector3(0, 1.50, halfD - 1.0),
    0);

  addDecal(group, 'ENGINEERING ▸', 0.50, 0.08,
    new THREE.Vector3(0, 2.10, halfD - 0.01),
    Math.PI, '10px monospace', '#C7641E', 192, 40);

  // ── 9. SAVE TERMINAL SHELL ────────────────────────────────────────────────────

  const TERMINAL_Z = -4;
  const TERMINAL_X = -(halfW - 0.06);
  const TERMINAL_Y = 1.55;

  const terminalBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.8, 0.6),
    gunmetalMat,
  );
  terminalBody.position.set(TERMINAL_X, TERMINAL_Y, TERMINAL_Z);
  terminalBody.name = 'save-terminal-shell';
  group.add(terminalBody);

  const terminalScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.52, 0.68),
    matConsoleScreen,
  );
  terminalScreen.position.set(TERMINAL_X + 0.052, TERMINAL_Y, TERMINAL_Z);
  terminalScreen.rotation.y = Math.PI / 2;
  terminalScreen.name = 'save-terminal-screen';
  group.add(terminalScreen);

  const cursorCanvas = document.createElement('canvas');
  cursorCanvas.width  = 256;
  cursorCanvas.height = 32;
  const cctx = cursorCanvas.getContext('2d')!;
  cctx.fillStyle = '#050810';
  cctx.fillRect(0, 0, 256, 32);
  cctx.fillStyle = 'rgba(70,224,216,0.9)';
  cctx.font = '12px monospace';
  cctx.textBaseline = 'middle';
  cctx.fillText('SAVE TERMINAL  _', 8, 16);

  const cursorTex = new THREE.CanvasTexture(cursorCanvas);
  const cursorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.50, 0.06),
    new THREE.MeshBasicMaterial({
      map: cursorTex, transparent: true, depthWrite: false, side: THREE.FrontSide,
    }),
  );
  cursorMesh.position.set(TERMINAL_X + 0.054, TERMINAL_Y - 0.28, TERMINAL_Z);
  cursorMesh.rotation.y = Math.PI / 2;
  group.add(cursorMesh);
}
