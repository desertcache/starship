/**
 * src/world/interactItems.ts — item / lore / panel Interactables (v0.3).
 * Fridge state machine: closed→open+stock→take rations (×3)→close.
 * restockFridge() called from sleep callbacks (quarters.ts).
 */

import * as THREE from 'three';
import type { Interactable, InteractContext } from './types.js';
import { doorRecords, isDoorOpen } from './doors.js';
import {
  getState, setHunger, setEnergy, advanceShipClock,
  formatShipClock, saveState,
} from '../core/state.js';
import { showOverlay, hideOverlay, showSaveToast } from '../ui/hud.js';
import { playOneShot } from '../fx/audio.js';
import {
  getFridgeHingeGroup, getFridgeRationMeshes, getFridgeTween,
} from './galleyProps.js';

function v3(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, y, z);
}

// ── 1. Lore Overlays ──────────────────────────────────────────────────────────

export function buildLoreInteractables(): Interactable[] {
  const items: Interactable[] = [];

  // datapad-a — port quarters (world -4,0,-16; tablet at -6.485,1.4,-16.8)
  items.push({
    id: 'datapad-a',
    prompt: 'Read',
    radius: 1.8,
    position: v3(-6.485, 1.4, -16.8),
    onInteract(_ctx: InteractContext): void {
      playOneShot('ui');
      showOverlay('CREW LOG — ENGINEER VASQUEZ', [
        'Day 214. Starboard thruster seal replaced again.',
        'Third time this cycle. Parts are holding but',
        'I am not confident about the gasket tolerances.',
        '',
        'Filed requisition for spares at last port. Nothing.',
        'We keep flying on wire and hope, same as always.',
        '',
        '— V',
      ]);
    },
  });

  // datapad-b — starboard quarters (world 4,0,-16; tablet at 6.485,1.4,-16.8)
  items.push({
    id: 'datapad-b',
    prompt: 'Read',
    radius: 1.8,
    position: v3(6.485, 1.4, -16.8),
    onInteract(_ctx: InteractContext): void {
      playOneShot('ui');
      showOverlay('CREW LOG — NAVIGATOR CHEN', [
        'Day 211. Plotted deviation around the debris field',
        'at marker 7-Foxtrot. Added 3.2 ship-days.',
        'Captain was not pleased. Neither was I.',
        '',
        'The gas giant is closer than the charts show.',
        'Storm season peaking. Keep the canopy shutters',
        'ready — just in case.',
        '',
        '— C',
      ]);
    },
  });

  // crate-a — engineering (world approx -2.35,0.55,5.0)
  items.push({
    id: 'crate-a',
    prompt: 'Inspect Cargo',
    radius: 2.0,
    position: v3(-2.35, 0.55, 5.0),
    onInteract(_ctx: InteractContext): void {
      playOneShot('ui');
      showOverlay('CARGO MANIFEST — CRATE A', [
        'ITEM: Reactor coolant compound (type-4)',
        'QTY:  12 units',
        'DEST: Waystation Kira-9',
        '',
        'ITEM: Replacement gasket set (thruster)',
        'QTY:  4 sets',
        'DEST: Internal use',
        '',
        'ITEM: Medical supplies (sealed)',
        'QTY:  1 case',
        'DEST: Colony Outrider-B',
      ]);
    },
  });

  return items;
}

// ── 2. Breaker Cabinet ────────────────────────────────────────────────────────

let _breakerKeyHandler: ((e: KeyboardEvent) => void) | null = null;

export function buildBreakerCabinetInteractable(): Interactable {
  return {
    id: 'breaker-cabinet',
    prompt: 'Access Panel',
    radius: 2.0,
    position: v3(-2.89, 1.35, 3.8),
    onInteract(_ctx: InteractContext): void {
      playOneShot('ui');
      showOverlay('BREAKER PANEL', [
        'System status: NOMINAL',
        '',
        '[1]  Vent Coolant   — energy -20',
        '[2]  Boost Reactor  — energy +30, clock +15 min',
        '',
        'Press [ESC] to close.',
      ]);

      if (_breakerKeyHandler) {
        window.removeEventListener('keydown', _breakerKeyHandler);
      }
      _breakerKeyHandler = (e: KeyboardEvent): void => {
        if (e.code === 'Digit1') {
          const s = getState();
          setEnergy(s.energy - 20);
          playOneShot('vent');
          showOverlay('BREAKER PANEL', [
            'COOLANT VENT — EXECUTED',
            '',
            `Energy now: ${Math.round(getState().energy)}%`,
            '',
            '[1]  Vent Coolant   — energy -20',
            '[2]  Boost Reactor  — energy +30, clock +15 min',
            '',
            'Press [ESC] to close.',
          ]);
        } else if (e.code === 'Digit2') {
          const s = getState();
          setEnergy(s.energy + 30);
          advanceShipClock(15);
          playOneShot('ui');
          showOverlay('BREAKER PANEL', [
            'REACTOR BOOST — EXECUTED',
            '',
            `Energy now: ${Math.round(getState().energy)}%`,
            `Ship time:  ${formatShipClock(getState().shipMinutes)}`,
            '',
            '[1]  Vent Coolant   — energy -20',
            '[2]  Boost Reactor  — energy +30, clock +15 min',
            '',
            'Press [ESC] to close.',
          ]);
        } else if (e.code === 'Escape') {
          hideOverlay();
          if (_breakerKeyHandler) {
            window.removeEventListener('keydown', _breakerKeyHandler);
            _breakerKeyHandler = null;
          }
        }
      };
      window.addEventListener('keydown', _breakerKeyHandler);
    },
  };
}

// ── 3. Fridge — v0.3 state machine ────────────────────────────────────────────

type FridgeState = 'closed' | 'open';
let _fridgeState: FridgeState = 'closed';
let _fridgeStock = 3;
/** Read fridge state for test harness. */
export function getFridgeStateForTest(): { state: FridgeState; stock: number } { return { state: _fridgeState, stock: _fridgeStock }; }
/** Reset fridge to closed+full (test harness only — instant, no tween). */
export function resetFridgeForTest(): void { _fridgeState = 'closed'; _fridgeStock = 3; const hg = getFridgeHingeGroup(); if (hg) hg.rotation.y = 0; getFridgeRationMeshes().forEach((m) => { m.visible = false; }); }
/** Restock the fridge (call from sleep callback paths). */
export function restockFridge(): void { _fridgeStock = 3; getFridgeRationMeshes().forEach((m, i) => { m.visible = _fridgeState === 'open' && i < 3; }); }

export function buildFridgeInteractable(): Interactable {
  // Galley worldPos=(0,0,-1); FRIDGE_Z_CTR≈1.05, CTR_FACE≈2.45 → world x≈2.45 z≈0.05
  const ia: Interactable = {
    id: 'fridge',
    prompt: 'Open Fridge',
    radius: 2.0,
    position: v3(2.45, 1.05, 0.05),
    getPrompt(): string {
      if (_fridgeState === 'closed') return 'Open Fridge';
      if (_fridgeStock > 0) return `Take Ration (${_fridgeStock})`;
      return 'Close Fridge';
    },
    onInteract(_ctx: InteractContext): void {
      const tween = getFridgeTween();
      const hingeGroup = getFridgeHingeGroup();
      if (_fridgeState === 'closed') {
        // Open the door
        _fridgeState = 'open';
        playOneShot('door');
        tween?.start(0, 1);
        if (hingeGroup) hingeGroup.rotation.y = 0; // ensure start pos
        // Show ration meshes
        const meshes = getFridgeRationMeshes();
        for (let i = 0; i < meshes.length; i++) {
          meshes[i].visible = i < _fridgeStock;
        }
      } else if (_fridgeStock > 0) {
        // Take a ration
        const s = getState();
        setHunger(Math.min(100, s.hunger + 30));
        playOneShot('eat');
        _fridgeStock--;
        const meshes = getFridgeRationMeshes();
        // Hide the last visible ration mesh
        if (meshes[_fridgeStock]) meshes[_fridgeStock].visible = false;
      } else {
        // Close the door
        _fridgeState = 'closed';
        playOneShot('door');
        tween?.start(1, 0);
        // Hide ration meshes (they're inside, no need to see through closed door)
        const meshes = getFridgeRationMeshes();
        for (const m of meshes) m.visible = false;
      }
    },
  };
  return ia;
}

// ── 4. Coffee Cup ──────────────────────────────────────────────────────────────

export function buildCoffeeCupInteractable(): Interactable {
  return {
    id: 'coffee-cup',
    prompt: 'Drink Coffee',
    radius: 1.5,
    position: v3(2.675, 0.945, -2.90),
    onInteract(_ctx: InteractContext): void {
      const s = getState();
      setEnergy(Math.min(100, s.energy + 15));
      advanceShipClock(5);
      playOneShot('sip');
    },
  };
}

// ── 5. Save Terminal ───────────────────────────────────────────────────────────

export function buildSaveTerminalInteractable(): Interactable {
  return {
    id: 'save-terminal-shell',
    prompt: 'Save Log',
    radius: 2.0,
    position: v3(-1.44, 1.55, -16),
    onInteract(_ctx: InteractContext): void {
      saveState();
      showSaveToast();
      playOneShot('save');
    },
  };
}

// ── 6. Console overlay helpers (shared with interactWiring.ts) ─────────────────

export function buildConsolePlanetLines(): string[] {
  return [
    'GAS GIANT — CLASS III',
    '',
    'Diameter: ~1.4 AU equivalent',
    'Storm bands: active (visible from canopy)',
    'Magnetic flux: elevated — instruments nominal',
    '',
    'No landing capability. Maintain safe orbit.',
    '',
    'Press [E] or [ESC] to close.',
  ];
}

export function buildConsoleSystemsLines(): string[] {
  const s = getState();
  return [
    `ENERGY:  ${Math.round(s.energy)}%`,
    `HUNGER:  ${Math.round(s.hunger)}%`,
    '',
    'DOOR STATUS:',
    ...doorRecords.map((r) => `  ${r.id}: ${isDoorOpen(r.id) ? 'OPEN' : 'CLOSED'}`),
    '',
    'Press [E] or [ESC] to close.',
  ];
}

export function buildConsoleNavLines(): string[] {
  const s = getState();
  const heading = `${Math.round(s.heading).toString().padStart(3, '0')}°`;
  return [
    `HEADING:  ${heading}`,
    `SHIP TIME: ${formatShipClock(s.shipMinutes)}`,
    '',
    'Press [E] or [ESC] to close.',
  ];
}
