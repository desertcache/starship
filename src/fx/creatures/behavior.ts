/**
 * src/fx/creatures/behavior.ts — steering FSM (research doc §4).
 *
 * States: IDLE (stand + breathing + occasional glance) / WANDER (continuous-
 * noise wander + 3-rule herd for count>1, plain O(n²)) / FLEE (skittish, player
 * within ~6m, smooth exp-falloff blend + sprint) / CURIOUS (approach to ~3m,
 * hold with head-tracking, retreat if the player advances).
 *
 * All six anti-jitter levers: (1) C1-continuous noise wander with (6) a
 * PER-AGENT SEED, (2) maxForce ≪ maxSpeed, (3) dead zone, (4) exponential
 * drag, (5) 1/d² separation. Integration is in FORCE space — velocity is
 * never set directly. Roam containment is a soft steer-back, not a wall.
 *
 * Gliders are path-driven (lemniscate in animate.ts) and skip steering; their
 * FSM stays in WANDER permanently. Startle (livingness T3) fires ONLY on the
 * (IDLE|WANDER|CURIOUS)→FLEE edge — fleeing is player-caused by construction,
 * so idle screenshots stay deterministic.
 */

import * as THREE from 'three';
import type { CreatureSpec } from '../../core/worldTypes.js';
import { limit, noise1 } from './math.js';
import type { CreatureInstance, SteerCfg } from './rig.js';

// FSM tuning (shared across species; speeds/forces come from SteerCfg).
const FLEE_RADIUS = 6;        // player proximity that spooks a skittish agent
const FLEE_EXIT = 10.5;       // hysteresis: calm down beyond this
const CURIOUS_RADIUS = 8;     // curious agents notice the player here
const CURIOUS_HOLD = 3;       // approach-and-hold distance
const CURIOUS_RETREAT = 2.1;  // player pushing closer → back away
const CURIOUS_EXIT = 10.5;
const SPRINT_MUL = 1.7;       // FLEE speed/force multiplier
const STARTLE_S = 0.6;        // startle-flash duration (seconds)

/** Derive the steering config for a species (once per species, at spawn). */
export function makeSteerCfg(spec: CreatureSpec): SteerCfg {
  const S = spec.sizeM;
  let maxSpeed: number;
  let wanderFreq: number;
  switch (spec.plan) {
    case 'quadruped': maxSpeed = 0.9 * S; wanderFreq = 0.13; break;
    case 'skitterer': maxSpeed = 1.5 * S; wanderFreq = 0.3; break;
    case 'floater': maxSpeed = 0.35; wanderFreq = 0.08; break;
    case 'glider': maxSpeed = 2.4; wanderFreq = 0.1; break;
  }
  const maxForce = maxSpeed * 0.55; // lever 2: force ≪ speed
  return {
    maxSpeed, maxForce, wanderFreq,
    wanderStrength: maxForce * 0.85,
    neighborR: Math.max(4, S * 4),
    wCohesion: 0.25, wAlign: 0.5, wSeparation: 1.3,
    fleeRange: 4,
    drag: 0.9, deadZone: 0.015,
  };
}

const _steer = new THREE.Vector3();
const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _coh = new THREE.Vector3();
const _ali = new THREE.Vector3();
const _sep = new THREE.Vector3();

/** Planar distance from a creature to the player. */
function planarDist(c: CreatureInstance, p: THREE.Vector3): number {
  return Math.hypot(p.x - c.pos.x, p.z - c.pos.z);
}

/** Seeded state duration: deterministic, per-agent, time-keyed. */
function stateDur(c: CreatureInstance, t: number, lo: number, hi: number): number {
  return lo + (0.5 + 0.5 * noise1(c.seed * 0.37 + t * 0.7)) * (hi - lo);
}

function enterFlee(c: CreatureInstance): void {
  if (c.fsm !== 'FLEE') c.startle = STARTLE_S; // T3: player-caused, edge-only
  c.fsm = 'FLEE';
}

/** FSM transitions. Placid never flees nor approaches. */
function transition(c: CreatureInstance, dPlayer: number, t: number): void {
  const temper = c.temperament;
  switch (c.fsm) {
    case 'IDLE':
    case 'WANDER':
      if (temper === 'skittish' && dPlayer < FLEE_RADIUS) { enterFlee(c); return; }
      if (temper === 'curious' && dPlayer < CURIOUS_RADIUS) { c.fsm = 'CURIOUS'; return; }
      if (c.fsmTimer <= 0) {
        if (c.fsm === 'IDLE') { c.fsm = 'WANDER'; c.fsmTimer = stateDur(c, t, 7, 16); }
        else { c.fsm = 'IDLE'; c.fsmTimer = stateDur(c, t, 2.5, 5.5); }
      }
      return;
    case 'FLEE':
      if (dPlayer > FLEE_EXIT) { c.fsm = 'WANDER'; c.fsmTimer = stateDur(c, t, 7, 16); }
      return;
    case 'CURIOUS':
      if (temper === 'skittish' && dPlayer < FLEE_RADIUS) { enterFlee(c); return; }
      if (dPlayer > CURIOUS_EXIT) { c.fsm = 'WANDER'; c.fsmTimer = stateDur(c, t, 7, 16); }
      return;
  }
}

/** 3-rule herd over flockmates. n ≤ ~6 → plain O(n²), no spatial hash. */
function herd(c: CreatureInstance, flock: CreatureInstance[], r: number): void {
  _coh.set(0, 0, 0); _ali.set(0, 0, 0); _sep.set(0, 0, 0);
  let n = 0;
  for (const o of flock) {
    if (o === c) continue;
    const d = Math.hypot(o.pos.x - c.pos.x, o.pos.z - c.pos.z);
    if (d > r || d < 1e-5) continue;
    _coh.x += o.pos.x; _coh.z += o.pos.z;
    _ali.x += o.vel.x; _ali.z += o.vel.z;
    // lever 5: smooth 1/d² separation — no cutoff pop
    _sep.x += (c.pos.x - o.pos.x) / (d * d);
    _sep.z += (c.pos.z - o.pos.z) / (d * d);
    n++;
  }
  if (n > 0) {
    _coh.multiplyScalar(1 / n); _coh.x -= c.pos.x; _coh.z -= c.pos.z; _coh.y = 0;
    _ali.multiplyScalar(1 / n);
  }
}

/**
 * One behavior tick: transitions + force-space steering + planar integration.
 * Writes c.vel / c.pos (XZ), c.fsm, c.startle, c.lookTarget. Vertical placement
 * and body pose are animate.ts's job.
 */
export function updateBehavior(
  c: CreatureInstance,
  flock: CreatureInstance[],
  playerPos: THREE.Vector3,
  t: number,
  dt: number,
): void {
  c.startle = Math.max(0, c.startle - dt);
  const headY = c.root.position.y + c.rig.standH + c.spec.sizeM * 0.25;

  if (c.rig.plan === 'glider') {
    // Path-driven: no steering. Gaze tracks the path ahead.
    c.lookTarget.set(c.pos.x + c.vel.x, c.pos.y + c.vel.y, c.pos.z + c.vel.z);
    return;
  }

  const dPlayer = planarDist(c, playerPos);
  c.fsmTimer -= dt;
  transition(c, dPlayer, t);

  const cfg = c.cfg;
  const sprint = c.fsm === 'FLEE' ? SPRINT_MUL : 1;
  _steer.set(0, 0, 0);

  // WANDER force: continuous noise (lever 1) with per-agent seed (lever 6).
  if (c.fsm === 'WANDER' || c.fsm === 'FLEE') {
    const f = cfg.wanderFreq * (c.fsm === 'FLEE' ? 2 : 1);
    _steer.x += noise1(t * f + c.seed) * cfg.wanderStrength;
    _steer.z += noise1(t * f + c.seed + 100) * cfg.wanderStrength;
  }

  // Herd cohesion/alignment/separation (count>1). Separation stays on in every
  // state so herdmates never interpenetrate while idling.
  if (flock.length > 1) {
    herd(c, flock, cfg.neighborR);
    if (c.fsm === 'WANDER' || c.fsm === 'FLEE') {
      _steer.addScaledVector(_coh, cfg.wCohesion);
      _steer.addScaledVector(_ali, cfg.wAlign);
    }
    _steer.addScaledVector(_sep, cfg.wSeparation);
  }

  // FLEE: smooth exp-falloff blend (never a hard switch), away from the player.
  if (c.fsm === 'FLEE') {
    const w = Math.exp(-dPlayer / cfg.fleeRange);
    _v.set(c.pos.x - playerPos.x, 0, c.pos.z - playerPos.z)
      .setLength(cfg.maxSpeed * sprint)
      .sub(_v2.set(c.vel.x, 0, c.vel.z));
    _steer.addScaledVector(_v, 2.5 * Math.max(w, 0.25));
  }

  // CURIOUS: arrive at a hold ring ~3m from the player; back off if crowded.
  if (c.fsm === 'CURIOUS') {
    const hold = dPlayer < CURIOUS_RETREAT ? CURIOUS_HOLD + 1.5 : CURIOUS_HOLD;
    const err = dPlayer - hold;                    // + approach / − retreat
    const dirX = (playerPos.x - c.pos.x) / Math.max(dPlayer, 1e-4);
    const dirZ = (playerPos.z - c.pos.z) / Math.max(dPlayer, 1e-4);
    const speed = THREE.MathUtils.clamp(err * 0.8, -cfg.maxSpeed, cfg.maxSpeed);
    _v.set(dirX * speed - c.vel.x, 0, dirZ * speed - c.vel.z);
    _steer.addScaledVector(_v, 1.2);
  }

  // Soft roam containment: steer-back grows with overflow past roamRadius.
  const dc = Math.hypot(c.pos.x - c.center.x, c.pos.z - c.center.z);
  if (dc > c.roamRadius) {
    const over = (dc - c.roamRadius) / c.roamRadius;
    _v.set(c.center.x - c.pos.x, 0, c.center.z - c.pos.z)
      .setLength(cfg.maxSpeed).sub(_v2.set(c.vel.x, 0, c.vel.z));
    _steer.addScaledVector(_v, Math.min(2, over * 2.5));
  }

  // Force-space integration with levers 2/3/4.
  _steer.y = 0;
  limit(_steer, cfg.maxForce * sprint);
  if (_steer.lengthSq() < cfg.deadZone * cfg.deadZone) _steer.set(0, 0, 0);
  c.vel.x += _steer.x * dt;
  c.vel.z += _steer.z * dt;
  const dragK = Math.exp(-cfg.drag * dt);
  c.vel.x *= dragK; c.vel.z *= dragK;
  _v.set(c.vel.x, 0, c.vel.z);
  limit(_v, cfg.maxSpeed * sprint);
  c.vel.x = _v.x; c.vel.z = _v.z;
  c.pos.x += c.vel.x * dt;
  c.pos.z += c.vel.z * dt;

  // Gaze: IDLE glances (noise-driven, occasionally the player), WANDER/FLEE
  // look along travel, CURIOUS locks onto the player (head-tracking hold).
  if (c.fsm === 'CURIOUS' || (c.fsm === 'IDLE' && dPlayer < 7)) {
    c.lookTarget.set(playerPos.x, playerPos.y, playerPos.z);
  } else if (c.fsm === 'IDLE') {
    const a = c.yaw + noise1(t * 0.23 + c.seed * 1.7) * 1.2;
    c.lookTarget.set(c.pos.x + Math.sin(a) * 3, headY + noise1(t * 0.17 + c.seed) * 0.5, c.pos.z + Math.cos(a) * 3);
  } else {
    const sp = Math.max(Math.hypot(c.vel.x, c.vel.z), 0.2);
    c.lookTarget.set(c.pos.x + (c.vel.x / sp) * 3, headY, c.pos.z + (c.vel.z / sp) * 3);
  }
}
