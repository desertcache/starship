/**
 * src/world/portalRoom.ts — Dimensional Annex (Stage B), aft of the cargo bay.
 *
 * World placement (0, 0, 21.5), 8W x 3.6H x 7D. Fore face at world Z=18 sits
 * FLUSH against the cargo bay's aft wall (also Z=18, cargoBay.ts D=9 centered
 * at 13.5) — zero gap, matching the contiguous-room convention every other
 * doorway in assembly.ts already uses (e.g. engineering/cargo both meet at
 * Z=9). The design doc's "(0,0,22)" is the same room rounded to a whole
 * number ("~7D"); 21.5 is the precise flush placement.
 *
 * Graceful unregistered-target handling: verdant/ashfall/rift are NOT
 * registered until Stage C. Each portal's raw Interactable is NOT exposed
 * directly — it's wrapped so E-interact checks `hasWorld()` first. When
 * unregistered: show a "DIMENSIONAL LOCK" toast, never call the real
 * onInteract (so the portal's internal traversal latch is never touched via
 * this path). Live-preview already no-ops for unregistered targets for free
 * (worldBoot.getScene returns null — see fx/portalSurface.ts renderLive).
 * The one path this can't intercept is Stage A's own walk-through plane-cross
 * trigger inside portalSurface.ts (consumed, not modified, per project
 * rules) — a tiny self-ticking guard mesh calls the exported
 * resetPortalTraversalLatch() every frame while none of the 3 worlds are
 * registered, so an accidental walk-through can never permanently wedge the
 * portal system. Once Stage C registers a world this guard's condition goes
 * false and stops firing — zero code changes needed here.
 */
import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import { matWall } from './materials.js';
import { mergeStaticSiblings } from './staticMerge.js';
import { buildPortalRoomProps } from './portalRoomProps.js';
import { resetPortalTraversalLatch } from '../fx/portalSurface.js';
import { hasWorld } from '../core/worlds.js';
import { getCodex } from '../core/state.js';
import { showOverlay, showRoomToast } from '../ui/hud.js';
import { playOneShot } from '../fx/audio.js';
import type { RoomModule, Interactable, InteractContext } from './types.js';
import type { WorldId } from '../core/worldTypes.js';
// v1.0 THRESHOLD Stage D — holotable hologram. src/fx/hull/* is OWNED by an
// external (Antigravity) lane; consumed as-is here, never edited. See
// buildIgnitedHologram()'s try/catch below for the runtime-failure fallback.
import { buildHullGeometry } from '../fx/hull/buildHull.js';
import { interiorAnchors } from '../fx/hull/anchors.js';
import { addBarycentric, createHoloMaterial } from '../fx/hull/holoMaterial.js';

const W = 8;
const H = 3.6;
const D = 7;
const DOOR_GAP_W = 1.4;
const DOOR_GAP_H = 2.2;

const WORLD_LABELS: Record<WorldId, string> = {
  ship: 'SHIP', verdant: 'VERDANT', ashfall: 'ASHFALL', rift: 'RIFT',
};

/** Each pocket world ships exactly 4 non-creature scannables + 2 creature
 *  species = 6 catalogable codex entries (design doc, Stage D codex item). */
const CODEX_ENTRIES_PER_WORLD = 6;

// Arrival pad center, room-local. Ring (r=0.72) stays fully inside the room
// (fore wall at local z=-3.5). Also the ship-world spawn (see bottom of file).
const ARRIVAL_PAD_LOCAL = new THREE.Vector3(0, 0, -2.75);

/** E-interact wrapper: checks the world registry before ever touching the
 *  portal's real onInteract (so an unregistered target never sets the
 *  internal traversal latch through this path). Shares `portal.interactable`'s
 *  own Vector3 reference so the position stays synced every frame for free. */
function makeGracefulPortalInteractable(
  worldId: WorldId,
  raw: Interactable,
): Interactable {
  return {
    id: raw.id,
    prompt: raw.prompt,
    radius: raw.radius,
    position: raw.position,
    getPrompt(): string {
      if (!hasWorld(worldId)) return 'Dimensional Lock';
      return raw.getPrompt ? raw.getPrompt() : raw.prompt;
    },
    onInteract(ctx: InteractContext): void {
      if (hasWorld(worldId)) {
        raw.onInteract(ctx);
        return;
      }
      playOneShot('ui');
      showRoomToast('DIMENSIONAL LOCK — CALIBRATING');
    },
  };
}

const HOLO_SEED = 0x1704;

interface IgnitedHologram {
  mesh: THREE.Mesh;
  timeUniform: THREE.IUniform<number> | null;
}

/**
 * Builds the ship-hull hologram from the external src/fx/hull/ lane (consumed
 * as-is — never edited here). Retries once on a runtime failure; if the
 * import is still broken, ships a simple additive-teal cone placeholder
 * behind the same ignition/rotation logic so the annex never regresses.
 */
function buildIgnitedHologram(): IgnitedHologram {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const hull = buildHullGeometry(HOLO_SEED, interiorAnchors);
      addBarycentric(hull.geometry);
      const holoMat = createHoloMaterial(0x59d9ff);
      // Consume-side intensity trim (uniform tweak, NOT an edit to the hull
      // lane's files): at 1/45 scale the wire term's fwidth() covers most of
      // each tiny triangle, so at full uColor the whole miniature saturates
      // into one bloomed blob. 0.35x drops faces below the bloom threshold —
      // fresnel silhouettes + the sweep band survive, hull structure reads.
      (holoMat.uniforms['uColor'].value as THREE.Vector3).multiplyScalar(0.35);
      const mesh = new THREE.Mesh(hull.geometry, holoMat);
      mesh.name = 'ship-hologram';
      mesh.scale.setScalar(1 / 45);
      mesh.visible = false;
      return { mesh, timeUniform: holoMat.uniforms['uTime'] as THREE.IUniform<number> };
    } catch (err) {
      console.error(`[portalRoom] hull hologram build attempt ${attempt + 1} failed`, err);
    }
  }
  console.error('[portalRoom] hull import unavailable after retry — shipping additive-teal cone placeholder (deviation, see report)');
  const mesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.5, 10, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x46e0d8, transparent: true, opacity: 0.6, toneMapped: false,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
    }),
  );
  mesh.name = 'ship-hologram';
  mesh.visible = false;
  return { mesh, timeUniform: null };
}

function buildSurveyConsoleInteractable(anchor: THREE.Vector3): Interactable {
  const worlds: WorldId[] = ['verdant', 'ashfall', 'rift'];
  return {
    id: 'dimensional-survey-console',
    prompt: 'Access Survey Console',
    radius: 2.3,
    position: anchor.clone(),
    onInteract(): void {
      playOneShot('ui');
      const codex = getCodex();
      const lines = worlds.map((id) => {
        if (!hasWorld(id)) return `${WORLD_LABELS[id]} — CALIBRATING`;
        const scans = codex.scans.filter((s) => s.startsWith(`${id}-`)).length;
        const relic = codex.relics.includes(id) ? 'RELIC SECURED' : 'RELIC UNCONFIRMED';
        return `${WORLD_LABELS[id]} — ${scans}/${CODEX_ENTRIES_PER_WORLD} CATALOGUED — ${relic}`;
      });
      showOverlay('DIMENSIONAL SURVEY', lines);
    },
  };
}

export function buildPortalRoom(): RoomModule {
  const { group, colliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    wallMaterial: matWall,
    doors: [
      { wall: 'fore', gapW: DOOR_GAP_W, gapH: DOOR_GAP_H, offset: 0, framed: true },
    ],
  });
  group.name = 'portal-room';

  const props = buildPortalRoomProps(group);
  for (const c of props.colliders) colliders.push(c);

  // Arrival pad marker — teal floor ring at the pocket-world return spawn.
  const pad = new THREE.Mesh(
    new THREE.RingGeometry(0.50, 0.72, 40),
    new THREE.MeshBasicMaterial({
      color: 0x46e0d8, transparent: true, opacity: 0.45,
      side: THREE.DoubleSide, toneMapped: false,
    }),
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(ARRIVAL_PAD_LOCAL.x, 0.03, ARRIVAL_PAD_LOCAL.z);
  group.add(pad);

  const interactables: Interactable[] = [
    buildSurveyConsoleInteractable(props.consoleAnchor),
  ];
  for (const gate of props.gates) {
    interactables.push(makeGracefulPortalInteractable(gate.worldId, gate.portal.interactable));
  }

  // Self-healing latch guard — see file header. Cheap: one visibility-gated
  // no-op mesh, ticked only while the annex room is in the render frustum
  // (same acceptable-imperfection tradeoff as doors.ts's own dummy pattern).
  const latchGuard = new THREE.Mesh(
    new THREE.PlaneGeometry(0.001, 0.001),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  latchGuard.position.set(0, 1.6, 0);
  latchGuard.onBeforeRender = (): void => {
    if (!hasWorld('verdant') && !hasWorld('ashfall') && !hasWorld('rift')) {
      resetPortalTraversalLatch();
    }
  };
  group.add(latchGuard);

  // ── Holotable hologram: additive-teal ship-hull miniature, dormant until
  // all 3 relics are held. Built once at room-build time; visibility +
  // rotation are polled every frame off `getCodex()` (state-driven, not
  // event-driven — survives a loadState() reload with no live pickup event).
  const holoAnchor = group.getObjectByName('holotable-projection') as THREE.Group | undefined;
  // F9 (Stage E): named standby cone (portalRoomProps.buildHolotable) — hidden
  // until the first relic is held, so the truly-empty table reads empty.
  const standbyCone = group.getObjectByName('holotable-standby-cone') as THREE.Mesh | undefined;
  if (holoAnchor) {
    const built = buildIgnitedHologram();
    // F1 (Stage E): the 1/45 miniature was lying flat on the table (foil
    // read) and the hero cam looked straight down on it. Float it within its
    // anchor and bank the whole anchor into a hero pose so the spinning hull
    // silhouette reads as a ship, not a coin. Scale stays exactly 1/45 —
    // scanline density in the hull shader is keyed to it.
    built.mesh.position.set(0, 0.38, 0);
    holoAnchor.rotation.z = 0.45;
    holoAnchor.add(built.mesh);

    // Object3D.visible===false short-circuits BEFORE onBeforeRender ever runs
    // (three.js core: WebGLRenderer.projectObject returns early), so the
    // hologram mesh itself cannot poll its own state while dormant. A tiny
    // always-rendered, visually-negligible proxy mesh drives it instead —
    // frustumCulled=false so it never silently stops ticking off-camera.
    const holoDriver = new THREE.Mesh(
      new THREE.PlaneGeometry(0.001, 0.001),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.001, depthWrite: false }),
    );
    holoDriver.frustumCulled = false;
    holoDriver.position.set(0, 1.6, -0.6);
    holoDriver.onBeforeRender = (): void => {
      const relics = getCodex().relics;
      const ignited = relics.includes('verdant') && relics.includes('ashfall') && relics.includes('rift');
      built.mesh.visible = ignited;
      if (standbyCone) standbyCone.visible = relics.length > 0; // F9
      if (ignited) {
        const t = performance.now() / 1000;
        built.mesh.rotation.y = t * 0.3;
        if (built.timeUniform) built.timeUniform.value = t;
      }
    };
    group.add(holoDriver);
  }

  mergeStaticSiblings(group);

  // Hero — from the arrival pad: all three gates in frame (side gates sit
  // ~±49° off-axis, inside the ~54° half-hFOV at 16:9) + holotable shimmer.
  // F4 (Stage E): raised + pulled back so both side-gate daises/jambs and the
  // ignited holotable's hero pose (F1) all read from one shot.
  const localCamPos = new THREE.Vector3(0, 1.9, -3.1);
  const localCamLook = new THREE.Vector3(0, 1.5, 3.5);

  // QA — oblique from beside the rift dais, sighted straight fore (-Z): the
  // cargo doorway (~27° left), rift conduit strip + socket (~19-27° right),
  // survey console (left edge) and arrival pad all in one frame.
  const localCamQaPos = new THREE.Vector3(2.6, 1.7, 1.6);
  const localCamQaLook = new THREE.Vector3(2.6, 1.05, -3.4);

  return {
    group,
    colliders,
    interactables,
    cameras: [
      { name: 'portal-room', position: localCamPos, lookAt: localCamLook },
      { name: 'portal-room-qa', position: localCamQaPos, lookAt: localCamQaLook },
    ],
  };
}

/**
 * World-space arrival pad + facing — single source of truth for
 * worldBoot.ts's ship-world spawn (players land here returning from any
 * pocket world). Room world offset (0,0,21.5) matches the RoomPlacement
 * assembly.ts registers for this module.
 */
export const ANNEX_ROOM_WORLD_OFFSET = new THREE.Vector3(0, 0, 21.5);

export function getAnnexArrivalSpawn(): { position: THREE.Vector3; lookAt: THREE.Vector3 } {
  return {
    position: ARRIVAL_PAD_LOCAL.clone().add(ANNEX_ROOM_WORLD_OFFSET).setY(1.7),
    lookAt: new THREE.Vector3(0, 1.4, 1.8).add(ANNEX_ROOM_WORLD_OFFSET),
  };
}
