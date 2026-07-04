/**
 * src/world/worlds/verdantSky.ts — deep-dusk gradient sky dome + 2 self-lit
 * moons for the VERDANT pocket world.
 *
 * The dome uses a per-VERTEX color ramp (violet-indigo zenith → teal horizon)
 * rather than an equirect CanvasTexture — this sidesteps SphereGeometry's UV
 * v-direction ambiguity entirely (same reasoning as terrain.ts's vertex-color
 * ramp) while staying just as cheap (one draw, no texture sample).
 *
 * Moons bake their OWN CanvasTexture (base tint + craters + gentle limb
 * vignette, NO terminator). Art-gate round 1 used bodyTextures.moonTexture,
 * whose seeded baked terminator happened to face the dark side at us — the
 * hero moon read as a black blob. These moons hang in OUR sky, so they stay
 * fully lit ("self-lit" per the lane spec).
 *
 * Both the dome and moons set `material.fog = false` — they sit far outside
 * the glade's ground fog falloff and must never fade toward the fog color.
 */
import * as THREE from 'three';
import { makeRng, type Rng } from '../../fx/space/rng.js';
import { hexToRgb, lerpRgb } from '../../fx/space/noise.js';

const DOME_RADIUS = 340;
// F11 (Stage E): deepened/saturated slightly vs the prior '#2a1d4e' (less
// grey lift at the top of the dusk gradient).
const ZENITH = '#221648'; // deep violet-indigo (extra saturation survives ACES)
const HORIZON = '#1c4a46'; // teal horizon band — MUST equal verdant.ts fog color

export interface VerdantSkyHandle {
  group: THREE.Group;
  update(dt: number): void;
  dispose(): void;
}

function buildDome(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(DOME_RADIUS, 28, 18);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const zenith = hexToRgb(ZENITH);
  const horizon = hexToRgb(HORIZON);
  for (let i = 0; i < pos.count; i++) {
    // Normalized height on the dome: -1 (bottom pole) .. 1 (top pole).
    const ny = pos.getY(i) / DOME_RADIUS;
    const t = Math.max(0, Math.min(1, ny * 0.5 + 0.5));
    // Exponent > 1 keeps the teal horizon band TALL: the far terrain rim
    // (fully fog-colored at that distance) then dissolves into a matching
    // dome color instead of silhouetting as a jagged black edge (art-gate
    // fix, round 1 — pow 0.55 squeezed the band so thin the rim sat
    // against bright violet). 1.4 (round 3, down from 1.7) restores the
    // violet-indigo presence in the upper half without losing the blend.
    const biased = Math.pow(t, 1.4);
    const c = lerpRgb(horizon, zenith, biased);
    colors[i * 3] = c.r / 255;
    colors[i * 3 + 1] = c.g / 255;
    colors[i * 3 + 2] = c.b / 255;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.BackSide,
    // toneMapped TRUE (round 3): fog-colored far terrain goes through ACES;
    // if the dome bypasses tone mapping, the identical hex renders brighter
    // on the dome and the terrain rim silhouettes as a dark seam. Same
    // mapping path on both sides = seamless dissolve.
    toneMapped: true,
    fog: false,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'verdant-sky-dome';
  mesh.renderOrder = -10;
  return mesh;
}

/** Fully-lit moon face: tinted base, soft craters, gentle limb vignette. */
function bakeMoonTexture(rng: Rng, baseHex: string, shadeHex: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, size, size);

  const craters = rng.int(10, 16);
  for (let i = 0; i < craters; i++) {
    const cx = rng() * size;
    const cy = rng() * size;
    const cr = rng.range(0.04, 0.12) * size;
    const a = rng.range(0.18, 0.34);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    grad.addColorStop(0, `rgba(20,22,30,${a})`);
    grad.addColorStop(0.7, `rgba(20,22,30,${a * 0.4})`);
    grad.addColorStop(0.88, `rgba(255,255,255,${a * 0.35})`); // bright rim
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mare-like darker patches in the shade tint. F11 (Stage E): more of them,
  // a touch stronger, so the face reads as a body instead of a featureless
  // egg (was 3-5 @ 0.4 alpha).
  const shade = hexToRgb(shadeHex);
  const mares = rng.int(5, 8);
  for (let i = 0; i < mares; i++) {
    const cx = rng() * size;
    const cy = rng() * size;
    const cr = rng.range(0.1, 0.22) * size;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    grad.addColorStop(0, `rgba(${shade.r},${shade.g},${shade.b},0.5)`);
    grad.addColorStop(1, `rgba(${shade.r},${shade.g},${shade.b},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }

  // F11 (Stage E): faint horizontal banding — a few low-alpha latitude
  // streaks in the shade tint, breaking up the otherwise-smooth face.
  const bands = rng.int(4, 6);
  for (let i = 0; i < bands; i++) {
    const by = rng() * size;
    const bh = rng.range(0.02, 0.05) * size;
    ctx.fillStyle = `rgba(${shade.r},${shade.g},${shade.b},${rng.range(0.08, 0.16).toFixed(3)})`;
    ctx.fillRect(0, by, size, bh);
  }

  // Gentle latitude vignette only (equator bright, poles a touch darker) —
  // enough shape to read as a sphere, never a terminator.
  const prevOp = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = 'multiply';
  for (let y = 0; y < size; y++) {
    const d = Math.abs(y / size - 0.5) * 2;
    const g = Math.round((1 - 0.35 * Math.pow(d, 2.0)) * 255);
    ctx.fillStyle = `rgb(${g},${g},${g})`;
    ctx.fillRect(0, y, size, 1);
  }
  ctx.globalCompositeOperation = prevOp;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface MoonSpec {
  seed: number;
  radius: number;
  position: THREE.Vector3;
  spinSpeed: number;
  base: string;
  shade: string;
}

// Both placed over the -Z horizon the hero camera faces from the spawn pad:
// big pale-lavender moon upper right, small teal-grey companion center-left.
// F11 (Stage E): darker base tints — was reading as an overbright blank egg.
const MOON_SPECS: MoonSpec[] = [
  { seed: 0x7a55, radius: 13, position: new THREE.Vector3(140, 95, -210), spinSpeed: 0.006, base: '#9a9dc0', shade: '#6f6a9c' },
  { seed: 0x7a66, radius: 8, position: new THREE.Vector3(-60, 78, -255), spinSpeed: -0.009, base: '#7ea89e', shade: '#4a6f68' },
];

function buildMoon(spec: MoonSpec): THREE.Mesh {
  const rng = makeRng(spec.seed);
  const tex = bakeMoonTexture(rng, spec.base, spec.shade);
  const geo = new THREE.SphereGeometry(spec.radius, 22, 16);
  // F11: material-level dim on top of the darker bake (0xcccccc ≈ 0.8x).
  const mat = new THREE.MeshBasicMaterial({ map: tex, color: 0xcccccc, fog: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'verdant-moon';
  mesh.position.copy(spec.position);
  mesh.userData.spinSpeed = spec.spinSpeed;
  return mesh;
}

export function buildVerdantSky(): VerdantSkyHandle {
  const group = new THREE.Group();
  group.name = 'verdant-sky';

  const dome = buildDome();
  group.add(dome);

  const moons = MOON_SPECS.map(buildMoon);
  for (const m of moons) group.add(m);

  return {
    group,
    update(dt: number): void {
      for (const m of moons) {
        m.rotation.y += (m.userData.spinSpeed as number) * dt;
      }
    },
    dispose(): void {
      dome.geometry.dispose();
      (dome.material as THREE.Material).dispose();
      for (const m of moons) {
        m.geometry.dispose();
        (m.material as THREE.MeshBasicMaterial).map?.dispose();
        (m.material as THREE.Material).dispose();
      }
    },
  };
}
