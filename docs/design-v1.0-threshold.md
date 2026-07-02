# v1.0 "THRESHOLD" — Portal Room + Pocket Worlds — Design Spec

Authored by the orchestrator (Fable). This document is the contract for all campaign agents. CLAUDE.md still governs (≤300 lines/file, no `any`, explicit return types, dispose replaced resources, verify contract). Read this WHOLE file before writing code.

## What ships

A new **Dimensional Annex** room aft of the cargo bay housing three portals. Each portal leads to a distinct **pocket world** (separate `THREE.Scene`): VERDANT (bioluminescent glade), ASHFALL (volcanic), RIFT (floating crystal islands over a void). Worlds contain procedurally-built **creatures** (ambient + scannable — the project's first NPC system), scannable flora/features feeding a ship **codex**, and **1 hidden relic each**. All 3 relics → the annex holotable projects a rotating hologram of the ship's exterior hull (first hull geometry ever; v1.1 flight will scale it up).

Locked scope decisions (do not expand): creatures have NO combat/dialogue; worlds are walk/scan/collect, no quest chains; 3 worlds exactly.

## Architecture: the World system

### Frozen interfaces — `src/core/worldTypes.ts` (Stage A authors; NOBODY else edits)

```ts
import type * as THREE from 'three';
import type { AABB, Interactable } from '../world/types';
import type { NamedCamera } from './cameras';

export type WorldId = 'ship' | 'verdant' | 'ashfall' | 'rift';

export interface WorldSpawn { position: THREE.Vector3; lookAt: THREE.Vector3 }

export interface World {
  id: WorldId;
  scene: THREE.Scene;              // own background/fog/lights/env
  colliders: AABB[];               // props + boundary rails
  interactables: Interactable[];   // return portal, relic, scannables (creature interactables come from CreatureHandles)
  cameras: NamedCamera[];          // names MUST be prefixed `${id}-`
  spawn: WorldSpawn;               // arrival pad, facing something good
  groundHeight(x: number, z: number): number;  // analytic; ship adapter returns 0
  update(dt: number, playerPos: THREE.Vector3): void;
  dispose(): void;
}
```

### Creature contract — also in `worldTypes.ts` (or `src/fx/creatures/types.ts` re-exported)

```ts
export type BodyPlan = 'quadruped' | 'skitterer' | 'floater' | 'glider';
export type Temperament = 'placid' | 'skittish' | 'curious';

export interface CreatureSpec {
  id: string;            // codex id, e.g. 'verdant-grazer' — UNIQUE across worlds
  scanName: string;       // e.g. 'LOAMSTRIDER'
  lore: string;           // one codex line
  plan: BodyPlan;
  sizeM: number;          // body length, meters
  palette: { primary: string; secondary: string; emissive: string };
  gaitHz: number;
  temperament: Temperament;
  count: number;          // population (herds share geometry / instance)
  seed: number;
  roamRadius: number;     // stay within this radius of spawn center
}

export interface CreatureHandles {
  group: THREE.Group;
  interactables: Interactable[];  // one per creature; .position synced every update
  update(dt: number, playerPos: THREE.Vector3): void;
  dispose(): void;
}

// src/fx/creatures/index.ts
export function spawnCreatures(
  specs: CreatureSpec[],
  groundHeight: (x: number, z: number) => number,
  center: THREE.Vector3,
): CreatureHandles;
```

Stage A ships a **visible stub**: each creature = a palette-tinted capsule at a seeded position with a gentle bob, plus a working scannable interactable. World lanes build and art-gate against the stub; the Stage-C Opus creature lane replaces the internals WITHOUT changing the signature.

### WorldManager — `src/core/worlds.ts` (Stage A)

- `registerWorld(world)`, `getActiveWorld()`, `switchWorld(id, opts?)`.
- All worlds built once at startup and kept resident (total tris stay far under 500k). Startup order: ship first, `window.__ready` resolves only after all worlds registered.
- **Switch sequence**: `fadeTransition` (exists, `src/ui/hud.ts`) → rebind composer scene → swap controller collider set + `groundHeight` → teleport player to `spawn` → fade in. Headless path (`__setCam`, tests) switches synchronously with no fade.
- **Composer rebind**: prefer mutating `renderPass.scene` / GTAO pass scene in place; if GTAO misbehaves, dispose + rebuild the composer behind the fade (`initBloom` already has a dispose path). Measure; pick; comment which and why.
- **Main loop gating** (`src/main.ts`): when active world ≠ ship, skip `ship.planet.tick`, `tickStarfield`, and room-crossfade audio (director freezes — determinism preserved); `tickState` (clock/hunger) runs everywhere; call `activeWorld.update(dt, playerPos)`.
- **Controller** (`src/player/controller.ts`): replace the flat `y = FLOOR_Y` clamp with `y = groundHeight(x,z) + EYE_HEIGHT`, and allow swapping the collider set. Ship behavior must be pixel-identical (constant 0).
- **`__setCam` world-awareness**: camera registry entries carry a `worldId`; `__setCam('verdant-qa')` synchronously activates that world first. `window.__camNames` unchanged in shape. Verify harness needs zero changes.
- **`window.__test` additions**: `getActiveWorld(): string`, `switchWorld(id: string): Promise<void>`, `getCodex(): {scans: string[]; relics: string[]}`, plus whatever Test 9/10 need.
- **State** (`src/core/state.ts`, Stage A adds): `codexScans: string[]`, `relics: WorldId[]`; `recordScan(id): boolean` (false if dupe → "KNOWN" toast), `collectRelic(worldId)`. Both included in the `localStorage['starship-save']` subset.

### Terrain helper — `src/fx/terrain.ts` (Stage A)

```ts
export interface TerrainOpts {
  seed: number; radius: number;          // playable radius, ~55-65m
  maxHeight: number;                     // gentle: 2-5m
  segments?: number;                     // default ~96
  colorRamp: { low: string; mid: string; high: string };
  texture?: THREE.CanvasTexture;         // optional detail overlay
}
export interface TerrainResult {
  mesh: THREE.Mesh;
  groundHeight(x: number, z: number): number;  // ANALYTIC (same fbm eval), no raycasts
  boundaryColliders: AABB[];                   // invisible rail ring at radius
}
export function buildTerrain(opts: TerrainOpts): TerrainResult;
```

fbm via existing `src/fx/space/noise.ts`. Boundary presentation is the world's job (fog + emissive rim ring); the rail colliders come from here.

### Portals — `src/fx/portalSurface.ts` (Stage A)

Three tiers:
1. **Dormant** (always): swirl `ShaderMaterial` plane — biome tint, `uTime` domain-warp swirl, additive fresnel rim. Cheap, always animating. `toneMapped:false` glow discipline per existing emissives.
2. **Live preview**: ONE shared half-res `WebGLRenderTarget` across all portals. Only the nearest portal within 8m AND in frustum goes live; virtual camera in the target world mirrors the player's pose relative to the portal plane; re-rendered at 30Hz via plain `renderer.render(targetScene, virtualCam)` (no post). `?portals=0` disables live tier entirely.
3. **Traversal**: E-interact OR walking through the plane → `switchWorld(target)`.

```ts
export interface PortalSurface {
  mesh: THREE.Mesh;                    // add to gate frame; name it for interaction
  interactable: Interactable;          // "Enter <WORLD>" prompt
  update(dt: number, playerPos: THREE.Vector3, camera: THREE.PerspectiveCamera): void;
  dispose(): void;
}
export function createPortalSurface(target: WorldId, tintHex: string, w: number, h: number): PortalSurface;
export function createReturnPortal(w?: number, h?: number): PortalSurface;  // target 'ship', arrival = annex pad
```

Stage A proves the whole spine with a throwaway `dev-void` world (flat disc, one light, return portal) reachable via `?world=dev` — deleted in Stage D.

## The Dimensional Annex (Stage B)

- Placement `(0, 0, 22)`, ~8W × 3.6H × 7D, door in cargo bay's aft wall — standard `DoorEntry`, **defaults OPEN** (test invariant), auto-close wiring like every other door (`interactWiring.ts` doorRecords).
- Files: `src/world/portalRoom.ts` + `portalRoomProps.ts` + `portalRoomTextures.ts` (≤300 each). Reuse `roomBuilder.buildRoom`, shell materials, `propMaterials`, `cached()`, `mergeStaticSiblings` (portal surfaces/holotable have custom `onBeforeRender`/names → automatically excluded from merge).
- Contents: 3 portal gates on dais steps (burnt-orange structural frames, gunmetal conduit feeds into floor, teal micro-LED accents) with tints — VERDANT `#46E0D8`-leaning green-teal, ASHFALL `#C7641E`/red, RIFT violet-prismatic; **dimensional survey console** (interactable → overlay via the `hudOverlay.ts` console pattern: worlds, codex counts, relics); **3 relic sockets** + central **holotable** (empty projection until Stage D); 1 art cam `portal-room`, 1 QA cam `portal-room-qa`.
- Look: this room is the ship's weird science bay — same worn-freighter language (cream panels, orange trim) but denser conduit runs and a faint teal atmosphere. It must still read as THIS ship.

## The three worlds (Stage C, one Sonnet lane each; files STRICTLY disjoint)

Common contract per world: `src/world/worlds/<id>.ts` (+ `<id>Props.ts`, `<id>Textures.ts`, `<id>Creatures.ts` as needed, ≤300 each); implements `World`; terrain via `buildTerrain`; own scene background/fog/sky; lights ≤6 positional + 1 hemi (only the active scene renders — ship budget unaffected); return portal near spawn; 1 relic (glowing pickup `Interactable` → `collectRelic`); 4 non-creature scannables (flora/features → `recordScan`); 2 creature species via `spawnCreatures` (stub during lanes); cameras `<id>` (art hero) + `<id>-qa`; per-world perf ≤120 draws / ≤80k tris; seeded determinism (use `rng(seed)` — screenshots must be stable).

| | VERDANT | ASHFALL | RIFT |
|---|---|---|---|
| Terrain | rolling teal-green glade, mossy ramp | dark basalt, emissive lava-crack overlay (`lavaCrackTexture` reuse), obsidian shards | main crystal island + 2-3 satellites, crystal bridge to relic island |
| Sky | deep dusk gradient dome, 2 moons (body-texture reuse) | ash-brown gradient, dim red sun sprite | `buildStarLayer` with alien palette + nebula sprites; abyss below |
| Life | glow-flora clusters, firefly Points | ember rise Points, smoke sprites | prismatic crystals, slow spark motes |
| Species | LOAMSTRIDER (quadruped herd, placid) + sprig skitterer (skittish) | armored beetle (curious) + ash-ray (glider, figure-8) | jelly floater (floater, placid) + crystal mite (skitterer) |
| Relic | inside a hollow glow-tree | behind a cooled lava flow | on the far side island via bridge |
| Fog/boundary | teal fog + glow ring | ash haze + heat shimmer rim | island edges = rails; falling is impossible |

Palettes may leave the ship's interior palette — these are OTHER DIMENSIONS — but each world needs ONE dominant hue family + disciplined accents, and creatures must read against their terrain.

## Creature engine (Stage C Opus lane — `src/fx/creatures/`)

`builder.ts` (seeded primitive assembly per `BodyPlan`, ≤600 tris/creature, herd species instanced or shared-geometry), `animate.ts` (procedural: sin-phase leg cycles, body bob, head look-at, jelly bell-pulse; NO SkinnedMesh/AnimationMixer), `behavior.ts` (FSM: IDLE / WANDER perlin-heading terrain-following / FLEE / CURIOUS approach-to-3m-hold-retreat; clamp to `roamRadius`; y from `groundHeight` except floaters/gliders which hover/soar). Interactable `.position` synced every update (the existing raycast walks ancestor `.name` chains — name creature root groups with the interactable id). Scan prompt: "Scan <SCANNAME>"; `onInteract` → `recordScan(id)` + toast (dupe → "ALREADY CATALOGUED").

## Codex / relics / holotable (Stage D)

Survey console reads live codex state; relic pickup lights its annex socket (emissive swap + small light NO — emissive only, the light pool is full); all 3 → holotable ignites: additive-teal wireframe-ish **hull miniature** (~1m long, slowly rotating on `onBeforeRender`). Hull design: a chunky worn freighter silhouette that plausibly encloses the interior layout (cockpit nose fore, corridor spine, engine block aft matching engineering, cargo belly aft — interior spans ~43m Z × 13m X; miniature scale ~1:50). This mesh is the reference for v1.1's full-scale hull — build it as a standalone factory `src/fx/hullMiniature.ts` so it can be scaled later.

## Tests & verify

- **Test 9 — portal roundtrip**: teleport to annex → `switchWorld('verdant')` via interactable → assert `getActiveWorld()==='verdant'` + player near spawn → return portal → assert 'ship' + tests 1-8 state intact.
- **Test 10 — codex/relic/save**: scan one creature (headlessInteract) → codex has id; dupe scan returns false; collect relic → present; `saveState`/`loadState` roundtrip preserves both.
- Tests 1–8 stay green; doors-OPEN invariant includes the new cargo–annex door.
- New cameras (8): `portal-room`, `portal-room-qa`, `verdant`, `verdant-qa`, `ashfall`, `ashfall-qa`, `rift`, `rift-qa`.
- Flags: `?world=<id>` dev spawn, `?portals=0` live-preview kill.
- Headless verify = functional tests; **HEADED = art + fps, authoritative**. Perf acceptance per active world: avgFps ≥ 60 (expect 100+), **p95 ≤ 18ms (binding)**.

## Perf & discipline reminders

- Only ONE scene renders per frame (+ occasionally the half-res portal RT at 30Hz — the only double-render moment).
- Worlds: prefer merged static geometry (`mergeStaticSiblings`) + InstancedMesh for repeats (crystals, shards, flora clusters).
- Every `dispose()` complete — geometries, materials, textures, RTs.
- No new globals beyond the sanctioned verify contract additions listed above.
- Seeded RNG everywhere; never `Math.random()` in world/creature code (screenshot determinism).
