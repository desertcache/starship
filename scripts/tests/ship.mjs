/**
 * scripts/tests/ship.mjs — v1.2.1 ship-interior real-path suite
 * (Lane A owns this file). Runs after Test 15 on the shared page.
 *
 * Contract for every suite: start and END on the 'ship' world, interior
 * view, standing (not seated), flight reset, all doors OPEN — the next suite
 * inherits whatever state this one leaves behind.
 */
import { aimProbe, aimAndPressE, aimSweep, waitFrames } from './helpers.mjs';

export async function runShipSuite(_ctx) {
  // Lane A adds its tests here.
}
