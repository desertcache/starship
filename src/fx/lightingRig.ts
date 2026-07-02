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
 *
 * v0.9 B3 (RADIANCE lighting-and-grade art pass — judged on HEADED shots vs
 * refs-v08/ref-5). Every prior value above was graded on 2x-too-bright albedo
 * (v0.1 color-space bug, fixed B1) AND darker SwiftShader headless shots — so
 * on honest GPU the ship read evenly-lit and flat. Prop albedo floors (≥#20232a)
 * now let shadows carve much deeper without 0-RGB voids. Changes this pass:
 *   - GLOBAL FILL CUT (the flat-bright culprit): hemi 0.10→0.05, ambient
 *     0.07→0.03 (env 0.34→0.18 + exposure 1.05→1.00 in main.ts). Pools now
 *     pool; deepest shadow sits blue-grey (hemi ground 0x171a20), not black.
 *   - ENGINEERING red mood: reactorSpot was a downward SpotLight self-shadowed
 *     by the reactor column standing inside its own cone (SwiftShader hid it) →
 *     converted to a red PointLight at reactor mid-height (0,1.5,5.5), no shadow.
 *     Radiates through the (non-shadowing) column to wash all walls red; the
 *     column's outward-facing surface stays dark (lit from inside) so the teal
 *     emissive core reads AGAINST the red room-glow. Breathes in-phase as before.
 *   - GALLEY: the warm ceiling POINT light was replaced by a SpotLight aimed at
 *     the starboard counter/backsplash. A point light flooded the open glossy
 *     floor and threw a hot specular blob into the foreground; the spot lights
 *     only the workspace (ref-6 warm-dominant counter) and leaves the floor dark.
 *   - SHADOWS: casting spot map 1024→2048. Two casters: junctionSpot (corridor)
 *     and galleySpot (counter cookware contact shadow). reactorSpot no longer
 *     casts (it's the red room-glow point now). Cheap on the measured headroom.
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
  // v0.9 B3: 1024→2048. Only junctionSpot casts now (reactorSpot demoted to a
  // non-shadowing PointLight for the red room-glow), and the headed perf sample
  // has deep headroom — spend it on a crisper contact shadow.
  light.shadow.mapSize.set(2048, 2048);
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
  cockpitWarmPt: THREE.PointLight;
  junctionSpot: THREE.SpotLight;
  qPortPt: THREE.PointLight;
  qStbdPt: THREE.PointLight;
  corridorPt: THREE.PointLight;
  galleySpot: THREE.SpotLight;
  reactorSpot: THREE.PointLight;
  thresholdPt: THREE.PointLight;
  cargoPt: THREE.PointLight;
}

/**
 * Build and add the full ship lighting rig to `scene`.
 * Returns handles so callers can inspect or animate lights if needed.
 */
export function buildLightingRig(scene: THREE.Scene): LightingRigHandles {
  // ── Global fill ──────────────────────────────────────────────────────────────
  // v0.9 B3: hemi 0.10→0.05. On honest-albedo GPU the hemisphere fill was
  // lifting every upward-facing surface into an even bright wash that fought all
  // pooling. Halved. Ground 0x171a20 kept — it sets the blue-grey deepest-shadow
  // floor colour (targets ~#101418 in the deepest corners, never 0-RGB).
  const hemi = new THREE.HemisphereLight(0xffe9d0, 0x171a20, 0.05);
  scene.add(hemi);

  // Ambient: v0.9 B3 0.07→0.03. Flat omnidirectional fill is the enemy of pools;
  // cut hard. Prop albedo floors (≥#20232a) + hemi ground carry the anti-crush
  // job now, so ambient only needs to keep the very deepest shadows off 0-RGB.
  const ambient = new THREE.AmbientLight(0xfff0e0, 0.03);
  scene.add(ambient);

  // ── 1h. Cockpit HERO — teal console PointLight ────────────────────────────
  // v0.6 P2 final: intensity 3.0, distance 1.5 (unchanged — hero teal character kept).
  const cockpitPt = new THREE.PointLight(0x46E0D8, 3.0, 1.5, 2);
  // Console face world Z ≈ -24.38, Y at screen height ≈ 1.15
  cockpitPt.position.set(0, 1.15, -24.38);
  scene.add(cockpitPt);

  // ── 1i. Cockpit warm pool — H4 fix-round ───────────────────────────────────
  // The cockpit had ZERO warm light source (2 critics, vs ref-5's warm-washed
  // room): only the teal console point + faint global fill, so the whole room
  // read cold/inverted-teal. One measured warm (WARM=0xffe2c0) PointLight over
  // the console/canopy-sill area — no shadow (perf-cheap point sample only) —
  // so warm dominates the room while cockpitPt's teal keeps its screen-glow
  // accent character. Positioned above the console bank, below the canopy
  // sill line, central: local (0,1.9,-1.6) → world (0,1.9,-24.1).
  // R2: first pass (2.6/5.0) was invisible against the 6W room + the many
  // self-lit (MeshBasicMaterial, light-independent) teal screens/floor-strips/
  // underglow planes that dominate the cockpit regardless of scene lighting —
  // headed screenshot still read all-teal. Boosted intensity/distance so the
  // PBR walls/seats/console-housings actually pick up a visible warm wash.
  const cockpitWarmPt = new THREE.PointLight(WARM, 7.0, 8.0, 2);
  cockpitWarmPt.position.set(0, 1.9, -24.1);
  scene.add(cockpitWarmPt);

  // ── 2. Quarters junction — CORRIDOR POOL A (SpotLight) ────────────────────
  // Stage D boost: 4.2→4.8 (+15%) to compensate reduced fill.
  // angle=1.1 rad (~63°), penumbra=0.4, decay=2.
  const junctionSpot = new THREE.SpotLight(WARM, 4.8, 8.0, 1.1, 0.4, 2);
  junctionSpot.position.set(0, 2.5, -16);
  junctionSpot.target.position.set(0, 0, -16);
  scene.add(junctionSpot);
  scene.add(junctionSpot.target);
  configureSpotShadow(junctionSpot);

  // ── 3a. Quarters port — intimate amber pool ────────────────────────────────
  // Stage D boost: 2.0→2.6 (+30%) — quarters cam is far from junction pool.
  const qPortPt = new THREE.PointLight(0xffd9b0, 2.6, 5.0, 2);
  qPortPt.position.set(-4, 2.2, -16);
  scene.add(qPortPt);

  // ── 3b. Quarters starboard — same warmer tint ─────────────────────────────
  const qStbdPt = new THREE.PointLight(0xffd9b0, 2.6, 5.0, 2);
  qStbdPt.position.set(4, 2.2, -16);
  scene.add(qStbdPt);

  // ── 4. Corridor mid — POOL C (aft, near galley door ~Z=-8.5) ─────────────
  // Stage D boost: 2.8→3.2 (+15%).
  const corridorPt = new THREE.PointLight(WARM, 3.2, 5.0, 2);
  corridorPt.position.set(0, 2.4, -8.5);
  scene.add(corridorPt);

  // ── 5. Galley — warm SPOT on the counter run (v0.9 B3 round 2) ────────────
  // R1 moved a POINT light onto the counter, but a point light still floods the
  // open floor → a hot specular blob on the glossy foreground (the camera catches
  // its mirror reflection). A SpotLight AIMED at the counter/backsplash (world
  // face X≈2.45, top Y≈0.9) lights only the workspace — ref-6's warm-dominant
  // counter — and leaves the open centre floor dark, so the blob has no light to
  // reflect. Also restores the 2nd shadow caster (item 7): cookware casts a soft
  // contact shadow on the counter. angle 0.85 rad (~49°), penumbra 0.5, decay 2.
  // R3: tightened (0.85→0.6 rad) and pulled over the counter (X 1.65→2.0),
  // aimed steeper at the backsplash (target Y 1.05→1.15). A wider/forward cone
  // still spilled onto the open glossy floor in front of the counter and the
  // camera caught that specular patch; the tighter, steeper, wall-hugging cone
  // keeps all direct light on the counter/backsplash/cabinets so the open floor
  // stays dark and has nothing to mirror.
  // v0.9 RADIANCE fix-round M6: angle 0.6→0.7 rad (+0.1) — widen the hard
  // cone slightly so the warm wash spreads a bit beyond the counter instead
  // of reading as a tight spotlit circle; penumbra 0.45 already soft-edges it.
  const galleySpot = new THREE.SpotLight(WARM, 5.2, 7.0, 0.7, 0.45, 2);
  galleySpot.position.set(2.0, 2.75, -1.4);
  galleySpot.target.position.set(2.6, 1.15, -1.4);
  scene.add(galleySpot);
  scene.add(galleySpot.target);
  configureSpotShadow(galleySpot);

  // ── 6. Engineering reactor (RED-ORANGE) — animated room-glow PointLight ────
  // v0.9 B3: was a downward SpotLight at (0,2.4,5.5) pointing straight down the
  // reactor column — the column (radius 0.45, floor-to-ceiling at that XZ) stood
  // inside its own cone and self-shadowed it, so on GPU the room got NO red glow
  // (only a blown white disc on the base). Converted to a PointLight at the
  // column mid-height. It does NOT cast shadow, so it radiates freely through the
  // column to wash all four walls + ceiling red; the column's outward faces are
  // lit from the inside (NdotL≤0) and stay dark, so the teal emissive core reads
  // AGAINST the red room-glow — the signature engineering contrast. Breathes
  // in-phase (2.1 rad/s) with the teal reactor-glow light in engineeringProps.ts.
  // R2: raised 1.5→1.85 + intensity 4.0→3.4. At y=1.5 the light sat close to the
  // pale hazard-stripe base disc and blew it near-white; raising it (further from
  // the disc, ~unchanged horizontal throw to the walls) calms the disc more than
  // the wall wash, so the room keeps its red mood while the base reads red not white.
  const reactorSpot = new THREE.PointLight(0xff5a22, 3.4, 10.0, 2);
  reactorSpot.position.set(0, 1.85, 5.5);
  scene.add(reactorSpot);

  // Animate reactor intensity via self-animating invisible mesh (no main.ts edit).
  const reactorDummy = new THREE.Mesh(
    new THREE.PlaneGeometry(0.001, 0.001),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  reactorDummy.position.set(0, 2.4, 5.5);
  reactorDummy.onBeforeRender = (): void => {
    const t = performance.now() / 1000;
    reactorSpot.intensity = 3.4 + Math.sin(t * 2.1) * 1.0;
  };
  scene.add(reactorDummy);

  // ── 7. Corridor threshold — POOL B (fore, near cockpit door ~Z=-19) ───────
  // Stage D boost: 1.8→2.0 (+15%).
  const thresholdPt = new THREE.PointLight(WARM, 2.0, 5.0, 2);
  thresholdPt.position.set(0, 2.4, -19);
  scene.add(thresholdPt);

  // ── 9. Cargo bay — single high pool (5H room) ────────────────────────────
  // Stage D boost: 5.0→5.6 (+15%).
  // v0.9 RADIANCE fix-round M12: distance tightened 11.0→8.5 — the long reach
  // was flooding the whole 8x5x9 room near-evenly instead of pooling, so the
  // walls read flat/featureless. Shorter falloff now gradients toward the
  // corners while keeping the cool blue-white industrial identity (unchanged).
  // (engineering.ts stray reactor glow = light #8 — counted in ship total)
  const cargoPt = new THREE.PointLight(0xe8eef2, 5.6, 8.5, 2);
  cargoPt.position.set(0, 4.2, 13.5);
  scene.add(cargoPt);

  return {
    hemi,
    ambient,
    cockpitPt,
    cockpitWarmPt,
    junctionSpot,
    qPortPt,
    qStbdPt,
    corridorPt,
    galleySpot,
    reactorSpot,
    thresholdPt,
    cargoPt,
  };
}
