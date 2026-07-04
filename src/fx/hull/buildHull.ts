import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { InteriorAnchors, AnchorFrame } from './anchors.js';

export interface HullBuild {
  geometry: THREE.BufferGeometry;
  tris: number;
}

const MARGIN = 0.6;
const CHAMFER_RATIO = 0.35;
const NOSE_TAPER = 0.25; // nose cone extends this far fwd of the frontmost interior slice

/** Greeble instances placed by the most recent buildHullGeometry() call — HUD/report only. */
export let lastGreebleCount = 0;

// ── Seeded PRNG (mulberry32) ────────────────────────────────────────────────
function makeRng(seed: number): () => number {
  return function (): number {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pushTri(
  pos: number[], nrm: number[], uv: number[],
  p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3,
  uv0: [number, number], uv1: [number, number], uv2: [number, number],
): void {
  pos.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
  const n = new THREE.Vector3().subVectors(p1, p0).cross(new THREE.Vector3().subVectors(p2, p0)).normalize();
  nrm.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
  uv.push(uv0[0], uv0[1], uv1[0], uv1[1], uv2[0], uv2[1]);
}

/** Hull envelope (research §1 `stationAt()`) — SINGLE authority for the loft's half-extents at Z. */
export function hullEnvelopeAt(
  z: number, anchors: InteriorAnchors,
): { halfW: number; halfH: number; yCenter: number; chamfer: number } {
  const slices = anchors.slices;
  let s1 = slices[0], s2 = slices[slices.length - 1];
  if (z <= s1.x) s2 = slices[1] ?? s1;
  else if (z >= s2.x) s1 = slices[slices.length - 2] ?? s2;
  else {
    for (let i = 0; i < slices.length - 1; i++) {
      if (z >= slices[i].x && z <= slices[i + 1].x) { s1 = slices[i]; s2 = slices[i + 1]; break; }
    }
  }
  const t = s2.x !== s1.x ? (z - s1.x) / (s2.x - s1.x) : 0;
  const halfW = THREE.MathUtils.lerp(s1.halfW, s2.halfW, t) + MARGIN;
  const halfH = THREE.MathUtils.lerp(s1.halfH, s2.halfH, t) + MARGIN;
  const yCenter = THREE.MathUtils.lerp(s1.yCenter, s2.yCenter, t);
  return { halfW, halfH, yCenter, chamfer: CHAMFER_RATIO * halfH };
}

function profileAt(z: number, anchors: InteriorAnchors): THREE.Vector3[] {
  const { halfW: w, halfH: h, yCenter: yc, chamfer: c } = hullEnvelopeAt(z, anchors);
  const pts: [number, number][] = [
    [-w, -h + c], [-w + c, -h], [w - c, -h], [w, -h + c],
    [w, h - c], [w - c, h], [-w + c, h], [-w, h - c],
  ];
  return pts.map(([x, y]) => new THREE.Vector3(x, y + yc, z));
}

/**
 * Flush point on the hull's OUTER skin along an anchor's normal — envelope-derived, not the
 * raw interior-wall position. Used both to place window/canopy/engine modules here and (from
 * preview.ts) to numerically verify they land near the skin. Our data only uses X- or
 * Z-dominant normals (no dorsal/ventral anchors yet), so only those two cases are resolved.
 */
export function hullSurfacePoint(a: AnchorFrame, anchors: InteriorAnchors): THREE.Vector3 {
  const [px, py, pz] = a.position;
  const [nx, , nz] = a.normal;
  if (Math.abs(nx) >= Math.abs(nz)) {
    return new THREE.Vector3(Math.sign(nx) * hullEnvelopeAt(pz, anchors).halfW, py, pz);
  }
  const noseZ = anchors.slices[0].x - NOSE_TAPER;
  const sternZ = anchors.slices[anchors.slices.length - 1].x;
  return new THREE.Vector3(px, py, nz < 0 ? noseZ : sternZ);
}

/** engineering/aft dense, spine moderate, cockpit sparse, cargo-door zone kept clear (research §3). */
function zoneWeight(z: number, cargoZ: number): number {
  if (Math.abs(z - cargoZ) < 3.5) return 0.1;
  if (z >= 2) return 1.0;
  if (z <= -18.5) return 0.2;
  return 0.5;
}

function ridge(w: number, h: number, d: number, x: number, y: number, z: number): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
}

/** Kit of 10 distinct pieces, 12-60 tris each (research §3). */
function buildGreebleKit(): THREE.BufferGeometry[] {
  const vent = mergeGeometries([
    new THREE.BoxGeometry(0.35, 0.14, 0.45),
    ridge(0.3, 0.04, 0.05, 0, 0.09, -0.15), ridge(0.3, 0.04, 0.05, 0, 0.09, 0), ridge(0.3, 0.04, 0.05, 0, 0.09, 0.15),
  ]);
  const tank = new THREE.CylinderGeometry(0.16, 0.16, 0.55, 10);
  const antenna = new THREE.CylinderGeometry(0.025, 0.025, 0.8, 6);
  const junction = mergeGeometries([new THREE.BoxGeometry(0.22, 0.22, 0.22), ridge(0.14, 0.06, 0.14, 0, 0.14, 0)]);
  const pipe = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 8);
  const hatch = mergeGeometries([new THREE.BoxGeometry(0.45, 0.06, 0.4), ridge(0.3, 0.03, 0.06, 0, 0.045, 0.15)]);
  const dome = new THREE.SphereGeometry(0.2, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
  const rib = mergeGeometries([new THREE.BoxGeometry(0.09, 0.35, 0.32), ridge(0.24, 0.09, 0.06, 0, 0, 0.13)]);
  const grille = mergeGeometries([
    ridge(0.4, 0.05, 0.06, 0, 0, -0.1), ridge(0.4, 0.05, 0.06, 0, 0, 0), ridge(0.4, 0.05, 0.06, 0, 0, 0.1),
  ]);
  const stub = new THREE.CylinderGeometry(0.05, 0.1, 0.35, 8);
  return [vent, tank, antenna, junction, pipe, hatch, dome, rib, grille, stub];
}

export function buildHullGeometry(seed: number, anchors: InteriorAnchors): HullBuild {
  const rand = makeRng(seed);
  const geometries: THREE.BufferGeometry[] = [];

  // ── 1. Loft ────────────────────────────────────────────────────────────────
  const pos: number[] = [], nrm: number[] = [], uvs: number[] = [];
  const zLo = anchors.slices[0].x, zHi = anchors.slices[anchors.slices.length - 1].x;
  const zSet = new Set<number>(anchors.slices.map((s) => s.x));
  for (let z = zLo; z <= zHi; z += 1.5) zSet.add(z);
  zSet.add(zHi);
  const zStations = Array.from(zSet).sort((a, b) => a - b);
  const profiles = zStations.map((z) => profileAt(z, anchors));
  const totalLen = zHi - zLo;

  for (let i = 0; i < zStations.length - 1; i++) {
    const vA = profiles[i], vB = profiles[i + 1];
    const v0 = (zStations[i] - zLo) / totalLen, v1 = (zStations[i + 1] - zLo) / totalLen;
    for (let j = 0; j < 8; j++) {
      const u0 = j / 8, u1 = (j + 1) / 8;
      pushTri(pos, nrm, uvs, vA[j], vA[(j + 1) % 8], vB[(j + 1) % 8], [u0, v0], [u1, v0], [u1, v1]);
      pushTri(pos, nrm, uvs, vA[j], vB[(j + 1) % 8], vB[j], [u0, v0], [u1, v1], [u0, v1]);
    }
  }
  const noseZ = zLo - NOSE_TAPER;
  const noseTip = new THREE.Vector3(0, anchors.slices[0].yCenter, noseZ);
  for (let j = 0; j < 8; j++) {
    pushTri(pos, nrm, uvs, noseTip, profiles[0][j], profiles[0][(j + 1) % 8], [0.5, 0], [j / 8, 0], [(j + 1) / 8, 0]);
  }
  const sternCenter = new THREE.Vector3(0, anchors.slices[anchors.slices.length - 1].yCenter, zHi);
  const backProfile = profiles[profiles.length - 1];
  for (let j = 0; j < 8; j++) {
    pushTri(pos, nrm, uvs, sternCenter, backProfile[(j + 1) % 8], backProfile[j], [0.5, 1], [(j + 1) / 8, 1], [j / 8, 1]);
  }
  const loftGeo = new THREE.BufferGeometry();
  loftGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  loftGeo.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  loftGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometries.push(loftGeo);

  // ── 2. Parametric modules ────────────────────────────────────────────────────
  const ePos = anchors.engineAxis.position;
  const engineBase = new THREE.BoxGeometry(4.2, 2.8, 2.0);
  engineBase.translate(ePos[0], ePos[1], ePos[2] - 1.0);
  geometries.push(engineBase);
  for (const sx of [-1, 1]) {
    const nozzle = new THREE.CylinderGeometry(0.7, 0.9, 1.2, 12);
    nozzle.rotateX(Math.PI / 2);
    nozzle.translate(ePos[0] + sx * 1.2, ePos[1], ePos[2] + 0.6);
    geometries.push(nozzle);
  }

  const cPos = anchors.cargoDoor.position;
  const cargoDoor = new THREE.BoxGeometry(0.15, 3.4, 4.8);
  cargoDoor.translate(cPos[0] - 0.08, cPos[1], cPos[2]);
  const trackT = new THREE.BoxGeometry(0.25, 0.2, 5.8);
  trackT.translate(cPos[0] - 0.1, cPos[1] + 1.8, cPos[2]);
  const trackB = new THREE.BoxGeometry(0.25, 0.2, 5.8);
  trackB.translate(cPos[0] - 0.1, cPos[1] - 1.8, cPos[2]);
  geometries.push(cargoDoor, trackT, trackB);

  const canPos = anchors.canopy.position;
  const lStrut = new THREE.BoxGeometry(0.2, 2.1, 0.3); lStrut.translate(canPos[0] - 2.3, canPos[1], canPos[2]);
  const rStrut = new THREE.BoxGeometry(0.2, 2.1, 0.3); rStrut.translate(canPos[0] + 2.3, canPos[1], canPos[2]);
  const tStrut = new THREE.BoxGeometry(4.8, 0.2, 0.3); tStrut.translate(canPos[0], canPos[1] + 1.05, canPos[2]);
  const bStrut = new THREE.BoxGeometry(4.8, 0.2, 0.3); bStrut.translate(canPos[0], canPos[1] - 1.05, canPos[2]);
  geometries.push(lStrut, rStrut, tStrut, bStrut);

  // Window sockets: ring 5cm proud + recessed glass, both anchored to the hull's OUTER
  // skin (hullSurfacePoint), not the raw interior-wall anchor — round-2 finding 3 fix.
  for (const port of anchors.portholes) {
    const flush = hullSurfacePoint(port, anchors);
    const nx = port.normal[0];
    const torus = new THREE.TorusGeometry(0.44, 0.08, 8, 20);
    torus.rotateY(Math.PI / 2);
    torus.translate(flush.x + nx * 0.05, flush.y, flush.z);
    geometries.push(torus);
    const glass = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 16);
    glass.rotateZ(Math.PI / 2);
    glass.translate(flush.x - nx * 0.1, flush.y, flush.z);
    geometries.push(glass);
  }

  // ── 3. Greeble scatter — kit of 10, zone-weighted density, seam-biased, 90°-snapped ─────
  const kit = buildGreebleKit();
  const greebleParts: THREE.BufferGeometry[] = [];
  const canV = new THREE.Vector3(...canPos);
  const cgV = new THREE.Vector3(...cPos);
  const portVs = anchors.portholes.map((p) => new THREE.Vector3(...p.position));
  const DENSITY = 2.0;

  for (let i = 1; i < zStations.length - 1; i++) {
    const z = zStations[i];
    const zw = zoneWeight(z, cPos[2]);
    const verts = profiles[i];
    for (let sector = 0; sector < 8; sector++) {
      const expected = zw * DENSITY;
      let n = Math.floor(expected) + (rand() < expected % 1 ? 1 : 0);
      const p0 = verts[sector], p1 = verts[(sector + 1) % 8];
      while (n-- > 0) {
        const edge = rand() < 0.5 ? 0 : 1;
        const t = THREE.MathUtils.clamp(edge + (rand() - 0.5) * 0.4, 0.06, 0.94); // seam/corner-biased
        const p = new THREE.Vector3().lerpVectors(p0, p1, t);
        p.z += (rand() - 0.5) * 1.2; // jitter off the exact station line

        if (p.distanceTo(canV) < 2.6) continue; // keep the canopy clean
        if (p.distanceTo(cgV) < 3.0) continue;
        if (portVs.some((pv) => p.distanceTo(pv) < 1.2)) continue;

        const tangent = new THREE.Vector3().subVectors(p1, p0).normalize();
        const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 0, 1)).normalize();
        const g = kit[Math.floor(rand() * kit.length)].clone();
        const yaw = Math.floor(rand() * 4) * (Math.PI / 2); // 90°-snapped
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal)
          .multiply(new THREE.Quaternion().setFromAxisAngle(normal, yaw));
        const s = 0.8 + rand() * 0.4;
        g.scale(s, s, s);
        g.applyQuaternion(q);
        g.translate(p.x + normal.x * 0.02, p.y + normal.y * 0.02, p.z + normal.z * 0.02);
        greebleParts.push(g);
      }
    }
  }
  lastGreebleCount = greebleParts.length;
  if (greebleParts.length > 0) {
    geometries.push(mergeGeometries(greebleParts));
    for (const g of greebleParts) g.dispose();
  }
  for (const k of kit) k.dispose();

  // ── 4. Merge everything into one flat-shaded, non-indexed geometry ──────────────
  const mergedAll = mergeGeometries(geometries.map((g) => g.toNonIndexed()));
  for (const g of geometries) g.dispose();
  mergedAll.computeVertexNormals();

  return { geometry: mergedAll, tris: mergedAll.attributes.position.count / 3 };
}
