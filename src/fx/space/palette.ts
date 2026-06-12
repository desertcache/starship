/**
 * Shared space-lane palette + hue families.
 *
 * Core palette (from the v0.4 brief):
 *   space   #0A0B10   teal #46E0D8   orange #C7641E
 *   cream   #E8E2D4   rust #7A2C1F
 *
 * All emissive space materials set toneMapped=false so the bloom threshold
 * (0.90) still picks them up after the OutputPass tone-map.
 */

export const PALETTE = {
  space: '#0A0B10',
  teal: '#46E0D8',
  orange: '#C7641E',
  cream: '#E8E2D4',
  rust: '#7A2C1F',
} as const;

export const PALETTE_HEX = {
  teal: 0x46e0d8,
  orange: 0xc7641e,
  cream: 0xe8e2d4,
  rust: 0x7a2c1f,
} as const;

/** A gas-giant hue family: ordered band colours + a rim/accent colour. */
export interface HueFamily {
  /** Band fill colours, dark→light, cycled across the latitude bands. */
  bands: string[];
  /** Base gradient stops top→bottom. */
  base: [string, string, string];
  /** Atmosphere rim + storm-spot accent colour (hex int). */
  accent: number;
}

/**
 * Four seeded gas-giant hue families so giants are not all teal/tan.
 *   (a) tan/amber   (b) jade/teal   (c) violet/rust   (d) pale-gold/cream
 */
export const HUE_FAMILIES: HueFamily[] = [
  {
    // (a) tan / amber
    bands: ['#C8894A', '#D4A052', '#b87040', '#7A2C1F', '#e8b870'],
    base: ['#7A2C1F', '#C8894A', '#D4A052'],
    accent: 0xc7641e,
  },
  {
    // (b) jade / teal — matches the established v0.3 canopy giant
    // Base lifted ~20% (was #1a3a5c/#2c5f8a/#4682b4) so the body reads vivid,
    // not a dim grey-blue sphere, once the terminator gradient darkens one side.
    bands: ['#27567f', '#3c79ab', '#5f9fd6', '#46E0D8', '#3c79ab'],
    base: ['#27567f', '#3c79ab', '#5f9fd6'],
    accent: 0x46e0d8,
  },
  {
    // (c) violet / rust storm — base lifted ~20% for the same reason.
    bands: ['#7a4f92', '#a85d88', '#C7641E', '#7A2C1F', '#a85d88'],
    base: ['#532f63', '#7a4f92', '#a85d88'],
    accent: 0xc7641e,
  },
  {
    // (d) pale-gold / cream
    bands: ['#E8E2D4', '#d4a052', '#b87040', '#c89a5a', '#E8E2D4'],
    base: ['#b87040', '#d4a052', '#E8E2D4'],
    accent: 0xe8e2d4,
  },
];
