/**
 * Cockpit console geometry — split from cockpitProps.ts (Task 5: ≤300-line rule).
 * Contains: buildConsoleBank(), buildSideConsole(), live-screen canvas system.
 * Imported exclusively by cockpitProps.ts.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { AABB } from './types.js';
import { makeLiveScreenMat, liveScreenTick } from './cockpitScreens.js';
import type { ScreenType } from './cockpitScreens.js';

export { liveScreenTick };

// ── Palette ────────────────────────────────────────────────────────────────────
const COL_GUNMETAL = 0x1c1e22;
const COL_TEAL     = 0x46e0d8;
const COL_ORANGE   = 0xc7641e;
const COL_CREAM    = 0xe8e2d4;

// ── Module-level material singletons ──────────────────────────────────────────
const matGunmetal    = new THREE.MeshLambertMaterial({ color: COL_GUNMETAL });
const matOrange      = new THREE.MeshLambertMaterial({ color: COL_ORANGE });
const matTealDot     = new THREE.MeshBasicMaterial({ color: COL_TEAL });
const matCream       = new THREE.MeshLambertMaterial({ color: COL_CREAM });
// Shared sphere materials (hoisted from per-call allocation in buildSideConsole)
const matTealBasic   = new THREE.MeshBasicMaterial({ color: COL_TEAL });
const matOrangeBasic = new THREE.MeshBasicMaterial({ color: COL_ORANGE });

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

// ── Console bank ───────────────────────────────────────────────────────────────

export interface ConsoleBankResult {
  collider: AABB;
  levers: THREE.Group;
}

export function buildConsoleBank(group: THREE.Group): ConsoleBankResult {
  const BW = 4.6, BD = 0.55, BH = 0.75, TH = 0.22;
  const FZ = -2.48, CZ = FZ + BD / 2;

  const baseBox = new THREE.BoxGeometry(BW, BH, BD);
  baseBox.translate(0, BH / 2, 0);
  const capBox = new THREE.BoxGeometry(BW, TH, BD);
  capBox.translate(0, BH + TH / 2, 0);
  const consoleParts = [baseBox, capBox];
  const body = new THREE.Mesh(mergeGeometries(consoleParts), matGunmetal);
  for (const g of consoleParts) g.dispose();
  body.position.set(0, 0, CZ);
  group.add(body);

  // Orange accent stripe at junction
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(BW, 0.03, BD + 0.01), matOrange);
  stripe.position.set(0, BH + 0.015, CZ);
  group.add(stripe);

  // 3 live screens (canvas-based) — v0.6 P2: differentiated types per position
  // left=waveform, center=radar/scope, right=bar-graph
  const SW = 1.18, SH = 0.34;
  const SZ = FZ + BD + 0.005, SY = BH + TH * 0.5;
  const SCREEN_TYPES: ScreenType[] = ['waveform', 'radar', 'bargraph'];
  const screenXPositions = [-1.45, 0, 1.45] as const;
  for (let si = 0; si < screenXPositions.length; si++) {
    const sx = screenXPositions[si];
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(SW + 0.06, SH + 0.06, 0.025), matGunmetal);
    bezel.position.set(sx, SY, SZ);
    group.add(bezel);
    const scrMat = makeLiveScreenMat(SCREEN_TYPES[si]);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), scrMat);
    scr.position.set(sx, SY, SZ + 0.014);
    group.add(scr);
  }

  // Orange indicator dots along top edge (existing)
  const dotGeo = new THREE.SphereGeometry(0.018, 6, 4);
  const indMat = new THREE.MeshBasicMaterial({ color: COL_ORANGE });
  for (let i = 0; i < 5; i++) {
    const d = new THREE.Mesh(dotGeo, indMat);
    d.position.set(-1.8 + i * 0.9, BH + TH + 0.025, FZ + BD - 0.04);
    group.add(d);
  }

  // v0.6 P2: teal + amber emissive status dots along the console FRONT EDGE —
  // 4 small dots, alternating teal/amber, give the ref-05 "live console" feel.
  // Reuse the shared matTealBasic/matOrangeBasic singletons (was a fresh
  // material per dot) so the 2 teal + 2 orange dots can merge with siblings.
  const frontDotGeo = new THREE.SphereGeometry(0.015, 6, 4);
  const frontDotMats = [matTealBasic, matOrangeBasic, matTealBasic, matOrangeBasic];
  for (let i = 0; i < 4; i++) {
    const fd = new THREE.Mesh(frontDotGeo, frontDotMats[i]);
    fd.position.set(-0.9 + i * 0.6, BH * 0.5, FZ + 0.01); // front face, mid-height
    group.add(fd);
  }

  // Teal underlight strip
  const strip = new THREE.Mesh(new THREE.BoxGeometry(BW - 0.1, 0.03, 0.015), matTealDot);
  strip.position.set(0, 0.08, FZ + BD - 0.01);
  group.add(strip);

  // ── Console screen underglow planes (ref-05 / Task 5) ─────────────────────
  // Three thin emissive planes angled to wash the console body + seat-fronts
  // with teal screen-light. toneMapped=false, additive, no new lights.
  // One below each screen bezel, tilted toward the console face.
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x1ac8d8,        // slightly desaturated teal, not full 0x46e0d8
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  for (const sx of [-1.45, 0, 1.45]) {
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(SW * 0.9, 0.18), glowMat);
    // Position just below the screen, tilted down ~25° to wash the console face
    glow.position.set(sx, SY - SH / 2 - 0.06, SZ + 0.02);
    glow.rotation.x = -Math.PI * 0.14; // ~25° tilt downward toward console
    group.add(glow);
  }

  // Decals on center console
  addDecal(group, 'COCKPIT', 0.70, 0.10,
    new THREE.Vector3(0, BH + TH + 0.05, SZ + 0.02),
    0, 0, { font: '11px monospace', bgAlpha: 0 });

  // Throttle levers
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

// ── Side console extension ─────────────────────────────────────────────────────

export function buildSideConsole(group: THREE.Group, side: -1 | 1): AABB {
  const CONS_D = 0.45;
  const CONS_H = 0.9;
  const CONS_L = 1.8;
  const CONS_X = side * 2.55;
  const CONS_Y = 0.95;
  const TILT   = (12 * Math.PI) / 180;

  const bodyGeo = new THREE.BoxGeometry(CONS_D, CONS_H, CONS_L);
  const bodyMesh = new THREE.Mesh(bodyGeo, matGunmetal);
  bodyMesh.position.set(CONS_X, CONS_Y + CONS_H / 2, -1.1);
  bodyMesh.rotation.z = side * TILT;
  group.add(bodyMesh);

  const bezelGeo = new THREE.BoxGeometry(CONS_D + 0.02, 0.02, CONS_L + 0.02);
  const bezelMesh = new THREE.Mesh(bezelGeo, matCream);
  const topY = CONS_Y + CONS_H + 0.01;
  const topX = CONS_X - side * Math.sin(TILT) * CONS_H * 0.5;
  bezelMesh.position.set(topX, topY, -1.1);
  bezelMesh.rotation.z = side * TILT;
  group.add(bezelMesh);

  // 8 status spheres — merged, using module-level materials (no per-call alloc)
  const tealSphereGeos: THREE.SphereGeometry[] = [];
  const orangeSphereGeos: THREE.SphereGeometry[] = [];
  const sphereR = 0.02;
  const sphereSpacingZ = CONS_L / 9;

  for (let i = 0; i < 8; i++) {
    const sz = -1.1 - CONS_L / 2 + sphereSpacingZ * (i + 1);
    const sx = topX + side * 0.01;
    const sy = topY + 0.025;
    const sphereGeo = new THREE.SphereGeometry(sphereR, 6, 4);
    sphereGeo.translate(sx, sy, sz);
    if (i % 2 === 0) {
      tealSphereGeos.push(sphereGeo);
    } else {
      orangeSphereGeos.push(sphereGeo);
    }
  }

  if (tealSphereGeos.length > 0) {
    const merged = mergeGeometries(tealSphereGeos);
    for (const g of tealSphereGeos) g.dispose();
    group.add(new THREE.Mesh(merged, matTealBasic));
  }
  if (orangeSphereGeos.length > 0) {
    const merged = mergeGeometries(orangeSphereGeos);
    for (const g of orangeSphereGeos) g.dispose();
    group.add(new THREE.Mesh(merged, matOrangeBasic));
  }

  addDecal(group, side === -1 ? 'NAV' : 'PWR',
    0.3, 0.06,
    new THREE.Vector3(topX, topY + 0.04, -1.1),
    side === -1 ? 0 : Math.PI,
    0,
    { font: '10px monospace', bgAlpha: 0 });

  // Overhead switch panel
  const PANEL_Y = 2.55;
  const PANEL_Z = -1.1;
  const panelGeo = new THREE.BoxGeometry(0.06, 0.35, 1.2);
  const panelMesh = new THREE.Mesh(panelGeo, matGunmetal);
  panelMesh.position.set(side * 2.92, PANEL_Y, PANEL_Z);
  group.add(panelMesh);

  // 6 toggle nubs — merged
  const nubGeos: THREE.BoxGeometry[] = [];
  for (let i = 0; i < 6; i++) {
    const nz = PANEL_Z - 0.5 + (i + 0.5) * (1.0 / 6);
    const nGeo = new THREE.BoxGeometry(0.03, 0.04, 0.025);
    nGeo.translate(side * (2.92 + 0.04), PANEL_Y + 0.05, nz);
    nubGeos.push(nGeo);
  }
  const mergedNubs = mergeGeometries(nubGeos);
  for (const g of nubGeos) g.dispose();
  group.add(new THREE.Mesh(mergedNubs, matOrange));

  addDecal(
    group,
    'CAUTION — CANOPY SEAL',
    0.55,
    0.06,
    new THREE.Vector3(side * (2.55 + CONS_D * 0.5 + 0.002), CONS_Y + CONS_H * 0.55, -1.1),
    side === -1 ? Math.PI / 2 : -Math.PI / 2,
    0,
    { font: '9px monospace', textColor: '#C7641E', bgAlpha: 0.5 },
  );

  return {
    minX: CONS_X - CONS_D * 0.5,
    minY: CONS_Y,
    minZ: -1.1 - CONS_L / 2,
    maxX: CONS_X + CONS_D * 0.5,
    maxY: CONS_Y + CONS_H,
    maxZ: -1.1 + CONS_L / 2,
  };
}
