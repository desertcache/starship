/**
 * src/fx/landfall/descentDust.ts — touchdown dust-burst particle system,
 * split out of descent.ts (v1.2.1 B5 cap fix: descent.ts was 331 lines, over
 * CLAUDE.md's 300-line cap). Self-contained: owns its own Points geometry/
 * material and disposes them on burst-end or a fresh trigger(); descent.ts
 * still decides WHEN to trigger/tick/dispose (touchdown timing, phase
 * machine), passing scene/groundY/elapsedTotal in as plain parameters rather
 * than this file reaching back into descent.ts's module state — so this file
 * has zero imports from descent.ts (no cycle).
 */
import * as THREE from 'three';
import { makeRng } from '../space/rng.js';
import { DUST_BURST_COUNT, DUST_BURST_LIFE_SECS } from '../../flight/landfallTuning.js';

// Same seed lineage descent.ts's own DESCENT_SEED uses (^0xd057 was the dust
// burst's own salt there) — kept identical so a re-run of the same descent
// still produces the same burst, unaffected by the split.
const DESCENT_SEED = 0x1a4d ^ 0xde5c;

export interface DustHandle {
  /** Fresh burst at the world origin (touchdown always happens at the pad
   *  center) — disposes any still-active previous burst first. */
  trigger(scene: THREE.Scene, groundY: number, elapsedTotal: number): void;
  /** Advances the active burst (if any); self-disposes past its lifetime. */
  tick(dt: number, elapsedTotal: number, scene: THREE.Scene): void;
  dispose(scene: THREE.Scene): void;
}

interface DustBurst {
  points: THREE.Points;
  velocities: Float32Array;
  startedAt: number;
}

export function createDustBurst(): DustHandle {
  let active: DustBurst | null = null;

  function dispose(scene: THREE.Scene): void {
    if (!active) return;
    scene.remove(active.points);
    active.points.geometry.dispose();
    (active.points.material as THREE.PointsMaterial).dispose();
    active = null;
  }

  function trigger(scene: THREE.Scene, groundY: number, elapsedTotal: number): void {
    dispose(scene);
    const rng = makeRng(DESCENT_SEED ^ 0xd057);
    const positions = new Float32Array(DUST_BURST_COUNT * 3);
    const velocities = new Float32Array(DUST_BURST_COUNT * 3);
    for (let i = 0; i < DUST_BURST_COUNT; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = groundY + 0.2;
      positions[i * 3 + 2] = 0;
      const ang = rng() * Math.PI * 2;
      const spd = rng.range(2, 7);
      velocities[i * 3] = Math.cos(ang) * spd;
      velocities[i * 3 + 1] = rng.range(1.5, 4);
      velocities[i * 3 + 2] = Math.sin(ang) * spd;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xcbb48a, size: 0.6, sizeAttenuation: true,
      transparent: true, opacity: 0.6, depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    points.name = 'landfall-dust-burst';
    scene.add(points);
    active = { points, velocities, startedAt: elapsedTotal };
  }

  function tick(dt: number, elapsedTotal: number, scene: THREE.Scene): void {
    if (!active) return;
    const age = elapsedTotal - active.startedAt;
    const posAttr = active.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < DUST_BURST_COUNT; i++) {
      arr[i * 3] += active.velocities[i * 3] * dt;
      arr[i * 3 + 1] += active.velocities[i * 3 + 1] * dt;
      active.velocities[i * 3 + 1] -= 9 * dt; // gravity
      arr[i * 3 + 2] += active.velocities[i * 3 + 2] * dt;
    }
    posAttr.needsUpdate = true;
    (active.points.material as THREE.PointsMaterial).opacity = 0.6 * Math.max(0, 1 - age / DUST_BURST_LIFE_SECS);
    if (age >= DUST_BURST_LIFE_SECS) dispose(scene);
  }

  return { trigger, tick, dispose };
}
