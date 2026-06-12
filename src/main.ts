import * as THREE from 'three';
import { initPerf, recordFrame, installPerfGlobal } from './core/perf.js';
import {
  getRegisteredCamNames,
  installCameraGlobal,
  setActiveCamera,
  teleportToCamera,
} from './core/cameras.js';
import { tickState, getState } from './core/state.js';
import { initDebug, tickDebug } from './ui/debug.js';
import { initHud, tickHud } from './ui/hud.js';
import { assembleShip } from './world/assembly.js';
import { initController, tickController } from './player/controller.js';
import { initInteract, registerInteractables, tickInteract, headlessInteract } from './player/interact.js';
import { tickSway } from './fx/sway.js';

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

// ── Assemble ship ─────────────────────────────────────────────────────────────
const ship = assembleShip(scene);

// ── Player controller ─────────────────────────────────────────────────────────
initController(camera, renderer, ship.colliders);

// ── Interaction system ────────────────────────────────────────────────────────
initInteract(camera, scene);
registerInteractables(ship.interactables);

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
};

(window as unknown as Record<string, unknown>)['__test'] = testAPI;

// ── Render loop ───────────────────────────────────────────────────────────────
let firstFrame = true;
let lastFrameTime = performance.now();

function animate(now: number): void {
  requestAnimationFrame(animate);
  recordFrame(now);

  const dtSeconds = Math.min((now - lastFrameTime) / 1000, 0.05);
  lastFrameTime = now;

  const elapsed = (now - startTime) / 1000;

  tickController(now);
  tickState(dtSeconds);
  tickInteract();
  tickSway(camera, elapsed);
  ship.planet.tick(elapsed);
  tickDebug(now);

  const s = getState();
  tickHud(s.shipMinutes, s.energy, s.hunger);

  renderer.render(scene, camera);
  if (firstFrame) {
    firstFrame = false;
    readyResolve();
  }
}

requestAnimationFrame(animate);
