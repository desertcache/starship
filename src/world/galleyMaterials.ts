/** Shared material singletons for the galley prop builders. */
import * as THREE from 'three';
import { matCounterTop, matLockerBody, matPipeDark } from '../fx/propMaterials.js';
// Palette
const C_CREAM      = 0xe8e2d4;
const C_ORANGE     = 0xc7641e;
const C_TEAL       = 0x46e0d8;
const C_RED_BASE   = 0x7a2c1f;
const C_RED_GLOW   = 0xcc3322;
const C_MUSTARD    = 0xc8931f;

const lm = (c: number): THREE.MeshLambertMaterial =>
  new THREE.MeshLambertMaterial({ color: c, side: THREE.FrontSide });
const bm = (c: number): THREE.MeshBasicMaterial =>
  new THREE.MeshBasicMaterial({ color: c, side: THREE.FrontSide });

// v0.9 A-bridge: counter/table/shelf/cookware gunmetal was flat near-black
// Lambert (#1C1E22) — crushed to a void under pooled lights. Now the shared
// propMaterials brushed dark-steel PBR singleton (lit, textured, envMap-aware).
const matGunmetal: THREE.MeshStandardMaterial = matCounterTop;
const matCream     = lm(C_CREAM);
const matOrange    = lm(C_ORANGE);
// Kickboard + bench-top trim — was near-black (#111214) flat Lambert.
const matDark: THREE.MeshStandardMaterial = matCounterTop;
const matRedBase   = lm(C_RED_BASE);
const matTealEmit  = bm(C_TEAL);
const matCoilGlow  = bm(C_RED_GLOW);
const matMustard      = lm(C_MUSTARD);
// v0.9 RADIANCE fix-round M6: fridge door strip, dedicated ~25% dimmer teal
// (0x46e0d8 scaled ×0.75) so the warm/teal rebalance doesn't have the fridge
// strip out-competing the new warm under-cabinet strip. Scoped to just this
// one mesh — matTealEmit stays full-strength everywhere else (baseboard
// strips, canisters, coffee cup, etc).
const matFridgeStrip  = bm(0x34a8a2);
export { matCounterTop, matGunmetal, matCream, matOrange, matDark, matRedBase, matTealEmit, matCoilGlow, matMustard, matFridgeStrip, matLockerBody, matPipeDark };
