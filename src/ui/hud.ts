/**
 * src/ui/hud.ts — Minimal sci-fi HUD (Phase 4).
 *
 * Elements:
 *   • Ship clock  — top-left, monospace, teal
 *   • Energy bar  — top-left below clock, teal #46E0D8 fill on dark bg
 *   • Hunger bar  — top-left below energy
 *   • Interaction prompt — center-bottom, appears only when something is targeted
 *
 * The fade overlay (DOM) is also created here for sleep/eat transitions.
 */

import { formatShipClock } from '../core/state.js';

// ── DOM elements ──────────────────────────────────────────────────────────────

let clockEl: HTMLDivElement | null = null;
let energyFill: HTMLDivElement | null = null;
let hungerFill: HTMLDivElement | null = null;
let promptEl: HTMLDivElement | null = null;
let fadeEl: HTMLDivElement | null = null;

const TEAL = '#46E0D8';
const BAR_BG = 'rgba(10,11,16,0.85)';

function makeDiv(styles: string): HTMLDivElement {
  const d = document.createElement('div');
  d.style.cssText = styles;
  return d;
}

export function initHud(): void {
  // ── Wrapper container (top-left) ────────────────────────────────────────────
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
  ].join(';'));

  // ── Clock ───────────────────────────────────────────────────────────────────
  clockEl = makeDiv([
    `color:${TEAL}`,
    'font-size:15px',
    'letter-spacing:0.08em',
    'text-shadow:0 0 8px rgba(70,224,216,0.6)',
    `background:${BAR_BG}`,
    'padding:3px 8px',
    'border-radius:3px',
    'width:fit-content',
  ].join(';'));
  clockEl.textContent = '07:00';
  wrapper.appendChild(clockEl);

  // ── Bar row factory ─────────────────────────────────────────────────────────
  function makeBar(label: string): HTMLDivElement {
    const row = makeDiv([
      'display:flex',
      'align-items:center',
      'gap:6px',
    ].join(';'));

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
}

// ── Tick ──────────────────────────────────────────────────────────────────────

export function tickHud(shipMinutes: number, energy: number, hunger: number): void {
  if (clockEl) clockEl.textContent = formatShipClock(shipMinutes);
  if (energyFill) energyFill.style.width = `${Math.round(energy)}%`;
  if (hungerFill)  hungerFill.style.width  = `${Math.round(hunger)}%`;
}

// ── Prompt visibility ─────────────────────────────────────────────────────────

export function showPrompt(text: string): void {
  if (!promptEl) return;
  promptEl.textContent = text;
  promptEl.style.display = 'block';
}

export function clearPrompt(): void {
  if (!promptEl) return;
  promptEl.style.display = 'none';
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
