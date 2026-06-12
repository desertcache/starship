import * as THREE from 'three';

interface DebugState {
  visible: boolean;
  overlay: HTMLDivElement | null;
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  lastFpsSamples: number[];
  lastTimestamp: number;
}

const state: DebugState = {
  visible: false,
  overlay: null,
  renderer: null,
  camera: null,
  lastFpsSamples: [],
  lastTimestamp: performance.now(),
};

function createOverlay(): HTMLDivElement {
  const div = document.createElement('div');
  div.id = 'debug-overlay';
  div.style.cssText = [
    'position:fixed',
    'top:8px',
    'left:8px',
    'background:rgba(0,0,0,0.65)',
    'color:#46E0D8',
    'font:13px/1.5 monospace',
    'padding:6px 10px',
    'border-radius:4px',
    'pointer-events:none',
    'z-index:9999',
    'white-space:pre',
    'display:none',
  ].join(';');
  document.body.appendChild(div);
  return div;
}

export function initDebug(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
): void {
  state.renderer = renderer;
  state.camera = camera;
  state.overlay = createOverlay();

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === '`') {
      state.visible = !state.visible;
      if (state.overlay) {
        state.overlay.style.display = state.visible ? 'block' : 'none';
      }
    }
  });
}

export function tickDebug(now: number): void {
  if (!state.visible || !state.overlay) return;

  const dt = now - state.lastTimestamp;
  state.lastTimestamp = now;

  if (dt > 0 && dt < 500) {
    state.lastFpsSamples.push(dt);
    if (state.lastFpsSamples.length > 60) {
      state.lastFpsSamples.shift();
    }
  }

  const avgDt = state.lastFpsSamples.length > 0
    ? state.lastFpsSamples.reduce((s, v) => s + v, 0) / state.lastFpsSamples.length
    : 16.67;
  const fps = Math.round(1000 / avgDt);

  const info = state.renderer?.info;
  const calls = info?.render.calls ?? 0;
  const tris = info?.render.triangles ?? 0;

  const pos = state.camera?.position;
  const px = pos ? pos.x.toFixed(1) : '?';
  const py = pos ? pos.y.toFixed(1) : '?';
  const pz = pos ? pos.z.toFixed(1) : '?';

  state.overlay.textContent = [
    `FPS: ${fps}`,
    `Draws: ${calls}`,
    `Tris: ${tris.toLocaleString()}`,
    `Pos: (${px}, ${py}, ${pz})`,
  ].join('\n');
}
