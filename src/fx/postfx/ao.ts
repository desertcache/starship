/**
 * src/fx/postfx/ao.ts — GTAO ambient-occlusion pass factory (v0.9 B1 RADIANCE).
 *
 * Replaces SSAOPass (v0.5–v0.8 default) with three's horizon-based GTAOPass.
 * Two concrete wins over SSAOPass in this codebase:
 *
 *   1. Built-in Poisson denoise. SSAOPass's raw hemisphere-kernel noise had
 *      no denoise pass and shimmered on camera movement (the v0.7 qa-jitter
 *      regression). GTAOPass always renders a denoised buffer and blends
 *      that (GTAOPass.OUTPUT.Default) — see node_modules/three/examples/jsm/
 *      postprocessing/GTAOPass.js render(): raw AO -> pdMaterial (Poisson
 *      denoise) -> blend. Nothing extra to wire up.
 *
 *   2. radius/thickness are LITERAL VIEW-SPACE METRES, not the SSAOPass
 *      near→far FRACTION footgun that produced giant 4–160 m occluder
 *      wedges at every depth discontinuity in v0.7. Verified against
 *      GTAOShader.js's getViewPosition()/getSceneUvAndDepth() — radius and
 *      thickness feed straight into view-space offsets, no near/far
 *      division anywhere in the kernel.
 *
 * Tuning (room scale ≈3 m, camera.far=2000):
 *   radius            0.30  — ~0.3 m occluder search: seams/corners/under-
 *                              furniture contact shadow only, not room-scale
 *                              wedges.
 *   distanceExponent   1.5  — biases the step distribution toward the
 *                              surface (pow(t, exp) in the horizon walk) —
 *                              tighter contact darkening, less midfield wash.
 *   thickness          0.8  — occluder-ACCEPTANCE depth window, in metres
 *                              (shader test: abs(viewDelta.z) < thickness).
 *                              This is what kills the v0.7 doorway-wedge bug:
 *                              a far wall glimpsed through an open doorway
 *                              sits metres behind the door frame in
 *                              view-space Z, so it falls outside this window
 *                              and can never contribute false occlusion to
 *                              the frame edge.
 *   distanceFallOff    1.0  — shader default; horizon-extension smoothing.
 *   scale              1.0  — pow(ao, scale) response curve, left neutral —
 *                              overall strength is tuned via blendIntensity
 *                              instead (a single, more legible knob).
 *   samples             16  — GTAOShader default; comparable cost to the
 *                              prior SSAOPass kernel.
 *   blendIntensity     0.75 — how strongly the denoised AO multiplies the
 *                              scene colour (0 = off, 1 = full raw AO).
 *                              Kept below 1 so contact shadows read soft —
 *                              never crush corners to black.
 *
 * TypeScript note: @types/three's GTAOPass constructor signature only
 * declares (scene, camera, width?, height?, parameters?) — no aoParameters/
 * pdParameters overload, even though the runtime JS accepts them. Tuning is
 * therefore applied via the fully-typed updateGtaoMaterial()/blendIntensity
 * setters after construction instead of constructor args.
 */
import * as THREE from 'three';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';

const AO_RADIUS             = 0.30;
const AO_DISTANCE_EXPONENT  = 1.5;
const AO_THICKNESS          = 0.8;
const AO_DISTANCE_FALLOFF   = 1.0;
const AO_SCALE               = 1.0;
const AO_SAMPLES             = 16;
const AO_BLEND_INTENSITY    = 0.75;

export interface AOHandle {
  readonly pass: GTAOPass;
  /** Switch between the normal blended view and the raw denoised AO term
   *  (tuning aid — mirrors the old `?ssao=only` isolation view). */
  setOnlyView(only: boolean): void;
}

/** Build a GTAOPass tuned for the ship's interior scale. */
export function createAOPass(
  scene: THREE.Scene,
  camera: THREE.Camera,
  width: number,
  height: number,
  onlyView: boolean,
): AOHandle {
  const pass = new GTAOPass(scene, camera, width, height);
  pass.updateGtaoMaterial({
    radius: AO_RADIUS,
    distanceExponent: AO_DISTANCE_EXPONENT,
    thickness: AO_THICKNESS,
    distanceFallOff: AO_DISTANCE_FALLOFF,
    scale: AO_SCALE,
    samples: AO_SAMPLES,
  });
  pass.blendIntensity = AO_BLEND_INTENSITY;
  pass.output = onlyView ? GTAOPass.OUTPUT.Denoise : GTAOPass.OUTPUT.Default;

  return {
    pass,
    setOnlyView(only: boolean): void {
      pass.output = only ? GTAOPass.OUTPUT.Denoise : GTAOPass.OUTPUT.Default;
    },
  };
}
