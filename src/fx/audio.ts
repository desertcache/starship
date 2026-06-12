/**
 * src/fx/audio.ts — Phase 5 WebAudio public API. Zero external files.
 *
 * Node builders live in audioSynth.ts (kept under 300 lines).
 * This file owns: AudioContext bootstrap, room crossfade logic, module state,
 * and the exported AudioSystem singleton.
 *
 * AudioContext starts SUSPENDED — resumes only on first user gesture.
 * All synthesis is safe to omit if ctx is null (headless Playwright).
 */

import {
  RoomBranch,
  MASTER_GAIN, CROSSFADE_MS,
  STEP_INTERVAL_MIN, STEP_INTERVAL_MAX,
  buildEngineHum,
  buildCockpitBed, buildEngineeringBed, buildGalleyBed, buildCorridorBed,
  scheduleStep, playOneShotInternal, buildQuartersPersonality,
} from './audioSynth.js';

// Re-export types callers need
export type { RoomName, SurfaceType, OneShotType } from './audioSynth.js';

import type { RoomName, SurfaceType, OneShotType } from './audioSynth.js';

export interface AudioSystem {
  tick(moving: boolean): void;
  playOneShot(type: OneShotType): void;
  setRoom(room: RoomName): void;
  dispose(): void;
}

// ── Room Z-range helper ───────────────────────────────────────────────────────

/**
 * Map a world-space (x, z) position to a room name.
 * Geometry-accurate zone map:
 *   cockpit:     Z < -20
 *   quarters:    |X| > 1.5  AND  Z in [-18.5, -13.5]  (port & starboard alcoves)
 *   corridor:    Z in [-20, -4]  (fallback after quarters check)
 *   galley:      Z in [-4, +2]
 *   engineering: Z in [+2, +9]
 *   cargo:       Z > +9
 */
export function getRoomForPosition(x: number, z: number): RoomName {
  if (z < -20) return 'cockpit';
  if (Math.abs(x) > 1.5 && z >= -18.5 && z <= -13.5) return 'quarters';
  if (z < -4)  return 'corridor';
  if (z < 2)   return 'galley';
  if (z <= 9)  return 'engineering';
  return 'cargo';
}

function surfaceForRoom(room: RoomName): SurfaceType {
  if (room === 'engineering' || room === 'cargo') return 'metal';
  if (room === 'galley') return 'tile';
  if (room === 'quarters') return 'soft';
  return 'soft';
}

// ── Module state ──────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let humNoiseSource: ReturnType<typeof buildEngineHum> | null = null;

let nextStepTime = 0;
let currentSurface: SurfaceType = 'soft';

const roomBranches: Partial<Record<RoomName, RoomBranch>> = {};
let currentRoom: RoomName = 'corridor';

// Module-level function refs so playOneShot/setAudioRoom work before initAudio()
let _playOneShotFn: ((type: OneShotType) => void) | null = null;
let _setRoomFn: ((room: RoomName) => void) | null = null;

/** Module-level playOneShot — importable by main.ts / interact.ts */
export function playOneShot(type: OneShotType): void {
  _playOneShotFn?.(type);
}

/** Module-level setRoom — importable by main.ts */
export function setAudioRoom(room: RoomName): void {
  _setRoomFn?.(room);
}

// ── AudioContext bootstrap ────────────────────────────────────────────────────

function resumeCtx(): void {
  if (ctx?.state === 'suspended') void ctx.resume();
}

function initAudioContext(): void {
  if (ctx) return;
  try {
    ctx = new AudioContext();
  } catch {
    return;
  }

  masterGain = ctx.createGain();
  masterGain.gain.value = MASTER_GAIN;
  masterGain.connect(ctx.destination);

  humNoiseSource = buildEngineHum(ctx, masterGain);

  roomBranches['cockpit']     = buildCockpitBed(ctx, masterGain);
  roomBranches['engineering'] = buildEngineeringBed(ctx, masterGain);
  roomBranches['galley']      = buildGalleyBed(ctx, masterGain);
  roomBranches['corridor']    = buildCorridorBed(ctx, masterGain);
  roomBranches['quarters']    = buildCorridorBed(ctx, masterGain); // reuse corridor ambient bed
  roomBranches['cargo']       = buildCorridorBed(ctx, masterGain);

  // Corridor starts at full gain
  const corridorBranch = roomBranches['corridor'];
  if (corridorBranch) corridorBranch.gainNode.gain.value = 1;

  buildQuartersPersonality(ctx, masterGain);
}

// ── Public API ────────────────────────────────────────────────────────────────

export function initAudio(): AudioSystem {
  const onGesture = (): void => { initAudioContext(); resumeCtx(); };
  window.addEventListener('click',   onGesture, { once: true });
  window.addEventListener('keydown', onGesture, { once: true });

  function crossfadeToRoom(room: import('./audioSynth.js').RoomName): void {
    if (!ctx || room === currentRoom) return;
    const now = ctx.currentTime;
    const fadeT = CROSSFADE_MS / 1000;

    const out = roomBranches[currentRoom];
    if (out) {
      out.gainNode.gain.cancelScheduledValues(now);
      out.gainNode.gain.setValueAtTime(out.gainNode.gain.value, now);
      out.gainNode.gain.linearRampToValueAtTime(0, now + fadeT);
    }
    const ins = roomBranches[room];
    if (ins) {
      ins.gainNode.gain.cancelScheduledValues(now);
      ins.gainNode.gain.setValueAtTime(0, now);
      ins.gainNode.gain.linearRampToValueAtTime(1, now + fadeT);
    }
    currentRoom = room;
    currentSurface = surfaceForRoom(room);
  }

  _setRoomFn     = crossfadeToRoom;
  _playOneShotFn = (type) => {
    if (!ctx || !masterGain || ctx.state !== 'running') return;
    playOneShotInternal(ctx, masterGain, type);
  };

  function tick(moving: boolean): void {
    if (!ctx || !masterGain || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    if (moving) {
      if (now >= nextStepTime) {
        scheduleStep(ctx, masterGain, now + 0.005, currentSurface);
        nextStepTime = now + STEP_INTERVAL_MIN
          + Math.random() * (STEP_INTERVAL_MAX - STEP_INTERVAL_MIN);
      }
    } else {
      nextStepTime = 0;
    }
  }

  function dispose(): void {
    if (humNoiseSource) {
      try { humNoiseSource.stop(); } catch { /* already stopped */ }
      humNoiseSource = null;
    }
    if (ctx) { void ctx.close(); ctx = null; masterGain = null; }
    _playOneShotFn = null;
    _setRoomFn     = null;
    window.removeEventListener('click',   onGesture);
    window.removeEventListener('keydown', onGesture);
  }

  const system: AudioSystem = {
    tick,
    playOneShot: (type) => { _playOneShotFn?.(type); },
    setRoom: crossfadeToRoom,
    dispose,
  };
  return system;
}
