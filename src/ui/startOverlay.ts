/**
 * src/ui/startOverlay.ts — First-boot "click to start" overlay.
 *
 * A DOM overlay (not WebGL) shown once at boot so a first-time visitor
 * (portfolio iframe embed, GitHub Pages) knows to click to capture the
 * mouse and knows the controls before touching anything. Every element is
 * pointer-events:none — the overlay never intercepts the click; it passes
 * straight through to the canvas, which already has its own click handler
 * that requests pointer lock (see player/controller.ts).
 *
 * CRITICAL: gated on navigator.webdriver. If true, this creates NO DOM at
 * all, so the Playwright verify harness (functional tests + art
 * screenshots) never sees the overlay and stays byte-for-byte untouched.
 *
 * Palette: cream #E8E2D4, teal #46E0D8, trim #C7641E, space #0A0B10
 * (see hudOverlay.ts for the same convention).
 */

const CREAM = '#E8E2D4';
const TEAL  = '#46E0D8';
const TRIM  = '#C7641E';

const STYLE_ID = 'start-overlay-style';
const FADE_MS = 400;

/** Injects the pulse keyframes + reduced-motion override once. */
function injectStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes start-overlay-pulse {
      0%, 100% { opacity: 0.4; }
      50%      { opacity: 1; }
    }
    .start-overlay-prompt {
      animation: start-overlay-pulse 1.8s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .start-overlay-prompt { animation: none; opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

function makeDiv(styles: string): HTMLDivElement {
  const d = document.createElement('div');
  d.style.cssText = styles;
  return d;
}

/**
 * Mount the click-to-start overlay.
 *
 * No-ops entirely (creates zero DOM) when navigator.webdriver is true, so
 * the headless verify harness is unaffected. Dismisses itself on the first
 * pointerdown or keydown anywhere on the page: fades out over ~400ms, then
 * removes itself from the DOM.
 */
export function initStartOverlay(): void {
  if (navigator.webdriver) return;

  injectStyle();

  const scrim = makeDiv([
    'position:fixed',
    'inset:0',
    'background:radial-gradient(ellipse at center, rgba(4,6,10,0.42) 0%, rgba(4,6,10,0.75) 100%)',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'pointer-events:none',
    'z-index:700',
    'opacity:1',
    `transition:opacity ${FADE_MS}ms ease`,
  ].join(';'));

  const block = makeDiv([
    'display:flex',
    'flex-direction:column',
    'align-items:center',
    'text-align:center',
    'font-family:monospace',
    'pointer-events:none',
    'gap:14px',
    'padding:32px 40px',
  ].join(';'));

  const title = makeDiv([
    `color:${CREAM}`,
    'font-size:32px',
    'letter-spacing:0.26em',
    'font-weight:700',
    'text-shadow:0 0 20px rgba(70,224,216,0.35)',
  ].join(';'));
  title.textContent = 'STARSHIP EXPLORER';

  const subLine = makeDiv([
    `color:${TRIM}`,
    'font-size:12px',
    'letter-spacing:0.4em',
    'opacity:0.85',
  ].join(';'));
  subLine.textContent = '— STREL-7 —';

  const divider = makeDiv([
    'width:240px',
    'height:1px',
    'background:rgba(70,224,216,0.35)',
    'margin:4px 0',
  ].join(';'));

  const legend = makeDiv([
    `color:${TEAL}`,
    'font-size:12px',
    'letter-spacing:0.06em',
    'opacity:0.85',
  ].join(';'));
  legend.textContent = 'WASD — move  ·  MOUSE — look (click to capture)  ·  E — interact  ·  ` — debug';

  const prompt = makeDiv([
    `color:${CREAM}`,
    'font-size:14px',
    'letter-spacing:0.3em',
    'margin-top:8px',
  ].join(';'));
  prompt.className = 'start-overlay-prompt';
  prompt.textContent = 'CLICK TO BOARD';

  block.appendChild(title);
  block.appendChild(subLine);
  block.appendChild(divider);
  block.appendChild(legend);
  block.appendChild(prompt);
  scrim.appendChild(block);
  document.body.appendChild(scrim);

  const dismiss = (): void => {
    window.removeEventListener('pointerdown', dismiss);
    window.removeEventListener('keydown', dismiss);
    scrim.style.opacity = '0';
    setTimeout(() => scrim.remove(), FADE_MS);
  };

  window.addEventListener('pointerdown', dismiss);
  window.addEventListener('keydown', dismiss);
}
