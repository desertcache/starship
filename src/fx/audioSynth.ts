/**
 * src/fx/audioSynth.ts — Low-level WebAudio node builders.
 * Called exclusively from audio.ts. Not imported anywhere else.
 *
 * Contains: engine hum, room bed builders, footstep scheduling,
 *           one-shot SFX, and the quarters spatial personality.
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

// ── Footstep ──────────────────────────────────────────────────────────────────

export function scheduleStep(
  audioCtx: AudioContext,
  outputGain: GainNode,
  when: number,
  surface: SurfaceType,
): void {
  const src = audioCtx.createBufferSource();
  src.buffer = makeNoiseBuffer(audioCtx, STEP_BURST_SECS + 0.01);
  src.playbackRate.value = 0.85 + Math.random() * 0.3;

  const freqMap: Record<SurfaceType, number> = { soft: 450, tile: 650, metal: 2200 };
  const filterFreq = freqMap[surface] + (Math.random() * 2 - 1) * STEP_FREQ_JITTER;

  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.frequency.value = filterFreq; lpf.Q.value = 0.8;

  const sg = audioCtx.createGain();
  sg.gain.setValueAtTime(STEP_NOISE_GAIN, when);
  sg.gain.exponentialRampToValueAtTime(0.0001, when + STEP_BURST_SECS);

  src.connect(lpf); lpf.connect(sg); sg.connect(outputGain);
  src.start(when); src.stop(when + STEP_BURST_SECS + 0.01);

  if (surface === 'metal') {
    const ring = audioCtx.createOscillator();
    ring.type = 'sine'; ring.frequency.value = 800;
    const rg = audioCtx.createGain();
    rg.gain.setValueAtTime(0.04, when);
    rg.gain.exponentialRampToValueAtTime(0.0001, when + 0.12);
    ring.connect(rg); rg.connect(outputGain);
    ring.start(when); ring.stop(when + 0.13);
  }
}

// ── One-shot SFX ──────────────────────────────────────────────────────────────

export function playOneShotInternal(
  audioCtx: AudioContext,
  outputGain: GainNode,
  type: OneShotType,
): void {
  const now = audioCtx.currentTime;

  if (type === 'ui') {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine'; osc.frequency.value = 1200;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.12, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc.connect(g); g.connect(outputGain); osc.start(now); osc.stop(now + 0.07);

  } else if (type === 'door') {
    const thud = audioCtx.createOscillator();
    thud.type = 'sine'; thud.frequency.setValueAtTime(200, now);
    thud.frequency.exponentialRampToValueAtTime(50, now + 0.08);
    const tg = audioCtx.createGain();
    tg.gain.setValueAtTime(0.18, now); tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    thud.connect(tg); tg.connect(outputGain); thud.start(now); thud.stop(now + 0.09);
    const hsrc = audioCtx.createBufferSource();
    hsrc.buffer = makeNoiseBuffer(audioCtx, 0.15);
    const hpf = audioCtx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 3000;
    const hg = audioCtx.createGain();
    hg.gain.setValueAtTime(0.06, now); hg.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    hsrc.connect(hpf); hpf.connect(hg); hg.connect(outputGain);
    hsrc.start(now); hsrc.stop(now + 0.16);

  } else if (type === 'eat') {
    [220, 277, 330].forEach((freq, i) => {
      const osc = audioCtx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0, now + i * 0.04);
      g.gain.linearRampToValueAtTime(0.07, now + i * 0.04 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.35);
      osc.connect(g); g.connect(outputGain); osc.start(now); osc.stop(now + i * 0.04 + 0.36);
    });

  } else if (type === 'sip') {
    const osc = audioCtx.createOscillator(); osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now); osc.frequency.exponentialRampToValueAtTime(280, now + 0.08);
    const lpf = audioCtx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 600;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.08, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(lpf); lpf.connect(g); g.connect(outputGain); osc.start(now); osc.stop(now + 0.10);

  } else if (type === 'vent') {
    const src = audioCtx.createBufferSource(); src.buffer = makeNoiseBuffer(audioCtx, 0.35);
    const bpf = audioCtx.createBiquadFilter(); bpf.type = 'bandpass'; bpf.Q.value = 3;
    bpf.frequency.setValueAtTime(4000, now); bpf.frequency.exponentialRampToValueAtTime(200, now + 0.30);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.10, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    src.connect(bpf); bpf.connect(g); g.connect(outputGain); src.start(now); src.stop(now + 0.35);

  } else if (type === 'save') {
    [880, 1100].forEach((freq, i) => {
      const osc = audioCtx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.10, now + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.08);
      osc.connect(g); g.connect(outputGain);
      osc.start(now + i * 0.09); osc.stop(now + i * 0.09 + 0.09);
    });

  } else if (type === 'door-auto') {
    // Softer/lower whoosh than 'door' — auto-close feels less abrupt
    const thud = audioCtx.createOscillator();
    thud.type = 'sine'; thud.frequency.setValueAtTime(120, now);
    thud.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    const tg = audioCtx.createGain();
    tg.gain.setValueAtTime(0.10, now); tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    thud.connect(tg); tg.connect(outputGain); thud.start(now); thud.stop(now + 0.13);
    const hsrc = audioCtx.createBufferSource(); hsrc.buffer = makeNoiseBuffer(audioCtx, 0.18);
    const hpf = audioCtx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 1800;
    const hg = audioCtx.createGain();
    hg.gain.setValueAtTime(0.03, now); hg.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    hsrc.connect(hpf); hpf.connect(hg); hg.connect(outputGain);
    hsrc.start(now); hsrc.stop(now + 0.19);

  } else if (type === 'quest-start') {
    // Low rising two-tone — anomaly detected
    [260, 340].forEach((freq, i) => {
      const osc = audioCtx.createOscillator(); osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.8, now + i * 0.18);
      osc.frequency.linearRampToValueAtTime(freq, now + i * 0.18 + 0.22);
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.09, now + i * 0.18);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.18 + 0.38);
      osc.connect(g); g.connect(outputGain);
      osc.start(now + i * 0.18); osc.stop(now + i * 0.18 + 0.40);
    });

  } else if (type === 'quest-step') {
    // Confirming blip — task acknowledged
    const osc = audioCtx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 660;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.11, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.10);
    osc.connect(g); g.connect(outputGain); osc.start(now); osc.stop(now + 0.11);

  } else if (type === 'quest-complete') {
    // Triumphant 3-note arpeggio — C maj triad
    [523, 659, 784].forEach((freq, i) => {
      const osc = audioCtx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.13, now + i * 0.12);
      g.gain.linearRampToValueAtTime(0.10, now + i * 0.12 + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.45);
      osc.connect(g); g.connect(outputGain);
      osc.start(now + i * 0.12); osc.stop(now + i * 0.12 + 0.46);
    });
  }
}

// ── Quarters spatial personality ──────────────────────────────────────────────

export function buildQuartersPersonality(audioCtx: AudioContext, outputGain: GainNode): void {
  const pannerA = audioCtx.createPanner();
  pannerA.setPosition(-4, 1.7, -16);
  pannerA.refDistance = 3; pannerA.maxDistance = 12; pannerA.rolloffFactor = 1.5;
  pannerA.connect(outputGain);

  function scheduleBeepA(when: number): void {
    const osc = audioCtx.createOscillator(); osc.type = 'sine';
    osc.frequency.value = 800 + Math.random() * 400;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.008, when); g.gain.exponentialRampToValueAtTime(0.0001, when + 0.05);
    osc.connect(g); g.connect(pannerA); osc.start(when); osc.stop(when + 0.06);
    const next = when + 1.2 + Math.random() * 2.0;
    setTimeout(() => scheduleBeepA(next), (next - audioCtx.currentTime) * 1000 - 50);
  }
  scheduleBeepA(audioCtx.currentTime + 0.5);

  const pannerB = audioCtx.createPanner();
  pannerB.setPosition(4, 1.7, -16);
  pannerB.refDistance = 3; pannerB.maxDistance = 12; pannerB.rolloffFactor = 1.5;
  pannerB.connect(outputGain);

  const droneB = audioCtx.createOscillator();
  droneB.type = 'sine'; droneB.frequency.value = 220;
  const droneLpf = audioCtx.createBiquadFilter();
  droneLpf.type = 'lowpass'; droneLpf.frequency.value = 400;
  const dg = audioCtx.createGain(); dg.gain.value = 0.008;
  droneB.connect(droneLpf); droneLpf.connect(dg); dg.connect(pannerB); droneB.start(0);
}
