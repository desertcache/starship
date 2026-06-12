/**
 * src/fx/audio.ts — Phase 5 WebAudio synthesis. Zero external files.
 *
 * Sounds:
 *   1. Engine hum: low filtered noise + sine sub-oscillator, constant,
 *      with a slow LFO for organic breathing.
 *   2. Footsteps: short filtered noise bursts tied to player movement,
 *      random pitch/interval variation so it never sounds mechanical.
 *
 * AudioContext starts SUSPENDED — it can only resume after a user gesture.
 * We resume on first click or keydown. The game runs fine with audio absent
 * (headless Playwright never triggers a gesture, so audio stays suspended
 * and produces no errors).
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AudioSystem {
  /** Call each frame. moving=true when player is walking. */
  tick(moving: boolean): void;
  /** Dispose all nodes and buffers. */
  dispose(): void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// Engine hum
const HUM_NOISE_GAIN    = 0.035;   // overall filtered-noise level
const HUM_SUB_GAIN      = 0.060;   // sine sub-oscillator level
const HUM_SUB_FREQ      = 58;      // Hz — low rumble
const HUM_LPF_FREQ      = 140;     // noise low-pass cutoff
const HUM_LPF_Q         = 1.2;
const HUM_BANDPASS_FREQ = 90;
const HUM_BANDPASS_Q    = 4.0;
const LFO_FREQ          = 0.08;    // Hz — slow breath cycle
const LFO_DEPTH         = 0.018;   // gain modulation depth (keeps it subtle)
const MASTER_GAIN       = 0.65;    // master output level

// Footsteps
const STEP_NOISE_GAIN   = 0.22;    // burst loudness
const STEP_BURST_SECS   = 0.055;   // burst duration
const STEP_LPF_FREQ     = 700;     // step filter — muffled thud
const STEP_INTERVAL_MIN = 0.42;    // fastest cadence (secs between steps)
const STEP_INTERVAL_MAX = 0.54;    // slowest cadence
const STEP_FREQ_JITTER  = 100;     // ±Hz variation on step filter for variety

// ── Module state ──────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null;

// Engine hum nodes (kept alive)
let masterGain: GainNode | null = null;
let humNoiseSource: AudioBufferSourceNode | null = null;

// Footstep timing state
let nextStepTime = 0;   // absolute AudioContext time for the next step burst

// ── Noise buffer helper ───────────────────────────────────────────────────────

function makeNoiseBuffer(audioCtx: AudioContext, durationSecs: number): AudioBuffer {
  const sampleRate = audioCtx.sampleRate;
  const length     = Math.ceil(sampleRate * durationSecs);
  const buf        = audioCtx.createBuffer(1, length, sampleRate);
  const data       = buf.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

// ── Engine hum construction ───────────────────────────────────────────────────

function buildEngineHum(audioCtx: AudioContext, outputGain: GainNode): void {
  // ── Noise branch ──────────────────────────────────────────────────────────
  // 4-second looping noise buffer so it never repeats audibly
  const noiseBuffer = makeNoiseBuffer(audioCtx, 4.0);
  humNoiseSource    = audioCtx.createBufferSource();
  humNoiseSource.buffer = noiseBuffer;
  humNoiseSource.loop   = true;

  const lpf = audioCtx.createBiquadFilter();
  lpf.type            = 'lowpass';
  lpf.frequency.value = HUM_LPF_FREQ;
  lpf.Q.value         = HUM_LPF_Q;

  const bandpass = audioCtx.createBiquadFilter();
  bandpass.type            = 'bandpass';
  bandpass.frequency.value = HUM_BANDPASS_FREQ;
  bandpass.Q.value         = HUM_BANDPASS_Q;

  const noiseGainNode = audioCtx.createGain();
  noiseGainNode.gain.value = HUM_NOISE_GAIN;

  humNoiseSource.connect(lpf);
  lpf.connect(bandpass);
  bandpass.connect(noiseGainNode);
  noiseGainNode.connect(outputGain);
  humNoiseSource.start(0);

  // ── Sub-oscillator (sine) ─────────────────────────────────────────────────
  const sub = audioCtx.createOscillator();
  sub.type            = 'sine';
  sub.frequency.value = HUM_SUB_FREQ;

  const subGain = audioCtx.createGain();
  subGain.gain.value  = HUM_SUB_GAIN;

  sub.connect(subGain);
  subGain.connect(outputGain);
  sub.start(0);

  // ── LFO (modulates master gain for breathing effect) ──────────────────────
  const lfo = audioCtx.createOscillator();
  lfo.type            = 'sine';
  lfo.frequency.value = LFO_FREQ;

  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value  = LFO_DEPTH;

  // LFO target: masterGain.gain — adds ± LFO_DEPTH to the master level
  lfo.connect(lfoGain);
  lfoGain.connect(outputGain.gain);
  lfo.start(0);
}

// ── Footstep burst ────────────────────────────────────────────────────────────

function scheduleStep(
  audioCtx: AudioContext,
  outputGain: GainNode,
  when: number,
): void {
  const stepNoiseBuffer = makeNoiseBuffer(audioCtx, STEP_BURST_SECS + 0.01);

  const source = audioCtx.createBufferSource();
  source.buffer = stepNoiseBuffer;

  // Slight pitch jitter via playback rate (affects frequency character)
  source.playbackRate.value = 0.85 + Math.random() * 0.3;

  const filterFreq = STEP_LPF_FREQ + (Math.random() * 2 - 1) * STEP_FREQ_JITTER;
  const lpf        = audioCtx.createBiquadFilter();
  lpf.type            = 'lowpass';
  lpf.frequency.value = filterFreq;
  lpf.Q.value         = 0.8;

  const stepGain = audioCtx.createGain();
  stepGain.gain.setValueAtTime(STEP_NOISE_GAIN, when);
  stepGain.gain.exponentialRampToValueAtTime(0.0001, when + STEP_BURST_SECS);

  source.connect(lpf);
  lpf.connect(stepGain);
  stepGain.connect(outputGain);
  source.start(when);
  source.stop(when + STEP_BURST_SECS + 0.01);
}

// ── AudioContext bootstrap ────────────────────────────────────────────────────

function resumeCtx(): void {
  if (ctx && ctx.state === 'suspended') {
    void ctx.resume();
  }
}

function initAudioContext(): void {
  if (ctx) return; // already set up

  try {
    ctx = new AudioContext();
  } catch {
    // AudioContext not available (headless / no audio hardware) — silently skip
    return;
  }

  // Master gain node — all audio routed through here
  masterGain = ctx.createGain();
  masterGain.gain.value = MASTER_GAIN;
  masterGain.connect(ctx.destination);

  buildEngineHum(ctx, masterGain);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Initialise audio and attach gesture listeners.
 * Safe to call unconditionally — does nothing in headless environments.
 */
export function initAudio(): AudioSystem {
  // Gesture listeners — resume AudioContext on first user interaction
  const onGesture = (): void => {
    initAudioContext();
    resumeCtx();
  };
  window.addEventListener('click',   onGesture, { once: true });
  window.addEventListener('keydown', onGesture, { once: true });

  function tick(moving: boolean): void {
    if (!ctx || !masterGain) return;
    if (ctx.state !== 'running') return;

    const now = ctx.currentTime;

    if (moving) {
      // Schedule the next step if we've reached the time for it
      if (now >= nextStepTime) {
        scheduleStep(ctx, masterGain, now + 0.005); // tiny lookahead

        // Randomise interval for next step
        const interval = STEP_INTERVAL_MIN
          + Math.random() * (STEP_INTERVAL_MAX - STEP_INTERVAL_MIN);
        nextStepTime = now + interval;
      }
    } else {
      // Reset step timer so the next movement starts a fresh cadence
      nextStepTime = 0;
    }
  }

  function dispose(): void {
    if (humNoiseSource) {
      try { humNoiseSource.stop(); } catch { /* already stopped */ }
      humNoiseSource = null;
    }
    if (ctx) {
      void ctx.close();
      ctx         = null;
      masterGain  = null;
    }
    window.removeEventListener('click',   onGesture);
    window.removeEventListener('keydown', onGesture);
  }

  return { tick, dispose };
}

