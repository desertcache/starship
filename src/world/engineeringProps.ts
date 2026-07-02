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
import { matReactorHousing, matPipeDark, matCrateShell, matConsoleHousing } from '../fx/propMaterials.js';
import { addLedCluster, LedColors, makeReactorCoreTexture, GLOW_ENABLED } from '../fx/glow.js';
import { buildLightShaft } from '../fx/volumetrics.js';

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

// Reactor column housing — confirmed void offender. Was a flat near-black
// Lambert (#1C1E22 + faint grid texture); now the shared propMaterials
// reactor-housing PBR singleton (v0.9 A-bridge).
const matHou = (): THREE.MeshStandardMaterial => matReactorHousing;

// v0.9 B2 glow build: hot-core texture (like A2's ceiling fixtures) + toneMapped
// false — the flat teal fill never cleared the 0.84 bloom threshold regardless
// of the pulse's opacity swing; the hot center now does.
const mkCoreMat = (): THREE.MeshBasicMaterial =>
  new THREE.MeshBasicMaterial({
    map: makeReactorCoreTexture(),
    color: new THREE.Color(COL_TEAL),
    transparent: true,
    opacity: 1.0,
    toneMapped: false,
  });

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
  const ribInst = new THREE.InstancedMesh(ribGeo, matReactorHousing, 7);
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

  // Teal accent strips on reactor column (phase-lagged pulse)
  [0, Math.PI/2, Math.PI, 3*Math.PI/2].forEach((ang, i) => {
    const sm2 = new THREE.MeshLambertMaterial({ color: 0x46e0d8, emissive: new THREE.Color(0x46e0d8), emissiveIntensity: 0.8 });
    const st2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, H*0.65, 0.02), sm2);
    st2.position.set(CX+Math.sin(ang)*(R+0.02), CY, CZ+Math.cos(ang)*(R+0.02));
    st2.rotation.y = -ang;
    const _i = i;
    st2.onBeforeRender = (): void => { sm2.emissiveIntensity = 0.8+Math.sin(performance.now()*0.0021+0.3+_i*0.15)*0.2; };
    g.add(st2);
  });

  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8), matGun());
  pipe.position.set(CX, H - 0.175, CZ); g.add(pipe);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 8), matGun());
  collar.position.set(CX, H - 0.04, CZ); g.add(collar);

  // ── Reactor light show (v0.9 B2 glow build, item 6) ───────────────────────
  // A teal PointLight breathing in sync with lightingRig.ts's reactorSpot
  // (same 2.1 rad/s sine, phase 0 — "reuse the exact phase so they breathe
  // together"), plus a vertical volumetric shaft rising from the column top
  // toward the ceiling. Both gated behind GLOW_ENABLED so ?glow=0 fully
  // isolates the reactor light show for perf A/B.
  if (GLOW_ENABLED) {
    const REACTOR_GLOW_BASE = 1.8;
    const REACTOR_GLOW_AMP  = 0.6;
    const reactorGlowLight = new THREE.PointLight(0x46e0d8, REACTOR_GLOW_BASE, 4, 2);
    reactorGlowLight.position.set(CX, CY, CZ);
    g.add(reactorGlowLight);

    // Source (bright end) is the column top, spatially the BOTTOM of this
    // short vertical volume — sourceAtTop=false flips the shader's axial
    // falloff so brightness peaks at the column and fades toward the ceiling.
    buildLightShaft(g, {
      x: CX, z: CZ, topY: H - 0.05, bottomY: Math.max(H - 1.1, CY - 0.3),
      sourceAtTop: false, radiusSource: 0.12, radiusFar: 0.35,
      color: 0x46e0d8, peakOpacity: 0.045, moteCount: 55, seed: 55,
      onTick: (t: number): void => {
        reactorGlowLight.intensity = REACTOR_GLOW_BASE + Math.sin(t * 2.1) * REACTOR_GLOW_AMP;
      },
    });
  }

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
  // Guard-rail posts + rail segments — confirmed void offender ("the black
  // vertical posts around the reactor"). Dark pipe-metal PBR family.
  const postMat = matPipeDark;

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
      // Left unnamed (eligible for the v0.9 A1 defrag merge pass) — screenshot
      // comparison of the 'engineering' camera showed no artifact here, both
      // merged and unmerged, unlike the corridor porthole bezel sibling case.
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

  // Breaker cabinet body — same wall-mounted electrical-box pattern as the
  // corridor junction boxes; console-housing PBR family.
  const body = new THREE.Mesh(new THREE.BoxGeometry(CD, CH, CW), matConsoleHousing);
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

  // Micro-LED cluster (v0.9 B2 glow build) — extend the existing 12-pip grid
  // subtly: 2 status lights on the cabinet's top edge, one blinking.
  addLedCluster(g, [
    { pos: new THREE.Vector3(px - CD / 2 - 0.01, py + CH / 2 - 0.03, pz - CW * 0.25), color: LedColors.teal },
    {
      pos: new THREE.Vector3(px - CD / 2 - 0.01, py + CH / 2 - 0.03, pz + CW * 0.25),
      color: LedColors.red, blink: true, period: 2.0, phase: 0.6,
    },
  ]);

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

/** Module-level reference to crate-b group for slide tween (set by buildCrates). */
let _crateBGroup: THREE.Group | null = null;
/** Get crate-b group (available after buildCrates is called). */
export function getCrateBGroup(): THREE.Group | null { return _crateBGroup; }

function buildCrate(x: number, z: number, w: number, h: number, d: number, crateName: string): CrateResult {
  const g = new THREE.Group(); g.name = crateName;
  const T = 0.04;
  const sm = matCrateOrange();
  // Crate shell — confirmed void offender ("crate shells"). Crate-shell PBR family.
  const bm = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matCrateShell);
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
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(w-0.04, d-0.04), matFloorPanel());
  panel.name = 'hidden-floor-panel'; panel.rotation.x = -Math.PI/2;
  panel.position.set(x, 0.001, z); g.add(panel);
  const sm = matFloorSeam(); const st = 0.012;
  ([
    [x, z-d/2+st/2, w-0.04, st], [x, z+d/2-st/2, w-0.04, st],
    [x-w/2+st/2, z, st, d-0.04], [x+w/2-st/2, z, st, d-0.04],
  ] as [number,number,number,number][]).forEach(([sx,sz,sw,sd]) => {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(sw, sd), sm);
    s.rotation.x = -Math.PI/2; s.position.set(sx, 0.002, sz); g.add(s);
  });
}

export function buildCrates(halfW: number, _halfD: number): CrateResult[] {
  const CRATE_B_X = -halfW+1.55; const CRATE_B_Z = -0.3;
  const crateA = buildCrate(-halfW+0.65, -0.5, 0.70, 0.55, 0.55, 'crate-a');
  const crateB = buildCrate(CRATE_B_X, CRATE_B_Z, 0.55, 0.42, 0.55, 'crate-b');
  buildHiddenFloorPanel(crateB.group, CRATE_B_X, CRATE_B_Z, 0.55, 0.55);
  _crateBGroup = crateB.group;
  return [crateA, crateB];
}
