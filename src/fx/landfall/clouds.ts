/**
 * src/fx/landfall/clouds.ts — v1.2 LANDFALL Stage 3: 4 horizontal cloud-shell
 * discs the descending camera punches through, thinning to 0-2 high shells
 * once the walk begins (world/worlds/landfall.ts passes `walkMode`, derived
 * from fx/landfall/descent.ts's phase — this file has no dependency on that
 * module at all, kept a pure function of the params it's given each tick).
 *
 * Each shell is one big flat disc (shared geometry, one CanvasTexture alpha
 * mask reused across all 4 — only per-shell opacity differs) that follows the
 * player's XZ every frame, same "stay under the far plane" reasoning as
 * sky.ts's dome. Opacity fades as the camera's altitude nears a shell's own
 * altitude so passing through never shows a flat wall (`|camY - altitude|`
 * punch-through fade). `fog:false` mirrors the sky dome's own choice — this
 * is the same "big sky" layer, not ground-level atmospheric haze.
 */
import * as THREE from 'three';
import type { BiomePreset } from './biomes.js';
import { hexToRgb, lerpRgb, makeNoiseGrid, fbmWrap } from '../space/noise.js';
import { makeRng } from '../space/rng.js';

const SHELL_ALTS = [650, 500, 380, 260] as const;
const SHELL_RADIUS = 1200;
const TEX_SIZE = 512;
const PUNCH_FADE_RANGE = 60; // meters — |camY - altitude| band the shell fades out over
const DRIFT_SPEED_U = 0.004; // texture-UV units / second
const DRIFT_SPEED_V = 0.0024;
const CLOUD_SEED = 0x1a4d ^ 0xc10d;

interface Shell {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  altitude: number;
  baseOpacity: number;
}

export interface CloudsHandle {
  /** `walkMode` — true once WALK/NONE (roaming); false during ENTRY/BRAKE/
   *  TOUCHDOWN. Caller derives this from descent.ts's getPhase(). `coverage`
   *  (Stage 5) — optional 0..1 override for how many high shells stay
   *  resident in walkMode; defaults to the biome's static base so callers
   *  that never pass it (none left, but kept optional for the same
   *  precedent as clouds.ts's own walkMode/weather split) see unchanged
   *  behavior. world/worlds/landfall.ts passes weather.cloudCoverage. */
  tick(dt: number, playerPos: THREE.Vector3, walkMode: boolean, coverage?: number): void;
  dispose(): void;
}

function buildCloudTexture(colors: readonly [string, string]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_SIZE;
  canvas.height = TEX_SIZE;
  const ctx = canvas.getContext('2d')!;
  const rng = makeRng(CLOUD_SEED);
  const grid = makeNoiseGrid(rng, 32);
  const c0 = hexToRgb(colors[0]);
  const c1 = hexToRgb(colors[1]);
  const img = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  for (let y = 0; y < TEX_SIZE; y++) {
    const v = y / TEX_SIZE;
    for (let x = 0; x < TEX_SIZE; x++) {
      const u = x / TEX_SIZE;
      const n = fbmWrap(grid, 32, u, v, 5, 5, 4); // ~[-1,1]
      const coverage = THREE.MathUtils.smoothstep(n, -0.15, 0.45);
      const c = lerpRgb(c0, c1, n * 0.5 + 0.5);
      const idx = (y * TEX_SIZE + x) * 4;
      img.data[idx] = c.r;
      img.data[idx + 1] = c.g;
      img.data[idx + 2] = c.b;
      img.data[idx + 3] = Math.round(coverage * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function attachClouds(scene: THREE.Scene, biome: BiomePreset): CloudsHandle {
  const tex = buildCloudTexture(biome.clouds.colors);
  const geo = new THREE.CircleGeometry(SHELL_RADIUS, 40);
  geo.rotateX(-Math.PI / 2);

  const shells: Shell[] = SHELL_ALTS.map((alt, i) => {
    const material = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      fog: false, opacity: 0,
    });
    const mesh = new THREE.Mesh(geo, material);
    mesh.name = `landfall-cloud-shell-${i}`;
    mesh.position.y = alt;
    mesh.renderOrder = -5;
    scene.add(mesh);
    return { mesh, material, altitude: alt, baseOpacity: 0.45 + 0.2 * (1 - i / SHELL_ALTS.length) };
  });

  let driftT = 0;

  function tick(dt: number, playerPos: THREE.Vector3, walkMode: boolean, coverage?: number): void {
    driftT += dt;
    tex.offset.set(driftT * DRIFT_SPEED_U, driftT * DRIFT_SPEED_V);
    // Stage 5: recomputed every tick (cheap — 2 ops) rather than baked once
    // at attach time, so weather's live coverage (storm/overcast bump) can
    // actually change which high shells stay resident once walking.
    const keepCount = THREE.MathUtils.clamp(Math.round((coverage ?? biome.clouds.coverage) * 2), 0, 2);
    for (let i = 0; i < shells.length; i++) {
      const s = shells[i];
      s.mesh.position.x = playerPos.x;
      s.mesh.position.z = playerPos.z;
      const keep = !walkMode || i < keepCount;
      if (!keep) {
        s.material.opacity = 0;
        continue;
      }
      const distY = Math.abs(playerPos.y - s.altitude);
      const fade = THREE.MathUtils.smoothstep(distY, 0, PUNCH_FADE_RANGE);
      s.material.opacity = s.baseOpacity * fade;
    }
  }

  function dispose(): void {
    geo.dispose();
    tex.dispose();
    for (const s of shells) {
      scene.remove(s.mesh);
      s.material.dispose();
    }
  }

  return { tick, dispose };
}
