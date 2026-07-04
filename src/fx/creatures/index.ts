/**
 * src/fx/creatures/index.ts — spawnCreatures facade (Stage C creature engine).
 *
 * The FROZEN signature + CreatureHandles semantics are unchanged from the
 * Stage-A stub; only the internals are real now:
 *   builder/builderSoft — seeded primitive assembly per BodyPlan
 *   behavior            — steering FSM (IDLE/WANDER/FLEE/CURIOUS)
 *   animate             — distance-driven gaits, IK, jelly pulse, glider path
 *
 * Master update order per docs/research-creatures.md (load-bearing):
 *   steer/integrate → gait phase from distance → foot IK + terrain fit →
 *   head look → matrixWorld refresh → secondary springs (whips) LAST →
 *   markings → interactable .position sync.
 *
 * Determinism: every per-creature variation draws from rng(spec.seed + index);
 * all animation time comes from accumulated update dt — never wall clock.
 */

import * as THREE from 'three';
import type { CreatureSpec, CreatureHandles } from '../../core/worldTypes.js';
import type { Interactable } from '../../world/types.js';
import { makeRng } from '../space/rng.js';
import { recordScan } from '../../core/state.js';
import { showRoomToast } from '../../ui/hud.js';
import { buildSpecies } from './builder.js';
import { updateBehavior, makeSteerCfg } from './behavior.js';
import { animateLegged, animateFloater, animateGlider, animateMarkings, type GroundFn } from './animate.js';
import type { InstancePool } from './pool.js';
import type { CreatureInstance, Disposables } from './rig.js';

/** Scan reach (task spec: ~2.5-3m). */
const SCAN_RADIUS = 2.75;
/** Root micro-noise amplitude for whips, per metre of body (never fully rest). */
const WHIP_JITTER = 0.012;

export function spawnCreatures(
  specs: CreatureSpec[],
  groundHeight: GroundFn,
  center: THREE.Vector3,
): CreatureHandles {
  const group = new THREE.Group();
  group.name = 'creatures';
  const interactables: Interactable[] = [];
  const disp: Disposables = { geos: [], mats: [] };
  /** Per-species flocks (herd rules run within a species only). */
  const flocks: CreatureInstance[][] = [];
  /** Per-species instanced pools, synced after each flock's pose pass. */
  const flockPools: InstancePool[][] = [];

  for (const spec of specs) {
    const species = buildSpecies(spec, disp); // geometry+materials ONCE
    const cfg = makeSteerCfg(spec);
    const flock: CreatureInstance[] = [];

    for (let i = 0; i < spec.count; i++) {
      const rng = makeRng(spec.seed + i * 7919); // all variation ← seed+index
      const built = species.assemble(i);
      const id = `${spec.id}-${i}`;
      built.root.name = id; // raycast walks ancestor .name chains
      group.add(built.root);

      // Seeded even-area disc placement; re-draw if crowding a flockmate.
      let x = 0, z = 0;
      for (let tries = 0; tries < 6; tries++) {
        const ang = rng() * Math.PI * 2;
        const rad = Math.sqrt(rng()) * spec.roamRadius * 0.7;
        x = center.x + Math.cos(ang) * rad;
        z = center.z + Math.sin(ang) * rad;
        const minSep = spec.sizeM * 1.6;
        if (flock.every((o) => Math.hypot(o.pos.x - x, o.pos.z - z) > minSep)) break;
      }
      const gy = groundHeight(x, z);
      const hoverBase = 2.2 + rng() * 2.3; // floater band 2-5m over ground
      const glideT = rng() * Math.PI * 2;
      const yaw = rng() * Math.PI * 2;
      const legged = spec.plan === 'quadruped' || spec.plan === 'skitterer';

      const inst: CreatureInstance = {
        spec, root: built.root, rig: built.rig,
        ia: null as unknown as Interactable, // assigned just below
        temperament: spec.temperament,
        pos: new THREE.Vector3(x, spec.plan === 'floater' ? gy + hoverBase : gy, z),
        vel: new THREE.Vector3(),
        seed: rng() * 1000, // per-agent noise seed (anti-jitter lever 6)
        center: center.clone(), roamRadius: spec.roamRadius, cfg,
        phase: rng(), legBlend: 0,
        headLook: new THREE.Vector3(x, gy + built.rig.standH, z + 2),
        lookTarget: new THREE.Vector3(x, gy + built.rig.standH, z + 2),
        yaw, pitch: 0, roll: 0,
        // Start WANDERing long enough that early verify shots catch mid-gait.
        fsm: 'WANDER', fsmTimer: 9 + rng() * 8,
        startle: 0,
        jellyVelY: 0, jellyCPrev: 0, bobPhase: rng() * Math.PI * 2,
        glideT, glideTurn: 0,
        glidePrevYaw: Math.atan2(Math.cos(glideT), Math.cos(2 * glideT)),
        baseY: spec.plan === 'floater' ? hoverBase : gy,
      };
      inst.root.position.set(x, legged ? gy : inst.pos.y, z);
      inst.root.rotation.y = yaw;

      const ia: Interactable = {
        id,
        prompt: `Scan ${spec.scanName}`,
        radius: SCAN_RADIUS,
        position: new THREE.Vector3(x, inst.root.position.y + built.rig.standH, z),
        onInteract: (): void => {
          const fresh = recordScan(spec.id);
          showRoomToast(fresh ? `CATALOGUED · ${spec.scanName}` : 'ALREADY CATALOGUED');
        },
      };
      inst.ia = ia;
      interactables.push(ia);
      flock.push(inst);
    }
    // Species pools: trim to used slots, render under the shared group.
    for (const p of species.pools) {
      p.finalize();
      group.add(p.mesh);
    }
    flockPools.push(species.pools);
    flocks.push(flock);
  }

  let t = 0;
  return {
    group,
    interactables,
    update(dt: number, playerPos: THREE.Vector3): void {
      const h = Math.min(dt, 1 / 30); // guard: main loop caps 0.05, we cap 1/30
      t += h;
      for (let f = 0; f < flocks.length; f++) {
        const flock = flocks[f];
        for (const c of flock) {
          // 1) steer + integrate planar (behavior owns FSM + forces)
          updateBehavior(c, flock, playerPos, t, h);
          // 2-5) gait phase → IK → terrain fit → head look (plan-specific)
          switch (c.rig.plan) {
            case 'quadruped':
            case 'skitterer': animateLegged(c, t, h, groundHeight); break;
            case 'floater': animateFloater(c, t, h, groundHeight); break;
            case 'glider': animateGlider(c, t, h, groundHeight); break;
          }
          // 6) secondary springs LAST — they read the final body transform.
          c.root.updateMatrixWorld(true);
          const jit = WHIP_JITTER * c.spec.sizeM;
          for (const w of c.rig.whips) w.update(t, h, jit);
          // 7) livingness: propagating marking wave + startle flash
          animateMarkings(c, t);
          // 8) interactable tracks the creature root every tick (raycast +
          //    proximity interact both read .position)
          const yOff = c.rig.plan === 'floater' || c.rig.plan === 'glider' ? 0 : c.rig.standH;
          c.ia.position.set(c.root.position.x, c.root.position.y + yOff, c.root.position.z);
        }
        // 9) mirror posed pivots into the species' instanced pools (one
        //    instanceMatrix upload per pool per frame).
        for (const p of flockPools[f]) p.sync();
      }
    },
    dispose(): void {
      group.traverse((o) => {
        if ((o as THREE.InstancedMesh).isInstancedMesh) (o as THREE.InstancedMesh).dispose();
      });
      for (const g of disp.geos) g.dispose();
      for (const m of disp.mats) m.dispose();
    },
  };
}
