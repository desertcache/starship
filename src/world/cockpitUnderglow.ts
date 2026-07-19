/**
 * Cockpit lower-half emissive underglow — v1.2 LANDFALL Stage 0 P3.
 *
 * The seats/floor/console-base band sinks to near-black under the pooled
 * rig. The interior lighting rig is FROZEN (no new ship lights without
 * retiring one — see CLAUDE.md), so the fix is emissive geometry: two thin
 * gradient-canvas floor planes that fake bounce light without touching a
 * single THREE.Light.
 *
 * Both washes share one texture shape — bright at the top UV edge (V=1),
 * fading to fully transparent at the bottom (V=0) — and rely on a
 * rotation.x = -PI/2 floor-lay to point that bright edge toward the fore
 * wall (-Z, canopy/console side). toneMapped:true + default (non-additive)
 * alpha blending keeps both well under the 0.84 bloom threshold: this is a
 * lift out of near-black, not a light show.
 */
import * as THREE from 'three';
import { cached } from '../fx/textureHelpers.js';

const FOOTWELL_RGB     = '255,226,192'; // #ffe2c0 warm — footwell spill
const CONSOLE_BASE_RGB = '70,224,216';  // #46E0D8 teal — console screen spill

/** Linear-gradient fade texture: bright at the canvas top, transparent at the bottom. */
function makeFadeTexture(key: string, rgb: string, peakAlpha: number): THREE.CanvasTexture {
  return cached(key, () => {
    const W = 32, H = 64;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0.00, `rgba(${rgb},${peakAlpha.toFixed(2)})`);
    grad.addColorStop(0.55, `rgba(${rgb},${(peakAlpha * 0.35).toFixed(2)})`);
    grad.addColorStop(1.00, `rgba(${rgb},0.0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, true); // color-authored gradient — decode as sRGB
}

const matFootwell = new THREE.MeshBasicMaterial({
  map: makeFadeTexture('cockpit-footwell-fade', FOOTWELL_RGB, 0.30),
  transparent: true,
  depthWrite: false,
  toneMapped: true,
});

const matConsoleBase = new THREE.MeshBasicMaterial({
  map: makeFadeTexture('cockpit-console-base-fade', CONSOLE_BASE_RGB, 0.22),
  transparent: true,
  depthWrite: false,
  toneMapped: true,
});

/** Add one floor-lying wash plane. Bright edge lands at z - d/2 (fore side). */
function addFloorWash(
  group: THREE.Group,
  mat: THREE.MeshBasicMaterial,
  x: number, z: number, w: number, d: number,
): void {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.004, z); // 4mm proud of floor — anti-z-fight
  group.add(mesh);
}

/**
 * Dress the cockpit floor with lower-half underglow. Call once from
 * addCockpitProps, after seats + console bank exist. Room-local coords
 * (cockpit.ts: 6W x 3H x 5D, console front face at Z=-1.93, seats at
 * x=+/-0.90, Z=0.3).
 */
export function addCockpitUnderglow(group: THREE.Group): void {
  // Console base — teal, hugs the console's front face, fades out ~0.6m
  // toward the seats. The console screens are the cockpit's light story, so
  // their spill reads teal.
  addFloorWash(group, matConsoleBase, 0, -1.63, 4.0, 0.6);

  // Footwells — warm, one per seat, bright edge continuing the fade toward
  // the console, transparent right at the seat front (as if console-side
  // ambient spills down into where a pilot's feet would sit).
  for (const x of [-0.90, 0.90] as const) {
    addFloorWash(group, matFootwell, x, -0.55, 0.62, 1.0);
  }
}
