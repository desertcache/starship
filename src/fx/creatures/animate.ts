/**
 * src/fx/creatures/animate.ts — procedural pose layer (no SkinnedMesh, no
 * AnimationMixer, no clips). Implements docs/research-creatures.md:
 *
 *  - DISTANCE-DRIVEN gait phase (advancePhase by speed·dt/strideLength) — the
 *    anti-foot-skate mechanism: one leg cycle per stride-length covered.
 *  - footTarget stance/swing + analytic 2-bone IK per leg (hip/knee pitch).
 *  - Terrain-fit: body height + pitch/roll from the ground normal averaged at
 *    the feet. GRADIENT NOTE: the frozen World contract exposes only
 *    groundHeight(x,z) — no analytic gradient — so per the research doc's
 *    sanctioned fallback we wrap it with central differences at FIXED ε=0.15.
 *  - Spine bob 2×/stride vertical + 1× lateral sway, head look-at with damp
 *    lag + cone clamp, speed→0 neutral-stand blend (no statue-with-leg-up).
 *  - Jelly: ASYMMETRIC bell pulse (fast contract 30%, slow relax), thrust only
 *    while contracting, exp drag, buoyancy hover band above the ground.
 *  - Glider: Lemniscate of Gerono path, analytic velocity → orientation basis,
 *    bank ∝ turnRate×speed, slow wing flap with spanwise lag.
 */

import * as THREE from 'three';
import { angleDelta, damp, dampAngle, noise1 } from './math.js';
import type { CreatureInstance, GaitParams, LegRig } from './rig.js';

export type GroundFn = (x: number, z: number) => number;

/** Central-difference ε for the terrain gradient fallback (see header note). */
const GRAD_EPS = 0.15;

const _n = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _up = new THREE.Vector3();
const _right = new THREE.Vector3();
const _m4 = new THREE.Matrix4();

// ── Gait primitives (research doc §1) ────────────────────────────────────────

export function strideLength(speed: number, p: GaitParams): number {
  return Math.min(p.strideMax, p.strideMin + p.strideGain * speed);
}

export function advancePhase(phase: number, speed: number, dt: number, p: GaitParams): number {
  return (phase + (speed * dt) / strideLength(speed, p)) % 1;
}

/** Stance drag-back / swing arc → [forwardOffset, lift]. */
function footTarget(legPhase: number, L: number, p: GaitParams): [number, number] {
  const s = ((legPhase % 1) + 1) % 1;
  if (s < p.duty) {
    const u = s / p.duty;
    return [L * (0.5 - u), 0]; // STANCE: sweeps back exactly as body advances
  }
  const u = (s - p.duty) / (1 - p.duty); // SWING
  return [L * (-0.5 + u), p.stepHeight * Math.sin(Math.PI * u)];
}

const clamp1 = (v: number): number => Math.min(1, Math.max(-1, v));

/**
 * Analytic 2-bone IK in the leg's sagittal (Y-Z) plane. Target (fz, fy) is in
 * hip space: fz forward (+Z), fy down (negative). Writes hip/knee pitch.
 * kneeSign picks the fold direction (front legs fold forward, hind back).
 */
function solveLeg(leg: LegRig, fz: number, fy: number): void {
  const u = leg.upper, l = leg.lower;
  const d = Math.min(Math.hypot(fz, fy), u + l - 1e-3);
  const phi = Math.atan2(fz, -fy); // angle from straight-down toward forward
  const alpha = Math.acos(clamp1((u * u + d * d - l * l) / (2 * u * d)));
  const gamma = Math.acos(clamp1((u * u + l * l - d * d) / (2 * u * l)));
  leg.hip.rotation.x = -(phi + leg.kneeSign * alpha);
  leg.knee.rotation.x = leg.kneeSign * (Math.PI - gamma);
}

/** Ground normal via central differences at fixed ε (documented fallback). */
function groundNormal(g: GroundFn, x: number, z: number, out: THREE.Vector3): THREE.Vector3 {
  const gx = (g(x + GRAD_EPS, z) - g(x - GRAD_EPS, z)) / (2 * GRAD_EPS);
  const gz = (g(x, z + GRAD_EPS) - g(x, z - GRAD_EPS)) / (2 * GRAD_EPS);
  return out.set(-gx, 1, -gz).normalize();
}

// ── Legged plans (quadruped + skitterer) ─────────────────────────────────────

export function animateLegged(c: CreatureInstance, t: number, dt: number, g: GroundFn): void {
  const rig = c.rig;
  const speed = Math.hypot(c.vel.x, c.vel.z);
  const S = c.spec.sizeM;

  // Gait phase from DISTANCE MOVED (research doc: the anti-foot-skate trick).
  c.phase = advancePhase(c.phase, speed, dt, rig.gait);

  // speed→0 risk radar: blend legs toward neutral stand below a speed floor.
  c.legBlend = damp(c.legBlend, speed > 0.1 ? 1 : 0, 6, dt);

  // Yaw: orient to velocity through a damped lag — never instantly.
  if (speed > 0.05) c.yaw = dampAngle(c.yaw, Math.atan2(c.vel.x, c.vel.z), 4, dt);
  c.root.rotation.y = c.yaw;

  // Terrain fit: mean foot height + normal averaged over the hip anchors.
  const sinY = Math.sin(c.yaw), cosY = Math.cos(c.yaw);
  let groundY = 0;
  _n.set(0, 0, 0);
  const footG: number[] = [];
  for (const leg of rig.legs) {
    const hl = leg.hip.position;
    const wx = c.pos.x + hl.x * cosY + hl.z * sinY;
    const wz = c.pos.z - hl.x * sinY + hl.z * cosY;
    const gy = g(wx, wz);
    footG.push(gy);
    groundY += gy;
    _n.add(groundNormal(g, wx, wz, _up));
  }
  groundY /= rig.legs.length;
  _n.normalize();

  // Root rides the (springed) ground; body carries tilt + bob above it.
  c.baseY = damp(c.baseY, groundY, 8, dt);
  c.root.position.set(c.pos.x, c.baseY, c.pos.z);

  // Normal → yaw frame → damped pitch/roll (ridge crests ease in).
  const nx = _n.x * cosY - _n.z * sinY;
  const nz = _n.x * sinY + _n.z * cosY;
  c.pitch = damp(c.pitch, Math.atan2(nz, _n.y), 5, dt);
  c.roll = damp(c.roll, -Math.atan2(nx, _n.y), 5, dt);

  // Spine bob: 2× vertical per stride, 1× lateral sway, gait-coupled; plus a
  // slow breathing bob that takes over as legBlend → 0 (idle).
  const p2 = c.phase * Math.PI * 2;
  const amp = rig.gait.stepHeight * 0.16 * c.legBlend;
  const sway = rig.gait.stepHeight * 0.1 * c.legBlend;
  const breathe = S * 0.008 * (1 - c.legBlend) * Math.sin(t * 1.7 + c.bobPhase);
  rig.body.position.y = rig.standH + amp * Math.sin(2 * p2) + breathe;
  rig.body.position.x = 0.5 * sway * Math.cos(p2);
  rig.body.rotation.set(c.pitch, 0, c.roll + sway * 2 * Math.sin(p2));

  // Legs: blended neutral↔gait IK targets, per-foot terrain offset.
  const L = strideLength(speed, rig.gait);
  for (let i = 0; i < rig.legs.length; i++) {
    const leg = rig.legs[i];
    const [off, lift] = footTarget(c.phase + leg.phase, L, rig.gait);
    const dg = footG[i] - groundY; // per-foot ground delta (slopes)
    const fz = off * c.legBlend;
    const fy = -(leg.reach - lift * c.legBlend) + dg;
    solveLeg(leg, fz, Math.min(fy, -0.15 * leg.reach));
  }

  // Head look-at: smooth the TARGET POINT (attention lag), cone-clamp.
  if (rig.head) {
    c.headLook.x = damp(c.headLook.x, c.lookTarget.x, 3, dt);
    c.headLook.y = damp(c.headLook.y, c.lookTarget.y, 3, dt);
    c.headLook.z = damp(c.headLook.z, c.lookTarget.z, 3, dt);
    rig.head.lookAt(c.headLook);
    rig.head.rotation.y = THREE.MathUtils.clamp(rig.head.rotation.y, -1.0, 1.0);
    rig.head.rotation.x = THREE.MathUtils.clamp(rig.head.rotation.x, -0.5, 0.5);
    rig.head.rotation.z = 0;
  }
}

// ── Floater (jelly) ──────────────────────────────────────────────────────────

/** Asymmetric pulse: fast contract (30% of cycle), slow relax. 0 open → 1 contracted. */
function bellPulse(phase: number): number {
  const s = ((phase % 1) + 1) % 1;
  const ss = (v: number): number => v * v * (3 - 2 * v);
  const contract = 0.3;
  return s < contract ? ss(s / contract) : 1 - ss((s - contract) / (1 - contract));
}

export function animateFloater(c: CreatureInstance, t: number, dt: number, g: GroundFn): void {
  const rig = c.rig;
  // Pulse phase is TIME-driven (medusae pulse at rest); gaitHz = pulse rate.
  c.phase = (c.phase + c.spec.gaitHz * dt) % 1;
  const cNow = bellPulse(c.phase);
  const dc = (cNow - c.jellyCPrev) / Math.max(dt, 1e-4);
  c.jellyCPrev = cNow;

  // Vertical physics: thrust ONLY while contracting, exp drag, buoyancy that
  // seeks a per-creature hover band (2-5m over ground; seeded base + slow bob).
  const gy = g(c.pos.x, c.pos.z);
  const hoverY = gy + c.baseY + 0.4 * noise1(t * 0.11 + c.seed);
  const thrust = 1.1 * c.spec.sizeM;
  c.jellyVelY += (Math.max(0, dc) * thrust + (hoverY - c.pos.y) * 0.35) * dt;
  c.jellyVelY *= Math.exp(-0.8 * dt);
  c.pos.y = THREE.MathUtils.clamp(c.pos.y + c.jellyVelY * dt, gy + 1.2, gy + 6.5);
  c.root.position.copy(c.pos);

  // Slow heading drift so the whole animal isn't axis-locked.
  c.yaw = dampAngle(c.yaw, noise1(t * 0.05 + c.seed + 31) * Math.PI, 0.5, dt);
  c.root.rotation.y = c.yaw;

  // Squash/stretch: radial in, vertical out while contracted.
  if (rig.bell) {
    const squash = 0.35;
    rig.bell.scale.set(1 - squash * cNow, 1 + 0.6 * squash * cNow, 1 - squash * cNow);
  }
}

// ── Glider (ray) ─────────────────────────────────────────────────────────────

const GLIDE_SPEED = 2.4;       // m/s along the path
const BANK_GAIN = 0.2;         // bank = −gain·turnRate·speed, clamped
const MAX_BANK = 0.6;

/** Lemniscate of Gerono, centred on the spawn center, altitude band 4-8m. */
export function animateGlider(c: CreatureInstance, t: number, dt: number, g: GroundFn): void {
  const rig = c.rig;
  const A = c.roamRadius * 0.85;
  const B = c.roamRadius * 0.8;
  const baseY = g(c.center.x, c.center.z) + 6.0;
  const climb = 1.6;

  // Analytic pos + velocity; advance the parameter at ~constant ground speed.
  const tt = c.glideT;
  const vx = A * Math.cos(tt);
  const vy = 2 * climb * Math.cos(2 * tt);
  const vz = B * Math.cos(2 * tt);
  const vLen = Math.max(0.3, Math.hypot(vx, vy, vz));
  c.glideT = tt + (GLIDE_SPEED / vLen) * dt;

  c.pos.set(
    c.center.x + A * Math.sin(tt),
    baseY + climb * Math.sin(2 * tt),
    c.center.z + (B / 2) * Math.sin(2 * tt),
  );
  c.vel.set(vx, vy, vz).multiplyScalar(GLIDE_SPEED / vLen);
  c.root.position.copy(c.pos);

  // Orientation basis from velocity; bank ∝ turnRate × speed (turnRate =
  // heading-yaw change per second, smoothed with `damp` per the research doc).
  const yawNow = Math.atan2(c.vel.x, c.vel.z);
  const rawRate = angleDelta(c.glidePrevYaw, yawNow) / Math.max(dt, 1e-3);
  c.glideTurn = damp(c.glideTurn, rawRate, 4, dt);
  c.glidePrevYaw = yawNow;

  _fwd.copy(c.vel).normalize();
  const bank = THREE.MathUtils.clamp(-BANK_GAIN * c.glideTurn * GLIDE_SPEED, -MAX_BANK, MAX_BANK);
  _up.set(0, 1, 0).applyAxisAngle(_fwd, bank);
  _right.crossVectors(_fwd, _up).normalize();
  _up.crossVectors(_right, _fwd).normalize();
  c.root.quaternion.setFromRotationMatrix(_m4.makeBasis(_right, _up, _fwd.clone().negate()));
  // Three objects face +Z; the basis above puts -Z forward (camera convention),
  // so flip the body 180° to lead with the nose.
  c.root.rotateY(Math.PI);

  // Wing flap: slow sine ±15°, outer segment lags spanwise (research §3).
  if (rig.wings) {
    const w = t * Math.PI * 2 * c.spec.gaitHz + c.bobPhase;
    const flap = Math.sin(w) * 0.26;
    const flapLag = Math.sin(w - 0.9) * 0.2;
    rig.wings.l.rotation.z = -flap;
    rig.wings.r.rotation.z = flap;
    rig.wings.lOut.rotation.z = -flapLag;
    rig.wings.rOut.rotation.z = flapLag;
  }
}

// ── Livingness: propagating marking wave + startle flash ─────────────────────

const _col = new THREE.Color();
const WHITE = new THREE.Color(1, 1, 1);

/**
 * T1: emissive brightness = f(t − phase(segment)) → the pulse TRAVELS
 * nose→tail (or around the jelly rim). T3: startle flash = ~600ms two-hue
 * burst (species emissive ↔ near-white) with fast decay, per-creature via
 * instanceColor (materials stay shared across the herd).
 */
export function animateMarkings(c: CreatureInstance, t: number): void {
  const mk = c.rig.markings;
  const em = c.rig.emissive;
  const waveT = t * 0.7 + c.seed * 0.13;
  const k = Math.max(0, Math.min(1, c.startle / 0.6)); // startle envelope
  for (let i = 0; i < mk.count; i++) {
    const w = Math.sin((waveT - mk.phases[i]) * Math.PI * 2);
    const pulse = 0.35 + 1.5 * Math.max(0, w) * Math.max(0, w);
    _col.copy(em).multiplyScalar(pulse);
    if (k > 0) {
      const flick = 0.5 + 0.5 * Math.sin(t * 42 + i * 1.7); // two-hue strobe
      _col.lerp(WHITE, k * flick);
      _col.multiplyScalar(1 + 2.5 * k);
    }
    mk.mesh.setColorAt(i, _col);
  }
  if (mk.mesh.instanceColor) mk.mesh.instanceColor.needsUpdate = true;
}
