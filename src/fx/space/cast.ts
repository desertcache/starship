/**
 * Cast entries — the rolling streaming cast of bodies/asteroids/events.
 *
 * Each entry wraps a spawned thing with its own +Z world velocity (independent
 * of the star uScroll, for simpler per-body parallax and disposal) plus slow
 * lateral/vertical drift so its bearing changes as it crosses the windows.
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

export type CastRole = 'HERO' | 'AMBIENT';

/** Despawn aft boundary — once an entry's anchor passes this, dispose it. */
export const DESPAWN_Z = 500;
/** Scan range (a hero counts as "visible" inside this z band). */
export const SCAN_Z_NEAR = -1500;
export const SCAN_Z_FAR = 200;

export interface BodyEntry {
  kind: 'body';
  role: CastRole;
  body: Body;
  /** Local-space lateral/vertical drift velocity (m/s). */
  vx: number;
  vy: number;
  /** +Z world drift speed (m/s). */
  driftSpeed: number;
  radius: number;
}

export interface FieldEntry {
  kind: 'field';
  field: AsteroidField;
}

export interface EventEntry {
  kind: 'event';
  event: RareEvent;
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

/** Common spawn placement: far fore, biased off the canopy centreline. */
function placeSpawn(group: THREE.Group, rng: Rng): void {
  group.position.set(
    rng.range(-700, 700),
    rng.range(-260, 320),
    rng.range(-1900, -1600),
  );
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
    vx: o.vx ?? rng.signed(1.4),
    vy: o.vy ?? rng.signed(1.0),
    driftSpeed: o.driftSpeed ?? heroDriftFor(r, rng),
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
  // Edge bias: push to large |X|/|Y| so ambients sit at window edges.
  const xEdge = (rng() < 0.5 ? -1 : 1) * rng.range(380, 700);
  const yEdge = rng.range(-260, 320) + (rng() < 0.5 ? -1 : 1) * 120;
  body.group.position.set(xEdge, yEdge, rng.range(-1900, -1600));
  return {
    kind: 'body',
    role: 'AMBIENT',
    body,
    vx: rng.signed(2.0),
    vy: rng.signed(1.6),
    driftSpeed: rng.range(14, 24),
    radius: r,
  };
}

/** Spawn the asteroid field entry. */
export function spawnField(rng: Rng): FieldEntry {
  return { kind: 'field', field: createAsteroidField(rng) };
}

/** Spawn a rare event of a seeded kind. Places the group far fore. */
export function spawnEvent(rng: Rng, kind: EventKind): EventEntry {
  const event = createRareEvent(rng, kind);
  const z = kind === 'NEBULA' ? rng.range(-1900, -1700)
    : kind === 'DERELICT' ? -1200
      : rng.range(-1700, -1500);
  event.group.position.set(rng.range(-500, 500), rng.range(-200, 300), z);
  return { kind: 'event', event };
}

// ── Per-tick motion + despawn ─────────────────────────────────────────────────────

const _center = new THREE.Vector3();

/** Advance one entry; returns true when it has passed the despawn boundary. */
export function tickEntry(entry: CastEntry, dt: number): boolean {
  if (entry.kind === 'body') {
    const g = entry.body.group;
    g.position.z += entry.driftSpeed * dt;
    g.position.x += entry.vx * dt;
    g.position.y += entry.vy * dt;
    entry.body.tick(dt);
    return g.position.z > DESPAWN_Z;
  }
  if (entry.kind === 'field') {
    entry.field.tick(dt);
    // Field anchor tracked via instance Z mean is costly; use bounding sphere.
    entry.field.mesh.computeBoundingBox();
    if (entry.field.mesh.boundingBox) {
      entry.field.mesh.boundingBox.getCenter(_center);
      return _center.z > DESPAWN_Z;
    }
    return false;
  }
  // event
  const g = entry.event.group;
  g.position.z += entry.event.driftSpeed * dt;
  entry.event.tick(dt);
  return g.position.z > DESPAWN_Z + 200; // nebulae are large; give margin
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

/** World-space centre of a hero body's group (for scan distance). */
export function heroWorldZ(entry: BodyEntry): number {
  return entry.body.group.position.z;
}
