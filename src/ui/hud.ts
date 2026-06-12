/**
 * src/ui/hud.ts — Sci-fi HUD (Phase 4 + Phase 5 polish).
 *
 * Core elements owned here:
 *   - Ship clock (top-left, monospace teal)
 *   - Energy / hunger bars
 *   - Crosshair (fixed-center 6px circle, teal glow when prompt visible)
 *   - Interaction prompt (center-bottom)
 *   - Fade overlay (black fullscreen for sleep/eat transitions)
 *
 * Toast / overlay elements live in hudOverlay.ts (re-exported here).
 *
 * Palette: cream #E8E2D4, orange #C7641E, teal #46E0D8, gunmetal #1C1E22
 */

import { formatShipClock } from '../core/state.js';
import {
  initRoomToast, initSaveToast, initOverlay,
} from './hudOverlay.js';
export {
  showRoomToast, showSaveToast,
  showOverlay, hideOverlay,
} from './hudOverlay.js';

// ── DOM elements ──────────────────────────────────────────────────────────────

let clockEl: HTMLDivElement | null = null;
let energyFill: HTMLDivElement | null = null;
let hungerFill: HTMLDivElement | null = null;
let promptEl: HTMLDivElement | null = null;
let crosshairEl: HTMLDivElement | null = null;
let fadeEl: HTMLDivElement | null = null;
let flightStripEl: HTMLDivElement | null = null;

// v0.6 P6: HUD teal slightly desaturated (80% brightness of #46E0D8 → #38B3AD)
// so the HUD recedes behind the world rather than competing with it.
const TEAL   = '#38B3AD';
const BAR_BG = 'rgba(10,11,16,0.85)';

function makeDiv(styles: string): HTMLDivElement {
  const d = document.createElement('div');
  d.style.cssText = styles;
  return d;
}

export function initHud(): void {
  // ── Wrapper container (top-left) ────────────────────────────────────────────
  // v0.6 P6: faint dark scrim behind the group (padding 6px, radius 4px) so the
  // HUD block reads as a unified element that subordinates to the world.
  const wrapper = makeDiv([
    'position:fixed',
    'top:14px',
    'left:14px',
    'display:flex',
    'flex-direction:column',
    'gap:6px',
    'pointer-events:none',
    'z-index:500',
    'font-family:monospace',
    'background:rgba(10,11,16,0.85)',
    'padding:6px',
    'border-radius:4px',
  ].join(';'));

  // ── Clock ───────────────────────────────────────────────────────────────────
  // v0.6 P6: background removed — scrim is on the wrapper; text-shadow toned down
  // to match the desaturated teal.
  clockEl = makeDiv([
    `color:${TEAL}`,
    'font-size:15px',
    'letter-spacing:0.08em',
    'text-shadow:0 0 6px rgba(56,179,173,0.5)',
    'width:fit-content',
  ].join(';'));
  clockEl.textContent = '07:00';
  wrapper.appendChild(clockEl);

  // ── Bar row factory ─────────────────────────────────────────────────────────
  function makeBar(label: string): HTMLDivElement {
    const row = makeDiv('display:flex;align-items:center;gap:6px');
    const lbl = makeDiv([
      `color:${TEAL}`,
      'font-size:10px',
      'letter-spacing:0.1em',
      'width:44px',
      'text-align:right',
      'opacity:0.7',
    ].join(';'));
    lbl.textContent = label;
    row.appendChild(lbl);

    const track = makeDiv([
      `background:${BAR_BG}`,
      'border:1px solid rgba(70,224,216,0.25)',
      'border-radius:2px',
      'width:110px',
      'height:6px',
      'overflow:hidden',
    ].join(';'));
    const fill = makeDiv([
      `background:${TEAL}`,
      'height:100%',
      'width:100%',
      'border-radius:2px',
      'transition:width 0.3s ease',
    ].join(';'));
    track.appendChild(fill);
    row.appendChild(track);
    wrapper.appendChild(row);
    return fill;
  }

  energyFill = makeBar('ENERGY');
  hungerFill = makeBar('HUNGER');
  document.body.appendChild(wrapper);

  // ── Flight status HUD strip (top-center) — "STREL-7 · T+HH:MM · CRUISE" ──
  // Matches existing HUD language: monospace, cream, letter-spaced, dark backing.
  flightStripEl = makeDiv([
    'position:fixed',
    'top:14px',
    'left:50%',
    'transform:translateX(-50%)',
    'font-family:monospace',
    'font-size:13px',
    'letter-spacing:0.12em',
    'color:#E8E2D4',
    `background:${BAR_BG}`,
    'padding:3px 12px',
    'border-radius:3px',
    'border:1px solid rgba(232,226,212,0.15)',
    'pointer-events:none',
    'z-index:500',
    'white-space:nowrap',
    'text-shadow:0 0 6px rgba(232,226,212,0.3)',
  ].join(';'));
  flightStripEl.textContent = 'STREL-7 · T+07:00 · CRUISE';
  document.body.appendChild(flightStripEl);

  // ── Crosshair (fixed center) ────────────────────────────────────────────────
  crosshairEl = makeDiv([
    'position:fixed',
    'top:50%',
    'left:50%',
    'transform:translate(-50%,-50%)',
    'width:6px',
    'height:6px',
    'border-radius:50%',
    'border:1.5px solid rgba(255,255,255,0.4)',
    'pointer-events:none',
    'z-index:500',
    'transition:border-color 0.15s ease, box-shadow 0.15s ease',
  ].join(';'));
  document.body.appendChild(crosshairEl);

  // ── Interaction prompt (center-bottom) ──────────────────────────────────────
  promptEl = makeDiv([
    'position:fixed',
    'bottom:48px',
    'left:50%',
    'transform:translateX(-50%)',
    `color:${TEAL}`,
    'font-family:monospace',
    'font-size:14px',
    'letter-spacing:0.1em',
    `background:${BAR_BG}`,
    'padding:5px 14px',
    'border-radius:4px',
    'border:1px solid rgba(70,224,216,0.3)',
    'pointer-events:none',
    'z-index:500',
    'display:none',
    'text-shadow:0 0 6px rgba(70,224,216,0.5)',
    'white-space:nowrap',
  ].join(';'));
  document.body.appendChild(promptEl);

  // ── Fade overlay ─────────────────────────────────────────────────────────────
  fadeEl = makeDiv([
    'position:fixed',
    'inset:0',
    'background:black',
    'opacity:0',
    'pointer-events:none',
    'z-index:1000',
    'transition:opacity 0.35s ease',
  ].join(';'));
  document.body.appendChild(fadeEl);

  // ── Toast + overlay elements (delegated to hudOverlay.ts) ──────────────────
  initRoomToast();
  initSaveToast();
  initOverlay();
}

// ── Tick ──────────────────────────────────────────────────────────────────────

export function tickHud(shipMinutes: number, energy: number, hunger: number): void {
  if (clockEl) clockEl.textContent = formatShipClock(shipMinutes);
  if (energyFill) energyFill.style.width = `${Math.round(energy)}%`;
  if (hungerFill)  hungerFill.style.width  = `${Math.round(hunger)}%`;
  if (flightStripEl) {
    flightStripEl.textContent = `STREL-7 · T+${formatShipClock(shipMinutes)} · CRUISE`;
  }
}

// ── Prompt visibility ─────────────────────────────────────────────────────────

export function showPrompt(text: string): void {
  if (!promptEl) return;
  promptEl.textContent = text;
  promptEl.style.display = 'block';
  // Teal crosshair glow when prompt visible
  if (crosshairEl) {
    crosshairEl.style.borderColor = TEAL;
    crosshairEl.style.boxShadow = `0 0 6px ${TEAL}, 0 0 12px rgba(70,224,216,0.4)`;
  }
}

export function clearPrompt(): void {
  if (!promptEl) return;
  promptEl.style.display = 'none';
  // Reset crosshair to neutral
  if (crosshairEl) {
    crosshairEl.style.borderColor = 'rgba(255,255,255,0.4)';
    crosshairEl.style.boxShadow = 'none';
  }
}

// ── Fade transition ───────────────────────────────────────────────────────────

/**
 * Fade to black, call action(), then fade back in.
 * Returns a Promise that resolves when the fade-in completes.
 * Total duration ≈ 2 × fadeMs + holdMs.
 */
export function fadeTransition(
  action: () => void,
  fadeMs = 350,
  holdMs = 250,
): Promise<void> {
  return new Promise((resolve) => {
    if (!fadeEl) { action(); resolve(); return; }

    fadeEl.style.transition = `opacity ${fadeMs}ms ease`;
    fadeEl.style.opacity = '1';

    setTimeout(() => {
      action();
      setTimeout(() => {
        if (fadeEl) {
          fadeEl.style.transition = `opacity ${fadeMs}ms ease`;
          fadeEl.style.opacity = '0';
        }
        setTimeout(resolve, fadeMs);
      }, holdMs);
    }, fadeMs);
  });
}
