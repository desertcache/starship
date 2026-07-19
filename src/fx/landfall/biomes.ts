/**
 * src/fx/landfall/biomes.ts — per-body-kind preset table for v1.2 LANDFALL.
 * One BiomePreset bundles everything a landed surface needs: terrain shaping
 * (heightField.ts), sky/fog (sky.ts), and Stage 3/4 contracts (clouds/weather/
 * scatter/creatures/entry) this stage ships as DATA ONLY — nothing here is
 * consumed yet outside terrain+sky, but the shape is the seam those stages
 * build against, same "ship the contract before the consumer" pattern Stage 1
 * used for WorldId/FlightMode.
 *
 * Only ROCKY exists this stage (the only body kind LANDFALL currently targets
 * per the campaign brief); resolveBiome() falls back to it for any other
 * BodyKind so a future landing-eligible body never hits a missing-preset gap.
 */
import type { BodyKind } from '../space/bodies.js';
import type { BiomeTerrain } from './heightField.js';
import type { CreatureSpec } from '../../core/worldTypes.js';

export interface BiomePreset {
  terrain: BiomeTerrain;
  sky: {
    zenith: string;
    horizon: string;
    sunColor: string;
    sunElevationDeg: number;
    sunAzimuthDeg: number;
    fogNear: number;
    fogFar: number;
  };
  /** Stage 4 consumes this — data only for now. */
  clouds: { coverage: number; colors: [string, string] };
  /** Stage 4 consumes this — data only for now. */
  weather: { clearP: number; overcastP: number; stormP: number };
  /** Stage 3/4 consumes this — data only for now. */
  scatter: Array<{ kind: 'boulder' | 'spire' | 'shrub'; perChunk: number; collide: boolean }>;
  /** Stage 4 consumes this — data only for now. */
  creatures: CreatureSpec[];
  /** Stage 3 consumes this (descent cinematic) — data only for now. */
  entry: { glowColor: string; turbulence: number };
}

const ROCKY: BiomePreset = {
  terrain: {
    // Art-gate round 1 fix: 26m read as a billiard table from eye height —
    // 60m gives real near-field relief and lets ridges break the horizon at
    // landfall-qa's 300m range (see heightField.ts's GAIN/ridge comments for
    // the accompanying fbm rebalance this height increase depends on).
    maxHeight: 60,
    baseWavelength: 300,
    ridgeWeight: 0.6,
    // Round-3 contrast widen: the earlier low/mid/high were close enough in
    // value that the whole world averaged to one mid-brown. Darker shadowed
    // low, saturated mid, near-sand high — the terrace strata in colorT need
    // contrast to be visible at all.
    colorRamp: { low: '#43301f', mid: '#8a6a47', high: '#e2cda0' },
  },
  sky: {
    zenith: '#5a7d82', // dusty teal-grey
    horizon: '#c8956a', // dusty warm — MUST equal landfall.ts's scene.fog color
    sunColor: '#ffdca8',
    sunElevationDeg: 28,
    sunAzimuthDeg: 210,
    fogNear: 120,
    fogFar: 480,
  },
  clouds: { coverage: 0.35, colors: ['#e8c9a8', '#7a5d52'] },
  weather: { clearP: 0.6, overcastP: 0.3, stormP: 0.1 },
  scatter: [
    { kind: 'boulder', perChunk: 4, collide: true },
    { kind: 'spire', perChunk: 1, collide: true },
    { kind: 'shrub', perChunk: 6, collide: false },
  ],
  creatures: [
    {
      id: 'landfall-strider',
      scanName: 'DUNE STRIDER',
      lore: 'A stout quadruped that treads the rock flats in loose herds.',
      plan: 'quadruped',
      sizeM: 2.1,
      palette: { primary: '#8a6d4e', secondary: '#5a4534', emissive: '#ffb27a' },
      gaitHz: 0.8,
      temperament: 'placid',
      count: 8,
      seed: 0x1a01,
      roamRadius: 220,
    },
    {
      id: 'landfall-glider',
      scanName: 'RIDGE GLIDER',
      lore: 'A thermal-riding glider that wheels above the mesas at dusk.',
      plan: 'glider',
      sizeM: 1.4,
      palette: { primary: '#cfb289', secondary: '#8a6d4e', emissive: '#c8956a' },
      gaitHz: 1.4,
      temperament: 'curious',
      count: 5,
      seed: 0x1a02,
      roamRadius: 300,
    },
  ],
  entry: { glowColor: '#ffb27a', turbulence: 0.4 },
};

const TABLE: Partial<Record<BodyKind, BiomePreset>> = { ROCKY };

export function resolveBiome(kind: BodyKind): BiomePreset {
  return TABLE[kind] ?? ROCKY;
}
