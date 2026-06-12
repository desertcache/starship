/**
 * Crew quarters rooms — Phase 3b / v0.2 fill pass.
 * Builds both quarters-a (port) and quarters-b (starboard).
 * Each room: 5W × 3H × 5D, porthole in outer wall, door in inner wall.
 *
 * Props per room:
 *   - Bunk against fore wall (mesh.name = 'bunk' for Phase 4 Sleep hook)
 *   - 2 lockers (A) / 3 lockers (B) against aft wall — named lockers-a / lockers-b
 *   - Nightstand beside bunk head — named datapad-a / datapad-b
 *   - Bunk surround (gunmetal jambs + sill + teal reading strip)
 *   - Porthole reveal (gunmetal tube + orange rim + cream sill)
 *   - Overhead storage cabinet (3 orange handle nubs)
 *   - Wall-bolted tablet (teal emissive screen)
 *   - 3 hanging hooks + coat shape
 *   - Light switch plate near door (integration task placeholder)
 *
 * Room-A (port) — tool/maintenance vibe:
 *   - Extra gunmetal toolboard 1.0×0.7 with 5 hung-tool silhouettes
 *
 * Room-B (starboard) — personal vibe:
 *   - Framed picture decal
 *   - Teal potted-plant cylinder
 */
import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule, AABB, Interactable, InteractContext } from './types.js';
import {
  buildBunk,
  buildLockers,
  buildLockerWithDoor,
  buildNightstand,
  matBlanketA,
  matBlanketB,
} from './quartersProps.js';
import {
  buildBunkSurround,
  buildPortholeReveal,
  buildOverheadCabinet,
  buildWallTablet,
  buildHooks,
  buildToolboard,
  buildFramedPicture,
  buildPottedPlant,
  buildLightSwitchPlate,
} from './quartersDressing.js';
import { buildFoldDownDesk, buildDeskWallDressing } from './quartersRightWall.js';
import { advanceShipClock, setEnergy } from '../core/state.js';
import { fadeTransition } from '../ui/hud.js';
import { restockFridge } from './interactItems.js';
import { playOneShot } from '../fx/audio.js';

// ── Room constants ─────────────────────────────────────────────────────────────

const W = 5;   // width  (+X = starboard, -X = port)
const H = 3;   // height
const D = 5;   // depth  (-Z = fore, +Z = aft)

// ── Helper: translate local AABB by a room-space offset ───────────────────────

function shiftAABB(aabb: AABB, dx: number, dy: number, dz: number): AABB {
  return {
    minX: aabb.minX + dx, maxX: aabb.maxX + dx,
    minY: aabb.minY + dy, maxY: aabb.maxY + dy,
    minZ: aabb.minZ + dz, maxZ: aabb.maxZ + dz,
  };
}

// ── Port quarter (quarters-a) ──────────────────────────────────────────────────

export function buildQuartersA(): RoomModule {
  // Port side:  outer wall = port  (X = -2.5), porthole there.
  //             inner wall = starboard (X = +2.5), door to corridor.
  const { group, colliders } = buildRoom({
    width: W, height: H, depth: D,
    doors: [
      { wall: 'starboard', gapW: 1.4, gapH: 2.2, offset: 0 },
    ],
    windows: [
      { wall: 'port', w: 1.0, h: 0.8, yBot: 1.2, offset: 0 },
    ],
  });

  group.name = 'quarters-a';

  const propColliders: AABB[] = [];

  // ── Bunk against fore wall ─────────────────────────────────────────────────
  const bunkA = buildBunk(matBlanketA);
  bunkA.group.position.set(0, 0, -1.98);
  group.add(bunkA.group);
  propColliders.push(shiftAABB(bunkA.collider, 0, 0, -1.98));

  // ── Bunk surround (jambs + header + sill + reading light) ─────────────────
  // Bunk group at Z=-1.98, bunk extends X: -1.0..+1.0, head at Z=-1.98-0.46=-2.44
  buildBunkSurround(group, 0, -1.98);

  // ── Porthole reveal — outer (port) wall at X = -2.5 ──────────────────────
  buildPortholeReveal(group, -2.5);

  // ── Overhead storage cabinet — port wall, above bunk ─────────────────────
  buildOverheadCabinet(group, -2.5, -1.98);

  // ── Wall-bolted tablet — port outer wall, beside bunk, Y=1.4 ─────────────
  buildWallTablet(group, -2.5, -0.8, 'datapad-a');

  // ── Lockers against aft wall — one interactive + one decorative ──────────────
  // Decorative locker (offset +0.27 from center)
  const lockA = buildLockers(2, 0.27, 'lockers-a-deco');
  lockA.group.position.set(0, 0, 2.5);
  group.add(lockA.group);
  for (const c of lockA.colliders) propColliders.push(shiftAABB(c, 0, 0, 2.5));
  // Interactive locker (offset -0.27 from center)
  const iLockA = buildLockerWithDoor(-0.27, 'locker-a', 'A');
  iLockA.group.position.set(0, 0, 2.5);
  group.add(iLockA.group);
  propColliders.push(shiftAABB(iLockA.collider, 0, 0, 2.5));

  // ── Nightstand beside bunk head (starboard side) ──────────────────────────
  const nsA = buildNightstand();
  nsA.group.position.set(1.30, 0, -2.0);
  group.add(nsA.group);
  propColliders.push(shiftAABB(nsA.collider, 1.30, 0, -2.0));

  // ── Hanging hooks on inner (starboard) wall ───────────────────────────────
  buildHooks(group, 2.5, 1.5);

  // ── Room-A toolboard on inner (starboard) wall ────────────────────────────
  buildToolboard(group, 2.5, -0.8);

  // ── Light switch plate near door ──────────────────────────────────────────
  buildLightSwitchPlate(group, 2.5, 0.9);

  // ── Bunk interactable — "Sleep" ────────────────────────────────────────────
  const bunkAInteractable: Interactable = {
    id: 'bunk-a',
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

  // ── Locker interactable (locker-a, world space added in assembly) ────────────
  let _lockerAOpen = false;
  const lockerATween = iLockA.tween;
  const lockerAInteractable: Interactable = {
    id: 'locker-a',
    prompt: 'Open Locker',
    radius: 1.8,
    position: new THREE.Vector3(-0.27, 0.93, 2.5), // updated in assembly
    getPrompt(): string { return _lockerAOpen ? 'Close Locker' : 'Open Locker'; },
    onInteract(_ctx: InteractContext): void {
      _lockerAOpen = !_lockerAOpen;
      playOneShot('door');
      lockerATween.start(_lockerAOpen ? 0 : 1, _lockerAOpen ? 1 : 0);
    },
  };

  // ── Camera: doorway (starboard wall), looking straight across to port ──────
  const camPos  = new THREE.Vector3( 2.1, 1.65,  0.0);
  const camLook = new THREE.Vector3(-2.1, 1.45,  0.0);

  return {
    group,
    colliders: [...colliders, ...propColliders],
    interactables: [bunkAInteractable, lockerAInteractable],
    cameras: [{ name: 'quarters-a', position: camPos, lookAt: camLook }],
  };
}

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
  const crateMat = new THREE.MeshLambertMaterial({ color: 0x252830 });
  const crate    = new THREE.Mesh(crateGeo, crateMat);
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

  return {
    group,
    colliders: [...colliders, ...propColliders],
    interactables: [bunkBInteractable, lockerBInteractable],
    cameras: [{ name: 'quarters-b', position: camPos, lookAt: camLook }],
  };
}
