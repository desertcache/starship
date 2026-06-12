/**
 * Engineering room prop builders — Phase 3b / v0.2 fill pass.
 * Reactor column, guard rail, breaker cabinet, crates.
 * Wall dressing (conduits, aft manifold, hazard ring) → engineeringDressing.ts
 *
 * v0.2 changes:
 *   - matHou hoisted to module-level singleton (was allocating per buildReactor call).
 *   - Reactor: 4 teal emissive accent strips, animated via onBeforeRender.
 *   - Hazard caution stencil ring: moved to engineeringDressing.ts.
 *   - Crate names: 'crate-a' / 'crate-b'.
 *   - Under 'crate-b': hidden floor panel (thin PlaneGeometry + teal seam).
 *   - buildWallConduits: delegates to engineeringDressing.ts helpers.
 *   - Breaker cabinet updated to 1.2x0.8 cluster with 12 emissive pips.
 *
 * File ownership: ONLY src/world/engineering.ts may import this module.
 */
import * as THREE from 'three';
import type { AABB } from './types.js';
import { matConsoleScreen, matHazardStriping } from '../fx/shipMaterials.js';
import { cached, addGrime } from '../fx/textureHelpers.js';
import {
  buildBaseWallDressing,
  buildForeConduits,
  buildAftWallDressing,
} from './engineeringDressing.js';

const COL_GUNMETAL = 0x1C1E22;
const COL_TEAL     = 0x46E0D8;
const COL_ORANGE   = 0xC7641E;
const COL_STA_G    = 0x22DD88;
const COL_STA_O    = 0xDD8822;

// ── Textures (cached) ──────────────────────────────────────────────────────────

function mkGunTex(): THREE.CanvasTexture {
  return cached('eng-gun', () => {
    const S = 256; const cv = document.createElement('canvas'); cv.width = cv.height = S;
    const c = cv.getContext('2d')!; c.fillStyle = '#1C1E22'; c.fillRect(0, 0, S, S);
    c.strokeStyle = 'rgba(0,0,0,0.7)'; c.lineWidth = 2;
    for (let x = 64; x < S; x += 64) { c.beginPath(); c.moveTo(x,0); c.lineTo(x,S); c.stroke(); }
    for (let y = 64; y < S; y += 64) { c.beginPath(); c.moveTo(0,y); c.lineTo(S,y); c.stroke(); }
    addGrime(c, S, S, 17, 0.18);
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  });
}

function mkHousingTex(): THREE.CanvasTexture {
  return cached('eng-housing', () => {
    const W = 512; const H = 256; const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const c = cv.getContext('2d')!; c.fillStyle = '#1C1E22'; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(255,255,255,0.06)'; c.lineWidth = 1;
    for (let x = 32; x < W; x += 32) { c.beginPath(); c.moveTo(x,0); c.lineTo(x,H); c.stroke(); }
    addGrime(c, W, H, 333, 0.16);
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  });
}

// ── Materials — module-level singletons ───────────────────────────────────────

let _mGun: THREE.MeshLambertMaterial | null = null;
const matGun = (): THREE.MeshLambertMaterial =>
  _mGun ?? (_mGun = new THREE.MeshLambertMaterial({ map: mkGunTex() }));

// Singleton materials used inside crate/floor-panel builders
let _mCrateOrange: THREE.MeshBasicMaterial | null = null;
const matCrateOrange = (): THREE.MeshBasicMaterial =>
  _mCrateOrange ?? (_mCrateOrange = new THREE.MeshBasicMaterial({ color: COL_ORANGE }));

let _mFloorPanel: THREE.MeshLambertMaterial | null = null;
const matFloorPanel = (): THREE.MeshLambertMaterial =>
  _mFloorPanel ?? (_mFloorPanel = new THREE.MeshLambertMaterial({ color: 0x0a0c10, side: THREE.FrontSide }));

let _mFloorSeam: THREE.MeshBasicMaterial | null = null;
const matFloorSeam = (): THREE.MeshBasicMaterial =>
  _mFloorSeam ?? (_mFloorSeam = new THREE.MeshBasicMaterial({ color: 0x46e0d8, side: THREE.FrontSide }));

// FIX: matHou hoisted to module-level singleton — was allocating fresh per buildReactor() call.
let _mHou: THREE.MeshLambertMaterial | null = null;
const matHou = (): THREE.MeshLambertMaterial =>
  _mHou ?? (_mHou = new THREE.MeshLambertMaterial({ color: COL_GUNMETAL, map: mkHousingTex() }));

const mkCoreMat = (): THREE.MeshBasicMaterial =>
  new THREE.MeshBasicMaterial({ color: new THREE.Color(COL_TEAL), transparent: true, opacity: 1.0 });

const mkAccentMat = (): THREE.MeshBasicMaterial =>
  new THREE.MeshBasicMaterial({ color: new THREE.Color(COL_ORANGE), transparent: true, opacity: 0.85 });

// ── Pulse ──────────────────────────────────────────────────────────────────────

function attachPulse(mesh: THREE.Mesh, mat: THREE.MeshBasicMaterial, lo: number, hi: number, phase: number): void {
  mesh.onBeforeRender = (): void => {
    const w = 0.5 + 0.5 * Math.sin(Math.PI * performance.now() * 0.001 + phase);
    mat.opacity = lo + w * (hi - lo);
  };
}

// ── Reactor ────────────────────────────────────────────────────────────────────

export interface ReactorResult { group: THREE.Group; collider: AABB; }

export function buildReactor(H: number): ReactorResult {
  const g = new THREE.Group(); g.name = 'reactor';
  const R = 0.45; const CX = 0; const CZ = 1.0; const CY = H / 2;

  const hm = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 16), matHou());
  hm.position.set(CX, CY, CZ); g.add(hm);

  const ribGeo = new THREE.TorusGeometry(R + 0.04, 0.04, 6, 20);
  const ribMat = new THREE.MeshLambertMaterial({ color: COL_GUNMETAL });
  const ribInst = new THREE.InstancedMesh(ribGeo, ribMat, 7);
  const dm = new THREE.Object3D();
  for (let i = 0; i < 7; i++) {
    dm.position.set(CX, (i + 1) * H / 8, CZ); dm.rotation.set(Math.PI / 2, 0, 0); dm.updateMatrix();
    ribInst.setMatrixAt(i, dm.matrix);
  }
  ribInst.instanceMatrix.needsUpdate = true; g.add(ribInst);

  [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].forEach((ang, i) => {
    const mat = mkCoreMat();
    const slot = new THREE.Mesh(new THREE.PlaneGeometry(0.08, H * 0.70), mat);
    slot.position.set(CX + Math.sin(ang) * (R + 0.01), CY, CZ + Math.cos(ang) * (R + 0.01));
    slot.rotation.y = -ang;
    attachPulse(slot, mat, 0.35, 1.0, (i * Math.PI) / 2);
    g.add(slot);
  });

  const accMat = mkAccentMat();
  const accRing = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.01, R + 0.01, 0.12, 16), accMat);
  accRing.position.set(CX, 0.30, CZ); attachPulse(accRing, accMat, 0.5, 1.0, Math.PI); g.add(accRing);

  // Teal accent strips on reactor column (emissive, phase-lagged pulse via onBeforeRender)
  const stripAngles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
  stripAngles.forEach((ang, i) => {
    const stripMat = new THREE.MeshLambertMaterial({
      color: 0x46e0d8,
      emissive: new THREE.Color(0x46e0d8),
      emissiveIntensity: 0.8,
    });
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.04, H * 0.65, 0.02), stripMat);
    strip.position.set(
      CX + Math.sin(ang) * (R + 0.02),
      CY,
      CZ + Math.cos(ang) * (R + 0.02),
    );
    strip.rotation.y = -ang;
    const _i = i;
    // Self-animating via onBeforeRender — time via performance.now().
    // Phase-lagged vs structural reactor light pulse (phase offset 0.3 + per-strip stagger).
    strip.onBeforeRender = (): void => {
      const t = performance.now() * 0.001;
      stripMat.emissiveIntensity = 0.8 + Math.sin(t * 2.1 + 0.3 + _i * 0.15) * 0.2;
    };
    g.add(strip);
  });

  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8), matGun());
  pipe.position.set(CX, H - 0.175, CZ); g.add(pipe);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 8), matGun());
  collar.position.set(CX, H - 0.04, CZ); g.add(collar);

  return {
    group: g,
    collider: {
      minX: CX-R-0.08, minY: 0, minZ: CZ-R-0.08,
      maxX: CX+R+0.08, maxY: H, maxZ: CZ+R+0.08,
    },
  };
}

// ── Guard rail arc ─────────────────────────────────────────────────────────────

export interface RailResult { group: THREE.Group; collider: AABB; }

export function buildReactorRail(_H: number): RailResult {
  const g = new THREE.Group(); g.name = 'reactor-rail';
  const RAIL_R = 0.85; const POST_H = 0.90; const CX = 0; const CZ = 1.0;
  const angles = [-130, -90, -45, 0, 45, 90, 130].map((d) => d * Math.PI / 180);
  const postMat = new THREE.MeshLambertMaterial({ color: COL_GUNMETAL });

  const postInst = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.035, 0.035, POST_H, 6), postMat, angles.length);
  const dm = new THREE.Object3D();
  angles.forEach((ang, i) => {
    dm.position.set(CX + Math.sin(ang) * RAIL_R, POST_H / 2, CZ + Math.cos(ang) * RAIL_R);
    dm.rotation.set(0, 0, 0); dm.updateMatrix(); postInst.setMatrixAt(i, dm.matrix);
  });
  postInst.instanceMatrix.needsUpdate = true; g.add(postInst);

  [0.85, 0.50].forEach((railY) => {
    const s0 = angles[0]; const span = angles[angles.length - 1] - s0;
    for (let si = 0; si < 14; si++) {
      const a0 = s0 + (si / 14) * span; const a1 = s0 + ((si + 1) / 14) * span;
      const x0 = CX + Math.sin(a0) * RAIL_R; const z0 = CZ + Math.cos(a0) * RAIL_R;
      const x1 = CX + Math.sin(a1) * RAIL_R; const z1 = CZ + Math.cos(a1) * RAIL_R;
      const dx = x1 - x0; const dz = z1 - z0; const len = Math.sqrt(dx*dx + dz*dz);
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, len, 5), postMat);
      seg.position.set((x0+x1)/2, railY, (z0+z1)/2);
      seg.rotation.y = -Math.atan2(dz, dx) + Math.PI / 2;
      g.add(seg);
    }
  });

  const ring = new THREE.Mesh(new THREE.RingGeometry(0.80, 1.05, 32), matHazardStriping);
  ring.rotation.x = -Math.PI / 2; ring.position.set(CX, 0.002, CZ); g.add(ring);

  return {
    group: g,
    collider: {
      minX: CX-RAIL_R-0.1, minY: 0, minZ: CZ-RAIL_R-0.1,
      maxX: CX+RAIL_R+0.1, maxY: POST_H+0.05, maxZ: CZ+RAIL_R+0.1,
    },
  };
}

// ── Wall dressing ──────────────────────────────────────────────────────────────

export function buildWallConduits(g: THREE.Group, W: number, H: number, D: number): void {
  buildBaseWallDressing(g, W, H, D);
  buildForeConduits(g, W, H, D);
  buildAftWallDressing(g, W, H, D);
}

// ── Breaker cabinet ────────────────────────────────────────────────────────────

export interface CabinetResult { group: THREE.Group; collider: AABB; }

export function buildBreakerCabinet(roomH: number, roomD: number, halfW: number): CabinetResult {
  const g = new THREE.Group(); g.name = 'breaker-cabinet';
  const CW = 1.20; const CH = 0.80; const CD = 0.22;
  const px = -halfW + CD/2; const py = roomH*0.3 + CH/2; const pz = -roomD/2 + 1.8;

  const body = new THREE.Mesh(new THREE.BoxGeometry(CD, CH, CW), matGun());
  body.position.set(px, py, pz); g.add(body);

  const scr = new THREE.Mesh(new THREE.PlaneGeometry(CW*0.7, CH*0.55), matConsoleScreen);
  scr.position.set(px - CD/2 - 0.001, py + CH*0.05, pz); scr.rotation.y = Math.PI/2; g.add(scr);

  // 12 emissive pips (4 columns x 3 rows)
  const lightGeo = new THREE.BoxGeometry(0.03, 0.03, 0.01);
  const dm = new THREE.Object3D();
  const pipColors = [COL_STA_G, COL_STA_G, COL_STA_O, COL_TEAL];
  for (let ci = 0; ci < 4; ci++) {
    const inst = new THREE.InstancedMesh(lightGeo, new THREE.MeshBasicMaterial({ color: pipColors[ci] }), 3);
    for (let r = 0; r < 3; r++) {
      dm.position.set(px - CD/2 - 0.003, py - CH*0.28 + r*0.080, pz - CW*0.35 + ci*0.100);
      dm.rotation.set(0, Math.PI/2, 0); dm.updateMatrix(); inst.setMatrixAt(r, dm.matrix);
    }
    inst.instanceMatrix.needsUpdate = true; g.add(inst);
  }

  return {
    group: g,
    collider: {
      minX: px-CD/2, minY: py-CH/2, minZ: pz-CW/2,
      maxX: px+CD/2, maxY: py+CH/2, maxZ: pz+CW/2,
    },
  };
}

// ── Crates ─────────────────────────────────────────────────────────────────────

export interface CrateResult { group: THREE.Group; collider: AABB; }

function buildCrate(x: number, z: number, w: number, h: number, d: number, crateName: string): CrateResult {
  const g = new THREE.Group(); g.name = crateName;
  const T = 0.04;
  const sm = matCrateOrange();
  const bm = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matGun());
  bm.position.set(x, h/2, z); g.add(bm);
  ([
    [x, h-T/2, z-d/2+T/2, w,T,T], [x, h-T/2, z+d/2-T/2, w,T,T],
    [x-w/2+T/2, h-T/2, z, T,T,d], [x+w/2-T/2, h-T/2, z, T,T,d],
  ] as [number,number,number,number,number,number][]).forEach(([bpx,bpy,bpz,sw,sh,sd]) => {
    const s = new THREE.Mesh(new THREE.BoxGeometry(sw, sh, sd), sm);
    s.position.set(bpx, bpy, bpz); g.add(s);
  });
  return {
    group: g,
    collider: {
      minX: x-w/2, minY: 0, minZ: z-d/2,
      maxX: x+w/2, maxY: h, maxZ: z+d/2,
    },
  };
}

function buildHiddenFloorPanel(g: THREE.Group, x: number, z: number, w: number, d: number): void {
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.04, d - 0.04), matFloorPanel());
  panel.name = 'hidden-floor-panel';
  panel.rotation.x = -Math.PI / 2;
  panel.position.set(x, 0.001, z);
  g.add(panel);

  const seamMat = matFloorSeam();
  const seamThick = 0.012;
  const seamY = 0.002;
  const seams: [number, number, number, number][] = [
    [x, z - d/2 + seamThick/2, w - 0.04, seamThick],
    [x, z + d/2 - seamThick/2, w - 0.04, seamThick],
    [x - w/2 + seamThick/2, z, seamThick, d - 0.04],
    [x + w/2 - seamThick/2, z, seamThick, d - 0.04],
  ];
  for (const [sx, sz, sw, sd] of seams) {
    const seam = new THREE.Mesh(new THREE.PlaneGeometry(sw, sd), seamMat);
    seam.rotation.x = -Math.PI / 2;
    seam.position.set(sx, seamY, sz);
    g.add(seam);
  }
}

export function buildCrates(halfW: number, _halfD: number): CrateResult[] {
  const CRATE_B_X = -halfW+1.55; const CRATE_B_Z = -0.3;
  const crateA = buildCrate(-halfW+0.65, -0.5, 0.70, 0.55, 0.55, 'crate-a');
  const crateB = buildCrate(CRATE_B_X, CRATE_B_Z, 0.55, 0.42, 0.55, 'crate-b');
  buildHiddenFloorPanel(crateB.group, CRATE_B_X, CRATE_B_Z, 0.55, 0.55);
  return [crateA, crateB];
}
