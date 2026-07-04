/**
 * Ceiling fixture geometry helpers — lane B2 "Ceiling & fixtures".
 * Internal module: geometry constants, per-fixture builders, conduit runs, room layout.
 * Consumed exclusively by ceilingFixtures.ts.
 */
import * as THREE from 'three';

// ── Fixture geometry constants (exported for ceilingFixtures.ts) ───────────────

/** Fixture module footprint (outer housing, m) */
export const FIX_W     = 0.55;
export const FIX_D_LEN = 1.05;

/** Housing frame border box thickness (each of the 4 sides) */
export const FRAME_BORDER = 0.07;

/** Housing box depth (sits proud of ceiling face) */
export const FRAME_DEPTH = 0.07;

/** Recess depth — how far BELOW ceiling the diffuser sits */
export const RECESS_DEPTH = 0.055;

/** Coplanarity: recess cap sits this far below ceiling (inside recess) */
const RECESS_CAP_INSET = 0.005;

/** Diffuser is slightly smaller than the opening */
const DIFFUSER_MARGIN = 0.015;

/** Inner diffuser width/depth */
export const DIFF_W = FIX_W - FRAME_BORDER * 2 - DIFFUSER_MARGIN * 2;
export const DIFF_D = FIX_D_LEN - FRAME_BORDER * 2 - DIFFUSER_MARGIN * 2;

/** Grille slat dimensions */
const SLAT_COUNT = 4;
const SLAT_H     = 0.02;
const SLAT_THICK = 0.05;

/** Conduit geometry */
const CONDUIT_R      = 0.03;
const BRACKET_S      = 0.06;
const BRACKET_SPACING = 2.0;

// ── Types ──────────────────────────────────────────────────────────────────────

export interface FixtureSpec {
  x: number;
  z: number;
  grille: boolean;
}

export type RoomType = 'cockpit' | 'corridor' | 'quarters' | 'galley' | 'engineering' | 'cargo' | 'portal-room';

// ── Seeded PRNG ────────────────────────────────────────────────────────────────

export function seededRng(seed: number): () => number {
  let s = seed;
  return (): number => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// ── Room identification ────────────────────────────────────────────────────────

export function identifyRoom(W: number, D: number): RoomType {
  if (W === 3 && D === 16) return 'corridor';
  if (W === 6 && D === 5)  return 'cockpit';
  if (W === 5 && D === 5)  return 'quarters';
  if (W === 6 && D === 6)  return 'galley';
  if (W === 6 && D === 7)  return 'engineering';
  if (W === 8 && D === 9)  return 'cargo';
  if (W === 8 && D === 7)  return 'portal-room'; // v1.0 THRESHOLD Dimensional Annex
  return 'quarters'; // fallback
}

// ── Fixture layout per room ────────────────────────────────────────────────────

export function getFixtureSpecs(room: RoomType, rng: () => number): FixtureSpec[] {
  const s: FixtureSpec[] = [];
  switch (room) {
    case 'cockpit':
      // 2 fixtures over pilot area (aft half), clear of fore canopy
      s.push({ x: -1.2, z: 0.8, grille: rng() > 0.5 });
      s.push({ x:  1.2, z: 0.8, grille: rng() > 0.5 });
      break;
    case 'corridor':
      // 4 fixtures — Z ≈ -7, -4, 0.5, 3.5 along the spine
      s.push({ x: 0, z: -7.0, grille: rng() > 0.5 });
      s.push({ x: 0, z: -4.0, grille: rng() > 0.5 });
      s.push({ x: 0, z:  0.5, grille: rng() > 0.5 });
      s.push({ x: 0, z:  3.5, grille: rng() > 0.5 });
      break;
    case 'quarters':
      s.push({ x: 0, z: 0, grille: rng() > 0.5 });
      break;
    case 'galley':
      // 2 fixtures over starboard counter run
      s.push({ x: 1.5, z: -0.8, grille: rng() > 0.5 });
      s.push({ x: 1.5, z:  1.2, grille: rng() > 0.5 });
      break;
    case 'engineering':
      // 2 fixtures flanking reactor, visible from cam at Z=-2.2 looking +Z
      s.push({ x: -2.0, z: -0.5, grille: rng() > 0.5 });
      s.push({ x:  2.0, z: -0.5, grille: rng() > 0.5 });
      break;
    case 'cargo':
      // 3 pendant-style fixtures (5m ceiling)
      s.push({ x: -2.0, z: -2.0, grille: rng() > 0.5 });
      s.push({ x:  0.0, z:  0.5, grille: rng() > 0.5 });
      s.push({ x:  2.0, z:  2.5, grille: rng() > 0.5 });
      break;
    case 'portal-room':
      // 4 fixtures in a straight ceiling strip down the room's spine
      s.push({ x: 0, z: -2.4, grille: rng() > 0.5 });
      s.push({ x: 0, z: -0.8, grille: rng() > 0.5 });
      s.push({ x: 0, z:  0.8, grille: rng() > 0.5 });
      s.push({ x: 0, z:  2.4, grille: rng() > 0.5 });
      break;
  }
  return s;
}

// ── Per-fixture geometry builders ─────────────────────────────────────────────

/** Push 4 housing border boxes + recess cap into geos (to be merged). */
export function pushHousingGeos(
  geos: THREE.BufferGeometry[],
  cx: number, cz: number, ceilY: number,
): void {
  const hY      = ceilY - FRAME_DEPTH / 2;
  const innerLen = FIX_D_LEN - FRAME_BORDER * 2;

  const left = new THREE.BoxGeometry(FRAME_BORDER, FRAME_DEPTH, FIX_D_LEN);
  left.translate(cx - FIX_W / 2 + FRAME_BORDER / 2, hY, cz);
  geos.push(left);

  const right = new THREE.BoxGeometry(FRAME_BORDER, FRAME_DEPTH, FIX_D_LEN);
  right.translate(cx + FIX_W / 2 - FRAME_BORDER / 2, hY, cz);
  geos.push(right);

  const fore = new THREE.BoxGeometry(FIX_W - FRAME_BORDER * 2, FRAME_DEPTH, FRAME_BORDER);
  fore.translate(cx, hY, cz - innerLen / 2 - FRAME_BORDER / 2);
  geos.push(fore);

  const aft = new THREE.BoxGeometry(FIX_W - FRAME_BORDER * 2, FRAME_DEPTH, FRAME_BORDER);
  aft.translate(cx, hY, cz + innerLen / 2 + FRAME_BORDER / 2);
  geos.push(aft);

  // Recess cap (dark cavity interior)
  const cap = new THREE.BoxGeometry(DIFF_W + DIFFUSER_MARGIN, 0.008, DIFF_D + DIFFUSER_MARGIN);
  cap.translate(cx, ceilY - RECESS_CAP_INSET - 0.004, cz);
  geos.push(cap);
}

/** Push grille slats for grille-variant fixtures into geos. */
export function pushSlatGeos(
  geos: THREE.BufferGeometry[],
  cx: number, cz: number, ceilY: number,
): void {
  const slatY    = ceilY - RECESS_DEPTH / 2;
  const slatZ0   = cz - DIFF_D / 2 + DIFF_D / (SLAT_COUNT + 1);
  const slatStep = DIFF_D / (SLAT_COUNT + 1);
  for (let i = 0; i < SLAT_COUNT; i++) {
    const geo = new THREE.BoxGeometry(DIFF_W, SLAT_H, SLAT_THICK);
    geo.translate(cx, slatY, slatZ0 + i * slatStep);
    geos.push(geo);
  }
}

/** Build the emissive diffuser plane (faces downward, sits in recess). */
export function makeDiffuserGeo(
  cx: number, cz: number, ceilY: number,
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(DIFF_W, DIFF_D);
  geo.rotateX(Math.PI / 2);
  geo.translate(cx, ceilY - RECESS_DEPTH, cz);
  return geo;
}

// ── Conduit runs ───────────────────────────────────────────────────────────────

/** Push one conduit pipe + brackets along Z into geos. */
export function pushConduitRun(
  geos: THREE.BufferGeometry[],
  x: number, ceilY: number, zMin: number, zMax: number,
): void {
  const pipeY   = ceilY - CONDUIT_R - 0.04;
  const pipeLen = zMax - zMin;

  const pipe = new THREE.CylinderGeometry(CONDUIT_R, CONDUIT_R, pipeLen, 6);
  pipe.rotateX(Math.PI / 2);
  pipe.translate(x, pipeY, zMin + pipeLen / 2);
  geos.push(pipe);

  const numBrackets = Math.max(2, Math.ceil(pipeLen / BRACKET_SPACING));
  const step        = pipeLen / (numBrackets - 1);
  for (let i = 0; i < numBrackets; i++) {
    const b = new THREE.BoxGeometry(BRACKET_S, BRACKET_S, BRACKET_S);
    b.translate(x, pipeY + CONDUIT_R + BRACKET_S / 2, zMin + i * step);
    geos.push(b);
  }
}

/** Push port + starboard conduit runs for a room (skip corridor). */
export function addConduitRuns(
  geos: THREE.BufferGeometry[],
  room: RoomType, W: number, H: number, D: number,
): void {
  if (room === 'corridor') return; // existing instanced pipes — do not duplicate
  const halfW = W / 2;
  const halfD = D / 2;
  const INSET = 0.12;
  pushConduitRun(geos, -halfW + INSET, H, -halfD, halfD);
  pushConduitRun(geos,  halfW - INSET, H, -halfD, halfD);
}

/** Push pendant stem cylinder for cargo fixtures. */
export function pushCargoStem(
  geos: THREE.BufferGeometry[],
  cx: number, cz: number, ceilY: number, pendantDrop: number,
): void {
  const stemLen = pendantDrop + FRAME_DEPTH;
  const stem = new THREE.CylinderGeometry(0.015, 0.015, stemLen, 5);
  stem.translate(cx, ceilY - stemLen / 2, cz);
  geos.push(stem);
}
