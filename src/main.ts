import * as THREE from 'three';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { initPerf, recordFrame, installPerfGlobal } from './core/perf.js';
import {
  getRegisteredCamNames,
  installCameraGlobal,
  setActiveCamera,
  teleportToCamera,
} from './core/cameras.js';
import { tickState, getState, loadState, setHunger, getQuestStep } from './core/state.js';
import { initDebug, tickDebug } from './ui/debug.js';
import { initHud, tickHud, showRoomToast } from './ui/hud.js';
import { assembleShip } from './world/assembly.js';
import { initController, tickController, isMoving, tickBob } from './player/controller.js';
import { initInteract, registerInteractables, tickInteract, headlessInteract } from './player/interact.js';
import { tickSway } from './fx/sway.js';
import { initAudio, getRoomForPosition, playOneShot } from './fx/audio.js';
import type { RoomName } from './fx/audio.js';
import { buildAllInteractables, questRevealAndReadPanel } from './world/interactWiring.js';
import { getFridgeStateForTest, resetFridgeForTest, questAdvanceViaBreaker } from './world/interactItems.js';
import { isDoorOpen, forceDoorAutoCloseCheck } from './world/doors.js';
import { initBloom } from './fx/bloom.js';
import { tickStarfield } from './fx/starfield.js';
import { setScanProvider } from './world/interactConsole.js';
import { QUALITY_LOW, SHADOWS_OFF } from './core/perf.js';
import type { ScanData } from './fx/space/types.js';

// ── Renderer ──────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
// Filmic grade: ACES gives deep blacks + rolling highlights, exposure lifts
// interior contrast without blowing emissives.
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// v0.5 Stage 2 (lighting mood): exposure trimmed 1.15 → 1.05 so the darkened
// interior sits low and emissives (toneMapped=false) punch against shadow.
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
// Shadow maps: DEFAULT ON (promoted in v0.5 Stage 3 after headed measurement
// showed negligible cost). Disable with ?quality=low or ?shadows=0 (isolation).
if (!QUALITY_LOW && !SHADOWS_OFF) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}
document.body.appendChild(renderer.domElement);

// ── Scene / Camera ────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0b10);

// ── Environment map (PMREM RoomEnvironment) ───────────────────────────────────
// Bake once, dispose the generator; environmentIntensity 0.4 supports specular
// without dominating hand-placed lights.
{
  const pmrem = new PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envTexture = pmrem.fromScene(new RoomEnvironment()).texture;
  scene.environment = envTexture;
  // v0.5 Stage 2: trimmed 0.4 → 0.28 — env still gives PBR materials specular
  // life on the glossy floor / metals, but no longer fights the dark mood.
  // Stage C: 0.28→0.34 — new cream panels + glossier floors need more specular
  // life; bezels and metals pick up environment highlights.
  scene.environmentIntensity = 0.34;
  pmrem.dispose();
}

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

// Wire the live scan source into the PLANET SCAN console mode now that the
// director (ship.planet) exists. Returns the nearest visible hero, or null.
setScanProvider((): ScanData | null => ship.planet.getScanData?.() ?? null);

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
  getState(): { clock: number; energy: number; hunger: number; clockString: string; questStep: number };
  getDoorOpen(id: string): boolean;
  getFridgeState(): { state: string; stock: number };
  resetFridge(): void;
  setHunger(v: number): void;
  getScan(): ScanData | null;
  forceDoorAutoCloseCheck(): string[];
  questRevealAndReadPanel(): number;
  questAdvanceViaBreaker(): number;
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
  getState(): { clock: number; energy: number; hunger: number; clockString: string; questStep: number } {
    const s = getState();
    return {
      clock: s.shipMinutes,
      energy: s.energy,
      hunger: s.hunger,
      clockString: `${String(Math.floor(s.shipMinutes / 60) % 24).padStart(2, '0')}:${String(Math.floor(s.shipMinutes) % 60).padStart(2, '0')}`,
      questStep: getQuestStep(),
    };
  },
  getDoorOpen(id: string): boolean {
    return isDoorOpen(id);
  },
  getFridgeState(): { state: string; stock: number } {
    return getFridgeStateForTest();
  },
  resetFridge(): void {
    resetFridgeForTest();
  },
  setHunger(v: number): void {
    setHunger(v);
  },
  getScan(): ScanData | null {
    return ship.planet.getScanData?.() ?? null;
  },
  forceDoorAutoCloseCheck(): string[] {
    return forceDoorAutoCloseCheck();
  },
  questRevealAndReadPanel(): number {
    return questRevealAndReadPanel();
  },
  questAdvanceViaBreaker(): number {
    return questAdvanceViaBreaker();
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
