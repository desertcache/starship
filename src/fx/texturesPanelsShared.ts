/**
 * Shared types and constants for panel texture generation.
 * Consumed by texturesPanels.ts and texturesPanelsNormal.ts.
 *
 * v0.9 A2 (RADIANCE — resolution bump): canvas doubled 1024×1536 → 2048×3072.
 * MPX/MPY are ratios (metres / TW or TH) so they — and everything derived
 * from them (buildPanelGrid, SCUFF_PX) — auto-scale correctly. The absolute
 * pixel constants below (SEAM_PX, SEAM_CORE_PX, BOLT_INSET, BOLT_R) do NOT
 * auto-scale and are doubled explicitly here so seams/bolts keep their real
 * physical size on the denser canvas — only texel density increases.
 */

// ── Tile constants ─────────────────────────────────────────────────────────────

export const TW = 2048;  // canvas px — width  (represents 2 m)
export const TH = 3072;  // canvas px — height (represents 3 m)

// Metres per pixel
export const MPX = 2 / TW;
export const MPY = 3 / TH;

// Scuff band: bottom 0.35 m of the tile
export const SCUFF_PX    = Math.round(0.35 / MPY);

// Seam geometry — Stage D: core widened 3px→6px for viewable-distance read.
// v0.9 A2: doubled again (6px→12px core, 10px→20px total) for the 2x canvas.
export const SEAM_PX      = 20;  // total seam width (bevel + core + bevel)
export const SEAM_CORE_PX = 12;  // dark core pixels

// Bolt inset and radius — Stage D: bolts ~5px→~9px.
// v0.9 A2: doubled again (inset 20→40, radius 9→18) for the 2x canvas.
export const BOLT_INSET = 40;
export const BOLT_R     = 18;

// ── Accent colors ──────────────────────────────────────────────────────────────
// v0.9 A2: hoisted here (was duplicated locally) so both texturesPanels.ts and
// texturesPanelsDetails.ts (split apart to stay under 300 lines/file) share one
// definition.
export const ORANGE_HEX = '#C7641E';
export const GUN_HEX    = '#2A2D33';

// ── Panel rect ─────────────────────────────────────────────────────────────────

export interface PanelRect { x: number; y: number; w: number; h: number }

// ── Panel grid ─────────────────────────────────────────────────────────────────

/**
 * Build the seeded panel grid for a 2 m × 3 m tile (in pixel coords).
 * Column widths cycle ~[0.8, 1.2] m; row heights ~[1.1, 0.9, 1.0] m.
 */
export function buildPanelGrid(rand: () => number): PanelRect[] {
  const colWidthsPx  = [0.8, 1.2].map(w => Math.round(w / MPX));
  const rowHeightsPx = [1.1, 0.9, 1.0].map(h => Math.round(h / MPY));

  let colX = 0;
  const cols: number[] = [];
  for (let i = 0; colX < TW; i++) {
    const w = Math.min(colWidthsPx[i % colWidthsPx.length], TW - colX);
    cols.push(w);
    colX += w;
  }

  let rowY = 0;
  const rows: number[] = [];
  for (let i = 0; rowY < TH; i++) {
    const h = Math.min(rowHeightsPx[i % rowHeightsPx.length], TH - rowY);
    rows.push(h);
    rowY += h;
  }

  const panels: PanelRect[] = [];
  let py = 0;
  for (const h of rows) {
    let px = 0;
    for (const w of cols) {
      panels.push({ x: px, y: py, w, h });
      px += w;
    }
    py += h;
  }

  void rand;
  return panels;
}
