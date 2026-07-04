/**
 * src/world/worlds/ashfallCracks.ts — the propagating emissive crack-network
 * terrain overlay for the ASHFALL pocket world (Stage C). Split out of
 * ashfallVolcanics.ts to keep both files under the 300-line cap.
 *
 * Livingness (T1): brightness = f(t - dist(x,z)*k) summed over the pulse
 * origins (the fumarole vents) — brightness visibly TRAVELS outward from the
 * vents along the crack mask, never a uniform glow. Driven via onBeforeRender
 * + performance.now() (not world.update) so it keeps animating correctly when
 * rendered through the shared live portal-preview RT, per the design doc's
 * "keep such work cheap and time-based" note.
 */
import * as THREE from 'three';
import type { TerrainResult } from '../../fx/terrain.js';
import { ashfallCrackTexture } from './ashfallTextures.js';

export interface CrackOverlay {
  mesh: THREE.Mesh;
  dispose(): void;
}

/** Second mesh, +3cm above terrain, following the same analytic groundHeight. */
export function buildCrackOverlay(
  terrain: TerrainResult,
  radius: number,
  maxHeight: number,
  pulseOrigins: ReadonlyArray<{ x: number; z: number }>,
): CrackOverlay {
  const period = radius * 2;
  const segments = 96;
  const geo = new THREE.PlaneGeometry(period, period, segments, segments);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, terrain.groundHeight(x, z) + 0.03);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  const origins = new Array<THREE.Vector2>(3);
  for (let i = 0; i < 3; i++) {
    const o = pulseOrigins[i] ?? pulseOrigins[0];
    origins[i] = new THREE.Vector2(o.x, o.z);
  }

  const uniforms = {
    uTex: { value: ashfallCrackTexture() },
    uTime: { value: 0 },
    uRepeat: { value: 6.0 },
    uMaxHeight: { value: Math.max(0.01, maxHeight) },
    uOrigins: { value: origins },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    vertexShader: /* glsl */ `
      uniform float uMaxHeight;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying float vHeight;
      void main() {
        vUv = uv;
        vHeight = clamp(position.y / uMaxHeight, 0.0, 1.0);
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform sampler2D uTex;
      uniform float uTime;
      uniform float uRepeat;
      uniform vec2 uOrigins[3];
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying float vHeight;
      void main() {
        vec4 crack = texture2D(uTex, vUv * uRepeat);
        float wave = 0.0;
        for (int i = 0; i < 3; i++) {
          float d = length(vWorldPos.xz - uOrigins[i]);
          wave += 0.5 + 0.5 * sin(uTime * 1.6 - d * 0.34);
        }
        wave /= 3.0;
        float pulse = mix(0.30, 1.0, clamp(wave, 0.0, 1.0));
        // Cracks read strongest in low terrain (crevices), fade on ridge tops.
        float lowMask = mix(0.35, 1.0, 1.0 - smoothstep(0.4, 0.9, vHeight));
        vec3 col = crack.rgb * (0.7 + 0.9 * pulse);
        gl_FragColor = vec4(col, crack.a * pulse * lowMask);
      }
    `,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'ashfall-crack-overlay';
  mesh.onBeforeRender = (): void => {
    uniforms.uTime.value = performance.now() / 1000;
  };

  return {
    mesh,
    dispose(): void { geo.dispose(); mat.dispose(); },
  };
}
