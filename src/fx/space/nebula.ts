/**
 * Persistent deep-field nebula wash — a handful of huge, ultra-soft additive
 * sprites that drift with the FAR starfield's parallax and wrap to stay
 * perpetually in view. Gives space colour depth (ref: red/teal washes behind
 * a planet, not pure black) instead of a flat starfield-on-black.
 *
 * Extracted out of director.ts, which the persistent-nebula block was
 * pushing past the project's 300-line cap.
 */

import * as THREE from 'three';

export interface NebulaConfig {
  name: string;
  colors: [string, string];
  position: THREE.Vector3;
  scale: [number, number];
  opacity: number;
}

function makeNebulaCanvas(colors: [string, string]): HTMLCanvasElement {
  const S = 512;
  const cv = document.createElement('canvas');
  cv.width = S;
  cv.height = S;
  const ctx = cv.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  for (const [cx, cy, r, c, a] of [
    [S * 0.45, S * 0.5, S * 0.46, colors[0], 0.85],
    [S * 0.58, S * 0.45, S * 0.38, colors[1], 0.7],
  ] as [number, number, number, string, number][]) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, c);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = a;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  return cv;
}

/**
 * Deterministic configs: canopy-bearing teal (port) + rust (starboard) tuned
 * for the cockpit's -Z sightline, plus a magenta/rust wash tuned for the
 * starboard porthole's +X sightline (world (5.8,1.6,-16) looking +X) — the
 * v0.9 space-beauty pass added this third one because A/B bear almost
 * entirely off-axis from the porthole and left it reading as flat black.
 */
export const DEFAULT_NEBULAE: NebulaConfig[] = [
  {
    name: 'nebula-persistent-a',
    colors: ['rgba(0,90,110,1)', 'rgba(30,180,200,1)'],
    // v0.9 RADIANCE fix-round M8: was (-900,200,-1350) — ~35° off the
    // cockpit-canopy camera's -Z forward cone (camera ≈ (0,1.55,-22.5)), so it
    // barely registered through the canopy window, leaving that sightline
    // reading flatter than porthole-space's magenta wash (2 critics). Pulled
    // toward the sightline centerline + closer, opacity bumped for a clearly
    // visible color wash without overpowering the signature canopy hero.
    position: new THREE.Vector3(-420, 90, -1150),
    scale: [1900, 1500],
    opacity: 0.16,
  },
  {
    name: 'nebula-persistent-b',
    colors: ['rgba(100,30,10,1)', 'rgba(180,70,20,1)'],
    position: new THREE.Vector3(1100, -100, -1550),
    scale: [1600, 1200],
    opacity: 0.09,
  },
  {
    name: 'nebula-persistent-porthole',
    colors: ['rgba(90,20,60,1)', 'rgba(190,60,90,1)'],
    position: new THREE.Vector3(1450, 140, -70),
    scale: [1500, 1150],
    opacity: 0.08,
  },
];

export interface NebulaField {
  sprites: THREE.Sprite[];
  /**
   * Advance parallax drift by `dz` (same delta the FAR star layer scrolls
   * by); wraps sprites at +500/-3500 so they stay perpetually in view.
   * Accepts a THREE.Vector3 (v1.1 SOVEREIGN: full flowW-scaled delta) or a
   * legacy `number` (+Z-only) — the latter kept for the pocket-world caller
   * in src/world/worlds/riftSky.ts, which this lane does not touch.
   */
  tick(dz: THREE.Vector3 | number): void;
  dispose(): void;
}

/** Build the persistent nebula field and add its sprites directly to `parent`
 *  (a THREE.Scene or, under the universe rig, a THREE.Group). */
export function createNebulaField(
  parent: THREE.Object3D,
  configs: NebulaConfig[] = DEFAULT_NEBULAE,
): NebulaField {
  const sprites: THREE.Sprite[] = [];
  const mats: THREE.SpriteMaterial[] = [];
  const texs: THREE.CanvasTexture[] = [];

  for (const cfg of configs) {
    const cv = makeNebulaCanvas(cfg.colors);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: cfg.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(cfg.scale[0], cfg.scale[1], 1);
    sprite.position.copy(cfg.position);
    sprite.name = cfg.name;
    sprite.renderOrder = -1;
    parent.add(sprite);
    sprites.push(sprite);
    mats.push(mat);
    texs.push(tex);
  }

  function tick(dz: THREE.Vector3 | number): void {
    for (const s of sprites) {
      if (typeof dz === 'number') s.position.z += dz;
      else s.position.add(dz);
      if (s.position.z > 500) s.position.z -= 3500;
    }
  }

  function dispose(): void {
    for (const s of sprites) parent.remove(s);
    for (const m of mats) m.dispose();
    for (const t of texs) t.dispose();
  }

  return { sprites, tick, dispose };
}
