/**
 * src/core/testSweeps.ts — v1.2.1 mechanical contract sweeps (test-only).
 *
 * Two bug classes the v1.2 ultrareview found, both invisible to hook-driven
 * functional tests:
 *
 *  1. NAME CONTRACT. The real E key (player/interact.ts) resolves a raycast
 *     hit ONLY by walking the hit mesh's ancestors for `name === ia.id`.
 *     __test.interact()'s distance fallback never checks names, so 15
 *     interactables shipped unreachable in real play (7 doors, both bunks,
 *     the RIFT relic, the landfall hatch...), and this sweep's first run
 *     found an 18th: 'console-bank' names an EMPTY group. Sweep: every
 *     interactable of every registered world has a same-named object in that
 *     world's scene, that object is or contains something a ray can hit
 *     (Mesh/Points/Line/Sprite), and it sits near the interactable's
 *     registered position.
 *
 *  2. DEAD HOOKS. three.js calls Object3D.onBeforeRender from exactly one
 *     place, WebGLRenderer.renderObject(), which projectObject() only reaches
 *     for a Mesh/Line/Points/Sprite whose material is visible. A hook on a
 *     Group/Object3D, or on a mesh whose material has visible:false, NEVER
 *     fires (the door tick, cockpit screens and reactor breath were all dead
 *     from v0.2a to v1.2).
 *
 * scripts/tests/sweeps.mjs drives both through window.__test.
 */
import * as THREE from 'three';
import { getRegisteredWorlds } from './worlds.js';

export interface NameViolation {
  world: string;
  id: string;
  reason: string;
}

export interface HookViolation {
  world: string;
  path: string;
  reason: string;
}

/** How far (m) beyond the interactable's own radius its named object may sit. */
const NEAR_SLACK_M = 1.5;

type Renderable = THREE.Mesh | THREE.Line | THREE.Points | THREE.Sprite;

function isRenderable(o: THREE.Object3D): o is Renderable {
  return (o as THREE.Mesh).isMesh === true
    || (o as THREE.Line).isLine === true
    || (o as THREE.Points).isPoints === true
    || (o as THREE.Sprite).isSprite === true;
}

function materialsOf(o: Renderable): THREE.Material[] {
  const m = o.material;
  return Array.isArray(m) ? m : [m];
}

function objectPath(o: THREE.Object3D): string {
  const parts: string[] = [];
  let n: THREE.Object3D | null = o;
  while (n) {
    parts.push(n.name !== '' ? n.name : n.type);
    n = n.parent;
  }
  return parts.reverse().join(' > ');
}

/** Interactables the real E key cannot resolve, across every registered world. */
export function sweepNameContract(): NameViolation[] {
  const out: NameViolation[] = [];
  const box = new THREE.Box3();
  for (const w of getRegisteredWorlds()) {
    w.scene.updateMatrixWorld(true);
    for (const ia of w.interactables) {
      const named = w.scene.getObjectByName(ia.id);
      if (!named) {
        out.push({ world: w.id, id: ia.id, reason: 'no object in the scene is named this id' });
        continue;
      }
      // Raycaster.intersectObjects hits Mesh, Points, Line and Sprite alike.
      const hittable: THREE.Object3D[] = [];
      named.traverse((o) => {
        if (isRenderable(o)) hittable.push(o);
      });
      if (hittable.length === 0) {
        out.push({ world: w.id, id: ia.id, reason: `named ${named.type} has nothing a ray can hit under it` });
        continue;
      }
      box.setFromObject(named);
      const d = box.distanceToPoint(ia.position);
      if (d > ia.radius + NEAR_SLACK_M) {
        out.push({
          world: w.id,
          id: ia.id,
          reason: `named object sits ${d.toFixed(2)} m from the interactable position (radius ${ia.radius})`,
        });
      }
    }
  }
  return out;
}

/** onBeforeRender hooks three.js will never call, across every registered world. */
export function sweepDeadHooks(): HookViolation[] {
  const out: HookViolation[] = [];
  const base = THREE.Object3D.prototype.onBeforeRender;
  for (const w of getRegisteredWorlds()) {
    w.scene.traverse((o) => {
      if (o.onBeforeRender === base) return;
      if (!isRenderable(o)) {
        out.push({ world: w.id, path: objectPath(o), reason: `hook on a ${o.type}; only Mesh/Line/Points/Sprite ever render` });
        return;
      }
      if (materialsOf(o).some((m) => m.visible === false)) {
        out.push({ world: w.id, path: objectPath(o), reason: 'hook on a mesh whose material is visible:false, which never renders' });
      }
    });
  }
  return out;
}
