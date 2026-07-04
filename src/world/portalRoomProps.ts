/**
 * src/world/portalRoomProps.ts — Dimensional Annex prop dressing.
 *
 * Three portal gates (burnt-orange chamfered frames on raised dais steps,
 * gunmetal conduit feeds, teal micro-LED accents), a dimensional survey
 * console anchor, a central holotable, and an arrival-pad marker.
 *
 * Livingness (T1): each gate's conduit carries a column of small emissive
 * segments whose opacity/color is `f(t - index*phaseStep)` — a charge pulse
 * that visibly TRAVELS up the conduit toward the gate. Each gate ticks at a
 * different speed/character so the room reads as three distinct living
 * systems (verdant slow+lush, ashfall fast+hot, rift erratic+prismatic).
 * Driven by onBeforeRender directly on each segment mesh (matches the
 * existing attachPulse pattern in engineeringProps.ts) — time-based, never
 * Math.random(). Segment meshes are excluded from mergeStaticSiblings
 * automatically (custom onBeforeRender).
 *
 * Geometry strategy: one canonical gate cluster is built at a LOCAL origin
 * (wall at local z=0, portal facing local -Z, room extending toward -z),
 * then wrapped in a THREE.Group positioned+rotated per gate. This means the
 * chamfer/frame/conduit language is written exactly once and is guaranteed
 * identical across all three gates.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { AABB } from './types.js';
import type { WorldId } from '../core/worldTypes.js';
import { matDoorFrame } from '../fx/shipMaterials.js';
import { matPipeDark, matConsoleHousing } from '../fx/propMaterials.js';
import { addLedCluster, addUnderglow, LedColors } from '../fx/glow.js';
import { createPortalSurface, type PortalSurface } from '../fx/portalSurface.js';
import { rng } from '../fx/textureHelpers.js';
import { attachRelicSocketGlow } from './portalRoomSocket.js';
import { makeRelicSocketTexture, makeSurveyConsoleTexture } from './portalRoomTextures.js';

// ── Canonical gate geometry constants (local frame: wall at z=0) ─────────────
const GATE_W = 2.2;
const GATE_H = 2.8;
const DAIS_Y = 0.20;      // dais top / gate base height
const FRAME_DEPTH = 0.22;
const JAMB_W = 0.16;
const HEAD_H = 0.16;
const CONDUIT_R = 0.035;

interface GateConfig {
  worldId: WorldId;
  tint: string;
  pulseHex: number;
  pos: THREE.Vector3;   // room-local wrapper position (at the wall)
  rotY: number;          // wrapper rotation aiming the gate at room center
  speed: number;
  phaseStep: number;
  segCount: number;
  wobble: boolean;
  seed: number;
}

const GATES: GateConfig[] = [
  { worldId: 'verdant', tint: '#3FD9C0', pulseHex: 0x3fd9c0, pos: new THREE.Vector3(0, 0, 3.5), rotY: 0,
    speed: 0.55, phaseStep: 0.16, segCount: 7, wobble: false, seed: 0x7a11 },
  { worldId: 'ashfall', tint: '#E0552A', pulseHex: 0xff5a2e, pos: new THREE.Vector3(-4, 0, 0.9), rotY: -Math.PI / 2,
    speed: 1.05, phaseStep: 0.20, segCount: 6, wobble: false, seed: 0x7a22 },
  { worldId: 'rift', tint: '#9B5CFF', pulseHex: 0xa060ff, pos: new THREE.Vector3(4, 0, 0.9), rotY: Math.PI / 2,
    speed: 0.8, phaseStep: 0.12, segCount: 8, wobble: true, seed: 0x7a33 },
];

/** Rotate+translate a local-frame AABB by a wrapper transform (rotY ∈ {0, ±π/2} only). */
function wrapAABB(a: AABB, posX: number, posZ: number, rotY: number): AABB {
  let minX = a.minX, maxX = a.maxX, minZ = a.minZ, maxZ = a.maxZ;
  if (Math.abs(rotY - Math.PI / 2) < 0.01) {
    minX = a.minZ; maxX = a.maxZ; minZ = -a.maxX; maxZ = -a.minX;
  } else if (Math.abs(rotY + Math.PI / 2) < 0.01) {
    minX = -a.maxZ; maxX = -a.minZ; minZ = a.minX; maxZ = a.maxX;
  }
  return { minX: minX + posX, maxX: maxX + posX, minY: a.minY, maxY: a.maxY, minZ: minZ + posZ, maxZ: maxZ + posZ };
}

/** T1 propagating-wave pulse — index-phased, per-gate rate/character. */
function attachConduitPulse(
  mesh: THREE.Mesh, mat: THREE.MeshBasicMaterial, index: number,
  cfg: GateConfig, dim: THREE.Color, bright: THREE.Color,
): void {
  mesh.onBeforeRender = (): void => {
    const t = performance.now() / 1000;
    let wave = 0.5 + 0.5 * Math.sin((t * cfg.speed - index * cfg.phaseStep) * Math.PI * 2);
    if (cfg.wobble) wave *= 0.80 + 0.20 * Math.sin(t * 3.3 + index * 0.7);
    wave = Math.max(0, Math.min(1, wave));
    mat.opacity = 0.28 + 0.72 * wave;
    mat.color.copy(dim).lerp(bright, wave);
  };
}

interface GateBuild { group: THREE.Group; portal: PortalSurface; colliders: AABB[] }

function buildGateCluster(cfg: GateConfig): GateBuild {
  const g = new THREE.Group();
  g.name = `gate-${cfg.worldId}`;
  const colliders: AABB[] = [];
  const rand = rng(cfg.seed);

  // ── Dais: two rising steps toward the wall ────────────────────────────────
  const step1 = new THREE.BoxGeometry(GATE_W + 1.0, 0.10, 1.15);
  step1.translate(0, 0.05, -0.575);
  const step2 = new THREE.BoxGeometry(GATE_W + 0.3, 0.10, 0.60);
  step2.translate(0, 0.15, -0.28);
  const daisMerged = mergeGeometries([step1, step2]);
  step1.dispose(); step2.dispose();
  g.add(new THREE.Mesh(daisMerged, matConsoleHousing));
  colliders.push({ minX: -(GATE_W + 1.0) / 2, minY: 0, minZ: -1.15, maxX: (GATE_W + 1.0) / 2, maxY: 0.20, maxZ: 0.02 });

  // ── Chamfered burnt-orange frame (jambs + header + corner struts) ─────────
  const frameGeos: THREE.BufferGeometry[] = [];
  const jL = new THREE.BoxGeometry(JAMB_W, GATE_H, FRAME_DEPTH);
  jL.translate(-(GATE_W / 2 + JAMB_W / 2), DAIS_Y + GATE_H / 2, -FRAME_DEPTH / 2); frameGeos.push(jL);
  const jR = new THREE.BoxGeometry(JAMB_W, GATE_H, FRAME_DEPTH);
  jR.translate(GATE_W / 2 + JAMB_W / 2, DAIS_Y + GATE_H / 2, -FRAME_DEPTH / 2); frameGeos.push(jR);
  const hdr = new THREE.BoxGeometry(GATE_W + JAMB_W * 2, HEAD_H, FRAME_DEPTH);
  hdr.translate(0, DAIS_Y + GATE_H + HEAD_H / 2, -FRAME_DEPTH / 2); frameGeos.push(hdr);
  // Chamfer struts — 45°-angled corner accents, one consistent language
  for (const sx of [-1, 1]) {
    const strut = new THREE.BoxGeometry(0.16, 0.16, FRAME_DEPTH * 0.9);
    strut.rotateZ(sx * Math.PI / 4);
    strut.translate(sx * (GATE_W / 2 + JAMB_W * 0.3), DAIS_Y + GATE_H + 0.02, -FRAME_DEPTH / 2);
    frameGeos.push(strut);
  }
  const frameMerged = mergeGeometries(frameGeos);
  for (const fg of frameGeos) fg.dispose();
  g.add(new THREE.Mesh(frameMerged, matDoorFrame));
  colliders.push({
    minX: -(GATE_W / 2 + JAMB_W), minY: DAIS_Y, minZ: -FRAME_DEPTH,
    maxX: -(GATE_W / 2 - 0.02), maxY: DAIS_Y + GATE_H + HEAD_H, maxZ: 0.02,
  });
  colliders.push({
    minX: GATE_W / 2 - 0.02, minY: DAIS_Y, minZ: -FRAME_DEPTH,
    maxX: GATE_W / 2 + JAMB_W, maxY: DAIS_Y + GATE_H + HEAD_H, maxZ: 0.02,
  });

  // ── Portal surface — local +Z rotated 180°, so it faces local -Z ─────────
  const portal = createPortalSurface(cfg.worldId, cfg.tint, GATE_W - 0.18, GATE_H - 0.18);
  portal.mesh.rotation.y = Math.PI;
  portal.mesh.position.set(0, DAIS_Y + GATE_H / 2, -FRAME_DEPTH * 0.4);
  g.add(portal.mesh);

  // ── Gunmetal conduit feeds — floor risers that elbow INTO each jamb ──────
  const pipeGeos: THREE.BufferGeometry[] = [];
  const conduitTopY = DAIS_Y + GATE_H * 0.72;
  for (const sx of [-1, 1]) {
    const x = sx * (GATE_W / 2 + JAMB_W + 0.10);
    const pipe = new THREE.CylinderGeometry(CONDUIT_R, CONDUIT_R, conduitTopY, 7);
    pipe.translate(x, conduitTopY / 2, -0.05);
    pipeGeos.push(pipe);
    const elbow = new THREE.CylinderGeometry(CONDUIT_R, CONDUIT_R, 0.18, 7);
    elbow.rotateZ(Math.PI / 2);
    elbow.translate(x - sx * 0.09, conduitTopY, -0.05); // feeds into the jamb
    pipeGeos.push(elbow);
  }
  const pipeMerged = mergeGeometries(pipeGeos);
  for (const pg of pipeGeos) pg.dispose();
  g.add(new THREE.Mesh(pipeMerged, matPipeDark));

  // T4 — biome-tinted portal-glow wash over the dais (the annex is lit by its
  // portals; addUnderglow is the ship's standard fake-bounce machinery).
  addUnderglow(g, {
    x: 0, y: DAIS_Y + 0.02, z: -0.55, width: GATE_W + 0.8, length: 1.05,
    tiltX: -Math.PI / 2, color: cfg.pulseHex, opacity: 0.11,
  });

  const dimCol = new THREE.Color(cfg.pulseHex).multiplyScalar(0.22);
  const brightCol = new THREE.Color(cfg.pulseHex);
  const segX = GATE_W / 2 + JAMB_W + 0.10 + CONDUIT_R + 0.025;
  const segGeo = new THREE.BoxGeometry(0.045, conduitTopY / cfg.segCount * 0.72, 0.045);
  for (let i = 0; i < cfg.segCount; i++) {
    const t = (i + 0.5) / cfg.segCount;
    const mat = new THREE.MeshBasicMaterial({ color: brightCol.clone(), toneMapped: false, transparent: true });
    const seg = new THREE.Mesh(segGeo, mat);
    seg.position.set(segX, t * conduitTopY, -0.05);
    attachConduitPulse(seg, mat, i, cfg, dimCol, brightCol);
    g.add(seg);
  }

  // ── Teal micro-LED accents along the frame ────────────────────────────────
  const ledY = DAIS_Y + GATE_H + HEAD_H / 2;
  addLedCluster(g, [
    { pos: new THREE.Vector3(-GATE_W / 2, ledY, 0.02), color: LedColors.teal },
    { pos: new THREE.Vector3(GATE_W / 2, ledY, 0.02), color: LedColors.teal, blink: true, period: 1.6 + rand() * 1.2, phase: rand() },
    { pos: new THREE.Vector3(-(GATE_W / 2 + JAMB_W - 0.02), DAIS_Y + 0.3, 0.02), color: LedColors.teal },
    { pos: new THREE.Vector3(GATE_W / 2 + JAMB_W - 0.02, DAIS_Y + 0.3, 0.02), color: LedColors.teal },
  ]);

  // ── Relic socket — dark/empty pedestal + biome-tinted rune ring ──────────
  const socketX = GATE_W / 2 + 0.55;
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.30, 10), matConsoleHousing);
  pedestal.position.set(socketX, 0.15, -0.55);
  g.add(pedestal);
  const ringMat = new THREE.MeshBasicMaterial({
    map: makeRelicSocketTexture(cfg.tint, cfg.seed), transparent: true, toneMapped: false, side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.26), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(socketX, 0.305, -0.55);
  ring.name = `relic-socket-${cfg.worldId}`;
  // Stage D ignition: emissive swap ONLY, state-driven — see portalRoomSocket.ts.
  attachRelicSocketGlow(ring, ringMat, cfg.worldId, cfg.tint, cfg.pulseHex);
  g.add(ring);
  colliders.push({ minX: socketX - 0.16, minY: 0, minZ: -0.71, maxX: socketX + 0.16, maxY: 0.30, maxZ: -0.39 });

  return { group: g, portal, colliders };
}

// ── Holotable ──────────────────────────────────────────────────────────────

function buildHolotable(group: THREE.Group, x: number, z: number): AABB {
  const R = 0.5; const HT = 0.9;
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 1.08, HT, 8), matConsoleHousing);
  pedestal.position.set(x, HT / 2, z);
  group.add(pedestal);

  // Subtle standby shimmer — additive light-cone, apex at the emitter (Stage D
  // adds the real hologram). depthWrite off so it never punches the scene.
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.2, 0.45, 8, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x46e0d8, transparent: true, opacity: 0.05, toneMapped: false,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
    }),
  );
  cone.position.set(x, HT + 0.225, z);
  cone.rotation.x = Math.PI;
  group.add(cone);

  const anchor = new THREE.Group();
  anchor.name = 'holotable-projection';
  anchor.position.set(x, HT + 0.05, z);
  group.add(anchor);

  return { minX: x - R, minY: 0, minZ: z - R, maxX: x + R, maxY: HT, maxZ: z + R };
}

// ── Survey console (geometry only — Interactable built by portalRoom.ts) ───

function buildConsoleHousing(group: THREE.Group, x: number, z: number): AABB {
  const housing = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.3, 0.3), matConsoleHousing);
  housing.position.set(x, 0.65, z);
  housing.name = 'survey-console';
  group.add(housing);

  // Emissive readout screen on the room-facing (+Z) face, tilted back slightly
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 0.36),
    new THREE.MeshBasicMaterial({ map: makeSurveyConsoleTexture(), toneMapped: false }),
  );
  screen.position.set(x, 0.98, z + 0.155);
  screen.rotation.x = -0.12;
  group.add(screen);
  addUnderglow(group, {
    x, y: 0.72, z: z + 0.20, width: 0.5, length: 0.3,
    tiltX: -Math.PI / 2, color: 0x2ad8e8, opacity: 0.22,
  });

  addLedCluster(group, [
    { pos: new THREE.Vector3(x - 0.18, 1.24, z + 0.16), color: LedColors.teal, blink: true, period: 2.2, phase: 0.3 },
    { pos: new THREE.Vector3(x + 0.18, 1.24, z + 0.16), color: LedColors.orange },
  ]);
  return { minX: x - 0.3, minY: 0, minZ: z - 0.15, maxX: x + 0.3, maxY: 1.3, maxZ: z + 0.15 };
}

// ── Public API ─────────────────────────────────────────────────────────────

export interface PortalRoomProps {
  colliders: AABB[];
  gates: Array<{ worldId: WorldId; portal: PortalSurface }>;
  consoleAnchor: THREE.Vector3;
}

const CONSOLE_POS = new THREE.Vector3(-2.6, 0, -3.25);
const HOLOTABLE_POS = new THREE.Vector3(0, 0, -0.6);

export function buildPortalRoomProps(group: THREE.Group): PortalRoomProps {
  const colliders: AABB[] = [];
  const gates: Array<{ worldId: WorldId; portal: PortalSurface }> = [];

  for (const cfg of GATES) {
    const built = buildGateCluster(cfg);
    built.group.position.set(cfg.pos.x, cfg.pos.y, cfg.pos.z);
    built.group.rotation.y = cfg.rotY;
    group.add(built.group);
    for (const c of built.colliders) colliders.push(wrapAABB(c, cfg.pos.x, cfg.pos.z, cfg.rotY));
    gates.push({ worldId: cfg.worldId, portal: built.portal });
  }

  colliders.push(buildHolotable(group, HOLOTABLE_POS.x, HOLOTABLE_POS.z));
  colliders.push(buildConsoleHousing(group, CONSOLE_POS.x, CONSOLE_POS.z));

  return { colliders, gates, consoleAnchor: new THREE.Vector3(CONSOLE_POS.x, 1.0, CONSOLE_POS.z + 0.35) };
}
