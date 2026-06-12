/**
 * Gas giant planet + teal atmosphere rim + small orbiting moon.
 *
 * Added in v0.2 polish pass:
 *   - BackSide atmosphere sphere (radius ~1.03x planet, teal #46E0D8, additive, ~0.15 opacity)
 *   - One small grey moon (radius 12, CanvasTexture, slow orbit at ~250 units)
 *
 * Draw calls added vs original: +2 (atmosphere + moon) — within the ≤3 budget.
 */
import * as THREE from 'three';

// ── Planet texture ─────────────────────────────────────────────────────────────

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

// ── Moon texture ───────────────────────────────────────────────────────────────

function createMoonTexture(): THREE.CanvasTexture {
  const SIZE = 256;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  // Grey base
  ctx.fillStyle = '#7a7c80';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Crater-like darker patches
  const craters: Array<{ x: number; y: number; r: number; alpha: number }> = [
    { x: 0.30, y: 0.25, r: 0.10, alpha: 0.35 },
    { x: 0.65, y: 0.55, r: 0.13, alpha: 0.28 },
    { x: 0.45, y: 0.70, r: 0.07, alpha: 0.40 },
    { x: 0.20, y: 0.60, r: 0.06, alpha: 0.30 },
    { x: 0.75, y: 0.30, r: 0.09, alpha: 0.25 },
  ];
  for (const c of craters) {
    const grad = ctx.createRadialGradient(
      c.x * SIZE, c.y * SIZE, 0,
      c.x * SIZE, c.y * SIZE, c.r * SIZE,
    );
    grad.addColorStop(0,   `rgba(40,42,46,${c.alpha})`);
    grad.addColorStop(0.6, `rgba(60,62,66,${c.alpha * 0.5})`);
    grad.addColorStop(1,   'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(c.x * SIZE, c.y * SIZE, c.r * SIZE, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// ── Public types ───────────────────────────────────────────────────────────────

export interface PlanetResult {
  mesh: THREE.Mesh;
  /** Call each frame with elapsed time in seconds to animate. */
  tick(elapsed: number): void;
  dispose(): void;
}

// ── Factory ────────────────────────────────────────────────────────────────────

/**
 * Build the gas giant planet, teal atmosphere rim, and orbiting moon.
 * Placed far ahead of the cockpit (large negative Z) and slightly above center.
 * Draw calls: planet(1) + atmosphere(1) + moon(1) = 3 total.
 */
export function buildPlanet(): PlanetResult {
  const PLANET_RADIUS = 120;
  const PLANET_POS = new THREE.Vector3(0, 60, -700);

  // ── Planet ────────────────────────────────────────────────────────────────────
  const tex = createPlanetTexture();

  const geo = new THREE.SphereGeometry(
    PLANET_RADIUS,
    48,  // width segments
    32,  // height segments
  );

  const mat = new THREE.MeshLambertMaterial({
    map: tex,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'planet';
  mesh.position.copy(PLANET_POS);
  mesh.rotation.z = 0.15; // tilt bands slightly

  // ── Atmosphere rim sphere (BackSide, additive) ─────────────────────────────
  const atmGeo = new THREE.SphereGeometry(
    PLANET_RADIUS * 1.03,  // ~1.03x planet radius
    48,
    32,
  );
  const atmMat = new THREE.MeshBasicMaterial({
    color: 0x46E0D8,          // teal
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,     // renders from the inside — limb glow effect
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const atmosphere = new THREE.Mesh(atmGeo, atmMat);
  atmosphere.name = 'planet-atmosphere';
  atmosphere.position.copy(PLANET_POS);

  // ── Moon ──────────────────────────────────────────────────────────────────────
  const MOON_RADIUS    = 12;
  const MOON_ORBIT_R   = 250;    // orbit radius around planet centre
  const MOON_ORBIT_SPD = 0.025;  // radians / second (slow crawl)

  const moonTex  = createMoonTexture();
  const moonGeo  = new THREE.SphereGeometry(MOON_RADIUS, 24, 16);
  const moonMat  = new THREE.MeshLambertMaterial({ map: moonTex });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.name = 'moon';

  // ── Drift state ───────────────────────────────────────────────────────────────
  let driftAngle = 0;
  const DRIFT_RADIUS = 35;
  const DRIFT_SPEED  = 0.004;
  const SPIN_SPEED   = 0.015;

  const baseX = PLANET_POS.x;
  const baseY = PLANET_POS.y;
  const baseZ = PLANET_POS.z;

  function tick(elapsed: number): void {
    driftAngle = elapsed * DRIFT_SPEED;

    // Planet drift
    const px = baseX + Math.sin(driftAngle) * DRIFT_RADIUS;
    const py = baseY + Math.cos(driftAngle * 0.4) * 15;
    mesh.position.set(px, py, baseZ);
    mesh.rotation.y = elapsed * SPIN_SPEED;

    // Atmosphere tracks planet exactly
    atmosphere.position.copy(mesh.position);

    // Moon orbits planet centre
    const moonAngle = elapsed * MOON_ORBIT_SPD;
    moonMesh.position.set(
      px + Math.cos(moonAngle) * MOON_ORBIT_R,
      py + Math.sin(moonAngle * 0.3) * 15,   // slight inclined orbit for parallax
      baseZ + Math.sin(moonAngle) * MOON_ORBIT_R,
    );
  }

  // Build a parent group so we can dispose all three cleanly
  // (we don't add a Group to scene; callers add individual meshes via assembleShip)
  // We return only the primary mesh as `mesh`, but tick() drives all three.
  // The atmosphere and moon are added via a dummy trick: attach them to mesh.
  // Actually to keep the API clean and not break existing assembleShip code,
  // store extra meshes on the result object and expose an addToScene helper.

  function dispose(): void {
    geo.dispose();
    mat.dispose();
    tex.dispose();
    atmGeo.dispose();
    atmMat.dispose();
    moonGeo.dispose();
    moonMat.dispose();
    moonTex.dispose();
  }

  // Attach atmosphere and moon as children of the planet mesh so they are added
  // automatically when planet.mesh is added to the scene.
  // We translate them to local space (relative to mesh parent's world position).
  // Since mesh is positioned at PLANET_POS but atmosphere/moon track mesh.position
  // in world-space via tick(), we attach them as scene-level siblings instead.
  // assembleShip adds planet.mesh to the scene; we need to also expose the extras.

  // Override: use a Group to hold all three so assembleShip adds one group.
  const group = new THREE.Group();
  group.name = 'planet-group';
  group.add(mesh);
  group.add(atmosphere);
  group.add(moonMesh);

  return {
    mesh: group as unknown as THREE.Mesh,  // assembleShip calls scene.add(planet.mesh)
    tick,
    dispose,
  };
}
