/**
 * src/world/interactWiring.ts — v0.2 Integration: wire all named geometry
 * groups to Interactable entries and register them with the interact system.
 *
 * Covers:
 *   - 6 sliding doors (dynamic Open/Close prompt)
 *   - 3 plain seats (seat-starboard, bench-fore, bench-aft) — seat-port is
 *     now the HELM (v1.1 SOVEREIGN D2): see src/flight/helm.ts
 *   - console-bank (NAV/SYSTEMS/PLANET SCAN overlay, consoleMode 0→1→2→0)
 *
 * Items / lore / panels → interactItems.ts (split for 300-line limit).
 *
 * All positions are world-space (assembly.ts has already translated them).
 */

import * as THREE from 'three';
import type { Interactable, InteractContext } from './types.js';
import { doorRecords, setDoorOpen, isDoorOpen, armDoorAutoClose } from './doors.js';
import { enterAnchor } from '../player/controller.js';
import { buildHelmInteractable } from '../flight/helm.js';
import { getState, setConsoleMode, getQuestStep, advanceQuest, setQuestFlag } from '../core/state.js';
import { showOverlay, hideOverlay, showRoomToast } from '../ui/hud.js';
import { playOneShot } from '../fx/audio.js';
import {
  buildLoreInteractables,
  buildBreakerCabinetInteractable,
  buildFridgeInteractable,
  buildCoffeeCupInteractable,
  buildSaveTerminalInteractable,
  buildConsoleNavLines,
  buildConsoleSystemsLines,
  buildConsolePlanetLines,
} from './interactItems.js';
import { getCrateBGroup } from './engineeringProps.js';
import { createPropTween } from './propTween.js';

// ── Helpers ────────────────────────────────────────────────────────────────────

function v3(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, y, z);
}

// ── 1. Door Interactables ──────────────────────────────────────────────────────

/**
 * Door interactable positions are world-space, slightly offset from the slab
 * to avoid overlapping nearby prop interactables.
 * Radius 1.5 keeps side doors from reaching into quarters rooms.
 */
const DOOR_POSITIONS: Record<string, THREE.Vector3> = {
  'cockpit-aft':         v3(0,    1.1, -20),
  'corridor-quarters-a': v3(-2.5, 1.1, -16),
  'corridor-quarters-b': v3(2.5,  1.1, -16),
  'corridor-galley':     v3(0,    1.1,  -7),
  // On engineering side: keeps radius from reaching galley stove area
  'galley-engineering':  v3(0,    1.1, -0.3),
  'engineering-cargo':   v3(0,    1.1,   9),
  // v1.0 THRESHOLD: cargo-bay aft ↔ Dimensional Annex fore
  'cargo-annex':         v3(0,    1.1,  18),
};

function buildDoorInteractables(): Interactable[] {
  return doorRecords.map((rec): Interactable => {
    const pos = DOOR_POSITIONS[rec.id] ?? v3(0, 1.1, 0);
    return {
      id:     rec.id,
      prompt: 'Open Door',
      radius: 1.5,
      position: pos.clone(),
      getPrompt(): string {
        return isDoorOpen(rec.id) ? 'Close Door' : 'Open Door';
      },
      onInteract(_ctx: InteractContext): void {
        const nowOpen = isDoorOpen(rec.id);
        setDoorOpen(rec.id, !nowOpen);
        playOneShot('door');
        // Arm auto-close after first manual interaction
        armDoorAutoClose(rec.id);
      },
    };
  });
}

// ── 2. Seat Interactables ──────────────────────────────────────────────────────

/**
 * Cockpit seats: world positions derived from room local + worldPos (0,0,-22.5).
 *   seat-port/stbd: local (±0.90, 0, 0.3), seat pan Y≈0.53. Look at canopy.
 * Galley benches: world positions derived from local + worldPos (0,0,-1).
 *   bench-fore/aft: look across table center at world (-1.10, 0.78, -1.40).
 */
function buildSeatInteractables(): Interactable[] {
  const seats: Array<{
    id: string;
    interactPos: THREE.Vector3;
    anchorPos: THREE.Vector3;
    lookAt: THREE.Vector3;
    eyeH: number;
  }> = [
    {
      id: 'seat-starboard',
      interactPos: v3(0.90, 1.0, -22.2),
      anchorPos:   v3(0.90, 0.53, -22.2),
      lookAt:      v3(0, 1.55, -25.0),
      eyeH: 1.15,
    },
    {
      id: 'bench-fore',
      interactPos: v3(-1.10, 0.8, -2.085),
      anchorPos:   v3(-1.10, 0.44, -2.085),
      lookAt:      v3(-1.10, 0.78, -1.40),
      eyeH: 1.1,
    },
    {
      id: 'bench-aft',
      interactPos: v3(-1.10, 0.8, -0.715),
      anchorPos:   v3(-1.10, 0.44, -0.715),
      lookAt:      v3(-1.10, 0.78, -1.40),
      eyeH: 1.1,
    },
  ];

  return seats.map(({ id, interactPos, anchorPos, lookAt, eyeH }): Interactable => ({
    id,
    prompt: 'Sit',
    radius: 1.8,
    position: interactPos.clone(),
    onInteract(_ctx: InteractContext): void {
      const st = getState();
      if (st.seated) return;
      playOneShot('ui');
      enterAnchor(anchorPos, lookAt, eyeH);
    },
  }));
}

// ── 3. Console Bank ────────────────────────────────────────────────────────────

const CONSOLE_LABELS = ['NAV', 'SYSTEMS', 'PLANET SCAN'] as const;

function buildConsoleLinesForMode(mode: 0 | 1 | 2): string[] {
  if (mode === 0) return buildConsoleNavLines();
  if (mode === 1) return buildConsoleSystemsLines();
  return buildConsolePlanetLines();
}

let _consoleModeKeyHandler: ((e: KeyboardEvent) => void) | null = null;

function buildConsoleBankInteractable(): Interactable {
  return {
    id: 'console-bank',
    prompt: 'Access Console',
    radius: 2.2,
    // cockpit worldPos (0,0,-22.5); console FZ=-2.48 → world Z=-24.98
    position: v3(0, 1.0, -24.98),
    onInteract(_ctx: InteractContext): void {
      playOneShot('ui');
      const s = getState();
      const next = ((s.consoleMode + 1) % 3) as 0 | 1 | 2;
      setConsoleMode(next);
      showOverlay(`CONSOLE — ${CONSOLE_LABELS[next]}`, buildConsoleLinesForMode(next));

      if (_consoleModeKeyHandler) {
        window.removeEventListener('keydown', _consoleModeKeyHandler);
      }
      _consoleModeKeyHandler = (e: KeyboardEvent): void => {
        if (e.code === 'Escape') {
          hideOverlay();
          setConsoleMode(0);
          if (_consoleModeKeyHandler) {
            window.removeEventListener('keydown', _consoleModeKeyHandler);
            _consoleModeKeyHandler = null;
          }
        }
      };
      window.addEventListener('keydown', _consoleModeKeyHandler);
    },
  };
}

// ── 4. Crate-B slide + hidden floor panel ─────────────────────────────────────

// Engineering worldPos: (0,0,5.5). Crate-B local X≈-1.45, Z≈-0.3 → world≈(-1.45,0,5.2).
const CRATE_B_SLIDE_DIST = 0.8; // metres, +X direction to reveal panel
let _crateBSlid = false;
let _panelRevealed = false;

/**
 * Inspect the hidden floor panel (shared by the interactable + the test hook).
 * No-op until the crate has been slid (panel revealed). On quest step 0 this
 * seeds the anomaly: sets panelRead and advances 0→1.
 */
function inspectHiddenPanel(): void {
  if (!_panelRevealed) return;
  playOneShot('ui');

  const baseLines = [
    'Cycle 1887. Deck plate 7-C replaced (stress fracture).',
    'Previous patch: tape and hope. Not crew-rated.',
    '',
    'Note from prior shift: "If you are reading this,',
    'the crate worked. Do not move the crate."',
    '',
    '— J. Okafor, Chief Engineer, STREL-7',
  ];

  if (getQuestStep() === 0) {
    setQuestFlag('panelRead');
    advanceQuest(); // 0 -> 1
    playOneShot('quest-start');
    showOverlay('MAINTENANCE LOG — STREL-7', [
      ...baseLines,
      '',
      '[SYSTEM] Anomaly logged. Investigate reactor breaker — engineering.',
    ]);
    showRoomToast('ANOMALY DETECTED');
  } else {
    showOverlay('MAINTENANCE LOG — STREL-7', baseLines);
  }
}

/**
 * Test hook: slide the crate (reveal the panel) then inspect it, driving the
 * quest 0→1. headlessInteract can't reach the panel because the crate sits at
 * the same XZ and always wins the nearest-within-radius proximity check.
 * Returns the quest step after running.
 */
export function questRevealAndReadPanel(): number {
  _crateBSlid = true;
  _panelRevealed = true;
  const cg = getCrateBGroup();
  if (cg) cg.position.x = CRATE_B_SLIDE_DIST; // reflect the slid state visually
  inspectHiddenPanel();
  return getQuestStep();
}

function buildCrateBInteractables(): Interactable[] {
  // Tween built lazily on first interact so getCrateBGroup() is populated
  let _crateTween: ReturnType<typeof createPropTween> | null = null;
  function getCrateTween(): ReturnType<typeof createPropTween> {
    if (!_crateTween) {
      const cg = getCrateBGroup();
      _crateTween = createPropTween(400, (v) => {
        if (cg) cg.position.x = v * CRATE_B_SLIDE_DIST;
      });
    }
    return _crateTween;
  }

  const crateIA: Interactable = {
    id: 'crate-b',
    prompt: 'Slide Crate',
    radius: 2.0,
    position: new THREE.Vector3(-1.45, 0.21, 5.2),
    getPrompt(): string { return _crateBSlid ? 'Slide Crate Back' : 'Slide Crate'; },
    onInteract(_ctx: InteractContext): void {
      playOneShot('ui');
      _crateBSlid = !_crateBSlid;
      getCrateTween().start(_crateBSlid ? 0 : 1, _crateBSlid ? 1 : 0);
      if (_crateBSlid) _panelRevealed = true;
    },
  };

  const panelIA: Interactable = {
    id: 'hidden-floor-panel',
    prompt: 'Inspect Panel',
    radius: 1.5,
    position: new THREE.Vector3(-1.45, 0.01, 5.2),
    getPrompt(): string { return _panelRevealed ? 'Inspect Panel' : ''; },
    onInteract(_ctx: InteractContext): void {
      inspectHiddenPanel();
    },
  };
  return [crateIA, panelIA];
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Build and return all v0.3 interactables.
 * doorRecords must be populated (buildDoors called) before this runs.
 */
export function buildAllInteractables(): Interactable[] {
  return [
    ...buildDoorInteractables(),
    buildHelmInteractable(),
    ...buildSeatInteractables(),
    buildConsoleBankInteractable(),
    ...buildLoreInteractables(),
    buildBreakerCabinetInteractable(),
    buildFridgeInteractable(),
    buildCoffeeCupInteractable(),
    buildSaveTerminalInteractable(),
    ...buildCrateBInteractables(),
  ];
}
