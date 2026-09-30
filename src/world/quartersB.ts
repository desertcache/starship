/** Starboard crew quarters: personal storage, picture, plant, and desk. */
import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule, AABB, Interactable, InteractContext } from './types.js';
import {
  buildBunk,
  buildLockers,
  buildLockerWithDoor,
  buildNightstand,
  matBlanketB,
} from './quartersProps.js';
import {
  buildBunkSurround,
  buildPortholeReveal,
  buildOverheadCabinet,
  buildWallTablet,
  buildHooks,
  buildFramedPicture,
  buildPottedPlant,
  buildLightSwitchPlate,
} from './quartersDressing.js';
import { buildFoldDownDesk, buildDeskWallDressing } from './quartersRightWall.js';
import { matCrateShell } from '../fx/propMaterials.js';
import { mergeStaticSiblings } from './staticMerge.js';
import { advanceShipClock, setEnergy } from '../core/state.js';
import { fadeTransition } from '../ui/hud.js';
import { restockFridge } from './interactItems.js';
import { playOneShot } from '../fx/audio.js';
import { W, H, D, shiftAABB } from './quartersShared.js';

// ── Starboard quarter (quarters-b) ────────────────────────────────────────────

export function buildQuartersB(): RoomModule {
  // Starboard side: outer wall = starboard (X = +2.5), porthole there.
  //                 inner wall = port (X = -2.5), door to corridor.
  const { group, colliders } = buildRoom({
    width: W, height: H, depth: D,
    doors: [
      { wall: 'port', gapW: 1.4, gapH: 2.2, offset: 0 },
    ],
    windows: [
      { wall: 'starboard', w: 1.0, h: 0.8, yBot: 1.2, offset: 0 },
    ],
  });

  group.name = 'quarters-b';

  const propColliders: AABB[] = [];

  // ── Bunk against fore wall — orange blanket ────────────────────────────────
  const bunkB = buildBunk(matBlanketB);
  bunkB.group.position.set(0, 0, -1.98);
  group.add(bunkB.group);
  propColliders.push(shiftAABB(bunkB.collider, 0, 0, -1.98));

  // ── Bunk surround (jambs + header + sill + reading light) ─────────────────
  buildBunkSurround(group, 0, -1.98);

  // ── Porthole reveal — outer (starboard) wall at X = +2.5 ─────────────────
  buildPortholeReveal(group, 2.5);

  // ── Overhead storage cabinet — starboard wall, above bunk ────────────────
  buildOverheadCabinet(group, 2.5, -1.98);

  // ── Wall-bolted tablet — starboard outer wall, Y=1.4 ─────────────────────
  buildWallTablet(group, 2.5, -0.8, 'datapad-b');

  // ── Lockers against aft wall — one interactive + two decorative ──────────────
  const lockB = buildLockers(2, 0.54, 'lockers-b-deco');
  lockB.group.position.set(0, 0, 2.5);
  group.add(lockB.group);
  for (const c of lockB.colliders) propColliders.push(shiftAABB(c, 0, 0, 2.5));
  const iLockB = buildLockerWithDoor(-0.54, 'locker-b', 'B');
  iLockB.group.position.set(0, 0, 2.5);
  group.add(iLockB.group);
  propColliders.push(shiftAABB(iLockB.collider, 0, 0, 2.5));

  // ── Nightstand — port side of bunk (mirrored vs room A) ───────────────────
  const nsB = buildNightstand();
  nsB.group.position.set(-1.30, 0, -2.0);
  group.add(nsB.group);
  propColliders.push(shiftAABB(nsB.collider, -1.30, 0, -2.0));

  // ── Extra equipment crate (starboard side, differentiator) ────────────────
  const crateGeo = new THREE.BoxGeometry(0.44, 0.38, 0.38);
  const crate    = new THREE.Mesh(crateGeo, matCrateShell);
  crate.position.set(1.30, 0.19, -2.0);
  group.add(crate);
  propColliders.push({
    minX: 1.08,  maxX: 1.52,
    minY: 0,     maxY: 0.40,
    minZ: -2.19, maxZ: -1.81,
  });

  // ── Hanging hooks on inner (port) wall ───────────────────────────────────
  buildHooks(group, -2.5, 1.5);

  // ── Room-B: framed picture on inner wall ──────────────────────────────────
  buildFramedPicture(group, -2.5, -0.5);

  // ── Room-B: teal potted plant on nightstand side ──────────────────────────
  buildPottedPlant(group, -1.65, -1.50);

  // ── Room-B: fold-down desk on aft portion of starboard wall ───────────────
  // Starboard outer wall = X=+2.5. Porthole is at Z=0, cabinet at Z≈-1.98.
  // Desk placed at Z=+1.5 (aft end, clear of porthole and cabinet).
  const deskCollider = buildFoldDownDesk(group, 2.5, 1.5);
  propColliders.push(deskCollider);
  buildDeskWallDressing(group, 2.5, 1.5);

  // ── Light switch plate near door ──────────────────────────────────────────
  buildLightSwitchPlate(group, -2.5, 0.9);

  // ── Bunk interactable — "Sleep" ────────────────────────────────────────────
  const bunkBInteractable: Interactable = {
    id: 'bunk-b',
    prompt: 'Sleep',
    radius: 2.5,
    position: new THREE.Vector3(0, 0.84, -1.98), // updated to world space in assembly
    onInteract: () => {
      void fadeTransition(() => {
        advanceShipClock(480); // 8 ship-hours = 480 ship-minutes
        setEnergy(100);
        restockFridge();
      });
    },
  };

  // ── Locker interactable (locker-b) ────────────────────────────────────────
  let _lockerBOpen = false;
  const lockerBTween = iLockB.tween;
  const lockerBInteractable: Interactable = {
    id: 'locker-b',
    prompt: 'Open Locker',
    radius: 1.8,
    position: new THREE.Vector3(-0.54, 0.93, 2.5), // updated in assembly
    getPrompt(): string { return _lockerBOpen ? 'Close Locker' : 'Open Locker'; },
    onInteract(_ctx: InteractContext): void {
      _lockerBOpen = !_lockerBOpen;
      playOneShot('door');
      lockerBTween.start(_lockerBOpen ? 0 : 1, _lockerBOpen ? 1 : 0);
    },
  };

  // ── Camera: doorway (port wall), looking straight across to starboard ──────
  const camPos  = new THREE.Vector3(-2.1, 1.65,  0.0);
  const camLook = new THREE.Vector3( 2.1, 1.45,  0.0);

  // v0.9 A1 defrag: merge static same-material sibling meshes into fewer
  // draw calls. Zero visual/functional change — see staticMerge.ts.
  mergeStaticSiblings(group);

  return {
    group,
    colliders: [...colliders, ...propColliders],
    interactables: [bunkBInteractable, lockerBInteractable],
    cameras: [{ name: 'quarters-b', position: camPos, lookAt: camLook }],
  };
}
