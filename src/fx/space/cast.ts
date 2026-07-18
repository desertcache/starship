/**
 * Cast entries — the rolling streaming cast of bodies/asteroids/events.
 *
 * Each body entry owns a small independent world-space drift (driftW,
 * v1.1 SOVEREIGN: was separate vx/vy/+Z-driftSpeed scalars) added on top of
 * the shared universe flow (getFlowW()) so its bearing changes as it crosses
 * the windows, on top of the collective streaming motion everything shares.
 *
 * Spawn/despawn generalize from a fixed +Z band to the current flow axis
 * (getFlowAxis()): at boot flowAxis=(0,0,1), so placement/despawn are
 * byte-identical to the old fixed-+Z runway; off-axis, the same numbers
 * apply in the rotated frame (docs/design-v1.1-sovereign.md §3 D1).
 *
 * The director owns scheduling and invariants; this module owns spawn geometry,
 * per-tick motion, despawn test, and disposal of one entry.
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';
import { createBody } from './bodies.js';
import type { Body, BodyKind } from './bodies.js';
import { createAsteroidField } from './asteroids.js';
import type { AsteroidField } from './asteroids.js';
import { createRareEvent } from './events.js';
import type { RareEvent, EventKind } from './events.js';
import { getFlowWRef as getFlowW, getFlowAxisRef as getFlowAxis } from '../../flight/flightState.js'; // Stage 2: live refs, same zero-alloc semantics the shim had
import { CRUISE_SPEED_NEAR } from '../starfield.js';

export type CastRole = 'HERO' | 'AMBIENT';

/** Despawn boundary along the flow axis — once an entry's anchor passes this
 *  (dot(pos, flowAxis) > DESPAWN_Z), dispose it. */
export const DESPAWN_Z = 500;
/** Scan range (a hero counts as "visible" inside this flow-axis band). */
export const SCAN_Z_NEAR = -1500;
export const SCAN_Z_FAR = 200;

export interface BodyEntry {
  kind: 'body';
  role: CastRole;
  body: Body;
  /** Own small motion in world/rig-local space, added on top of getFlowW().
   *  Z is stored RELATIVE to the boot cruise flow (old driftSpeed − 14) so
   *  apparent boot motion = flowW + driftW = the v1.0-tuned (vx, vy,
   *  driftSpeed) — parallax preserved, and bodies respond correctly when
   *  flight changes the flow. */
  driftW: THREE.Vector3;
  radius: number;
}

export interface FieldEntry {
  kind: 'field';
  field: AsteroidField;
}

export interface EventEntry {
  kind: 'event';
  event: RareEvent;
  /** Own motion in world/rig-local space, added on top of getFlowW() — same
   *  pattern as BodyEntry.driftW. Events have no lateral own-motion (x=y=0),
   *  just a Z rate stored RELATIVE to the boot cruise flow (old driftSpeed
   *  − CRUISE_SPEED_NEAR) so apparent boot motion = flowW + driftW = the
   *  v1.0-tuned raw driftSpeed exactly, and events respond correctly once
   *  flight changes the flow (was a raw `position.z += driftSpeed*dt`,
   *  ignoring attitude — the v1.1 SOVEREIGN bug this field fixes). */
  driftW: THREE.Vector3;
}

export type CastEntry = BodyEntry | FieldEntry | EventEntry;

// ── Hero / ambient body spawning ─────────────────────────────────────────────────

const HERO_KINDS: BodyKind[] = ['GAS_GIANT', 'ROCKY', 'ICE', 'LAVA', 'RINGED', 'MOON'];
const HERO_WEIGHTS = [34, 22, 14, 10, 14, 6];

const AMBIENT_KINDS: BodyKind[] = ['MOON', 'ROCKY', 'ICE'];
const AMBIENT_WEIGHTS = [55, 30, 15];

/** Pick a hero radius; bigger bodies drift slower (parallax — a giant lingers). */
function heroDriftFor(radius: number, rng: Rng): number {
  // radius 60..140 → driftSpeed 24..9 (linear, inverted), with jitter.
  const tNorm = (radius - 60) / 80; // 0 at 60, 1 at 140
  const base = 24 - tNorm * 15; // 24..9
  return Math.max(9, Math.min(24, base + rng.signed(2)));
}

// ── Flow-axis spawn placement ─────────────────────────────────────────────────
// Spawn/despawn generalize from a fixed +Z band to the current flow axis: an
// orthonormal (u, v) pair perpendicular to flowAxis takes the place of the
// old (X, Y) lateral axes, and `along` (dot along flowAxis) takes the place
// of the old Z. At boot flowAxis=(0,0,1), so u=X̂, v=Ŷ exactly and every
// placement below is byte-identical to the pre-v1.1 fixed-+Z runway.
const _u = new THREE.Vector3();
const _v = new THREE.Vector3();
const _refY = new THREE.Vector3(0, 1, 0);
const _refX = new THREE.Vector3(1, 0, 0);
const _spawnPos = new THREE.Vector3();

/** Rebuild the (_u, _v) basis perpendicular to `axis`. */
function flowBasis(axis: THREE.Vector3): void {
  const ref = Math.abs(axis.y) < 0.99 ? _refY : _refX;
  _u.crossVectors(ref, axis).normalize();
  _v.crossVectors(axis, _u).normalize();
}

/** Compose a spawn position from (lateralU, lateralV, along-flowAxis). At
 *  boot this reduces exactly to (lateralU, lateralV, along). */
function flowPosition(lateralU: number, lateralV: number, along: number): THREE.Vector3 {
  const axis = getFlowAxis();
  flowBasis(axis);
  return _spawnPos
    .copy(_u).multiplyScalar(lateralU)
    .addScaledVector(_v, lateralV)
    .addScaledVector(axis, along);
}

/** Common spawn placement: far fore (along the flow axis), biased off the
 *  canopy centreline in the perpendicular plane. */
function placeSpawn(group: THREE.Group, rng: Rng): void {
  const lateralU = rng.range(-700, 700);
  const lateralV = rng.range(-260, 320);
  const along = rng.range(-1900, -1600);
  group.position.copy(flowPosition(lateralU, lateralV, along));
}

export interface HeroOpts {
  kind?: BodyKind;
  radius?: number;
  /** Explicit world position (else far-fore seeded spawn). */
  at?: THREE.Vector3;
  /** Force a gas-giant hue family (0..3). */
  familyIndex?: number;
  /** Override +Z drift (else radius-derived). Use ~0 to pin a body in place. */
  driftSpeed?: number;
  /** Override lateral/vertical drift (else seeded jitter). */
  vx?: number;
  vy?: number;
  /**
   * Pin the terminator direction for GAS_GIANT/RINGED bodies (0..1 sub-solar U).
   * 0.25 = sub-solar at left quarter → terminator near disc center, lit left limb.
   * Omit for seeded (random) direction used by scheduled/ambient bodies.
   */
  lightU?: number;
}

/** Spawn a hero body (radius 60-140). */
export function spawnHero(rng: Rng, o: HeroOpts = {}): BodyEntry {
  const k = o.kind ?? HERO_KINDS[rng.pick(HERO_WEIGHTS)];
  const r = o.radius ?? rng.range(60, 140);
  const body = createBody(rng, k, r, o.familyIndex, o.lightU);
  if (o.at) body.group.position.copy(o.at);
  else placeSpawn(body.group, rng);
  return {
    kind: 'body',
    role: 'HERO',
    body,
    driftW: new THREE.Vector3(
      o.vx ?? rng.signed(1.4),
      o.vy ?? rng.signed(1.0),
      (o.driftSpeed ?? heroDriftFor(r, rng)) - CRUISE_SPEED_NEAR,
    ),
    radius: r,
  };
}

/**
 * Deterministic, camera-aware opening cast (t=0): (1) a vivid teal gas giant
 * framed left-of-centre in the canopy, clear of the central COCKPIT roundel
 * decal zone, and (2) a ringed giant parked in the starboard porthole's +X
 * sightline. lightU=0.25 pins the terminator (sub-solar at the left quarter)
 * so both are clearly lit from the same seeded direction. Both positions are
 * fixed so the verify screenshots are stable run-to-run — see director.ts's
 * spawnSignatureCast for how this feeds the scheduler.
 */
export function spawnSignatureHeroes(rng: Rng): [BodyEntry, BodyEntry] {
  const canopyHero = spawnHero(rng, {
    kind: 'GAS_GIANT',
    radius: 120,
    familyIndex: 1,
    at: new THREE.Vector3(-165, 30, -710),
    driftSpeed: 6,
    vx: 0,
    vy: 0,
    lightU: 0.25,
  });
  const portholeHero = spawnHero(rng, {
    kind: 'RINGED',
    radius: 80,
    at: new THREE.Vector3(640, 30, -120),
    driftSpeed: 4,
    vx: 0,
    vy: 0,
    lightU: 0.25,
  });
  return [canopyHero, portholeHero];
}

/** Spawn an ambient body (radius 8-40) biased to the window edges. */
export function spawnAmbient(rng: Rng): BodyEntry {
  const k = AMBIENT_KINDS[rng.pick(AMBIENT_WEIGHTS)];
  const r = k === 'MOON' ? rng.range(8, 18) : rng.range(10, 40);
  const body = createBody(rng, k, r);
  // Edge bias: push to large |lateral| so ambients sit at window edges.
  const uEdge = (rng() < 0.5 ? -1 : 1) * rng.range(380, 700);
  const vEdge = rng.range(-260, 320) + (rng() < 0.5 ? -1 : 1) * 120;
  const along = rng.range(-1900, -1600);
  body.group.position.copy(flowPosition(uEdge, vEdge, along));
  return {
    kind: 'body',
    role: 'AMBIENT',
    body,
    driftW: new THREE.Vector3(rng.signed(2.0), rng.signed(1.6), rng.range(14, 24) - CRUISE_SPEED_NEAR),
    radius: r,
  };
}

/** Spawn the asteroid field entry. */
export function spawnField(rng: Rng): FieldEntry {
  return { kind: 'field', field: createAsteroidField(rng) };
}

/** Spawn a rare event of a seeded kind. Places the group far fore (along the
 *  flow axis). */
export function spawnEvent(rng: Rng, kind: EventKind): EventEntry {
  const event = createRareEvent(rng, kind);
  const along = kind === 'NEBULA' ? rng.range(-1900, -1700)
    : kind === 'DERELICT' ? -1200
      : rng.range(-1700, -1500);
  const lateralU = rng.range(-500, 500);
  const lateralV = rng.range(-200, 300);
  event.group.position.copy(flowPosition(lateralU, lateralV, along));
  return {
    kind: 'event',
    event,
    driftW: new THREE.Vector3(0, 0, event.driftSpeed - CRUISE_SPEED_NEAR),
  };
}

// ── Per-tick motion + despawn ─────────────────────────────────────────────────────

const _center = new THREE.Vector3();
const _drift = new THREE.Vector3();

/** Advance one entry; returns true when it has passed the despawn boundary
 *  (dot(pos, flowAxis) > bound — was a raw z comparison). */
export function tickEntry(entry: CastEntry, dt: number): boolean {
  const flowAxis = getFlowAxis();
  if (entry.kind === 'body') {
    const g = entry.body.group;
    // pos += (flowW + driftW) * dt — the shared universe flow plus this
    // body's own small motion.
    _drift.copy(getFlowW()).add(entry.driftW).multiplyScalar(dt);
    g.position.add(_drift);
    entry.body.tick(dt);
    return g.position.dot(flowAxis) > DESPAWN_Z;
  }
  if (entry.kind === 'field') {
    entry.field.tick(dt);
    // Field anchor tracked via instance Z mean is costly; use bounding sphere.
    entry.field.mesh.computeBoundingBox();
    if (entry.field.mesh.boundingBox) {
      entry.field.mesh.boundingBox.getCenter(_center);
      return _center.dot(flowAxis) > DESPAWN_Z;
    }
    return false;
  }
  // event — pos += (flowW + driftW) * dt, same frame-correct pattern as
  // bodies (v1.1 SOVEREIGN fix: was a raw `position.z += driftSpeed*dt`,
  // which ignored attitude and slid the wrong way under a yawed ship).
  const g = entry.event.group;
  _drift.copy(getFlowW()).add(entry.driftW).multiplyScalar(dt);
  g.position.add(_drift);
  entry.event.tick(dt);
  return g.position.dot(flowAxis) > DESPAWN_Z + 200; // nebulae are large; give margin
}

/** Dispose one entry fully (geometry/material/textures). */
export function disposeEntry(entry: CastEntry): void {
  if (entry.kind === 'body') entry.body.dispose();
  else if (entry.kind === 'field') entry.field.dispose();
  else entry.event.dispose();
}

/** Get the entry's container Object3D (for scene add/remove). */
export function entryObject(entry: CastEntry): THREE.Object3D {
  if (entry.kind === 'body') return entry.body.group;
  if (entry.kind === 'field') return entry.field.mesh;
  return entry.event.group;
}

/** A hero body's position projected onto the current flow axis (was a raw
 *  world-space z read) — used for the scan band test in director.ts. */
export function heroFlowPos(entry: BodyEntry): number {
  return entry.body.group.position.dot(getFlowAxis());
}
