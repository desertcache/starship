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

const W = 8;
const H = 3.6;
const D = 7;
const DOOR_GAP_W = 1.4;
const DOOR_GAP_H = 2.2;

const WORLD_LABELS: Record<WorldId, string> = {
  ship: 'SHIP', verdant: 'VERDANT', ashfall: 'ASHFALL', rift: 'RIFT',
};

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
        return `${WORLD_LABELS[id]} — ${scans} CATALOGUED — ${relic}`;
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

  mergeStaticSiblings(group);

  // Hero — from the arrival pad: all three gates in frame (side gates sit
  // ~±49° off-axis, inside the ~54° half-hFOV at 16:9) + holotable shimmer.
  const localCamPos = new THREE.Vector3(0, 1.7, -2.75);
  const localCamLook = new THREE.Vector3(0, 1.45, 3.5);

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
