import * as THREE from 'three';

/** Build a starfield of ~4000 stars on a large sphere surrounding the ship. */
export function buildStarfield(): THREE.Points {
  const STAR_COUNT = 4000;
  const RADIUS = 800;

  const positions = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    // Uniform distribution on sphere using rejection sampling via spherical coords
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = RADIUS;

    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    // Subtle size variation for depth feel
    sizes[i] = 0.8 + Math.random() * 1.6;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    color: 0xddeeff,
    size: 1.2,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });

  const stars = new THREE.Points(geo, mat);
  stars.name = 'starfield';
  // Ensure stars render behind everything
  stars.renderOrder = -1;

  return stars;
}

/** Dispose a starfield returned by buildStarfield. */
export function disposeStarfield(stars: THREE.Points): void {
  stars.geometry.dispose();
  if (stars.material instanceof THREE.Material) {
    stars.material.dispose();
  }
}
