/**
 * src/world/portalRoomSocket.ts — Stage D relic-socket "ignition" wiring.
 *
 * Lights a relic socket ring when its world's relic is held. EMISSIVE SWAP
 * ONLY (the positional light pool is full): the ring mesh swaps to a
 * filled-glow texture variant + a boosted biome tint that clears the 0.84
 * bloom threshold (toneMapped:false upstream). A texture swap is required —
 * the dim rune ring's thin 0.22-alpha strokes mipmap-dilute to ~5% effective
 * alpha at the hero camera's grazing angle, so no color multiplier alone can
 * make the lit state read (measured on portal-room-ignited.png crops).
 *
 * State-driven per frame off getCodex() (never event-driven): reacts live on
 * pickup AND resolves correctly on a loadState() reload where no pickup
 * event ever fired this session. Swaps only on state CHANGE (no per-frame
 * material churn). Both textures stay non-null so no shader recompile.
 */
import * as THREE from 'three';
import { cached } from '../fx/textureHelpers.js';
import { getCodex } from '../core/state.js';
import type { WorldId } from '../core/worldTypes.js';

const LIT_S = 128;

/** Filled glow disc + bright rim in the biome tint — the "relic seated" look.
 *  High alpha coverage so it survives mip minification at grazing angles. */
function makeRelicSocketLitTexture(tintHex: string): THREE.CanvasTexture {
  return cached(`portal-relic-socket-lit-${tintHex}`, () => {
    const cv = document.createElement('canvas');
    cv.width = LIT_S; cv.height = LIT_S;
    const ctx = cv.getContext('2d')!;
    const c = LIT_S / 2;

    ctx.clearRect(0, 0, LIT_S, LIT_S);
    const glow = ctx.createRadialGradient(c, c, 2, c, c, LIT_S * 0.46);
    glow.addColorStop(0.0, 'rgba(255,255,255,0.95)');
    glow.addColorStop(0.35, `${tintHex}E6`); // tint @ ~0.9 alpha
    glow.addColorStop(0.8, `${tintHex}66`);  // tint @ ~0.4 alpha
    glow.addColorStop(1.0, `${tintHex}00`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, LIT_S, LIT_S);

    // Bright rim ring — the rune dial, now fully energized
    ctx.strokeStyle = '#FFFFFF';
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(c, c, LIT_S * 0.40, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, true);
}

/** Attach the state-driven lit/dim swap to a socket ring mesh. */
export function attachRelicSocketGlow(
  ring: THREE.Mesh,
  ringMat: THREE.MeshBasicMaterial,
  worldId: WorldId,
  tintHex: string,
  pulseHex: number,
): void {
  const dimMap = ringMat.map;
  const litMap = makeRelicSocketLitTexture(tintHex);
  // F12 (Stage E): ignition under-registered — brighter emissive-only ramp
  // (2.5→3.3), no new lights.
  const litColor = new THREE.Color(pulseHex).multiplyScalar(3.3);
  let litState = false;
  ring.onBeforeRender = (): void => {
    const lit = getCodex().relics.includes(worldId);
    if (lit === litState) return;
    litState = lit;
    ringMat.map = lit ? litMap : dimMap;
    ringMat.color.set(lit ? litColor : new THREE.Color(0xffffff));
  };
}
