/**
 * src/flight/flightTuning.ts — EVERY tunable constant for the v1.1 SOVEREIGN
 * flight model (design doc §9, seeded from docs/research-flight.md). Feel
 * tuning happens ONLY in this file (Stage 5 owns the pass); every other file
 * imports from here rather than inlining a number.
 */

/** research-flight.md §2.1 — keyboard input smoothing, window 10-15. */
export const INPUT_SMOOTH_LAMBDA = 12;

/** research-flight.md §2.2 — angular velocity damp toward input×maxRate, window 6-10. */
export const ROT_LAMBDA = 8;

/** research-flight.md §2.3 — asymmetric max rates ON PURPOSE (reads aircraft-like). */
export const MAX_PITCH_RATE = 2.2; // rad/s
export const MAX_YAW_RATE = 1.2; // rad/s — always slower than pitch
export const MAX_ROLL_RATE = 3.2; // rad/s

/** research-flight.md §2.4 — auto-bank into yaw: targetRoll = -yawInput × this, blend λ below. */
export const AUTO_BANK_DEG = 35;
export const AUTO_BANK_LAMBDA = 6;

/** design doc §9 — boot throttle 0.35 → 14 u/s == v1.0's byte-compatible +Z stream speed. */
export const MAX_SPEED_CRUISE = 40; // u/s
export const BOOT_THROTTLE = 0.35;

/** design doc §9 — boost multiplier; boost max speed = 40 × 2.5 = 100 u/s. */
export const BOOST_MULT = 2.5;

/** research-flight.md §3 — asymmetric speed-approach λ (satisfying coast on decel). */
export const ACCEL_LAMBDA = 2.0;
export const DECEL_LAMBDA = 1.0;

/** research-flight.md §3 — lateral bleed ("drift through the turn"), velocity direction → nose. */
export const LATERAL_BLEED_LAMBDA = 3;

/** research-flight.md §4 — chase cam lag; rotation MUST lag slower than position (D4). */
export const CAM_POS_LAMBDA = 6;
export const CAM_ROT_LAMBDA = 3;

/** design doc §4 — chase arm offset (ship-frame-ish units, ~50m hull); behind = +Z (nose is -Z). */
export const CHASE_ARM: readonly [number, number, number] = [0, 10, 40];
/** design doc §4 — arm stretches +25% at max speed, λ below. */
export const CHASE_ARM_BOOST_MULT = 1.25;
export const CHASE_ARM_LAMBDA = 2.5;

/** design doc §4 — look-at lead point on the nose axis, ship low in frame. */
export const LEAD_DIST = 25;
export const LEAD_Y = 2;

/** design doc §4 / research-flight.md §4 — chase FOV; widen faster than narrow. */
export const CHASE_FOV_BASE = 62; // degrees
export const CHASE_FOV_BOOST = 16; // degrees, via smoothstep(0.4,1.0,speed/max)
export const CHASE_FOV_WIDEN_LAMBDA = 4;
export const CHASE_FOV_NARROW_LAMBDA = 2.5;

/** design doc §9 — half-strength interior FOV boost while piloting from the helm seat. */
export const HELM_FOV_BOOST = 8; // degrees

/** research-flight.md §5 — trauma spike on boost engage (continuous term is 0.3×smoothstep). */
export const TRAUMA_BOOST_SPIKE = 0.55;

/** research-flight.md §5 — max shake angles; Perlin noise 15-25Hz, seeds n / n+1 / n+2. */
export const SHAKE_MAX_DEG_PITCH_YAW = 1.5;
export const SHAKE_MAX_DEG_ROLL = 2.5;

/** research-flight.md §6 — streak onset 40-50% of max cruise (streaks at cruise read as a bug). */
export const STREAK_THRESHOLD = 0.45; // × max speed
export const STREAK_MAX_LEN = 30; // units
export const STREAK_BRIGHTNESS_BOOST = 0.4; // +40%

/** design doc §8.1 — fixed render distance for scaled bodies (never exceeded). */
export const PARK_DIST = 1500;

/** research-flight.md §8.2 — arrival-time-normalized approach; speed clamped [min,max] u/s true. */
export const APPROACH_T_ARRIVE = 12; // seconds
export const APPROACH_SPEED_MIN = 20; // u/s true
export const APPROACH_SPEED_MAX = 4000; // u/s true

/** design doc §5 — HOLD trigger (× vertical FOV) + release hysteresis fraction. */
export const HOLD_ANGULAR_FRAC = 0.65;
export const HOLD_RELEASE_FRAC = 0.5;

/** design doc §5 — signature destination planet: deterministic seed, scaled per D5. */
export const DEST_TRUE_RADIUS = 4000; // units
export const DEST_TRUE_DIST = 90000; // units
