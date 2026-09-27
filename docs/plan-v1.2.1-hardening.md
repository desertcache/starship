# v1.2.1 hardening: fix everything the v1.2 ultrareview found

The 2026-09-26 ultrareview (runs r1-engine, r2-flight, r3-worlds; the triage
list is `Journal/Projects/Starship/ultrareview-v1.2-findings.md` in Sam's
vault) found that v1.2's worst bugs all hide behind **test hooks that skip the
real input path**:

- `__test.interact()` falls back to a distance check, while the real E key
  resolves only meshes **named** the interactable's id (`player/interact.ts`).
- `engageLanding()` lands without taking the helm, so the seated-after-landing
  bug never showed.
- `forceDoorAutoCloseCheck()` skips `tickDoors()`, which has never run: its
  only caller is an `onBeforeRender` hook on a `visible:false` dummy.

This release fixes every finding and makes the two bug classes mechanically
un-shippable.

## Stage 0 (orchestrator, on main): test scaffolding

- `core/testApi.ts` split under the 300-line cap:
  - `core/testApiFlight.ts`: flight, approach and landing hooks
  - `core/testRealPath.ts`: `aimFrom` / `getInteractTarget` / `getPromptText` + sweeps
  - `core/testHooksShip.ts`: doors, fridge, quest shortcuts
  - `core/testHooksWorlds.ts`: pocket worlds + space
- `core/testSweeps.ts` runs two mechanical sweeps over every registered world:
  - **NAME:** every interactable resolves through the real E key (a same-named object that a ray can hit, near its registered position).
  - **HOOK:** no `onBeforeRender` on a Group/Object3D, or on a mesh whose material is `visible:false`.
- `scripts/tests/`:
  - `helpers.mjs`: `aimProbe` / `aimAndPressE` / `aimSweep` / `waitFrames`
  - `sweeps.mjs`: report-only until integration
  - one suite per lane: `ship.mjs` / `landing.mjs` / `worlds.mjs`, called after Test 15
- Baseline sweep on `8122e05`: 18 name violations, 4 dead hooks. That's the 15 the r3 probe found, plus 3 found by the new hittable/proximity checks:
  - `console-bank` names an EMPTY group (`cockpitProps.ts:193-195`), so the console has never been E-reachable.
  - The `coffee-cup` mesh sits 4.47 m from its registered position.
  - `rift-light-falls` (Points) was a false positive, fixed in the sweep.

## Stage 1: three parallel lanes (disjoint file ownership)

| Lane | Owns | Fixes |
|---|---|---|
| **A · ship** | new `world/shipTicks.ts`, `main.ts`, `world/doors.ts`, `world/assembly.ts`, `world/cockpit.ts`, `world/cockpitScreens.ts`, `world/cockpitProps.ts`, `fx/lightingRig.ts`, `world/portalRoom.ts`, `world/portalRoomProps.ts`, `world/quartersProps.ts`, `world/interactWiring.ts`, `world/interactItems.ts`, `world/galleyDressing.ts`, `world/engineeringProps.ts`, `world/propTween.ts`, `ui/hudOverlay.ts`, `core/testHooksShip.ts`, `scripts/tests/ship.mjs`, verify Tests 1/3/6/8 | dead ticks (doors, cockpit screens + dust, reactor breath, portal latch) → main loop; closed doors collide; names (7 doors, 2 bunks, survey console, console-bank); crate-slide tween never ticked (found in Stage 0 planning); coffee-cup position; overlay close path (breaker + console-bank key leaks) |
| **B · landing** | `flight/landfall.ts`, `flight/helm.ts`, `flight/helmInput.ts`, `player/controller.ts` (+ split), `ui/flightHud.ts`, `fx/landfall/*` (`descent.ts` + split, `chunks.ts`, `shipSurface.ts`), `world/worlds/landfall.ts`, `core/testApiFlight.ts`, `scripts/tests/landing.mjs`, verify Test 15 | seated-after-landing (stand in place, helm teardown, then LANDED); hatch has no named geometry; LAND prompt shows 1 frame; terrain LOD never refines; descent `registerCam` per-frame alloc; cap splits |
| **C · worlds** | `world/worlds/rift*.ts`, `world/worlds/ashfall*.ts`, `world/worlds/verdant*.ts`, `fx/space/*`, `fx/creatures/pool.ts`, `core/testHooksWorlds.ts`, `scripts/tests/worlds.mjs` | names (rift relic, prism chorus, underside; ashfall fumarole); LIGHTFALL falls instead of rising; nebulae drift away (wrap all axes); cached-texture dispose + rift `pUnder` leak; GTAO Sprite slabs (only if the look stays identical); asteroid `computeBoundingBox` per frame; dead `InstancePool.dispose` |

Rules for every lane:
- Touch only owned files. Anything else → stop and report.
- Brief code is a draft: verify against the real source, and report mismatches.
- No `npm install`: node_modules is a junction.
- Gate commands run in the foreground with explicit `timeout: 540000`.
- Each suite starts and ends on the ship world: interior view, standing, flight reset, doors open.

## Stage 2: cleanup lane (after the Stage 1 merge)

- **Cap debt:** 16 files over 300 lines. The reviews flagged 5 (`controller`, `testApi`, `destinationVisual`, `descent`, `portalSurface`), and Stage 1 handles `controller`, `testApi` and `descent`. The r4/r5 files the reviews never reached add 11 more.
- chaseCam local consts → `flightTuning.ts`.
- `dampVec3`/`slerpDamp` without `out`.
- `fx/hull/preview.ts` leak (dev-only).
- CLAUDE.md wording: `__camNames` is the 5th contract global; hero cam names are `worldId`-tagged, not prefixed.
- One headed profile of hero-body texture generation.
- Gate: headed shots pixel-stable against the Stage 1 merge.

## Stage 3 (orchestrator): integration

- Merge lanes and set `STRICT = true` in `scripts/tests/sweeps.mjs`.
- Run typecheck, `verify`, `verify:headed` (quiet GPU) and `scripts/landfall-loop-capture.mjs`, then read every shot.
- Correct the vault drift: README entries for v0.1 sleep, v0.2 doors, v0.4 auto-close, v0.6/0.7 live cockpit screens, v0.9 reactor breath, the v1.0 hologram payoff and the v1.2 re-board, none of which ever ran in real play.
- Tag `v1.2.1` locally. **Push only with Sam's go-ahead** (push = public deploy).

## Judgment calls (reversible)

- Doors keep the v0.2/v0.4 design: they default OPEN, auto-close only after you've toggled one, and are solid when closed. The closed collider tracks the slab, so an open door can't block.
- The reactor breathes as designed (2.1 rad/s). If the peak blows the hazard disc back to white (the v0.9 R2 reason it was tuned to 3.4), the amplitude is cut.
- r4/r5 ultrareview runs ($5-25 each) are not bought. The sweeps cover both known bug classes for free. If Sam wants them, run them on the fixed code.
