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
import { buildCorridorSignage } from './corridorSignage.js';

// ── Palette constants ──────────────────────────────────────────────────────────
const COL_GUNMETAL  = 0x1c1e22;
const COL_ORANGE    = 0xc7641e;
const COL_TEAL      = 0x46e0d8;
const COL_DARK_PIPE = 0x2a2e36;

// ── Material singletons — hoisted to module level (never re-allocated per call) ─

const _mats = {
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

// ── Geometry helpers ───────────────────────────────────────────────────────────

/** Build a CylinderGeometry oriented along Z (length axis = Z). */
function pipeGeo(radius: number, length: number, segs = 6): THREE.CylinderGeometry {
  const geo = new THREE.CylinderGeometry(radius, radius, length, segs);
  geo.rotateX(Math.PI / 2);
  return geo;
}

// ── Prop builder ───────────────────────────────────────────────────────────────

/**
 * Dress the corridor with ceiling pipes, wall vents, door status lights,
 * wall handles, cable conduits, junction boxes, cable trays, and signage.
 */
export function buildCorridorProps(group: THREE.Group): void {
  const mats = _mats;

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
      for (const g of pipGeos) g.dispose();
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
      for (const g of conduitGeos) g.dispose();
      const conduitMesh = new THREE.Mesh(mergedConduits, mats.conduit);
      conduitMesh.name = `wall-conduits-${side === -1 ? 'port' : 'stbd'}`;
      group.add(conduitMesh);
    }
  }

  // ── 8+9. SIGNAGE + SAVE TERMINAL → corridorSignage.ts ─────────────────────────
  buildCorridorSignage(group, halfW, halfD, H, DOOR_FORE_Z, DOOR_AFT_Z, mats.gunmetal);
}
