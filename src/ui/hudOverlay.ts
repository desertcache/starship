/**
 * src/ui/hudOverlay.ts — Room toast, lore/console overlay, save toast.
 * Imported exclusively by hud.ts. Not used anywhere else directly.
 *
 * Palette: cream #E8E2D4, teal #46E0D8, gunmetal #1C1E22
 */

const TEAL    = '#46E0D8';
const CREAM   = '#E8E2D4';
const GUNMETAL = '#1C1E22';
const TOAST_BG = 'rgba(28,30,34,0.82)';

/** When ?toasts=0 is in the URL, room toasts are suppressed (verify harness use). */
const TOASTS_ENABLED: boolean = (() => {
  if (typeof window === 'undefined') return true;
  return new URLSearchParams(window.location.search).get('toasts') !== '0';
})();

function makeDiv(styles: string): HTMLDivElement {
  const d = document.createElement('div');
  d.style.cssText = styles;
  return d;
}

// ── Room toast ─────────────────────────────────────────────────────────────────

let toastEl: HTMLDivElement | null = null;
let _toastTimer: ReturnType<typeof setTimeout> | null = null;

export function initRoomToast(): void {
  toastEl = makeDiv([
    'position:fixed',
    'top:18%',
    'left:50%',
    'transform:translateX(-50%)',
    `color:${CREAM}`,
    'font-family:monospace',
    'font-size:18px',
    'letter-spacing:0.15em',
    `background:${TOAST_BG}`,
    'padding:8px 20px',
    'border-radius:4px',
    'pointer-events:none',
    'z-index:510',
    'opacity:0',
    'transition:opacity 0.2s ease',
    'white-space:nowrap',
  ].join(';'));
  document.body.appendChild(toastEl);
}

/**
 * Show a centered room name toast.
 * Fade-in 200ms / hold 2s / fade-out 400ms.
 *
 * @param name - The room name string to display (e.g. "COCKPIT", "GALLEY")
 */
export function showRoomToast(name: string): void {
  if (!toastEl || !TOASTS_ENABLED) return;
  if (_toastTimer !== null) { clearTimeout(_toastTimer); _toastTimer = null; }
  toastEl.textContent = name;
  toastEl.style.transition = 'opacity 0.2s ease';
  toastEl.style.opacity = '1';
  _toastTimer = setTimeout(() => {
    if (!toastEl) return;
    toastEl.style.transition = 'opacity 0.4s ease';
    toastEl.style.opacity = '0';
    _toastTimer = null;
  }, 2200);
}

// ── Save toast ─────────────────────────────────────────────────────────────────

let saveToastEl: HTMLDivElement | null = null;
let _saveToastTimer: ReturnType<typeof setTimeout> | null = null;

export function initSaveToast(): void {
  saveToastEl = makeDiv([
    'position:fixed',
    'bottom:80px',
    'left:50%',
    'transform:translateX(-50%)',
    `color:${TEAL}`,
    'font-family:monospace',
    'font-size:12px',
    'letter-spacing:0.15em',
    `background:${TOAST_BG}`,
    'padding:5px 14px',
    'border-radius:4px',
    'border:1px solid rgba(70,224,216,0.3)',
    'pointer-events:none',
    'z-index:510',
    'opacity:0',
    'transition:opacity 0.2s ease',
    'white-space:nowrap',
  ].join(';'));
  saveToastEl.textContent = '-- SAVED --';
  document.body.appendChild(saveToastEl);
}

/**
 * Show a brief toast at bottom center.
 * @param message - Text to display (default '-- SAVED --').
 */
export function showSaveToast(message = '-- SAVED --'): void {
  if (!saveToastEl) return;
  if (_saveToastTimer !== null) { clearTimeout(_saveToastTimer); _saveToastTimer = null; }
  saveToastEl.textContent = message;
  saveToastEl.style.transition = 'opacity 0.15s ease';
  saveToastEl.style.opacity = '1';
  _saveToastTimer = setTimeout(() => {
    if (!saveToastEl) return;
    saveToastEl.style.transition = 'opacity 0.3s ease';
    saveToastEl.style.opacity = '0';
    _saveToastTimer = null;
  }, 1000);
}

// ── Lore / console overlay ─────────────────────────────────────────────────────

let overlayEl: HTMLDivElement | null = null;
let overlayTitleEl: HTMLDivElement | null = null;
let overlayBodyEl: HTMLDivElement | null = null;

// v1.2.1 (ship lane, ultrareview r1 P2): the single close path every overlay
// owner routes through now. An owner that needs cleanup on close (removing
// its own keydown listener, resetting a mode) passes onClose to showOverlay
// and gets it called back from exactly one place: hideOverlay(). That covers
// every way an overlay can go away — the internal Escape listener below, the
// [ESC] label click, or a DIFFERENT owner's showOverlay() replacing this one
// — where previously an owner's cleanup ran ONLY from inside its own
// Escape-key branch, so the breaker cabinet's and console-bank's keydown
// handlers survived every other close path and kept firing on stray 1/2/
// Escape presses forever after (interactItems.ts, interactWiring.ts).
let _activeCloseHandler: (() => void) | null = null;

export function initOverlay(): void {
  overlayEl = makeDiv([
    'position:fixed',
    'top:50%',
    'left:50%',
    'transform:translate(-50%,-50%)',
    `background:${GUNMETAL}`,
    'border:1px solid rgba(70,224,216,0.4)',
    'border-radius:6px',
    'padding:24px 28px',
    'min-width:360px',
    'max-width:600px',
    'max-height:70vh',
    'overflow-y:auto',
    'z-index:600',
    'display:none',
    'font-family:monospace',
    `color:${CREAM}`,
    'box-shadow:0 0 24px rgba(70,224,216,0.15)',
  ].join(';'));

  overlayTitleEl = makeDiv([
    `color:${TEAL}`,
    'font-size:15px',
    'letter-spacing:0.12em',
    'margin-bottom:16px',
    'border-bottom:1px solid rgba(70,224,216,0.25)',
    'padding-bottom:8px',
  ].join(';'));

  overlayBodyEl = makeDiv([
    'font-size:13px',
    'line-height:1.65',
    'letter-spacing:0.04em',
    `color:${CREAM}`,
    'opacity:0.9',
  ].join(';'));

  const closeBtn = makeDiv([
    'position:absolute',
    'top:12px',
    'right:14px',
    `color:${TEAL}`,
    'font-family:monospace',
    'font-size:12px',
    'letter-spacing:0.1em',
    'cursor:pointer',
    'opacity:0.7',
    'pointer-events:auto',
  ].join(';'));
  closeBtn.textContent = '[ESC]';
  closeBtn.addEventListener('click', hideOverlay);

  overlayEl.appendChild(overlayTitleEl);
  overlayEl.appendChild(overlayBodyEl);
  overlayEl.appendChild(closeBtn);
  document.body.appendChild(overlayEl);

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'Escape' && overlayEl && overlayEl.style.display !== 'none') {
      hideOverlay();
    }
  });
}

/**
 * Show the overlay panel.
 * bodyLines is an array of plain-text strings rendered as safe <p> elements.
 *
 * @param title     - Overlay header (monospace teal)
 * @param bodyLines - Plain-text paragraphs (no HTML injection)
 * @param onClose   - Optional cleanup, called exactly once when THIS
 *                    overlay closes (Escape, the [ESC] label, or a
 *                    different owner's showOverlay() replacing it).
 *                    Re-showing with the SAME onClose reference (e.g.
 *                    cycling console-bank modes on repeated E, or the
 *                    breaker re-rendering its panel after a Digit1/Digit2
 *                    press) is treated as the same owner and does NOT fire it.
 */
export function showOverlay(title: string, bodyLines: string[], onClose?: () => void): void {
  if (!overlayEl || !overlayTitleEl || !overlayBodyEl) return;

  const incoming = onClose ?? null;
  if (_activeCloseHandler && _activeCloseHandler !== incoming) {
    const prev = _activeCloseHandler;
    _activeCloseHandler = null; // clear first — prev() may itself show/hide
    prev();
  }
  _activeCloseHandler = incoming;

  overlayTitleEl.textContent = title;

  while (overlayBodyEl.firstChild) overlayBodyEl.removeChild(overlayBodyEl.firstChild);
  for (const line of bodyLines) {
    const p = document.createElement('p');
    p.style.cssText = 'margin:0 0 8px 0';
    p.textContent = line;
    overlayBodyEl.appendChild(p);
  }
  overlayEl.style.display = 'block';
}

/** Hide the overlay panel and fire the active owner's onClose (if any), once. */
export function hideOverlay(): void {
  if (!overlayEl) return;
  overlayEl.style.display = 'none';
  const cb = _activeCloseHandler;
  _activeCloseHandler = null;
  if (cb) cb();
}

/** Test-only (core/testHooksShip.ts): whether the lore/console overlay is
 *  currently visible — for proving a close path actually closed it. */
export function isOverlayVisibleForTest(): boolean {
  return !!overlayEl && overlayEl.style.display !== 'none';
}

/** Test-only: the overlay's current title, '' while hidden — e.g. asserting
 *  the console-bank cycle actually shows 'CONSOLE — NAV/SYSTEMS/PLANET SCAN'. */
export function getOverlayTitleForTest(): string {
  if (!overlayEl || overlayEl.style.display === 'none') return '';
  return overlayTitleEl?.textContent ?? '';
}
