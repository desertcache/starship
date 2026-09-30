/**
 * src/fx/audioSynth.ts — shared WebAudio room-bed builders and noise helper.
 * Footsteps, one-shot SFX, and quarters spatial audio live in audioEffects.ts.
 */

export type OneShotType = 'ui' | 'door' | 'door-auto' | 'eat' | 'sip' | 'vent' | 'save' | 'quest-start' | 'quest-step' | 'quest-complete';
export type RoomName    = 'cockpit' | 'corridor' | 'quarters' | 'galley' | 'engineering' | 'cargo';
export type SurfaceType = 'soft' | 'tile' | 'metal';

// ── Constants ─────────────────────────────────────────────────────────────────

export const HUM_NOISE_GAIN    = 0.035;
export const HUM_SUB_GAIN      = 0.060;
export const HUM_SUB_FREQ      = 58;
export const HUM_LPF_FREQ      = 140;
export const HUM_LPF_Q         = 1.2;
export const HUM_BANDPASS_FREQ = 90;
export const HUM_BANDPASS_Q    = 4.0;
export const LFO_FREQ          = 0.08;
export const LFO_DEPTH         = 0.018;
export const MASTER_GAIN       = 0.65;

export const STEP_NOISE_GAIN   = 0.04;
export const STEP_BURST_SECS   = 0.055;
export const STEP_INTERVAL_MIN = 0.42;
export const STEP_INTERVAL_MAX = 0.54;
export const STEP_FREQ_JITTER  = 80;

export const CROSSFADE_MS = 800;

// ── Room branch type ──────────────────────────────────────────────────────────

export interface RoomBranch {
  gainNode: GainNode;
  sources: AudioNode[];
}

// ── Noise buffer helper ───────────────────────────────────────────────────────

export function makeNoiseBuffer(audioCtx: AudioContext, durationSecs: number): AudioBuffer {
  const sampleRate = audioCtx.sampleRate;
  const length     = Math.ceil(sampleRate * durationSecs);
  const buf        = audioCtx.createBuffer(1, length, sampleRate);
  const data       = buf.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

// ── Engine hum ────────────────────────────────────────────────────────────────

export function buildEngineHum(
  audioCtx: AudioContext,
  outputGain: GainNode,
): AudioBufferSourceNode {
  const noiseBuffer  = makeNoiseBuffer(audioCtx, 4.0);
  const humSrc       = audioCtx.createBufferSource();
  humSrc.buffer = noiseBuffer;
  humSrc.loop   = true;

  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.frequency.value = HUM_LPF_FREQ; lpf.Q.value = HUM_LPF_Q;

  const bp = audioCtx.createBiquadFilter();
  bp.type = 'bandpass'; bp.frequency.value = HUM_BANDPASS_FREQ; bp.Q.value = HUM_BANDPASS_Q;

  const ng = audioCtx.createGain();
  ng.gain.value = HUM_NOISE_GAIN;
  humSrc.connect(lpf); lpf.connect(bp); bp.connect(ng); ng.connect(outputGain);
  humSrc.start(0);

  const sub = audioCtx.createOscillator();
  sub.type = 'sine'; sub.frequency.value = HUM_SUB_FREQ;
  const sg = audioCtx.createGain(); sg.gain.value = HUM_SUB_GAIN;
  sub.connect(sg); sg.connect(outputGain); sub.start(0);

  const lfo = audioCtx.createOscillator();
  lfo.type = 'sine'; lfo.frequency.value = LFO_FREQ;
  const lg = audioCtx.createGain(); lg.gain.value = LFO_DEPTH;
  lfo.connect(lg); lg.connect(outputGain.gain); lfo.start(0);

  return humSrc;
}

// ── Room beds ─────────────────────────────────────────────────────────────────

export function buildCockpitBed(audioCtx: AudioContext, outputGain: GainNode): RoomBranch {
  const branchGain = audioCtx.createGain();
  branchGain.gain.value = 0;
  branchGain.connect(outputGain);

  function scheduleChirp(when: number): void {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 2200 + Math.random() * 800;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(0.02, when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.08);
    osc.connect(g); g.connect(branchGain);
    osc.start(when); osc.stop(when + 0.09);
    const next = when + 0.8 + Math.random() * 1.7;
    setTimeout(() => scheduleChirp(next), (next - audioCtx.currentTime) * 1000 - 50);
  }
  scheduleChirp(audioCtx.currentTime + 0.2);
  return { gainNode: branchGain, sources: [branchGain] };
}

export function buildEngineeringBed(audioCtx: AudioContext, outputGain: GainNode): RoomBranch {
  const branchGain = audioCtx.createGain();
  branchGain.gain.value = 0;
  branchGain.connect(outputGain);

  const reactor = audioCtx.createOscillator();
  reactor.type = 'sawtooth'; reactor.frequency.value = 45;
  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.frequency.value = 200; lpf.Q.value = 2;
  const rg = audioCtx.createGain(); rg.gain.value = 0.10;
  reactor.connect(lpf); lpf.connect(rg); rg.connect(branchGain); reactor.start(0);

  const pulse = audioCtx.createOscillator();
  pulse.type = 'sine'; pulse.frequency.value = 0.4;
  const pg = audioCtx.createGain(); pg.gain.value = 0.04;
  pulse.connect(pg); pg.connect(rg.gain); pulse.start(0);

  return { gainNode: branchGain, sources: [reactor, pulse] };
}

export function buildGalleyBed(audioCtx: AudioContext, outputGain: GainNode): RoomBranch {
  const branchGain = audioCtx.createGain();
  branchGain.gain.value = 0;
  branchGain.connect(outputGain);

  const motor = audioCtx.createOscillator();
  motor.type = 'square'; motor.frequency.value = 120;
  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.frequency.value = 280; lpf.Q.value = 1.5;
  const mg = audioCtx.createGain(); mg.gain.value = 0.05;
  motor.connect(lpf); lpf.connect(mg); mg.connect(branchGain); motor.start(0);

  return { gainNode: branchGain, sources: [motor] };
}

export function buildCorridorBed(audioCtx: AudioContext, outputGain: GainNode): RoomBranch {
  const branchGain = audioCtx.createGain();
  branchGain.gain.value = 0;
  branchGain.connect(outputGain);

  const hum = audioCtx.createOscillator();
  hum.type = 'sine'; hum.frequency.value = 58;
  const hg = audioCtx.createGain(); hg.gain.value = 0.04;
  hum.connect(hg); hg.connect(branchGain); hum.start(0);

  return { gainNode: branchGain, sources: [hum] };
}

export { scheduleStep, playOneShotInternal, buildQuartersPersonality } from './audioEffects.js';
