import * as THREE from 'three';
import { initPerf, recordFrame, installPerfGlobal } from './core/perf.js';
import {
  getRegisteredCamNames,
  installCameraGlobal,
  setActiveCamera,
  teleportToCamera,
} from './core/cameras.js';
import { tickState, getState, loadState } from './core/state.js';
import { initDebug, tickDebug } from './ui/debug.js';
import { initHud, tickHud, showRoomToast } from './ui/hud.js';
import { assembleShip } from './world/assembly.js';
import { initController, tickController, isMoving, tickBob } from './player/controller.js';
import { initInteract, registerInteractables, tickInteract, headlessInteract } from './player/interact.js';
import { tickSway } from './fx/sway.js';
import { initAudio, getRoomForPosition, playOneShot } from './fx/audio.js';
import type { RoomName } from './fx/audio.js';
import { buildAllInteractables } from './world/interactWiring.js';
import { isDoorOpen } from './world/doors.js';
import { initBloom } from './fx/bloom.js';
import { tickStarfield } from './fx/starfield.js';

// ── Renderer ──────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ── Scene / Camera ────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0b10);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000, // Extended far plane to see starfield at radius 800
);

// ── Global hook installs ──────────────────────────────────────────────────────
installPerfGlobal();
installCameraGlobal();
setActiveCamera(camera);
initPerf(renderer);
initDebug(renderer, camera);
initHud();

// ── Load persisted state if available ────────────────────────────────────────
loadState();

// ── Audio (Phase 5) ───────────────────────────────────────────────────────────
// initAudio attaches gesture listeners; the AudioContext starts suspended and
// only resumes on the first user click/keydown. Safe if audio is blocked.
const audio = initAudio();

// ── Assemble ship ─────────────────────────────────────────────────────────────
const ship = assembleShip(scene);

// ── Bloom (Phase 5, optional) ─────────────────────────────────────────────────
// ?bloom=0 disables it. Falls back to renderer.render() when off.
const bloom = initBloom(renderer, scene, camera);

// ── Player controller ─────────────────────────────────────────────────────────
initController(camera, renderer, ship.colliders);

// ── Interaction system ────────────────────────────────────────────────────────
initInteract(camera, scene);

// Wire one-shot SFX into existing interactable callbacks without touching world files.
// Wrap onInteract for 'stove' (eat) and 'bunk-*' (sleep/ui confirm).
for (const ia of ship.interactables) {
  const originalOnInteract = ia.onInteract.bind(ia);
  if (ia.id === 'stove') {
    ia.onInteract = (ctx) => {
      playOneShot('eat');
      originalOnInteract(ctx);
    };
  } else if (ia.id === 'bunk-a' || ia.id === 'bunk-b') {
    ia.onInteract = (ctx) => {
      playOneShot('ui');
      originalOnInteract(ctx);
    };
  }
}

registerInteractables(ship.interactables);

// Register all v0.2 interactables (doors, seats, console, lore, items, save)
// doorRecords are populated by buildDoors() inside assembleShip(), so this is safe.
const v02Interactables = buildAllInteractables();
registerInteractables(v02Interactables);

// ── Start at corridor camera ──────────────────────────────────────────────────
const camNames = getRegisteredCamNames();
(window as unknown as Record<string, unknown>)['__camNames'] = camNames;

const startCam = camNames.includes('corridor') ? 'corridor' : camNames[0];
if (startCam) {
  teleportToCamera(startCam);
}

// ── Resize ────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  bloom.resize(window.innerWidth, window.innerHeight);
});

// ── __ready promise ───────────────────────────────────────────────────────────
let readyResolve: () => void;
const readyPromise = new Promise<void>((res) => { readyResolve = res; });
(window as unknown as Record<string, unknown>)['__ready'] = readyPromise;

// ── Start time for elapsed-based animations ───────────────────────────────────
const startTime = performance.now();

// ── window.__test — functional test hooks ────────────────────────────────────
interface TestAPI {
  teleport(x: number, y: number, z: number): void;
  interact(): boolean;
  getState(): { clock: number; energy: number; hunger: number; clockString: string };
  getDoorOpen(id: string): boolean;
}

const EYE_HEIGHT_MAIN = 1.7;

const testAPI: TestAPI = {
  teleport(x: number, y: number, z: number): void {
    camera.position.set(x, EYE_HEIGHT_MAIN, z);
    // Allow explicit Y override when y significantly differs from eye height
    if (Math.abs(y - EYE_HEIGHT_MAIN) > 0.5) camera.position.y = y;
  },
  interact(): boolean {
    return headlessInteract();
  },
  getState(): { clock: number; energy: number; hunger: number; clockString: string } {
    const s = getState();
    return {
      clock: s.shipMinutes,
      energy: s.energy,
      hunger: s.hunger,
      clockString: `${String(Math.floor(s.shipMinutes / 60) % 24).padStart(2, '0')}:${String(Math.floor(s.shipMinutes) % 60).padStart(2, '0')}`,
    };
  },
  getDoorOpen(id: string): boolean {
    return isDoorOpen(id);
  },
};

(window as unknown as Record<string, unknown>)['__test'] = testAPI;

// ── Room tracking for ambient crossfade + toast ───────────────────────────────
let lastRoom: RoomName = 'corridor';

const ROOM_LABELS: Record<RoomName, string> = {
  cockpit:     'COCKPIT',
  corridor:    'CORRIDOR',
  quarters:    'CREW QUARTERS',
  galley:      'GALLEY',
  engineering: 'ENGINEERING',
  cargo:       'CARGO',
};

// ── Render loop ───────────────────────────────────────────────────────────────
let firstFrame = true;
let lastFrameTime = performance.now();

// With the bloom EffectComposer, each pass resets renderer.info, so perf
// sampling would only see the final fullscreen quad (1 draw call). Accumulate
// across the whole frame instead and reset manually at frame start.
renderer.info.autoReset = false;

function animate(now: number): void {
  requestAnimationFrame(animate);
  renderer.info.reset();
  recordFrame(now);

  const dtSeconds = Math.min((now - lastFrameTime) / 1000, 0.05);
  lastFrameTime = now;

  const elapsed = (now - startTime) / 1000;

  tickController(now);

  // Head-bob applied after collision resolution in tickController
  tickBob(camera, elapsed, isMoving());

  tickState(dtSeconds);
  tickInteract();
  tickSway(camera, elapsed);
  ship.planet.tick(elapsed);
  tickStarfield(ship.starfield, elapsed);
  tickDebug(now);
  audio.tick(isMoving());

  // Room ambient crossfade + toast on room change
  const currentRoom = getRoomForPosition(camera.position.x, camera.position.z);
  if (currentRoom !== lastRoom) {
    audio.setRoom(currentRoom);
    showRoomToast(ROOM_LABELS[currentRoom]);
    lastRoom = currentRoom;
  }

  const s = getState();
  tickHud(s.shipMinutes, s.energy, s.hunger);

  bloom.render();
  if (firstFrame) {
    firstFrame = false;
    readyResolve();
  }
}

requestAnimationFrame(animate);
