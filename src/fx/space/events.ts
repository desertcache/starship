/**
 * Rare events — comet, nebula sprite, derelict satellite.
 *
 * Each returns a self-contained group with tick(dt) + dispose(). The director
 * owns world velocity along +Z (set on group.position) for comet/derelict; the
 * nebula drifts very slowly via its own tick so it lingers as a backdrop.
 * Only one event is alive at a time (director enforces).
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';

export type EventKind = 'COMET' | 'NEBULA' | 'DERELICT';

export interface RareEvent {
  group: THREE.Group;
  /** World +Z drift speed (m/s) the director applies to group.position.z. */
  driftSpeed: number;
  tick(dt: number): void;
  dispose(): void;
}

const NEBULA_FAMILIES = [
  ['#5b3a6e', '#8a4a6e'], // violet
  ['#1a3a5c', '#46e0d8'], // teal
  ['#7A2C1F', '#C7641E'], // rust
];

/** Soft radial cloud alpha texture for nebula sprites. */
function nebulaTexture(rng: Rng, colors: string[]): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  ctx.clearRect(0, 0, size, size);

  const blobs = rng.int(4, 7);
  for (let i = 0; i < blobs; i++) {
    const cx = rng.range(0.3, 0.7) * size;
    const cy = rng.range(0.3, 0.7) * size;
    const r = rng.range(0.25, 0.5) * size;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const c = colors[i % colors.length];
    grad.addColorStop(0, c);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = rng.range(0.5, 0.9);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ── Comet ───────────────────────────────────────────────────────────────────────

function buildComet(rng: Rng): RareEvent {
  const group = new THREE.Group();
  group.name = 'event-comet';

  const r = rng.range(4, 8);
  const nucGeo = new THREE.SphereGeometry(r, 16, 12);
  const nucMat = new THREE.MeshBasicMaterial({ color: 0xcfe6f2, toneMapped: false });
  const nucleus = new THREE.Mesh(nucGeo, nucMat);
  group.add(nucleus);

  // Tail = additive point puff trailing -tailDir.
  const tailCount = rng.int(90, 150);
  const positions = new Float32Array(tailCount * 3);
  const sizes = new Float32Array(tailCount);
  for (let i = 0; i < tailCount; i++) {
    const t = i / tailCount;
    positions[i * 3] = rng.signed(r * 0.6 + t * r * 2);
    positions[i * 3 + 1] = rng.signed(r * 0.6 + t * r * 2);
    positions[i * 3 + 2] = r + t * r * 14; // trail toward +Z (aft)
    sizes[i] = (1 - t) * rng.range(3, 7) + 1;
  }
  const tailGeo = new THREE.BufferGeometry();
  tailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  tailGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  const tailMat = new THREE.PointsMaterial({
    color: 0xcfe6f2,
    size: 4,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    toneMapped: false,
  });
  const tail = new THREE.Points(tailGeo, tailMat);
  group.add(tail);

  // Oblique cross — give the group a lateral lean.
  group.rotation.z = rng.signed(0.5);

  function tick(_dt: number): void {
    /* nucleus/tail are static in local space; director moves group +Z */
  }
  function dispose(): void {
    nucGeo.dispose();
    nucMat.dispose();
    tailGeo.dispose();
    tailMat.dispose();
  }

  return { group, driftSpeed: rng.range(30, 45), tick, dispose };
}

// ── Nebula sprite backdrop ───────────────────────────────────────────────────────

function buildNebula(rng: Rng): RareEvent {
  const group = new THREE.Group();
  group.name = 'event-nebula';

  const family = NEBULA_FAMILIES[rng.int(0, NEBULA_FAMILIES.length - 1)];
  const spriteCount = rng.int(2, 3);
  const textures: THREE.CanvasTexture[] = [];
  const materials: THREE.SpriteMaterial[] = [];

  for (let i = 0; i < spriteCount; i++) {
    const tex = nebulaTexture(rng, family);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: rng.range(0.1, 0.18),
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const sprite = new THREE.Sprite(mat);
    const s = rng.range(600, 1100);
    sprite.scale.set(s, s, 1);
    sprite.position.set(rng.signed(400), rng.signed(250), rng.signed(150));
    group.add(sprite);
    textures.push(tex);
    materials.push(mat);
  }

  function tick(_dt: number): void {
    /* director moves group very slowly +Z */
  }
  function dispose(): void {
    for (const t of textures) t.dispose();
    for (const m of materials) m.dispose();
  }

  return { group, driftSpeed: rng.range(2, 5), tick, dispose };
}

// ── Derelict satellite ───────────────────────────────────────────────────────────

function buildDerelict(rng: Rng): RareEvent {
  const group = new THREE.Group();
  group.name = 'event-derelict';

  const darkMat = new THREE.MeshLambertMaterial({ color: 0x1c1e22 });
  const geos: THREE.BufferGeometry[] = [];

  const bodyGeo = new THREE.BoxGeometry(rng.range(3, 5), rng.range(3, 5), rng.range(5, 8));
  group.add(new THREE.Mesh(bodyGeo, darkMat));
  geos.push(bodyGeo);

  // Solar panel planes (2).
  for (const sign of [-1, 1]) {
    const panelGeo = new THREE.BoxGeometry(rng.range(6, 9), 0.2, rng.range(2.5, 4));
    const panel = new THREE.Mesh(panelGeo, darkMat);
    panel.position.set(sign * rng.range(5, 7), 0, 0);
    group.add(panel);
    geos.push(panelGeo);
  }

  // Antenna.
  const antGeo = new THREE.CylinderGeometry(0.15, 0.15, rng.range(3, 5), 6);
  const antenna = new THREE.Mesh(antGeo, darkMat);
  antenna.position.set(0, rng.range(2.5, 4), 0);
  group.add(antenna);
  geos.push(antGeo);

  // Blinking nav-light dot (emissive, sin-pulse opacity).
  const navGeo = new THREE.SphereGeometry(0.5, 8, 6);
  const navMat = new THREE.MeshBasicMaterial({
    color: 0xc7641e,
    transparent: true,
    opacity: 1,
    toneMapped: false,
  });
  const nav = new THREE.Mesh(navGeo, navMat);
  nav.position.set(0, 2.2, -3.5);
  group.add(nav);
  geos.push(navGeo);

  const tumbleAxis = new THREE.Vector3(rng.signed(1), rng.signed(1), rng.signed(1)).normalize();
  const tumbleRate = rng.range(0.1, 0.4);
  let t = rng.range(0, 10);

  function tick(dt: number): void {
    t += dt;
    group.rotateOnAxis(tumbleAxis, tumbleRate * dt);
    navMat.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 3.0));
  }
  function dispose(): void {
    for (const g of geos) g.dispose();
    darkMat.dispose();
    navMat.dispose();
  }

  return { group, driftSpeed: rng.range(9, 14), tick, dispose };
}

/** Create one rare event of the requested kind. */
export function createRareEvent(rng: Rng, kind: EventKind): RareEvent {
  if (kind === 'COMET') return buildComet(rng);
  if (kind === 'NEBULA') return buildNebula(rng);
  return buildDerelict(rng);
}
