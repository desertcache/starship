/**
 * src/ui/flightHud.ts — helm overlay (Lane B, design doc D2 / §6 T13a). Shown
 * only while `getFlight().helmActive` is true; reads the FlightSnapshot once
 * per tick and drives both this panel and hud.ts's flight-strip override.
 * Styled to match hud.ts's existing aesthetic (monospace, cream #E8E2D4,
 * dark scrim) so the two HUD layers read as one system.
 */
import { getFlight } from '../flight/flightState.js';
import { MAX_SPEED_CRUISE } from '../flight/flightTuning.js';
import { setFlightStripText, showPrompt, clearPrompt } from './hud.js';

const CREAM = '#E8E2D4';
const TEAL = '#38B3AD';
const PANEL_BG = 'rgba(10,11,16,0.85)';

let panelEl: HTMLDivElement | null = null;
let speedEl: HTMLDivElement | null = null;
let hdgEl: HTMLDivElement | null = null;
let throttleFill: HTMLDivElement | null = null;
let throttlePctEl: HTMLDivElement | null = null;
let modeEl: HTMLDivElement | null = null;
let viewEl: HTMLDivElement | null = null;
let distRow: HTMLDivElement | null = null;
let distEl: HTMLDivElement | null = null;

// v1.2 LANDFALL Stage 1 — tracks whether WE currently own hud.ts's shared
// interaction-prompt element, so tickFlightHud only calls showPrompt/
// clearPrompt on an actual state CHANGE (never every frame) and never stomps
// a normal proximity-interact prompt while it isn't ours to hold.
let landPromptShown = false;

function makeDiv(styles: string): HTMLDivElement {
  const d = document.createElement('div');
  d.style.cssText = styles;
  return d;
}

/** Label + value row, matching hud.ts's bar-row rhythm (label fixed-width,
 *  right-hand value). Returns the value element for the caller to update. */
function makeRow(parent: HTMLDivElement, label: string): HTMLDivElement {
  const row = makeDiv('display:flex;align-items:center;gap:8px');
  const lbl = makeDiv([
    `color:${TEAL}`, 'font-size:10px', 'letter-spacing:0.1em',
    'width:48px', 'opacity:0.75',
  ].join(';'));
  lbl.textContent = label;
  row.appendChild(lbl);
  const value = makeDiv([`color:${CREAM}`, 'font-size:13px', 'letter-spacing:0.06em'].join(';'));
  row.appendChild(value);
  parent.appendChild(row);
  return value;
}

/** Build the (hidden) helm overlay once at boot. */
export function initFlightHud(): void {
  panelEl = makeDiv([
    'position:fixed', 'bottom:80px', 'left:50%', 'transform:translateX(-50%)',
    'display:none', 'flex-direction:column', 'gap:4px',
    'padding:8px 12px', 'border-radius:4px',
    `background:${PANEL_BG}`, 'border:1px solid rgba(232,226,212,0.15)',
    'font-family:monospace', 'pointer-events:none', 'z-index:500',
  ].join(';'));

  speedEl = makeRow(panelEl, 'SPEED');
  hdgEl = makeRow(panelEl, 'HDG');

  const throttleRow = makeDiv('display:flex;align-items:center;gap:8px');
  const throttleLbl = makeDiv([
    `color:${TEAL}`, 'font-size:10px', 'letter-spacing:0.1em', 'width:48px', 'opacity:0.75',
  ].join(';'));
  throttleLbl.textContent = 'THR';
  throttleRow.appendChild(throttleLbl);
  const throttleTrack = makeDiv([
    `background:${PANEL_BG}`, 'border:1px solid rgba(56,179,173,0.3)', 'border-radius:2px',
    'width:90px', 'height:7px', 'overflow:hidden',
  ].join(';'));
  throttleFill = makeDiv([`background:${TEAL}`, 'height:100%', 'width:0%'].join(';'));
  throttleTrack.appendChild(throttleFill);
  throttleRow.appendChild(throttleTrack);
  throttlePctEl = makeDiv([`color:${CREAM}`, 'font-size:11px'].join(';'));
  throttleRow.appendChild(throttlePctEl);
  panelEl.appendChild(throttleRow);

  modeEl = makeRow(panelEl, 'MODE');
  viewEl = makeRow(panelEl, 'VIEW');

  // DIST row (v1.1 SOVEREIGN Stage 4, Lane E) — only shown while an approach
  // snapshot exists (tickFlightHud toggles display); starts hidden.
  distRow = makeDiv('display:none;align-items:center;gap:8px');
  const distLbl = makeDiv([
    `color:${TEAL}`, 'font-size:10px', 'letter-spacing:0.1em', 'width:48px', 'opacity:0.75',
  ].join(';'));
  distLbl.textContent = 'DIST';
  distRow.appendChild(distLbl);
  distEl = makeDiv([`color:${CREAM}`, 'font-size:13px', 'letter-spacing:0.06em'].join(';'));
  distRow.appendChild(distEl);
  panelEl.appendChild(distRow);

  // Keybind legend — the V chase view shipped invisible (no hint anywhere);
  // every helm binding earns a permanent one-line legend.
  const legend = makeDiv([
    `color:${TEAL}`, 'font-size:9px', 'letter-spacing:0.08em', 'opacity:0.55',
    'margin-top:3px', 'white-space:nowrap',
  ].join(';'));
  legend.textContent = 'V VIEW · W/S THR · SHIFT BOOST · X STOP · A/D ROLL · E STAND · F ASSIST · L LAND';
  panelEl.appendChild(legend);

  document.body.appendChild(panelEl);
}

/** Per-frame tick (main.ts, right after tickFlight). Hides the panel and
 *  clears the flight-strip override the instant helm goes inactive. */
export function tickFlightHud(): void {
  const snap = getFlight();
  if (!snap.helmActive) {
    if (panelEl) panelEl.style.display = 'none';
    setFlightStripText(null);
    // v1.2 LANDFALL Stage 1 — helm-gated LAND prompt (see below): the
    // autopilot can hold HOLD after an E-stand (stand-up autopilot, helm.ts),
    // so this prompt must not linger over whatever the player walks up to.
    if (landPromptShown) {
      clearPrompt();
      landPromptShown = false;
    }
    return;
  }
  if (panelEl) panelEl.style.display = 'flex';

  // No dedicated BOOST field on FlightSnapshot — speed clearing cruise max
  // is the observable proxy (throttle×BOOST_MULT is the only way past it).
  const boosting = snap.speed > MAX_SPEED_CRUISE * 1.02;
  const modeTag = boosting ? 'BOOST' : snap.mode;
  const heading3 = String(Math.round(snap.headingDeg)).padStart(3, '0');
  const throttlePct = Math.round(snap.throttle * 100);

  if (speedEl) speedEl.textContent = `${snap.speed.toFixed(1)} U/S`;
  if (hdgEl) hdgEl.textContent = `${heading3}°`;
  if (throttleFill) throttleFill.style.width = `${throttlePct}%`;
  if (throttlePctEl) throttlePctEl.textContent = `${throttlePct}%`;
  if (modeEl) modeEl.textContent = modeTag;
  if (viewEl) viewEl.textContent = snap.view.toUpperCase();

  // v1.1 SOVEREIGN Stage 4 (Lane E) — DIST row, visible only while the
  // destination planet is live (approach snapshot non-null). Distance
  // formatted in the same "km" convention interactConsole.ts's scan HUD uses.
  if (snap.approach) {
    if (distRow) distRow.style.display = 'flex';
    if (distEl) distEl.textContent = `${snap.approach.targetName} · ${Math.round(snap.approach.trueDist).toLocaleString('en-US')} km`;
  } else if (distRow) {
    distRow.style.display = 'none';
  }

  // v1.2 LANDFALL Stage 1 — LAND prompt, live only at HOLD AND while helm is
  // active (the guard above already clears it the instant helmActive drops,
  // covering the stand-up-during-hold case). requestLanding() itself still
  // declines while the 'landfall' world is unregistered — this prompt is
  // purely a UX seam, not a promise the press will do anything yet.
  if (snap.approach?.holdEngaged) {
    if (!landPromptShown) {
      showPrompt('LAND  [L]');
      landPromptShown = true;
    }
  } else if (landPromptShown) {
    clearPrompt();
    landPromptShown = false;
  }

  setFlightStripText(`STREL-7 · HELM · ${snap.speed.toFixed(1)} U/S · HDG ${heading3}°`);
}
