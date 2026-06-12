/**
 * src/fx/particles.ts — Reusable drifting-particle utility.
 *
 * Provides a single-draw-call Points system for ambient atmospheric particles
 * (cockpit dust, corridor haze, steam, etc.).
 *
 * Usage:
 *   const { points, tick } = makeDrift({ count: 80, bounds, color: 0xffffff, opacity: 0.25, speed: 0.02 });
 *   scene.add(points);
 *   // In your per-frame callback:
 *   tick(dt);
 *
 * The Points object and tick function are the only public surface.
 * Do NOT import any room-specific geometry here — callers supply bounds.
 *
 * Budget: 1 draw call per makeDrift() call. Use InstancedMesh is not applicable
 * here; Points is a single draw call already.
 */

import * as THREE from 'three';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DriftOptions {
  /** Number of particles. Keep ≤ 200 per system for budget. */
  count: number;
  /** World-space box the particles drift within (wrapping at edges). */
  bounds: THREE.Box3;
  /** Hex color, e.g. 0xffffff. */
  color: number;
  /** Opacity 0–1. */
  opacity: number;
  /** Base speed multiplier (world units per second). */
  speed: number;
}

export interface DriftSystem {
  /** The THREE.Points object — add to scene where desired. */
  points: THREE.Points;
  /**
   * Call each frame with delta time in seconds.
   * Random-walks each particle within bounds, wrapping at edges.
   */
  tick(dt: number): void;
  /** Dispose geometry + material. Call when removing from scene. */
  dispose(): void;
}

// ── Implementation ────────────────────────────────────────────────────────────

/**
 * Create a drifting particle system.
 *
 * @param options - Configuration (see DriftOptions).
 * @returns DriftSystem with .points, .tick(dt), .dispose().
 */
export function makeDrift(options: DriftOptions): DriftSystem {
  const { count, bounds, color, opacity, speed } = options;

  const size = new THREE.Vector3();
  bounds.getSize(size);
  const center = new THREE.Vector3();
  bounds.getCenter(center);

  // ── Geometry ───────────────────────────────────────────────────────────────
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  // Random velocities per particle (normalised direction × speed)
  const velocities = new Float32Array(count * 3);

  const rng = mulberry32(0xdeadbeef);

  for (let i = 0; i < count; i++) {
    // Scatter within bounds
    positions[i * 3]     = bounds.min.x + rng() * size.x;
    positions[i * 3 + 1] = bounds.min.y + rng() * size.y;
    positions[i * 3 + 2] = bounds.min.z + rng() * size.z;

    // Random drift direction, small magnitude
    const vx = (rng() - 0.5) * 2;
    const vy = (rng() - 0.5) * 2;
    const vz = (rng() - 0.5) * 2;
    const len = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
    velocities[i * 3]     = (vx / len) * speed;
    velocities[i * 3 + 1] = (vy / len) * speed;
    velocities[i * 3 + 2] = (vz / len) * speed;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // ── Material ───────────────────────────────────────────────────────────────
  const material = new THREE.PointsMaterial({
    color,
    size: 0.018,
    transparent: true,
    opacity,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);

  // ── Tick ───────────────────────────────────────────────────────────────────
  function tick(dt: number): void {
    const posAttr = geometry.attributes['position'] as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      pos[i * 3]     += velocities[i * 3]     * dt;
      pos[i * 3 + 1] += velocities[i * 3 + 1] * dt;
      pos[i * 3 + 2] += velocities[i * 3 + 2] * dt;

      // Wrap at bounds edges
      if (pos[i * 3]     < bounds.min.x) pos[i * 3]     += size.x;
      if (pos[i * 3]     > bounds.max.x) pos[i * 3]     -= size.x;
      if (pos[i * 3 + 1] < bounds.min.y) pos[i * 3 + 1] += size.y;
      if (pos[i * 3 + 1] > bounds.max.y) pos[i * 3 + 1] -= size.y;
      if (pos[i * 3 + 2] < bounds.min.z) pos[i * 3 + 2] += size.z;
      if (pos[i * 3 + 2] > bounds.max.z) pos[i * 3 + 2] -= size.z;
    }

    posAttr.needsUpdate = true;
  }

  // ── Dispose ────────────────────────────────────────────────────────────────
  function dispose(): void {
    geometry.dispose();
    material.dispose();
  }

  return { points, tick, dispose };
}

// ── Deterministic RNG (Mulberry32) ────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let s = seed;
  return (): number => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
