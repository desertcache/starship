/**
 * Ship state — Phase 4.
 *
 * Clock rate: 1 real second = 1 ship minute (60x acceleration).
 *   → 8 ship-hours pass in 8 real minutes of idle time.
 *   → Sleep skip: advance ship-minutes by 480 (8h).
 *
 * Decay rates (per real second):
 *   energy: −0.10/s  → drains from 100 to 0 in ~16.7 real minutes
 *   hunger: −0.07/s  → drains from 100 to 0 in ~23.8 real minutes
 * Both are noticeable within a few minutes but not punishing.
 */

export interface ShipState {
  /** Ship time in minutes since epoch (0 = midnight ship-day 0). */
  shipMinutes: number;
  /** 0–100, decays over real time. */
  energy: number;
  /** 0–100, decays over real time. */
  hunger: number;
}

/** Real seconds → ship minutes conversion rate. */
export const SHIP_MINUTES_PER_REAL_SECOND = 1; // 1 real-s = 1 ship-min → 1 real-hr = 1 ship-hr at 60x

const state: ShipState = {
  shipMinutes: 7 * 60, // start at 07:00 ship time
  energy: 80,
  hunger: 70,
};

const ENERGY_DECAY = 0.10; // per real second
const HUNGER_DECAY = 0.07; // per real second

/** Advance state by a real-time delta (seconds). Called each frame. */
export function tickState(dtSeconds: number): void {
  state.shipMinutes += dtSeconds * SHIP_MINUTES_PER_REAL_SECOND;
  state.energy = Math.max(0, state.energy - ENERGY_DECAY * dtSeconds);
  state.hunger = Math.max(0, state.hunger - HUNGER_DECAY * dtSeconds);
}

/** Advance ship clock by `minutes` ship-minutes (does NOT affect decay). */
export function advanceShipClock(minutes: number): void {
  state.shipMinutes += minutes;
}

export function getState(): ShipState {
  return { ...state };
}

export function setEnergy(v: number): void {
  state.energy = Math.max(0, Math.min(100, v));
}

export function setHunger(v: number): void {
  state.hunger = Math.max(0, Math.min(100, v));
}

/** Format ship-minutes as "DD:HH:MM" clock string. */
export function formatShipClock(minutes: number): string {
  const totalMin = Math.floor(minutes) % (24 * 60 * 100); // wrap after 100 days
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  return `${hh}:${mm}`;
}
