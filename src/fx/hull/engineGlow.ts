/**
 * src/fx/hull/engineGlow.ts — throttle-keyed engine plume glow at the stern
 * nozzles (v1.2 LANDFALL Stage 0, Lane P1b).
 *
 * Pure emissive dressing, NO lights (D4/D6 precedent — the hull already has
 * a dedicated key/rim/fill rig in hullLighting.ts; this is a chase-cam-only
 * accent, not a scene illuminant). Per engineGlowAnchors entry (exterior.ts,
 * two anchors at the port/starboard nozzles) this builds:
 *   - a tapered flame-plume cone, apex pinned at the nozzle, flaring outward
 *     along the anchor's normal (ship-frame stern direction);
 *   - a camera-facing glow disc (a plane + radial-gradient CanvasTexture,
 *     same `cached()` house pattern as hullMaterial.ts) selling a hot core
 *     from any viewing angle instead of reading as a flat painted circle.
 * Both are additive, depthWrite:false, toneMapped:false, and carry
 * mesh.layers.set(1) — chase-cam-only, exactly like the hull itself; the
 * interior/walk camera (layer 0) never sees them.
 *
 * Zero per-frame allocation: geometry/materials/texture built once at init;
 * tick() only mutates existing scale/opacity fields plus one accumulated-dt
 * counter feeding a small seeded flicker (fx/space/rng.ts's makeRng — never
 * Math.random, never wall-clock, per CLAUDE.md).
 *
 * initEngineGlow() takes the camera (not just the scene, despite the design
 * brief's shorthand) because the core disc bills toward it every frame —
 * only flight/flightBoot.ts (which already holds both refs) calls this, so
 * widening the signature costs nothing outside this pair of files.
 */
import * as THREE from 'three';
import { engineGlowAnchors } from './exterior.js';
import { cached } from '../textureHelpers.js';
import { getFlight } from '../../flight/flightState.js';
import { MAX_SPEED_CRUISE } from '../../flight/flightTuning.js';
import { makeRng } from '../space/rng.js';

const GLOW_LAYER = 1;
const TEAL_HEX = 0x46e0d8;
const TEAL_RGB = '70,224,216';

const PLUME_RADIUS = 0.42;
const PLUME_BASE_LEN = 2.2; // unscaled cone length; scale.z drives the live length
const CORE_HALF_SIZE = 0.55; // camera-facing glow plane half-width

const PLUME_MIN_LEN = 0.5; // length fraction at zero throttle (idle burn)
const PLUME_MAX_LEN = 1.7; // length fraction at full cruise throttle
const CORE_MIN_OPACITY = 0.3;
const CORE_MAX_OPACITY = 1.0;
// flightHud.ts's own comment: "No dedicated BOOST field on FlightSnapshot —
// speed clearing cruise max is the observable proxy." Reused verbatim here.
const BOOST_SPEED_THRESHOLD = MAX_SPEED_CRUISE * 1.02;
const BOOST_KICK = 1.4; // extra length/brightness multiplier while boosting

const FLICKER_AMOUNT = 0.07; // ± fraction of length/opacity
const FLICKER_SPEED = 10; // radians/sec against accumulated dt, not wall clock

interface GlowUnit {
  plume: THREE.Mesh;
  core: THREE.Mesh;
  flickerPhase: number;
}

let units: GlowUnit[] = [];
let camera: THREE.PerspectiveCamera | null = null;
let accumTime = 0;

function buildCoreGlowTexture(): THREE.CanvasTexture {
  return cached('engine-glow-core', () => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const c = size / 2;
    const g = ctx.createRadialGradient(c, c, 0, c, c, c);
    g.addColorStop(0.0, 'rgba(255,255,255,1.0)'); // white-hot center
    g.addColorStop(0.4, `rgba(${TEAL_RGB},0.85)`);
    g.addColorStop(1.0, `rgba(${TEAL_RGB},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, true); // authored color data, same convention as hullMaterial.ts's emissive map
}

/** Build the two-anchor glow rig. Call AFTER createExteriorHull() populates
 *  engineGlowAnchors (fx/hull/exterior.ts) — an empty anchor list no-ops
 *  rather than throwing, defensive against call-order drift. */
export function initEngineGlow(scene: THREE.Scene, cam: THREE.PerspectiveCamera): void {
  camera = cam;
  const flickerRng = makeRng(0x9160);

  units = engineGlowAnchors.map((anchor, i) => {
    const normal = anchor.normal.clone().normalize();

    // Cone default axis is +Y (apex at +h/2); rotate the axis onto local Z
    // then translate so the apex sits at the geometry origin and the flared
    // base trails toward local -Z — scale.z then lengthens the plume from a
    // fixed apex, exactly the "key plume length via scale.z" contract.
    const plumeGeo = new THREE.ConeGeometry(PLUME_RADIUS, PLUME_BASE_LEN, 10, 1, true);
    plumeGeo.rotateX(Math.PI / 2);
    plumeGeo.translate(0, 0, -PLUME_BASE_LEN / 2);
    const plume = new THREE.Mesh(
      plumeGeo,
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(TEAL_HEX).lerp(new THREE.Color(0xffffff), 0.15),
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    );
    // Local -Z (the base direction post-translate) → world `normal`, so the
    // apex (local origin) lands exactly at the nozzle and the flame flares
    // outward, away from the hull.
    plume.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), normal);
    plume.position.copy(anchor.position).addScaledVector(normal, 0.05); // clear hull z-fighting
    plume.layers.set(GLOW_LAYER);
    plume.name = `engine-glow-plume-${i}`;
    scene.add(plume);

    const core = new THREE.Mesh(
      new THREE.PlaneGeometry(CORE_HALF_SIZE * 2, CORE_HALF_SIZE * 2),
      new THREE.MeshBasicMaterial({
        map: buildCoreGlowTexture(),
        transparent: true,
        opacity: CORE_MAX_OPACITY,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    );
    core.position.copy(anchor.position).addScaledVector(normal, 0.2);
    core.layers.set(GLOW_LAYER);
    core.name = `engine-glow-core-${i}`;
    scene.add(core);

    return { plume, core, flickerPhase: flickerRng.range(0, Math.PI * 2) };
  });
}

/** Per-ship-frame tick (flight/flightBoot.ts's tickShipFrame). No-op before
 *  initEngineGlow() runs. Zero-alloc: mutates existing scale/opacity only;
 *  the one getFlight() call is the same per-frame cost ui/flightHud.ts
 *  already pays every ship frame for the same throttle/speed fields. */
export function tickEngineGlow(dt: number): void {
  if (units.length === 0) return;
  accumTime += dt;

  const snap = getFlight();
  const boosting = snap.speed > BOOST_SPEED_THRESHOLD;
  const kick = boosting ? BOOST_KICK : 1;

  for (const u of units) {
    const flicker = 1 + FLICKER_AMOUNT * Math.sin(accumTime * FLICKER_SPEED + u.flickerPhase);

    const lenFrac = (PLUME_MIN_LEN + (PLUME_MAX_LEN - PLUME_MIN_LEN) * snap.throttle) * kick * flicker;
    u.plume.scale.set(flicker, flicker, Math.max(0.05, lenFrac));

    const opacity = THREE.MathUtils.clamp(
      (CORE_MIN_OPACITY + (CORE_MAX_OPACITY - CORE_MIN_OPACITY) * snap.throttle) * kick * flicker,
      0,
      1,
    );
    (u.core.material as THREE.MeshBasicMaterial).opacity = opacity;
    u.core.scale.setScalar(0.8 + 0.4 * snap.throttle * kick);
    if (camera) u.core.quaternion.copy(camera.quaternion); // billboard toward the (single, shared) camera
  }
}

/** Defensive teardown — nothing calls this yet (the ship scene, and
 *  therefore this rig, lives for the whole session, same as ExteriorHull /
 *  HullLighting), but "dispose what you replace" applies if that ever
 *  changes. */
export function disposeEngineGlow(scene: THREE.Scene): void {
  for (const u of units) {
    scene.remove(u.plume);
    scene.remove(u.core);
    u.plume.geometry.dispose();
    (u.plume.material as THREE.Material).dispose();
    u.core.geometry.dispose();
    // u.core.material.map is the shared `cached()` texture singleton — NOT
    // disposed here, same rationale as hullMaterial.ts's hullSkinMaterial.
    (u.core.material as THREE.Material).dispose();
  }
  units = [];
  camera = null;
}
