/**
 * Sliding door slabs for all 6 ship doorways.
 * All doors start OPEN (slab parked up) so functional tests never hit a slab.
 *
 * Palette: gunmetal #1C1E22 slab, orange #C7641E seam strip, teal #46E0D8 status pip.
 * Materials: MeshLambertMaterial for slab (NOT MeshStandard — integration task), MeshBasicMaterial for pip.
 */
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
  /**
   * World-space position of the slab centre when CLOSED (slab bottom at Y=0).
   * Y here = slab vertical centre (0 + SLAB_H/2 = 1.04 for floor-mounted slabs).
   */
  position: THREE.Vector3;
  /**
   * Orientation: 'Z' = slab faces Z axis (fore/aft doors),
   *              'X' = slab faces X axis (side/branch doors).
   */
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

// Module-level registry so the post-merge integration agent can wire E-interaction
export const doorRecords: DoorRecord[] = [];

// ── Player position threading (set from interact.ts each frame) ────────────────

let _playerPos: THREE.Vector3 = new THREE.Vector3(0, 1.7, -19);

/**
 * Store the player's current world-space position for auto-close logic.
 * Called each frame from tickInteract() in interact.ts.
 */
export function setPlayerPosForDoors(p: THREE.Vector3): void {
  _playerPos.copy(p);
}

/**
 * Arm auto-close on a door after the player has manually interacted with it.
 * Called from interactWiring.ts door onInteract after toggling.
 */
export function armDoorAutoClose(id: string): void {
  const rec = doorRecords.find((r) => r.id === id);
  if (rec) rec.autoCloseArmed = true;
}

// ── Helper: easeInOutQuad ──────────────────────────────────────────────────────

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Set a door open or closed by id.
 * @param id  - door id string
 * @param open - true=open (slab up), false=closed (slab down)
 */
export function setDoorOpen(id: string, open: boolean): void {
  const rec = doorRecords.find((r) => r.id === id);
  if (!rec) return;
  if (rec.open === open) return;
  rec.open   = open;
  rec.animDir = open ? 1 : -1;
}

/**
 * Query whether a door is open (or in the process of opening).
 */
export function isDoorOpen(id: string): boolean {
  const rec = doorRecords.find((r) => r.id === id);
  return rec ? rec.open : false;
}

/**
 * Per-frame tick. Call from assembly animate loop.
 * @param dt - delta time in seconds
 */
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

/**
 * Test hook: run the auto-close check immediately, with the 8s dwell timer
 * overridden so it fires this frame. Any armed, fully-open door whose player
 * distance exceeds the 3m threshold is closed at once. Mirrors the production
 * logic in tickDoors() minus the elapsed-time gate. Returns the ids it closed.
 */
export function forceDoorAutoCloseCheck(): string[] {
  const closed: string[] = [];
  for (const rec of doorRecords) {
    // Fully-open + armed is the trigger condition. We intentionally do NOT
    // require animDir===0 (as tickDoors does): animT>=1 already means the slab
    // is visually open, and the reset-to-idle frame may not have run yet when
    // the camera-facing dummy that drives tickDoors is frustum-culled.
    if (!(rec.autoCloseArmed && rec.open && rec.animT >= 1)) continue;
    const dx = _playerPos.x - rec.worldX;
    const dz = _playerPos.z - rec.worldZ;
    if (dx * dx + dz * dz > 9.0) { // 3.0^2
      setDoorOpen(rec.id, false);
      playOneShot('door-auto');
      closed.push(rec.id);
    }
  }
  return closed;
}

/**
 * Get the active collider list for closed doors only.
 * Used by assembly to provide to the player controller.
 */
export function getClosedDoorColliders(): AABB[] {
  return doorRecords.filter((r) => r.animT < 0.05).map((r) => r.collider);
}

// ── Build ──────────────────────────────────────────────────────────────────────

/**
 * Build all 6 door slabs and add them to the scene.
 * All doors start OPEN (animT=1, slab parked up).
 * Returns 18 draw calls: 6 slabs + 6 seams + 6 pips.
 */
export function buildDoors(scene: THREE.Scene, specs: DoorEntry[]): void {
  for (const spec of specs) {
    const pivotY = spec.position.y; // Y of slab group origin = slab bottom edge

    // The door group pivots at the slab's floor position
    const grp = new THREE.Group();
    grp.name = `door-${spec.id}`;

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
    grp.add(slab);

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
    grp.add(seam);

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
    grp.add(pip);

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

    // Start OPEN — slab parked up, collider cleared
    const animT = 1.0;
    grp.position.y = pivotY + easeInOutQuad(animT) * OPEN_TRAVEL_Y;

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
