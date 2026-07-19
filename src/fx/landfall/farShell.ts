/**
 * src/fx/landfall/farShell.ts — one static plane covering the whole roamable
 * region, sampled from the SAME height field the live chunks use. It exists
 * so streaming lag (or the deliberately-async far edge of the chunk grid) is
 * never visible as a hole: whatever isn't a built chunk yet still shows this
 * shell underneath, same shape/color, just coarser and 0.6m lower so a
 * resident chunk always wins the depth test in the near field.
 *
 * Built ONCE at world-build time (matrixAutoUpdate false — it never moves),
 * not re-sampled per frame — 4225 height/normal/color evals is cheap as a
 * one-time cost and would be wasteful every frame for geometry that never
 * changes.
 */
import * as THREE from 'three';
import type { HeightField } from './heightField.js';
import type { ColorRamp } from './chunkMesh.js';
import { hexToRgb, lerpRgb } from '../space/noise.js';

const SHELL_SIZE = 4096;
const SHELL_SEGS = 64;
// −3.0 (was −0.6): the shell linearly interpolates the height field across
// 64m cells — over concave terrain that chord bridges ABOVE the true surface
// by well more than 0.6m, poking dark shell triangles through the live chunks
// (orchestrator round-3 fix: the "black blob" behind the pad in the hero
// shot). 3m clears the worst chord error at 60m relief; the step at the
// chunk-grid edge (~±416m out) hides inside the 6m chunk skirts + fog band.
const SHELL_Y = -3.0;

export interface FarShellHandle {
  mesh: THREE.Mesh;
  dispose(): void;
}

export function buildFarShell(field: HeightField, ramp: ColorRamp): FarShellHandle {
  const geo = new THREE.PlaneGeometry(SHELL_SIZE, SHELL_SIZE, SHELL_SEGS, SHELL_SEGS);
  geo.rotateX(-Math.PI / 2); // lie flat in XZ, +Y up

  const pos = geo.attributes.position as THREE.BufferAttribute;
  const normals = new Float32Array(pos.count * 3);
  const colors = new Float32Array(pos.count * 3);
  const low = hexToRgb(ramp.low);
  const mid = hexToRgb(ramp.mid);
  const high = hexToRgb(ramp.high);
  const nOut = new THREE.Vector3();

  // Conservative under-sampling (orchestrator round-4 fix): a vertex that
  // takes its own exact height still lets the CHORD between two high vertices
  // bridge ABOVE a valley notch between them — with terraced relief those
  // bridges exceeded even a 3m global drop and poked through the live chunks
  // as dark cell-sized polygons (the hero shot's "pentagon"). Taking the MIN
  // of a 3x3 neighborhood (half-cell spacing) pulls every vertex toward its
  // cell's valley floor, so chords sit at-or-below the true surface
  // everywhere; the global SHELL_Y drop then guarantees clearance.
  const SUB = SHELL_SIZE / SHELL_SEGS / 2; // half-cell sampling radius
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    let h = Infinity;
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        const s = field.height(x + dx * SUB, z + dz * SUB);
        if (s < h) h = s;
      }
    }
    pos.setY(i, h);
    field.normal(x, z, nOut);
    normals[i * 3] = nOut.x;
    normals[i * 3 + 1] = nOut.y;
    normals[i * 3 + 2] = nOut.z;
    const t = field.colorT(x, z, h);
    const c = t < 0.5 ? lerpRgb(low, mid, t * 2) : lerpRgb(mid, high, (t - 0.5) * 2);
    colors[i * 3] = c.r / 255;
    colors[i * 3 + 1] = c.g / 255;
    colors[i * 3 + 2] = c.b / 255;
  }
  pos.needsUpdate = true;
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0.0 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'landfall-far-shell';
  mesh.receiveShadow = false;
  mesh.position.y = SHELL_Y;
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();

  return {
    mesh,
    dispose(): void {
      geo.dispose();
      mat.dispose();
    },
  };
}
