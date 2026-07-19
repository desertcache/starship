/**
 * src/flight/destinationVisual.ts — construction + close-range art for the
 * seeded destination planet (v1.2 LANDFALL Stage 0 P2, split out of
 * approach.ts to respect the 300-line cap). approach.ts owns ALL state/logic
 * (trueDist, HOLD machine, tick, snapshot); this file owns the THREE objects:
 * the createBody() call, the hero-detail surface, the cloud shell, the
 * night-side embers, and the fresnel haze.
 *
 * RNG SAFETY (prime rule): `buildDestinationVisual(rng, bearing)` consumes
 * the CALLER-OWNED `rng` in exactly one place — the single
 * `createBody(rng, 'ROCKY', BAKED_RADIUS)` call below, byte-identical to the
 * pre-split code (approach.ts still creates `makeRng(0xE57A)`, passed in at
 * the same point in the sequence). generateBodyName draws AFTER createBody's
 * texture draws, so Test 14's target=MERIDIAN-319 XII is the determinism
 * canary for that chain; Test 7 (director's own stream) is untouched.
 *
 * Everything in the close-range art pass below draws from a SEPARATE derived
 * stream — `makeRng(0xE57A ^ 0x5A5A)` — created only AFTER createBody()
 * returns, so it can never insert/reorder a draw on the primary chain.
 */
import * as THREE from 'three';
import { createBody, type Body } from '../fx/space/bodies.js';
import { makeRng, type Rng } from '../fx/space/rng.js';
import {
  makeCanvas,
  finalize,
  applyTerminator,
  applyLimbDarkening,
} from '../fx/space/bodyTextures.js';
import { makeNoiseGrid, fbmWrap, applyGrain } from '../fx/space/noise.js';

/** createBody's own baked sphere radius (radius>=50 → hero detail). Exported
 *  so approach.ts's renderScale math (renderScale / BAKED_RADIUS) shares the
 *  one definition. */
export const BAKED_RADIUS = 100;
const HAZE_SCALE = 1.16; // haze shell radius as a fraction of BAKED_RADIUS
const CLOUD_SCALE = 1.03; // cloud shell radius as a fraction of BAKED_RADIUS
const CLOUD_SPIN_RATE = 0.008; // rad/s — VERY slow, dt-accumulated (never wall-clock)
const DEST_SURFACE_SIZE = 1024;
const DERIVED_SEED = 0xe57a ^ 0x5a5a; // independent stream — see header

// Fraction of a turn the sub-solar longitude is offset from dead-center of the
// approach view. 0 = fully lit disc from the cockpit; 0.12 pulls the painted
// terminator INSIDE the visible disc — ~3/4 of the face lit, the rest night
// with ember glints. Merge-gate finding: the pre-merge seeded lightU landed
// the entire lit hemisphere on the FAR side, so approach-hold/mid shots showed
// a near-black disc and none of the hero-surface art. lightU is now COMPUTED
// from the approach geometry (see buildDestinationVisual) — deterministic by
// construction, no rng draw involved.
const LIT_OFFSET = 0.12;

// Steeper than bodies.ts's addAtmosphere (2.4) — a shallower power washed
// teal across the whole disc at HOLD's ~65%-of-FOV size (verify:headed
// finding). Intensity + white-mix tuned down from the pre-art-pass 0.55/0.5
// (task 2.4) — the brighter hero surface needs less rim wash to avoid
// blowing out the limb.
const HAZE_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;
const HAZE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float ndotv = dot(normalize(vNormal), normalize(vViewDir));
    float rim = clamp(1.0 - abs(ndotv), 0.0, 1.0);
    float alpha = pow(rim, 4.0) * uIntensity;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), rim * 0.35), alpha);
  }
`;

interface SpotStop { stop: number; rgb: string; alphaMul: number; }

const MARE_STOPS: SpotStop[] = [{ stop: 0, rgb: '40,34,28', alphaMul: 1 }];
const CRATER_STOPS: SpotStop[] = [
  { stop: 0, rgb: '30,24,20', alphaMul: 1 },
  { stop: 0.6, rgb: '60,52,44', alphaMul: 0.5 },
  { stop: 0.85, rgb: '160,150,138', alphaMul: 0.5 },
];

export interface DestinationVisual {
  group: THREE.Group;
  body: Body;
}

let cloudMesh: THREE.Mesh | null = null;
let cloudSpin = 0;

/** Radial-gradient spot painter (mare patches / crater tiers) — ported from
 *  bodyTextures.ts's local (non-exported) paintCraters so this module can
 *  layer MORE tiers than the shared rockyTexture needs at encounter range. */
function paintSpots(
  ctx: CanvasRenderingContext2D,
  rng: Rng,
  size: number,
  count: number,
  rRange: [number, number],
  aRange: [number, number],
  stops: SpotStop[],
): void {
  for (let i = 0; i < count; i++) {
    const cx = rng() * size;
    const cy = rng() * size;
    const cr = rng.range(rRange[0], rRange[1]) * size;
    const a = rng.range(aRange[0], aRange[1]);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    for (const s of stops) grad.addColorStop(s.stop, `rgba(${s.rgb},${a * s.alphaMul})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Warm ember/outpost glints on the deep-night longitudes only (task 2.3 —
 *  the away-from-sun limb currently goes flat). Drawn AFTER applyTerminator
 *  so the multiply-darken pass doesn't dim them; they read as light sources. */
function addNightEmbers(ctx: CanvasRenderingContext2D, rng: Rng, size: number, lightU: number): void {
  const count = rng.int(18, 30);
  for (let i = 0; i < count; i++) {
    const u = rng();
    let d = u - lightU;
    if (d > 0.5) d -= 1;
    if (d < -0.5) d += 1;
    const lit = (Math.cos(d * Math.PI * 2) + 1) * 0.5;
    if (lit > 0.22) continue; // deep-night longitudes only
    const v = rng();
    const x = u * size;
    const y = v * size;
    const r = rng.range(0.004, 0.012) * size;
    const warm = rng() < 0.6 ? '255,150,60' : '255,90,40';
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${warm},0.9)`);
    grad.addColorStop(0.4, `rgba(${warm},0.5)`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Destination-only 1024 surface (task 2.1): more mare + a fine/coarse crater
 *  tier pair + a second grain pass than the shared rockyTexture carries, so
 *  it survives being seen at ~65% of the FOV at HOLD, not a distant glimpse. */
function destinationSurfaceTexture(rng: Rng, lightU: number): THREE.CanvasTexture {
  const size = DEST_SURFACE_SIZE;
  const { canvas, ctx } = makeCanvas(size);

  const baseShades = ['#6a5a4a', '#776657', '#8a7a66', '#5e5042'];
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, rng.choice(baseShades));
  bg.addColorStop(1, rng.choice(baseShades));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  paintSpots(ctx, rng, size, rng.int(10, 14), [0.07, 0.17], [0.35, 0.55], MARE_STOPS);
  paintSpots(ctx, rng, size, rng.int(40, 56), [0.008, 0.035], [0.25, 0.5], CRATER_STOPS); // fine tier
  paintSpots(ctx, rng, size, rng.int(14, 22), [0.04, 0.08], [0.2, 0.4], CRATER_STOPS); // large weathered tier

  applyGrain(canvas, ctx, rng, 0.1);
  applyGrain(canvas, ctx, rng, 0.05); // second pass, own seeded grid — extra detail octave

  applyLimbDarkening(canvas, ctx);
  applyTerminator(canvas, ctx, lightU);
  addNightEmbers(ctx, rng, size, lightU);

  return finalize(canvas);
}

/** Swap the createBody()-baked rockyTexture for the destination-only hero
 *  variant above; disposes the replaced texture (constitution's dispose rule). */
function applyHeroSurface(body: Body, rng: Rng, lightU: number): void {
  const core = body.group.getObjectByName('body-core') as THREE.Mesh | undefined;
  if (!core) return;
  const mat = core.material as THREE.MeshBasicMaterial;
  const oldTex = mat.map;
  mat.map = destinationSurfaceTexture(rng, lightU);
  mat.needsUpdate = true;
  oldTex?.dispose();
}

/** Sparse wispy alpha cloud pattern via the same toroidal fbm helpers
 *  giantTexture.ts uses for cloud-flow shading (task 2.2). */
function cloudAlphaTexture(rng: Rng): THREE.CanvasTexture {
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  ctx.clearRect(0, 0, size, size);
  const n = 48;
  const grid = makeNoiseGrid(rng, n);
  // Merge-gate retune: the first pass (cycles 3-5, threshold 0.15, gain 1.4)
  // read as dense white static at HOLD scale. Fewer/bigger structures
  // (cycles 2), horizontal band-stretch (vScale 0.35), higher threshold and
  // softer gain → sparse flowing weather bands instead of noise.
  const cyclesX = 2;
  const img = ctx.createImageData(size, size);
  const data = img.data;
  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const n1 = fbmWrap(grid, n, u, v, cyclesX, cyclesX * 0.35, 4);
      const wisp = Math.max(0, n1 - 0.32) * 1.1; // threshold → sparse bands, not a solid overcast
      const idx = (y * size + x) * 4;
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = Math.min(255, wisp * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  return finalize(canvas);
}

/** Cloud-band shell slightly above the surface — self-rotates VERY slowly
 *  via tickDestinationVisual(dt) (task 2.2). Returns the mesh so the caller
 *  can stash it for the tick hook. */
function addCloudShell(group: THREE.Group, rng: Rng): THREE.Mesh {
  const tex = cloudAlphaTexture(rng);
  const geo = new THREE.SphereGeometry(BAKED_RADIUS * CLOUD_SCALE, 48, 32);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    opacity: 0.4,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'destination-clouds';
  group.add(mesh);
  return mesh;
}

/** Fresnel haze shell — ported verbatim from the pre-split approach.ts
 *  (task 2.4 retunes uIntensity/white-mix only; geometry/blending unchanged). */
function addHaze(group: THREE.Group): void {
  const hazeGeo = new THREE.SphereGeometry(BAKED_RADIUS * HAZE_SCALE, 64, 48);
  const hazeMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x9fd8c8) },
      uIntensity: { value: 0.45 },
    },
    vertexShader: HAZE_VERT,
    fragmentShader: HAZE_FRAG,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const haze = new THREE.Mesh(hazeGeo, hazeMat);
  haze.name = 'destination-haze';
  group.add(haze);
}

/** Build the destination planet + close-range art layers. `rng` MUST be the
 *  caller's own makeRng(0xE57A), passed at the same point in the sequence as
 *  the pre-split code (see header). `bearing` (approach.ts's BEARING) is used
 *  for the pole-pinch tilt only — it carries no rng draws. */
export function buildDestinationVisual(rng: Rng, bearing: THREE.Vector3): DestinationVisual {
  const body = createBody(rng, 'ROCKY', BAKED_RADIUS);
  body.group.name = 'destination-planet';

  // Pole-pinch fix: tilt the body once so its texture pole axis (local +Y)
  // points perpendicular to the approach bearing instead of world-up.
  const poleAxis = new THREE.Vector3().crossVectors(bearing, new THREE.Vector3(0, 1, 0)).normalize();
  body.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), poleAxis);

  // Lit-face orientation (merge fix): compute the sub-solar longitude so the
  // painted terminator faces the approach camera instead of landing wherever
  // the seed put it. The camera looks along +bearing (planet sits at
  // bearing×renderDist), so the planet longitude facing the camera is the
  // local-frame direction of -bearing. THREE.SphereGeometry maps texture u to
  // azimuth φ as (x,z) = (-cos φ, sin φ)·sinθ, hence φ = atan2(z, -x).
  const localCamDir = bearing
    .clone()
    .negate()
    .applyQuaternion(body.group.quaternion.clone().invert());
  const phi = Math.atan2(localCamDir.z, -localCamDir.x);
  const lightU = ((phi / (Math.PI * 2)) + LIT_OFFSET + 1) % 1;

  // Independent derived stream from here on — zero effect on the primary
  // rng chain consumed by createBody() above.
  const drng = makeRng(DERIVED_SEED);
  applyHeroSurface(body, drng, lightU);
  cloudMesh = addCloudShell(body.group, drng);
  addHaze(body.group);

  return { group: body.group, body };
}

/** approach.ts's tickApproach() calls this every ship-frame with the SAME dt
 *  it uses elsewhere — cloud spin is dt-accumulated, NEVER wall-clock, so
 *  headless verify stays deterministic. No-op before buildDestinationVisual(). */
export function tickDestinationVisual(dt: number): void {
  if (!cloudMesh) return;
  cloudSpin += dt * CLOUD_SPIN_RATE;
  cloudMesh.rotation.y = cloudSpin;
}
