/**
 * Corridor prop dressing — Phase 3b.
 * Props: ceiling pipe runs, wall vents, door status lights, wall handles, cable conduit.
 *
 * Draw-call budget: ≤15 instanced/merged draw calls.
 * Triangle budget: ≤60k.
 * NO new PointLights — emissive only.
 * No `any`. Explicit return types.
 */
import * as THREE from 'three';

// ── Palette constants ──────────────────────────────────────────────────────────
const COL_GUNMETAL  = 0x1c1e22;
const COL_ORANGE    = 0xc7641e;
const COL_TEAL      = 0x46e0d8;
const COL_DARK_PIPE = 0x2a2e36; // mid-dark gunmetal — visible against the ceiling

// ── Material singletons (local, not exported to other rooms) ──────────────────
function makeMat(): {
  pipe:    THREE.MeshLambertMaterial;
  clamp:   THREE.MeshLambertMaterial;
  orangePipe: THREE.MeshLambertMaterial;
  vent:    THREE.MeshLambertMaterial;
  ventSlat: THREE.MeshLambertMaterial;
  status:  THREE.MeshBasicMaterial;
  handle:  THREE.MeshLambertMaterial;
  conduit: THREE.MeshLambertMaterial;
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
  };
}

// ── Geometry helpers ───────────────────────────────────────────────────────────

/** Build a CylinderGeometry oriented along Z (length axis = Z). */
function pipeGeo(radius: number, length: number, segs = 6): THREE.CylinderGeometry {
  const geo = new THREE.CylinderGeometry(radius, radius, length, segs);
  geo.rotateX(Math.PI / 2); // align with Z
  return geo;
}

// ── Prop builder ───────────────────────────────────────────────────────────────

/**
 * Dress the corridor with ceiling pipes, wall vents, door status lights,
 * wall handles, and a floor-level cable conduit.
 *
 * @param group  - The corridor THREE.Group to attach props to.
 */
export function buildCorridorProps(group: THREE.Group): void {
  const mats = makeMat();

  const W     = 3;
  const H     = 3;
  const D     = 16;
  const halfW = W / 2;   // 1.5
  const halfD = D / 2;   // 8

  // Corridor local-space geometry knowledge
  const SIDE_DOOR_Z   = -4.0;
  const DOOR_GAP_W    = 1.4;
  const DOOR_FORE_Z   = SIDE_DOOR_Z - DOOR_GAP_W / 2; // -4.7
  const DOOR_AFT_Z    = SIDE_DOOR_Z + DOOR_GAP_W / 2; // -3.3

  // ── 1. CEILING PIPE RUNS (InstancedMesh) ─────────────────────────────────────
  // Two runs per side: 1 dark gunmetal main pipe + 1 burnt-orange accent pipe.
  // They hug the upper corners: X = ±1.5, Y near H=3.
  // Four pipe runs total → 4 instanced meshes (2 mats × 2 sides, but same geo).
  // Actually: use 2 InstancedMesh (one per material), each with 2 instances (port+stbd).

  // Pipes hug the upper wall corners, pulled 0.25m down from ceiling
  // so they're clearly visible against the bright ceiling panels.
  const PIPE_Y_BASE   = H - 0.25;  // 2.75 — slightly below ceiling
  const PIPE_X_INNER  = halfW - 0.08; // 1.42 — close to wall
  const PIPE_R_MAIN   = 0.065;
  const PIPE_R_ORANGE = 0.040;
  const PIPE_Y_ORANGE = H - 0.13;  // orange pipe is highest, nearest ceiling edge

  const mainPipeGeo   = pipeGeo(PIPE_R_MAIN, D, 7);
  const orangePipeGeo = pipeGeo(PIPE_R_ORANGE, D, 6);

  // Main dark pipe — 2 instances (port & starboard)
  const mainPipeMesh = new THREE.InstancedMesh(mainPipeGeo, mats.pipe, 2);
  mainPipeMesh.name = 'pipes-main';
  const _m = new THREE.Matrix4();
  _m.setPosition(-PIPE_X_INNER, PIPE_Y_BASE, 0);
  mainPipeMesh.setMatrixAt(0, _m);
  _m.setPosition( PIPE_X_INNER, PIPE_Y_BASE, 0);
  mainPipeMesh.setMatrixAt(1, _m);
  mainPipeMesh.instanceMatrix.needsUpdate = true;
  group.add(mainPipeMesh);

  // Orange accent pipe — 2 instances (port & starboard)
  const orangePipeMesh = new THREE.InstancedMesh(orangePipeGeo, mats.orangePipe, 2);
  orangePipeMesh.name = 'pipes-orange';
  _m.setPosition(-PIPE_X_INNER + 0.08, PIPE_Y_ORANGE, 0);
  orangePipeMesh.setMatrixAt(0, _m);
  _m.setPosition( PIPE_X_INNER - 0.08, PIPE_Y_ORANGE, 0);
  orangePipeMesh.setMatrixAt(1, _m);
  orangePipeMesh.instanceMatrix.needsUpdate = true;
  group.add(orangePipeMesh);

  // Pipe clamp rings — spaced every ~2m along the length, both sides
  // Clamp = thin torus (or flat disc ring). Use TubeGeometry ring via TorusGeometry.
  const CLAMP_SPACING = 2.0;
  const CLAMP_COUNT   = Math.floor(D / CLAMP_SPACING); // 8
  const clampGeo = new THREE.TorusGeometry(PIPE_R_MAIN + 0.025, 0.018, 5, 8);
  // Orient clamp ring to encircle a Z-aligned pipe: rotate around Y
  clampGeo.rotateY(Math.PI / 2);

  const totalClamps = CLAMP_COUNT * 2; // both sides
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
  // Dark inset grille boxes on port AND starboard walls.
  // Placed in the aft solid section (between door aft edge and porthole area)
  // and in the fore solid section. Mid-upper wall height (~Y=2.0).
  // Each vent: outer dark box + instanced slats inside.

  const VENT_W  = 0.45;
  const VENT_H  = 0.25;
  const VENT_D  = 0.06;   // depth into wall (slightly proud)
  const VENT_Y  = 2.0;    // centre height
  const WALL_X  = halfW;  // 1.5 — walls at ±1.5

  // Vent positions: 2 per side → 4 total
  // Fore section: Z around -6.0 (midpoint of -8 to -4.7 = -6.35)
  // Aft section:  Z around +1.0 (well before porthole at Z=3)
  const VENT_Z_POSITIONS: number[] = [-6.0, 1.0];
  const VENT_COUNT = VENT_Z_POSITIONS.length * 2; // both sides

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

  // Vent slats — horizontal bars inside each vent (5 slats per vent)
  const SLAT_COUNT_PER_VENT = 5;
  const SLAT_H   = 0.020;
  const SLAT_D_T = 0.050; // slat depth (thin)
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
  // Tiny teal emissive boxes beside each door frame (like door-indicator lights).
  // 4 doorways × 2 lights each (left & right of frame) = 8 instances.
  // But fore/aft door lights are on the fore/aft wall; side door lights on side walls.

  const LIGHT_W = 0.04;
  const LIGHT_H = 0.08;
  const LIGHT_D = 0.04;

  // Fore door: wall at Z = -halfD = -8; lights beside door (X = ±0.82)
  // Aft door: wall at Z = +halfD = +8; lights beside door (X = ±0.82)
  // Side doors: walls at X = ±halfW = ±1.5; lights beside door (Z = SIDE_DOOR_Z ± 0.82)
  // Place lights at door-frame jamb height, Y = 2.0

  const LIGHT_Y     = 2.05;
  const FRAME_HALF  = 1.4 / 2 + 0.12; // half gap + jamb width = 0.82

  const statusGeo  = new THREE.BoxGeometry(LIGHT_W, LIGHT_H, LIGHT_D);
  const statusMesh = new THREE.InstancedMesh(statusGeo, mats.status, 8);
  statusMesh.name = 'door-status-lights';

  const lightConfigs: [number, number, number][] = [
    // fore wall (Z = -halfD): offset in X, fixed Z
    [-FRAME_HALF - LIGHT_W, LIGHT_Y, -halfD + 0.06],
    [ FRAME_HALF + LIGHT_W, LIGHT_Y, -halfD + 0.06],
    // aft wall (Z = +halfD): offset in X, fixed Z
    [-FRAME_HALF - LIGHT_W, LIGHT_Y,  halfD - 0.06],
    [ FRAME_HALF + LIGHT_W, LIGHT_Y,  halfD - 0.06],
    // port wall (X = -halfW): fixed X, offset in Z from SIDE_DOOR_Z
    [-halfW + 0.06, LIGHT_Y, SIDE_DOOR_Z - FRAME_HALF - LIGHT_D],
    [-halfW + 0.06, LIGHT_Y, SIDE_DOOR_Z + FRAME_HALF + LIGHT_D],
    // starboard wall (X = +halfW): fixed X, offset in Z
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

  // ── 4. WALL HANDLES / RINGS (individual meshes — only 2) ─────────────────────
  // Burnt-orange torus rings flush-mounted on port and starboard walls.
  // One each side, in the aft section, well clear of door gap and porthole.
  // Placed at Z = +5.5, Y = 1.4 (comfortable grip height).

  const HANDLE_MAJOR_R = 0.10;
  const HANDLE_MINOR_R = 0.022;
  const HANDLE_Z       = 5.5;
  const HANDLE_Y       = 1.4;

  const handleGeo = new THREE.TorusGeometry(HANDLE_MAJOR_R, HANDLE_MINOR_R, 7, 12);
  handleGeo.rotateX(Math.PI / 2); // face outward from wall (ring in XY plane → rotate to be in YZ plane)

  for (const side of [-1, 1] as const) {
    const hx = side * (WALL_X - 0.025);
    const handle = new THREE.Mesh(handleGeo, mats.handle);
    handle.position.set(hx, HANDLE_Y, HANDLE_Z);
    handle.name = `wall-handle-${side === -1 ? 'port' : 'stbd'}`;
    group.add(handle);
  }

  // ── 5. CABLE CONDUIT (1 draw call) ───────────────────────────────────────────
  // Slim dark box along starboard baseboard, running full length minus door gap.
  // Sits ABOVE the teal floor strip (which is at ~Y=0.06), so no conflict.
  // The teal strip is at X = halfW - 0.025, height 0.06. Conduit sits just above it.

  const COND_H    = 0.04;
  const COND_W    = 0.035;
  const COND_Y    = 0.06 + COND_H / 2; // sits on top of teal strip
  const COND_X    = halfW - 0.025;      // same lateral position as teal strip

  // Fore segment: -halfD → DOOR_FORE_Z
  const condForeLen = DOOR_FORE_Z - (-halfD); // 3.3
  if (condForeLen > 0.05) {
    const cgf = new THREE.Mesh(
      new THREE.BoxGeometry(COND_W, COND_H, condForeLen),
      mats.conduit,
    );
    cgf.position.set(COND_X, COND_Y, -halfD + condForeLen / 2);
    cgf.name = 'cable-conduit-fore';
    group.add(cgf);
  }

  // Aft segment: DOOR_AFT_Z → +halfD
  const condAftLen = halfD - DOOR_AFT_Z; // 11.3
  if (condAftLen > 0.05) {
    const cga = new THREE.Mesh(
      new THREE.BoxGeometry(COND_W, COND_H, condAftLen),
      mats.conduit,
    );
    cga.position.set(COND_X, COND_Y, DOOR_AFT_Z + condAftLen / 2);
    cga.name = 'cable-conduit-aft';
    group.add(cga);
  }
}
