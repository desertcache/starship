# v1.2 LANDFALL — completion record

Built 2026-07-18/19, one overnight campaign. This is a record of the system AS
BUILT (the plan lived in the session plan file; the deltas are noted). The
loop: PROXIMITY HOLD over MERIDIAN-319 XII → **L** → cinematic atmosphere
descent → walkable streamed desert surface with the landed ship → hatch →
back at HOLD, state bit-preserved, repeatable.

## Architecture as built

**One analytic height closure drives everything** (`fx/landfall/heightField.ts`).
Seeded integer-lattice value noise (imul/xorshift hash, inputs XOR-salted so
`ix=0`/`iz=0` never zero a mix term), 5-octave fbm (gain 0.68 — 0.5 starves
the sub-100m octaves below visibility), ridged octave at 0.4× base wavelength,
very-low-frequency amplitude mask, then **mesa terracing** (9m strata, pow-2.4
risers, 0.55 blend) — soft value-noise fbm reads as sand dunes at ANY
amplitude; the terraces are what read as rock. The landing pad is flattened
INSIDE the closure (`mix(padH, h, smoothstep(18, 34, |p|))`), so the mesh,
the controller's ground clamp, creature foot IK, scatter placement, and the
far shell all agree by construction. Vertex normals come from central
differences of the closure, never `computeVertexNormals` (per-chunk recompute
seams at borders). Strata banding feeds `colorT` so the ramp expresses.

**Chunk streaming** (`fx/landfall/chunks.ts`, `chunkMesh.ts`): 64m chunks,
Chebyshev LOD rings (3×3 @32² segs / ≤3 @16² / ≤6 @8²), ±1-ring hysteresis,
per-LOD geometry free-lists (steady-state zero allocation), distance-sorted
build queue under a 2-build/3ms frame budget (6ms while descending), and
`snapStream` — a synchronous full-ring rebuild on any >2-chunk jump or first
activation, which is what makes teleported screenshots and the perf probe
deterministic. Skirts (6m drop, 0.3m inset — inset breaks same-LOD
coincident-wall z-fighting) hide LOD cracks. A 4km far shell samples the same
closure with min-of-9 conservative sampling (a chord between two exact-height
vertices bridges ABOVE concave notches — with terracing, by more than any
fixed drop) at −3m; beyond it, the sky dome's painted skyline takes over.

**Descent** (`fx/landfall/descent.ts` + `flight/landfall.ts`): a phase machine
(ENTRY 720→350m / BRAKE →60m / TOUCHDOWN →2m / WALK) that drives the shared
camera every frame from the world's `update()` — which runs AFTER the walk
controller, so the write wins the frame (the chaseCam precedent). It has no
raw camera ref; `registerCam` + `teleportToCamera` per tick is the drive path.
Fixed-25° look-ahead gaze (any altitude-fraction target pitches past what the
75° FOV can absorb and the horizon leaves the frame), seeded 3-oscillator
shake scaled by biome turbulence, entry heat via a `uEntry` uniform folded
into the existing vignette/grain pass (zero new composer passes), cloud-shell
punch-through by |camY − shellY| opacity, dust burst + `uFlash` at touchdown,
then a fade hands off to the walk spawn — placed in the hull's sun-lit
quadrant at eye height. `requestLanding()` sets mode LANDED **inside** the
fade callback after the world switch: written any earlier, the ship world's
remaining fade-out ticks let `tickApproach`'s HOLD-reassert stomp it.
Take-off is the mirror: fade → ship world → cargo-bay teleport; HOLD restores
itself via the reassert, `trueDist` untouched because flight state simply
never ticked off-ship.

**Surface life** (`fx/landfall/scatter.ts`, `weather.ts`, the existing
creature engine): per-chunk seeded scatter (boulders/spires/shrubs, instanced
per kind, pad kept clear, big pieces contribute near-field AABBs re-pushed
only on chunk crossings), a seeded weather roll (default CLEAR for stable
baselines; `?weather=storm|overcast|0` forces) driving sun/hemi/dome scales,
a wrapped-Points rain layer, lightning as intensity pulses on the two
existing lights (world light budget: 1 hemi + 1 directional, total), wind/
thunder in the world audio bed, and two CreatureSpecs (dune-strider herd,
ridge gliders) that ground themselves through the same height closure.

**Contracts touched** (each a deliberate frozen-file amendment): `FlightMode`
+= `'LANDED'`, `WorldId` += `'landfall'`, TestAPI += `engageLanding` /
`landingTickN` / `getLandingInfo`. `portalRoom.ts`'s exhaustive
`Record<WorldId, …>` was the one unplanned ripple.

## Probe-earned gotchas (the expensive lessons)

- **Sky dome radius ≥ camera far plane** z-clips a cap of triangles exactly
  around the view axis for any camera displaced away from its look direction —
  a black shape at screen center that survived four blind fix rounds because
  it was shape-stable across every texture rewrite. Dome is 1700 (< far 2000)
  and follows the player (XZ walking, XYZ during descent).
- **A registered elevated camera cannot exist in a walk world** — the
  controller's eye clamp re-grounds `camera.y` the next frame; the "400m
  altitude shot" was dirt from 1.7m. Only a per-frame driver holds altitude.
- **Pixel-hash screenshot determinism is impossible in this codebase by
  design** — the idle camera sway is phased on wall-clock elapsed and the HUD
  clock renders real time. Streaming determinism is guaranteed structurally
  (pure closure + snapStream) and asserted by T15 instead.
- **Bounding spheres must be geometry-local**: a world-space center gets the
  mesh's world offset applied again by the culling transform (it half-worked
  only because doubling along an outward view ray stays in-frustum).
- Diagnosis pattern that worked when 4 fix rounds failed: temp scene global +
  a Playwright probe toggling object visibility **against a whitened dome**
  (black-on-black "eliminations" lie), then per-object forensics.

## Gate results

Merged main `0f41dd3`: 15/15 functional (16/16 once T15 landed), headed
**144fps / p95 7.1ms — identical to the v1.0 baseline** with the entire
planet resident. Full loop verified headed with real frames, every phase
frame read by the orchestrator; state assertions to the bit
(`trueDist` preserved across land/re-board). Loop harness:
`scripts/landfall-loop-capture.mjs`. Showcase: `scripts/landfall-showcase.mjs`.
