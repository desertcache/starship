/**
 * Encounter director — the 'Living Cruise' scheduler + master tick.
 *
 * Owns:
 *   - a rolling cast (heroes / ambients / one asteroid field / one rare event)
 *     streaming on the +Z (aft) cruise flow,
 *   - a seeded soft-timeline scheduler (elapsed-second thresholds),
 *   - the FAR streaming star layer + persistent nebula wash + hero sun, all
 *     children of this director's own `group` (v1.1 SOVEREIGN: was added
 *     directly to the scene — now they reparent under the universe rig for
 *     free whenever `group` itself does, see flight/universeRig.ts),
 *   - the scan API (nearest visible hero, distance from the canopy anchor),
 *   - full disposal of everything it spawns.
 *
 * main.ts drives the whole system via planet.tick(elapsed) → director.tick.
 */

import * as THREE from 'three';
import { makeRng } from './rng.js';
import type { Rng } from './rng.js';
import { buildStarLayer, setStarUniforms, disposeStarLayer } from './starLayer.js';
import { createNebulaField } from './nebula.js';
import { createHeroSun } from './sun.js';
import type { ScanData, SpaceDirector } from './types.js';
import type { EventKind } from './events.js';
import { getFlowW } from '../../flight/flightShim.js'; // LANE-C SHIM — replaced by flightState at merge
import {
  spawnHero,
  spawnAmbient,
  spawnField,
  spawnEvent,
  spawnSignatureHeroes,
  tickEntry,
  disposeEntry,
  entryObject,
  heroFlowPos,
  SCAN_Z_NEAR,
  SCAN_Z_FAR,
} from './cast.js';
import type { CastEntry, BodyEntry } from './cast.js';

// ── Tuning ────────────────────────────────────────────────────────────────────

const FAR_SPAN = 3000; // r1500 shell → span 3000, zMin -1500
const FAR_ZMIN = -1500;
const FAR_SCROLL_FACTOR = 0.25; // 25% of universe-flow speed for parallax

const HERO_CAP = 7; // hard cap heroes + ambients live
const HERO_FLOOR = 1;
const AMBIENT_FLOOR = 2;
const AMBIENT_CEIL = 4;

/** Canopy scan anchor (cockpit cam looks toward -Z). */
const SCAN_ANCHOR = new THREE.Vector3(0, 1.5, -22.5);

/** Hero sun world position — well inside the cockpit-canopy's -Z forward cone
 *  (camera ≈ (0,1.55,-22.5) looking -Z), offset right/up of the signature
 *  canopy giant so the flare doesn't overlap its disc; far enough (dist
 *  ≈1700, well under the 2000 far-plane) to read as a distant star. */
const SUN_POSITION = new THREE.Vector3(280, 150, -1700);

const EVENT_KINDS: EventKind[] = ['COMET', 'NEBULA', 'DERELICT'];
const EVENT_WEIGHTS = [40, 30, 30];

interface Schedule {
  nextHeroSpawnAt: number;
  nextAmbientSpawnAt: number;
  nextAsteroidAt: number;
  nextEventAt: number;
}

/** Create the space director. Seed default 0x5747 for deterministic verify. */
export function createSpaceDirector(
  scene: THREE.Scene,
  opts?: { seed?: number },
): SpaceDirector {
  const rng: Rng = makeRng(opts?.seed ?? 0x5747);
  const group = new THREE.Group();
  group.name = 'space-director';
  // Added directly to `scene` for now; main.ts's universe-rig wiring
  // reparents `group` under the rig (THREE.Object3D.add() auto-detaches from
  // the old parent), which brings everything below along with it in one move.
  scene.add(group);

  // ── FAR streaming layer (child of `group`; never frustum-culls oddly) ──────
  // v0.9 RADIANCE fix-round M8: sizeMin/sizeMax bumped modestly (0.4/2.0 →
  // 0.48/2.3) — reads as a slightly denser/more prominent starfield through
  // both the canopy and portholes without changing star COUNT (no added rng
  // draws, so the seeded sequence downstream — sun texture, signature hero
  // spawn — stays byte-identical; Test 7 determinism preserved).
  const far = buildStarLayer({
    count: 4500,
    xHalf: 1500,
    yHalf: 900,
    zMin: FAR_ZMIN,
    span: FAR_SPAN,
    sizeMin: 0.48,
    sizeMax: 2.3,
    spherical: true,
    rand: rng,
  });
  far.name = 'starfield-far';
  group.add(far);

  // ── Persistent deep-field colour depth ───────────────────────────────────────
  const nebula = createNebulaField(group);
  const sun = createHeroSun(rng, SUN_POSITION);
  group.add(sun.sprite);

  // ── Rolling cast ─────────────────────────────────────────────────────────────
  const cast: CastEntry[] = [];
  let signatureDone = false;

  // ── Scheduler timeline (elapsed seconds) ───────────────────────────────────────
  const sched: Schedule = {
    nextHeroSpawnAt: 0,
    nextAmbientSpawnAt: 0,
    nextAsteroidAt: rng.range(180, 320),
    nextEventAt: rng.range(220, 400),
  };

  // ── delta tracking ─────────────────────────────────────────────────────────────
  let lastElapsed = -1;
  const farScrollVec = new THREE.Vector3();
  const _nebulaDelta = new THREE.Vector3(); // per-frame scratch, avoid alloc/frame

  function addEntry(entry: CastEntry): void {
    cast.push(entry);
    group.add(entryObject(entry));
  }

  function removeEntry(idx: number): void {
    const entry = cast[idx];
    group.remove(entryObject(entry));
    disposeEntry(entry);
    cast.splice(idx, 1);
  }

  function countBodies(role: 'HERO' | 'AMBIENT'): number {
    let n = 0;
    for (const e of cast) if (e.kind === 'body' && e.role === role) n++;
    return n;
  }

  function totalBodies(): number {
    let n = 0;
    for (const e of cast) if (e.kind === 'body') n++;
    return n;
  }

  function hasField(): boolean {
    return cast.some((e) => e.kind === 'field');
  }

  function hasEvent(): boolean {
    return cast.some((e) => e.kind === 'event');
  }

  function spawnSignatureCast(): void {
    for (const entry of spawnSignatureHeroes(rng)) addEntry(entry);
    signatureDone = true;
  }

  function trySpawnHero(elapsed: number): void {
    if (totalBodies() >= HERO_CAP) return;

    if (!signatureDone) {
      spawnSignatureCast();
      // Overlap cadence: old hero recedes while new approaches.
      sched.nextHeroSpawnAt = elapsed + rng.range(60, 110);
      return;
    }

    const heroes = countBodies('HERO');
    const due = heroes < HERO_FLOOR || elapsed >= sched.nextHeroSpawnAt;
    if (!due) return;
    addEntry(spawnHero(rng));
    // Overlap cadence: old hero recedes while new approaches.
    sched.nextHeroSpawnAt = elapsed + rng.range(60, 110);
  }

  function trySpawnAmbient(elapsed: number): void {
    if (totalBodies() >= HERO_CAP) return;
    const ambients = countBodies('AMBIENT');
    if (ambients >= AMBIENT_CEIL) return;
    const due = ambients < AMBIENT_FLOOR || elapsed >= sched.nextAmbientSpawnAt;
    if (!due) return;
    addEntry(spawnAmbient(rng));
    sched.nextAmbientSpawnAt = elapsed + rng.range(25, 45);
  }

  function trySpawnAsteroid(elapsed: number): void {
    if (hasField() || elapsed < sched.nextAsteroidAt) return;
    addEntry(spawnField(rng));
    sched.nextAsteroidAt = elapsed + rng.range(180, 320);
  }

  function trySpawnEvent(elapsed: number): void {
    if (hasEvent() || elapsed < sched.nextEventAt) return;
    const kind = EVENT_KINDS[rng.pick(EVENT_WEIGHTS)];
    addEntry(spawnEvent(rng, kind));
    sched.nextEventAt = elapsed + rng.range(220, 400);
  }

  function tick(elapsed: number): void {
    if (lastElapsed < 0) lastElapsed = elapsed;
    const dt = Math.min(Math.max(elapsed - lastElapsed, 0), 0.1);
    lastElapsed = elapsed;

    // Far layer streams at 25% of the universe flow for parallax.
    farScrollVec.addScaledVector(getFlowW(), FAR_SCROLL_FACTOR * dt);
    setStarUniforms(far, elapsed, farScrollVec);

    // Persistent nebulae drift at the same FAR parallax rate so they feel
    // locked to the deep background.
    nebula.tick(_nebulaDelta.copy(getFlowW()).multiplyScalar(FAR_SCROLL_FACTOR * dt));
    sun.tick(elapsed);

    // Advance + despawn cast (iterate backwards for safe splice).
    for (let i = cast.length - 1; i >= 0; i--) {
      const dead = tickEntry(cast[i], dt);
      if (dead) removeEntry(i);
    }

    // Scheduler.
    trySpawnHero(elapsed);
    trySpawnAmbient(elapsed);
    trySpawnAsteroid(elapsed);
    trySpawnEvent(elapsed);
  }

  function getScanData(): ScanData | null {
    let best: BodyEntry | null = null;
    let bestDist = Infinity;
    for (const e of cast) {
      if (e.kind !== 'body' || e.role !== 'HERO') continue;
      const proj = heroFlowPos(e);
      if (proj < SCAN_Z_NEAR || proj > SCAN_Z_FAR) continue;
      const dist = e.body.group.position.distanceTo(SCAN_ANCHOR);
      if (dist < bestDist) {
        bestDist = dist;
        best = e;
      }
    }
    if (!best) return null;
    return {
      name: best.body.scan.name,
      class: best.body.scan.class,
      composition: best.body.scan.composition,
      distanceKm: Math.round(bestDist),
    };
  }

  function getBodyCount(): number {
    return totalBodies();
  }

  function dispose(): void {
    for (let i = cast.length - 1; i >= 0; i--) removeEntry(i);
    group.remove(far);
    disposeStarLayer(far);
    nebula.dispose();
    group.remove(sun.sprite);
    sun.dispose();
    // group.parent, not `scene` — by the time this runs, main.ts's universe
    // rig may have reparented `group` under itself, and a stale scene.remove
    // would silently no-op, leaking group into the rig forever.
    group.parent?.remove(group);
  }

  return { tick, getScanData, getBodyCount, dispose, group };
}
