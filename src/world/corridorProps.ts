/**
 * Corridor prop dressing — Phase 3b / v0.2 polish.
 * Props: ceiling pipe runs, wall vents, door status lights, wall handles,
 *        cable conduit, diagonal conduit to junction boxes, cable trays,
 *        signage decals, save terminal shell.
 *
 * Draw-call budget: ≤25 instanced/merged draw calls.
 * Triangle budget: ≤80k.
 * NO new PointLights — emissive only.
 * No `any`. Explicit return types.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { matConsoleScreen } from '../fx/shipMaterials.js';

// ── Palette constants ──────────────────────────────────────────────────────────
const COL_GUNMETAL  = 0x1c1e22;
const COL_ORANGE    = 0xc7641e;
const COL_TEAL      = 0x46e0d8;
const COL_DARK_PIPE = 0x2a2e36;

// ── Material singletons ────────────────────────────────────────────────────────
function makeMat(): {
  pipe:       THREE.MeshLambertMaterial;
  clamp:      THREE.MeshLambertMaterial;
  orangePipe: THREE.MeshLambertMaterial;
  vent:       THREE.MeshLambertMaterial;
  ventSlat:   THREE.MeshLambertMaterial;
  status:     THREE.MeshBasicMaterial;
  handle:     THREE.MeshLambertMaterial;
  conduit:    THREE.MeshLambertMaterial;
  gunmetal:   THREE.MeshLambertMaterial;
  orange:     THREE.MeshLambertMaterial;
  tealBasic:  THREE.MeshBasicMaterial;
} {
  return {
    pipe:       new THREE.MeshLambertMaterial({ color: COL_DARK_PIPE }),
    clamp:      new THREE.MeshLambertMaterial({ color: COL_GUNMETAL }),
    orangePipe: new THREE.MeshLambertMaterial({ color: COL_ORANGE }),
    vent:       new THREE.MeshLambertMaterial({ color: 0x0e0f12 }),
    ventSlat:   new THREE.MeshLambertMaterial({ color: COL_GUNMETAL }),
    status:     new THREE.MeshBasicMaterial({ color: COL_TEAL }),
    handle:     new THREE.MeshLambertMaterial({ color: COL_ORANGE }),
    conduit:    new THREE.MeshLambertMaterial({ color: 0x111316 }),
    gunmetal:   new THREE.MeshLambertMaterial({ color: COL_GUNMETAL }),
    orange:     new THREE.MeshLambertMaterial({ color: COL_ORANGE }),
    tealBasic:  new THREE.MeshBasicMaterial({ color: COL_TEAL }),
  };
}

// ── Geometry helpers ───────────────────────────────────────────────────────────

/** Build a CylinderGeometry oriented along Z (length axis = Z). */
function pipeGeo(radius: number, length: number, segs = 6): THREE.CylinderGeometry {
  const geo = new THREE.CylinderGeometry(radius, radius, length, segs);
  geo.rotateX(Math.PI / 2);
  return geo;
}

/** Build an inline CanvasTexture decal. */
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
    // border
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

/** Add a flat PlaneGeometry decal to a group. */
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

/** Add a caution strip decal (yellow/black diagonal stripes). */
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

  // Diagonal yellow/black stripes
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

// ── Prop builder ───────────────────────────────────────────────────────────────

/**
 * Dress the corridor with ceiling pipes, wall vents, door status lights,
 * wall handles, cable conduits, junction boxes, cable trays, and signage.
 */
export function buildCorridorProps(group: THREE.Group): void {
  const mats = makeMat();

  const W     = 3;
  const H     = 3;
  const D     = 16;
  const halfW = W / 2;   // 1.5
  const halfD = D / 2;   // 8

  const SIDE_DOOR_Z   = -4.0;
  const DOOR_GAP_W    = 1.4;
  const DOOR_FORE_Z   = SIDE_DOOR_Z - DOOR_GAP_W / 2; // -4.7
  const DOOR_AFT_Z    = SIDE_DOOR_Z + DOOR_GAP_W / 2; // -3.3

  // ── 1. CEILING PIPE RUNS (InstancedMesh) ─────────────────────────────────────
  const PIPE_Y_BASE   = H - 0.25;  // 2.75
  const PIPE_X_INNER  = halfW - 0.08; // 1.42
  const PIPE_R_MAIN   = 0.065;
  const PIPE_R_ORANGE = 0.040;
  const PIPE_Y_ORANGE = H - 0.13;

  const mainPipeGeo   = pipeGeo(PIPE_R_MAIN, D, 7);
  const orangePipeGeo = pipeGeo(PIPE_R_ORANGE, D, 6);

  const mainPipeMesh = new THREE.InstancedMesh(mainPipeGeo, mats.pipe, 2);
  mainPipeMesh.name = 'pipes-main';
  const _m = new THREE.Matrix4();
  _m.setPosition(-PIPE_X_INNER, PIPE_Y_BASE, 0);
  mainPipeMesh.setMatrixAt(0, _m);
  _m.setPosition( PIPE_X_INNER, PIPE_Y_BASE, 0);
  mainPipeMesh.setMatrixAt(1, _m);
  mainPipeMesh.instanceMatrix.needsUpdate = true;
  group.add(mainPipeMesh);

  const orangePipeMesh = new THREE.InstancedMesh(orangePipeGeo, mats.orangePipe, 2);
  orangePipeMesh.name = 'pipes-orange';
  _m.setPosition(-PIPE_X_INNER + 0.08, PIPE_Y_ORANGE, 0);
  orangePipeMesh.setMatrixAt(0, _m);
  _m.setPosition( PIPE_X_INNER - 0.08, PIPE_Y_ORANGE, 0);
  orangePipeMesh.setMatrixAt(1, _m);
  orangePipeMesh.instanceMatrix.needsUpdate = true;
  group.add(orangePipeMesh);

  // Pipe clamp rings
  const CLAMP_SPACING = 2.0;
  const CLAMP_COUNT   = Math.floor(D / CLAMP_SPACING); // 8
  const clampGeo = new THREE.TorusGeometry(PIPE_R_MAIN + 0.025, 0.018, 5, 8);
  clampGeo.rotateY(Math.PI / 2);

  const totalClamps = CLAMP_COUNT * 2;
  const clampMesh = new THREE.InstancedMesh(clampGeo, mats.clamp, totalClamps);
  clampMesh.name = 'pipe-clamps';
  let ci = 0;
  for (let i = 0; i < CLAMP_COUNT; i++) {
    const pz = -halfD + CLAMP_SPACING * (i + 0.5);
    for (const sx of [-PIPE_X_INNER, PIPE_X_INNER]) {
      _m.setPosition(sx, PIPE_Y_BASE, pz);
      clampMesh.setMatrixAt(ci++, _m);
    }
  }
  clampMesh.instanceMatrix.needsUpdate = true;
  group.add(clampMesh);

  // ── 2. WALL VENTS (InstancedMesh) ────────────────────────────────────────────
  const VENT_W  = 0.45;
  const VENT_H  = 0.25;
  const VENT_D  = 0.06;
  const VENT_Y  = 2.0;
  const WALL_X  = halfW;

  const VENT_Z_POSITIONS: number[] = [-6.0, 1.0];
  const VENT_COUNT = VENT_Z_POSITIONS.length * 2;

  const ventBoxGeo = new THREE.BoxGeometry(VENT_D, VENT_H, VENT_W);
  const ventMesh   = new THREE.InstancedMesh(ventBoxGeo, mats.vent, VENT_COUNT);
  ventMesh.name = 'wall-vents';
  let vi = 0;
  for (const vz of VENT_Z_POSITIONS) {
    for (const side of [-1, 1] as const) {
      const vx = side * (WALL_X - VENT_D * 0.5 + 0.005);
      _m.setPosition(vx, VENT_Y, vz);
      ventMesh.setMatrixAt(vi++, _m);
    }
  }
  ventMesh.instanceMatrix.needsUpdate = true;
  group.add(ventMesh);

  // Vent slats
  const SLAT_COUNT_PER_VENT = 5;
  const SLAT_H   = 0.020;
  const SLAT_D_T = 0.050;
  const SLAT_W   = VENT_W - 0.04;
  const slatGeo  = new THREE.BoxGeometry(SLAT_D_T, SLAT_H, SLAT_W);
  const totalSlats = SLAT_COUNT_PER_VENT * VENT_COUNT;
  const slatMesh   = new THREE.InstancedMesh(slatGeo, mats.ventSlat, totalSlats);
  slatMesh.name = 'vent-slats';
  let si = 0;
  for (const vz of VENT_Z_POSITIONS) {
    for (const side of [-1, 1] as const) {
      const vx  = side * (WALL_X - VENT_D * 0.5 + 0.005);
      const yTop = VENT_Y + VENT_H / 2 - SLAT_H;
      const yStep = (VENT_H - SLAT_H * 2) / (SLAT_COUNT_PER_VENT - 1);
      for (let k = 0; k < SLAT_COUNT_PER_VENT; k++) {
        const sy = yTop - k * yStep;
        _m.setPosition(vx + side * 0.005, sy, vz);
        slatMesh.setMatrixAt(si++, _m);
      }
    }
  }
  slatMesh.instanceMatrix.needsUpdate = true;
  group.add(slatMesh);

  // ── 3. DOOR STATUS LIGHTS (InstancedMesh) ─────────────────────────────────────
  const LIGHT_W = 0.04;
  const LIGHT_H = 0.08;
  const LIGHT_D = 0.04;
  const LIGHT_Y     = 2.05;
  const FRAME_HALF  = 1.4 / 2 + 0.12;

  const statusGeo  = new THREE.BoxGeometry(LIGHT_W, LIGHT_H, LIGHT_D);
  const statusMesh = new THREE.InstancedMesh(statusGeo, mats.status, 8);
  statusMesh.name = 'door-status-lights';

  const lightConfigs: [number, number, number][] = [
    [-FRAME_HALF - LIGHT_W, LIGHT_Y, -halfD + 0.06],
    [ FRAME_HALF + LIGHT_W, LIGHT_Y, -halfD + 0.06],
    [-FRAME_HALF - LIGHT_W, LIGHT_Y,  halfD - 0.06],
    [ FRAME_HALF + LIGHT_W, LIGHT_Y,  halfD - 0.06],
    [-halfW + 0.06, LIGHT_Y, SIDE_DOOR_Z - FRAME_HALF - LIGHT_D],
    [-halfW + 0.06, LIGHT_Y, SIDE_DOOR_Z + FRAME_HALF + LIGHT_D],
    [ halfW - 0.06, LIGHT_Y, SIDE_DOOR_Z - FRAME_HALF - LIGHT_D],
    [ halfW - 0.06, LIGHT_Y, SIDE_DOOR_Z + FRAME_HALF + LIGHT_D],
  ];

  for (let li = 0; li < lightConfigs.length; li++) {
    const [lx, ly, lz] = lightConfigs[li];
    _m.setPosition(lx, ly, lz);
    statusMesh.setMatrixAt(li, _m);
  }
  statusMesh.instanceMatrix.needsUpdate = true;
  group.add(statusMesh);

  // ── 4. WALL HANDLES / RINGS ───────────────────────────────────────────────────
  const HANDLE_MAJOR_R = 0.10;
  const HANDLE_MINOR_R = 0.022;
  const HANDLE_Z       = 5.5;
  const HANDLE_Y       = 1.4;

  const handleGeo = new THREE.TorusGeometry(HANDLE_MAJOR_R, HANDLE_MINOR_R, 7, 12);
  handleGeo.rotateX(Math.PI / 2);

  for (const side of [-1, 1] as const) {
    const hx = side * (WALL_X - 0.025);
    const handle = new THREE.Mesh(handleGeo, mats.handle);
    handle.position.set(hx, HANDLE_Y, HANDLE_Z);
    handle.name = `wall-handle-${side === -1 ? 'port' : 'stbd'}`;
    group.add(handle);
  }

  // ── 5. FLOOR CABLE CONDUIT ────────────────────────────────────────────────────
  const COND_H = 0.04;
  const COND_W = 0.035;
  const COND_Y = 0.06 + COND_H / 2;
  const COND_X = halfW - 0.025;

  const condForeLen = DOOR_FORE_Z - (-halfD);
  if (condForeLen > 0.05) {
    const cgf = new THREE.Mesh(
      new THREE.BoxGeometry(COND_W, COND_H, condForeLen),
      mats.conduit,
    );
    cgf.position.set(COND_X, COND_Y, -halfD + condForeLen / 2);
    cgf.name = 'cable-conduit-fore';
    group.add(cgf);
  }

  const condAftLen = halfD - DOOR_AFT_Z;
  if (condAftLen > 0.05) {
    const cga = new THREE.Mesh(
      new THREE.BoxGeometry(COND_W, COND_H, condAftLen),
      mats.conduit,
    );
    cga.position.set(COND_X, COND_Y, DOOR_AFT_Z + condAftLen / 2);
    cga.name = 'cable-conduit-aft';
    group.add(cga);
  }

  // ── 6. LONGITUDINAL CABLE TRAYS at wall/ceiling junction Y=2.7 ───────────────
  // Gunmetal U-channel BoxGeometry 0.10×0.06×16L, both sides
  for (const side of [-1, 1] as const) {
    const trayX = side * (halfW - 0.06);
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, 0.06, D),
      mats.gunmetal,
    );
    tray.position.set(trayX, 2.7, 0);
    tray.name = `cable-tray-${side === -1 ? 'port' : 'stbd'}`;
    group.add(tray);
  }

  // ── 7. DIAGONAL CONDUITS + JUNCTION BOXES ────────────────────────────────────
  // 3 junction boxes per side at Y=1.7, Z=-5/0/+5
  // Each connected to the pipe run Y=2.75 via a diagonal CylinderGeometry conduit
  const JB_POSITIONS: number[] = [-5, 0, 5];
  const JB_Y = 1.7;
  const PIPE_Y = PIPE_Y_BASE; // 2.75

  for (const side of [-1, 1] as const) {
    const wallX = side * (halfW - 0.07);
    const conduitGeos: THREE.BufferGeometry[] = [];

    for (const jbZ of JB_POSITIONS) {
      // Junction box: gunmetal 0.22×0.30×0.12
      const jbGeo = new THREE.BoxGeometry(0.22, 0.30, 0.12);
      const jbMesh = new THREE.Mesh(jbGeo, mats.gunmetal);
      jbMesh.position.set(wallX, JB_Y, jbZ);
      group.add(jbMesh);

      // Orange breaker face on junction box (inner face)
      const breakerGeo = new THREE.PlaneGeometry(0.16, 0.22);
      const breakerMat = new THREE.MeshBasicMaterial({ color: COL_ORANGE });
      const breaker    = new THREE.Mesh(breakerGeo, breakerMat);
      // face toward corridor center
      breaker.position.set(wallX - side * 0.062, JB_Y, jbZ);
      breaker.rotation.y = side === -1 ? 0 : Math.PI;
      group.add(breaker);

      // 3 teal status pips on the breaker face — merged
      const pipGeos: THREE.SphereGeometry[] = [];
      for (let p = 0; p < 3; p++) {
        const pipGeo = new THREE.SphereGeometry(0.018, 5, 4);
        const pz = jbZ - 0.04 + p * 0.04;
        const px = wallX - side * 0.065;
        pipGeo.translate(px, JB_Y + 0.08, pz);
        pipGeos.push(pipGeo);
      }
      const mergedPips = mergeGeometries(pipGeos);
      group.add(new THREE.Mesh(mergedPips, mats.tealBasic));

      // Diagonal conduit from pipe (Y=PIPE_Y, same X/Z) to junction box top
      // Use CylinderGeometry pointing from (wallX, PIPE_Y, jbZ) to (wallX, JB_Y+0.15, jbZ)
      const startY = PIPE_Y;
      const endY   = JB_Y + 0.15;
      const condLen = startY - endY;
      // Small offset in X to branch off the pipe
      const condXOffset = side * 0.03;
      const condGeo = new THREE.CylinderGeometry(0.03, 0.03, condLen, 5);
      condGeo.translate(wallX + condXOffset, endY + condLen / 2, jbZ);
      conduitGeos.push(condGeo);
    }

    // Merge all conduits per side into one draw call
    if (conduitGeos.length > 0) {
      const mergedConduits = mergeGeometries(conduitGeos);
      const conduitMesh = new THREE.Mesh(mergedConduits, mats.conduit);
      conduitMesh.name = `wall-conduits-${side === -1 ? 'port' : 'stbd'}`;
      group.add(conduitMesh);
    }
  }

  // ── 8. CORRIDOR SIGNAGE DECALS ────────────────────────────────────────────────
  // Door designation plaques beside each opening
  // Side door openings at SIDE_DOOR_Z = -4.0

  // Port wall (X = -halfW): signs face inward (+X direction, rotY = Math.PI/2)
  // 'CREW QTR A' fore of door
  addDecal(group, 'CREW QTR A', 0.40, 0.08,
    new THREE.Vector3(-halfW + 0.01, 2.0, DOOR_FORE_Z - 0.30),
    Math.PI / 2, '10px monospace', '#C7641E', 192, 40);

  // 'CREW QTR B' aft of door
  addDecal(group, 'CREW QTR B', 0.40, 0.08,
    new THREE.Vector3(-halfW + 0.01, 2.0, DOOR_AFT_Z + 0.30),
    Math.PI / 2, '10px monospace', '#C7641E', 192, 40);

  // Starboard wall (X = +halfW): signs face inward (-X direction, rotY = -Math.PI/2)
  // 'GALLEY ▸' fore of door
  addDecal(group, 'GALLEY ▸', 0.40, 0.08,
    new THREE.Vector3(halfW - 0.01, 2.0, DOOR_FORE_Z - 0.30),
    -Math.PI / 2, '10px monospace', '#C7641E', 192, 40);

  // '◂ COCKPIT' fore wall (near cockpit door at Z=-halfD)
  addDecal(group, '◂ COCKPIT', 0.45, 0.08,
    new THREE.Vector3(0, 2.10, -halfD + 0.01),
    0, '10px monospace', '#C7641E', 192, 40);

  // Pipeline direction arrows on ceiling near pipes
  addDecal(group, '→ MAIN ←', 0.45, 0.06,
    new THREE.Vector3(0, H - 0.05, -2.0),
    0, '9px monospace', '#46E0D8', 192, 32);

  // CAUTION strip near engineering-ward (aft) end
  addCautionStrip(group, 0.60, 0.06,
    new THREE.Vector3(0, 1.50, halfD - 1.0),
    0);

  // Aft door label
  addDecal(group, 'ENGINEERING ▸', 0.50, 0.08,
    new THREE.Vector3(0, 2.10, halfD - 0.01),
    Math.PI, '10px monospace', '#C7641E', 192, 40);

  // ── 9. SAVE TERMINAL SHELL (port wall, Z=-8 world = Z=-4 corridor local) ──────
  // Gunmetal panel 0.6×0.8×0.1 with a screen face + blinking cursor canvas
  const TERMINAL_Z = -4;  // corridor local Z (world Z=-8 approx)
  const TERMINAL_X = -(halfW - 0.06);
  const TERMINAL_Y = 1.55;

  const terminalBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.8, 0.6),
    mats.gunmetal,
  );
  terminalBody.position.set(TERMINAL_X, TERMINAL_Y, TERMINAL_Z);
  terminalBody.name = 'save-terminal-shell';
  group.add(terminalBody);

  // Screen face using shared matConsoleScreen (geometry only, no logic)
  const terminalScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.52, 0.68),
    matConsoleScreen,
  );
  // Face toward corridor center (+X direction from port wall)
  terminalScreen.position.set(TERMINAL_X + 0.052, TERMINAL_Y, TERMINAL_Z);
  terminalScreen.rotation.y = Math.PI / 2;
  terminalScreen.name = 'save-terminal-screen';
  group.add(terminalScreen);

  // Blinking cursor overlay via CanvasTexture (geometry only; interaction is integrationTask)
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
