/**
 * src/fx/volumetrics.ts — v0.9 B2 "glow build": volumetric light shafts +
 * dust motes. One additive ShaderMaterial cone per shaft (radial + axial
 * falloff, subtle time-driven noise wobble) plus one THREE.Points dust
 * system scattered inside the same cone volume.
 *
 * Depth-test ON / depth-write OFF: shafts sit correctly behind opaque props
 * (catwalks, crates, walls) instead of visibly bleeding through them, per
 * the mission brief's "must not visibly clip through props/floor" rule.
 *
 * Ticking: each shaft mesh's own onBeforeRender advances its `uTime`
 * uniform and (for the reactor) syncs an external light's intensity — the
 * same self-animating-mesh pattern already used by lightingRig.ts's reactor
 * pulse and doors.ts's tick dummy. No main.ts changes needed. Dust motes
 * animate the same way, directly on the THREE.Points object.
 *
 * Kill switch: ?glow=0 (GLOW_ENABLED, from glow.ts) disables every shaft +
 * mote system — isolation-matrix flag for perf A/B.
 */
import * as THREE from 'three';
import { GLOW_ENABLED } from './glow.js';

// ── Shader ──────────────────────────────────────────────────────────────────

function makeShaftMaterial(
  color: number,
  peakOpacity: number,
  halfHeight: number,
  invert: boolean,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor:  { value: new THREE.Color(color) },
      uPeak:   { value: peakOpacity },
      uTime:   { value: 0 },
      uHalfH:  { value: halfHeight },
      uInvert: { value: invert ? 1.0 : 0.0 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    // FrontSide: reads as "a cone of light" from the typical exterior hallway/
    // room vantage these are viewed from. Trade-off: the shell disappears if
    // the camera walks fully inside its volume — the floor pool light +
    // halation still read there, so that's an acceptable trade for cost
    // (same fragment count as BackSide — half of DoubleSide's overdraw).
    side: THREE.FrontSide,
    toneMapped: false,
    vertexShader: /* glsl */`
      varying vec3 vPos;
      varying vec3 vNormalW;
      varying vec3 vWorldPos;
      void main() {
        vPos = position;
        vNormalW = normalize(normalMatrix * normal);
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    // A CylinderGeometry is a hollow SHELL — every surface vertex sits
    // exactly at the boundary radius, so a "distance from the axis" falloff
    // (meant for a filled volume) reads as ~1.0 everywhere and vanishes. The
    // correct fake-volumetric-shell trick (same one Unity/Unreal light-shaft
    // cone shaders use) is a Fresnel/rim term: faces near-edge-on to the
    // camera (silhouette) read brighter than faces viewed face-on, which is
    // exactly what a hazy volume looks like from outside.
    fragmentShader: /* glsl */`
      uniform vec3 uColor;
      uniform float uPeak;
      uniform float uTime;
      uniform float uHalfH;
      uniform float uInvert;
      varying vec3 vPos;
      varying vec3 vNormalW;
      varying vec3 vWorldPos;

      void main() {
        float axialFrac = clamp((vPos.y + uHalfH) / (2.0 * uHalfH), 0.0, 1.0); // 0 bottom .. 1 top
        float axial = mix(axialFrac, 1.0 - axialFrac, uInvert); // bright end selector
        float axialFall = pow(axial, 1.5);

        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - abs(dot(normalize(vNormalW), viewDir)), 1.4);

        float n = sin(vPos.y * 6.0 + uTime * 0.8) * 0.5 + 0.5;
        float wobble = mix(0.88, 1.0, n);

        float alpha = uPeak * axialFall * fresnel * wobble;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });
}

// ── Dust motes ──────────────────────────────────────────────────────────────

function seededRng(seed: number): () => number {
  let s = seed;
  return (): number => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function buildDustMotes(
  halfHeight: number,
  radiusTop: number,
  radiusBottom: number,
  count: number,
  color: number,
  seed: number,
): THREE.Points {
  const rand = seededRng(seed);
  const positions = new Float32Array(count * 3);
  const base = new Float32Array(count * 3);
  const phase = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const t = rand(); // 0 = local bottom, 1 = local top
    const y = -halfHeight + t * (2 * halfHeight);
    const radiusAtT = radiusBottom + (radiusTop - radiusBottom) * t;
    const r = Math.sqrt(rand()) * radiusAtT * 0.85;
    const theta = rand() * Math.PI * 2;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    base[i * 3 + 0] = x;
    base[i * 3 + 1] = y;
    base[i * 3 + 2] = z;
    phase[i] = rand() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color,
    size: 0.018,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.30,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });

  const points = new THREE.Points(geo, mat);
  const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;

  points.onBeforeRender = (): void => {
    const t = performance.now() / 1000;
    for (let i = 0; i < count; i++) {
      const ph = phase[i];
      const bob    = Math.sin(t * 0.6 + ph) * 0.03;
      const driftX = Math.sin(t * 0.15 + ph * 1.3) * 0.02;
      const driftZ = Math.cos(t * 0.12 + ph * 0.7) * 0.02;
      posAttr.setXYZ(
        i,
        base[i * 3 + 0] + driftX,
        base[i * 3 + 1] + bob,
        base[i * 3 + 2] + driftZ,
      );
    }
    posAttr.needsUpdate = true;
  };

  return points;
}

// ── Public API ──────────────────────────────────────────────────────────────

export interface ShaftSpec {
  x: number;
  z: number;
  /** Higher Y (room-local or world, matches whatever space `group` uses). */
  topY: number;
  /** Lower Y — tune so the cone stops ~0.4m above the floor. */
  bottomY: number;
  /** true: bright/source end is topY (typical ceiling pool light). false: bright end is bottomY (reactor). */
  sourceAtTop: boolean;
  /** Radius at the bright/source end. */
  radiusSource: number;
  /** Radius at the far/dim end. */
  radiusFar: number;
  color: number;
  /** Peak opacity 0..1 — mission spec: 0.02-0.04 for pool shafts, 0.03-0.05 for the reactor. */
  peakOpacity: number;
  moteCount?: number;
  seed?: number;
  /** Extra per-frame callback (t seconds) — used by the reactor to sync its PointLight. */
  onTick?: (t: number) => void;
}

/** Add one volumetric light shaft + matching dust-mote system to `group`. No-op when ?glow=0. */
export function buildLightShaft(group: THREE.Group, spec: ShaftSpec): void {
  if (!GLOW_ENABLED) return;
  const height = spec.topY - spec.bottomY;
  if (height <= 0.05) return;
  const halfH = height / 2;
  const centerY = (spec.topY + spec.bottomY) / 2;

  const radiusTop    = spec.sourceAtTop ? spec.radiusSource : spec.radiusFar;
  const radiusBottom = spec.sourceAtTop ? spec.radiusFar : spec.radiusSource;

  const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 16, 1, true);
  const mat = makeShaftMaterial(spec.color, spec.peakOpacity, halfH, !spec.sourceAtTop);

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'light-shaft';
  mesh.position.set(spec.x, centerY, spec.z);
  mesh.renderOrder = 5;
  mesh.onBeforeRender = (): void => {
    const t = performance.now() / 1000;
    mat.uniforms.uTime.value = t;
    spec.onTick?.(t);
  };
  group.add(mesh);

  const motes = buildDustMotes(
    halfH, radiusTop, radiusBottom,
    spec.moteCount ?? 65, spec.color, spec.seed ?? 1,
  );
  motes.name = 'light-shaft-motes';
  motes.position.set(spec.x, centerY, spec.z);
  group.add(motes);
}
