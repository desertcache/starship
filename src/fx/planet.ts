import * as THREE from 'three';

/** Create a procedural gas-giant CanvasTexture (banded noise). */
function createPlanetTexture(): THREE.CanvasTexture {
  const SIZE = 512;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  // Base deep teal/blue gas giant
  const bg = ctx.createLinearGradient(0, 0, 0, SIZE);
  bg.addColorStop(0,    '#1a3a5c');
  bg.addColorStop(0.15, '#2c5f8a');
  bg.addColorStop(0.30, '#4682b4');
  bg.addColorStop(0.40, '#c8894a');
  bg.addColorStop(0.50, '#d4a052');
  bg.addColorStop(0.60, '#b87040');
  bg.addColorStop(0.70, '#4682b4');
  bg.addColorStop(0.85, '#2c5f8a');
  bg.addColorStop(1.0,  '#1a3a5c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Draw horizontal bands with noise
  const bandDefs: Array<{ y: number; h: number; color: string; alpha: number }> = [
    { y: 0.08,  h: 0.04, color: '#f0d090', alpha: 0.55 },
    { y: 0.18,  h: 0.06, color: '#e8b870', alpha: 0.45 },
    { y: 0.28,  h: 0.08, color: '#d49050', alpha: 0.50 },
    { y: 0.38,  h: 0.05, color: '#f8e4b0', alpha: 0.40 },
    { y: 0.48,  h: 0.10, color: '#c87838', alpha: 0.60 },
    { y: 0.60,  h: 0.06, color: '#e8b060', alpha: 0.45 },
    { y: 0.70,  h: 0.04, color: '#d0a848', alpha: 0.50 },
    { y: 0.80,  h: 0.07, color: '#f0c870', alpha: 0.40 },
    { y: 0.90,  h: 0.04, color: '#c07030', alpha: 0.55 },
  ];

  for (const band of bandDefs) {
    const yPx = band.y * SIZE;
    const hPx = band.h * SIZE;
    ctx.globalAlpha = band.alpha;

    // Wavy band with horizontal noise
    ctx.beginPath();
    ctx.moveTo(0, yPx);
    for (let x = 0; x <= SIZE; x += 4) {
      const noise = (Math.sin(x * 0.04) + Math.sin(x * 0.011 + 1.3)) * (hPx * 0.2);
      ctx.lineTo(x, yPx + noise);
    }
    for (let x = SIZE; x >= 0; x -= 4) {
      const noise = (Math.sin(x * 0.04) + Math.sin(x * 0.011 + 1.3)) * (hPx * 0.2);
      ctx.lineTo(x, yPx + hPx + noise);
    }
    ctx.closePath();
    ctx.fillStyle = band.color;
    ctx.fill();
  }

  // Great spot (oval storm)
  ctx.globalAlpha = 0.6;
  const spotGrad = ctx.createRadialGradient(
    SIZE * 0.65, SIZE * 0.48, 0,
    SIZE * 0.65, SIZE * 0.48, SIZE * 0.07,
  );
  spotGrad.addColorStop(0,   '#e83020');
  spotGrad.addColorStop(0.5, '#c04018');
  spotGrad.addColorStop(1,   'transparent');
  ctx.fillStyle = spotGrad;
  ctx.beginPath();
  ctx.ellipse(SIZE * 0.65, SIZE * 0.48, SIZE * 0.07, SIZE * 0.045, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

export interface PlanetResult {
  mesh: THREE.Mesh;
  /** Call each frame with elapsed time in seconds to animate. */
  tick(elapsed: number): void;
  dispose(): void;
}

/**
 * Build the gas giant planet.
 * Placed far ahead of the cockpit (large negative Z) and slightly above center.
 */
export function buildPlanet(): PlanetResult {
  const tex = createPlanetTexture();

  const geo = new THREE.SphereGeometry(
    120,   // radius — large enough to dominate the cockpit view
    48,    // width segments (cheap at this count)
    32,    // height segments
  );

  const mat = new THREE.MeshLambertMaterial({
    map: tex,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'planet';

  // Position: far fore, slightly elevated
  mesh.position.set(0, 60, -700);

  // Initial rotation
  mesh.rotation.z = 0.15; // tilt bands slightly

  // Drift state — planet moves slowly across the cockpit FOV
  let driftAngle = 0;
  const DRIFT_RADIUS = 80;   // how far it swings laterally (world units)
  const DRIFT_SPEED = 0.004; // radians per second
  const SPIN_SPEED  = 0.015; // self-rotation radians per second

  const baseX = 0;
  const baseY = 60;

  function tick(elapsed: number): void {
    driftAngle = elapsed * DRIFT_SPEED;
    mesh.position.x = baseX + Math.sin(driftAngle) * DRIFT_RADIUS;
    mesh.position.y = baseY + Math.cos(driftAngle * 0.4) * 15;
    mesh.rotation.y = elapsed * SPIN_SPEED;
  }

  function dispose(): void {
    geo.dispose();
    mat.dispose();
    tex.dispose();
  }

  return { mesh, tick, dispose };
}
