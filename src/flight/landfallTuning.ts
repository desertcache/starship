/**
 * src/flight/landfallTuning.ts — EVERY tunable constant for v1.2 LANDFALL
 * (same house pattern as flightTuning.ts: feel tuning happens ONLY in this
 * file, every other file imports from here rather than inlining a number).
 *
 * Stage 1 ships this module as CONTRACTS ONLY — every value below is a
 * starting point, not a measured result. Stage 2 (descent + streamed surface)
 * and Stage 3 (walk/return + feel pass) are expected to retune most of these
 * against real playtesting; nothing here is load-bearing until then.
 */

/** Stage 2/3-tunable — descent trigger/brake/touchdown altitudes (units above
 *  the landing pad). Entry starts the descent cam/FX; brake is where the
 *  approach vector flattens toward vertical; touchdown is the final settle. */
export const DESCENT_START_ALT = 720;
export const DESCENT_BRAKE_ALT = 350;
export const DESCENT_TOUCHDOWN_ALT = 60;

/** Stage 2/3-tunable — nominal duration (seconds) of each descent phase,
 *  mirroring approach.ts's APPROACH_T_ARRIVE normalized-arrival pattern. */
export const DESCENT_ENTRY_SECS = 8;
export const DESCENT_BRAKE_SECS = 6;
export const DESCENT_TOUCHDOWN_SECS = 4;

/** Stage 2/3-tunable — landing pad flatness radii (units): inner = fully
 *  flat pad surface, outer = blend zone into the surrounding terrain LOD. */
export const PAD_FLAT_INNER = 18;
export const PAD_FLAT_OUTER = 34;

/** Stage 2/3-tunable — walkable surface roam limits (units from the pad).
 *  WARN precedes the hard boundary so a UI edge-warning has room to read. */
export const ROAM_RADIUS = 1500;
export const ROAM_WARN_RADIUS = 1350;

/** Stage 2/3-tunable — streamed-chunk grid: cell size (units) and per-frame
 *  build budget (count + ms) so chunk generation never spikes a frame. */
export const CHUNK_SIZE = 64;
export const CHUNK_BUILDS_PER_FRAME = 2;
export const CHUNK_BUILD_BUDGET_MS = 3;

/** Stage 2/3-tunable — LOD ring radii, in CHUNK_SIZE units from the player's
 *  current chunk (ring0 = full detail, ring2 = coarsest resident detail). */
export const LOD_RING0 = 1;
export const LOD_RING1 = 3;
export const LOD_RING2 = 6;

/** Stage 2/3-tunable — deterministic seed for the landfall surface generator
 *  (screenshot/test determinism, same rationale as approach.ts's own 0xe57a). */
export const LANDFALL_SEED = 0x1a4d;

/** Stage 2 (chunks.ts/chunkMesh.ts) — per-LOD tessellation, quad segments per
 *  chunk side. LOD0 is full detail (near ring), LOD2 the coarsest resident
 *  tier; anything past LOD_RING2 is the static far shell, not a live chunk. */
export const LOD0_SEGS = 32;
export const LOD1_SEGS = 16;
export const LOD2_SEGS = 8;

/** Stage 2 (chunkMesh.ts) — perimeter skirt drop (meters) that hides the
 *  cross-chunk LOD tessellation crack at chunk borders. Must exceed the
 *  plausible height delta between a chunk's own border sample and a coarser
 *  neighbour's linear-interpolated edge at the same world point. */
export const CHUNK_SKIRT_DEPTH = 6;

/** Stage 4 (scatter.ts) — near-field scatter/collider streaming ring
 *  (Chebyshev chunks from the player's current chunk — deliberately smaller
 *  than the terrain's own LOD_RING2, see scatter.ts's file header) and the
 *  pad-clearing radius (meters, world-space from the origin) inside which
 *  scatter placement is skipped so the landing site stays open. */
export const SCATTER_RING = 2;
export const SCATTER_PAD_CLEAR_RADIUS = 40;

/** Stage 4 (scatter.ts) — boulders at/above this seeded scale roll into the
 *  "top size tier" that contributes a near-field AABB collider; spires
 *  always do (only 1/chunk, always tall enough to matter). Base XZ radii
 *  (meters, at scale=1) feed the collider half-extent. */
export const SCATTER_BOULDER_COLLIDE_MIN_SCALE = 1.8;
export const SCATTER_BOULDER_BASE_RADIUS = 1.0;
export const SCATTER_SPIRE_BASE_RADIUS = 1.0;

/** Stage 4 (weather.ts) — rain layer: particle count, wrap-box size (meters,
 *  rigidly re-centred on the player every frame) and fall speed (m/s, drives
 *  the accumulated-dt uFallY uniform — never wall clock). */
export const RAIN_COUNT = 2000;
export const RAIN_BOX_SIZE = 40;
export const RAIN_FALL_SPEED = 14;
/** Stage 4 (weather.ts/worldBeds.ts) — rain-patter bed gain while storm is active. */
export const RAIN_PATTER_GAIN = 0.12;

/** Stage 4 (weather.ts) — lightning scheduler: seeded gap between strikes
 *  (seconds), flash hold duration, and the sun/hemi intensity multiplier
 *  applied for the duration of a flash. */
export const LIGHTNING_MIN_GAP = 4;
export const LIGHTNING_MAX_GAP = 9;
export const LIGHTNING_FLASH_SECS = 0.12;
export const LIGHTNING_MULT = 2.5;

/** Stage 4 (weather.ts) — per-state [clear, overcast, storm] scale applied to
 *  the sky's base sun/hemi intensity and dome tint, plus the cloud-coverage
 *  bump added to biome.clouds.coverage (consumed by a future cloud subsystem
 *  — this stage doesn't build cloud meshes, see weather.ts's file header). */
export const WEATHER_SUN_SCALE: readonly [number, number, number] = [1.0, 0.7, 0.5];
export const WEATHER_HEMI_SCALE: readonly [number, number, number] = [1.0, 0.85, 0.65];
export const WEATHER_DOME_SCALE: readonly [number, number, number] = [1.0, 0.8, 0.55];
export const WEATHER_CLOUD_BUMP: readonly [number, number, number] = [0, 0.35, 0.5];
