/** Sliding door slabs; all start open with live colliders. */

import * as THREE from 'three';
import type { AABB } from './types.js';
import { playOneShot } from '../fx/audio.js';

// ── Constants ──────────────────────────────────────────────────────────────────

const SLAB_W  = 1.34;
const SLAB_H  = 2.08;
const SLAB_D  = 0.07;
const SEAM_W  = 0.04;
const SEAM_H  = 2.00;
const SEAM_D  = 0.075; // 0.002m proud of slab face (0.035 + 0.040 = 0.075)
const PIP_R   = 0.025;
const PIP_LOC_X = 0.55;
const PIP_LOC_Y = 0.95;
const PIP_LOC_Z = 0.04;

const OPEN_TRAVEL_Y  = 2.15; // slab rides up this much when open
const ANIM_DURATION  = 0.480; // seconds

const COL_GUNMETAL = 0x1C1E22;
const COL_ORANGE   = 0xC7641E;
const COL_TEAL     = 0x46E0D8;

// Lazy singleton materials
let _matSlab: THREE.MeshLambertMaterial | null = null;
const matSlab = (): THREE.MeshLambertMaterial =>
  _matSlab ?? (_matSlab = new THREE.MeshLambertMaterial({ color: COL_GUNMETAL }));

let _matSeam: THREE.MeshLambertMaterial | null = null;
const matSeam = (): THREE.MeshLambertMaterial =>
  _matSeam ?? (_matSeam = new THREE.MeshLambertMaterial({ color: COL_ORANGE }));

let _matPip: THREE.MeshBasicMaterial | null = null;
const matPip = (): THREE.MeshBasicMaterial =>
  _matPip ?? (_matPip = new THREE.MeshBasicMaterial({ color: COL_TEAL }));

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DoorEntry {
  /** Unique string id for this door (e.g. 'cockpit-aft'). */
  id: string;
  /** Closed slab base position in world space. */
  position: THREE.Vector3;
  /** Doorway orientation. */
  facing: 'Z' | 'X';
}

interface DoorRecord {
  id: string;
  mesh: THREE.Group;
  /** Y of slab center when CLOSED (slab parked down). */
  pivotY: number;
  /** AABB collider (world-space). Only active when closed. */
  collider: AABB;
  open: boolean;
  animT: number;   // 0=fully closed, 1=fully open
  animDir: number; // +1=opening, -1=closing, 0=idle
  /** performance.now() timestamp when the door last became open (animT reached 1). */
  openedAt: number;
  /** True once the player has manually interacted — enables auto-close timer. */
  autoCloseArmed: boolean;
  /** World XZ of the door slab center (captured at build; closed position). */
  worldX: number;
  worldZ: number;
}

export const doorRecords: DoorRecord[] = [];

// ── Player position threading (set from interact.ts each frame) ────────────────

let _playerPos: THREE.Vector3 = new THREE.Vector3(0, 1.7, -19);

/** Player position used by door auto-close checks. */

export function setPlayerPosForDoors(p: THREE.Vector3): void {
  _playerPos.copy(p);
}

/** Arm a door's auto-close timer after manual interaction. */

export function armDoorAutoClose(id: string): void {
  const rec = doorRecords.find((r) => r.id === id);
  if (rec) rec.autoCloseArmed = true;
}

// ── Helper: easeInOutQuad ──────────────────────────────────────────────────────

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/** Set door state; the slab and collider move on the next tick. */

export function setDoorOpen(id: string, open: boolean): void {
  const rec = doorRecords.find((r) => r.id === id);
  if (!rec) return;
  if (rec.open === open) return;
  rec.open   = open;
  rec.animDir = open ? 1 : -1;
}

/** Query whether a door is open or opening. */

export function isDoorOpen(id: string): boolean {
  const rec = doorRecords.find((r) => r.id === id);
  return rec ? rec.open : false;
}

/** Advance door animation and auto-close checks by dt seconds. */

export function tickDoors(dt: number): void {
  const now = performance.now();

  for (const rec of doorRecords) {
    // ── Animation step ─────────────────────────────────────────────────────────
    if (rec.animDir !== 0) {
      rec.animT += rec.animDir * (dt / ANIM_DURATION);
      rec.animT = Math.max(0, Math.min(1, rec.animT));

      if (rec.animT >= 1) {
        rec.animDir = 0;
        // Record when door finished opening
        if (rec.open) rec.openedAt = performance.now();
      } else if (rec.animT <= 0) {
        rec.animDir = 0;
      }

      const eased = easeInOutQuad(rec.animT);
      rec.mesh.position.y = rec.pivotY + eased * OPEN_TRAVEL_Y;

      // v1.2.1: track the slab's live Y so the shared collider (pushed into
      // the ship's collider array by reference, assembly.ts) only blocks
      // while the slab actually overlaps the controller's 0.1-1.9 body band.
      rec.collider.minY = rec.mesh.position.y;
      rec.collider.maxY = rec.mesh.position.y + SLAB_H;
    }

    // ── Auto-close check ───────────────────────────────────────────────────────
    // Only for armed doors that are fully open and idle
    if (
      rec.autoCloseArmed &&
      rec.open &&
      rec.animDir === 0 &&
      rec.animT >= 1
    ) {
      const elapsed = now - rec.openedAt;
      if (elapsed > 8000) {
        const dx = _playerPos.x - rec.worldX;
        const dz = _playerPos.z - rec.worldZ;
        const distSq = dx * dx + dz * dz;
        if (distSq > 9.0) { // 3.0^2
          setDoorOpen(rec.id, false);
          playOneShot('door-auto');
        }
      }
    }
  }
}

/** Test hook: expire a door dwell timer for the next real tick. */

export function debugExpireDoorDwell(id: string): void {
  const rec = doorRecords.find((r) => r.id === id);
  if (rec) rec.openedAt = performance.now() - 8001;
}

/** Test cleanup: disarm auto-close on an already-open door. */

export function disarmDoorAutoCloseForTest(id: string): void {
  const rec = doorRecords.find((r) => r.id === id);
  if (rec && rec.open) {
    rec.autoCloseArmed = false;
    rec.openedAt = performance.now();
  }
}

/** Test hook: a door's live world-space slab Y — proves it actually moves. */
export function getDoorSlabY(id: string): number | null {
  const rec = doorRecords.find((r) => r.id === id);
  return rec ? rec.mesh.position.y : null;
}

/** Test hook: current live collider bounds. */

export function getDoorColliderBounds(id: string): { minY: number; maxY: number } | null {
  const rec = doorRecords.find((r) => r.id === id);
  return rec ? { minY: rec.collider.minY, maxY: rec.collider.maxY } : null;
}

/** Test-only synchronous fast-forward for deterministic slide settling. */

export function tickDoorsN(times: number, dtMs: number): void {
  const dt = dtMs / 1000;
  for (let i = 0; i < times; i++) tickDoors(dt);
}

// ── Build ──────────────────────────────────────────────────────────────────────

/** Build the door slabs; they start open and return 18 draw calls. */

export function buildDoors(scene: THREE.Scene, specs: DoorEntry[]): void {
  for (const spec of specs) {
    const pivotY = spec.position.y; // Y of slab group origin = slab bottom edge

    // The door group pivots at the slab's floor position
    const grp = new THREE.Group();
    grp.name = `door-${spec.id}`;

    // v1.2.1 (ultrareview r3 P1): the real E key resolves by walking mesh
    // ancestors for name === interactable.id, and interactWiring.ts registers
    // this door under `spec.id`, not `door-${id}` — so no door was ever
    // E-reachable. This nested group (named spec.id) holds every hittable
    // part; the outer `door-${id}` name is kept (nothing looks doors up by
    // it — verified by grep).
    const hitGroup = new THREE.Group();
    hitGroup.name = spec.id;
    grp.add(hitGroup);

    // Slab — centre at local (0, SLAB_H/2, 0)
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(
        spec.facing === 'Z' ? SLAB_W : SLAB_D,
        SLAB_H,
        spec.facing === 'Z' ? SLAB_D : SLAB_W,
      ),
      matSlab(),
    );
    slab.position.y = SLAB_H / 2;
    hitGroup.add(slab);

    // Center seam strip (0.04 x 2.0 x 0.075) proud of slab face
    const seam = new THREE.Mesh(
      new THREE.BoxGeometry(
        spec.facing === 'Z' ? SEAM_W : SEAM_D,
        SEAM_H,
        spec.facing === 'Z' ? SEAM_D : SEAM_W,
      ),
      matSeam(),
    );
    seam.position.y = SEAM_H / 2;
    hitGroup.add(seam);

    // Status pip — sphere at slab-local (0.55, 0.95, 0.04) for Z-facing doors
    const pip = new THREE.Mesh(
      new THREE.SphereGeometry(PIP_R, 8, 6),
      matPip(),
    );
    if (spec.facing === 'Z') {
      pip.position.set(PIP_LOC_X, PIP_LOC_Y, PIP_LOC_Z);
    } else {
      // X-facing: pip at slab-local (+Z side of slab)
      pip.position.set(PIP_LOC_Z, PIP_LOC_Y, PIP_LOC_X);
    }
    hitGroup.add(pip);

    // Place group at world position (slab bottom = spec.position.y)
    grp.position.set(spec.position.x, pivotY, spec.position.z);

    // Closed AABB (world-space, thin slab footprint)
    const collider: AABB = spec.facing === 'Z'
      ? {
          minX: spec.position.x - SLAB_W / 2, minY: spec.position.y, minZ: spec.position.z - SLAB_D / 2,
          maxX: spec.position.x + SLAB_W / 2, maxY: spec.position.y + SLAB_H, maxZ: spec.position.z + SLAB_D / 2,
        }
      : {
          minX: spec.position.x - SLAB_D / 2, minY: spec.position.y, minZ: spec.position.z - SLAB_W / 2,
          maxX: spec.position.x + SLAB_D / 2, maxY: spec.position.y + SLAB_H, maxZ: spec.position.z + SLAB_W / 2,
        };

    // Start OPEN — slab parked up. v1.2.1: the collider (pushed into the
    // ship's shared array by reference, assembly.ts) must reflect this OPEN
    // pose now, not the closed footprint above, or a fresh ship would have
    // every door blocking before tickDoors ever runs.
    const animT = 1.0;
    grp.position.y = pivotY + easeInOutQuad(animT) * OPEN_TRAVEL_Y;
    collider.minY = grp.position.y;
    collider.maxY = grp.position.y + SLAB_H;

    const record: DoorRecord = {
      id:       spec.id,
      mesh:     grp,
      pivotY,
      collider,
      open:     true,
      animT,
      animDir:  0,
      openedAt:        0,    // not yet opened by player; auto-close not armed
      autoCloseArmed:  false, // armed only after first manual interaction
      worldX:          spec.position.x,
      worldZ:          spec.position.z,
    };
    doorRecords.push(record);
    scene.add(grp);
  }
}
