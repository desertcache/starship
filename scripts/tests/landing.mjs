/**
 * scripts/tests/landing.mjs — v1.2.1 landing real-path suite
 * (Lane B owns this file). Runs after the ship suite on the shared page.
 *
 * Contract for every suite: start and END on the 'ship' world, interior
 * view, standing (not seated), flight reset, all doors OPEN — the next suite
 * inherits whatever state this one leaves behind.
 *
 * This is the real path Test 15 (scripts/verify.mjs) deliberately skips:
 * Test 15 lands via __test.engageLanding() WITHOUT ever taking the helm, so
 * `seated` is never true there and the v1.2.1 B1 bug (seated-after-landing)
 * never showed. Every step below drives the same real input a player uses:
 * the real E key onto a NAMED seat mesh, real HOLD/L-key/W-S-V keys, and a
 * real aim onto the hatch to re-board — never __test.interact()'s distance
 * fallback and never engageLanding()'s no-helm shortcut.
 */
import { resolve } from 'node:path';
import { aimAndPressE, aimProbe, waitFrames } from './helpers.mjs';

// helm.ts's HELM_INTERACT_POS (seat-port) — world (-0.90, 1.0, -22.2), radius
// 1.8. Standing ~1.2m aft of it at eye height, looking down/forward at it,
// is comfortably inside both the interactable radius and MAX_INTERACT_DIST.
const SEAT_PORT_FROM = [-0.90, 1.70, -21.0];
const SEAT_PORT_AT = [-0.90, 1.00, -22.2];

const CHUNK_SIZE = 64; // flight/landfallTuning.ts — mirrored here (a .mjs
// script can't import the .ts constant); used only to pick chunk-CENTER
// world positions for the B4 ring-1 LOD sweep below.

// v1.2.1 (matches the orchestrator's verify.mjs hotfix, applied identically
// here): page.waitForFunction(), not a fixed wall-clock sleep, for every
// fadeTransition-driven wait below. Under concurrent-lane CPU contention
// (multiple simultaneous SwiftShader headless verifies), tickController()'s
// dt is capped at 50ms/tick (controller.ts), so a browser
// setTimeout(...,350ms) plus enough ticked frames can legitimately take
// several REAL seconds when the tab is only scheduled at 1-2fps — a fixed
// sleep is exactly the wait that flaked here (verify.mjs's own Test 13a
// seat-anchor poll and Test 15, both hit under a 3-lane-concurrent run,
// 2026-09-27). Generous ceiling (30s, matching verify.mjs's), not a tight
// one. NOTE argument order: waitForFunction(fn, arg, options) — passing
// options as the 2nd positional argument silently drops it.

export async function runLandingSuite(ctx) {
  const { page, assert, waitFrame, SHOTS_DIR } = ctx;

  console.log('[verify] Lane B suite: real-path landing (B1-B4, B6)');

  // ── B6.1 — take the helm with the REAL E key ──────────────────────────────
  await aimAndPressE(page, assert, SEAT_PORT_FROM, SEAT_PORT_AT, 'seat-port', 'B6.1 helm entry');
  const postEnter = await page.evaluate(() => ({ seated: window.__test.isSeated(), flight: window.__test.getFlight() }));
  assert(postEnter.seated === true, 'B6.1: player should be seated after the real E press on seat-port');
  assert(postEnter.flight.helmActive === true, 'B6.1: helmActive should be true after taking the helm');
  assert(postEnter.flight.mode === 'HELM', `B6.1: flight mode should be HELM; got ${postEnter.flight.mode}`);
  console.log('  B6.1: real E on seat-port -> seated + helmActive ✓');

  // ── B6.2 — reach HOLD (engageApproach + approachTickN are fine: design says
  // so explicitly — this is a long straight flight, not the bug under test) ──
  await page.evaluate(() => window.__test.engageApproach());
  let holdInfo = null;
  for (let i = 0; i < 40; i++) {
    holdInfo = await page.evaluate(() => {
      window.__test.approachTickN(200, 50);
      return window.__test.getApproachInfo();
    });
    if (holdInfo && holdInfo.holdEngaged) break;
  }
  assert(holdInfo !== null && holdInfo.holdEngaged === true, `B6.2: HOLD should engage; got ${JSON.stringify(holdInfo)}`);
  const trueDist0 = holdInfo.trueDist;
  console.log(`  B6.2: reached HOLD (still seated at the helm) — trueDist0=${trueDist0.toFixed(1)}`);

  const stillSeatedAtHold = await page.evaluate(() => window.__test.isSeated());
  assert(stillSeatedAtHold === true, 'B6.2: player should STILL be seated at HOLD (this is the real landing-from-helm path)');

  // ── B6.3 — the LAND prompt persists across SEVERAL consecutive real frames
  // (v1.2.1 B3: it used to show for exactly one frame, then vanish) ─────────
  for (let i = 0; i < 5; i++) {
    await waitFrames(page, 1);
    const prompt = await page.evaluate(() => window.__test.getPromptText());
    assert(prompt === 'LAND  [L]', `B6.3: frame ${i}: LAND prompt should persist; got '${prompt}'`);
  }
  console.log('  B6.3: LAND [L] prompt persisted across 5 consecutive real frames ✓');

  // ── B6.4 — press the REAL L key, then fast-forward the descent ───────────
  await page.keyboard.press('KeyL');
  await page.keyboard.press('KeyL'); // immediate duplicate while the first fade is pending
  const duplicateAccepted = await page.evaluate(() => window.__test.engageLanding());
  assert(duplicateAccepted === false, 'B6.4: a duplicate LAND request during the first fade should be rejected');
  console.log('  B6.4: two real L taps sent; direct repeat was rejected ✓');
  await waitFrames(page, 2);
  await page.waitForFunction(() => window.__test.getActiveWorld() === 'landfall', null, { timeout: 30000 });
  await waitFrame();

  const worldAfterL = await page.evaluate(() => window.__test.getActiveWorld());
  assert(worldAfterL === 'landfall', `B6.4: real L press should switch to 'landfall'; got '${worldAfterL}'`);

  let landInfo = await page.evaluate(() => window.__test.getLandingInfo());
  let descentChunks = 0;
  while (landInfo && landInfo.phase !== 'WALK' && descentChunks < 20) {
    landInfo = await page.evaluate(() => {
      window.__test.landingTickN(120, 16.6); // ~2 sim-s/chunk, same recipe as Test 15
      return window.__test.getLandingInfo();
    });
    descentChunks++;
  }
  assert(landInfo && landInfo.phase === 'WALK', `B6.4: descent should reach WALK; stuck at ${landInfo && landInfo.phase} after ${descentChunks} chunks`);
  // beginWalkHandoff()'s own fadeTransition teleports to the spawn pose —
  // state wait, not a fixed sleep (matches verify.mjs Test 15's identical
  // check): the handoff moves the eye off the pad centre (touchdown pose is
  // x=z=0; the walk spawn is ~27m out).
  await page.waitForFunction(() => { const p = window.__test.getPlayerPos(); return Math.hypot(p.x, p.z) > 5; }, null, { timeout: 30000 });
  await waitFrame();
  console.log(`  B6.4: real L press landed via the helm — reached WALK after ${descentChunks} chunks ✓`);

  // ── B6.5 — at WALK: not seated, helm inactive, mode LANDED ────────────────
  const atWalk = await page.evaluate(() => ({ seated: window.__test.isSeated(), flight: window.__test.getFlight() }));
  assert(atWalk.seated === false, 'B6.5 (B1): player should NOT be seated at WALK — standUpInPlace() should have cleared it');
  assert(atWalk.flight.helmActive === false, `B6.5 (B1): helm should be torn down at WALK; helmActive=${atWalk.flight.helmActive}`);
  assert(atWalk.flight.mode === 'LANDED', `B6.5: flight mode should be LANDED; got ${atWalk.flight.mode}`);
  console.log('  B6.5 (B1 fix proven): not seated, helm inactive, mode LANDED ✓');

  // W/S/V/L must change NO flight state post-landing (helm listeners torn
  // down — the pre-fix bug let L re-arm the descent and V flip the view even
  // off-ship, since HOLD reads frozen true once tickApproach stops ticking).
  const before = { flight: await page.evaluate(() => window.__test.getFlight()), landing: await page.evaluate(() => window.__test.getLandingInfo()) };
  for (const key of ['KeyW', 'KeyS', 'KeyV', 'KeyL']) {
    await page.keyboard.press(key);
    await waitFrames(page, 2);
  }
  const after = { flight: await page.evaluate(() => window.__test.getFlight()), landing: await page.evaluate(() => window.__test.getLandingInfo()) };
  assert(before.flight.mode === after.flight.mode, `B6.5: W/S/V/L should not change flight mode; before=${before.flight.mode} after=${after.flight.mode}`);
  assert(before.flight.view === after.flight.view, `B6.5: W/S/V/L should not change view (V should be a no-op off-ship); before=${before.flight.view} after=${after.flight.view}`);
  assert(before.landing.phase === after.landing.phase, `B6.5 (B1): L should NOT restart the descent; phase before=${before.landing.phase} after=${after.landing.phase}`);
  console.log('  B6.5: real W/S/V/L presses changed no flight state (helm truly detached) ✓');

  // ── B6.6 — a real W keypress should move the camera; needs pointer lock ──
  await page.click('canvas');
  await waitFrames(page, 2);
  const locked = await page.evaluate(() => document.pointerLockElement !== null);
  if (locked) {
    const posBefore = await page.evaluate(() => window.__test.getPlayerPos());
    await page.keyboard.down('KeyW');
    await waitFrames(page, 10);
    await page.keyboard.up('KeyW');
    const posAfter = await page.evaluate(() => window.__test.getPlayerPos());
    const moved = Math.hypot(posAfter.x - posBefore.x, posAfter.z - posBefore.z);
    assert(moved > 0.05, `B6.6: a real W keypress should move the camera under real pointer lock; moved ${moved.toFixed(3)}m`);
    console.log(`  B6.6: REAL pointer lock acquired — real W keypress moved the camera ${moved.toFixed(3)}m ✓`);
  } else {
    await page.keyboard.down('KeyW');
    await waitFrames(page, 3);
    const gate = await page.evaluate(() => window.__test.getLastTickGate());
    await page.keyboard.up('KeyW');
    assert(gate !== 'seated', `B6.6 (B1): tickController should not be gated on 'seated' post-landing; got '${gate}'`);
    console.log(`  B6.6: harness could NOT hold a real pointer lock (Playwright's synthetic click) — narrowly-scoped hook confirms tickController's gate is '${gate}', NOT 'seated' (the B1 bug is gone; 'not-locked' is a harness ceiling, not a game bug)`);
  }
  await page.evaluate(() => { if (document.pointerLockElement) document.exitPointerLock(); });
  await waitFrames(page, 1);

  // ── B4 — terrain LOD never refines: walk ~300m from spawn in sub-chunk
  // steps (each << the streamer's own >2-chunk "jumped" snapStream
  // threshold), letting the INCREMENTAL per-frame budget path actually
  // exercise hysteresisLod() the way a real walking player does — a single
  // big teleport would trigger a one-shot snapStream that rebuilds
  // everything at the correct LOD and never exposes the bug. ─────────────
  const spawnPos = await page.evaluate(() => window.__test.getPlayerPos());
  const STEPS = 16;
  const STEP_DIST = 20; // * 16 = 320m > the brief's ~300m target
  for (let i = 1; i <= STEPS; i++) {
    const x = spawnPos.x + STEP_DIST * i;
    const z = spawnPos.z;
    const gY = await page.evaluate((p) => window.__test.getGroundHeightAt(p.x, p.z), { x, z });
    await page.evaluate(
      ([px, py, pz, tx, ty, tz]) => window.__test.aimFrom(px, py, pz, tx, ty, tz),
      [x, gY + 1.7, z, x + 1, gY + 1.7, z],
    );
    await page.evaluate((n) => window.__test.landingTickN(n, 16.6), 20); // let the budget path catch up each step
  }
  const finalPos = await page.evaluate(() => window.__test.getPlayerPos());
  const pcx = Math.floor(finalPos.x / CHUNK_SIZE);
  const pcz = Math.floor(finalPos.z / CHUNK_SIZE);
  for (let dz = -1; dz <= 1; dz++) {
    for (let dx = -1; dx <= 1; dx++) {
      const wx = (pcx + dx + 0.5) * CHUNK_SIZE;
      const wz = (pcz + dz + 0.5) * CHUNK_SIZE;
      const lod = await page.evaluate((p) => window.__test.getLandfallChunkLodAt(p.x, p.z), { x: wx, z: wz });
      assert(lod === 0, `B4: chunk (${pcx + dx},${pcz + dz}) within ring 1 of the player should be LOD0; got ${lod}`);
    }
  }
  const analyticY = await page.evaluate((p) => window.__test.getGroundHeightAt(p.x, p.z), finalPos);
  const renderedY = await page.evaluate((p) => window.__test.getRenderedGroundHeightAt(p.x, p.z), finalPos);
  assert(renderedY !== null, 'B4: expected a rendered chunk mesh directly under the player after walking 300m+');
  // Tolerance: LOD0's grid is CHUNK_SIZE/LOD0_SEGS = 64/32 = 2m; a raycast
  // hit interpolates linearly across that 2m triangle while the analytic
  // closure (mesa terracing, pow-2.4 risers) can curve within the same cell.
  // 1.0m is comfortably inside one cell's plausible interpolation error, and
  // is FAR tighter than the multi-meter drift the pre-fix bug produced
  // (an admitted-far LOD2 chunk under the player has an 8m grid, 4x coarser).
  const TOLERANCE_M = 1.0;
  assert(
    Math.abs(renderedY - analyticY) < TOLERANCE_M,
    `B4: rendered surface should track the analytic height within ${TOLERANCE_M}m; analytic=${analyticY.toFixed(2)} rendered=${renderedY.toFixed(2)}`,
  );
  console.log(`  B4: after a 320m sub-chunk walk, all 9 ring-1 chunks are LOD0; rendered=${renderedY.toFixed(2)} vs analytic=${analyticY.toFixed(2)} (diff ${Math.abs(renderedY - analyticY).toFixed(3)}m) ✓`);

  // ── B2 + B6.7 — aim at the real hatch from several approach angles, then
  // re-board with the real E key ────────────────────────────────────────────
  const hatch = await page.evaluate(() => window.__test.getActiveInteractables().find((ia) => ia.id === 'landfall-ship-hatch'));
  assert(hatch, "B2/B6.7: 'landfall-ship-hatch' interactable not found at WALK");

  // v1.2.1 B2 — geometry, not guessed offsets: the hull is a long, narrow
  // shape (~50 units by ~8), so "the interactable's registered position,
  // normalized" (an early attempt at an approach direction) is dominated by
  // the hatch's position ALONG the hull's length, not by the door's actual
  // face normal — it pointed roughly 60° off, and every derived aim missed
  // the hull entirely or landed out of interact range. Ground truth instead:
  // the hatch visual's own bounding-box center, and the cargo door's anchor
  // normal transformed by the HULL MESH's real rotation (its seeded
  // yaw+cant, shipSurface.ts) — getHatchApproachPose() (probe-verified: a
  // real E press from 1.5m out along this normal resolves
  // 'landfall-ship-hatch' with prompt "[E]  Board ship").
  const pose = await page.evaluate(() => window.__test.getHatchApproachPose());
  assert(pose, 'B2/B6.7: getHatchApproachPose() returned null — hatch geometry not found in the active scene');
  const groundYAtHatch = await page.evaluate((p) => window.__test.getGroundHeightAt(p.x, p.z), pose.center);
  const eyeY = groundYAtHatch + 1.7;

  const STANDOFF = 1.5; // well inside MAX_INTERACT_DIST (2.5m, player/interact.ts)
  const alongX = -pose.normal.z, alongZ = pose.normal.x; // perpendicular to the TRUE normal, in the XZ plane
  // Look at the frame's OWN center height (pose.center.y), not eyeY: eyeY
  // (~ground+1.7) sits ~0.9m below the frame's actual vertical midpoint
  // (HATCH_INTERACT_Y + HATCH_VISUAL_HEIGHT/2, shipSurface.ts) — close-range
  // interaction still succeeds either way (the frame's own height absorbs a
  // few tenths of a degree of tilt), but a screenshot pulled back further
  // magnifies that same angular error until the ship falls out of frame
  // entirely (found reviewing the B7 hatch shot: sky and ground, no ship).
  const hatchLookAt = [pose.center.x, pose.center.y, pose.center.z];
  function hatchApproachFrom(lateralOffset) {
    return [
      pose.center.x + pose.normal.x * STANDOFF + alongX * lateralOffset,
      eyeY,
      pose.center.z + pose.normal.z * STANDOFF + alongZ * lateralOffset,
    ];
  }

  // B7 art check: a dedicated hatch shot. None of the world's own 3
  // registered cameras frame it ('landfall' hero cam frames the BOW end;
  // the hatch is aft, at the cargo door). Orchestrator-specified framing
  // (two earlier attempts — 4m dead-on, then 11m+lateral+elevated — both
  // read as an unreadable close-up plane): stand 5.5m out along the hull's
  // outward world normal, AT EYE HEIGHT (ground+1.7, not elevated), aiming
  // dead at the hatch center, so the hatch sits in the middle third with
  // hull + ground visible around it.
  const hatchShotFrom = [
    pose.center.x + pose.normal.x * 5.5,
    eyeY,
    pose.center.z + pose.normal.z * 5.5,
  ];
  await aimProbe(page, hatchShotFrom, hatchLookAt);
  if (SHOTS_DIR) {
    const hatchShotPath = resolve(SHOTS_DIR, 'landfall-hatch.png');
    await page.screenshot({ path: hatchShotPath });
    console.log(`  B2/B7: hatch shot saved: ${hatchShotPath}`);
  }

  // "aimSweep from the approach side": a full 360° ring (aimSweep's own
  // shape) is the wrong tool for a thin, one-sided, wall-mounted door — most
  // of a ring points through/behind the hull. A real player approaches from
  // a range of angles ON THE ACCESSIBLE SIDE instead: sweep a lateral fan at
  // a fixed, in-range standoff, always facing the frame's own center.
  const lateralOffsets = [-1.0, -0.5, 0, 0.5, 1.0];
  let approachHits = 0;
  const approachMisses = [];
  for (const offset of lateralOffsets) {
    const probe = await aimProbe(page, hatchApproachFrom(offset), hatchLookAt);
    if (probe.id === 'landfall-ship-hatch') approachHits++;
    else approachMisses.push({ lateralOffset: offset, got: probe.id, prompt: probe.prompt });
  }
  console.log(`  B2 approach-side sweep: ${approachHits}/${lateralOffsets.length} lateral angles hit the hatch (misses=${JSON.stringify(approachMisses)})`);
  assert(approachHits >= 3, `B2: expected most nearby approach angles to resolve the hatch; got ${approachHits}/${lateralOffsets.length}`);

  const hatchFrom = hatchApproachFrom(0);
  await aimAndPressE(page, assert, hatchFrom, hatchLookAt, 'landfall-ship-hatch', 'B6.7 hatch reboard');
  await page.waitForFunction(() => window.__test.getActiveWorld() === 'ship', null, { timeout: 30000 }); // v1.2.1: state wait past takeOff()'s fade
  await waitFrame(); // one ship frame so tickApproach can re-assert HOLD

  const worldAfterReboard = await page.evaluate(() => window.__test.getActiveWorld());
  assert(worldAfterReboard === 'ship', `B6.7: should be back on 'ship' after re-board; got '${worldAfterReboard}'`);
  await page.evaluate(() => window.__test.approachTickN(5, 16));
  const approachAfter = await page.evaluate(() => window.__test.getApproachInfo());
  const modeAfter = (await page.evaluate(() => window.__test.getFlight())).mode;
  assert(modeAfter === 'HOLD', `B6.7: flight mode should be HOLD after re-board; got '${modeAfter}'`);
  assert(approachAfter.holdEngaged === true, 'B6.7: approach should still be in HOLD after re-board');
  assert(
    Math.abs(approachAfter.trueDist - trueDist0) < 1,
    `B6.7: trueDist should be preserved by the roundtrip; before=${trueDist0} after=${approachAfter.trueDist}`,
  );
  console.log(`  B6.7 (real hatch, real E): re-boarded — mode=HOLD trueDist=${approachAfter.trueDist.toFixed(1)} (was ${trueDist0.toFixed(1)}) ✓`);

  // ── mid-descent reset must not strand free-look (Lane A debugging finding,
  // fx/landfall/descent.ts's resetDescent()) — armDescent() disables
  // pointer-look and only beginWalkHandoff() (full completion) re-enables
  // it; resetFlight() while still ENTRY/BRAKE/TOUCHDOWN (exactly what Test
  // 15's own repeatability check does) used to skip that re-enable, leaving
  // PointerLockControls.isLocked permanently stale so tickController ignored
  // WASD for the rest of the run. ──────────────────────────────────────────
  const landAgainMid = await page.evaluate(() => window.__test.engageLanding());
  assert(landAgainMid === true, 'mid-descent reset check: engageLanding() should accept (still at HOLD)');
  await page.waitForFunction(() => window.__test.getActiveWorld() === 'landfall', null, { timeout: 30000 });
  await waitFrame();
  const midDescentInfo = await page.evaluate(() => window.__test.getLandingInfo());
  assert(
    midDescentInfo && midDescentInfo.phase !== 'WALK' && midDescentInfo.phase !== 'NONE',
    `mid-descent reset check: expected an ACTIVE descent phase before resetting; got ${midDescentInfo && midDescentInfo.phase}`,
  );
  await page.evaluate(() => window.__test.resetFlight());
  await page.evaluate(() => window.__test.switchWorld('ship'));
  await waitFrame();
  assert(
    (await page.evaluate(() => window.__test.getLandingInfo())) === null,
    'mid-descent reset check: getLandingInfo() should be null after resetFlight()',
  );

  await page.click('canvas');
  await waitFrames(page, 2);
  const lockedMid = await page.evaluate(() => document.pointerLockElement !== null);
  if (lockedMid) {
    const posBeforeMid = await page.evaluate(() => window.__test.getPlayerPos());
    await page.keyboard.down('KeyW');
    await waitFrames(page, 10);
    await page.keyboard.up('KeyW');
    const posAfterMid = await page.evaluate(() => window.__test.getPlayerPos());
    const movedMid = Math.hypot(posAfterMid.x - posBeforeMid.x, posAfterMid.z - posBeforeMid.z);
    assert(movedMid > 0.05, `mid-descent reset check: a real W keypress should move the camera; moved ${movedMid.toFixed(3)}m`);
    console.log(`  mid-descent resetDescent() free-look check: real pointer lock held, W moved the camera ${movedMid.toFixed(3)}m ✓`);
  } else {
    await page.keyboard.down('KeyW');
    await waitFrames(page, 3);
    const gateMid = await page.evaluate(() => window.__test.getLastTickGate());
    await page.keyboard.up('KeyW');
    assert(gateMid !== 'seated', `mid-descent reset check: tickController should not be gated on 'seated'; got '${gateMid}'`);
    console.log(`  mid-descent resetDescent() free-look check: harness could not hold a real lock (gate='${gateMid}') — not gated on 'seated' at least`);
  }
  await page.evaluate(() => { if (document.pointerLockElement) document.exitPointerLock(); });
  await waitFrames(page, 1);

  // ── B6.8 — end on the ship-world contract state ───────────────────────────
  await page.evaluate(() => window.__test.setFlightView('interior'));
  await page.evaluate(() => window.__test.resetFlight());
  await page.evaluate(() => window.__test.switchWorld('ship'));
  await waitFrame();
  const endState = await page.evaluate(() => ({
    world: window.__test.getActiveWorld(),
    seated: window.__test.isSeated(),
    flight: window.__test.getFlight(),
  }));
  assert(endState.world === 'ship', `B6.8: suite must end on 'ship'; got '${endState.world}'`);
  assert(endState.seated === false, 'B6.8: suite must end standing (not seated)');
  assert(endState.flight.view === 'interior', `B6.8: suite must end in interior view; got '${endState.flight.view}'`);
  console.log('[verify] Lane B suite PASSED ✓ (B1 seated-after-landing, B2 hatch, B3 LAND prompt, B4 LOD refine, B6 real-path landing)\n');
}
