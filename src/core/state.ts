/**
 * Ship state — Phase 4 + Phase 5 extensions.
 *
 * Clock rate: 1 real second = 1 ship minute (60x acceleration).
 *   → 8 ship-hours pass in 8 real minutes of idle time.
 *   → Sleep skip: advance ship-minutes by 480 (8h).
 *
 * Decay rates (per real second):
 *   energy: −0.10/s  → drains from 100 to 0 in ~16.7 real minutes
 *   hunger: −0.07/s  → drains from 100 to 0 in ~23.8 real minutes
 * Both are noticeable within a few minutes but not punishing.
 *
 * Phase 5 additions:
 *   - seated / anchorReturn for camera anchor API
 *   - consoleMode for datapad/console overlay
 *   - heading for compass direction
 *   - localStorage save/load for persistence
 */

import * as THREE from 'three';
import type { WorldId } from './worldTypes.js';

export interface AnchorReturn {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}

export interface QuestFlags {
  panelRead: boolean;
  breakerSet: boolean;
  logged: boolean;
}

export interface ShipState {
  /** Ship time in minutes since epoch (0 = midnight ship-day 0). */
  shipMinutes: number;
  /** 0–100, decays over real time. */
  energy: number;
  /** 0–100, decays over real time. */
  hunger: number;
  /** True when the player is sitting in an anchor (seat). */
  seated: boolean;
  /** Camera pose to restore when exiting an anchor. */
  anchorReturn: AnchorReturn | null;
  /** Console/datapad mode: 0=none, 1=datapad, 2=console. */
  consoleMode: 0 | 1 | 2;
  /** Player heading in degrees 0–360. */
  heading: number;
  /** Quest step: 0=not started, 1=investigate breaker, 2=file report, 3=complete. */
  questStep: 0 | 1 | 2 | 3;
  /** Per-step achievement flags. */
  questFlags: QuestFlags;
  /** v1.0 THRESHOLD — codex scan ids collected (creatures + flora/features). */
  codexScans: string[];
  /** v1.0 THRESHOLD — worlds whose hidden relic has been collected. */
  relics: WorldId[];
}

/** Real seconds → ship minutes conversion rate. */
export const SHIP_MINUTES_PER_REAL_SECOND = 1; // 1 real-s = 1 ship-min → 1 real-hr = 1 ship-hr at 60x

const SAVE_KEY = 'starship-save';

/** Serialized subset for localStorage. */
interface SaveData {
  shipMinutes: number;
  energy: number;
  hunger: number;
  questStep?: 0 | 1 | 2 | 3;
  questFlags?: Partial<QuestFlags>;
  codexScans?: string[];
  relics?: WorldId[];
}

const state: ShipState = {
  shipMinutes: 7 * 60, // start at 07:00 ship time
  energy: 80,
  hunger: 70,
  seated: false,
  anchorReturn: null,
  consoleMode: 0,
  heading: 0,
  questStep: 0,
  questFlags: { panelRead: false, breakerSet: false, logged: false },
  codexScans: [],
  relics: [],
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
  return { ...state, anchorReturn: state.anchorReturn };
}

export function setEnergy(v: number): void {
  state.energy = Math.max(0, Math.min(100, v));
}

export function setHunger(v: number): void {
  state.hunger = Math.max(0, Math.min(100, v));
}

/** Set seated state and anchor-return pose. */
export function setSeated(seated: boolean, returnPose?: AnchorReturn): void {
  state.seated = seated;
  state.anchorReturn = returnPose ?? null;
}

/** Set console mode. */
export function setConsoleMode(mode: 0 | 1 | 2): void {
  state.consoleMode = mode;
}

/** Set player heading (0–360 degrees). */
export function setHeading(degrees: number): void {
  state.heading = ((degrees % 360) + 360) % 360;
}

/** Return current quest step. */
export function getQuestStep(): 0 | 1 | 2 | 3 {
  return state.questStep;
}

/** Advance quest to the next step (clamped at 3). */
export function advanceQuest(): void {
  if (state.questStep < 3) state.questStep = (state.questStep + 1) as 0 | 1 | 2 | 3;
}

/** Set a single quest flag. */
export function setQuestFlag(flag: keyof QuestFlags): void {
  state.questFlags[flag] = true;
}

// ── v1.0 THRESHOLD — codex + relics ─────────────────────────────────────────

/**
 * Record a codex scan. Returns false if the id was already known (caller shows
 * a "KNOWN" toast); persists on a fresh scan.
 */
export function recordScan(id: string): boolean {
  if (state.codexScans.includes(id)) return false;
  state.codexScans.push(id);
  saveState();
  return true;
}

/**
 * Collect a world's hidden relic. Returns false if already held; persists on a
 * fresh collect.
 */
export function collectRelic(worldId: WorldId): boolean {
  if (state.relics.includes(worldId)) return false;
  state.relics.push(worldId);
  saveState();
  return true;
}

/** Snapshot of codex/relic progress (copies, safe to hand to test hooks). */
export function getCodex(): { scans: string[]; relics: string[] } {
  return { scans: [...state.codexScans], relics: [...state.relics] };
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

/**
 * Save shipMinutes/energy/hunger to localStorage under key 'starship-save'.
 * Called after interactions that meaningfully change state (sleep, eat).
 */
export function saveState(): void {
  try {
    const data: SaveData = {
      shipMinutes: state.shipMinutes,
      energy: state.energy,
      hunger: state.hunger,
      questStep: state.questStep,
      questFlags: { ...state.questFlags },
      codexScans: [...state.codexScans],
      relics: [...state.relics],
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable in some contexts — silently skip
  }
}

/**
 * Load state from localStorage if a save exists.
 * Returns true if a save was found and applied.
 */
export function loadState(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as Partial<SaveData>;
    if (typeof data.shipMinutes === 'number') state.shipMinutes = data.shipMinutes;
    if (typeof data.energy === 'number') state.energy = Math.max(0, Math.min(100, data.energy));
    if (typeof data.hunger === 'number') state.hunger = Math.max(0, Math.min(100, data.hunger));
    if (data.questStep === 0 || data.questStep === 1 || data.questStep === 2 || data.questStep === 3) {
      state.questStep = data.questStep;
    }
    if (data.questFlags) {
      if (typeof data.questFlags.panelRead === 'boolean')  state.questFlags.panelRead  = data.questFlags.panelRead;
      if (typeof data.questFlags.breakerSet === 'boolean') state.questFlags.breakerSet = data.questFlags.breakerSet;
      if (typeof data.questFlags.logged === 'boolean')     state.questFlags.logged     = data.questFlags.logged;
    }
    if (Array.isArray(data.codexScans)) {
      state.codexScans = data.codexScans.filter((s): s is string => typeof s === 'string');
    }
    if (Array.isArray(data.relics)) {
      const valid: WorldId[] = ['ship', 'verdant', 'ashfall', 'rift', 'landfall']; // v1.2 LANDFALL Stage 1
      state.relics = data.relics.filter((w): w is WorldId => valid.includes(w as WorldId));
    }
    return true;
  } catch {
    return false;
  }
}
