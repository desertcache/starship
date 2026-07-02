/**
 * src/fx/glow.ts — v0.9 B2 "glow build": halation, micro-LED clusters, and
 * console/panel underglow builders. Room files (ceilingFixtures.ts,
 * cockpitConsoles.ts, engineeringProps.ts, engineeringDressing.ts,
 * corridorSignage.ts, galleyProps.ts, cargoBayProps.ts, cargoBay.ts) call
 * these builders and own WHERE things go; this file owns HOW they're built
 * (shared geometry/texture/material singletons, instancing).
 *
 * Kill switch: ?glow=0 disables every builder in this file AND volumetrics.ts
 * (GLOW_ENABLED is imported by volumetrics.ts too) — isolation-matrix flag
 * for perf A/B and visual regression checks.
 */
import * as THREE from 'three';
import { cached } from './textureHelpers.js';

// ── Kill switch ──────────────────────────────────────────────────────────────
const _glowParams = new URLSearchParams(
  typeof window !== 'undefined' ? window.location.search : '',
);
export const GLOW_ENABLED: boolean = _glowParams.get('glow') !== '0';

// ── Shared LED palette ─────────────────────────────────────────────────────
export const LedColors = {
  teal:  0x46e0d8,
  orange: 0xffa030,
  red:    0xff3b2e,
  warm:   0xfff0d0,
} as const;

// ── 1. Fixture halation ────────────────────────────────────────────────────
//
// One additive radial-gradient quad per ceiling fixture, floating 5-10mm
// BELOW the fixture's emissive diffuser lens (ceiling-parallel, never
// coplanar — standing 5mm anti-z-fight rule). Warm amber, alpha peak ~0.35
// center feathered to 0. Shared geometry + material, one InstancedMesh call
// per room (rooms are far apart — no benefit to a single ship-wide mesh, and
// per-room keeps room files owning placement).

const HALATION_DROP = 0.0075; // 7.5mm below the lens
const HALATION_W = 0.80; // world-space quad size (short axis)
const HALATION_L = 1.50; // long axis (matches fixture's long axis, Z)

function makeHalationTexture(): THREE.CanvasTexture {
  return cached('glow-halation', () => {
    const S = 128;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;
    const cx = S / 2;
    const cy = S / 2;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, S / 2);
    grad.addColorStop(0.00, 'rgba(255,236,190,0.35)');
    grad.addColorStop(0.30, 'rgba(255,214,150,0.20)');
    grad.addColorStop(0.60, 'rgba(255,196,120,0.08)');
    grad.addColorStop(1.00, 'rgba(255,180,100,0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, S, S);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, true);
}

let _matHalation: THREE.MeshBasicMaterial | null = null;
function matHalation(): THREE.MeshBasicMaterial {
  return _matHalation ?? (_matHalation = new THREE.MeshBasicMaterial({
    map: makeHalationTexture(),
    color: 0xffe0b0,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide, // reads from oblique angles too
  }));
}

let _haloGeo: THREE.PlaneGeometry | null = null;
function haloGeo(): THREE.PlaneGeometry {
  if (_haloGeo) return _haloGeo;
  const geo = new THREE.PlaneGeometry(1, 1);
  geo.rotateX(Math.PI / 2); // face downward, matching the diffuser
  _haloGeo = geo;
  return geo;
}

/**
 * Add one InstancedMesh of halation quads for every fixture in `fixtures`
 * (room-local x/z), floating just below `diffuserY` (room-local).
 */
export function addFixtureHalation(
  group: THREE.Group,
  fixtures: ReadonlyArray<{ x: number; z: number }>,
  diffuserY: number,
): void {
  if (!GLOW_ENABLED || fixtures.length === 0) return;
  const mesh = new THREE.InstancedMesh(haloGeo(), matHalation(), fixtures.length);
  mesh.name = 'fixture-halation';
  const y = diffuserY - HALATION_DROP;
  const m4 = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const scale = new THREE.Vector3(HALATION_W, 1, HALATION_L);
  for (let i = 0; i < fixtures.length; i++) {
    m4.compose(new THREE.Vector3(fixtures[i].x, y, fixtures[i].z), quat, scale);
    mesh.setMatrixAt(i, m4);
  }
  mesh.instanceMatrix.needsUpdate = true;
  group.add(mesh);
}

// ── 4. Micro-LED clusters ──────────────────────────────────────────────────
//
// Small emissive boxes, toneMapped=false. Non-blinking ones are bucketed by
// color into one InstancedMesh per color (cheap, draw-call flat); blinking
// ones (10-20% of the ship total) get their own tiny Mesh with a per-instance
// onBeforeRender opacity pulse (excluded from mergeStaticSiblings by design —
// see staticMerge.ts's custom-onBeforeRender exclusion).

const LED_SIZE = 0.022;

export interface LedSpec {
  pos: THREE.Vector3;
  color: number;
  /** Slow independent blink — 10-20% of LEDs shipwide should set this. */
  blink?: boolean;
  /** Blink period in seconds (0.5-4s per brief). */
  period?: number;
  /** Phase offset 0..1 so blinking LEDs don't sync. */
  phase?: number;
}

let _ledGeo: THREE.BoxGeometry | null = null;
function ledGeo(): THREE.BoxGeometry {
  return _ledGeo ?? (_ledGeo = new THREE.BoxGeometry(LED_SIZE, LED_SIZE, LED_SIZE * 0.6));
}

const _ledMatCache = new Map<number, THREE.MeshBasicMaterial>();
function ledMat(color: number): THREE.MeshBasicMaterial {
  let m = _ledMatCache.get(color);
  if (!m) {
    m = new THREE.MeshBasicMaterial({ color, toneMapped: false });
    _ledMatCache.set(color, m);
  }
  return m;
}

/** Add a cluster of micro-LEDs to `group`. Keep counts to 4-10 per room. */
export function addLedCluster(group: THREE.Group, specs: ReadonlyArray<LedSpec>): void {
  if (!GLOW_ENABLED || specs.length === 0) return;

  const staticByColor = new Map<number, THREE.Vector3[]>();
  for (const s of specs) {
    if (s.blink) continue;
    const arr = staticByColor.get(s.color) ?? [];
    arr.push(s.pos);
    staticByColor.set(s.color, arr);
  }

  const geo = ledGeo();
  const m4 = new THREE.Matrix4();
  for (const [color, positions] of staticByColor) {
    const mesh = new THREE.InstancedMesh(geo, ledMat(color), positions.length);
    mesh.name = 'led-cluster';
    for (let i = 0; i < positions.length; i++) {
      m4.setPosition(positions[i]);
      mesh.setMatrixAt(i, m4);
    }
    mesh.instanceMatrix.needsUpdate = true;
    group.add(mesh);
  }

  for (const s of specs) {
    if (!s.blink) continue;
    const mat = new THREE.MeshBasicMaterial({ color: s.color, toneMapped: false, transparent: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(s.pos);
    const period = s.period ?? 2.0;
    const phase = s.phase ?? 0;
    mesh.onBeforeRender = (): void => {
      const t = performance.now() / 1000;
      const cyc = (t / period + phase) % 1;
      mat.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(cyc * Math.PI * 2));
    };
    group.add(mesh);
  }
}

// ── 5. Console / panel underglow ───────────────────────────────────────────
//
// Faint additive plane beneath a screen/panel, washing the surface below it
// with a fake bounce-light glow (dash, signage, terminal).

export interface UnderglowSpec {
  x: number;
  y: number;
  z: number;
  width: number;
  length: number;
  rotY?: number;
  /** Tilt away from the wall/console face, radians (negative = spill down/out). */
  tiltX?: number;
  color?: number;
  opacity?: number;
}

/** Add one additive underglow plane. Returns the mesh (for further tuning) or null when disabled. */
export function addUnderglow(group: THREE.Group, spec: UnderglowSpec): THREE.Mesh | null {
  if (!GLOW_ENABLED) return null;
  const mat = new THREE.MeshBasicMaterial({
    color: spec.color ?? 0x2ad8e8,
    transparent: true,
    opacity: spec.opacity ?? 0.35,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(spec.width, spec.length), mat);
  mesh.position.set(spec.x, spec.y, spec.z);
  if (spec.rotY) mesh.rotation.y = spec.rotY;
  if (spec.tiltX) mesh.rotation.x += spec.tiltX;
  group.add(mesh);
  return mesh;
}

// ── 6. Reactor hot-core texture (item 6) ───────────────────────────────────
//
// Same treatment as the A2 ceiling-fixture hot core: a tight bright center
// feathered to the base teal, so the reactor's core strips/slots clear the
// 0.84 bloom threshold instead of sitting as flat mid-luminance teal planes.

export function makeReactorCoreTexture(): THREE.CanvasTexture {
  return cached('reactor-core-hot', () => {
    const W = 32;
    const H = 128;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0c2c2a';
    ctx.fillRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0.00, 'rgba(10,40,38,0.9)');
    grad.addColorStop(0.30, 'rgba(120,230,220,0.55)');
    grad.addColorStop(0.50, 'rgba(255,255,255,1.0)');
    grad.addColorStop(0.70, 'rgba(120,230,220,0.55)');
    grad.addColorStop(1.00, 'rgba(10,40,38,0.9)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, true);
}
