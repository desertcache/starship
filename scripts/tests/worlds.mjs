/**
 * scripts/tests/worlds.mjs — v1.2.1 pocket-world + space real-path suite
 * (Lane C owns this file). Runs after the landing suite on the shared page.
 *
 * Contract for every suite: start and END on the 'ship' world, interior
 * view, standing (not seated), flight reset, all doors OPEN — the next suite
 * inherits whatever state this one leaves behind.
 */
import { aimProbe, aimAndPressE, aimSweep, waitFrames } from './helpers.mjs';

export async function runWorldsSuite(_ctx) {
  // Lane C adds its tests here.
}
