/**
 * scripts/tests/worlds.mjs — v1.2.1 pocket-world + space real-path suite
 * (Lane C owns this file). Runs after the ship + landing suites on the
 * shared page.
 *
 * Contract for every suite: start and END on the 'ship' world, interior
 * view, standing (not seated), flight reset, all doors OPEN — the next suite
 * inherits whatever state this one leaves behind.
 */
import { aimProbe, aimAndPressE, aimSweep, waitFrames } from './helpers.mjs';

/**
 * Run the shared aimSweep report (the standard 8-bearing ring), log it, then
 * press the real E key through whichever bearing the sweep found live (reuses
 * aimAndPressE — the real keypress + prompt assertion — rather than
 * re-deriving which compass direction faces clear geometry by hand).
 * Returns { sweep, from } (`from` is the exact camera pose the keypress used).
 */
async function pressFirstHit(page, assert, at, expectId, label, opts = {}) {
  const { r = 1.6, y = 1.7, n = 8 } = opts;
  const sweep = await aimSweep(page, at, expectId, { r, y, n });
  console.log(
    `[verify]   sweep ${label}: ${sweep.hits}/${sweep.total} hits` +
    (sweep.misses.length ? ` (misses: ${JSON.stringify(sweep.misses)})` : ''),
  );
  const missBearings = new Set(sweep.misses.map((m) => m.bearingDeg));
  for (let i = 0; i < n; i++) {
    const bearingDeg = Math.round((i / n) * 360);
    if (missBearings.has(bearingDeg)) continue;
    const a = (i / n) * Math.PI * 2;
    const from = [at[0] + Math.cos(a) * r, y, at[2] + Math.sin(a) * r];
    await aimAndPressE(page, assert, from, at, expectId, label);
    return { sweep, from };
  }
  assert(false, `${label}: aimSweep found 0/${n} hits — nothing to press E on`);
  return { sweep, from: null };
}

/** Live interactable position lookup (never hardcode world-space coords —
 *  they'd drift out of sync with a world author's layout tweaks). */
async function findIA(page, id) {
  const ias = await page.evaluate(() => window.__test.getActiveInteractables());
  return ias.find((ia) => ia.id === id) ?? null;
}

async function eyeYAt(page, x, z) {
  const gy = await page.evaluate(([px, pz]) => window.__test.getGroundHeightAt(px, pz), [x, z]);
  return gy + 1.7;
}

/** Several double-rAF frame waits in a row — used instead of a fixed
 *  wall-clock sleep() so this suite's own waits scale with however slow
 *  frames are actually arriving (concurrent lanes' CPU contention can make a
 *  fixed-ms sleep pass fewer real frames than expected), never a hardcoded
 *  real-time budget. */
async function settleFrames(waitFrame, n = 5) {
  for (let i = 0; i < n; i++) await waitFrame();
}

export async function runWorldsSuite(ctx) {
  const { page, assert, waitFrame } = ctx;

  // ── Setup: ship, interior, flight reset (defensive — don't assume the
  // ship/landing suites left this; assert our OWN starting contract). ──────
  await page.evaluate(() => window.__test.switchWorld('ship'));
  await waitFrame();
  await page.evaluate(() => window.__test.setFlightView('interior'));
  await page.evaluate(() => window.__test.resetFlight());
  await waitFrame();

  // ── C2: LIGHTFALL pours upward, not down ─────────────────────────────────
  console.log('[verify] Lane C / C2: LIGHTFALL direction');
  const yMid0 = await page.evaluate(() => window.__test.lightfallYAt(0, 0));
  const yMid1 = await page.evaluate(() => window.__test.lightfallYAt(0, 0.1));
  console.log(`[verify]   y(aY0=0, t=0)=${yMid0.toFixed(3)} y(aY0=0, t=0.1)=${yMid1.toFixed(3)}`);
  assert(yMid1 > yMid0, `LIGHTFALL: y should RISE over time (design: "pours upward"); got ${yMid0} -> ${yMid1}`);
  // Cross a wrap boundary too: near the top, a small +t should wrap DOWN to
  // near the bottom (rise-to-top-then-reset), not continue past H unbounded.
  const H = 7.2;
  const yNearTop = await page.evaluate((h) => window.__test.lightfallYAt(h - 0.05, 0), H);
  const yAfterWrap = await page.evaluate((h) => window.__test.lightfallYAt(h - 0.05, 0.1), H);
  console.log(`[verify]   y(aY0=H-0.05, t=0)=${yNearTop.toFixed(3)} y(aY0=H-0.05, t=0.1)=${yAfterWrap.toFixed(3)} (should wrap near 0)`);
  assert(yAfterWrap < 0.2, `LIGHTFALL: should wrap back near 0 just past H; got ${yAfterWrap}`);
  console.log('[verify] Lane C / C2 PASSED (LIGHTFALL rises, wraps bottom-to-top)');

  // ── RIFT: name-contract fixes + relic collected-state ────────────────────
  console.log('[verify] Lane C / C1: switching to rift');
  await page.evaluate(() => window.__test.switchWorld('rift'));
  await waitFrame();
  await settleFrames(waitFrame);

  {
    const ia = await findIA(page, 'rift-underside');
    assert(ia, "rift-underside: interactable not found in the active (rift) world");
    const y = await eyeYAt(page, ia.x, ia.z);
    const { sweep } = await pressFirstHit(page, assert, [ia.x, ia.y, ia.z], 'rift-underside', 'rift-underside', { y });
    assert(sweep.hits >= 2, `rift-underside: expected the real E key to reach it from at least 2/8 bearings; got ${sweep.hits}/8`);
    const codex = await page.evaluate(() => window.__test.getCodex());
    assert(codex.scans.includes('rift-underside'), `rift-underside: scan did not register; codex=${JSON.stringify(codex.scans)}`);
  }
  console.log('[verify] Lane C / C1 rift-underside PASSED');

  {
    const ia = await findIA(page, 'rift-prism-chorus');
    assert(ia, "rift-prism-chorus: interactable not found in the active (rift) world");
    const y = await eyeYAt(page, ia.x, ia.z);
    const { sweep } = await pressFirstHit(page, assert, [ia.x, ia.y, ia.z], 'rift-prism-chorus', 'rift-prism-chorus', { y, r: 2.0 });
    assert(sweep.hits >= 2, `rift-prism-chorus: expected the real E key to reach it from at least 2/8 bearings; got ${sweep.hits}/8`);
    const codex = await page.evaluate(() => window.__test.getCodex());
    assert(codex.scans.includes('rift-prism-chorus'), `rift-prism-chorus: scan did not register; codex=${JSON.stringify(codex.scans)}`);
  }
  console.log('[verify] Lane C / C1 rift-prism-chorus PASSED');

  {
    const ia = await findIA(page, 'rift-relic');
    assert(ia, "rift-relic: interactable not found in the active (rift) world (already collected earlier this run?)");
    const y = await eyeYAt(page, ia.x, ia.z);
    const at = [ia.x, ia.y, ia.z];
    const { sweep, from } = await pressFirstHit(page, assert, at, 'rift-relic', 'rift-relic', { y });
    assert(sweep.hits >= 2, `rift-relic: expected the real E key to reach it from at least 2/8 bearings; got ${sweep.hits}/8`);
    const codex = await page.evaluate(() => window.__test.getCodex());
    assert(codex.relics.includes('rift'), `rift-relic: collecting through the real E key did not add 'rift' to getCodex().relics; got ${JSON.stringify(codex.relics)}`);
    console.log(`[verify]   codex.relics=[${codex.relics.join(', ')}] after real-E rift pickup`);

    // Collected-state must behave: no second prompt, no second pickup, from
    // the EXACT camera pose that worked a moment ago.
    const probe2 = await aimProbe(page, from, at);
    assert(probe2.id !== 'rift-relic', `rift-relic: still resolves as the interact target after collection (id=${probe2.id})`);
    assert(probe2.prompt === '', `rift-relic: prompt should be empty after collection; got '${probe2.prompt}'`);
  }
  console.log('[verify] Lane C / C1 rift-relic PASSED (collected via real E, no re-prompt/re-pickup)');

  // ── ASHFALL: fumarole name fix + relic (payoff chain) ────────────────────
  console.log('[verify] Lane C: switching to ashfall');
  await page.evaluate(() => window.__test.switchWorld('ashfall'));
  await waitFrame();
  await settleFrames(waitFrame);

  {
    const ia = await findIA(page, 'ashfall-fumarole');
    assert(ia, "ashfall-fumarole: interactable not found in the active (ashfall) world");
    const y = await eyeYAt(page, ia.x, ia.z);
    const { sweep } = await pressFirstHit(page, assert, [ia.x, ia.y, ia.z], 'ashfall-fumarole', 'ashfall-fumarole', { y });
    assert(sweep.hits >= 2, `ashfall-fumarole: expected the real E key to reach it from at least 2/8 bearings; got ${sweep.hits}/8`);
    const codex = await page.evaluate(() => window.__test.getCodex());
    assert(codex.scans.includes('ashfall-fumarole'), `ashfall-fumarole: scan did not register; codex=${JSON.stringify(codex.scans)}`);
  }
  console.log('[verify] Lane C / C1 ashfall-fumarole PASSED');

  {
    const ia = await findIA(page, 'ashfall-relic-core');
    assert(ia, "ashfall-relic-core: interactable not found (already collected earlier this run?)");
    const y = await eyeYAt(page, ia.x, ia.z);
    // The relic sits tucked in the gap between two rock lobes + a connector
    // boulder (ashfallVolcanics.ts) — a wide standoff walks the camera INTO
    // the rock on most bearings. r=0.6 calibrated empirically (a standalone
    // probe against this exact geometry): 3/8 hits vs. 0/8 at the default 1.6.
    const { sweep } = await pressFirstHit(page, assert, [ia.x, ia.y, ia.z], 'ashfall-relic-core', 'ashfall-relic-core', { y, r: 0.6 });
    assert(sweep.hits >= 2, `ashfall-relic-core: expected the real E key to reach it from at least 2/8 bearings; got ${sweep.hits}/8`);
    const codex = await page.evaluate(() => window.__test.getCodex());
    assert(codex.relics.includes('ashfall'), `ashfall-relic-core: real-E pickup did not add 'ashfall'; got ${JSON.stringify(codex.relics)}`);
  }
  console.log('[verify] Lane C / C8 ashfall relic collected via real E');

  // ── VERDANT: relic (payoff chain — this world had no NAME violations) ────
  console.log('[verify] Lane C: switching to verdant');
  await page.evaluate(() => window.__test.switchWorld('verdant'));
  await waitFrame();
  await settleFrames(waitFrame);

  // v1.2.1: the shared verify.mjs Test 10 (not this lane's) already collects
  // the VERDANT relic earlier in this same page session to exercise the
  // save/load roundtrip, so it may already be gone by the time this suite
  // runs. Collect it via the real E key ONLY if it hasn't been already —
  // either way, it's held by the time the payoff check below runs.
  const codexPreVerdant = await page.evaluate(() => window.__test.getCodex());
  if (!codexPreVerdant.relics.includes('verdant')) {
    const ia = await findIA(page, 'verdant-relic');
    assert(ia, "verdant-relic: interactable not found and 'verdant' not yet in codex — unexpected");
    const y = await eyeYAt(page, ia.x, ia.z);
    // Inside the hollow heartwood tree (verdantTrees.ts) — r=1.2 (the
    // default-ish standoff) walked the camera into the trunk shell on most
    // bearings; r=0.6 calibrated empirically against this exact geometry: 7/8.
    const { sweep } = await pressFirstHit(page, assert, [ia.x, ia.y, ia.z], 'verdant-relic', 'verdant-relic', { y, r: 0.6 });
    assert(sweep.hits >= 4, `verdant-relic: expected the real E key to reach it from at least 4/8 bearings; got ${sweep.hits}/8`);
    const codex = await page.evaluate(() => window.__test.getCodex());
    assert(codex.relics.includes('verdant'), `verdant-relic: real-E pickup did not add 'verdant'; got ${JSON.stringify(codex.relics)}`);
    console.log('[verify] Lane C / C8 verdant relic collected via real E');
  } else {
    console.log("[verify] Lane C / C8 verdant relic already held (verify.mjs's own Test 10 collected it earlier this run) — using it for the payoff chain below");
  }

  // ── Payoff: all 3 relics -> annex holotable hologram ignites ─────────────
  console.log('[verify] Lane C / C8: returning to ship, checking holotable ignition');
  await page.evaluate(() => window.__test.switchWorld('ship'));
  await waitFrame();
  // Several real rendered frames (not a wall-clock sleep) so
  // portalRoom.ts's holoDriver.onBeforeRender ticks and polls getCodex().
  await settleFrames(waitFrame, 8);

  const finalCodex = await page.evaluate(() => window.__test.getCodex());
  assert(
    ['verdant', 'ashfall', 'rift'].every((w) => finalCodex.relics.includes(w)),
    `payoff: expected all 3 relics before checking the holotable; got ${JSON.stringify(finalCodex.relics)}`,
  );
  const ignited = await page.evaluate(() => window.__test.getHolotableIgnited());
  assert(ignited === true, `payoff: holotable-projection should be ignited with all 3 relics held; got ${ignited}`);
  console.log('[verify] Lane C / C8 PASSED (verdant+ashfall+rift relics -> holotable hologram ignited)');

  // ── C3: persistent nebulae stay bounded on every axis after a long,
  // turned-heading flight (ultrareview r2 P2 — only Z ever wrapped before) ──
  console.log('[verify] Lane C / C3: nebula wrap bounds under a turned heading');
  await page.evaluate(() => window.__test.switchWorld('ship'));
  await waitFrame();

  const bounds = await page.evaluate(() => window.__test.getNebulaWrapBounds());
  const before = await page.evaluate(() => window.__test.getPersistentNebulaPositions());
  console.log(`[verify]   wrap bounds x=${JSON.stringify(bounds.x)} y=${JSON.stringify(bounds.y)} z=${JSON.stringify(bounds.z)}`);
  console.log(`[verify]   before: ${JSON.stringify(before)}`);

  // Turn substantially (yaw + a little pitch, so the flow vector picks up an
  // X and a Y component, not just Z), then fly straight on the NEW heading
  // and boost — flightTickN bypasses the world gate (Test 11's own pattern),
  // so this works regardless of which world is active.
  await page.evaluate(() => window.__test.setFlightInput({ yaw: 1, pitch: 0.3 }));
  await page.evaluate(() => window.__test.flightTickN(150, 16.6));
  await page.evaluate(() => window.__test.setFlightInput({ yaw: 0, pitch: 0, throttleDelta: 1 }));
  await page.evaluate(() => window.__test.flightTickN(120, 16.6));

  // Advance the REAL nebula.tick() a long synthetic stretch at the resulting
  // (turned, fast) flowW — same "loop the real per-frame function" pattern as
  // flightTickN itself; no real-time waiting needed.
  await page.evaluate(() => window.__test.tickPersistentNebula(6000, 100));

  const after = await page.evaluate(() => window.__test.getPersistentNebulaPositions());
  console.log(`[verify]   after 600s simulated on a turned heading: ${JSON.stringify(after)}`);
  const EPS = 1e-6;
  for (let i = 0; i < after.length; i++) {
    const p = after[i];
    assert(p.x >= bounds.x[0] - EPS && p.x < bounds.x[1] + EPS, `nebula[${i}].x out of bounds: ${p.x} not in [${bounds.x[0]},${bounds.x[1]})`);
    assert(p.y >= bounds.y[0] - EPS && p.y < bounds.y[1] + EPS, `nebula[${i}].y out of bounds: ${p.y} not in [${bounds.y[0]},${bounds.y[1]})`);
    assert(p.z >= bounds.z[0] - EPS && p.z < bounds.z[1] + EPS, `nebula[${i}].z out of bounds: ${p.z} not in [${bounds.z[0]},${bounds.z[1]})`);
  }
  console.log('[verify] Lane C / C3 PASSED (all 3 persistent nebulae stayed inside their wrap volume)');

  // ── C7: measure the hero gas-giant texture generation spike ──────────────
  const heroTexMs = await page.evaluate(() => window.__test.measureHeroTextureGenMs());
  console.log(`[verify] Lane C / C7: hero gas-giant texture (1024px, HUE_FAMILIES[1]) generation = ${heroTexMs.toFixed(2)} ms`);
  assert(Number.isFinite(heroTexMs) && heroTexMs >= 0, `C7: measured a non-finite/negative duration: ${heroTexMs}`);

  // ── End state: ship, interior, standing, flight reset ────────────────────
  await page.evaluate(() => window.__test.switchWorld('ship'));
  await waitFrame();
  await page.evaluate(() => window.__test.setFlightView('interior'));
  await page.evaluate(() => window.__test.resetFlight());
  await waitFrame();
  const endWorld = await page.evaluate(() => window.__test.getActiveWorld());
  assert(endWorld === 'ship', `Lane C suite should end on 'ship'; got ${endWorld}`);
}
