import * as THREE from 'three';
import {
  matPipeDark,
  matLockerBody as matLockerBodyShared,
  matCounterTop,
  matConsoleHousing,
} from '../fx/propMaterials.js';
// ── Material singletons (shared with quartersDressing.ts) ─────────────────────
// v0.9 A-bridge: these were flat near-black MeshLambertMaterial (bunk frames,
// locker bodies, desk/shelf masses — confirmed void offenders). Redirected to
// the shared propMaterials PBR singletons so every consumer across
// quartersDressing.ts / quartersDressingB.ts / quartersRightWall.ts /
// quarters.ts picks up the fix automatically.

/** Structural/trim gunmetal — bunk frame posts+rails, hooks, reveal jambs. */
export const matGunmetal: THREE.MeshStandardMaterial = matPipeDark;
/** Slightly lighter slab for mattress. */
export const matMattress     = new THREE.MeshLambertMaterial({ color: 0x2e3038 });
/** Deep-red blanket band — Room A. */
export const matBlanketA     = new THREE.MeshLambertMaterial({ color: 0x7a2c1f });
/** Burnt-orange blanket band — Room B. */
export const matBlanketB     = new THREE.MeshLambertMaterial({ color: 0xc7641e });
/** Off-white pillow. */
export const matPillow       = new THREE.MeshLambertMaterial({ color: 0xd8d2c4 });
/** Locker body — painted-metal locker family. */
export const matLockerBody: THREE.MeshStandardMaterial = matLockerBodyShared;
/** Orange handle stripe on lockers. */
export const matLockerHandle = new THREE.MeshLambertMaterial({ color: 0xc7641e });
/** Shelf / nightstand surface — brushed dark-steel counter family. */
export const matShelf: THREE.MeshStandardMaterial = matCounterTop;
/** Cup / mug body. */
export const matCup          = new THREE.MeshLambertMaterial({ color: 0x3a3d45 });
/** Datapad body — console-housing family (paired with an emissive screen). */
export const matDatapad: THREE.MeshStandardMaterial = matConsoleHousing;
/** Emissive screen face — faint teal glow. */
export const matDataScreen   = new THREE.MeshBasicMaterial({ color: 0x1e8070 });
/** Teal emissive — reading light strip, tablet screen. */
export const matTealEmit     = new THREE.MeshBasicMaterial({ color: 0x46e0d8 });
/** Cream bezel for tablet / sill. */
export const matCream        = new THREE.MeshLambertMaterial({ color: 0xe8e2d4 });
/** Orange rim / flange / cabinet handles. */
export const matOrange       = new THREE.MeshLambertMaterial({ color: 0xc7641e });
/** Rust / red — toolboard hung-tool silhouettes for room A. */
export const matRust         = new THREE.MeshLambertMaterial({ color: 0x7a2c1f });
/** Teal potted plant (room B accent). */
export const matTealPlant    = new THREE.MeshLambertMaterial({ color: 0x2aaa96 });
