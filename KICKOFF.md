# KICKOFF — Starship Explorer

Read CLAUDE.md first. It is the constitution; this file is the build order. Work through all phases autonomously. Run the full verification protocol at the end of each phase and commit before moving on. Do not skip gates.

---

## Phase 0 — Scaffold + eyes (the harness comes BEFORE the ship)

1. Scaffold Vite + TypeScript, install `three`, `@playwright/test` (chromium only), `@types/three`.
2. `src/core/perf.ts`: rolling fps over a configurable window, frame-time array for p95, and `renderer.info` capture (draw calls, triangles, geometries, textures). Expose `window.__perf.sample(ms: number): Promise<PerfReport>`.
3. `src/core/cameras.ts`: named-camera registry. `registerCam(name, position, lookAt)` + `window.__setCam(name)` that teleports the active camera (bypasses pointer lock).
4. `window.__ready`: Promise that resolves after first rendered frame post scene-build.
5. `scripts/verify.mjs`: builds, serves `vite preview`, launches Playwright Chromium, awaits `__ready`, then for every registered camera: `__setCam(name)` → wait 400ms → screenshot to `verify/shots/<name>.png`. Then `__setCam('corridor')` (or first cam) → `__perf.sample(5000)` → write `verify/report.json`. Wire `npm run verify` (headless) and `npm run verify:headed` (headless: false).
6. `src/ui/debug.ts`: overlay toggled with backquote showing live fps / draw calls / triangles / position.
7. Seed scene: one lit grey room so the harness has something to look at. `git init`, first commit.

**Gate:** `npm run verify` produces a screenshot and a sane report.json on the seed room.

---

## Phase 1 — Greybox ship + a body to walk it

Layout (single deck, axis-aligned): cockpit fore → corridor spine → crew quarters ×2 (port/starboard) → galley/mess → engineering aft. Door gaps in walls, no door meshes yet.

- First-person controller in `src/player/`: WASD + PointerLockControls, capsule collision against per-room AABB colliders (rooms expose them per the interface in CLAUDE.md). Eye height ~1.7m, walk ~3.5 m/s. Gravity optional — flat deck, just clamp Y.
- Register named cameras: `cockpit`, `cockpit-canopy` (looking out), `corridor`, `quarters-a`, `quarters-b`, `galley`, `engineering`.
- Rooms are greybox: correct proportions, placeholder materials, ceiling/floor/walls only.

**Gate:** every camera screenshot shows a coherent, lit, correctly proportioned room; you can mentally walk the layout from the shots; ≥60fps headed.

---

## Phase 2 — Space outside the windows

- Starfield: THREE.Points, ~4,000 stars on a large sphere, subtle size attenuation.
- Planet: large sphere, far placement, procedural CanvasTexture (banded noise — gas giant reads better than terrain at distance), very slow drift across the cockpit's field of view + slow self-rotation. Add a barely-perceptible ship sway (camera-parent oscillation, ±0.2°) so the drift reads as motion.
- Cut real window openings: full canopy in cockpit, portholes in corridor and quarters. Space must be visible from inside.

**Gate:** `cockpit-canopy` shot shows planet + stars; porthole shots show stars; budget holds.

---

## Phase 3 — Dress pass (this is where it starts looking like the reference)

- `src/fx/textures.ts`: procedural trim-sheet generators — cream panels with dark seam lines, burnt-orange band, grime/scuff noise, hazard striping, console screens. Generate once, reuse everywhere.
- Emissive teal light strips along floor edges and under cabinets; emissive ceiling light panels (these carry the "lighting" — actual lights stay ≤6 total).
- Props per room, instanced where repeated: cockpit (2 pilot seats, console bank with animated shader screens — scrolling schematic/waveform), quarters (bunks, lockers), galley (counter, cabinets, fridge with teal door strip, stove with red coils, a couple of cups), corridor (pipes along ceiling, wall vents, the orange door frames), engineering (reactor column with pulsing emissive).
- Door frames in burnt-orange per the palette.

**Gate:** screenshots match the Visual Direction palette and read as the same family as the reference frames; budget holds. This phase is the most likely budget-breaker — merge and instance aggressively before simplifying the design.

---

## Phase 4 — Interactions

- `src/player/interact.ts`: `Interactable` interface `{ id, prompt, radius, onInteract(ctx) }`. Center-screen raycast each frame within 2.5m; HUD shows `[E] <prompt>`; E triggers.
- Ship state in `src/core/state.ts`: ship clock (accelerated), `energy` and `hunger` (0–100, slow decay).
- Bunk → "Sleep": fade to black, advance clock 8h, energy → 100.
- Galley stove → "Eat": brief fade, hunger → 100.
- Minimal HUD: clock top-left, two thin bars for energy/hunger, prompt center-bottom.
- Expose `window.__test = { teleport(x,y,z), interact(), getState() }`.
- Add a functional test to verify.mjs: teleport adjacent to bunk → `interact()` → assert clock advanced and energy restored; same pattern for eat. Failures fail the verify run.

**Gate:** functional tests green; HUD visible in screenshots; budget holds.

---

## Phase 5 — Polish

- WebAudio, fully synthesized (no files): low engine hum (filtered noise + sine sub), soft footsteps on movement.
- Optional: UnrealBloomPass for the emissives. Re-run headed verify; if budget breaks, remove it without sentiment.
- README.md: controls, commands, architecture map, screenshots embedded from verify/shots/.
- Final headed verify, final commit, tag `v0.1`.

**Done means:** a stranger can `npm i && npm run dev`, walk the ship, watch the planet drift, sleep and eat, at 60fps.
