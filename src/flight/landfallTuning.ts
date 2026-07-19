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
