/**
 * Shared types and constants for panel texture generation.
 * Consumed by texturesPanels.ts and texturesPanelsNormal.ts.
 */

// ── Tile constants ─────────────────────────────────────────────────────────────

export const TW = 1024;  // canvas px — width  (represents 2 m)
export const TH = 1536;  // canvas px — height (represents 3 m)

// Metres per pixel
export const MPX = 2 / TW;
export const MPY = 3 / TH;

// Scuff band: bottom 0.35 m of the tile
export const SCUFF_PX    = Math.round(0.35 / MPY);

// Seam geometry — Stage D: core widened 3px→6px for viewable-distance read
export const SEAM_PX      = 10;  // total seam width (bevel + core + bevel)
export const SEAM_CORE_PX = 6;   // dark core pixels (was 3)

// Bolt inset and radius — Stage D: bolts ~5px→~9px
export const BOLT_INSET = 20;
export const BOLT_R     = 9;

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
