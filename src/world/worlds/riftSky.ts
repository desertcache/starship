/**
 * src/world/worlds/riftSky.ts — the RIFT starfield abyss: near-black violet
 * background, an alien-palette star shell (REUSES buildStarLayer — only the
 * baked color attribute is remapped, see riftTextures.tintStarsAlien), and
 * 2-3 impossible-color nebula washes (REUSES createNebulaField with a local
 * config array). `spherical:true` scatters stars on a full shell around the
 * origin so the abyss reads as bottomless in every direction, including
 * looking straight down off an island edge.
 */

import * as THREE from 'three';
import { buildStarLayer, setStarUniforms, disposeStarLayer } from '../../fx/space/starLayer.js';
import { createNebulaField, type NebulaField, type NebulaConfig } from '../../fx/space/nebula.js';
import { makeRng } from '../../fx/space/rng.js';
import { tintStarsAlien } from './riftTextures.js';

const STAR_SEED = 0x7104;
const SHELL_SPAN = 420; // shell radius = span/2 = 210m — well beyond island/bridge/camera range

// Positions tuned to the two verify cameras: magenta sits in the hero cam's
// ENE sightline (bearing ~24°, elev ~20°); teal sits in the qa cam's westward
// sightline; violet hangs high south for free-look drama.
const RIFT_NEBULAE: NebulaConfig[] = [
  {
    name: 'rift-nebula-magenta',
    colors: ['rgba(160,20,140,1)', 'rgba(255,80,220,1)'],
    position: new THREE.Vector3(140, 60, 60),
    scale: [170, 130],
    opacity: 0.22,
  },
  {
    name: 'rift-nebula-teal',
    colors: ['rgba(10,90,110,1)', 'rgba(60,220,210,1)'],
    position: new THREE.Vector3(-160, 50, -20),
    scale: [190, 145],
    opacity: 0.19,
  },
  {
    name: 'rift-nebula-violet',
    colors: ['rgba(60,10,120,1)', 'rgba(140,80,255,1)'],
    position: new THREE.Vector3(30, 90, 160),
    scale: [160, 120],
    opacity: 0.16,
  },
];

export interface RiftSky {
  stars: THREE.Points;
  nebulae: NebulaField;
  update(dt: number): void;
  dispose(): void;
}

/** Build the RIFT sky and add it directly to `scene`. Sets scene.background
 *  + a short-falloff violet fog (immune to the raw-shader star/nebula
 *  materials, which don't consume scene.fog — only terrain/crystals fade). */
export function buildRiftSky(scene: THREE.Scene): RiftSky {
  scene.background = new THREE.Color('#07030f');
  // Far-start fog: the bridge (~40m) and side island (~55m) must stay legible
  // from the hero cam; fog only softens the island rims into the abyss.
  scene.fog = new THREE.Fog(0x0b0518, 40, 160);

  const rand = makeRng(STAR_SEED);
  const stars = buildStarLayer({
    count: 3400, // denser than ship space — this is a small bounded sky
    xHalf: SHELL_SPAN / 2,
    yHalf: SHELL_SPAN / 2,
    zMin: -SHELL_SPAN / 2,
    span: SHELL_SPAN,
    sizeMin: 1.1,
    sizeMax: 3.4,
    spherical: true,
    rand,
  });
  tintStarsAlien(stars, STAR_SEED + 1);
  scene.add(stars);

  const nebulae = createNebulaField(scene, RIFT_NEBULAE);
  // SpriteMaterial respects scene.fog by default — at 150m+ the washes would
  // render as flat fog color. They are SKY, not scenery: exempt them.
  for (const s of nebulae.sprites) {
    (s.material as THREE.SpriteMaterial).fog = false;
    (s.material as THREE.SpriteMaterial).needsUpdate = true;
  }

  let t = 0;
  return {
    stars,
    nebulae,
    update(dt: number): void {
      t += dt;
      setStarUniforms(stars, t, 0); // twinkle only; pocket world has no forward travel
      nebulae.tick(dt * 0.6); // slow drift for livingness — wraps automatically
    },
    dispose(): void {
      disposeStarLayer(stars);
      nebulae.dispose();
    },
  };
}
