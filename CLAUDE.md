# Starship Explorer — Project Constitution

## What this is
A first-person explorable starship built in Three.js. Runs in the browser at 60fps. Zero external assets — all geometry is procedural, all textures are generated via CanvasTexture. The vibe: worn industrial freighter, Alien (1979) interiors with a clean cel-shaded comic finish.

## Stack & commands
- Vite + TypeScript + three (npm). No frameworks. No asset pipeline. No state libraries.
- `npm run dev` — dev server
- `npm run typecheck` — tsc --noEmit, must be clean before any verify
- `npm run verify` — headless Playwright: builds, serves preview, captures screenshots from every named camera into `verify/shots/`, writes perf telemetry to `verify/report.json`. Screenshots authoritative; fps advisory only (headless may software-render).
- `npm run verify:headed` — same harness, headed Chromium with GPU. **fps numbers from this run are the authoritative ones.**

## Architecture (enforced, not suggested)
```
src/core/    — engine bootstrap, render loop, perf telemetry, named-camera registry, world manager (worlds.ts + worldTypes.ts)
src/world/   — ship modules, ONE FILE PER ROOM (cockpit.ts, corridor.ts, quarters.ts, galley.ts, engineering.ts) + assembly.ts that positions them; pocket worlds under src/world/worlds/ (one folder-prefix per world)
src/player/  — first-person controller, collision, interaction raycaster
src/fx/      — lighting rigs, procedural texture generators, space environment (starfield, planet), post-processing
src/ui/      — HUD, interaction prompts, debug overlay
```

Rules:
- No file exceeds 300 lines. If it does, split it before continuing.
- No `any`. Explicit return types on exported functions.
- Rooms expose a typed interface: `{ group: THREE.Group, colliders: AABB[], interactables: Interactable[], cameras: NamedCamera[] }`. assembly.ts consumes only this interface.
- Pocket worlds are separate THREE.Scenes implementing the `World` contract in src/core/worldTypes.ts (docs/design-v1.0-threshold.md). Only the active scene renders; the WorldManager owns switching, composer rebinding, and the controller's collider/groundHeight swap. World camera names are prefixed `<worldId>-` and `__setCam` activates the owning world.
- No globals except the verification contract: `window.__ready` (Promise resolving when scene is loaded), `window.__setCam(name)` (teleports view to a named camera), `window.__perf.sample(ms)` (Promise<PerfReport>), `window.__test` (hooks for functional tests).
- Dispose of geometries/materials you replace. Leaks count as bugs.

## Verification protocol — non-negotiable
After completing each phase in KICKOFF.md:
1. `npm run typecheck` — clean.
2. `npm run verify` — functional tests + smoke shots. **Art judgments are made ONLY on `npm run verify:headed` screenshots** — headless SwiftShader lighting diverges from real GPU lighting (v0.9 root cause; ~20 days of art was graded on the wrong renderer). Read every headed screenshot with your own eyes. If a room looks wrong, broken, unlit, or ugly: fix it. Do not rationalize a bad screenshot.
3. Read `verify/report.json`. Budget (from headed run): avgFps ≥ 60, **p95 frame time ≤ 18ms — this is the binding contract**, triangles ≤ 500k. Draw calls ≤ 300 is per-pass guidance for the active scene: GTAO's G-buffer re-render structurally ~doubles reported draws — judge regressions by p95, not the raw draw count.
4. Iterate until visuals AND budget pass.
5. `git add -A && git commit -m "phase-N: <summary>"`. Never start a phase on an uncommitted or red baseline.
6. If perf fails 3+ iterations in a row: simplify geometry. Do not micro-optimize shaders to rescue an over-built scene.

## Visual direction
Cream/off-white wall panels with visible dark seams, burnt-orange structural trim and door frames, teal emissive light strips, dark gunmetal counters/pipes/consoles, occasional deep-red accent panel. Surfaces are worn: subtle grime noise, scuffed bands. Flat-ish shading with strong silhouettes — comic-book industrial, not PBR realism.

Palette: `#E8E2D4` panel · `#C7641E` trim · `#46E0D8` emissive teal · `#1C1E22` gunmetal · `#7A2C1F` accent red · `#0A0B10` space.

## Performance playbook
- Static geometry per room → merged via BufferGeometryUtils.mergeGeometries (one or two draw calls per room for static shell).
- Repeated props (pipes, panels, ceiling lights, crates) → InstancedMesh.
- Lighting (ship): the pooled rig in src/fx/lightingRig.ts — 1 hemi + 1 ambient + ~12 positional lights, exactly 2 shadow casters (spots @2048). Do not add ship lights without retiring one; everything else reads as lit via emissives. Pocket worlds get their own budget: ≤6 positional + 1 hemi per world (only the active scene costs).
- Textures: CanvasTexture, 512–1024px, generated once and reused across rooms.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))`.
- Frustum culling is free — keep rooms as separate top-level groups so it works.

## Known gotchas (do not rediscover these)
- Headless Chromium frequently falls back to SwiftShader (software GL). FPS from `npm run verify` can read 15 when the real number is 120. Screenshots are still valid. Trust only `verify:headed` for fps.
- PointerLock requires a user gesture — the harness cannot use mouse-look. That's why `__setCam` teleports exist. Never gate scene readiness on pointer lock.
- Bloom (UnrealBloomPass) costs 2–4ms. It's a Phase 5 luxury, added last, re-verified against budget. If it blows the budget, ship without it.
- Planet through windows: rooms need actual geometry cutouts (CSG-free — build walls from sub-panels and omit one), not transparent textures, or depth sorting will fight you.
- Large THREE.Sprites render un-billboarded into GTAOPass's G-buffer (dark slabs in bright skies) — use Points or camera-facing mesh planes instead.
