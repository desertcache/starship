/**
 * src/fx/creatures/math.ts — shared, frame-rate-correct motion primitives.
 *
 * Every technique here is lifted verbatim from docs/research-creatures.md so the
 * animate/behavior lanes share ONE correct implementation:
 *  - `damp` / `spring`: variable-dt-stable smoothing (never per-frame lerp).
 *  - `SpringChain` + `Whip`: critically-damped chained spring for tails /
 *    antennae / tentacles / streamers (world-space, whips off a moving anchor).
 *  - `noise1`: C1-continuous value noise for wander headings (cannot jitter).
 *  - vector `limit`, angle helpers.
 *
 * The creatures.group is added to its world scene untransformed (identity), so
 * "group space === world space": Whip runs in world coordinates and its meshes
 * are parented to the identity group, exactly as the research SpringChain assumes.
 */

import * as THREE from 'three';

/** Exponential smoothing toward `b`; stable at any dt. lambda = rate (1/s). */
export function damp(a: number, b: number, lambda: number, dt: number): number {
  return b + (a - b) * Math.exp(-lambda * dt);
}

/**
 * Critically-damped spring, implicit-Euler exact form (GPG4) — unconditionally
 * stable at any dt/omega. omega ≈ 5 / settleTime. Returns [newX, newV].
 */
export function spring(
  x: number, v: number, target: number, omega: number, dt: number,
): [number, number] {
  const f = 1 + 2 * dt * omega;
  const oo = omega * omega;
  const hoo = dt * oo;
  const hhoo = dt * hoo;
  const detInv = 1 / (f + hhoo);
  return [(f * x + dt * v + hhoo * target) * detInv, (v + hoo * (target - x)) * detInv];
}

/** Clamp a vector's magnitude to `m` in place; returns it. */
export function limit(v: THREE.Vector3, m: number): THREE.Vector3 {
  return v.lengthSq() > m * m ? v.setLength(m) : v;
}

/** 32-bit integer hash → [0,1). */
function ihash(i: number): number {
  let h = i | 0;
  h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 3266489917) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967296;
}

/**
 * C1-continuous value noise in [-1, 1] over a 1-D lattice (smoothstep interp).
 * Continuous → smooth → cannot jitter. Deterministic; drive it with
 * `t * freq + agentSeed` for a per-agent wander channel.
 */
export function noise1(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  const a = ihash(i);
  const b = ihash(i + 1);
  return ((a + (b - a) * u) * 2 - 1);
}

/**
 * Critically-damped chained spring. Snappier omega at the base, looser toward
 * the tip, hard length constraint after each solve. Pure world-space positions.
 */
export class SpringChain {
  pos: THREE.Vector3[];
  vel: THREE.Vector3[];
  constructor(public segLen: number, public omega0: number, n: number, root: THREE.Vector3) {
    this.pos = Array.from({ length: n }, () => root.clone());
    this.vel = Array.from({ length: n }, () => new THREE.Vector3());
  }
  update(root: THREE.Vector3, dt: number): void {
    let anchor = root;
    const axes: readonly ('x' | 'y' | 'z')[] = ['x', 'y', 'z'];
    for (let i = 0; i < this.pos.length; i++) {
      const omega = this.omega0 * (1 - 0.5 * i / this.pos.length);
      for (const ax of axes) {
        const [nx, nv] = spring(this.pos[i][ax], this.vel[i][ax], anchor[ax], omega, dt);
        this.pos[i][ax] = nx;
        this.vel[i][ax] = nv;
      }
      const dir = this.pos[i].clone().sub(anchor);
      if (dir.lengthSq() > 1e-8) this.pos[i].copy(anchor).add(dir.setLength(this.segLen));
      anchor = this.pos[i];
    }
  }
}

const _UP = new THREE.Vector3(0, 1, 0);
const _base = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _q = new THREE.Quaternion();

/** Where a Whip renders: contiguous free slots in a species InstancePool. */
export interface WhipSegs {
  pool: import('./pool.js').InstancePool;
  slots: number[];
  /** Per-segment radius (tapers toward the tip). */
  radii: number[];
  segLen: number;
}

/**
 * A springy appendage: a SpringChain plus pooled instance segments that
 * visualise it. Hangs off `anchor` (a node in the creature body) at a fixed
 * local offset and whips as the body moves — all in WORLD space (the creatures
 * group sits at identity). Per-frame micro-noise on the root keeps the tip
 * alive at rest (a perfectly still appendage reads as dead).
 */
export class Whip {
  private chain: SpringChain;
  private noiseSeed: number;
  constructor(
    private anchor: THREE.Object3D,
    private baseLocal: THREE.Vector3,
    private segs: WhipSegs,
    omega0: number,
    noiseSeed: number,
  ) {
    this.anchor.localToWorld(_base.copy(baseLocal));
    this.chain = new SpringChain(segs.segLen, omega0, segs.slots.length, _base);
    this.noiseSeed = noiseSeed;
  }
  /** Assumes the anchor's world matrix is already current this frame. */
  update(t: number, dt: number, jitter: number): void {
    this.anchor.localToWorld(_base.copy(this.baseLocal));
    _base.x += noise1(t * 3.1 + this.noiseSeed) * jitter;
    _base.y += noise1(t * 2.7 + this.noiseSeed + 50) * jitter;
    _base.z += noise1(t * 3.4 + this.noiseSeed + 100) * jitter;
    this.chain.update(_base, dt);
    let prev = _base;
    for (let i = 0; i < this.segs.slots.length; i++) {
      const cur = this.chain.pos[i];
      _mid.copy(prev).add(cur).multiplyScalar(0.5);
      _dir.copy(cur).sub(prev);
      const len = _dir.length();
      if (len > 1e-5) _q.setFromUnitVectors(_UP, _dir.multiplyScalar(1 / len));
      const r = this.segs.radii[i];
      this.segs.pool.setPose(this.segs.slots[i], _mid, _q, r, this.segs.segLen, r);
      prev = cur;
    }
  }
}

/** Blend a → b by t, writing into `out`. */
export function lerpColor(a: THREE.Color, b: THREE.Color, t: number, out: THREE.Color): THREE.Color {
  out.setRGB(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
  return out;
}

/** Shortest-arc signed angle from a to b, in (-π, π]. */
export function angleDelta(a: number, b: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/** `damp` for angles — smooths along the shortest arc (no ±π pop). */
export function dampAngle(a: number, b: number, lambda: number, dt: number): number {
  return a + angleDelta(a, b) * (1 - Math.exp(-lambda * dt));
}
