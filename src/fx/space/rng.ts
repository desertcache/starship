/**
 * Seeded deterministic RNG — mulberry32.
 *
 * A small, fast 32-bit PRNG. Given the same seed it produces the same stream,
 * which the space director relies on for deterministic verify screenshots.
 *
 * Usage:
 *   const rng = makeRng(0x5747);
 *   rng();              // float in [0, 1)
 *   rng.range(9, 24);   // float in [9, 24)
 *   rng.int(0, 11);     // integer in [0, 11]
 *   rng.pick(weights);  // weighted index via CDF
 */

export interface Rng {
  /** Next float in [0, 1). */
  (): number;
  /** Float in [min, max). */
  range(min: number, max: number): number;
  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number;
  /** Signed float in [-mag, +mag). */
  signed(mag: number): number;
  /** Weighted choice — returns index into `weights` via CDF. */
  pick(weights: readonly number[]): number;
  /** Uniform pick from an array. */
  choice<T>(arr: readonly T[]): T;
}

/** Build a seeded mulberry32 RNG with convenience helpers. */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;

  const next = (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const rng = next as Rng;

  rng.range = (min: number, max: number): number => min + next() * (max - min);

  rng.int = (min: number, max: number): number =>
    Math.floor(min + next() * (max - min + 1));

  rng.signed = (mag: number): number => (next() * 2 - 1) * mag;

  rng.pick = (weights: readonly number[]): number => {
    let total = 0;
    for (const w of weights) total += w;
    const r = next() * total;
    let acc = 0;
    for (let i = 0; i < weights.length; i++) {
      acc += weights[i];
      if (r < acc) return i;
    }
    return weights.length - 1;
  };

  rng.choice = <T>(arr: readonly T[]): T => arr[Math.floor(next() * arr.length)];

  return rng;
}
