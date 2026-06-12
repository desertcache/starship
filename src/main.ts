import * as THREE from 'three';
import { initPerf, recordFrame, installPerfGlobal } from './core/perf.js';
import {
  getRegisteredCamNames,
  installCameraGlobal,
  setActiveCamera,
  teleportToCamera,
} from './core/cameras.js';
import { initDebug, tickDebug } from './ui/debug.js';
import { assembleShip } from './world/assembly.js';
import { initController, tickController } from './player/controller.js';

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
  1000,
);

// ── Global hook installs ──────────────────────────────────────────────────────
installPerfGlobal();
installCameraGlobal();
setActiveCamera(camera);
initPerf(renderer);
initDebug(renderer, camera);

// ── Assemble ship ─────────────────────────────────────────────────────────────
const ship = assembleShip(scene);

// ── Player controller ─────────────────────────────────────────────────────────
initController(camera, renderer, ship.colliders);

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

// ── Render loop ───────────────────────────────────────────────────────────────
let firstFrame = true;

function animate(now: number): void {
  requestAnimationFrame(animate);
  recordFrame(now);
  tickController(now);
  tickDebug(now);
  renderer.render(scene, camera);
  if (firstFrame) {
    firstFrame = false;
    readyResolve();
  }
}

requestAnimationFrame(animate);
