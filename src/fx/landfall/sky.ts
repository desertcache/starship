/**
 * src/fx/landfall/sky.ts — LANDFALL's sky dome + the world's only 2 lights.
 *
 * Unlike verdant's per-vertex dome (fx/world/worlds/verdantSky.ts — chosen
 * there to sidestep painting a texture), this one bakes a small vertical-
 * gradient CanvasTexture: zenith → horizon, plus a painted horizon band and a
 * few seeded, seamless (periodic-in-u) distant-relief silhouette streaks. A
 * texture buys those details cheaply; SphereGeometry's built-in UV.v runs 1
 * (top pole) → 0 (bottom pole) and a CanvasTexture's default flipY maps v=1 to
 * the canvas's TOP row, so "draw top-to-bottom, zenith-to-horizon" on the
 * canvas lines up with "top-of-dome-to-equator" on the sphere with no extra
 * bookkeeping.
 *
 * scene.fog color is set to the SAME horizon hex the dome paints at its
 * equator — the constitution rule (verdant.ts precedent): far terrain must
 * dissolve into the dome, never silhouette as a hard edge.
 */
import * as THREE from 'three';
import type { BiomePreset } from './biomes.js';
import { hexToRgb, lerpRgb } from '../space/noise.js';
import { makeRng } from '../space/rng.js';
import { LANDFALL_SEED } from '../../flight/landfallTuning.js';

// 1700, NOT ≥2000 (orchestrator probe finding): the shared camera's far plane
// is 2000. A world-fixed dome at radius 2000 z-clips a small cap of triangles
// exactly around the view axis whenever the camera sits displaced away from
// its look direction — a black "hole in the sky" at screen center (the
// four-round "pentagon"). The dome also FOLLOWS the player's XZ every frame
// (landfall.ts update) so its far side stays inside the far plane across the
// whole 1500m roam; a fog-colored backdrop following the camera is invisible.
const DOME_RADIUS = 1700;
const TEX_W = 1024;
const TEX_H = 512;
const SUN_DIST = 1000;

export interface LandfallSkyHandle {
  horizonColor: THREE.Color;
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  /** Follows the player's XZ each frame (landfall.ts) — see DOME_RADIUS note. */
  dome: THREE.Mesh;
  dispose(): void;
}

function buildSkyTexture(sky: BiomePreset['sky']): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext('2d')!;
  const zenith = hexToRgb(sky.zenith);
  const horizon = hexToRgb(sky.horizon);

  // Vertical gradient, zenith at canvas row 0 down to PURE horizon color AT
  // the equator row — and pure horizon for every row below it. Two bugs lived
  // here (orchestrator round-4, probe-verified): (1) the old pow bias over the
  // FULL canvas height left ~32% zenith tint at the equator row, so the dome
  // never quite matched scene.fog at the horizon line; (2) any non-horizon
  // paint below the equator shows through the unfogged strip between the far
  // shell's edge (±2km) and the dome's true horizon — dark sub-equator paint
  // was the hero shot's "black pentagon".
  const equatorRow = TEX_H / 2;
  for (let y = 0; y < TEX_H; y++) {
    const t = Math.min(1, y / equatorRow);
    const biased = Math.pow(t, 0.65);
    const c = lerpRgb(zenith, horizon, biased);
    ctx.fillStyle = `rgb(${c.r | 0},${c.g | 0},${c.b | 0})`;
    ctx.fillRect(0, y, TEX_W, 1);
  }

  // Distant-relief silhouette streaks: a handful of seeded, seamless (one
  // full sine period fits exactly `freq` times across u=0..1, so the left and
  // right texture edges always match) low bands right at the horizon line.
  //
  // bandY MUST sit at the sphere's true equator row, not below it: SphereGeo's
  // uv.y runs 1 (zenith pole) → 0 (nadir pole), and a CanvasTexture's default
  // flipY maps uv.y=1 to canvas row 0 — so the equator (world y=0, the actual
  // horizon) lands at canvas row TEX_H/2 exactly. Art-gate round 1 had this at
  // 0.62*TEX_H, well INSIDE the nadir half — entirely below the horizon plane,
  // so every streak was occluded by the ground mesh and never rendered at all.
  // Distant-mesa skyline (orchestrator round-3 rework): the earlier crossing
  // sine arcs read as an artificial wave pattern. Instead: two filled skyline
  // layers whose top edge is a seamless 1D value-noise profile — irregular
  // flat-topped silhouettes, like real distant mesas through haze. Layer color
  // stays NEAR the horizon color (never toward black — that's what produced
  // unnatural dark shapes): back layer 12% darker, front layer 22% darker.
  // Distant-mesa skyline: two filled layers whose top edge is a seamless 1D
  // value-noise profile. STRICTLY above the equator row — the fill's bottom
  // edge is the equator itself, never below (see the pentagon note above),
  // and shades stay near the horizon color (haze, not silhouette-black).
  const rng = makeRng(LANDFALL_SEED ^ 0x5eed1);
  const LATTICE = 24; // seamless: profile lattice wraps every TEX_W/LATTICE px
  for (const [darken, maxAmp, lift] of [[0.12, 14, 3], [0.22, 9, 1]] as const) {
    const shade = lerpRgb(horizon, { r: 20, g: 14, b: 10 }, darken);
    const lattice: number[] = [];
    for (let i = 0; i < LATTICE; i++) lattice.push(rng());
    ctx.fillStyle = `rgba(${shade.r | 0},${shade.g | 0},${shade.b | 0},0.55)`;
    ctx.beginPath();
    ctx.moveTo(0, equatorRow);
    for (let x = 0; x <= TEX_W; x += 4) {
      const g = (x / TEX_W) * LATTICE;
      const i0 = Math.floor(g) % LATTICE;
      const i1 = (i0 + 1) % LATTICE;
      const f = g - Math.floor(g);
      const s = f * f * (3 - 2 * f); // smoothstep — soft mesa shoulders
      const n = lattice[i0] + (lattice[i1] - lattice[i0]) * s;
      // Quantize the profile a touch so tops read flat (mesa benches).
      const stepped = Math.round(n * 3) / 3 * 0.7 + n * 0.3;
      ctx.lineTo(x, Math.min(equatorRow, equatorRow - lift - stepped * maxAmp));
    }
    ctx.lineTo(TEX_W, equatorRow);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildLandfallSky(scene: THREE.Scene, biome: BiomePreset): LandfallSkyHandle {
  const sky = biome.sky;
  const horizonColor = new THREE.Color(sky.horizon);

  const tex = buildSkyTexture(sky);
  const geo = new THREE.SphereGeometry(DOME_RADIUS, 32, 24);
  const mat = new THREE.MeshBasicMaterial({
    map: tex, side: THREE.BackSide, toneMapped: true, fog: false, depthWrite: false,
  });
  const dome = new THREE.Mesh(geo, mat);
  dome.name = 'landfall-sky-dome';
  dome.renderOrder = -10;
  scene.add(dome);

  // The dome covers the whole view — no separate flat background color.
  scene.background = null;
  // Fog color IS the dome's horizon color (same hex string both places).
  scene.fog = new THREE.Fog(sky.horizon, sky.fogNear, sky.fogFar);

  const hemi = new THREE.HemisphereLight(new THREE.Color(sky.zenith), new THREE.Color(sky.horizon), 0.7);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(new THREE.Color(sky.sunColor), 1.6);
  const elev = THREE.MathUtils.degToRad(sky.sunElevationDeg);
  const azi = THREE.MathUtils.degToRad(sky.sunAzimuthDeg);
  sun.position.set(
    Math.cos(elev) * Math.cos(azi) * SUN_DIST,
    Math.sin(elev) * SUN_DIST,
    Math.cos(elev) * Math.sin(azi) * SUN_DIST,
  );
  sun.castShadow = false; // no shadow budget in this world (see file header)
  scene.add(sun);

  return {
    horizonColor,
    sun,
    hemi,
    dome,
    dispose(): void {
      scene.remove(dome, hemi, sun);
      geo.dispose();
      mat.dispose();
      tex.dispose();
    },
  };
}
