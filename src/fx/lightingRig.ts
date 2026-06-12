/**
 * src/fx/lightingRig.ts — Ship lighting rig.
 *
 * Extracted from assembly.ts (Stage C lighting-grade re-tune).
 * Owns: hemisphere, ambient, all named point/spot lights, shadow helpers,
 * reactor animation dummy.
 *
 * Stage C tuning (surface rebuild — walls now #C6BFAF mid-cream, glossier floors):
 *   - Hemisphere fill lifted (0.12→0.16) + ground brightened (0x10121c→0x171a20)
 *     to kill 0-RGB crush without flattening pools.
 *   - Ambient lifted 0.05→0.09 (deepest shadow ≈ #14171C, no more 0-RGB regions).
 *   - Pools trimmed (lighter walls return more light):
 *       junctionSpot 5.0→4.2, galleyPt 3.4→3.0 (+moved forward Z=-1.5, dist=7.5),
 *       corridorPt 3.2→2.8, cargoPt 5.2→5.0 (dist extended 9.5→11.0),
 *       thresholdPt 2.0→1.8.
 *   - Corridor bright-dim-bright rhythm preserved; reactor + cockpit teal unchanged.
 */

import * as THREE from 'three';
import { QUALITY_LOW, SHADOWS_OFF } from '../core/perf.js';

// ── Palette ────────────────────────────────────────────────────────────────────
const WARM = 0xffe2c0; // tungsten ceiling-pool colour

// ── Shadow helper ──────────────────────────────────────────────────────────────

/**
 * Configure a SpotLight as a downward shadow-casting pool light.
 * ONE shadow face (vs PointLight's 6) = 6× fewer shadow draw calls.
 * No-op when ?quality=low or ?shadows=0.
 * bias/normalBias prevent self-shadow acne on props.
 * near/far tightened to actual room depth so frustum doesn't span empty space.
 */
function configureSpotShadow(light: THREE.SpotLight): void {
  if (QUALITY_LOW || SHADOWS_OFF) return;
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far  = 8;
  light.shadow.bias        = -0.0003;
  light.shadow.normalBias  = 0.02;
}

// ── Exported lights the caller may need (e.g. for animation access) ────────────

export interface LightingRigHandles {
  hemi: THREE.HemisphereLight;
  ambient: THREE.AmbientLight;
  cockpitPt: THREE.PointLight;
  junctionSpot: THREE.SpotLight;
  qPortPt: THREE.PointLight;
  qStbdPt: THREE.PointLight;
  corridorPt: THREE.PointLight;
  galleyPt: THREE.PointLight;
  reactorSpot: THREE.SpotLight;
  thresholdPt: THREE.PointLight;
  cargoPt: THREE.PointLight;
}

/**
 * Build and add the full ship lighting rig to `scene`.
 * Returns handles so callers can inspect or animate lights if needed.
 */
export function buildLightingRig(scene: THREE.Scene): LightingRigHandles {
  // ── Global fill ──────────────────────────────────────────────────────────────
  // Stage C: hemi 0.12→0.16, ground 0x10121c→0x171a20 — kills 0-RGB crush
  // while keeping pools clearly pooled vs fill.
  const hemi = new THREE.HemisphereLight(0xffe9d0, 0x171a20, 0.16);
  scene.add(hemi);

  // Ambient: Stage C lift 0.05→0.09 — deepest shadow ≈ #14171C not #000000.
  // Extra lift vs initial 0.07 to keep galley foreground and cargo lower walls
  // from reading as featureless black.
  const ambient = new THREE.AmbientLight(0xfff0e0, 0.09);
  scene.add(ambient);

  // ── 1h. Cockpit HERO — teal console PointLight ────────────────────────────
  // v0.6 P2 final: intensity 3.0, distance 1.5 (unchanged — hero teal character kept).
  const cockpitPt = new THREE.PointLight(0x46E0D8, 3.0, 1.5, 2);
  // Console face world Z ≈ -24.38, Y at screen height ≈ 1.15
  cockpitPt.position.set(0, 1.15, -24.38);
  scene.add(cockpitPt);

  // ── 2. Quarters junction — CORRIDOR POOL A (SpotLight) ────────────────────
  // Stage C trim: 5.0→4.2 (lighter walls return ~15% more light).
  // angle=1.1 rad (~63°), penumbra=0.4, decay=2.
  const junctionSpot = new THREE.SpotLight(WARM, 4.2, 8.0, 1.1, 0.4, 2);
  junctionSpot.position.set(0, 2.5, -16);
  junctionSpot.target.position.set(0, 0, -16);
  scene.add(junctionSpot);
  scene.add(junctionSpot.target);
  configureSpotShadow(junctionSpot);

  // ── 3a. Quarters port — intimate amber pool ────────────────────────────────
  // 0xffd9b0: warmer amber-tungsten domestic/cozy identity. Unchanged Stage C.
  const qPortPt = new THREE.PointLight(0xffd9b0, 2.0, 4.4, 2);
  qPortPt.position.set(-4, 2.2, -16);
  scene.add(qPortPt);

  // ── 3b. Quarters starboard — same warmer tint ─────────────────────────────
  const qStbdPt = new THREE.PointLight(0xffd9b0, 2.0, 4.4, 2);
  qStbdPt.position.set(4, 2.2, -16);
  scene.add(qStbdPt);

  // ── 4. Corridor mid — POOL C (aft, near galley door ~Z=-8.5) ─────────────
  // Stage C trim: 3.2→2.8 (bright walls return more; preserve dim-between-pools).
  const corridorPt = new THREE.PointLight(WARM, 2.8, 5.0, 2);
  corridorPt.position.set(0, 2.4, -8.5);
  scene.add(corridorPt);

  // ── 5. Galley — warm ceiling pool over counter run ────────────────────────
  // Stage C trim: 3.4→3.0; moved slightly forward (Z -1→-1.5) to better
  // cover the camera-side foreground table area (local cam at Z≈-0.4).
  const galleyPt = new THREE.PointLight(WARM, 3.0, 7.5, 2);
  galleyPt.position.set(0.5, 2.4, -1.5);
  scene.add(galleyPt);

  // ── 6. Engineering reactor (RED-ORANGE) — animated SpotLight ──────────────
  // angle=1.0 rad (~57°), penumbra=0.3, decay=2. UNCHANGED — keeps character.
  const reactorSpot = new THREE.SpotLight(0xff5a22, 5.2, 8.0, 1.0, 0.3, 2);
  reactorSpot.position.set(0, 2.4, 5.5);
  reactorSpot.target.position.set(0, 0, 5.5);
  scene.add(reactorSpot);
  scene.add(reactorSpot.target);
  configureSpotShadow(reactorSpot);

  // Animate reactor intensity via self-animating invisible mesh (no main.ts edit).
  const reactorDummy = new THREE.Mesh(
    new THREE.PlaneGeometry(0.001, 0.001),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  reactorDummy.position.set(0, 2.4, 5.5);
  reactorDummy.onBeforeRender = (): void => {
    const t = performance.now() / 1000;
    reactorSpot.intensity = 5.2 + Math.sin(t * 2.1) * 1.0;
  };
  scene.add(reactorDummy);

  // ── 7. Corridor threshold — POOL B (fore, near cockpit door ~Z=-19) ───────
  // Stage C trim: 2.0→1.8 — dimmer than A/C preserves bright-dim-bright rhythm.
  const thresholdPt = new THREE.PointLight(WARM, 1.8, 5.0, 2);
  thresholdPt.position.set(0, 2.4, -19);
  scene.add(thresholdPt);

  // ── 9. Cargo bay — single high pool (5H room) ────────────────────────────
  // Stage C: 5.2→5.0 (slight trim; keep readable depth in large volume).
  // Distance extended to 11.0 to reach lower walls of the tall room.
  // 0xe8eef2: cool blue-white industrial identity (unchanged).
  // (engineering.ts stray reactor glow = light #8 — counted in ship total)
  const cargoPt = new THREE.PointLight(0xe8eef2, 5.0, 11.0, 2);
  cargoPt.position.set(0, 4.2, 13.5);
  scene.add(cargoPt);

  return {
    hemi,
    ambient,
    cockpitPt,
    junctionSpot,
    qPortPt,
    qStbdPt,
    corridorPt,
    galleyPt,
    reactorSpot,
    thresholdPt,
    cargoPt,
  };
}
