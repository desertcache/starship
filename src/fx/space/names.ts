/**
 * Seeded body name generator.
 *
 * Produces catalogue-style names for procedural bodies, e.g.
 *   'KEPLER-DRIFT VII', 'STREL-9 / b', 'OORT-114 MAJORIS', 'CYGNI-7'.
 *
 * Format = PREFIX + '-' + 1..3-digit number
 *          + optional roman numeral (I..XII) OR letter designator (/b /c /d)
 *          + optional standalone descriptor (MAJORIS / DRIFT / ...).
 *
 * Deterministic for a given Rng stream so verify screenshots are stable.
 */

import type { Rng } from './rng.js';

const PREFIXES = [
  'KEPLER', 'STREL', 'OORT', 'VANTH', 'CYGNI', 'HELION',
  'ERIDU', 'TYCHO', 'ABYSSAL', 'MERIDIAN', 'HALLOW', 'DRACO',
] as const;

const ROMANS = [
  'I', 'II', 'III', 'IV', 'V', 'VI',
  'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
] as const;

const LETTERS = ['b', 'c', 'd'] as const;

const DESCRIPTORS = ['MAJORIS', 'DRIFT', 'REACH', 'EXPANSE', 'PRIME'] as const;

/** Generate a seeded catalogue name for one body. */
export function generateBodyName(rng: Rng): string {
  const prefix = rng.choice(PREFIXES);
  const num = rng.int(1, 999);

  let name = `${prefix}-${num}`;

  // Suffix: ~40% roman numeral, ~25% letter designator, ~35% none.
  const suffixRoll = rng();
  if (suffixRoll < 0.4) {
    name += ` ${rng.choice(ROMANS)}`;
  } else if (suffixRoll < 0.65) {
    name += ` / ${rng.choice(LETTERS)}`;
  }

  // Optional descriptor (~30%).
  if (rng() < 0.3) {
    name += ` ${rng.choice(DESCRIPTORS)}`;
  }

  return name;
}
