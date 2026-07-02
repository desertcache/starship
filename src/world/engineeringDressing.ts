/**
 * Engineering aft-wall dressing — v0.2 fill pass.
 * Pipe manifold runs, output conduits, HAZARD stencil ring, fore conduit panels.
 *
 * FILE OWNERSHIP: only engineeringProps.ts may import this module.
 */
import * as THREE from 'three';
import { matShipWall, matHazardStriping, matRedAccent } from '../fx/shipMaterials.js';
import { cached, addGrime } from '../fx/textureHelpers.js';
import { matPipeDark } from '../fx/propMaterials.js';
import { addLedCluster, LedColors } from '../fx/glow.js';

// ── Textures ───────────────────────────────────────────────────────────────────

function mkConduitTex(): THREE.CanvasTexture {
  return cached('eng-conduit', () => {
    const S = 512; const cv = document.createElement('canvas'); cv.width = cv.height = S;
    const c = cv.getContext('2d')!;
    // v0.9 RADIANCE fix-round H3-partial: base fill cooled slightly (less R,
    // more neutral) — under engineering's intense red room-glow (the only
    // light in this room per the B3 lighting pass), these large conduit
    // panels were reading as warm-brown corrugated wood siding.
    c.fillStyle = '#1F232A'; c.fillRect(0, 0, S, S);
    const r = (s: number): (() => number) => {
      let st = s;
      return (): number => { st = (st * 1664525 + 1013904223) >>> 0; return st / 0x100000000; };
    };
    const rr = r(991);
    // Band contrast halved (alpha 0.5-0.8 → 0.22-0.37, highlight 0.15→0.08) —
    // kept the panel-seam identity but killed the "plank corrugation" read at
    // the few-large-bands-per-panel scale these stretch to.
    for (let y = 40; y < S; y += 60 + Math.floor(rr() * 20)) {
      const h = 12 + Math.floor(rr() * 10);
      c.fillStyle = `rgba(10,10,14,${(0.22 + rr() * 0.15).toFixed(2)})`; c.fillRect(0, y, S, h);
      c.fillStyle = 'rgba(80,90,100,0.08)'; c.fillRect(0, y, S, 2);
    }
    c.strokeStyle = 'rgba(0,0,0,0.6)'; c.lineWidth = 2;
    for (let x = 128; x < S; x += 128) { c.beginPath(); c.moveTo(x,0); c.lineTo(x,S); c.stroke(); }
    addGrime(c, S, S, 443, 0.22);
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  });
}

function mkHazardStencilTex(): THREE.CanvasTexture {
  return cached('eng-hazard-stencil', () => {
    const S = 512;
    const cv = document.createElement('canvas'); cv.width = cv.height = S;
    const c = cv.getContext('2d')!;
    c.fillStyle = '#1C1E22'; c.fillRect(0, 0, S, S);
    const stripeW = 48;
    c.save(); c.rotate(Math.PI / 4);
    for (let x = -S * 2; x < S * 3; x += stripeW * 2) {
      c.fillStyle = '#C7641E'; c.fillRect(x, -S * 2, stripeW, S * 5);
    }
    c.restore();
    c.fillStyle = 'rgba(255,220,0,0.9)';
    c.font = 'bold 38px monospace'; c.textAlign = 'center';
    c.fillText('REACTOR HAZARD', S/2, S * 0.55);
    c.font = '22px monospace'; c.fillStyle = 'rgba(255,255,255,0.8)';
    c.fillText('KEEP CLEAR 1.5M', S/2, S * 0.72);
    const t = new THREE.CanvasTexture(cv);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  });
}

// ── Lazy material accessors ────────────────────────────────────────────────────

let _mCon: THREE.MeshLambertMaterial | null = null;
function matCon(): THREE.MeshLambertMaterial {
  return _mCon ?? (_mCon = new THREE.MeshLambertMaterial({ map: mkConduitTex() }));
}

// Aft-wall pipe manifold + output conduits — confirmed void offender
// ("wall pipe runs"). Dark pipe-metal PBR family (v0.9 A-bridge).
function matGun(): THREE.MeshStandardMaterial {
  return matPipeDark;
}

// ── Fore-quadrant extra conduit panels ────────────────────────────────────────

/**
 * 2 extra conduit panels per side in fore quadrant (Z offsets -0.1, -0.2).
 * Complements the 2 aft-centre panels already placed by buildWallConduits.
 */
export function buildForeConduits(g: THREE.Group, W: number, H: number, D: number): void {
  const hw = W / 2; const hd = D / 2; const T = 0.06;
  for (let row = 0; row < 2; row++) {
    const ph = H * 0.38; const pw = D * 0.40;
    const p = new THREE.Mesh(new THREE.BoxGeometry(T, ph, pw), matCon());
    p.position.set(-hw + T/2, ph/2 + row*(ph+0.14), -hd*0.1 - row * 0.10);
    g.add(p);
  }
  for (let row = 0; row < 2; row++) {
    const ph = H * 0.36; const pw = D * 0.38;
    const p = new THREE.Mesh(new THREE.BoxGeometry(T, ph, pw), matCon());
    p.position.set(hw - T/2, ph/2 + row*(ph+0.14), -hd*0.1 - row * 0.10);
    g.add(p);
  }
}

// ── AFT wall manifold + conduits + hazard ring ─────────────────────────────────

/**
 * Densify the aft wall (Z = +hd, reactor-facing):
 *   - 3 horizontal pipe manifold runs at Y=1.0/1.6/2.2
 *   - 4 output conduits dropping to floor
 *   - HAZARD caution stencil ring around reactor base
 */
export function buildAftWallDressing(g: THREE.Group, W: number, _H: number, D: number): void {
  const hd = D / 2; const T = 0.06;
  const AFT_Z = hd - T / 2;

  // Horizontal pipe manifold runs
  const pipeYs = [1.0, 1.6, 2.2];
  for (const py of pipeYs) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, W * 0.85, 10), matGun());
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, py, AFT_Z);
    g.add(pipe);
    for (const sx of [-W * 0.42, W * 0.42]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 8), matGun());
      cap.rotation.z = Math.PI / 2;
      cap.position.set(sx, py, AFT_Z);
      g.add(cap);
    }
  }

  // Output conduits dropping to floor from manifold at Y=1.0
  const conduitXs = [-W * 0.35, -W * 0.12, W * 0.12, W * 0.35];
  for (const cx of conduitXs) {
    const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.02, 8), matGun());
    drop.position.set(cx, 0.50, AFT_Z);
    g.add(drop);
  }

  // HAZARD caution stencil ring around reactor base (reactor is at CX=0, CZ=1.0)
  const hazardRingMat = new THREE.MeshBasicMaterial({
    map: mkHazardStencilTex(),
    transparent: true,
    opacity: 0.85,
  });
  const hazardRing = new THREE.Mesh(new THREE.RingGeometry(1.10, 1.55, 32), hazardRingMat);
  hazardRing.rotation.x = -Math.PI / 2;
  hazardRing.position.set(0, 0.003, 1.0);
  g.add(hazardRing);
}

// ── Standard conduit + hazard accent panels (original set) ───────────────────

/**
 * Original wall conduit panels (2 per side in aft-centre) + existing accents.
 * Kept here to break the dependency; engineeringProps.ts calls this.
 */
export function buildBaseWallDressing(g: THREE.Group, W: number, H: number, D: number): void {
  const hw = W / 2; const hd = D / 2; const T = 0.06;

  // 2 conduit panels per side (aft-centre)
  for (let row = 0; row < 2; row++) {
    const ph = H * 0.4; const pw = D * 0.55;
    const p = new THREE.Mesh(new THREE.BoxGeometry(T, ph, pw), matCon());
    p.position.set(-hw + T/2, ph/2 + row*(ph+0.12), hd*0.1); g.add(p);
  }
  for (let row = 0; row < 2; row++) {
    const ph = H * 0.4; const pw = D * 0.45;
    const p = new THREE.Mesh(new THREE.BoxGeometry(T, ph, pw), matCon());
    p.position.set(hw - T/2, ph/2 + row*(ph+0.12), hd*0.2); g.add(p);
  }

  const red = new THREE.Mesh(new THREE.BoxGeometry(T, H*0.55, D*0.35), matRedAccent);
  red.position.set(hw - T/2, H*0.72, -hd*0.5); g.add(red);
  const hz = new THREE.Mesh(new THREE.BoxGeometry(W*0.55, 0.003, 0.22), matHazardStriping);
  hz.position.set(0, 0.002, -0.25); g.add(hz);
  const whz = new THREE.Mesh(new THREE.BoxGeometry(T*0.5, 0.18, D*0.3), matHazardStriping);
  whz.position.set(-hw + 0.02, 0.09, 0); g.add(whz);
  // Aft wall dressing: two flanking panels, each 1.2W, centred at X=±1.6.
  // The new aft doorway (CARGO_GAP_W=1.34) occupies |X|<0.67 — flanking panels
  // sit at |X|=1.6 ± 0.6 = [1.0, 2.2], clear of the 0.67m half-gap on each side.
  // Depth (T=0.06) sits 5mm proud of the aft wall face (hd - T/2 + 0.005)
  // so the back face is never coplanar with the structural wall plane.
  const AFT_PANEL_Z = hd - T / 2 + 0.005; // 5mm proud — clears z-fight
  const aftL = new THREE.Mesh(new THREE.BoxGeometry(1.2, H*0.45, T), matShipWall);
  aftL.position.set(-1.6, H*0.55, AFT_PANEL_Z); g.add(aftL);
  const aftR = new THREE.Mesh(new THREE.BoxGeometry(1.2, H*0.45, T), matShipWall);
  aftR.position.set( 1.6, H*0.55, AFT_PANEL_Z); g.add(aftR);

  // Micro-LED cluster (v0.9 B2 glow build) — scattered status lights across
  // the conduit wall panels, "ship systems are alive." One blinks.
  addLedCluster(g, [
    { pos: new THREE.Vector3(-hw + T + 0.005, H * 0.30, hd * 0.1), color: LedColors.teal },
    { pos: new THREE.Vector3(-hw + T + 0.005, H * 0.68, hd * 0.1), color: LedColors.orange },
    { pos: new THREE.Vector3(hw - T - 0.005, H * 0.30, hd * 0.2), color: LedColors.teal },
    {
      pos: new THREE.Vector3(hw - T - 0.005, H * 0.68, hd * 0.2),
      color: LedColors.warm, blink: true, period: 2.8, phase: 0.15,
    },
  ]);
}
