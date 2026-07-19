/**
 * src/fx/worldBeds.ts — v1.0 THRESHOLD ambient beds for the three pocket
 * worlds (verdant/ashfall/rift). Same RoomBranch shape + wiring pattern as
 * audioSynth.ts's ship room beds (branch gain starts at 0, connects to the
 * shared master gain; audio.ts crossfades it in/out on world switch and it
 * inherits whatever mute/volume state masterGain already carries). Kept in
 * its own file — audioSynth.ts is already at the 300-line cap — per the
 * design brief's "new file preferred over expanding existing files" note.
 *
 * Timing variation uses Math.random() (never seeded rng), matching every
 * other scheduler in audioSynth.ts — audio never appears in a verify
 * screenshot and isn't part of the fps sample, so it isn't subject to the
 * world/creature "seeded rng only" screenshot-determinism rule.
 */
import { makeNoiseBuffer, type RoomBranch } from './audioSynth.js';

/** VERDANT — soft lush drone: two detuned sines (root + fifth) through a
 *  gentle lowpass, with a slow tremolo breathing the root's level. */
export function buildVerdantBed(audioCtx: AudioContext, outputGain: GainNode): RoomBranch {
  const branchGain = audioCtx.createGain();
  branchGain.gain.value = 0;
  branchGain.connect(outputGain);

  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.frequency.value = 900; lpf.Q.value = 0.7;
  lpf.connect(branchGain);

  const droneA = audioCtx.createOscillator();
  droneA.type = 'sine'; droneA.frequency.value = 196; // G3
  const gA = audioCtx.createGain(); gA.gain.value = 0.05;
  droneA.connect(gA); gA.connect(lpf); droneA.start(0);

  const droneB = audioCtx.createOscillator();
  droneB.type = 'sine'; droneB.frequency.value = 293.7; // D4 — a fifth above
  const gB = audioCtx.createGain(); gB.gain.value = 0.035;
  droneB.connect(gB); gB.connect(lpf); droneB.start(0);

  const tremolo = audioCtx.createOscillator();
  tremolo.type = 'sine'; tremolo.frequency.value = 0.12;
  const tremGain = audioCtx.createGain(); tremGain.gain.value = 0.02;
  tremolo.connect(tremGain); tremGain.connect(gA.gain); tremolo.start(0);

  return { gainNode: branchGain, sources: [droneA, droneB, tremolo] };
}

/** ASHFALL — low rumble: a sawtooth sub voice through a heavy lowpass, with a
 *  very slow amplitude swell so it never reads as a flat drone. */
export function buildAshfallBed(audioCtx: AudioContext, outputGain: GainNode): RoomBranch {
  const branchGain = audioCtx.createGain();
  branchGain.gain.value = 0;
  branchGain.connect(outputGain);

  const rumble = audioCtx.createOscillator();
  rumble.type = 'sawtooth'; rumble.frequency.value = 38;
  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.frequency.value = 160; lpf.Q.value = 1.4;
  const rg = audioCtx.createGain(); rg.gain.value = 0.09;
  rumble.connect(lpf); lpf.connect(rg); rg.connect(branchGain); rumble.start(0);

  const swell = audioCtx.createOscillator();
  swell.type = 'sine'; swell.frequency.value = 0.06;
  const swellGain = audioCtx.createGain(); swellGain.gain.value = 0.03;
  swell.connect(swellGain); swellGain.connect(rg.gain); swell.start(0);

  return { gainNode: branchGain, sources: [rumble, swell] };
}

/** RIFT — sparse crystalline shimmer: wide-spaced high bell-like pings, never
 *  a continuous texture (matches the world's "sparse spark motes" art). */
export function buildRiftBed(audioCtx: AudioContext, outputGain: GainNode): RoomBranch {
  const branchGain = audioCtx.createGain();
  branchGain.gain.value = 0;
  branchGain.connect(outputGain);

  const CHORD_HZ = [1760, 2093, 2637]; // A6 / C7 / E7 — sparse crystal chord tones

  function scheduleShimmer(when: number): void {
    const freq = CHORD_HZ[Math.floor(Math.random() * CHORD_HZ.length)];
    const osc = audioCtx.createOscillator();
    osc.type = 'sine'; osc.frequency.value = freq;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(0.03, when + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 1.4);
    osc.connect(g); g.connect(branchGain);
    osc.start(when); osc.stop(when + 1.5);
    const next = when + 2.2 + Math.random() * 3.5; // 2.2-5.7s apart — sparse
    setTimeout(() => scheduleShimmer(next), (next - audioCtx.currentTime) * 1000 - 50);
  }
  scheduleShimmer(audioCtx.currentTime + 0.3);

  return { gainNode: branchGain, sources: [branchGain] };
}

// ── LANDFALL bed handle (weather.ts drives rain gain + thunder) ─────────────

export interface LandfallBedHandle {
  setRainGain(v: number): void;
  triggerThunder(delaySecs: number): void;
}
let landfallHandle: LandfallBedHandle | null = null;

/** weather.ts's only way to reach the landfall bed's live audio nodes.
 *  RoomBranch (this file, frozen shape) has no rain-gain/thunder surface, so
 *  this module-level handle is exposed alongside it instead of widening
 *  RoomBranch or touching audio.ts's typed worldBranches map — both outside
 *  this lane's ownership. Null until buildLandfallBed() has run (audio boots
 *  on the first user gesture, see audio.ts's header); callers already treat
 *  a null return as a safe no-op, same "safe to omit if ctx is null"
 *  contract audio.ts documents for the whole module. */
export function getLandfallBedHandle(): LandfallBedHandle | null {
  return landfallHandle;
}

/** LANDFALL — wind (filtered noise + a slow gust LFO so it never reads as a
 *  flat drone), a rain-patter layer (band-passed noise, gain driven
 *  externally by weather.ts, silent by default), and a thunder one-shot
 *  scheduled on the handle above. */
export function buildLandfallBed(audioCtx: AudioContext, outputGain: GainNode): RoomBranch {
  const branchGain = audioCtx.createGain();
  branchGain.gain.value = 0;
  branchGain.connect(outputGain);

  // Wind: broadband noise through a lowpass (buildAshfallBed's rumble shape,
  // swapped to noise for a wind read) plus a slow gust LFO on its gain.
  const windSrc = audioCtx.createBufferSource();
  windSrc.buffer = makeNoiseBuffer(audioCtx, 4.0);
  windSrc.loop = true;
  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass'; lpf.frequency.value = 500; lpf.Q.value = 0.5;
  const wg = audioCtx.createGain(); wg.gain.value = 0.045;
  windSrc.connect(lpf); lpf.connect(wg); wg.connect(branchGain); windSrc.start(0);

  const gust = audioCtx.createOscillator();
  gust.type = 'sine'; gust.frequency.value = 0.05; // ~20s gust cycle
  const gustGain = audioCtx.createGain(); gustGain.gain.value = 0.02;
  gust.connect(gustGain); gustGain.connect(wg.gain); gust.start(0);

  // Rain patter: higher-frequency band-passed noise, gain starts at 0 —
  // weather.ts's setRainGain() (via getLandfallBedHandle()) is the only
  // thing that ever raises it.
  const rainSrc = audioCtx.createBufferSource();
  rainSrc.buffer = makeNoiseBuffer(audioCtx, 4.0);
  rainSrc.loop = true;
  const rainBpf = audioCtx.createBiquadFilter();
  rainBpf.type = 'bandpass'; rainBpf.frequency.value = 3200; rainBpf.Q.value = 0.6;
  const rainGain = audioCtx.createGain(); rainGain.gain.value = 0;
  rainSrc.connect(rainBpf); rainBpf.connect(rainGain); rainGain.connect(branchGain); rainSrc.start(0);

  // Thunder: low sine boom (pitch-drooping) + a highpassed noise crack,
  // scheduled `delaySecs` out from now. Math.random() isn't used here (the
  // delay is caller-seeded), but the envelope shape itself doesn't need to
  // be — this file's header note applies (audio never appears in a verify
  // screenshot / perf sample).
  function triggerThunder(delaySecs: number): void {
    const when = audioCtx.currentTime + Math.max(0, delaySecs);
    const boom = audioCtx.createOscillator();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(70, when);
    boom.frequency.exponentialRampToValueAtTime(30, when + 0.8);
    const boomGain = audioCtx.createGain();
    boomGain.gain.setValueAtTime(0.22, when);
    boomGain.gain.exponentialRampToValueAtTime(0.0001, when + 1.6);
    boom.connect(boomGain); boomGain.connect(branchGain);
    boom.start(when); boom.stop(when + 1.7);

    const crack = audioCtx.createBufferSource();
    crack.buffer = makeNoiseBuffer(audioCtx, 0.5);
    const crackHpf = audioCtx.createBiquadFilter();
    crackHpf.type = 'highpass'; crackHpf.frequency.value = 800;
    const crackGain = audioCtx.createGain();
    crackGain.gain.setValueAtTime(0.14, when);
    crackGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.45);
    crack.connect(crackHpf); crackHpf.connect(crackGain); crackGain.connect(branchGain);
    crack.start(when); crack.stop(when + 0.5);
  }

  landfallHandle = {
    setRainGain: (v: number): void => { rainGain.gain.value = v; },
    triggerThunder,
  };

  return { gainNode: branchGain, sources: [windSrc, gust, rainSrc] };
}
