/**
 * scripts/tests/landing.mjs — v1.2.1 landing real-path suite
 * (Lane B owns this file). Runs after the ship suite on the shared page.
 *
 * Contract for every suite: start and END on the 'ship' world, interior
 * view, standing (not seated), flight reset, all doors OPEN — the next suite
 * inherits whatever state this one leaves behind.
 */
import { aimProbe, aimAndPressE, aimSweep, waitFrames } from './helpers.mjs';

export async function runLandingSuite(_ctx) {
  // Lane B adds its tests here.
}
