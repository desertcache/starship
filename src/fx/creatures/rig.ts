/**
 * src/fx/creatures/rig.ts — internal creature data model + palette helpers.
 *
 * The BUILDER fills a CreatureRig (handles into a freshly-assembled body); the
 * ANIMATE lane reads/writes it every frame; the FACADE wraps it in a
 * CreatureInstance with the steering Agent + FSM. None of this crosses the
 * frozen public boundary (worldTypes.ts) — it is entirely creature-internal.
 */

import * as THREE from 'three';
import type { BodyPlan, Temperament } from '../../core/worldTypes.js';
import type { Whip } from './math.js';

export interface GaitParams {
  strideMin: number;
  strideMax: number;
  strideGain: number;
  stepHeight: number;
  /** Fraction of the cycle a foot is planted. >0.5 walk/amble, <0.5 run. */
  duty: number;
}

export interface LegRig {
  hip: THREE.Object3D;   // rotates about local X (fore/aft swing)
  knee: THREE.Object3D;  // rotates about local X (bend)
  upper: number;
  lower: number;
  /** Neutral hip-to-ground vertical distance (IK stance target depth). */
  reach: number;
  /** Gait phase offset in [0,1) — the trot/tripod pattern. */
  phase: number;
  /** ±1 — which way the joint folds (front vs hind / left vs right). */
  kneeSign: number;
}

export interface MarkingRig {
  mesh: THREE.InstancedMesh;
  /** Per-instance phase (0..1 along the body) for the propagating glow wave. */
  phases: number[];
  count: number;
}

export interface CreatureRig {
  plan: BodyPlan;
  /** Torso node — bobbed, rolled, terrain-tilted. Child of the named root. */
  body: THREE.Group;
  /** Torso rest height (hip line) above the foot plane. */
  standH: number;
  legs: LegRig[];
  head: THREE.Object3D | null;
  whips: Whip[];
  /** Floater bell (squash/stretch via scale). */
  bell: THREE.Object3D | null;
  /** Glider wing pivots: root flap + outer segment (flaps with spanwise lag). */
  wings: { l: THREE.Object3D; r: THREE.Object3D; lOut: THREE.Object3D; rOut: THREE.Object3D } | null;
  markings: MarkingRig;
  /** Species emissive base colour (marking wave + startle flash key off it). */
  emissive: THREE.Color;
  gait: GaitParams;
}

/** Steering tuning (behavior.ts derives one per species from the spec). */
export interface SteerCfg {
  maxSpeed: number;
  maxForce: number;       // ≪ maxSpeed — anti-jitter lever 2
  wanderFreq: number;
  wanderStrength: number;
  neighborR: number;
  wCohesion: number;
  wAlign: number;
  wSeparation: number;
  fleeRange: number;      // exp-falloff scale for the flee blend
  drag: number;           // anti-jitter lever 4
  deadZone: number;       // anti-jitter lever 3
}

/** One live creature: its body rig + planar steering agent + FSM state. */
export interface CreatureInstance {
  spec: import('../../core/worldTypes.js').CreatureSpec;
  root: THREE.Group;        // named with the interactable id; world planar pos
  rig: CreatureRig;
  ia: import('../../world/types.js').Interactable;
  temperament: Temperament;
  // steering agent (planar)
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  seed: number;
  center: THREE.Vector3;
  roamRadius: number;
  cfg: SteerCfg;
  // animation state
  phase: number;            // distance-driven gait phase [0,1)
  legBlend: number;         // 0 = neutral stand, 1 = full gait (speed→0 guard)
  headLook: THREE.Vector3;  // smoothed head target point (damped, world)
  lookTarget: THREE.Vector3;// desired look point (behavior writes, animate damps)
  yaw: number;              // smoothed body yaw
  pitch: number;            // damped terrain-fit pitch
  roll: number;             // damped terrain-fit roll
  // fsm
  fsm: FsmState;
  fsmTimer: number;
  startle: number;          // remaining startle-flash seconds
  // plan-specific
  jellyVelY: number;
  jellyCPrev: number;
  bobPhase: number;         // idle breathing
  glideT: number;           // lemniscate parameter
  glideTurn: number;        // smoothed turn-rate for bank
  glidePrevYaw: number;
  baseY: number;            // ground/hover reference
}

export type FsmState = 'IDLE' | 'WANDER' | 'FLEE' | 'CURIOUS';

/** Disposal collector — builder pushes every geometry/material it mints. */
export interface Disposables {
  geos: THREE.BufferGeometry[];
  mats: THREE.Material[];
}

/** Parse '#RRGGBB' and clamp every channel to an albedo floor (no void-black). */
export function floorColor(hex: string, floor = 0.05): THREE.Color {
  const c = new THREE.Color(hex);
  c.r = Math.max(floor, c.r);
  c.g = Math.max(floor, c.g);
  c.b = Math.max(floor, c.b);
  return c;
}
