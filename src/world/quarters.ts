/**
 * Crew quarters rooms — Phase 3b prop dressing.
 * Builds both quarters-a (port) and quarters-b (starboard).
 * Each room: 5W × 3H × 5D, porthole in outer wall, door in inner wall.
 *
 * Props per room:
 *   - Bunk against fore wall (mesh.name = 'bunk' for Phase 4 Sleep hook)
 *   - 2 lockers (A) / 3 lockers (B) against aft wall
 *   - Nightstand beside bunk head
 *
 * Differences A vs B:
 *   - A: deep-red blanket, 2 lockers, nightstand on starboard side of bunk
 *   - B: orange blanket, 3 lockers, nightstand on port side of bunk (mirrored)
 *   - B: extra equipment crate on starboard side
 */
import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule, AABB, Interactable } from './types.js';
import {
  buildBunk,
  buildLockers,
  buildNightstand,
  matBlanketA,
  matBlanketB,
} from './quartersProps.js';
import { advanceShipClock, setEnergy } from '../core/state.js';
import { fadeTransition } from '../ui/hud.js';

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
  // Bunk group local: fore-side rail at Z = -0.46. Placed so that rail sits at
  // Z = -2.44 in room space → group.position.z = -2.44 + 0.46 = -1.98.
  const bunkA = buildBunk(matBlanketA);
  bunkA.group.position.set(0, 0, -1.98);
  group.add(bunkA.group);
  propColliders.push(shiftAABB(bunkA.collider, 0, 0, -1.98));

  // ── Lockers against aft wall ───────────────────────────────────────────────
  // Locker group: back at Z=0 → placed at z=+2.5 (aft wall), face at Z=-0.35.
  // 2 lockers centred at X=0, step=0.54 → centres at X=±0.27.
  const lockA = buildLockers(2, 0);
  lockA.group.position.set(0, 0, 2.5);
  group.add(lockA.group);
  for (const c of lockA.colliders) {
    propColliders.push(shiftAABB(c, 0, 0, 2.5));
  }

  // ── Nightstand beside bunk head (head=-Z side), starboard side ────────────
  // Nightstand at X=+1.30 (starboard of bunk centre), Z=-2.00.
  const nsA = buildNightstand();
  nsA.group.position.set(1.30, 0, -2.0);
  group.add(nsA.group);
  propColliders.push(shiftAABB(nsA.collider, 1.30, 0, -2.0));

  // ── Bunk interactable — "Sleep" ────────────────────────────────────────────
  // World position set later by assembly.ts; we use a placeholder here and
  // assembly will translateInteractable positions when it offsets the group.
  // Bunk world-local centre: x=0, y=0.84, z=-1.98 (group origin).
  const bunkAInteractable: Interactable = {
    id: 'bunk-a',
    prompt: 'Sleep',
    radius: 2.5,
    position: new THREE.Vector3(0, 0.84, -1.98), // updated to world space in assembly
    onInteract: () => {
      void fadeTransition(() => {
        advanceShipClock(480); // 8 ship-hours = 480 ship-minutes
        setEnergy(100);
      });
    },
  };

  // ── Camera: doorway (starboard wall), looking straight across to port ──────
  // "Entering the room" perspective. Bunk fore-left, lockers aft-right,
  // porthole on the far port wall, teal strips on floor, ceiling panels above.
  const camPos  = new THREE.Vector3( 2.1, 1.65,  0.0);
  const camLook = new THREE.Vector3(-2.1, 1.45,  0.0);

  return {
    group,
    colliders: [...colliders, ...propColliders],
    interactables: [bunkAInteractable],
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

  // ── Bunk against fore wall — same position, orange blanket ────────────────
  const bunkB = buildBunk(matBlanketB);
  bunkB.group.position.set(0, 0, -1.98);
  group.add(bunkB.group);
  propColliders.push(shiftAABB(bunkB.collider, 0, 0, -1.98));

  // ── Lockers against aft wall — 3 lockers ──────────────────────────────────
  // step=0.54, 3 lockers → centres at X=-0.54, 0, +0.54
  const lockB = buildLockers(3, 0);
  lockB.group.position.set(0, 0, 2.5);
  group.add(lockB.group);
  for (const c of lockB.colliders) {
    propColliders.push(shiftAABB(c, 0, 0, 2.5));
  }

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
      });
    },
  };

  // ── Camera: doorway (port wall), looking straight across to starboard ──────
  const camPos  = new THREE.Vector3(-2.1, 1.65,  0.0);
  const camLook = new THREE.Vector3( 2.1, 1.45,  0.0);

  return {
    group,
    colliders: [...colliders, ...propColliders],
    interactables: [bunkBInteractable],
    cameras: [{ name: 'quarters-b', position: camPos, lookAt: camLook }],
  };
}
