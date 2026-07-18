import * as THREE from 'three';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { initPerf, recordFrame, installPerfGlobal } from './core/perf.js';
import { installCameraGlobal, setActiveCamera } from './core/cameras.js';
import { tickState, getState, loadState } from './core/state.js';
import { initDebug, tickDebug } from './ui/debug.js';
import { initHud, tickHud, showRoomToast } from './ui/hud.js';
import { initStartOverlay } from './ui/startOverlay.js';
import { assembleShip } from './world/assembly.js';
import { initController, tickController, isMoving, tickBob } from './player/controller.js';
import { initInteract, registerInteractables, tickInteract } from './player/interact.js';
import { tickSway } from './fx/sway.js';
import { initAudio, getRoomForPosition, playOneShot } from './fx/audio.js';
import type { RoomName } from './fx/audio.js';
import { buildAllInteractables } from './world/interactWiring.js';
import { initBloom } from './fx/bloom.js';
import { tickStarfield } from './fx/starfield.js';
import { setScanProvider } from './world/interactConsole.js';
import { QUALITY_LOW, SHADOWS_OFF } from './core/perf.js';
import type { ScanData } from './fx/space/types.js';
import { applyMaxAnisotropy } from './fx/textureHelpers.js';
import { getActiveWorld, getActiveWorldId } from './core/worlds.js';
import { bootWorlds } from './core/worldBoot.js';
import { tickPortals } from './fx/portalSurface.js';
import { installTestApi } from './core/testApi.js';
import { initPlanetScaleSpike, tickPlanetScaleSpike } from './flight/spikes/planetScale.js';
import { tickFlight } from './flight/flightState.js';

// ── Renderer ──────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
// v0.9 A2: enable anisotropic filtering on every procedural texture minted so
// far. By the time this line runs, the whole static import graph (world/*.ts
// → shipMaterials.ts / texturesFixtures.ts / propMaterials.ts) has already
// evaluated, so this single sweep covers floor/wall/ceiling and fixes the
// grazing-angle floor mush without touching every material call site.
applyMaxAnisotropy(renderer);
// Filmic grade: ACES gives deep blacks + rolling highlights, exposure lifts
// interior contrast without blowing emissives.
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// v0.5 Stage 2 (lighting mood): exposure trimmed 1.15 → 1.05 so the darkened
// interior sits low and emissives (toneMapped=false) punch against shadow.
// v0.9 B3 (RADIANCE art pass): 1.05 → 1.00. The pre-B1 fill stack was graded
// on 2x-too-bright albedo + darker SwiftShader; on honest GPU the interior read
// evenly-lit. Fill cut hard in lightingRig.ts; exposure trimmed a touch to sit
// the tone-mapped surfaces lower so emissives (toneMapped:false) punch harder.
renderer.toneMappingExposure = 1.00;
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
  // v0.9 B3 (RADIANCE art pass): 0.34 → 0.18. The RoomEnvironment IBL was the
  // single biggest contributor to the flat, evenly-bright cream walls (a neutral
  // omnidirectional fill fights all pooling). Cut substantially; 0.18 still gives
  // bezels/metals/glossy-floor specular life without lifting the whole shell.
  scene.environmentIntensity = 0.18;
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
// First-boot "click to start" overlay for public visitors (portfolio embeds,
// cold GitHub Pages links). No-ops under Playwright (navigator.webdriver).
initStartOverlay();

// ── Load persisted state if available ────────────────────────────────────────
loadState();

// ── Audio (Phase 5) ───────────────────────────────────────────────────────────
// initAudio attaches gesture listeners; the AudioContext starts suspended and
// only resumes on the first user click/keydown. Safe if audio is blocked.
const audio = initAudio();

// ── Assemble ship ─────────────────────────────────────────────────────────────
const ship = assembleShip(scene);

// Stage 0 SPIKE (v1.1 SOVEREIGN, design §5): planet-scaling proof. No-op
// unless ?spike=planet — byte-identical to today otherwise.
initPlanetScaleSpike(scene, camera);

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

// ── World system (v1.0 THRESHOLD) ─────────────────────────────────────────────
// Registers the ship (as a World adapter) + the dev-void proof world, wires the
// WorldManager + portal deps, publishes __camNames, and applies ?world / start
// camera. See core/worldBoot.ts.
bootWorlds({
  scene,
  camera,
  renderer,
  bloom,
  shipColliders: ship.colliders,
  shipInteractables: [...ship.interactables, ...v02Interactables],
});

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

// ── window.__test — functional test hooks (extracted: core/testApi.ts) ───────
installTestApi({
  camera,
  scene,
  getScanData: (): ScanData | null => ship.planet.getScanData?.() ?? null,
});

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
  tickPlanetScaleSpike(dtSeconds); // Stage 0 SPIKE — no-op unless ?spike=planet
  tickInteract();
  tickSway(camera, elapsed);

  // ── World gating: ship director/starfield/room-audio freeze off-ship ──
  const activeId = getActiveWorldId();
  const activeWorld = getActiveWorld();
  if (activeId === 'ship') {
    ship.planet.tick(elapsed);
    tickStarfield(ship.starfield, elapsed);
    tickFlight(dtSeconds); // v1.1 SOVEREIGN — no-op under ?flight=0 (flightState.ts)
  } else {
    activeWorld.update(dtSeconds, camera.position);
  }
  // v1.0 THRESHOLD — pocket-world ambient bed crossfade (no-op when unchanged).
  audio.setWorldBed(
    activeId === 'verdant' || activeId === 'ashfall' || activeId === 'rift' ? activeId : null,
  );

  // Portal live-preview tier — before bloom.render() (it borrows + restores the
  // render target). No-op when the active scene has no portal near the player.
  tickPortals(dtSeconds, camera.position, camera, activeWorld.scene);

  tickDebug(now);
  audio.tick(isMoving());

  // Room ambient crossfade + toast on room change (ship only)
  if (activeId === 'ship') {
    const currentRoom = getRoomForPosition(camera.position.x, camera.position.z);
    if (currentRoom !== lastRoom) {
      audio.setRoom(currentRoom);
      showRoomToast(ROOM_LABELS[currentRoom]);
      lastRoom = currentRoom;
    }
  }

  const s = getState();
  tickHud(s.shipMinutes, s.energy, s.hunger, activeId);

  bloom.render();
  if (firstFrame) {
    firstFrame = false;
    readyResolve();
  }
}

requestAnimationFrame(animate);
