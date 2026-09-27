/**
 * Asteroid field — ONE InstancedMesh, one draw call.
 *
 * A single low-poly rock geometry (icosahedron, base verts jittered once) is
 * instanced N times across a slab that crosses the cruise lane at distance.
 * The whole field streams by (flowW + driftW)·dt each tick — same
 * frame-correct pattern cast.ts uses for bodies/events (v1.1 SOVEREIGN fix:
 * was a raw `basePos.z += driftSpeed*dt`, a world-fixed +Z translation that
 * ignored attitude) — while each instance also tumbles about its own seeded
 * local axis. Despawn is owned by cast.ts's tickEntry (bounding-box center
 * projected onto the flow axis).
 */

import * as THREE from 'three';
import type { Rng } from './rng.js';
import { getFlowWRef as getFlowW } from '../../flight/flightState.js';
import { CRUISE_SPEED_NEAR } from '../starfield.js';

export interface AsteroidField {
  mesh: THREE.InstancedMesh;
  tick(dt: number): void;
  /** Live ref to the field's current center (cast.ts's despawn projection) —
   *  do not mutate. See tick()'s comment for why this is safe to track
   *  incrementally instead of recomputing a full bounding box every frame. */
  getCenter(): THREE.Vector3;
  dispose(): void;
}

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scl = new THREE.Vector3();
const _axis = new THREE.Vector3();
const _spin = new THREE.Quaternion();
const _flowDelta = new THREE.Vector3();

/** Jitter the base icosahedron vertices once for a chunky rock silhouette. */
function makeRockGeo(rng: Rng): THREE.IcosahedronGeometry {
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const f = 1 + rng.signed(0.28);
    pos.setXYZ(i, pos.getX(i) * f, pos.getY(i) * f, pos.getZ(i) * f);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Create one instanced asteroid field. Caller (director) drives tick + despawn. */
export function createAsteroidField(rng: Rng): AsteroidField {
  const count = rng.int(60, 140);
  const geo = makeRockGeo(rng);
  // Bodies are now self-lit (MeshBasic), and there is no directional sun out at
  // z<-600, so a MeshLambert rock reads as a flat near-black blob. Use
  // MeshBasicMaterial with a baked mid-tone tint + per-instance brightness
  // variation so the field still reads as a cloud of distinct chunky rocks.
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.name = 'asteroid-field';

  // Per-instance baked shading tint (warm rock greys, varied brightness).
  const _col = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const shade = rng.range(0.45, 0.95);
    _col.setRGB(shade * 0.62, shade * 0.55, shade * 0.48);
    mesh.setColorAt(i, _col);
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

  const driftSpeed = rng.range(11, 18);
  // Own Z rate stored RELATIVE to the boot cruise flow (same pattern as
  // cast.ts's BodyEntry/EventEntry driftW) so apparent boot motion =
  // flowW + driftW = the v1.0-tuned raw driftSpeed exactly.
  const driftW = driftSpeed - CRUISE_SPEED_NEAR;

  // Per-instance transform + tumble state.
  const basePos = new Float32Array(count * 3);
  const baseScale = new Float32Array(count);
  const rotAxis = new Float32Array(count * 3);
  const rotRate = new Float32Array(count);
  const rotAngle = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const x = rng.signed(400);
    const y = rng.signed(200);
    const z = -700 + rng.signed(300);
    basePos[i * 3] = x;
    basePos[i * 3 + 1] = y;
    basePos[i * 3 + 2] = z;
    baseScale[i] = rng.range(1.5, 6.0);

    _axis.set(rng.signed(1), rng.signed(1), rng.signed(1));
    if (_axis.lengthSq() < 1e-4) _axis.set(0, 1, 0);
    _axis.normalize();
    rotAxis[i * 3] = _axis.x;
    rotAxis[i * 3 + 1] = _axis.y;
    rotAxis[i * 3 + 2] = _axis.z;
    rotRate[i] = rng.range(0.2, 1.2);
    rotAngle[i] = rng.range(0, Math.PI * 2);
  }

  function writeMatrices(): void {
    for (let i = 0; i < count; i++) {
      _pos.set(basePos[i * 3], basePos[i * 3 + 1], basePos[i * 3 + 2]);
      _axis.set(rotAxis[i * 3], rotAxis[i * 3 + 1], rotAxis[i * 3 + 2]);
      _spin.setFromAxisAngle(_axis, rotAngle[i]);
      _q.copy(_spin);
      const s = baseScale[i];
      _scl.set(s, s, s);
      _m.compose(_pos, _q, _scl);
      mesh.setMatrixAt(i, _m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  writeMatrices();

  // v1.2.1 (ultrareview r2 nit — cast.ts:260 computeBoundingBox() every
  // frame): every instance below gets the IDENTICAL _flowDelta each tick (the
  // whole field translates rigidly; only each rock's own in-place spin
  // differs, which doesn't move its center of mass) — so the bounding box's
  // CENTER can be tracked by translating a cached start value by that same
  // delta instead of recomputing a full box over all `count` instances every
  // frame. Built once from basePos (ignores each rock's own geometry radius —
  // a fixed, bounded approximation vs. the true geometry-inclusive box,
  // unlike a per-frame recompute which would be exact) and translated exactly
  // thereafter, since translating every point in a set by the same vector
  // translates its bounding box's center by that same vector, with no
  // accumulating error.
  const _fieldCenter = new THREE.Vector3();
  {
    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    for (let i = 0; i < count; i++) {
      const x = basePos[i * 3], y = basePos[i * 3 + 1], z = basePos[i * 3 + 2];
      min.set(Math.min(min.x, x), Math.min(min.y, y), Math.min(min.z, z));
      max.set(Math.max(max.x, x), Math.max(max.y, y), Math.max(max.z, z));
    }
    _fieldCenter.addVectors(min, max).multiplyScalar(0.5);
  }

  function tick(dt: number): void {
    // (flowW + driftW) * dt — identical to bodies/events; at boot flowW is
    // (0,0,14) so this reduces exactly to the old raw (0,0,driftSpeed*dt).
    _flowDelta.copy(getFlowW());
    _flowDelta.z += driftW;
    _flowDelta.multiplyScalar(dt);
    for (let i = 0; i < count; i++) {
      basePos[i * 3] += _flowDelta.x;
      basePos[i * 3 + 1] += _flowDelta.y;
      basePos[i * 3 + 2] += _flowDelta.z;
      rotAngle[i] += rotRate[i] * dt;
    }
    _fieldCenter.add(_flowDelta);
    writeMatrices();
  }

  function getCenter(): THREE.Vector3 {
    return _fieldCenter;
  }

  function dispose(): void {
    geo.dispose();
    mat.dispose();
    mesh.dispose();
  }

  return { mesh, tick, getCenter, dispose };
}
