/**
 * src/world/interactConsole.ts — Console overlay line builders + save terminal.
 * Split from interactItems.ts to stay under the 300-line limit.
 */

import * as THREE from 'three';
import type { Interactable, InteractContext } from './types.js';
import { doorRecords, isDoorOpen } from './doors.js';
import {
  getState, setHunger, setEnergy, advanceShipClock,
  formatShipClock, saveState, getQuestStep, advanceQuest, setQuestFlag,
} from '../core/state.js';
import { showOverlay, showSaveToast } from '../ui/hud.js';
import { playOneShot } from '../fx/audio.js';
import type { ScanData } from '../fx/space/types.js';

function v3(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, y, z);
}

// ── Live scan provider ──────────────────────────────────────────────────────────
// main.ts wires the director's getScanData() here once the ship is assembled, so
// the PLANET SCAN console mode can read the nearest visible hero live without the
// world layer importing the space director directly.

type ScanProvider = () => ScanData | null;
let _scanProvider: ScanProvider | null = null;

/** Register the live scan source (called from main.ts after assembleShip). */
export function setScanProvider(fn: ScanProvider): void {
  _scanProvider = fn;
}

/** Format a raw distance as thousands-separated km, e.g. 1234 → "1,234 km". */
function formatKm(distanceKm: number): string {
  return `${Math.round(distanceKm).toLocaleString('en-US')} km`;
}

// ── Console overlay helpers ────────────────────────────────────────────────────

export function buildConsolePlanetLines(): string[] {
  const scan = _scanProvider ? _scanProvider() : null;

  if (!scan) {
    return [
      'PLANETARY SCAN',
      '',
      'NO CONTACT — DEEP FIELD',
      '',
      'No bodies within scan range. Maintain heading.',
      '',
      'Press [E] or [ESC] to close.',
    ];
  }

  return [
    `${scan.name} — ${scan.class}`,
    '',
    `Composition: ${scan.composition}`,
    `Range:       ${formatKm(scan.distanceKm)}`,
    '',
    'Storm bands / surface visible from canopy.',
    'No landing capability. Maintain safe orbit.',
    '',
    'Press [E] or [ESC] to close.',
  ];
}

const QUEST_STATUS_LABELS: Record<0 | 1 | 2 | 3, string> = {
  0: 'none',
  1: 'investigate reactor breaker',
  2: 'file report at crew log terminal',
  3: 'complete',
};

export function buildConsoleSystemsLines(): string[] {
  const s = getState();
  const qs = getQuestStep();
  const questLine = `MISSION: ${QUEST_STATUS_LABELS[qs]}`;
  const completionLine = qs === 3 ? 'ANOMALY CLOSED — STREL-7 incident resolved.' : '';

  return [
    `ENERGY:  ${Math.round(s.energy)}%`,
    `HUNGER:  ${Math.round(s.hunger)}%`,
    '',
    'DOOR STATUS:',
    ...doorRecords.map((r) => `  ${r.id}: ${isDoorOpen(r.id) ? 'OPEN' : 'CLOSED'}`),
    '',
    questLine,
    ...(completionLine ? [completionLine] : []),
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

// ── Save Terminal ─────────────────────────────────────────────────────────────

export function buildSaveTerminalInteractable(): Interactable {
  return {
    id: 'save-terminal-shell',
    prompt: 'Save Log',
    radius: 2.0,
    position: v3(-1.44, 1.55, -16),
    onInteract(_ctx: InteractContext): void {
      const qs = getQuestStep();

      if (qs === 2) {
        // Quest step 3: file field report
        setQuestFlag('logged');
        setEnergy(100);
        setHunger(100);
        advanceShipClock(5);
        advanceQuest(); // 2 -> 3
        saveState();
        showSaveToast('-- ANOMALY RESOLVED --');
        playOneShot('quest-complete');
        showOverlay('FIELD REPORT FILED — STREL-7 ANOMALY', [
          'STREL-7 ANOMALY — INCIDENT CLOSED',
          '',
          'Investigator: crew (you)',
          'Action taken: reactor signature stabilized via breaker boost.',
          'Deck plate 7-C status: monitored, no further movement.',
          '',
          'Outstanding recommendation: do not move the crate.',
          '',
          '>> Systems nominal. Energy and hunger restored.',
          '>> Log archived at ship time ' + formatShipClock(getState().shipMinutes) + '.',
        ]);
      } else {
        // Normal save
        saveState();
        showSaveToast();
        playOneShot('save');
      }
    },
  };
}
