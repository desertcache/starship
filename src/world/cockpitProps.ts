/**
 * Cockpit prop dressing — Phase 3b / v0.2 polish.
 * Orchestrates: console bank (→ cockpitConsoles.ts), pilot seats,
 * center pedestal, dust motes, decals, and overhead accents.
 * All geometry is local-space (room origin = center of floor).
 * Room: 6W x 3H x 5D. Fore wall at Z = -2.5.
 *
 * Split from original 477-line file per ≤300-line rule.
 * Console + side-console builders live in cockpitConsoles.ts.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { AABB } from './types.js';
import {
  buildConsoleBank,
  buildSideConsole,
  addDecal,
  liveScreenTick,
} from './cockpitConsoles.js';
import { matConsoleHousing, matSeatFabric } from '../fx/propMaterials.js';

export { liveScreenTick };

// ── Palette ────────────────────────────────────────────────────────────────────
const COL_ORANGE   = 0xc7641e;
const COL_CREAM    = 0xe8e2d4;

// v0.9 A-bridge: was flat near-black Lambert (#1C1E22) — pedestal/armrest
// metal shell, confirmed void offender ("console housings"). Cushioned seat
// surfaces (pan/back/headrest) are split out to matSeatFabric in buildSeat().
const matGunmetal: THREE.MeshStandardMaterial = matConsoleHousing;
const matOrange    = new THREE.MeshLambertMaterial({ color: COL_ORANGE });
const matCream     = new THREE.MeshLambertMaterial({ color: COL_CREAM });

// ── Pilot seat ─────────────────────────────────────────────────────────────────

function buildSeat(group: THREE.Group, x: number, ry: number, name: string): AABB {
  const Z = 0.3;
  // Metal pedestal (floor-bolted base) — console-housing family.
  const ped = new THREE.BoxGeometry(0.18, 0.42, 0.18); ped.translate(0, 0.21, 0);
  const pedMesh = new THREE.Mesh(ped, matGunmetal);
  pedMesh.position.set(x, 0, Z);
  pedMesh.rotation.y = ry;

  // Cushioned surfaces (pan + backrest + headrest) — confirmed void offender
  // ("pilot seats"); split out to the oxblood seat-fabric PBR singleton so the
  // seat reads as a padded cushion, not a metal-shell silhouette.
  const pan = new THREE.BoxGeometry(0.52, 0.08, 0.50); pan.translate(0, 0.45, 0);
  const bk  = new THREE.BoxGeometry(0.52, 0.58, 0.09); bk.translate(0, 0.75, -0.21);
  const hd  = new THREE.BoxGeometry(0.36, 0.22, 0.09); hd.translate(0, 1.30, -0.21);
  const cushionGeos = [pan, bk, hd];
  const cushionMesh = new THREE.Mesh(mergeGeometries(cushionGeos), matSeatFabric);
  for (const g of cushionGeos) g.dispose();
  cushionMesh.position.set(x, 0, Z);
  cushionMesh.rotation.y = ry;

  const seatGroup = new THREE.Group();
  seatGroup.name = name;
  seatGroup.add(pedMesh, cushionMesh);

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

// ── Center pedestal ────────────────────────────────────────────────────────────

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

// ── Dust motes particle field ──────────────────────────────────────────────────

const MOTE_COUNT = 300;
let _motePositions: Float32Array | null = null;
let _moteVelocities: Float32Array | null = null;
let _motePoints: THREE.Points | null = null;

function buildDustMotes(group: THREE.Group): void {
  const positions  = new Float32Array(MOTE_COUNT * 3);
  const velocities = new Float32Array(MOTE_COUNT * 3);

  for (let i = 0; i < MOTE_COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 4.0;
    positions[i * 3 + 1] = 0.5  + Math.random() * 2.0;
    positions[i * 3 + 2] = -2.5 + Math.random() * 2.0;
    velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.002;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xe8e2d4,
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

    if (pos[ix]   < -2.0 || pos[ix]   > 2.0)  pos[ix]   = (Math.random() - 0.5) * 3.5;
    if (pos[ix+1] < 0.5  || pos[ix+1] > 2.5)  pos[ix+1] = 0.5 + Math.random() * 2.0;
    if (pos[ix+2] < -2.5 || pos[ix+2] > -0.5) pos[ix+2] = -2.5 + Math.random() * 1.8;
  }

  const attr = _motePoints.geometry.attributes['position'] as THREE.BufferAttribute;
  attr.needsUpdate = true;
}

// ── Accent details ─────────────────────────────────────────────────────────────

function buildAccents(group: THREE.Group): void {
  addDecal(group, 'COCKPIT', 0.80, 0.08,
    new THREE.Vector3(0, 2.78, -2.49),
    0, 0,
    { font: '14px monospace', textColor: '#C7641E', bgAlpha: 0.6, texW: 256, texH: 48 });

  addDecal(group, 'CAUTION — CANOPY SEAL', 0.60, 0.07,
    new THREE.Vector3(-2.20, 1.80, -2.49),
    0, 0,
    { font: '9px monospace', textColor: '#C7641E', bgAlpha: 0.5, texW: 256, texH: 48 });

  addDecal(group, 'CAUTION — CANOPY SEAL', 0.60, 0.07,
    new THREE.Vector3(2.20, 1.80, -2.49),
    0, 0,
    { font: '9px monospace', textColor: '#C7641E', bgAlpha: 0.5, texW: 256, texH: 48 });
}

// ── Public API ─────────────────────────────────────────────────────────────────

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

  colliders.push(buildSeat(group, -0.90,  0.07, 'seat-port'));
  colliders.push(buildSeat(group,  0.90, -0.07, 'seat-starboard'));

  // Named console bank group (container)
  const consoleBankGroup = new THREE.Group();
  consoleBankGroup.name = 'console-bank';
  group.add(consoleBankGroup);

  colliders.push(buildCenterPedestal(group));

  colliders.push(buildSideConsole(group, -1)); // port
  colliders.push(buildSideConsole(group,  1)); // starboard

  buildDustMotes(group);
  buildAccents(group);

  return { colliders, throttleLevers: levers };
}

// Keep matCream exported for any consumer that might reference it by name
export { matCream };
