import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import type { AABB } from '../world/types.js';

const EYE_HEIGHT = 1.7;
const WALK_SPEED = 3.5; // m/s
const CAPSULE_RADIUS = 0.3;
const FLOOR_Y = EYE_HEIGHT; // camera Y when standing on deck

interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

const keys: KeyState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

let controls: PointerLockControls | null = null;
let colliders: AABB[] = [];
let lastTime = performance.now();

function onKeyDown(e: KeyboardEvent): void {
  switch (e.code) {
    case 'KeyW': case 'ArrowUp':    keys.forward   = true; break;
    case 'KeyS': case 'ArrowDown':  keys.backward  = true; break;
    case 'KeyA': case 'ArrowLeft':  keys.left      = true; break;
    case 'KeyD': case 'ArrowRight': keys.right     = true; break;
  }
}

function onKeyUp(e: KeyboardEvent): void {
  switch (e.code) {
    case 'KeyW': case 'ArrowUp':    keys.forward   = false; break;
    case 'KeyS': case 'ArrowDown':  keys.backward  = false; break;
    case 'KeyA': case 'ArrowLeft':  keys.left      = false; break;
    case 'KeyD': case 'ArrowRight': keys.right     = false; break;
  }
}

/**
 * Check if a point (treated as a capsule base in XZ) collides with any AABB.
 * We test a cylinder footprint: the camera XZ position ± CAPSULE_RADIUS.
 */
function collidesAABB(x: number, z: number, aabb: AABB): boolean {
  // Camera Y is fixed at EYE_HEIGHT; body occupies Y 0..2.0
  const bodyMinY = 0.1;
  const bodyMaxY = 1.9;
  if (bodyMinY > aabb.maxY || bodyMaxY < aabb.minY) return false;

  const closestX = Math.max(aabb.minX, Math.min(x, aabb.maxX));
  const closestZ = Math.max(aabb.minZ, Math.min(z, aabb.maxZ));
  const dx = x - closestX;
  const dz = z - closestZ;
  return dx * dx + dz * dz < CAPSULE_RADIUS * CAPSULE_RADIUS;
}

function tryMove(pos: THREE.Vector3, dx: number, dz: number): void {
  // Try full move
  const nx = pos.x + dx;
  const nz = pos.z + dz;
  let blocked = false;
  for (const aabb of colliders) {
    if (collidesAABB(nx, nz, aabb)) { blocked = true; break; }
  }
  if (!blocked) {
    pos.x = nx;
    pos.z = nz;
    return;
  }

  // Try X only
  let blockedX = false;
  for (const aabb of colliders) {
    if (collidesAABB(nx, pos.z, aabb)) { blockedX = true; break; }
  }
  if (!blockedX) { pos.x = nx; return; }

  // Try Z only
  let blockedZ = false;
  for (const aabb of colliders) {
    if (collidesAABB(pos.x, nz, aabb)) { blockedZ = true; break; }
  }
  if (!blockedZ) { pos.z = nz; }
}

export function initController(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  shipColliders: AABB[],
): PointerLockControls {
  colliders = shipColliders;

  controls = new PointerLockControls(camera, renderer.domElement);
  camera.position.set(0, FLOOR_Y, -19); // Start in cockpit

  renderer.domElement.addEventListener('click', () => {
    controls?.lock();
  });

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  lastTime = performance.now();
  return controls;
}

/** True while the player is actively pressing a movement key AND is locked. */
let _isMoving = false;

/** Returns true when the player is walking this frame (pointer-locked + key held). */
export function isMoving(): boolean {
  return _isMoving;
}

export function tickController(now: number): void {
  if (!controls) return;

  const dt = Math.min((now - lastTime) / 1000, 0.05); // cap dt at 50ms
  lastTime = now;

  if (!controls.isLocked) {
    _isMoving = false;
    return;
  }

  const camera = controls.camera as THREE.PerspectiveCamera;
  const move = new THREE.Vector3();

  if (keys.forward)  move.z -= 1;
  if (keys.backward) move.z += 1;
  if (keys.left)     move.x -= 1;
  if (keys.right)    move.x += 1;

  _isMoving = move.lengthSq() > 0;

  if (_isMoving) {
    move.normalize().multiplyScalar(WALK_SPEED * dt);
    move.applyEuler(new THREE.Euler(0, camera.rotation.y, 0, 'YXZ'));
    tryMove(camera.position, move.x, move.z);
  }

  // Clamp Y to floor
  camera.position.y = FLOOR_Y;
}
