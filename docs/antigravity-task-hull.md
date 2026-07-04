# TASK BRIEF — Exterior hull geometry factory + hologram material

> Audience: an autonomous coding agent (Google Antigravity) working in this repo at
> `C:\Users\bates\Documents\Coding\starship`. This brief is self-contained; you do NOT
> have access to the conversation that produced it. Follow it exactly. Where this brief
> and your own judgment conflict, this brief wins.

## Context (read first, in this order)

1. `docs/research-hull.md` — the implementation playbook. MANDATORY, follow it closely.
2. `docs/design-v1.0-threshold.md` — section "Codex / relics / holotable (Stage D)" only.
3. `CLAUDE.md` — repo rules. The ones that bind you: TypeScript strict, **no `any`**,
   explicit return types on exported functions, **≤300 lines per file**, seeded
   determinism (mulberry32-style, no `Math.random()` at module scope).

This is a procedural Three.js walkable starship (interior only, ~43m × 13m × 5m
footprint). You are building the ship's FIRST-EVER exterior hull geometry. In v1.0 it
ships only as a ~1m holographic miniature on a holotable; in v1.1 the same geometry
becomes the full-scale flyable exterior. **The geometry must therefore be full-scale
correct** (real meters, hull wrapping the real interior), even though only the hologram
renders now.

## File ownership — HARD BOUNDARY

You may create/modify ONLY these five files:

- `src/fx/hull/anchors.ts`
- `src/fx/hull/buildHull.ts`
- `src/fx/hull/holoMaterial.ts`
- `src/fx/hull/preview.ts`      (dev-only preview entry)
- `hull-preview.html`           (repo root; Vite serves it at /hull-preview.html)

Do NOT edit any other file — not `src/main.ts`, not `src/world/*`, not `package.json`,
not `vite.config.*`, nothing. Other agents own those files and have uncommitted work in
this tree. Do NOT run `npm install`. Do NOT `git commit`, `git add`, or touch git state
in any way — the orchestrator reviews your working-tree diff. If you believe you need to
edit a file outside this list, STOP and write your reasoning into
`docs/antigravity-hull-REPORT.md` instead (you may also create that report file).

`src/fx/hull/*.ts` must import ONLY from `'three'` (and each other). No imports from
`src/world/` or `src/core/` — the hull module must stay dependency-clean so v1.1 can
lift it whole.

## Deliverable 1 — `anchors.ts` (single source of truth)

READ `src/world/assembly.ts` (room placements) and `src/world/roomBuilder.ts` (room
dimensions) to learn the real interior layout, then TRANSCRIBE it into data:

```ts
export interface StationSlice { x: number; halfW: number; halfH: number; yCenter: number }
export interface AnchorFrame { position: [number, number, number]; normal: [number, number, number] }
export interface InteriorAnchors {
  slices: StationSlice[];          // interior AABB slice per Z-station (see below)
  canopy: AnchorFrame;             // cockpit window region (the ship's "face")
  engineAxis: AnchorFrame;         // stern, thrust axis — MUST pass near volumetric centroid
  cargoDoor: AnchorFrame;          // cargo bay aft/side door region
  portholes: AnchorFrame[];        // a porthole per major room, correct wall side, ±20cm ok
}
export const interiorAnchors: InteriorAnchors = { /* transcribed values */ };
```

IMPORTANT COORDINATE NOTE: the interior's long axis is **Z** (cockpit forward, cargo/
annex aft — cargo bay sits at z≈13.5, the new annex at z≈22). `research-hull.md` writes
its examples with X as the long axis — adapt its math to Z-stations. Keep the hull in
the SAME coordinate frame as the interior (origin, +Z aft), so v1.1 alignment is free.

Each transcribed value gets a comment citing its source (file + what it is, e.g.
`// cargo bay: assembly.ts placement (0,0,13.5), 8×5×9`). This is a deliberate v1.0
shortcut — a `TODO(v1.1): replace with live export from assembly` comment goes at the
top of the file. Stations keyed to REAL bulkheads (nose, cockpit, each room boundary,
stern): 7–9 stations.

## Deliverable 2 — `buildHull.ts` (geometry factory)

Frozen public interface (a later integration agent consumes this exactly as written):

```ts
export interface HullBuild { geometry: THREE.BufferGeometry; tris: number }
export function buildHullGeometry(seed: number, anchors: InteriorAnchors): HullBuild;
```

Implementation per `research-hull.md` §1–§3:

- Loft chamfered-octagon stations from `anchors.slices` (MARGIN 0.6m standoff, ONE
  `CHAMFER_RATIO = 0.35` everywhere). Subdivide lengthwise ~1.5m for panel resolution.
- Parametric modules at anchors: engine block (stern, thrust through centroid ±10% hull
  height), cargo door assembly, canopy frame, `windowSocket()` per porthole (frame ring
  proud + recessed dark plane — NO CSG holes).
- Greeble scatter: kit of 8–12 pieces (12–60 tris each), seam-biased placement, yaw
  snapped to 90°, scale 0.8–1.2, ~5% coverage, engineering-zone weighting. Merge
  everything into ONE non-indexed BufferGeometry (flat facets via
  `computeVertexNormals()` after `toNonIndexed()`). `mergeGeometries` is available from
  `three/examples/jsm/utils/BufferGeometryUtils.js`.
- Silhouette rules (research §2) are ACCEPTANCE CRITERIA, not suggestions: mass
  hierarchy 70/25/5; 4–8 concave side-profile notches; symmetric primary/secondary
  masses, asymmetry only in tertiary greebles (≤15%); nothing floats (every module gets
  a visible mount); functional adjacency (tanks→engines, sensors dorsal-forward, RCS at
  the four extremal corners).
- Seeded RNG only (write a local mulberry32). Same seed → identical geometry.
- Budget: target ~25k tris, hard cap 50k. Report the real number via `tris`.
- UVs: u = perimeter fraction, v = z / totalLength (research §1 — load-bearing for
  v1.1 plating; harmless for the holo).

Exterior must contain the interior everywhere (MARGIN guarantees the loft; verify your
modules don't dip inside). Exterior 10–30% bigger reads fine; interior poking through
the hull is a hard fail.

## Deliverable 3 — `holoMaterial.ts`

```ts
export function addBarycentric(g: THREE.BufferGeometry): void;   // non-indexed required
export function createHoloMaterial(color?: THREE.ColorRepresentation): THREE.ShaderMaterial;
```

Implement research §6 exactly: barycentric edge-glow (fwidth-based wire), fresnel,
**local-space** scanlines (`vLocalPos` × `uLineDensity` uniform — world-space lines at
1/45 scale are invisible fuzz), slow sweep band, 24Hz flicker with rare dropouts,
back-face dimming. Material flags: `transparent: true`, `blending: AdditiveBlending`,
`depthWrite: false`, `side: DoubleSide`. Uniforms: `uTime` (caller-driven), `uColor`
(default ≈ (0.35, 0.85, 1.0)), `uLineDensity`. Raw `ShaderMaterial` (no tone-map chunks)
is correct here — do not add color-space conversions.

## Deliverable 4 — standalone preview (how your work gets verified)

`hull-preview.html` (minimal: dark background, `<script type="module" src="/src/fx/hull/preview.ts">`)
plus `preview.ts`: its own renderer/scene/camera (do NOT import anything from the app),
showing side by side:

1. Full-scale hull in flat-shaded clay (`MeshStandardMaterial`, 2–3 preview-only lights)
   slowly orbiting — silhouette readability check.
2. The SAME geometry at `scale 1/45` with the holo material, `uTime` ticking — the
   holotable look.
3. A wireframe box of the interior footprint (from `anchors.slices`) INSIDE the clay
   hull, proving containment.
4. On-screen text (plain DOM div): seed, tri count, and hull overall dimensions.

Keys: `1` clay / `2` holo / `3` both; `R` reseeds (seed printed). Keep it simple — this
page is a verification harness, not a product.

## Acceptance checklist (self-verify before finishing)

- [ ] `npm run typecheck` passes clean.
- [ ] `git status --short` shows ONLY the five owned files (+ optional REPORT md).
- [ ] Preview at `http://localhost:5173/hull-preview.html` (via `npm run dev`): hull
      reads as a chunky industrial freighter, not a blob or a porcupine.
- [ ] Interior wireframe fully contained; canopy at cockpit, engines at stern, cargo
      door adjacent to the real cargo bay.
- [ ] Tri count ≤50k printed on screen; every file ≤300 lines; no `any`; deterministic.
- [ ] Write `docs/antigravity-hull-REPORT.md`: files + line counts, tri count, hull
      dimensions, which silhouette rules you satisfied and how, any deviations + why,
      and 2–3 screenshots if your harness can capture them (save to `shots/hull/`).

The orchestrator will verify with: typecheck, git-diff ownership audit, and a headed
read of the preview page. Geometry that fails the silhouette rules or containment gets
sent back, so check them honestly.
