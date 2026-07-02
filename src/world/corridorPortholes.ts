/**
 * Corridor porthole bezel builder — extracted from corridor.ts (lane B3 v0.8).
 *
 * Builds the thick metallic bezel, reveal tube, bolt ring, corner mask, and the
 * star-overlay disc that gives the porthole a "window with stars" read from
 * oblique angles (additive, never blooms, real space still visible through it).
 */
import * as THREE from 'three';
import { cached } from '../fx/textureHelpers.js';

// ── Bezel materials ────────────────────────────────────────────────────────────
/** Gunmetal bezel ring — lowered roughness 0.22 + elevated envMapIntensity 1.6
 *  so the specular arc from ref-7 is visible at oblique angles. */
export const matCorridorBezel = new THREE.MeshStandardMaterial({
  color: 0x3a3e44, roughness: 0.22, metalness: 0.75, envMapIntensity: 1.6,
});

export const matCorridorTube = new THREE.MeshStandardMaterial({
  color: 0x1a1c20, roughness: 0.7, metalness: 0.4, side: THREE.BackSide,
});

export const matCorridorBolt = new THREE.MeshStandardMaterial({
  color: 0x4a5058, roughness: 0.35, metalness: 0.85, envMapIntensity: 1.0,
});

export const matCorridorCorner = new THREE.MeshStandardMaterial({
  color: 0x0d0e11, roughness: 0.9, metalness: 0.1, side: THREE.DoubleSide,
});

/** Bright specular catch-light ring — thin, proud of the bezel face, never flat. */
export const matCatchLight = new THREE.MeshStandardMaterial({
  color: 0x9aa0a8, metalness: 0.9, roughness: 0.15,
});

// ── Star overlay texture ───────────────────────────────────────────────────────

/** 256-px canvas with ~40 faint white/teal star dots + radial navy glow.
 *  Alpha ≤ 0.30, AdditiveBlending — guarantees "looks like a window" from
 *  any angle without hiding the real space behind the aperture. */
function makeStarOverlayTex(): THREE.CanvasTexture {
  return cached('porthole-star-overlay', () => {
    const S = 256;
    const cv = document.createElement('canvas'); cv.width = S; cv.height = S;
    const c = cv.getContext('2d')!;

    // Soft radial navy glow — very dark, adds depth
    const grd = c.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    grd.addColorStop(0,   'rgba(10, 14, 24, 0.20)');
    grd.addColorStop(0.6, 'rgba(10, 14, 24, 0.10)');
    grd.addColorStop(1,   'rgba(10, 14, 24, 0.00)');
    c.fillStyle = grd;
    c.beginPath();
    c.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
    c.fill();

    // ~40 faint star dots — white + occasional teal
    const stars = 42;
    // Deterministic placement (same seed every time via simple LCG)
    let seed = 0xdeadbeef;
    const rand = (): number => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0x100000000;
    };

    for (let i = 0; i < stars; i++) {
      // Polar coords inside the circle
      const r = rand() * (S / 2 - 6);
      const a = rand() * Math.PI * 2;
      const sx = S / 2 + Math.cos(a) * r;
      const sy = S / 2 + Math.sin(a) * r;
      const radius = 0.5 + rand() * 1.2;
      const alpha  = 0.12 + rand() * 0.18; // 0.12–0.30
      const teal   = rand() < 0.15;         // ~15% teal accent
      const col    = teal ? `rgba(100,220,210,${alpha.toFixed(2)})` : `rgba(255,255,255,${alpha.toFixed(2)})`;
      c.beginPath();
      c.arc(sx, sy, radius, 0, Math.PI * 2);
      c.fillStyle = col;
      c.fill();
    }

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

// ── Star disc mesh factory ─────────────────────────────────────────────────────

/**
 * Returns a CircleGeometry disc that sits at the outer end of the porthole
 * reveal tube (the exterior face, pressed outward).  The disc is additive +
 * transparent so real space is still fully visible; it just guarantees the
 * porthole reads as "window with stars" from oblique angles.
 *
 * @param winR  Inscribed circle radius (same as the reveal tube radius)
 * @param faceX  World X of the outer face of the tube
 * @param pY    Porthole centre Y
 * @param pZ    Porthole centre Z
 * @param sign  +1 starboard, -1 port
 */
function makeStarDisc(
  winR: number,
  faceX: number,
  pY: number,
  pZ: number,
  sign: number,
): THREE.Mesh {
  const geo = new THREE.CircleGeometry(winR, 40);
  const mat = new THREE.MeshBasicMaterial({
    map:          makeStarOverlayTex(),
    transparent:  true,
    opacity:      1.0,              // alpha carried entirely in texture (≤0.30)
    blending:     THREE.AdditiveBlending,
    depthWrite:   false,
    toneMapped:   true,             // NEVER bloom
    side:         THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.y = Math.PI / 2;
  // Place at outer tip of reveal tube — 5mm past the tube end to avoid z-fight
  mesh.position.set(faceX + sign * 0.085, pY, pZ);
  return mesh;
}

/**
 * Public helper: build a star overlay disc for any porthole (quarters, etc.).
 * Adds the mesh directly to `group`.
 *
 * @param group   Scene group to add to
 * @param winR    Inscribed circle radius (reveal tube radius)
 * @param faceX   Wall exterior face X (world-space)
 * @param sign    +1 = exterior faces in +X direction (port wall), -1 = starboard
 * @param pY      Porthole centre Y
 * @param pZ      Porthole centre Z
 */
export function buildPortholeStarDisc(
  group: THREE.Group,
  winR: number,
  faceX: number,
  sign: number,
  pY: number,
  pZ: number,
): void {
  group.add(makeStarDisc(winR, faceX, pY, pZ, sign));
}

// ── Bezel builder ──────────────────────────────────────────────────────────────

/**
 * Round porthole bezel for corridor side-walls.
 * Porthole opening is W×H rectangular; the bezel frames it with a ring + bolts.
 * The corner mask uses RingGeometry (open centre) so the circular aperture is
 * never occluded — only the square corners outside the circle are covered.
 *
 * Enhancements over the original (lane B3):
 *  - matCorridorBezel roughness 0.22 (was 0.30) + envMapIntensity 1.6 (was 1.0)
 *  - Thin bright catch-light ring (TorusGeometry, radius−0.03, tube 0.012,
 *    color 0x9aa0a8, metalness 0.9, roughness 0.15) — coplanar-safe ≥5mm proud
 *  - Star overlay disc at outer tube end (additive, alpha≤0.30, toneMapped)
 *
 * @param group  room group to add to
 * @param wX     wall X position (positive = starboard, negative = port)
 * @param pZ     local Z of porthole centre
 * @param pY     local Y of porthole centre
 * @param pW     porthole opening width
 * @param pH     porthole opening height
 */
export function buildCorridorPortholeBezel(
  group: THREE.Group,
  wX: number, pZ: number, pY: number, pW: number, pH: number,
): void {
  const sign   = wX < 0 ? -1 : 1;  // which side the face is on
  const faceX  = wX + sign * 0.005; // exterior face of wall (5mm proud — clears z-fight)

  // Inscribed circle radius — clears the rectangular opening
  const WIN_R  = Math.min(pW, pH) / 2 * 0.88;

  // Torus center radius ≈ half cutout diagonal; tube thickness 0.05
  const TUBE_R   = 0.05;
  const diagHalf = Math.sqrt(pW * pW + pH * pH) / 2;
  const torusR   = Math.min(diagHalf + 0.06, pW > 0.7 ? 0.53 : 0.40);

  // Annulus outerR — just past the cutout corner diagonal
  const outerR = diagHalf + 0.02;

  // Corner-masking annulus — RingGeometry has an open centre so the circular
  // aperture stays fully transparent.
  // Named (and every other bezel piece below too): the v0.9 A1 defrag pass
  // merges unnamed same-material siblings, and merging these rotated
  // Ring/Torus/Cylinder pieces across the 4 porthole instances produced a
  // visible geometry artifact at grazing angles (qa-porthole-oblique). Root
  // cause not fully isolated — naming opts them out of that merge pass.
  const cornerGeo = new THREE.RingGeometry(WIN_R, outerR, 48);
  const cornerMask = new THREE.Mesh(cornerGeo, matCorridorCorner);
  cornerMask.name = 'porthole-bezel-corner';
  cornerMask.rotation.y = Math.PI / 2;
  cornerMask.position.set(faceX, pY, pZ);
  group.add(cornerMask);

  // Cylindrical reveal tube — open-ended, short depth toward exterior
  const tubeGeo = new THREE.CylinderGeometry(WIN_R, WIN_R, 0.08, 28, 1, true);
  const tube = new THREE.Mesh(tubeGeo, matCorridorTube);
  tube.name = 'porthole-bezel-tube';
  tube.rotation.z = Math.PI / 2;
  tube.position.set(faceX + sign * 0.04, pY, pZ);
  group.add(tube);

  // Torus ring rim — center radius = torusR, tube thickness = TUBE_R
  const ringGeo = new THREE.TorusGeometry(torusR, TUBE_R, 10, 40);
  const ring = new THREE.Mesh(ringGeo, matCorridorBezel);
  ring.name = 'porthole-bezel-ring';
  ring.rotation.y = Math.PI / 2;
  ring.position.set(faceX + sign * 0.001, pY, pZ);
  group.add(ring);

  // Thin bright catch-light ring (≥5mm proud of bezel face = proud of faceX)
  // torusRadius − 0.03, tube 0.012, color 0x9aa0a8, metalness 0.9, roughness 0.15
  const catchR  = torusR - 0.03;
  const catchGeo = new THREE.TorusGeometry(catchR, 0.012, 8, 40);
  const catchRing = new THREE.Mesh(catchGeo, matCatchLight);
  catchRing.name = 'porthole-bezel-catchring';
  catchRing.rotation.y = Math.PI / 2;
  // 7mm proud of the main bezel torus (which is at faceX + sign*0.001)
  catchRing.position.set(faceX + sign * 0.008, pY, pZ);
  group.add(catchRing);

  // 8 bolt cylinders placed on the ring outer edge
  const boltGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.032, 7);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const bolt = new THREE.Mesh(boltGeo, matCorridorBolt);
    bolt.name = 'porthole-bezel-bolt';
    bolt.rotation.z = Math.PI / 2;
    bolt.position.set(
      faceX + sign * 0.028,
      pY + Math.sin(angle) * torusR,
      pZ + Math.cos(angle) * torusR,
    );
    group.add(bolt);
  }

  // Star overlay disc at outer end of reveal tube
  group.add(makeStarDisc(WIN_R, faceX, pY, pZ, sign));
}
