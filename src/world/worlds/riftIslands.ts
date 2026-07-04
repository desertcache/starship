/**
 * src/world/worlds/riftIslands.ts — RIFT terrain: main island + reachable
 * side island + crystal bridge + drifting satellite islands + rocky
 * undersides + analytic groundHeight covering all three walkable footprints.
 *
 * buildTerrain() gives an ANALYTIC groundHeight + a SQUARE displaced plane —
 * fine for an open world, wrong for a floating island (visible square
 * corners past the rock underside). We reuse buildTerrain() for its analytic
 * fbm groundHeight() + its boundary AABB ring (both used as-is), but build a
 * custom circular polar-grid mesh from that SAME groundHeight() for the top
 * surface, so islands read as true floating discs.
 *
 * Falling is prevented by: (a) buildTerrain's own ring colliders around the
 * main + side islands (angularly notched where the bridge passes through),
 * (b) hand-built AABB rails flanking the bridge deck. All tall enough to
 * span the player's fixed 0.1-1.9 body-Y range with margin.
 */

import * as THREE from 'three';
import { buildTerrain } from '../../fx/terrain.js';
import { hexToRgb, lerpRgb, type RGB } from '../../fx/space/noise.js';
import { makeRng } from '../../fx/space/rng.js';
import type { AABB } from '../types.js';
import { riftRockVeinTexture } from './riftTextures.js';

// F7 (Stage E): dedicated seed for the bridge deck's facet texture — distinct
// cached() key from the island underside seeds (0x7111/0x7112/etc.), so
// tweaking its .repeat below never mutates a texture instance shared with
// other meshes.
const BRIDGE_TEX_SEED = 0x7bb1;

export const MAIN_RADIUS = 22.5;
export const MAIN_MAX_HEIGHT = 2.4;
export const SIDE_RADIUS = 6;
export const SIDE_CENTER = { x: 37.5, z: 0 };
export const SIDE_MAX_HEIGHT = 1.1;
export const BRIDGE_START_X = MAIN_RADIUS;
export const BRIDGE_END_X = SIDE_CENTER.x - SIDE_RADIUS;
export const BRIDGE_HALF_W = 1.2;

const ROCK_RAMP = {
  low: hexToRgb('#2a1a42'), mid: hexToRgb('#553875'), high: hexToRgb('#bda6e6'),
};
const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

function rampColor(ramp: { low: RGB; mid: RGB; high: RGB }, t: number): [number, number, number] {
  const c = t < 0.5 ? lerpRgb(ramp.low, ramp.mid, t * 2) : lerpRgb(ramp.mid, ramp.high, (t - 0.5) * 2);
  return [c.r / 255, c.g / 255, c.b / 255];
}

/** Circular polar-grid disc, vertex-colored by height ramp, displaced by the
 *  SAME analytic groundHeight fn a terrain's boundary/collider math uses. */
function buildPolarDisc(
  radius: number, rings: number, segs: number,
  groundHeight: (x: number, z: number) => number, maxHeight: number,
): THREE.Mesh {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const h0 = groundHeight(0, 0);
  positions.push(0, h0, 0);
  colors.push(...rampColor(ROCK_RAMP, clamp01(h0 / maxHeight)));
  for (let r = 1; r <= rings; r++) {
    const rad = (r / rings) * radius;
    for (let s = 0; s < segs; s++) {
      const a = (s / segs) * Math.PI * 2;
      const x = Math.cos(a) * rad, z = Math.sin(a) * rad;
      const h = groundHeight(x, z);
      positions.push(x, h, z);
      colors.push(...rampColor(ROCK_RAMP, clamp01(h / maxHeight)));
    }
  }
  for (let s = 0; s < segs; s++) indices.push(0, 1 + s, 1 + ((s + 1) % segs));
  for (let r = 1; r < rings; r++) {
    const a0 = 1 + (r - 1) * segs, b0 = 1 + r * segs;
    for (let s = 0; s < segs; s++) {
      const a = a0 + s, b = a0 + (s + 1) % segs, c = b0 + s, d = b0 + (s + 1) % segs;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  // Faint self-glow floor: headless renders point-lit terrain near-black; a
  // whisper of violet emissive keeps the walkable surface legible everywhere.
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.88, metalness: 0.04,
    emissive: new THREE.Color('#1c1030'), emissiveIntensity: 1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  return mesh;
}

/** Jagged inverted-cone rock underside (apex down) so the island reads as a
 *  floating chunk, not a pancake. More jitter toward the apex than the base. */
function buildUnderside(radius: number, height: number, seed: number, baseY: number): THREE.Mesh {
  const geo = new THREE.ConeGeometry(radius, height, 9, 3, false);
  geo.rotateX(Math.PI); // apex -> -Y (down), base -> +Y (up, flush under the island)
  const rng = makeRng(seed);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const depthT = clamp01((height / 2 - y) / height);
    const f = 1 + rng.signed(0.2 + depthT * 0.3);
    pos.setX(i, pos.getX(i) * f);
    pos.setZ(i, pos.getZ(i) * f);
  }
  geo.computeVertexNormals();
  const tex = riftRockVeinTexture(seed);
  // emissiveMap carries the glowing veins AND a dim violet base level so the
  // rock silhouette reads against the abyss (not disembodied glowing streaks).
  const mat = new THREE.MeshStandardMaterial({
    map: tex, emissiveMap: tex, emissive: new THREE.Color('#a06ad4'), emissiveIntensity: 0.68,
    color: new THREE.Color('#6a5584'), roughness: 0.92, metalness: 0.05,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = baseY - height / 2;
  return mesh;
}

function translateAABB(a: AABB, dx: number, dz: number): AABB {
  return { minX: a.minX + dx, maxX: a.maxX + dx, minY: a.minY, maxY: a.maxY, minZ: a.minZ + dz, maxZ: a.maxZ + dz };
}

/** Drop ring colliders whose center falls within `halfWindow` radians of
 *  `excludeAngle` (relative to `centerX,centerZ`) — opens a gap for the bridge. */
function notchRing(colliders: AABB[], centerX: number, centerZ: number, excludeAngle: number, halfWindow: number): AABB[] {
  return colliders.filter((c) => {
    const cx = (c.minX + c.maxX) / 2 - centerX;
    const cz = (c.minZ + c.maxZ) / 2 - centerZ;
    const diff = Math.atan2(Math.sin(Math.atan2(cz, cx) - excludeAngle), Math.cos(Math.atan2(cz, cx) - excludeAngle));
    return Math.abs(diff) > halfWindow;
  });
}

function buildBridgeRailColliders(): AABB[] {
  const segs = 6;
  const len = BRIDGE_END_X - BRIDGE_START_X;
  const segLen = len / segs;
  const out: AABB[] = [];
  for (const side of [-1, 1]) {
    const zc = side * (BRIDGE_HALF_W + 0.15);
    for (let i = 0; i < segs; i++) {
      const x0 = BRIDGE_START_X + i * segLen;
      out.push({ minX: x0 - 0.1, maxX: x0 + segLen * 1.15, minY: -2, maxY: 6, minZ: zc - 0.35, maxZ: zc + 0.35 });
    }
  }
  return out;
}

export interface RiftIslands {
  group: THREE.Group;
  groundHeight(x: number, z: number): number;
  boundaryColliders: AABB[];
  mainCenterTop: number; // groundHeight(0,0) — for spawn/camera framing
  sideCenterTop: number;
  update(dt: number): void;
  dispose(): void;
}

export function buildRiftIslands(): RiftIslands {
  const group = new THREE.Group();
  group.name = 'rift-islands';
  const disposers: (() => void)[] = [];

  // buildTerrain is used for its ANALYTIC groundHeight + collider ring; its
  // square mesh is never added to the scene — free it immediately.
  const discardTerrainMesh = (t: { mesh: THREE.Mesh }): void => {
    t.mesh.geometry.dispose();
    (t.mesh.material as THREE.Material).dispose();
  };
  const RAMP = { low: '#2a1a42', mid: '#553875', high: '#bda6e6' };
  const mainT = buildTerrain({
    seed: 0x7101, radius: MAIN_RADIUS, maxHeight: MAIN_MAX_HEIGHT, segments: 48, colorRamp: RAMP,
  });
  const sideT = buildTerrain({
    seed: 0x7102, radius: SIDE_RADIUS, maxHeight: SIDE_MAX_HEIGHT, segments: 32, colorRamp: RAMP,
  });
  discardTerrainMesh(mainT);
  discardTerrainMesh(sideT);

  const mainTop = buildPolarDisc(MAIN_RADIUS, 16, 48, mainT.groundHeight, MAIN_MAX_HEIGHT);
  mainTop.name = 'rift-main-island';
  group.add(mainTop);
  const mainUnder = buildUnderside(MAIN_RADIUS * 0.94, 15, 0x7111, 0.5);
  group.add(mainUnder);
  disposers.push(() => { mainTop.geometry.dispose(); (mainTop.material as THREE.Material).dispose(); mainUnder.geometry.dispose(); (mainUnder.material as THREE.Material).dispose(); });

  const sideTop = buildPolarDisc(SIDE_RADIUS, 10, 32, sideT.groundHeight, SIDE_MAX_HEIGHT);
  sideTop.name = 'rift-side-island';
  sideTop.position.set(SIDE_CENTER.x, 0, SIDE_CENTER.z);
  group.add(sideTop);
  const sideUnder = buildUnderside(SIDE_RADIUS * 0.9, 7, 0x7112, 0.4);
  sideUnder.position.set(SIDE_CENTER.x, 0, SIDE_CENTER.z);
  group.add(sideUnder);
  disposers.push(() => { sideTop.geometry.dispose(); (sideTop.material as THREE.Material).dispose(); sideUnder.geometry.dispose(); (sideUnder.material as THREE.Material).dispose(); });

  // ── Crystal bridge deck ──────────────────────────────────────────────────
  const edgeMainH = mainT.groundHeight(MAIN_RADIUS, 0);
  const edgeSideH = sideT.groundHeight(-SIDE_RADIUS, 0);
  const bridgeSegs = 10;
  const bp: number[] = [];
  const bUv: number[] = [];
  const bi: number[] = [];
  for (let i = 0; i <= bridgeSegs; i++) {
    const t = i / bridgeSegs;
    const x = THREE.MathUtils.lerp(BRIDGE_START_X, BRIDGE_END_X, t);
    const y = THREE.MathUtils.lerp(edgeMainH, edgeSideH, t) + Math.sin(Math.PI * t) * 0.35;
    bp.push(x, y, -BRIDGE_HALF_W, x, y, BRIDGE_HALF_W);
    bUv.push(t, 0, t, 1);
  }
  for (let i = 0; i < bridgeSegs; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    bi.push(a, c, b, b, c, d);
  }
  const bridgeGeo = new THREE.BufferGeometry();
  bridgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(bp, 3));
  bridgeGeo.setAttribute('uv', new THREE.Float32BufferAttribute(bUv, 2));
  bridgeGeo.setIndex(bi);
  bridgeGeo.computeVertexNormals();
  // F7 (Stage E): facet-patterned map + emissiveMap (was a flat unmapped
  // emissive slab) — same map+emissiveMap treatment as the island undersides,
  // so the deck's GLOW carries the vein/facet pattern (a map alone couldn't
  // help: the visible teal was all unmapped emissive). Intensity 0.3→0.55
  // compensates the dark texture average; net glow is dimmer than before.
  const bridgeTex = riftRockVeinTexture(BRIDGE_TEX_SEED);
  bridgeTex.repeat.set(4, 1);
  const bridgeMat = new THREE.MeshStandardMaterial({
    map: bridgeTex, emissiveMap: bridgeTex, color: '#4a3468',
    emissive: '#57e6ff', emissiveIntensity: 0.55, roughness: 0.32, metalness: 0.18,
    transparent: true, opacity: 0.95, side: THREE.DoubleSide,
  });
  const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
  bridge.name = 'rift-bridge';
  group.add(bridge);
  disposers.push(() => { bridgeGeo.dispose(); bridgeMat.dispose(); });

  // ── Colliders: notched rings + bridge rails ─────────────────────────────
  const mainRing = notchRing(mainT.boundaryColliders, 0, 0, 0, THREE.MathUtils.degToRad(14));
  const sideRingWorld = sideT.boundaryColliders.map((c) => translateAABB(c, SIDE_CENTER.x, SIDE_CENTER.z));
  const sideRing = notchRing(sideRingWorld, SIDE_CENTER.x, SIDE_CENTER.z, Math.PI, THREE.MathUtils.degToRad(16));
  const boundaryColliders = [...mainRing, ...sideRing, ...buildBridgeRailColliders()];

  // ── Satellite islands: small, decorative, unreachable, slowly drifting ──
  interface Sat { grp: THREE.Group; base: THREE.Vector3; amp: THREE.Vector3; speed: number; phase: number }
  const sats: Sat[] = [];
  // Bases sit in the hero cam's ENE sightline (from (-19.5,-9.5) looking at
  // (6,2)) so the drifting rocks hang in the signature shot's sky.
  const satDefs = [
    { seed: 0x7121, radius: 4.2, base: new THREE.Vector3(12, 11, 22), amp: new THREE.Vector3(1.4, 0.6, 1.1), speed: 0.09, phase: 0 },
    { seed: 0x7122, radius: 3.1, base: new THREE.Vector3(32, 13, -16), amp: new THREE.Vector3(1.0, 0.8, 1.3), speed: 0.07, phase: 2.1 },
    { seed: 0x7123, radius: 3.6, base: new THREE.Vector3(-24, 5, 12), amp: new THREE.Vector3(1.2, 0.5, 0.9), speed: 0.11, phase: 4.3 },
  ];
  for (const d of satDefs) {
    const t = buildTerrain({ seed: d.seed, radius: d.radius, maxHeight: 0.6, segments: 20, colorRamp: RAMP });
    discardTerrainMesh(t);
    const top = buildPolarDisc(d.radius, 6, 18, t.groundHeight, 0.6);
    const under = buildUnderside(d.radius * 0.85, d.radius * 1.3, d.seed + 1, 0.25);
    const grp = new THREE.Group();
    grp.add(top, under);
    grp.position.copy(d.base);
    group.add(grp);
    disposers.push(() => { top.geometry.dispose(); (top.material as THREE.Material).dispose(); under.geometry.dispose(); (under.material as THREE.Material).dispose(); });
    sats.push({ grp, base: d.base.clone(), amp: d.amp, speed: d.speed, phase: d.phase });
  }

  let satT = 0;
  const mainCenterTop = mainT.groundHeight(0, 0);
  const sideCenterTop = sideT.groundHeight(0, 0);

  function groundHeight(x: number, z: number): number {
    const dMain = Math.hypot(x, z);
    if (dMain <= MAIN_RADIUS + 0.5) return mainT.groundHeight(x, z);
    if (x >= BRIDGE_START_X - 0.5 && x <= BRIDGE_END_X + 0.5 && Math.abs(z) <= BRIDGE_HALF_W + 0.6) {
      const t = clamp01((x - BRIDGE_START_X) / (BRIDGE_END_X - BRIDGE_START_X));
      return THREE.MathUtils.lerp(edgeMainH, edgeSideH, t) + Math.sin(Math.PI * t) * 0.35;
    }
    const dSide = Math.hypot(x - SIDE_CENTER.x, z - SIDE_CENTER.z);
    if (dSide <= SIDE_RADIUS + 0.5) return sideT.groundHeight(x - SIDE_CENTER.x, z - SIDE_CENTER.z);
    return mainT.groundHeight(x, z); // continuous analytic fallback (stray creatures over the abyss)
  }

  return {
    group, groundHeight, boundaryColliders, mainCenterTop, sideCenterTop,
    update(dt: number): void {
      satT += dt;
      for (const s of sats) {
        s.grp.position.set(
          s.base.x + Math.sin(satT * s.speed + s.phase) * s.amp.x,
          s.base.y + Math.sin(satT * s.speed * 1.3 + s.phase * 1.7) * s.amp.y,
          s.base.z + Math.cos(satT * s.speed + s.phase) * s.amp.z,
        );
      }
    },
    dispose(): void { for (const d of disposers) d(); },
  };
}
