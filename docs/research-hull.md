# Procedural exterior hull generation — research notes

External AI research run, 2026-07-02. MANDATORY read for the holotable hull work (Stage D of THRESHOLD) and the v1.1 full-scale hull. Core verdict: face-extrusion grammars are wrong for a SPECIFIC ship (they're for "generate 1000 random ships"); pure lofting can't make discrete functional masses. **The production hybrid: loft the primary envelope from the interior's cross-sections → attach parametric modules at anchors → greeble.**

## 1. Generation strategy

```ts
type Station = { x: number; halfW: number; halfH: number; yC: number; chamfer: number };

const MARGIN = 0.6;                      // hull standoff from interior walls, m
const CHAMFER_RATIO = 0.35;              // ONE ratio everywhere = design language

function stationAt(x: number): Station {
  const s = interiorAABBSlice(x);        // from the existing interior layout
  const halfH = s.halfH + MARGIN;
  return { x, halfW: s.halfW + MARGIN + styleBulge(x), halfH,
           yC: s.yCenter, chamfer: CHAMFER_RATIO * halfH };
}

// Stations keyed to REAL bulkheads: nose, cockpit, corridor start, crew aft,
// cargo step-up, cargo aft, stern plate. 7-9 stations, then subdivide
// lengthwise every ~1.5m for panel-line resolution.

function profile(st: Station): Vector2[] {   // chamfered octagon — chunky, planar
  const { halfW: w, halfH: h, chamfer: c } = st;
  return [
    [-w, -h+c], [-w+c, -h], [w-c, -h], [w, -h+c],
    [w, h-c], [w-c, h], [-w+c, h], [-w, h-c],
  ].map(([px, py]) => new Vector2(px, py + st.yC));
}

// loft(): ring-to-ring quads, NON-INDEXED (flat facets via computeVertexNormals).
// UV: u = perimeter fraction, v = x / totalLength → panel grid aligns to the
// loft grid. This UV layout is LOAD-BEARING for greebles + plating.

const parts = [
  loft(stations),
  engineBlock(rng).applyMatrix4(frameAt(anchors.stern)),
  cargoDoorAssembly(rng).applyMatrix4(frameAt(anchors.cargoAft)),
  canopyFrame(anchors.cockpit),
  ...anchors.portholes.map(a => windowSocket().applyMatrix4(frameAt(a))),
  ...greebleScatter(hullFaces, rng, zoneMask),
];
const shipGeo = mergeGeometries(parts.map(g => g.toNonIndexed()));
```

**`interiorAnchors` (porthole centers+normals, canopy frame, airlock, engine axis, interior AABB slices) is the SINGLE SOURCE OF TRUTH — exported from the interior layout code, consumed here.** Seed everything through one mulberry32 even though the ship is specific (reproducible greeble/weathering placement).

## 2. Silhouette rules (encodable, not vibes)

1. **Thrust through centroid** — engine cluster centroid within ~10% hull height of volumetric centroid, or balance with nacelles. Offset thrust reads broken instantly.
2. **Mass hierarchy 70/25/5** (primary/secondary/tertiary visual area). 1-2 primary forms; 3-7 secondaries each 15-40% of primary dimension; sibling secondaries differ ≥1.3× in scale.
3. **Side-profile concave notches: 4-8.** Our layout gives them free: nose taper → cockpit step → flat spine → cargo step-up → engine cut.
4. **ONE chamfer angle everywhere** (hull, modules, greebles) + one accent-stripe color + one stencil-decal set → "same designer built this."
5. **Asymmetry budget: tertiary only, ≤15%** (one crane, one antenna cluster, one docking collar). Primary/secondary masses symmetric — Nostromo and Serenity are symmetric bodies with asymmetric accessories.
6. Repeat with variation: modules ×3-5 (odd counts), ±10-20% scale jitter, snapped rotations.
7. Panel seams run FORE-AFT; verticals only at bulkhead stations (the UV layout enforces this).
8. **Nothing floats** — every module gets a visible mount (strut/weld collar/recessed socket). Floating geometry is the #1 procedural tell.
9. Functional adjacency: tanks touch engines, radiators near engineering, sensors dorsal-forward, RCS quads at the four extremal corners.

## 3. Greebling

**Tier 1 geometry**: kit of **8-12 distinct pieces** (vent box, pipe, elbow, conduit, hatch, tank, antenna stub, rib, grille, junction box), 12-60 tris each. Ship is static → **bake transforms and MERGE, don't InstancedMesh** (instancing buys nothing for static transforms). Placement: `zoneWeight (engineering 1.0 / spine 0.5 / cockpit 0.2 / cargo doors 0.1) × seamProximity × orientBias`; positions biased to panel seams and around hatches/modules; **yaw snapped to 90°, never free rotation**; scale 0.8-1.2. Coverage ≈5% of surface — over-greebling destroys the big-shape read.

**Tier 2 normal-map greebles**: grayscale height canvas (grooves, rivets, recessed vents) → Sobel → normal map (OpenGL convention, +Y up). WebGL2 + UVs → three computes tangents via derivatives, no tangent attribute.

**Tier 3**: AO darkening + roughness raise inside grooves — reads at every distance.

**Visibility math**: groove width g dies below 1px at `d ≈ g·screenH/(2·tan(fov/2))` — at 60°/1080p a 3cm groove dies at ~28m (chase-cam range). **Cut panel lines chunky: 5-10cm.** Geometry greebles carry the hologram + near chase; normal map carries mid; tier 3 far.

**Budget**: loft ~500 tris + modules ~8k + greebles ~16k + windows ~1k ≈ **25k tris (headroom to 50k)**. Draw calls: merged opaque ship w/ one 2048² atlas = 1, canopy glass 1, engine glow 1, interior-mapped windows 1, holo 1 → **5**.

## 4. Hull plating material

**UV seams, not triplanar** (loft gives clean cylindrical UVs; panel lines following the grid read as BUILT; triplanar reads projected). Plate boundaries at real bulkhead x → free interior/exterior coherence.

Canvas layers: (1) recursive plate-grid split w/ jitter, per-plate `hsl(hue±2°, 8%, 0.32±0.04)`; (2) seams `#141414` (never pure black — ACES clips), 2px @1024 ≈ chunky groove, bolt dots at corners; (3) streaks from plate top edges AND under every greeble anchor (reuse the §3 anchor list — weathering agrees with geometry), `len = -log(rng())·40px`; (4) scorch radials on aft region + RCS cones, mirrored into roughness (soot is matte); (5) edge chips hugging seams, mirrored as bright metalness + low roughness; (6) decals — hazard stripes at cargo doors, registration text. Painted decals are the strongest "designed" signal.

**Pack ORM**: R=AO, G=roughness, B=metalness in ONE canvas, assign same CanvasTexture to aoMap/roughnessMap/metalnessMap (glTF channel convention; r160 defaults all maps to UV0).

| Region | Albedo lum | Roughness | Metalness |
|---|---|---|---|
| Painted plate | 0.30-0.45 | 0.60-0.75 | 0.15-0.30 |
| Chipped edge / bare metal | 0.45-0.55 | 0.35-0.50 | 0.90-1.0 |
| Soot / scorch | 0.05-0.12 | 0.85-0.95 | 0.0 |

Paint over metal is dielectric-dominant (plates ~0.2 metalness, NOT 1.0; high metal + high rough + weak envmap = black mush). envMapIntensity 0.6-1.0 (RoomEnvironment PMREM = zero-asset-legal). Emissives need intensity 2-4 to punch through ACES.

## 5. Interior-exterior consistency

**Must match**: canopy position/orientation (the ship's face); doors the player walks through; portholes within ~10-20cm on the correct wall side. **Nobody notices**: window size ±30%, wall thickness, ceiling-vs-deck lines. Exterior ≥ interior everywhere is mandatory (the MARGIN guarantees it); exterior 10-30% bigger is invisible.

**Don't CSG portholes**: `windowSocket()` = frame ring 5cm proud + glass plane recessed 10cm + dark box behind. Hull stays unbroken; the recess sells the cut.

**Emissive windows** (workhorse): windows in the emissive map, seeded ~60% lit (warm `#ffd9a0` / cool `#bfe3ff` / near-black `#050608`); repaint one window rect + `needsUpdate` at 0.2Hz for life. Zero extra draws.

**Interior mapping**: worth it ONLY for canopy + 2-3 large midship windows; tiny portholes at chase distance → emissive wins. ~20 lines via onBeforeCompile (unit-box ray exit in tangent space, per-room hash for lit/dark) — full GLSL sketch preserved in the research response; window planes have known frames at build time so pass the basis as attributes.

## 6. Hologram — same geometry, different material (that IS the sync story)

```ts
const build = buildShip(seed, interiorAnchors);          // geometry + ORM + anchors
const full  = new Mesh(build.geometry, pbrMaterial);
const holo  = new Mesh(build.geometry, holoMaterial);    // SAME BufferGeometry
holo.scale.setScalar(1 / 45);                            // 45m → ~1m
```

Non-indexed geometry (already required for flat facets) → add barycentric attribute for true edge-glow without a wireframe pass:

```ts
function addBarycentric(g: BufferGeometry) {             // non-indexed required
  const n = g.attributes.position.count, b = new Float32Array(n * 3);
  for (let i = 0; i < n; i += 3) { b[i*3]=1; b[(i+1)*3+1]=1; b[(i+2)*3+2]=1; }
  g.setAttribute('aBary', new BufferAttribute(b, 3));
}
```

Material: AdditiveBlending, transparent, depthWrite:false, DoubleSide, rendered after opaque. Fragment (full version):

```glsl
float fres  = pow(1.0 - clamp(dot(normalize(vNormalV), vec3(0,0,1)), 0., 1.), 2.5);
float minB  = min(vBary.x, min(vBary.y, vBary.z));
float wire  = 1.0 - smoothstep(0.0, fwidth(minB) * 1.5, minB);
float scan  = smoothstep(0.35, 0.0, abs(fract(vLocalPos.y * uLineDensity - uTime*1.5) - 0.5));
float sweep = smoothstep(0.12, 0.0, abs(fract(vLocalPos.y * 0.25   - uTime*0.07) - 0.5));
float flick = 0.92 + 0.08 * hash(floor(uTime * 24.0));
flick *= mix(1.0, 0.35, step(0.985, hash(floor(uTime * 3.0) + 7.0))); // rare dropouts
vec3 col = uColor * (0.10 + 0.85*fres + 0.20*scan + 0.55*sweep + 0.90*wire) * flick;
if (!gl_FrontFacing) col *= 0.3;                                       // volume feel
gl_FragColor = vec4(col, 1.0);
```

Gotchas: (1) scanlines keyed to LOCAL position × per-mesh uLineDensity, not world Y (world lines at 1/45 scale = invisible fuzz); (2) for projector-space scanlines while the miniature rotates (the classic look), sample the holo's PARENT frame. uColor ≈ (0.35, 0.85, 1.0); intensity >1 + bloom = free cyan bleed.

## Build order (de-risks fastest)

Write `interiorAABBSlice()` + the anchor export from the existing layout code FIRST; loft the envelope and eyeball it at full scale against the interior. If the envelope + porthole sockets land, everything downstream is decoration on a correct skeleton.
