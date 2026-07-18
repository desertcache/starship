/**
 * src/flight/helmInput.ts — scoped keyboard/mouse listeners for HELM mode
 * (design doc D2, Lane B). Registered by helm.ts's enterHelm(), removed by
 * its teardown — nothing here fires unless the pilot is seated at the helm.
 *
 * Writer-conflict rule (important): this module must NEVER unconditionally
 * push a "no input" value every frame, or it would fight any other writer of
 * FlightInput (TestAPI's setFlightInput, used throughout scripts/verify.mjs's
 * T13a) — headless has no pointer lock and no real key events, so a naive
 * always-push design would zero the test's throttle/yaw right back out one
 * frame after it set them. Instead:
 *   - Discrete holds (roll trim, throttleDelta, boost) are pushed ONLY from
 *     the keydown/keyup handlers themselves (event-driven) — if no real key
 *     event ever fires, these fields are never touched.
 *   - The continuous pitch/yaw channel (mouse stick + arrow backup) is only
 *     pushed by tickHelmInput() while genuinely ACTIVE (stick magnitude above
 *     an epsilon, or an arrow key held); the instant it settles back to rest
 *     it pushes one final {pitch:0,yaw:0} and then goes idle, touching
 *     neither field again until reactivated.
 * Mouse, keys, and TestAPI stay interchangeable (design doc D2) because idle
 * channels simply step out of the way instead of asserting zero forever.
 */
import { damp } from '../core/damp.js';
import { setFlightInput, setThrottle, setFlightView, getView } from './flightState.js';
import { HELM_MOUSE_SENS, HELM_STICK_DECAY_LAMBDA } from './flightTuning.js';
import { toggleApproachAssist, approachNoteManualInput, isApproachAssistEngaged } from './approach.js'; // v1.1 SOVEREIGN Stage 4 (Lane E)

const STICK_EPS = 1e-3;

function clamp1(v: number): number {
  return v < -1 ? -1 : v > 1 ? 1 : v;
}

// ── Virtual analog stick (mouse) — spring-decays toward 0 every tick. ───────
let stickX = 0; // yaw, -1..1
let stickY = 0; // pitch, -1..1
let stickChannelActive = false; // was pitch/yaw pushed last tick?

// ── Digital holds (keyboard) — pushed directly on key events, never per-tick. ─
const held = {
  rollLeft: false, rollRight: false,
  throttleUp: false, throttleDown: false,
  pitchUp: false, pitchDown: false,
  yawLeft: false, yawRight: false,
  // Left/right Shift tracked separately: a single boolean would cancel boost
  // when EITHER key is released while the other is still held.
  boostL: false, boostR: false,
};

function pushHolds(): void {
  setFlightInput({
    roll: (held.rollRight ? 1 : 0) - (held.rollLeft ? 1 : 0),
    throttleDelta: (held.throttleUp ? 1 : 0) - (held.throttleDown ? 1 : 0),
    boost: held.boostL || held.boostR,
  });
}

// SIGN CONVENTION (matches flightModel's local-axis integration): positive
// yaw input rotates the nose LEFT (+Y right-hand rule), positive pitch input
// rotates the nose UP (+X right-hand rule) — T11 exercises exactly this. The
// INPUT layer therefore maps the pilot's intent onto those signs:
//   mouse right  → nose right  → NEGATIVE yaw
//   mouse down   → pull back   → nose up → POSITIVE pitch (flight-sim style)
function onMouseMove(e: MouseEvent): void {
  if (document.pointerLockElement === null) return;
  approachNoteManualInput(); // real stick input — drops F-assist (NMS behavior)
  stickX = clamp1(stickX - e.movementX * HELM_MOUSE_SENS);
  stickY = clamp1(stickY + e.movementY * HELM_MOUSE_SENS);
}

function onKeyDown(e: KeyboardEvent): void {
  switch (e.code) {
    case 'KeyA': held.rollLeft = true; pushHolds(); break;
    case 'KeyD': held.rollRight = true; pushHolds(); break;
    case 'KeyW': held.throttleUp = true; pushHolds(); break;
    case 'KeyS': held.throttleDown = true; pushHolds(); break;
    case 'ShiftLeft': held.boostL = true; pushHolds(); break;
    case 'ShiftRight': held.boostR = true; pushHolds(); break;
    case 'KeyX': setThrottle(0); break;
    // e.repeat guard: OS key-repeat on a held V would thrash the view every
    // repeat event, corrupting the stored enter/exit camera pose.
    case 'KeyV': if (!e.repeat) setFlightView(getView() === 'interior' ? 'exterior' : 'interior'); break;
    case 'KeyF': if (!e.repeat) toggleApproachAssist(); break;
    case 'ArrowUp': held.pitchUp = true; approachNoteManualInput(); break;
    case 'ArrowDown': held.pitchDown = true; approachNoteManualInput(); break;
    case 'ArrowLeft': held.yawLeft = true; approachNoteManualInput(); break;
    case 'ArrowRight': held.yawRight = true; approachNoteManualInput(); break;
  }
}

function onKeyUp(e: KeyboardEvent): void {
  switch (e.code) {
    case 'KeyA': held.rollLeft = false; pushHolds(); break;
    case 'KeyD': held.rollRight = false; pushHolds(); break;
    case 'KeyW': held.throttleUp = false; pushHolds(); break;
    case 'KeyS': held.throttleDown = false; pushHolds(); break;
    case 'ShiftLeft': held.boostL = false; pushHolds(); break;
    case 'ShiftRight': held.boostR = false; pushHolds(); break;
    case 'ArrowUp': held.pitchUp = false; break;
    case 'ArrowDown': held.pitchDown = false; break;
    case 'ArrowLeft': held.yawLeft = false; break;
    case 'ArrowRight': held.yawRight = false; break;
  }
}

let attached = false;

/** Register scoped helm listeners. Safe to call once per enterHelm(). */
export function attachHelmInput(): void {
  if (attached) return;
  attached = true;
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}

/** Remove scoped helm listeners and reset all held/stick state (teardown). */
export function detachHelmInput(): void {
  if (!attached) return;
  attached = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  stickX = 0;
  stickY = 0;
  stickChannelActive = false;
  held.rollLeft = held.rollRight = false;
  held.throttleUp = held.throttleDown = false;
  held.pitchUp = held.pitchDown = false;
  held.yawLeft = held.yawRight = false;
  held.boostL = held.boostR = false;
}

/** Per-frame: decay the mouse stick and push the combined pitch/yaw ONLY
 *  while genuinely active (see writer-conflict note above). Discrete holds
 *  (roll/throttle/boost) are pushed entirely from the key handlers, not here. */
export function tickHelmInput(dt: number): void {
  if (!attached) return;

  // While F-assist owns the pitch/yaw channel, the stale decaying stick must
  // not overwrite its steering (fresh REAL input disengages the assist via
  // approachNoteManualInput before this ever runs again). Drop our state so
  // the handoff back is clean.
  if (isApproachAssistEngaged()) {
    stickX = 0;
    stickY = 0;
    stickChannelActive = false;
    return;
  }

  stickX = damp(stickX, 0, HELM_STICK_DECAY_LAMBDA, dt);
  stickY = damp(stickY, 0, HELM_STICK_DECAY_LAMBDA, dt);
  if (Math.abs(stickX) < STICK_EPS) stickX = 0;
  if (Math.abs(stickY) < STICK_EPS) stickY = 0;

  const arrowActive = held.pitchUp || held.pitchDown || held.yawLeft || held.yawRight;
  const stickActive = stickX !== 0 || stickY !== 0;

  if (!arrowActive && !stickActive) {
    if (stickChannelActive) {
      setFlightInput({ pitch: 0, yaw: 0 });
      stickChannelActive = false;
    }
    return;
  }
  stickChannelActive = true;

  // Arrow signs follow the same convention as the mouse (see onMouseMove):
  // ArrowRight = nose right = negative yaw; ArrowUp = push forward = nose
  // down = negative pitch (ArrowDown pulls back = nose up).
  const arrowYaw = (held.yawLeft ? 1 : 0) - (held.yawRight ? 1 : 0);
  const arrowPitch = (held.pitchDown ? 1 : 0) - (held.pitchUp ? 1 : 0);
  setFlightInput({
    pitch: clamp1(stickY + arrowPitch),
    yaw: clamp1(stickX + arrowYaw),
  });
}
