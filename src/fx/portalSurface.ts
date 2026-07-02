/**
 * src/fx/portalSurface.ts — portal surfaces + the shared live-preview tier.
 *
 * Three tiers (docs design "Portals"):
 *   1. Dormant swirl (always) — see portalShader.ts.
 *   2. Live preview — ONE shared half-res WebGLRenderTarget across ALL portals.
 *      Only the nearest portal within 8m AND in frustum goes live; a virtual
 *      camera (research §1 chain) re-renders the TARGET scene at ~30Hz via a
 *      plain renderer.render (no post). `?portals=0` kills this tier.
 *   3. Traversal — E-interact OR walking through the plane → requestSwitch(target).
 *
 * Render correctness follows docs/research-portals.md:
 *   §1 virtual-camera chain (src-local → 180° Y-flip → dst-local), rigid nodes;
 *   §2 CAPTURED-VP projected UVs frozen at capture (timewarp — kills swimming);
 *   §3 renderer.clippingPlanes at the destination plane (no oblique-projection
 *      depth warp), restored to [] after;
 *   §4 HalfFloat + MSAA RT, RAW linear quad (OutputPass tonemaps once).
 *
 * Double-trigger guard: BOTH traversal paths funnel through `trigger()`, which
 * sets the module `_traversing` latch and ignores further calls until the
 * WorldManager clears it (resetPortalTraversalLatch) at switch end — by which
 * point the player is at the destination spawn, far from any plane.
 *
 * `tickPortals` is driven by main.ts (which owns renderer + camera, which the
 * frozen per-instance update() signature lacks).
 */

import * as THREE from 'three';
import type { WorldId } from '../core/worldTypes.js';
import type { Interactable } from '../world/types.js';
import { createSwirlMaterial, type SwirlUniforms } from './portalShader.js';

export interface PortalSurface {
  mesh: THREE.Mesh;
  interactable: Interactable;
  update(dt: number, playerPos: THREE.Vector3, camera: THREE.PerspectiveCamera): void;
  /** ~600ms high-energy burst (two-hue flash + filament arcs). Fired on traversal. */
  discharge(): void;
  dispose(): void;
}

interface PortalDeps {
  renderer: THREE.WebGLRenderer;
  getScene(id: string): THREE.Scene | null;
  /** Destination "arrival portal" transform in the target scene, or null (→ identity). */
  getDestination(id: string): THREE.Matrix4 | null;
  requestSwitch(target: string): void;
}

let deps: PortalDeps | null = null;
export function configurePortals(d: PortalDeps): void { deps = d; }

const LIVE_ENABLED: boolean =
  typeof window === 'undefined' ||
  new URLSearchParams(window.location.search).get('portals') !== '0';

let _traversing = false;
export function resetPortalTraversalLatch(): void { _traversing = false; }

const BURST_MS = 600;
const LIVE_DIST = 8;
const CROSS_DIST = 2.0;

const _portals: PortalImpl[] = [];

// ── shared live-preview infra (lazy) ────────────────────────────────────────
let sharedRT: THREE.WebGLRenderTarget | null = null;
let virtualCam: THREE.PerspectiveCamera | null = null;
let lastLiveRender = 0;

// scratch
const _v = new THREE.Vector3();
const _local = new THREE.Vector3();
const _n = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _frustum = new THREE.Frustum();
const _projScreen = new THREE.Matrix4();
const _sphere = new THREE.Sphere();
const _size = new THREE.Vector2();
const FLIP = new THREE.Matrix4().makeRotationY(Math.PI);
const _srcInv = new THREE.Matrix4();
const _xform = new THREE.Matrix4();
const _capturedVP = new THREE.Matrix4();
const _plane = new THREE.Plane();
const _dstPos = new THREE.Vector3();
const _dstNormal = new THREE.Vector3();
const EMPTY_PLANES: THREE.Plane[] = [];

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 0xffffffff;
}

function rootScene(obj: THREE.Object3D): THREE.Scene | null {
  let n: THREE.Object3D | null = obj;
  while (n) { if ((n as THREE.Scene).isScene) return n as THREE.Scene; n = n.parent; }
  return null;
}

class PortalImpl implements PortalSurface {
  mesh: THREE.Mesh;
  interactable: Interactable;
  private uniforms: SwirlUniforms;
  private w: number;
  private h: number;
  private lastSign = 0;
  private burstRemain = 0;
  readonly targetId: string;
  readonly boundingRadius: number;

  constructor(target: string, tintHex: string, w: number, h: number, id: string, prompt: string) {
    this.targetId = target;
    this.w = w; this.h = h;
    this.boundingRadius = Math.hypot(w, h) * 0.5;
    const { material, uniforms } = createSwirlMaterial(tintHex);
    this.uniforms = uniforms;
    uniforms.uSeed.value = hashStr(id);
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
    this.mesh.name = id; // interaction raycast walks ancestor .name chains
    this.interactable = {
      id, prompt, radius: 2.6,
      position: new THREE.Vector3(),
      onInteract: (): void => this.trigger(),
    };
    _portals.push(this);
  }

  discharge(): void {
    this.burstRemain = BURST_MS;
    this.uniforms.uBurst.value = 1;
  }

  private trigger(): void {
    if (_traversing || !deps) return;
    _traversing = true;
    this.discharge();              // crack of energy just before the fade
    deps.requestSwitch(this.targetId);
  }

  update(dt: number, playerPos: THREE.Vector3, _camera: THREE.PerspectiveCamera): void {
    this.uniforms.uTime.value += dt;
    this.mesh.getWorldPosition(this.interactable.position);

    if (this.burstRemain > 0) {
      this.burstRemain -= dt * 1000;
      this.uniforms.uBurst.value = Math.max(0, this.burstRemain / BURST_MS);
    }

    const dist = playerPos.distanceTo(this.interactable.position);
    const near = Math.max(0, Math.min(1, 1 - (dist - 1) / LIVE_DIST));
    const st = this.uniforms.uState;
    st.value += (near - st.value) * Math.min(1, dt * 4);

    // plane-crossing traversal (sign flip of signed distance to portal plane)
    this.mesh.getWorldQuaternion(_q);
    _n.set(0, 0, 1).applyQuaternion(_q).normalize();
    _v.copy(playerPos).sub(this.interactable.position);
    const d = _v.dot(_n);
    const s = d >= 0 ? 1 : -1;
    if (this.lastSign !== 0 && s !== this.lastSign && dist < CROSS_DIST && this.withinRect(playerPos)) {
      this.trigger();
    }
    this.lastSign = s;
  }

  private withinRect(playerPos: THREE.Vector3): boolean {
    this.mesh.worldToLocal(_local.copy(playerPos));
    return Math.abs(_local.x) < this.w * 0.5 && Math.abs(_local.y) < this.h * 0.5;
  }

  setLive(v: number): void {
    this.uniforms.uUseLive.value = v;
    if (v <= 0) this.uniforms.uLive.value = null;
  }
  rampLive(dt: number): void {
    const u = this.uniforms.uUseLive;
    u.value += (1 - u.value) * Math.min(1, dt * 6);
  }
  /** Hand a fresh RT capture to the shader (frozen until the next capture → timewarp). */
  setCaptured(vp: THREE.Matrix4, xform: THREE.Matrix4, tex: THREE.Texture): void {
    this.uniforms.uCapturedVP.value.copy(vp);
    this.uniforms.uPortalXform.value.copy(xform);
    this.uniforms.uLive.value = tex;
  }

  dispose(): void {
    const i = _portals.indexOf(this);
    if (i >= 0) _portals.splice(i, 1);
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}

export function createPortalSurface(target: WorldId, tintHex: string, w: number, h: number): PortalSurface {
  return new PortalImpl(target, tintHex, w, h, `portal-${target}`, `Enter ${target.toUpperCase()}`);
}

export function createReturnPortal(w = 2.0, h = 2.6): PortalSurface {
  return new PortalImpl('ship', '#46E0D8', w, h, 'portal-ship', 'Return to Ship');
}

/**
 * Per-frame coordinator (called by main.ts). Ticks every portal in the active
 * scene, then drives the single shared live-preview render for the nearest
 * in-frustum portal within 8m.
 */
export function tickPortals(
  dt: number,
  playerPos: THREE.Vector3,
  camera: THREE.PerspectiveCamera,
  activeScene: THREE.Scene,
): void {
  if (_portals.length === 0) return;

  if (LIVE_ENABLED) {
    _projScreen.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _frustum.setFromProjectionMatrix(_projScreen);
  }

  let nearest: PortalImpl | null = null;
  let nearestDist = Infinity;

  for (const p of _portals) {
    if (rootScene(p.mesh) !== activeScene) { p.setLive(0); continue; }
    p.update(dt, playerPos, camera);
    if (!LIVE_ENABLED) { p.setLive(0); continue; }
    const wp = p.mesh.getWorldPosition(_v);
    const dist = playerPos.distanceTo(wp);
    _sphere.set(wp, p.boundingRadius);
    if (dist <= LIVE_DIST && _frustum.intersectsSphere(_sphere) && dist < nearestDist) {
      nearest = p;
      nearestDist = dist;
    }
  }

  if (!LIVE_ENABLED) return;

  for (const p of _portals) {
    if (p !== nearest && rootScene(p.mesh) === activeScene) p.setLive(0);
  }

  if (nearest && deps) {
    const targetScene = deps.getScene(nearest.targetId);
    if (targetScene) {
      renderLive(nearest, camera, targetScene);
      nearest.rampLive(dt);
    } else {
      nearest.setLive(0);
    }
  }
}

function ensureRT(renderer: THREE.WebGLRenderer): void {
  renderer.getDrawingBufferSize(_size);
  const halfW = Math.max(1, Math.floor(_size.x / 2));
  const halfH = Math.max(1, Math.floor(_size.y / 2));
  if (!sharedRT) {
    sharedRT = new THREE.WebGLRenderTarget(halfW, halfH, {
      type: THREE.HalfFloatType,          // §4: no HDR clip → bloom-through-portal survives
      samples: 4,                          // §4: WebGL2 MSAA, auto-resolved
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      generateMipmaps: false,
      depthBuffer: true,
    });
  } else if (sharedRT.width !== halfW || sharedRT.height !== halfH) {
    sharedRT.setSize(halfW, halfH);
  }
  if (!virtualCam) {
    virtualCam = new THREE.PerspectiveCamera();
    virtualCam.matrixAutoUpdate = false;       // we set matrixWorld directly (research §1)
    virtualCam.matrixWorldAutoUpdate = false;  // stop renderer.render from recomputing it
  }
}

function renderLive(portal: PortalImpl, camera: THREE.PerspectiveCamera, targetScene: THREE.Scene): void {
  if (!deps) return;
  ensureRT(deps.renderer);
  if (!sharedRT || !virtualCam) return;

  const now = performance.now();
  if (now - lastLiveRender < 33) return;       // ~30Hz; stale RT is fine — projected UVs timewarp it
  lastLiveRender = now;

  const dst = deps.getDestination(portal.targetId); // Matrix4 | null
  _srcInv.copy(portal.mesh.matrixWorld).invert();
  if (dst) _xform.copy(dst).multiply(FLIP).multiply(_srcInv);
  else _xform.identity();                       // no paired portal → render from player pose

  virtualCam.matrixWorld.multiplyMatrices(_xform, camera.matrixWorld);
  virtualCam.matrixWorld.decompose(virtualCam.position, virtualCam.quaternion, virtualCam.scale);
  virtualCam.matrixWorldInverse.copy(virtualCam.matrixWorld).invert();
  virtualCam.projectionMatrix.copy(camera.projectionMatrix);
  _capturedVP.multiplyMatrices(virtualCam.projectionMatrix, virtualCam.matrixWorldInverse);

  const renderer = deps.renderer;
  if (dst) {
    _dstPos.setFromMatrixPosition(dst);
    _dstNormal.set(0, 0, 1).transformDirection(dst).normalize();
    _plane.setFromNormalAndCoplanarPoint(_dstNormal, _dstPos);
    renderer.clippingPlanes = [_plane];         // §3: clip geometry behind the arrival plane
  }
  const prevTarget = renderer.getRenderTarget();
  renderer.setRenderTarget(sharedRT);
  renderer.render(targetScene, virtualCam);
  renderer.setRenderTarget(prevTarget);
  if (dst) renderer.clippingPlanes = EMPTY_PLANES; // restore — main pass unclipped

  portal.setCaptured(_capturedVP, _xform, sharedRT.texture);
}

/** Free the shared RT (app-lifetime infra; here for completeness). */
export function disposePortals(): void {
  if (sharedRT) { sharedRT.dispose(); sharedRT = null; }
  virtualCam = null;
}
