/**
 * Cockpit prop dressing — Phase 3b / v0.2 polish.
 * Console bank, pilot seats, center pedestal, side consoles, dust motes,
 * live screens, decals, and overhead switch panels.
 * All geometry is local-space (room origin = center of floor).
 * Room: 6W x 3H x 5D. Fore wall at Z = -2.5.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { AABB } from './types.js';

// ── Palette ────────────────────────────────────────────────────────────────────
const COL_GUNMETAL = 0x1c1e22;
const COL_TEAL     = 0x46e0d8;
const COL_ORANGE   = 0xc7641e;
const COL_CREAM    = 0xe8e2d4;

const matGunmetal  = new THREE.MeshLambertMaterial({ color: COL_GUNMETAL });
const matOrange    = new THREE.MeshLambertMaterial({ color: COL_ORANGE });
const matTealDot   = new THREE.MeshBasicMaterial({ color: COL_TEAL });
const matCream     = new THREE.MeshLambertMaterial({ color: COL_CREAM });

// ── Animated screen (canvas-based live update) ────────────────────────────────

interface LiveScreen {
  texture: THREE.CanvasTexture;
  canvas:  HTMLCanvasElement;
  ctx:     CanvasRenderingContext2D;
  lastPwr: number;
  cursor:  boolean;
  frame:   number;
}

const _liveScreens: LiveScreen[] = [];

function makeLiveScreenTexture(): THREE.CanvasTexture {
  const W = 256;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Initial draw — dark background + waveform
  ctx.fillStyle = '#050810';
  ctx.fillRect(0, 0, W, H);

  // Faint teal grid
  ctx.strokeStyle = 'rgba(70,224,216,0.15)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 16) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 16) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Initial waveform
  ctx.strokeStyle = 'rgba(70,224,216,0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.4);
  for (let x = 0; x <= W; x += 2) {
    const y = H * 0.4 + (Math.random() - 0.5) * 20;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  const ls: LiveScreen = {
    texture: tex,
    canvas,
    ctx,
    lastPwr: 94,
    cursor: false,
    frame: 0,
  };
  _liveScreens.push(ls);
  return tex;
}

/** Called each frame with elapsed time in ms. Updates live screen canvases. */
export function liveScreenTick(elapsed: number): void {
  // Gate: only update every 8 frames (~133ms at 60fps)
  const frameGate = Math.floor(elapsed / (1000 / 60));
  for (const ls of _liveScreens) {
    if (frameGate % 8 !== ls.frame % 8) continue;
    ls.frame++;

    const { canvas, ctx } = ls;
    const W = canvas.width;
    const H = canvas.height;

    // Scroll waveform strip left 4px
    const stripH = Math.floor(H * 0.55);
    const stripY = Math.floor(H * 0.1);
    ctx.drawImage(canvas, -4, 0);

    // Clear rightmost 4px column of waveform strip
    ctx.fillStyle = '#050810';
    ctx.fillRect(W - 4, stripY, 4, stripH);

    // Redraw rightmost 4px of waveform
    ctx.strokeStyle = 'rgba(70,224,216,0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const midY = stripY + stripH * 0.45;
    ctx.moveTo(W - 4, midY + (Math.random() - 0.5) * 18);
    ctx.lineTo(W, midY + (Math.random() - 0.5) * 18);
    ctx.stroke();

    // Update status bar (bottom strip)
    const BAR_Y = H - 20;
    ctx.fillStyle = '#050810';
    ctx.fillRect(0, BAR_Y, W, 20);

    // Cycle PWR value 91–96
    ls.lastPwr = 91 + ((ls.lastPwr - 91 + 1) % 6);
    const cursorChar = ls.cursor ? '_' : ' ';
    ls.cursor = !ls.cursor;
    ctx.fillStyle = 'rgba(70,224,216,0.85)';
    ctx.font = '10px monospace';
    ctx.fillText(`PWR ${ls.lastPwr}%  NAV OK  ${cursorChar}`, 4, H - 5);

    ls.texture.needsUpdate = true;
  }
}

// ── Shared screen material for live screens ───────────────────────────────────

function makeLiveScreenMat(): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    map: makeLiveScreenTexture(),
    side: THREE.FrontSide,
  });
}

// (Shader-based animated screens replaced by live canvas screens above)

// ── Decal helpers ──────────────────────────────────────────────────────────────

/** Build an inline CanvasTexture decal with stencil text. */
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

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/** Add a flat PlaneGeometry decal to a group. */
function addDecal(
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

// ── Console bank ───────────────────────────────────────────────────────────────

function buildConsoleBank(group: THREE.Group): { collider: AABB; levers: THREE.Group } {
  const BW = 4.6, BD = 0.55, BH = 0.75, TH = 0.22;
  const FZ = -2.48, CZ = FZ + BD / 2;

  const baseBox = new THREE.BoxGeometry(BW, BH, BD);
  baseBox.translate(0, BH / 2, 0);
  const capBox = new THREE.BoxGeometry(BW, TH, BD);
  capBox.translate(0, BH + TH / 2, 0);
  const body = new THREE.Mesh(mergeGeometries([baseBox, capBox]), matGunmetal);
  body.position.set(0, 0, CZ);
  group.add(body);

  // Orange accent stripe at junction
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(BW, 0.03, BD + 0.01), matOrange);
  stripe.position.set(0, BH + 0.015, CZ);
  group.add(stripe);

  // 3 live screens (canvas-based)
  const SW = 1.18, SH = 0.34;
  const SZ = FZ + BD + 0.005, SY = BH + TH * 0.5;
  for (const sx of [-1.45, 0, 1.45]) {
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(SW + 0.06, SH + 0.06, 0.025), matGunmetal);
    bezel.position.set(sx, SY, SZ);
    group.add(bezel);
    const scrMat = makeLiveScreenMat();
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), scrMat);
    scr.position.set(sx, SY, SZ + 0.014);
    group.add(scr);
  }

  // Orange indicator dots along top edge
  const dotGeo = new THREE.SphereGeometry(0.018, 6, 4);
  const indMat = new THREE.MeshBasicMaterial({ color: COL_ORANGE });
  for (let i = 0; i < 5; i++) {
    const d = new THREE.Mesh(dotGeo, indMat);
    d.position.set(-1.8 + i * 0.9, BH + TH + 0.025, FZ + BD - 0.04);
    group.add(d);
  }

  // Teal underlight strip
  const strip = new THREE.Mesh(new THREE.BoxGeometry(BW - 0.1, 0.03, 0.015), matTealDot);
  strip.position.set(0, 0.08, FZ + BD - 0.01);
  group.add(strip);

  // Decals on center console
  addDecal(group, 'COCKPIT', 0.70, 0.10,
    new THREE.Vector3(0, BH + TH + 0.05, SZ + 0.02),
    0, 0, { font: '11px monospace', bgAlpha: 0 });

  // Throttle levers (nice-to-have — named for integration)
  const levers = new THREE.Group();
  levers.name = 'throttle-levers';
  for (const side of [-1, 1] as const) {
    const lx = side * 0.095;
    const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.030, 0.06, 8), matGunmetal);
    sock.position.set(lx, 0.595, CZ + 0.1);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.22, 8), matOrange);
    shaft.position.set(lx, 0.72, CZ + 0.1);
    shaft.rotation.x = 0.18;
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), matOrange);
    knob.position.set(lx, 0.83, CZ + 0.14);
    const leverGroup = new THREE.Group();
    leverGroup.name = `lever-${side === -1 ? 'port' : 'stbd'}`;
    leverGroup.add(sock, shaft, knob);
    levers.add(leverGroup);
  }
  group.add(levers);

  return {
    collider: { minX: -BW / 2, minY: 0, minZ: FZ, maxX: BW / 2, maxY: BH + TH + 0.06, maxZ: FZ + BD },
    levers,
  };
}

// ── Pilot seat ────────────────────────────────────────────────────────────────

function buildSeat(group: THREE.Group, x: number, ry: number, name: string): AABB {
  const Z = 0.3;
  const ped = new THREE.BoxGeometry(0.18, 0.42, 0.18); ped.translate(0, 0.21, 0);
  const pan = new THREE.BoxGeometry(0.52, 0.08, 0.50); pan.translate(0, 0.45, 0);
  const bk  = new THREE.BoxGeometry(0.52, 0.58, 0.09); bk.translate(0, 0.75, -0.21);
  const hd  = new THREE.BoxGeometry(0.36, 0.22, 0.09); hd.translate(0, 1.30, -0.21);
  const body = new THREE.Mesh(mergeGeometries([ped, pan, bk, hd]), matGunmetal);
  body.position.set(x, 0, Z);
  body.rotation.y = ry;
  const seatGroup = new THREE.Group();
  seatGroup.name = name;
  seatGroup.add(body);

  // Orange accent stripe
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.10), matOrange);
  stripe.position.set(x, 0.72, Z - 0.21);
  stripe.rotation.y = ry;
  seatGroup.add(stripe);

  // Armrests
  for (const side of [-1, 1] as const) {
    const ag = new THREE.BoxGeometry(0.06, 0.04, 0.38);
    ag.translate(side * 0.29, 0.50, 0);
    const arm = new THREE.Mesh(ag, matGunmetal);
    arm.position.set(x, 0, Z);
    arm.rotation.y = ry;
    seatGroup.add(arm);
  }
  group.add(seatGroup);

  return { minX: x - 0.35, minY: 0, minZ: Z - 0.35, maxX: x + 0.35, maxY: 1.55, maxZ: Z + 0.35 };
}

// ── Center pedestal ───────────────────────────────────────────────────────────

function buildCenterPedestal(group: THREE.Group): AABB {
  const Z = 0.25;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.52, 0.28), matGunmetal);
  body.position.set(0, 0.26, Z);
  group.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.34), matOrange);
  top.position.set(0, 0.535, Z);
  group.add(top);

  return { minX: -0.20, minY: 0, minZ: Z - 0.20, maxX: 0.20, maxY: 0.90, maxZ: Z + 0.20 };
}

// ── Side console extension ────────────────────────────────────────────────────

/**
 * Build PORT (side = -1) or STARBOARD (side = +1) side console.
 * Returns the group named 'console-bank' (starboard only overrides if called last).
 */
function buildSideConsole(group: THREE.Group, side: -1 | 1): AABB {
  // Instrument bank: 0.45D x 0.9H x 1.8L, X at ±2.55, Y=0.95 base, canted 12° toward pilot
  const CONS_D = 0.45;  // depth (X axis, protrudes from wall)
  const CONS_H = 0.9;   // height
  const CONS_L = 1.8;   // length (Z axis)
  const CONS_X = side * 2.55;
  const CONS_Y = 0.95;  // bottom of console
  const TILT   = (12 * Math.PI) / 180;  // cant toward pilot

  // Body gunmetal BoxGeometry
  const bodyGeo = new THREE.BoxGeometry(CONS_D, CONS_H, CONS_L);
  const bodyMesh = new THREE.Mesh(bodyGeo, matGunmetal);
  bodyMesh.position.set(CONS_X, CONS_Y + CONS_H / 2, -1.1);
  bodyMesh.rotation.z = side * TILT; // tilt top face toward pilot
  group.add(bodyMesh);

  // Cream bezel on top face
  const bezelGeo = new THREE.BoxGeometry(CONS_D + 0.02, 0.02, CONS_L + 0.02);
  const bezelMesh = new THREE.Mesh(bezelGeo, matCream);
  // Position bezel at top of tilted body
  const topY = CONS_Y + CONS_H + 0.01;
  const topX = CONS_X - side * Math.sin(TILT) * CONS_H * 0.5;
  bezelMesh.position.set(topX, topY, -1.1);
  bezelMesh.rotation.z = side * TILT;
  group.add(bezelMesh);

  // 8 status spheres along top bezel (alternating teal / orange) — merged for 1 draw call each
  const tealSphereGeos: THREE.SphereGeometry[] = [];
  const orangeSphereGeos: THREE.SphereGeometry[] = [];
  const sphereR = 0.02;
  const sphereSpacingZ = CONS_L / 9;  // 8 spheres across length

  for (let i = 0; i < 8; i++) {
    const sz = -1.1 - CONS_L / 2 + sphereSpacingZ * (i + 1);
    const sx = topX + side * 0.01;  // slightly off the edge
    const sy = topY + 0.025;
    const sphereGeo = new THREE.SphereGeometry(sphereR, 6, 4);
    sphereGeo.translate(sx, sy, sz);
    if (i % 2 === 0) {
      tealSphereGeos.push(sphereGeo);
    } else {
      orangeSphereGeos.push(sphereGeo);
    }
  }

  const tealMatBasic   = new THREE.MeshBasicMaterial({ color: COL_TEAL });
  const orangeMatBasic = new THREE.MeshBasicMaterial({ color: COL_ORANGE });

  if (tealSphereGeos.length > 0) {
    const merged = mergeGeometries(tealSphereGeos);
    group.add(new THREE.Mesh(merged, tealMatBasic));
  }
  if (orangeSphereGeos.length > 0) {
    const merged = mergeGeometries(orangeSphereGeos);
    group.add(new THREE.Mesh(merged, orangeMatBasic));
  }

  // Decal on bezel face
  addDecal(group, side === -1 ? 'NAV' : 'PWR',
    0.3, 0.06,
    new THREE.Vector3(topX, topY + 0.04, -1.1),
    side === -1 ? 0 : Math.PI,
    0,
    { font: '10px monospace', bgAlpha: 0 });

  // Overhead switch panel: 0.06D x 0.35H x 1.2L at Y=2.55
  const PANEL_Y = 2.55;
  const PANEL_Z = -1.1;
  const panelGeo = new THREE.BoxGeometry(0.06, 0.35, 1.2);
  const panelMesh = new THREE.Mesh(panelGeo, matGunmetal);
  panelMesh.position.set(side * 2.92, PANEL_Y, PANEL_Z);
  group.add(panelMesh);

  // 6 toggle nubs on the overhead panel — merged
  const nubGeos: THREE.BoxGeometry[] = [];
  for (let i = 0; i < 6; i++) {
    const nz = PANEL_Z - 0.5 + (i + 0.5) * (1.0 / 6);
    const nGeo = new THREE.BoxGeometry(0.03, 0.04, 0.025);
    nGeo.translate(side * (2.92 + 0.04), PANEL_Y + 0.05, nz);
    nubGeos.push(nGeo);
  }
  const mergedNubs = mergeGeometries(nubGeos);
  group.add(new THREE.Mesh(mergedNubs, matOrange));

  // Decal on side console face (player-facing)
  addDecal(
    group,
    side === -1 ? 'CAUTION — CANOPY SEAL' : 'CAUTION — CANOPY SEAL',
    0.55,
    0.06,
    new THREE.Vector3(side * (2.55 + CONS_D * 0.5 + 0.002), CONS_Y + CONS_H * 0.55, -1.1),
    side === -1 ? Math.PI / 2 : -Math.PI / 2,
    0,
    { font: '9px monospace', textColor: '#C7641E', bgAlpha: 0.5 },
  );

  return {
    minX: side === -1 ? CONS_X - CONS_D * 0.5 : CONS_X - CONS_D * 0.5,
    minY: CONS_Y,
    minZ: -1.1 - CONS_L / 2,
    maxX: side === -1 ? CONS_X + CONS_D * 0.5 : CONS_X + CONS_D * 0.5,
    maxY: CONS_Y + CONS_H,
    maxZ: -1.1 + CONS_L / 2,
  };
}

// ── Dust motes particle field ─────────────────────────────────────────────────

const MOTE_COUNT = 300;
let _motePositions: Float32Array | null = null;
let _moteVelocities: Float32Array | null = null;
let _motePoints: THREE.Points | null = null;

function buildDustMotes(group: THREE.Group): void {
  const positions = new Float32Array(MOTE_COUNT * 3);
  const velocities = new Float32Array(MOTE_COUNT * 3);

  for (let i = 0; i < MOTE_COUNT; i++) {
    // Spread within canopy volume: X=-2..2, Y=0.5..2.5, Z=-2.5..-0.5
    positions[i * 3 + 0] = (Math.random() - 0.5) * 4.0;       // X: -2..2
    positions[i * 3 + 1] = 0.5  + Math.random() * 2.0;         // Y: 0.5..2.5
    positions[i * 3 + 2] = -2.5 + Math.random() * 2.0;         // Z: -2.5..-0.5

    // Slow random-walk velocity (will be updated per frame)
    velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.002;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: COL_CREAM,
    size: 0.012,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.06,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  points.name = 'dust-motes';
  group.add(points);

  _motePositions  = positions;
  _moteVelocities = velocities;
  _motePoints     = points;
}

/** Tick dust mote positions. Call each frame from cockpitProps tick. */
export function dustMoteTick(): void {
  if (!_motePositions || !_moteVelocities || !_motePoints) return;
  const pos = _motePositions;

  for (let i = 0; i < MOTE_COUNT; i++) {
    const ix = i * 3;
    pos[ix]   += _moteVelocities[ix]   + (Math.random() - 0.5) * 0.0004;
    pos[ix+1] += _moteVelocities[ix+1] + (Math.random() - 0.5) * 0.0004;
    pos[ix+2] += _moteVelocities[ix+2] + (Math.random() - 0.5) * 0.0002;

    // Wrap bounds
    if (pos[ix]   < -2.0 || pos[ix]   > 2.0)  pos[ix]   = (Math.random() - 0.5) * 3.5;
    if (pos[ix+1] < 0.5  || pos[ix+1] > 2.5)  pos[ix+1] = 0.5 + Math.random() * 2.0;
    if (pos[ix+2] < -2.5 || pos[ix+2] > -0.5) pos[ix+2] = -2.5 + Math.random() * 1.8;
  }

  const attr = _motePoints.geometry.attributes['position'] as THREE.BufferAttribute;
  attr.needsUpdate = true;
}

// ── Accent details ────────────────────────────────────────────────────────────

function buildAccents(group: THREE.Group): void {
  // Canopy surround decals
  // 'COCKPIT' plaque on the canopy surround header (above the opening, Y>2.6)
  addDecal(group, 'COCKPIT', 0.80, 0.08,
    new THREE.Vector3(0, 2.78, -2.49),
    0, 0,
    { font: '14px monospace', textColor: '#C7641E', bgAlpha: 0.6, texW: 256, texH: 48 });

  // 'CAUTION — CANOPY SEAL' on left canopy surround
  addDecal(group, 'CAUTION — CANOPY SEAL', 0.60, 0.07,
    new THREE.Vector3(-2.20, 1.80, -2.49),
    0, 0,
    { font: '9px monospace', textColor: '#C7641E', bgAlpha: 0.5, texW: 256, texH: 48 });

  // Right canopy surround
  addDecal(group, 'CAUTION — CANOPY SEAL', 0.60, 0.07,
    new THREE.Vector3(2.20, 1.80, -2.49),
    0, 0,
    { font: '9px monospace', textColor: '#C7641E', bgAlpha: 0.5, texW: 256, texH: 48 });
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface CockpitPropsResult {
  colliders: AABB[];
  /** Named group holding the two throttle levers for integration wiring. */
  throttleLevers: THREE.Group | null;
}

/** Dress the cockpit room group with all Phase 3b / v0.2 props. Mutates `group`. */
export function addCockpitProps(group: THREE.Group): CockpitPropsResult {
  const colliders: AABB[] = [];

  const { collider: consoleColl, levers } = buildConsoleBank(group);
  colliders.push(consoleColl);

  // Named seats (nice-to-have naming for integration)
  colliders.push(buildSeat(group, -0.90,  0.07, 'seat-port'));
  colliders.push(buildSeat(group,  0.90, -0.07, 'seat-starboard'));

  // Named console bank group (container)
  const consoleBankGroup = new THREE.Group();
  consoleBankGroup.name = 'console-bank';
  group.add(consoleBankGroup);

  colliders.push(buildCenterPedestal(group));

  // Side consoles (MUST-DO #1)
  colliders.push(buildSideConsole(group, -1)); // port
  colliders.push(buildSideConsole(group,  1)); // starboard

  // Dust motes (MUST-DO #3)
  buildDustMotes(group);

  // Canopy decals (MUST-DO #4 partial)
  buildAccents(group);

  return { colliders, throttleLevers: levers };
}
