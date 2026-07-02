/**
 * Cargo Bay prop dressing.
 * Budget target: ≤ 22 draw calls (merge crate faces + catwalk grating via BufferGeometryUtils).
 *
 * Props:
 *   (a) Grated catwalk at Y=2.5, port-to-starboard at local Z=0, with side rails + 5-step ladder.
 *   (b) Mag-clamp floor anchors — 2×3 grid of orange pads with teal status pips.
 *   (c) Stacked crate columns at aft corners (X=±2.8, Z=+3.2), 3 stacked per side.
 *   (d) Cargo manifest signs on aft wall via CanvasTexture.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { buildCargoBayDensity } from './cargoBayDensity.js';
import { matCatwalkSteel, matCrateShell } from '../fx/propMaterials.js';
import { addLedCluster, LedColors } from '../fx/glow.js';
import type { AABB } from './types.js';

const COL_GUNMETAL = 0x1C1E22;
const COL_ORANGE   = 0xC7641E;
const COL_TEAL     = 0x46E0D8;
const COL_RUST     = 0x7A2C1F;

// ── Lazy materials ─────────────────────────────────────────────────────────────

// Catwalk deck/rails/ladder — confirmed void offender ("catwalk band, ladder").
// Catwalk-grating-steel PBR family (v0.9 A-bridge).
const matGun = (): THREE.MeshStandardMaterial => matCatwalkSteel;

let _matOrange: THREE.MeshLambertMaterial | null = null;
const matOrange = (): THREE.MeshLambertMaterial =>
  _matOrange ?? (_matOrange = new THREE.MeshLambertMaterial({ color: COL_ORANGE }));

let _matRust: THREE.MeshLambertMaterial | null = null;
const matRust = (): THREE.MeshLambertMaterial =>
  _matRust ?? (_matRust = new THREE.MeshLambertMaterial({ color: COL_RUST }));

let _matTeal: THREE.MeshBasicMaterial | null = null;
const matTeal = (): THREE.MeshBasicMaterial =>
  _matTeal ?? (_matTeal = new THREE.MeshBasicMaterial({ color: COL_TEAL }));

// ── (a) Catwalk ────────────────────────────────────────────────────────────────

function buildCatwalk(group: THREE.Group, W: number): void {
  const WALK_Y  = 2.50;
  const WALK_W  = 1.20;
  const WALK_H  = 0.08;
  const WALK_L  = W - 0.4; // span most of the width (7.6m)
  const RAIL_H  = 0.50;    // rails from Y=2.5 to Y=3.0
  const RAIL_R  = 0.02;
  const POST_R  = 0.025;

  // Grating deck (merged into 1 draw call)
  const deckGeo = new THREE.BoxGeometry(WALK_L, WALK_H, WALK_W);
  deckGeo.translate(0, WALK_Y + WALK_H / 2, 0);

  // Grating cross-bars (5 along length, merged)
  const barGeos: THREE.BufferGeometry[] = [deckGeo];
  const nBars = 6;
  for (let i = 0; i < nBars; i++) {
    const t = (i / (nBars - 1)) - 0.5;
    const bg = new THREE.BoxGeometry(WALK_L, WALK_H + 0.005, 0.04);
    bg.translate(0, WALK_Y + WALK_H / 2, t * (WALK_W - 0.04));
    barGeos.push(bg);
  }
  const merged = mergeGeometries(barGeos);
  for (const g of barGeos) g.dispose();
  const deckMesh = new THREE.Mesh(merged, matGun());
  group.add(deckMesh); // 1 draw call

  // Side rails (port and starboard of catwalk)
  for (const side of [-1, 1] as const) {
    const railZ = side * (WALK_W / 2 + RAIL_R);
    // Horizontal top rail tube (approximated as box)
    const railGeo = new THREE.BoxGeometry(WALK_L, RAIL_R * 2, RAIL_R * 2);
    railGeo.translate(0, WALK_Y + WALK_H + RAIL_H, railZ);

    // Posts at each end
    const postGeoA = new THREE.CylinderGeometry(POST_R, POST_R, RAIL_H, 6);
    postGeoA.translate(-WALK_L / 2 + 0.04, WALK_Y + WALK_H + RAIL_H / 2, railZ);
    const postGeoB = new THREE.CylinderGeometry(POST_R, POST_R, RAIL_H, 6);
    postGeoB.translate( WALK_L / 2 - 0.04, WALK_Y + WALK_H + RAIL_H / 2, railZ);

    const railParts = [railGeo, postGeoA, postGeoB];
    const railMerged = mergeGeometries(railParts);
    for (const g of railParts) g.dispose();
    const railMesh = new THREE.Mesh(railMerged, matGun());
    group.add(railMesh); // 2 draw calls (one per side)
  }

  // 5-step ladder at starboard end (X = +WALK_L/2)
  const ladderX = WALK_L / 2 + 0.06;
  const STEP_W = 0.32;
  const STEP_D = 0.06;
  const STEP_H = 0.04;
  const stepGeos: THREE.BufferGeometry[] = [];
  for (let s = 0; s < 5; s++) {
    const sg = new THREE.BoxGeometry(STEP_W, STEP_H, STEP_D);
    sg.translate(ladderX, 0.45 + s * (WALK_Y / 5), 0);
    stepGeos.push(sg);
  }
  // Side stringers
  const strA = new THREE.BoxGeometry(0.03, WALK_Y + WALK_H, 0.03);
  strA.translate(ladderX, (WALK_Y + WALK_H) / 2, -STEP_W / 2 + 0.02);
  const strB = new THREE.BoxGeometry(0.03, WALK_Y + WALK_H, 0.03);
  strB.translate(ladderX, (WALK_Y + WALK_H) / 2,  STEP_W / 2 - 0.02);
  stepGeos.push(strA, strB);
  const ladderMerged = mergeGeometries(stepGeos);
  for (const g of stepGeos) g.dispose();
  const ladderMesh = new THREE.Mesh(ladderMerged, matGun());
  group.add(ladderMesh); // 1 draw call
}

// ── (b) Mag-clamp floor anchors ────────────────────────────────────────────────

function buildMagClamps(group: THREE.Group): void {
  const PAD_W = 0.50; const PAD_H = 0.06; const PAD_D = 0.50;
  const XS    = [-1.8, 1.8] as const;
  const ZS    = [-2.5, 0.0, 2.5] as const;

  const padGeos: THREE.BufferGeometry[] = [];
  for (const x of XS) {
    for (const z of ZS) {
      const g = new THREE.BoxGeometry(PAD_W, PAD_H, PAD_D);
      g.translate(x, PAD_H / 2, z);
      padGeos.push(g);
    }
  }
  const padMerged = mergeGeometries(padGeos);
  for (const g of padGeos) g.dispose();
  const padMesh = new THREE.Mesh(padMerged, matOrange());
  group.add(padMesh); // 1 draw call

  // Status pips (6 spheres, one per pad — each is a separate draw call, small geometry)
  const pipGeo = new THREE.SphereGeometry(0.04, 6, 4);
  for (const x of XS) {
    for (const z of ZS) {
      const pip = new THREE.Mesh(pipGeo, matTeal());
      pip.position.set(x, PAD_H + 0.04, z);
      group.add(pip); // 6 draw calls total
    }
  }
}

// ── (c) Stacked crate columns ──────────────────────────────────────────────────

function buildCrateColumns(group: THREE.Group, D: number): void {
  const halfD = D / 2;
  const COLS  = [[-2.8, halfD - 0.5], [2.8, halfD - 0.5]] as [number, number][];
  const STACK = [
    { h: 0.0, color: COL_RUST    },
    { h: 0.9, color: COL_GUNMETAL },
    { h: 1.8, color: COL_RUST    },
  ] as const;

  for (const [cx, cz] of COLS) {
    // Merge all 3 crate bodies for this column (same material split by color)
    const rustGeos:  THREE.BufferGeometry[] = [];
    const gunGeos:   THREE.BufferGeometry[] = [];
    const crateSize  = 0.9;
    for (const { h, color } of STACK) {
      const g = new THREE.BoxGeometry(crateSize, crateSize, crateSize);
      g.translate(cx, h + crateSize / 2, cz);
      if (color === COL_RUST) rustGeos.push(g);
      else gunGeos.push(g);
    }
    if (rustGeos.length > 0) {
      const m = new THREE.Mesh(mergeGeometries(rustGeos), matRust());
      for (const g of rustGeos) g.dispose();
      group.add(m); // 1 draw call per column for rust crates
    }
    if (gunGeos.length > 0) {
      // Crate shells — confirmed void offender; crate-shell PBR family
      // (distinct from the catwalk-steel matGun() used elsewhere in this file).
      const m = new THREE.Mesh(mergeGeometries(gunGeos), matCrateShell);
      for (const g of gunGeos) g.dispose();
      group.add(m); // 1 draw call per column for gun crates
    }

    // Orange corner trim strips (top of each crate), merged per column
    const trimGeos: THREE.BufferGeometry[] = [];
    for (const { h } of STACK) {
      const cs = crateSize;
      const T  = 0.04;
      // 4 top-edge strips per crate: [posX, posY, posZ, geoW, geoH, geoD]
      for (const [px, py, pz, gw, gh, gd] of [
        [cx,              h + cs - T / 2, cz - cs/2 + T/2, cs, T,  T],
        [cx,              h + cs - T / 2, cz + cs/2 - T/2, cs, T,  T],
        [cx - cs/2 + T/2, h + cs - T / 2, cz,             T,  T,  cs],
        [cx + cs/2 - T/2, h + cs - T / 2, cz,             T,  T,  cs],
      ] as [number, number, number, number, number, number][]) {
        const g = new THREE.BoxGeometry(gw, gh, gd);
        g.translate(px, py, pz);
        trimGeos.push(g);
      }
    }
    if (trimGeos.length > 0) {
      const m = new THREE.Mesh(mergeGeometries(trimGeos), matOrange());
      for (const g of trimGeos) g.dispose();
      group.add(m); // 1 draw call per column for trim
    }

    // Micro-LED cluster (v0.9 B2 glow build) — 2 status lights on the top
    // crate's FORE face (camera-facing) per column, "cargo lock" read. One
    // column blinks.
    const topCrateY = STACK[2].h + crateSize;
    addLedCluster(group, [
      { pos: new THREE.Vector3(cx - crateSize * 0.2, topCrateY - 0.10, cz - crateSize / 2 - 0.005), color: LedColors.teal },
      {
        pos: new THREE.Vector3(cx + crateSize * 0.2, topCrateY - 0.10, cz - crateSize / 2 - 0.005),
        color: LedColors.orange, blink: cx < 0, period: 2.4, phase: 0.4,
      },
    ]);
  }
}

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

function buildManifestSigns(group: THREE.Group, D: number): void {
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

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Dress the cargo bay room group with all props. Mutates `group`.
 * Draw call budget:
 *   Phase 1: catwalk(4) + pads(1) + pips(6) + crates(6) + signs(2) = 19
 *   Density: mid-floor crates(4) + conduits(6) + hook(2) + decals(3) = 15 (≤14 net added)
 *
 * Returns AABB colliders for density-pass additions.
 */
export function buildCargoBayProps(
  group: THREE.Group,
  W: number,
  _H: number,
  D: number,
): AABB[] {
  buildCatwalk(group, W);
  buildMagClamps(group);
  buildCrateColumns(group, D);
  buildManifestSigns(group, D);

  // Density pass — sparse zones fill
  const { colliders } = buildCargoBayDensity(group, W, D);
  return colliders;
}
