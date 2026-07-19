/**
 * src/fx/landfall/weather.ts — Stage 4: LANDFALL's weather system. Dims/
 * cools the world's ONLY two lights (sky.sun, sky.hemi) and tints the sky
 * dome per weather state, drives one wrapped rain Points layer plus a seeded
 * lightning-to-thunder scheduler during storms, and exposes a cloud-coverage
 * value for a future cloud subsystem to consume (this stage builds no cloud
 * meshes of its own — see the file-ownership note below).
 *
 * State selection: `makeRng(LANDFALL_SEED ^ 0x77)` rolls a natural state
 * against biome.weather's {clearP, overcastP, stormP} — the data contract
 * biomes.ts shipped for this stage. That roll is exposed on the handle
 * (`rolled`) but is NOT what drives the applied `state`: verify's default
 * screenshots need a stable baseline mood, so the applied state defaults
 * hard to 'clear' and only changes via an explicit `?weather=` override —
 * `storm` | `overcast` | `clear` force that state; `0` forces clear AND
 * fully disables rain/lightning (the isolation-matrix flag, same family as
 * perf.ts's `?shadows=0` / `?quality=low`).
 *
 * Rain: ONE Points cloud, positions seeded once inside a RAIN_BOX_SIZE box
 * and RIGIDLY re-centred on the player every frame (uCenter uniform) — only
 * the Y axis wraps in the vertex shader (uFallY, driven by accumulated dt,
 * never wall clock) for the falling motion. Simpler than starLayer.ts's
 * scroll-wrap (that pattern streams a field along a fixed universe-flow
 * direction; rain just needs to always surround whoever's standing in it,
 * so the box translates rigidly rather than wrapping on every axis).
 *
 * Thunder audio: routed through worldBeds.ts's getLandfallBedHandle() rather
 * than through audio.ts/audioSynth.ts's RoomBranch/AudioSystem types — those
 * files are outside this lane's ownership and don't expose a per-world-bed
 * trigger surface. worldBeds.ts (which this lane DOES own) exposes one via a
 * small module-level handle instead, with no change to their public shapes.
 */
import * as THREE from 'three';
import type { LandfallSkyHandle } from './sky.js';
import type { BiomePreset } from './biomes.js';
import { makeRng, type Rng } from '../space/rng.js';
import { getLandfallBedHandle } from '../worldBeds.js';
import {
  LANDFALL_SEED,
  RAIN_COUNT, RAIN_BOX_SIZE, RAIN_FALL_SPEED, RAIN_PATTER_GAIN,
  LIGHTNING_MIN_GAP, LIGHTNING_MAX_GAP, LIGHTNING_FLASH_SECS, LIGHTNING_MULT,
  WEATHER_SUN_SCALE, WEATHER_HEMI_SCALE, WEATHER_DOME_SCALE, WEATHER_CLOUD_BUMP,
} from '../../flight/landfallTuning.js';

export type WeatherState = 'clear' | 'overcast' | 'storm';
const STATE_IDX: Record<WeatherState, 0 | 1 | 2> = { clear: 0, overcast: 1, storm: 2 };

const _params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
const _weatherParam = _params.get('weather');
/** `?weather=0` — the isolation flag: forces clear AND fully disables rain/lightning. */
const WEATHER_OFF: boolean = _weatherParam === '0';
const WEATHER_FORCE: WeatherState | null =
  _weatherParam === 'clear' || _weatherParam === 'overcast' || _weatherParam === 'storm'
    ? (_weatherParam as WeatherState)
    : null;

export interface WeatherHandle {
  state: WeatherState;
  /** The organic seeded roll — see file header; not necessarily the applied state. */
  rolled: WeatherState;
  /** biome.clouds.coverage + this state's bump; consumed by a future cloud system. */
  cloudCoverage: number;
  update(dt: number, playerPos: THREE.Vector3): void;
  dispose(): void;
}

function rollNatural(biome: BiomePreset): WeatherState {
  const rng = makeRng(LANDFALL_SEED ^ 0x77);
  const idx = rng.pick([biome.weather.clearP, biome.weather.overcastP, biome.weather.stormP]);
  return (['clear', 'overcast', 'storm'] as const)[idx];
}

// ── Rain layer ────────────────────────────────────────────────────────────
const RAIN_VERT = /* glsl */ `
  uniform vec3 uCenter;
  uniform float uFallY;
  uniform float uBoxSize;
  varying float vFade;
  void main() {
    vec3 local = position;
    local.y = mod(local.y - uFallY, uBoxSize) - uBoxSize * 0.5;
    vFade = 1.0 - abs(local.y) / (uBoxSize * 0.5);
    vec4 mvPos = modelViewMatrix * vec4(uCenter + local, 1.0);
    gl_PointSize = 3.5;
    gl_Position = projectionMatrix * mvPos;
  }
`;
const RAIN_FRAG = /* glsl */ `
  varying float vFade;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    if (abs(uv.x) > 0.12) discard;
    float streak = 1.0 - smoothstep(0.0, 0.5, abs(uv.y));
    gl_FragColor = vec4(0.75, 0.80, 0.85, streak * vFade * 0.5);
  }
`;

function buildRainLayer(rng: Rng): THREE.Points {
  const positions = new Float32Array(RAIN_COUNT * 3);
  const half = RAIN_BOX_SIZE * 0.5;
  for (let i = 0; i < RAIN_COUNT; i++) {
    positions[i * 3] = rng.signed(half);
    positions[i * 3 + 1] = rng.range(-half, half);
    positions[i * 3 + 2] = rng.signed(half);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uCenter: { value: new THREE.Vector3() },
      uFallY: { value: 0 },
      uBoxSize: { value: RAIN_BOX_SIZE },
    },
    vertexShader: RAIN_VERT,
    fragmentShader: RAIN_FRAG,
    transparent: true,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  points.name = 'landfall-rain';
  points.frustumCulled = false;
  points.visible = false;
  return points;
}

function scheduleNextStrike(rng: Rng, t: number): number {
  return t + rng.range(LIGHTNING_MIN_GAP, LIGHTNING_MAX_GAP);
}

export function attachWeather(scene: THREE.Scene, sky: LandfallSkyHandle, biome: BiomePreset): WeatherHandle {
  const rolled = rollNatural(biome);
  const state: WeatherState = WEATHER_OFF ? 'clear' : (WEATHER_FORCE ?? 'clear');
  const idx = STATE_IDX[state];
  const active = state === 'storm';

  const baseSun = sky.sun.intensity;
  const baseHemi = sky.hemi.intensity;
  const sunScale = WEATHER_SUN_SCALE[idx];
  const hemiScale = WEATHER_HEMI_SCALE[idx];
  sky.sun.intensity = baseSun * sunScale;
  sky.hemi.intensity = baseHemi * hemiScale;
  if (state !== 'clear') {
    // Cooler hemi under cloud cover — sunlight lost behind cloud, not just dimmer.
    sky.hemi.color.lerp(new THREE.Color('#93a0aa'), state === 'storm' ? 0.55 : 0.3);
  }
  const domeMat = sky.dome.material as THREE.MeshBasicMaterial;
  domeMat.color.setScalar(WEATHER_DOME_SCALE[idx]);

  const cloudCoverage = Math.min(1, biome.clouds.coverage + WEATHER_CLOUD_BUMP[idx]);

  const strikeRng = makeRng(LANDFALL_SEED ^ 0x77 ^ 0x11);
  const rain = buildRainLayer(makeRng(LANDFALL_SEED ^ 0x77 ^ 0x22));
  scene.add(rain);
  rain.visible = active;
  const rainMat = rain.material as THREE.ShaderMaterial;

  let t = 0;
  let nextStrike = active ? scheduleNextStrike(strikeRng, 0) : Infinity;
  let flashUntil = -1;

  function update(dt: number, playerPos: THREE.Vector3): void {
    t += dt;
    if (active) {
      (rainMat.uniforms['uFallY'] as THREE.IUniform<number>).value = t * RAIN_FALL_SPEED;
      (rainMat.uniforms['uCenter'] as THREE.IUniform<THREE.Vector3>).value.copy(playerPos);
      if (t >= nextStrike) {
        flashUntil = t + LIGHTNING_FLASH_SECS;
        nextStrike = scheduleNextStrike(strikeRng, t);
        getLandfallBedHandle()?.triggerThunder(strikeRng.range(0.15, 1.2));
      }
    }
    const flashMult = t < flashUntil ? LIGHTNING_MULT : 1;
    sky.sun.intensity = baseSun * sunScale * flashMult;
    sky.hemi.intensity = baseHemi * hemiScale * flashMult;
    // Retried every frame (not just once at build) — the audio context only
    // exists after the first user gesture, so the handle may still be null
    // when this world builds; once it appears, this keeps the gain in sync.
    getLandfallBedHandle()?.setRainGain(active ? RAIN_PATTER_GAIN : 0);
  }

  return {
    state, rolled, cloudCoverage, update,
    dispose(): void {
      scene.remove(rain);
      rain.geometry.dispose();
      (rain.material as THREE.Material).dispose();
    },
  };
}
