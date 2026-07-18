# v1.1 "SOVEREIGN" — Pilotable Flight — Design Spec

Authored by the design pass (Fable). This document is the contract for all campaign agents. CLAUDE.md still governs (≤300 lines/file, no `any`, explicit return types, dispose replaced resources, verify contract, p95 ≤ 18ms binding). `docs/research-flight.md` is the tuning bible — its numbers seed §9. Read this WHOLE file before writing code.

## 1. What ships

Pilotable flight, no landings. The pilot takes the helm (port cockpit seat), steers pitch/yaw/roll with throttle and boost, and the universe responds: stars stream along the true velocity vector, cast bodies swing around the ship as it turns, a seeded **destination planet** hangs in the deep field and genuinely gets closer. A full-scale exterior hull renders under an NMS-style chase camera (V to toggle) that lags into banks. Approach a planet until it fills the canopy, then the ship holds station — touchdown is v1.2. Both fantasies are first-class: (a) stand up mid-flight and walk the deck while space wheels past the portholes; (b) watch the hull bank through the starfield from outside.

Locked scope (do not expand): no landing/touchdown, no combat, no multiple ships, no orbital mechanics. `?flight=0` must reproduce v1.0 exactly.

## 2. Frame-of-reference contract (read twice)

The ship NEVER moves or rotates in the rendered scene. The interior, colliders, cameras, and the walking player live in **ship frame S** — the scene frame, unchanged from v1.0. Flight is realized by moving the universe (KSP Krakensbane precedent):

```
WORLD FRAME W (inertial, virtual — never rendered directly)
    attitude q : S → W   (ship orientation; identity at boot)
    velocityW  = q · (0,0,-1) · speed   (nose is -Z in S; lateral bleed keeps v nose-aligned)
    ship world position: PINNED AT ORIGIN forever (floating origin — content moves instead)

SHIP FRAME S (the THREE.Scene)
    interior rooms, colliders, player, named cams ......... direct children (untouched)
    universeRig: THREE.Group ............................. rig.quaternion = q⁻¹, set once/frame
        ├─ starfield-near (Points, vec3 wrap shader)
        ├─ starfield-far  (Points, 25% parallax)
        ├─ nebula sprites, hero sun
        ├─ director cast group (bodies / asteroid field / events)
        └─ destination planet (approach system)

Rendered position of any universe object:  p_S = q⁻¹ · (p_W_relative)
Per-frame content translation in rig-local (=world) space:  p += flowW · dt,
    where flowW = -velocityW  (apparent universe velocity)
```

Consequences the whole campaign relies on:
- **Rotation** of the ship = one quaternion write on `universeRig` per frame. Portholes automatically show stars sweeping during turns — fantasy (a) costs nothing.
- **Translation** = content streams by `flowW·dt` in rig-local space. Stars wrap on GPU; bodies spawn/despawn on a flow-aligned axis; nothing accumulates unbounded (no float-precision drift, ever).
- At boot (q = identity, throttle at cruise default), `flowW = (0,0,+14)` — byte-compatible with today's +Z scroll at `CRUISE_SPEED_NEAR = 14`. Determinism at t=0 is preserved by construction.
- Angular velocity is composed as quaternion deltas, never Euler writes (the institutionalized `sway.ts` lesson; sway itself is unchanged and stacks on top).

## 3. Design decisions

### D1 — Universe-velocity vector system
**Decision.** One source of truth: `src/flight/flightState.ts` (module singleton) owns `attitude`, `angularVel`, `speed`, `throttle`, `velocityW`, `flowW`, `travelDir` (last non-degenerate flow direction, used when speed≈0), `trauma`, `mode`. Everything downstream is a consumer:
- **Star shader**: `uScroll: float` becomes `uScrollVec: vec3` (accumulated ∫flowW·dt), with `uMin: vec3` / `uSpan: vec3` and per-component 3-axis wrap: `p = mod(position - uScrollVec - uMin, uSpan) + uMin`. Direction is no longer a shader constant. The near slab is **symmetrized** (Z −900..+900; X/Y unchanged) so wrap behaves identically in any flow direction — the fore-biased runway was a fixed-+Z optimization and dies with it.
- **Director / cast**: `driftSpeed`+`vx/vy` are replaced by per-body `driftW: Vector3` (small own-motion); tick becomes `pos += (flowW + driftW)·dt`. Spawn/despawn generalize from Z-bands to the **flow axis**: build an orthonormal basis from `travelDir` at spawn time; spawn at `dot(pos, travelDir) ∈ [-1900,-1600]` with lateral spread in the ⊥ plane; despawn when `dot(pos, travelDir) > 500`. Same numbers, rotated frame. Scan bands likewise project onto `travelDir`.
- **Nebula/sun**: children of the rig; nebula drift takes `flowW × 0.25` (vec3) instead of a scalar; sun is world-fixed (rotates with the rig only).

**Rationale.** Landmark objects (sun, signature heroes) *must* rotate around the ship coherently or a 180° turn is a lie; once a world frame exists for them, running stars in any other frame creates two sources of truth.
**Rejected.** Keeping scroll scalar-+Z and only rotating spawn logic with heading — stars would not sweep during turns and landmarks would not swing; visually dead.

### D2 — Helm mode
**Decision.** Seat-port becomes the helm ("Take Helm [E]" — its `buildSeatInteractables` entry is *removed* from `interactWiring.ts` and replaced by an interactable exported from `src/flight/helm.ts`; net-negative line change to a file at cap). Seat-starboard stays a plain Sit. Entry reuses `enterAnchor` verbatim; helm-active is a flag in flight state, not `state.ts`. Input is a scoped context (console-bank modal precedent): listeners registered on enter, removed on exit. All writers feed one `FlightInput` struct — mouse, keyboard, and TestAPI are interchangeable (headless has no pointer lock):
- Mouse (pointer-locked): pitch (Y) / yaw (X). `PointerLockControls.disconnect()` on helm enter, `connect()` on exit — the camera stays anchored at the seat with a small damped "steering lean," free-look is surrendered while piloting.
- Arrows: pitch/yaw keyboard backup (currently aliased to WASD-walk, which is dead while seated — no conflict).
- A/D roll trim · W/S throttle up/down (persistent 0..1) · Shift hold = boost · X = all-stop · F = approach assist on nav target · V = toggle chase view · **E = stand up** (unchanged `interact.ts:86-89` path; helm exit hooks `exitAnchor`).

**Stand-up behavior: autopilot holds.** Velocity, attitude and throttle persist; angular rates damp to zero; the universe keeps streaming. This IS fantasy (a) — set up a flyby, stand, walk to a porthole.
**Rejected.** Damp-to-cruise on stand-up (kills fantasy a); mouse free-look while steering (one mouse, one job — NMS made the same call).

### D3 — Flight model
**Decision.** `src/core/damp.ts` ships the shared primitive (`damp`, `dampVec3`, `slerpDamp` — frame-rate-independent exponential, research §1) and is the campaign's first merged code. `src/flight/flightModel.ts` implements the research pipeline exactly: input smoothing (λ12 keyboard) → angular velocity damped toward `input × maxRate` (λ_rot 8) with **asymmetric rates** (pitch 2.2 / yaw 1.2 / roll 3.2 rad/s) → **auto-bank** `targetRoll = -yawInput × 35°` (blend λ6) → attitude integrated by quaternion delta → speed exponential-approach to `throttle × maxSpeed` (accel λ2.0 / decel λ1.0) → lateral bleed λ3 (velocity direction damps toward nose — "drift through the turn"). All constants live in `src/flight/flightTuning.ts` (§9) — feel-tuning is one file. `state.setHeading` finally gets its caller: compass heading derived from `q·(0,0,-1)` projected to the world XZ plane, every frame; the NAV console stops reading 000°. Persistence: heading only (already in state); attitude/velocity reset to cruise defaults on load — the cast isn't persisted either, and a mid-turn save is not a state worth honoring.
**Rejected.** Force/impulse integration (research is explicit: exponential approach reads better and is unconditionally stable); flight fields in `state.ts` (bloat; module singleton matches controller.ts precedent).

### D4 — Exterior hull + chase cam
**Decision.** The hull instantiates ONCE, full scale, **in the main ship scene at the origin** (it is built around `interiorAnchors`, so it wraps the interior exactly), on **THREE.Layers bit 1**. The main camera disables layer 1 → portholes and every interior view are pixel-identical. The chase camera enables layers 0+1 → sees hull + all universe content (stars, streaks, bodies — they're scene children via the rig). No second scene, no second render: the view toggle swaps which camera the composer renders (`bloom.setCamera(cam)`, mirroring the shipped `setScene` in-place rebind at `bloom.ts:197`). Interior keeps existing only in the scene graph (occluded behind opaque hull skin); it does not render separately while in chase view. New `src/fx/hull/hullMaterial.ts` gives the loft a worn-freighter PBR-ish skin (CanvasTexture panel seams, palette-compliant) — the holo shader stays hologram-only. Engine glow cones keyed to throttle (polish stage).

**Chase rig — the frame-inversion is the whole trick.** The hull never rotates in S, so a naive scene-space chase cam would show a statue. The camera must lag in the WORLD frame and be converted back:

```
// world-frame lag state:  qCam (quaternion), pCam (vec3 offset from ship)
qCam  = slerpDamp(qCam, q, λ_camRot=3, dt)          // rotation lags SLOWER — this differential IS piloting
armW  = qCam · (0, ARM_Y, +ARM_Z)                   // behind = +Z (nose is -Z); arm stretches with speed
pCam  = dampVec3(pCam, armW, λ_camPos=6, dt)
// convert to scene/ship frame for rendering:
cam.position = q⁻¹ · pCam
lookAt target = (0, LEAD_Y, -LEAD_DIST)             // constant in S (lead point on the nose axis)
cam.up = q⁻¹ · (qCam · (0,1,0))                     // ← the lag delta appears here: hull banks IN FRAME
```

When the pilot rolls, `qCam` trails `q`, the up-vector conversion tilts, and the hull visibly banks inside the frame before the camera catches up — exactly research §4, inverted correctly. FOV: base 62°, +16° on `smoothstep(0.4,1.0, speed/max)`, widen λ4 / narrow λ2.5. Arm +25% at max speed.

**Verify integration.** Camera-registry entries gain an optional `view: 'interior'|'exterior'` field; `teleportToCamera` applies it (precedent: entries already carry `worldId` and flip worlds). A named cam **`chase`** activates exterior view and snaps the rig to its converged pose → `__setCam('chase')` gives deterministic headed screenshots with zero harness changes.
**Rejected.** Separate exterior scene (duplicates the entire space environment or forces cross-scene sharing; layers are free); continuous dual render interior+exterior (double cost, no fantasy served — portholes already prove the interior lives).

### D5 — Planet approach
**Decision.** Two body classes, ONE code path — `renderDist = min(trueDist, 1500)`:
- **Cast heroes** (r 60–140): already inside 1500; render 1:1, no scaling. You can simply fly at them; proximity hold triggers like any target.
- **Destination planets** (the new thing): 1 seeded **signature destination planet** spawns at boot (trueRadius 4,000 u, trueDistance 90,000 u, fixed world direction, deterministic — spawned AFTER existing signature rng draws so the seeded sequence and Test 7 stay byte-identical). Rendered parked at 1500 with `renderScale = trueRadius × (1500/trueDist)` → boots as a ~66-unit disc in the deep field. Angular size `2·atan(trueRadius/trueDist)` is preserved EXACTLY at all times — angular size IS distance, and it is a test-assertable invariant.
- The planet is genuinely *there*: every frame `trueDist -= dot(velocityW, dirToPlanet)·dt` — free flight closes distance honestly; its rendered direction rotates only via the rig (world-fixed bearing).
- **F = approach assist** (NMS): autopilot damps nose onto the bearing and normalizes speed to `trueDist / T_ARRIVE` (clamped) → closing always takes ~12s regardless of remaining distance.
- **Close range, no landing:** when angular size reaches ~65% of vertical FOV, mode → `HOLD`: closure clamps to zero (throttle toward the body is eaten), HUD reads `PROXIMITY HOLD — ORBITAL INSERTION UNAVAILABLE`, the planet fills the canopy and slowly rotates. Steering away past a hysteresis threshold releases the hold. Atmosphere haze shell (Outer Wilds trick) sells "world" at hold range.

**Deviation from research build order, flagged for Sam:** the KSP two-scene renderer is NOT built in v1.1. Parking at 1500 keeps everything inside the existing far-plane-2000 single scene; the portal-RT precedent proves we *can* layer scenes if ever needed, and it remains the fallback if the spike exposes z-precision or clipping artifacts. One scene, one render, one composer — simpler and cheaper.
**Rejected.** Approach as a scripted cutscene (nothing to fly = fantasy b dies); making cast heroes the scaled bodies (they're close-range set dressing; retrofitting breaks the shipped Living Cruise).

### D6 — Star streaks + speed feel (core vs polish)
**Core (ships with Stage 3):** FOV widening (cheapest speed tool; helm interior gets a half-strength version) and chase-cam speed pull-back.
**Polish (Stage 5):** `src/fx/space/starStreaks.ts` — LineSegments layer crossfading in above `0.45 × maxSpeed` (streaks at cruise read as a bug — research §6), tail = `pos − relVelW × streakScale` computed in the vertex shader from `uScrollVec` + `uFlowW`; trauma shake (`src/fx/shake.ts`, Eiserloh: shake = trauma², rotational only, per-channel Perlin at 3 seeds, applied to the render transform after sway); engine-hum modulation via new `src/fx/audioFlight.ts` (audioSynth.ts is over cap — new node with a `setIntensity(speed, boost)` hook); throttle-lever meshes tilt with throttle via `getObjectByName('lever-port'/'lever-stbd')` from helm code (zero edits to over-cap cockpitConsoles.ts).

### D7 — Perf + regressions
Headroom is huge (p95 7.1ms vs 18ms budget; 15.4k tris vs 500k). Adds: hull ~25k tris / 1 draw (merged), streaks 1 draw, engine glow ≤2 draws, zero extra render passes. Projected p95 ≤ 10ms. Hard rules: only one camera renders per frame; rig rotation is one quaternion write; cast CPU work is unchanged O(bodies). All 10 existing tests stay green — flight ticks are gated on `activeId === 'ship'` exactly like the director (`main.ts:227`), so world roundtrips (T9/T10) freeze flight deterministically, and the doors-open-at-load invariant is untouched (flight touches no doors). t=0 headed screenshots re-baseline ONCE (near-slab symmetrization changes star placement); signature heroes/sun/planet positions are pinned so composition holds.

### D8 — File plan
See §8. All flight code is new files under `src/flight/` — controller.ts (357), cockpitConsoles.ts (341), interactWiring.ts (300) receive only net-zero-or-negative edits or none at all.

## 4. Frozen interfaces — `src/flight/types.ts` (Stage 1 Lane A authors; NOBODY else edits)

```ts
import type * as THREE from 'three';

export type FlightMode = 'CRUISE' | 'HELM' | 'BOOST' | 'APPROACH' | 'HOLD';

export interface FlightInput {          // every writer (mouse/keys/TestAPI) fills this
  pitch: number; yaw: number; roll: number;   // -1..1
  throttleDelta: number;                      // W/S accumulation
  boost: boolean;
}

export interface FlightSnapshot {       // read-only view for HUD/consoles/tests
  mode: FlightMode;
  speed: number; throttle: number;
  headingDeg: number; pitchDeg: number; bankDeg: number;
  attitude: THREE.Quaternion;           // S→W
  flowW: THREE.Vector3;                 // apparent universe velocity, world frame
  travelDir: THREE.Vector3;             // unit, never degenerate
  helmActive: boolean; view: 'interior' | 'exterior';
  approach: { targetName: string; trueDist: number; renderScale: number; holdEngaged: boolean } | null;
}

export function getFlight(): FlightSnapshot;
export function tickFlight(dt: number): void;            // main.ts, ship-world only
export function setFlightInput(partial: Partial<FlightInput>): void;
```

The universe consumes exactly two things per frame: `rig.quaternion.copy(attitudeInverse)` and `flowW` — nothing in `src/fx/space/` may import helm/input/camera code.

## 5. Stage / lane decomposition

Every gate: `typecheck` clean → `verify` (all tests green, doors-open invariant) → `verify:headed` screenshots read by the orchestrator with its own eyes → report.json p95 ≤ 18ms → commit. Never start a stage on a red baseline.

**Stage 0 — SPIKE: planet scaling (single lane, throwaway-tolerated)**
Files: `src/core/damp.ts` (real, permanent) + `src/flight/spikes/planetScale.ts` behind `?spike=planet`. A single textured sphere (reuse `bodies.ts` textures), trueRadius 4,000 / trueDist 90,000, scripted arrival-time-normalized approach to HOLD using `damp()` — no input system needed. Registers cams `spike-far`, `spike-mid`, `spike-hold`.
*Gate:* functional assert `|2·atan(trueR/trueD) − 2·atan(renderR/renderD)| < 1e-6` sampled through the whole run (angular-size invariant, exact); headed screenshots at the three cams show a believable small→huge planet with no far-plane clip, no z-fighting, no scale pop at the 1500 boundary. **This gate decides D5's single-scene bet — if it fails, the KSP two-scene fallback activates before any lane is written.**

**Stage 1 — FOUNDATION (Lane A ∥ Lane C — disjoint files; orchestrator integrates main.ts serially)**
- **Lane A (flight model):** `flight/types.ts`, `flightState.ts`, `flightModel.ts`, `flightTuning.ts`; TestAPI hooks (`getFlight`, `setFlightInput`); `state.setHeading` wired. No rendering.
- **Lane C (universe vector):** `flight/universeRig.ts`; vec3-scroll shader in `starLayer.ts`; near-slab symmetrization in `starfield.ts`; flow-aligned spawn/despawn + `driftW` in `cast.ts`; `director.ts` consumes `flowW`; nebula vec3 drift. `?flight=0` freezes attitude=identity + flowW=(0,0,14) — v1.0-identical.

*Gate:* T1–T10 green; T11 (model math) + T12 (universe coherence) green; headed t=0 shots ≈ v1.0 composition (re-baselined once); NAV console shows live heading after a scripted yaw via TestAPI.

**Stage 2 — HELM (Lane B) ∥ Stage 3 — EXTERIOR (Lane D)** — disjoint files; both depend on Stage 1; orchestrator serializes their small `main.ts` touches.
- **Lane B:** `flight/helm.ts`, `helmInput.ts`, `ui/flightHud.ts`; seat-port swap in `interactWiring.ts` (net-negative); `hud.ts` gains `setFlightStripText()` (~6 lines); stand-up autopilot; pointer-lock interplay.
  *Gate:* T13a — helm enter/exit via TestAPI, throttle changes speed, E stands up and speed persists; headed shots: helm view at cruise + mid-turn (stars sweeping past canopy, HUD strip live); doors invariant.
- **Lane D:** `fx/hull/exterior.ts`, `hullMaterial.ts`; layers; `chaseCam.ts` with the world-frame lag algorithm from D4 verbatim; `cameras.ts` `view` field; `bloom.setCamera`; V toggle; FOV widening; named cam `chase`.
  *Gate:* T13b — `__setCam('chase')` flips view, `getFlight().view === 'exterior'`; headed shots: `chase` at cruise AND mid-bank (hull visibly banked in frame — the money shot; if the hull reads as a statue the lag math is wrong, reject); porthole/interior cams pixel-compared against Stage 1 baseline.

**Stage 4 — APPROACH (Lane E, sequential — needs A+C+D)**
`flight/approach.ts` productionizes the spike (spike file deleted); signature destination planet in director (rng-order-safe); F-assist; HOLD mode + hysteresis; haze shell; NAV/scan integration; `?approach=0`.
*Gate:* T14 green; headed sequence: far disc → mid approach → HOLD filling canopy, from both helm and chase cams; angular-size invariant assert still exact; p95 within budget.

**Stage 5 — FEEL & POLISH (Lane F + all-hands tuning on flightTuning.ts only)**
Streaks, trauma shake, audioFlight hum, engine glow, throttle levers, boost feel, final tuning pass, full headed art panel (Opus critics per house pattern), perf re-verify, README/roadmap docs.
*Gate:* all 14 tests; p95 ≤ 18ms headed; art panel passes "does the boost feel violent / does cruise feel majestic"; every kill-switch flag verified to actually kill its feature.

## 6. Tests & verify additions (T11+, all headless-safe via `window.__test`)

New TestAPI hooks: `getFlight()`, `setFlightInput(partial)`, `helmEnter()/helmExit()`, `setFlightView(v)`, `engageApproach()`, `getUniverseInfo(): {bodyCount, flowDir, scrollVec}`.

- **T11 — flight model:** helmEnter → setFlightInput yaw=1 for 2s (real RAF) → heading changed by the expected sign/magnitude envelope; bankDeg < 0 (auto-bank); input zeroed → angularVel damps toward 0; throttle up → speed rises along exponential envelope; attitude stays unit-length.
- **T12 — universe coherence:** capture signature-hero bearing → scripted 180° yaw → hero bearing flipped to aft hemisphere (rig rotation), `getScan()` API still functional; after 20s of fast flight `bodyCount ≤ 7` and no body beyond despawn distance (flow-aligned spawn/despawn works off-axis).
- **T13 — helm + view:** helm enter/exit state machine; E-stand preserves speed (autopilot); `__setCam('chase')` → `view==='exterior'`, hull object present on layer 1; return to interior cam → view resets.
- **T14 — approach invariant:** engageApproach → trueDist strictly decreasing, `renderDist = min(trueDist,1500)`, angular-size preservation `< 1e-6` error; HOLD reached and closure clamped; steering away releases HOLD; T1-state untouched afterward.
- Existing T1–T10 unmodified; T9/T10 world roundtrips additionally assert flight froze (snapshot flowW before/after).

## 7. Risks, ranked, each with its kill-switch

1. **Universe-rig refactor breaks Living-Cruise determinism/art** (Test 7, t=0 composition). Mitigation: identity-boot equivalence by construction, rng draw-order appended-only, one deliberate re-baseline. Kill-switch: `?flight=0` restores scalar +Z cruise wholesale.
2. **Chase-cam frame-inversion math wrong** (hull reads static or camera flips). Mitigation: algorithm specified verbatim in D4; Stage 3 gate explicitly rejects a statue-hull screenshot. Fallback: rigid chase (no lag) still ships the exterior fantasy at reduced feel.
3. **Single-scene planet scaling artifacts** (z-precision at 1500, pop at boundary). Mitigation: Stage 0 spike decides BEFORE lanes; fallback is the KSP two-scene layered render (portal-RT precedent proves the machinery). Kill-switch: `?approach=0`.
4. **Hull exterior exposes interior geometry** through canopy/porthole sockets from outside. Mitigation: opaque hull skin occludes by depth; if sockets are open, either glaze them emissive (NMS window-glow) or move rooms to an interior-only layer. Cosmetic-only risk.
5. **Helm input vs pointer-lock harness conflicts.** Mitigation: `FlightInput` abstraction — tests never touch the mouse path; PointerLockControls disconnect/connect is two shipped methods.
6. **File-cap creep in main.ts (265) / interactWiring (300).** Mitigation: net-negative edit specified for interactWiring; if main.ts breaches, extract `src/core/flightBoot.ts` (worldBoot precedent).
7. **Perf creep from streaks/hull/shake.** Mitigation: ~2× current cost still under half budget; per-feature flags `?streaks=0`, `?chase=0`; CLAUDE.md 3-strikes simplify rule.

## 8. File plan (owner lanes disjoint; line budgets)

| New file | Lane | ~Lines | Purpose |
|---|---|---|---|
| `src/core/damp.ts` | Spike | 40 | damp/dampVec3/slerpDamp — the load-bearing primitive |
| `src/flight/spikes/planetScale.ts` | Spike | 200 | `?spike=planet` proof; deleted in Stage 4 |
| `src/flight/types.ts` | A | 60 | frozen contracts above |
| `src/flight/flightState.ts` | A | 130 | singleton state + snapshot + persistence hookup |
| `src/flight/flightModel.ts` | A | 190 | rotation pipeline, auto-bank, velocity, bleed |
| `src/flight/flightTuning.ts` | A | 80 | EVERY constant in §9 — the one tuning file |
| `src/flight/universeRig.ts` | C | 140 | rig group, attach/orphan, per-frame consume |
| `src/flight/helm.ts` | B | 200 | helm interactable, enter/exit, autopilot handoff |
| `src/flight/helmInput.ts` | B | 130 | scoped listeners, mouse/keys → FlightInput |
| `src/ui/flightHud.ts` | B | 150 | speed/heading/throttle strip, mode, hold banner |
| `src/flight/chaseCam.ts` | D | 170 | world-frame lag rig + FOV + view toggle |
| `src/fx/hull/exterior.ts` | D | 130 | full-scale instancing, layer 1, engine glow anchors |
| `src/fx/hull/hullMaterial.ts` | D | 160 | PBR-ish worn skin, palette-compliant |
| `src/flight/approach.ts` | E | 230 | destination planet, scaling, assist, HOLD |
| `src/fx/space/starStreaks.ts` | F | 190 | LineSegments streak layer + crossfade |
| `src/fx/shake.ts` | F | 100 | trauma system, render-transform only |
| `src/fx/audioFlight.ts` | F | 90 | modulated hum node + setIntensity |

Existing files touched (owner in parens; all others read-only): `starLayer.ts`, `starfield.ts`, `director.ts`, `cast.ts`, `nebula.ts` (C) · `interactWiring.ts` net-negative, `hud.ts` +6 (B) · `cameras.ts` +view field, `bloom.ts` +setCamera (D) · `state.ts` zero-change (setHeading exists), `testApi.ts` (A then per-lane appends, orchestrator-mediated) · `main.ts` (orchestrator-mediated only, per-stage serial integration).

## 9. Tuning constants — seeded from research-flight.md (all live in `flightTuning.ts`)

| Constant | Value | Source/note |
|---|---|---|
| `INPUT_SMOOTH_LAMBDA` | 12 | §2.1 keyboard 10–15 |
| `ROT_LAMBDA` | 8 | §2.2 window 6–10 |
| `MAX_PITCH_RATE` | 2.2 rad/s | §2.3 asymmetric on purpose |
| `MAX_YAW_RATE` | 1.2 rad/s | always slower than pitch |
| `MAX_ROLL_RATE` | 3.2 rad/s | |
| `AUTO_BANK_DEG` | 35° | §2.4, blend λ 6 |
| `MAX_SPEED_CRUISE` | 40 u/s | boot throttle 0.35 → 14 u/s = v1.0 stream |
| `BOOST_MULT` | 2.5 | boost max 100 u/s |
| `ACCEL_LAMBDA / DECEL_LAMBDA` | 2.0 / 1.0 | §3 asymmetric, satisfying coast |
| `LATERAL_BLEED_LAMBDA` | 3 | §3 drift-through-turn |
| `CAM_POS_LAMBDA / CAM_ROT_LAMBDA` | 6 / 3 | §4 — rotation MUST lag slower |
| `CHASE_ARM` | (0, 10, 40) | ~50m hull; pull-back +25% at max, λ 2.5 |
| `LEAD_DIST / LEAD_Y` | 25 / 2 | look-at lead point, ship low in frame |
| `CHASE_FOV_BASE / FOV_BOOST` | 62° / +16° | §4; smoothstep(0.4,1.0,speed/max); widen λ4, narrow λ2.5 |
| `HELM_FOV_BOOST` | +8° | half-strength interior version |
| `TRAUMA_BOOST_SPIKE` | 0.55 | §5; continuous = 0.3·smoothstep(0.7,1.0,s/max) |
| `SHAKE_MAX_DEG` | 1.5 pitch/yaw, 2.5 roll | §5, Perlin 20 Hz, seeds n, n+1, n+2 |
| `STREAK_THRESHOLD` | 0.45 × max | §6 onset 40–50%; maxLen 30 u; brightness +40% |
| `PARK_DIST` | 1500 | §8.1 fixed render distance |
| `APPROACH_T_ARRIVE` | 12 s | §8.2, speed clamped [20, 4000] u/s true |
| `HOLD_ANGULAR_FRAC` | 0.65 × vFOV | hold trigger; release hysteresis 0.5 |
| `DEST_TRUE_RADIUS / TRUE_DIST` | 4000 / 90 000 u | signature destination planet |

*(λ values, bank, FOV, thresholds are tune-by-feel per the research doc — Stage 5 owns the pass; only this file changes.)*
