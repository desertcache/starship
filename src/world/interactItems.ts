/**
 * src/world/interactItems.ts — v0.2 item / lore / panel Interactables.
 * Split from interactWiring.ts to stay under 300 lines.
 *
 * Covers: datapad-a/b, crate-a, breaker-cabinet, fridge, coffee-cup,
 *         save-terminal-shell.
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

// ── 3. Fridge ──────────────────────────────────────────────────────────────────

export function buildFridgeInteractable(): Interactable {
  return {
    id: 'fridge',
    prompt: 'Take Ration',
    radius: 2.0,
    position: v3(2.725, 1.05, 0.05),
    onInteract(_ctx: InteractContext): void {
      const s = getState();
      setHunger(Math.min(100, s.hunger + 30));
      playOneShot('eat');
    },
  };
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
