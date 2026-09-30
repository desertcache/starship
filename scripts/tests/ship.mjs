/**
 * scripts/tests/ship.mjs — v1.2.1 ship-interior real-path suite
 * (Lane A owns this file). Runs after Test 15 on the shared page.
 *
 * Contract for every suite: start and END on the 'ship' world, interior
 * view, standing (not seated), flight reset, all doors OPEN — the next suite
 * inherits whatever state this one leaves behind.
 *
 * Every check here drives the path a player actually takes: aim the real
 * camera, let tickInteract()'s own name-resolved raycast pick a target, read
 * the live [E] prompt, then press the real key. See helpers.mjs's header for
 * why __test.interact()'s proximity fallback never proves this.
 */
import { resolve } from 'node:path';
import { aimProbe, aimAndPressE, aimSweep, waitFrames } from './helpers.mjs';

export async function runShipSuite(ctx) {
  const { page, assert, sleep, waitFrame, headed, SHOTS_DIR } = ctx;

  console.log('\n[ship-suite] ── Lane A: ship interior, real input path ──');

  // tickDoors() advances animT by dt/ANIM_DURATION, and main.ts clamps dt at
  // 50ms/frame — a FIXED real-time sleep does not reliably bound when a
  // 480ms door animation actually finishes under headless SwiftShader's
  // irregular (sometimes far slower than 20fps, and slower still under
  // concurrent-lane CPU contention) frame delivery. Fast-forward
  // deterministically instead — same pattern as testApiFlight.ts's
  // flightTickN/approachTickN/landingTickN, for the identical reason. (The
  // crate's PropTween, below, is wall-clock-elapsed-based rather than
  // dt-accumulated, so a plain sleep past its duration is fine for that one.)
  async function waitForDoorSettled() {
    await page.evaluate(() => window.__test.tickDoorsN(60, 16.6)); // ~1000ms simulated
    await waitFrame();
  }

  async function clickEscCloseLabel() {
    const closeLabel = page.locator('#ship-overlay').getByText('[ESC]', { exact: true });
    assert(await closeLabel.count() === 1, 'overlay should contain exactly one [ESC] close label');
    await closeLabel.click();
  }

  // ── Contract: normalize entry state ────────────────────────────────────
  await page.evaluate(() => window.__test.switchWorld('ship'));
  await sleep(150);
  await page.evaluate(() => window.__test.resetFlight());
  await waitFrame();
  await page.evaluate(() => window.__test.setFlightView('interior'));
  await waitFrame();
  // Test 6 (verify.mjs) ends with corridor-galley CLOSED by design (that's
  // its own pass condition) — reopen it via the real E key so this suite
  // starts on the "all doors open" invariant it must also end on.
  if (!(await page.evaluate(() => window.__test.getDoorOpen('corridor-galley')))) {
    await aimAndPressE(page, assert, [0, 1.7, -6.0], [0, 1.1, -7], 'corridor-galley', 'corridor-galley (suite-entry reopen)');
    await waitForDoorSettled();
  }

  // ── A2/A3: every interactable this lane fixed, from a natural approach ──
  console.log('[ship-suite] A2/A3: name-contract reachability, real E key');

  // -- cockpit-aft: the deep-dive door (close, slab Y drop, blocks, reopen,
  //    real auto-close) — corridor-galley's open/close/auto-close is already
  //    covered honestly by verify.mjs Tests 3 and 6 (this lane's blocks).
  {
    const id = 'cockpit-aft';
    const from = [0, 1.7, -19.0];
    const wasOpen = await page.evaluate((i) => window.__test.getDoorOpen(i), id);
    assert(wasOpen === true, `${id}: expected to start OPEN; got closed`);
    const openSlabY = await page.evaluate((i) => window.__test.getDoorSlabY(i), id);
    assert(openSlabY !== null && openSlabY > 1.9, id + ': expected open slab above the body band; got ' + openSlabY);

    const sweep = await aimSweep(page, [0, 0, -20], id, { r: 1.4, y: 1.7, n: 8 });
    console.log(`  ${id} aimSweep (open, parked up — expect low hits from eye height): ${sweep.hits}/${sweep.total}; misses=${JSON.stringify(sweep.misses)}`);

    await aimAndPressE(page, assert, from, [0, 2.6, -20], id, `${id} (close)`);
    // Require a real render-loop tick to move the slab before test fast-forward.
    await page.waitForFunction(
      ({ doorId, startY }) => {
        const currentY = window.__test.getDoorSlabY(doorId);
        return currentY !== null && currentY < startY - 0.2;
      },
      { doorId: id, startY: openSlabY },
      { timeout: 30000 },
    );
    await waitForDoorSettled();

    const closedNow = await page.evaluate((i) => window.__test.getDoorOpen(i), id);
    assert(closedNow === false, `${id}: should be CLOSED after real E; got open`);
    const slabY = await page.evaluate((i) => window.__test.getDoorSlabY(i), id);
    console.log(`  ${id}: closed — slabY=${slabY === null ? 'null' : slabY.toFixed(3)} (expect ~0, was ~2.15 open)`);
    assert(slabY !== null && slabY < 0.5, `${id}: slab should have dropped to ~0 across real frames; got ${slabY}`);

    // Closed doors must collide. Pointer lock needs a real user gesture, and
    // cross-lane confirms it IS reliably acquirable in this exact harness
    // (Lane B, landing.mjs B6.6: a real held KeyW moved their camera ~1.9m).
    // Lane B reconnects PointerLockControls in resetDescent() at the source;
    // this assertion still proves the real canvas gesture and held KeyW path
    // cross the threshold only when the door is open.
    const faceDoor = async () => {
      // aimFrom sets the camera position itself, so this doesn't need (and
      // must not redundantly fight) a separate teleport() first. Target is
      // straight down -Z from the origin (same x,y) — camera.lookAt() on a
      // Camera orients -Z at the target, so yaw is 0 and W (which moves -Z
      // in tryMove) drives straight through the doorway at x=0.
      await page.evaluate(() => window.__test.aimFrom(0, 1.7, -19.0, 0, 1.7, -21.0));
      await waitFrame();
    };
    const wasdProbe = async (label) => {
      const before = await page.evaluate(() => window.__test.getPlayerPos());
      await page.keyboard.down('KeyW');
      await waitFrames(page, 10);
      const midDiag = await page.evaluate(() => window.__test.getMoveDiag());
      await page.keyboard.up('KeyW');
      await waitFrames(page, 2);
      const after = await page.evaluate(() => window.__test.getPlayerPos());
      console.log(`  ${id}: real WASD ${label}: z ${before.z.toFixed(2)} -> ${after.z.toFixed(2)} (mid-hold: moving=${midDiag.moving} locked=${midDiag.locked} yaw=${midDiag.yaw.toFixed(3)})`);
      return after.z;
    };

    await faceDoor();
    await page.click('canvas');
    await waitFrames(page, 2);
    assert(
      (await page.evaluate(() => document.pointerLockElement !== null)),
      `${id}: expected a real pointer lock to be acquirable in this harness (cross-lane confirmed)`,
    );

    const afterClosed = await wasdProbe('into the CLOSED door');
    assert(afterClosed > -19.9, `${id}: closed door should have blocked forward movement short of z=-20; player reached z=${afterClosed.toFixed(2)}`);

    const boundsClosed = await page.evaluate((i) => window.__test.getDoorColliderBounds(i), id);
    assert(boundsClosed !== null, `${id}: expected a live collider`);
    console.log(`  ${id}: closed collider Y bounds = [${boundsClosed.minY.toFixed(2)}, ${boundsClosed.maxY.toFixed(2)}] (controller body band is 0.1-1.9)`);
    assert(boundsClosed.minY < 1.9 && boundsClosed.maxY > 0.1, `${id}: closed collider [${boundsClosed.minY},${boundsClosed.maxY}] should overlap the 0.1-1.9 body band`);

    // Reopen, then confirm the SAME approach now passes through — rules out
    // "the camera just doesn't move" as a false-positive block — then prove
    // the REAL auto-close tick (not the deleted forceDoorAutoCloseCheck()
    // shortcut — see doors.ts / verify.mjs Test 6).
    await page.evaluate(() => window.__test.teleport(0, 1.7, -19.0));
    await waitFrame();
    await aimAndPressE(page, assert, [0, 1.7, -19.0], [0, 1.1, -20], id, `${id} (reopen)`);
    await waitForDoorSettled();
    assert((await page.evaluate((i) => window.__test.getDoorOpen(i), id)) === true, `${id}: should be OPEN after real E`);
    const boundsOpen = await page.evaluate((i) => window.__test.getDoorColliderBounds(i), id);
    assert(boundsOpen !== null && boundsOpen.minY > 1.9, `${id}: open collider minY=${boundsOpen && boundsOpen.minY} should sit above the 1.9 body band`);

    await faceDoor();
    const afterOpen = await wasdProbe('through the OPEN door');
    assert(afterOpen < -20.3, `${id}: open door should NOT block; player only reached z=${afterOpen.toFixed(2)}`);
    await page.evaluate(() => document.exitPointerLock());
    await waitFrames(page, 2);

    await page.evaluate(() => window.__test.teleport(0, 1.7, -12));
    await waitFrame();
    await sleep(250);
    await page.evaluate((i) => window.__test.debugExpireDoorDwell(i), id);
    // Auto-close must run through the real main-loop tick before animation settling.
    await page.waitForFunction((i) => window.__test.getDoorOpen(i) === false, id, { timeout: 30000 });
    await waitForDoorSettled();
    const autoClosedNow = await page.evaluate((i) => window.__test.getDoorOpen(i), id);
    console.log(`  ${id}: after real tickDoors auto-close — isDoorOpen=${autoClosedNow}`);
    assert(autoClosedNow === false, `${id}: should have auto-closed via the real tick`);

    // Leave it open for the next lane / the end-of-suite invariant.
    await page.evaluate(() => window.__test.teleport(0, 1.7, -19.0));
    await waitFrame();
    await aimAndPressE(page, assert, [0, 1.7, -19.0], [0, 1.1, -20], id, `${id} (final reopen)`);
    await waitForDoorSettled();
  }

  // -- The remaining 5 doors: a lighter open/close/reopen pass proving the
  //    name fix generalizes (not just the one door tested deeply above).
  const otherDoors = [
    { id: 'corridor-quarters-a', pos: [-1.5, 0, -16], from: [-0.3, 1.7, -16] },
    { id: 'corridor-quarters-b', pos: [1.5, 0, -16], from: [0.3, 1.7, -16] },
    { id: 'galley-engineering', pos: [0, 0, -1], from: [0, 1.7, -2.0] },
    { id: 'engineering-cargo', pos: [0, 0, 9], from: [0, 1.7, 8.0] },
    { id: 'cargo-annex', pos: [0, 0, 18], from: [0, 1.7, 17.0] },
  ];
  for (const { id, pos, from } of otherDoors) {
    const [dx, , dz] = pos;
    assert((await page.evaluate((i) => window.__test.getDoorOpen(i), id)) === true, `${id}: expected to start OPEN`);
    await page.evaluate((p) => window.__test.teleport(p.x, 1.7, p.z), { x: from[0], z: from[2] });
    await waitFrame();
    await aimAndPressE(page, assert, from, [dx, 2.6, dz], id, `${id} (close)`);
    await waitForDoorSettled();
    assert((await page.evaluate((i) => window.__test.getDoorOpen(i), id)) === false, `${id}: should be CLOSED after real E`);
    // y=0.8, not 1.1: corridor-quarters-a's threshold sits right beside the
    // save-terminal-shell console (world -1.44, Y 1.15-1.95, Z -16) — a y=1.1
    // aim grazed its bottom-forward corner from this approach angle and hit
    // it instead of the door. 0.8 stays clear of every wall console's
    // mounting height while still landing on the closed slab (spans 0-2.08).
    await aimAndPressE(page, assert, from, [dx, 0.8, dz], id, `${id} (reopen)`);
    await waitForDoorSettled();
    assert((await page.evaluate((i) => window.__test.getDoorOpen(i), id)) === true, `${id}: should be OPEN after real E again`);
    console.log(`  ${id}: real-E close/reopen OK`);
  }

  // -- bunk-a: Sleep, via the real E key (Test 1 in verify.mjs stays on the
  //    proximity-fallback shortcut on purpose; this is the honest version).
  {
    const sweep = await aimSweep(page, [-4, 0.9, -17.98], 'bunk-a', { r: 1.3, y: 1.6, n: 8 });
    console.log(`  bunk-a aimSweep: ${sweep.hits}/${sweep.total}; misses=${JSON.stringify(sweep.misses)}`);
    assert(sweep.hits >= 2, `bunk-a should resolve from at least 2/8 bearings; got ${sweep.hits}`);

    const pre = await page.evaluate(() => window.__test.getState());
    await aimAndPressE(page, assert, [-4, 1.7, -16.5], [-4, 1.0, -17.98], 'bunk-a', 'bunk-a (Sleep)');
    console.log('[ship-suite] waiting for the sleep fade (1600ms)…');
    await sleep(1600);
    const post = await page.evaluate(() => window.__test.getState());
    console.log(`  bunk-a: clock ${pre.clock.toFixed(1)} -> ${post.clock.toFixed(1)}, energy ${pre.energy.toFixed(1)} -> ${post.energy.toFixed(1)}`);
    assert(post.clock - pre.clock >= 470, `bunk-a: clock should advance ~480 ship-minutes; delta=${(post.clock - pre.clock).toFixed(1)}`);
    assert(post.energy >= 99, `bunk-a: energy should be restored to ~100; got ${post.energy}`);
  }

  // -- console-bank: NAV/SYSTEMS/PLANET SCAN via the real E key, closed by
  //    real Escape (the A5 regression below re-uses this same interactable).
  {
    const from = [0, 1.7, -23.5];
    // The registered interactable position (0,1.0,-24.98) is the console
    // body's OUTER/fore edge, not a point ON it — the merged body+cap only
    // spans world Y up to ~24.47 (BH+TH=0.97) and the screens sit at world Z
    // ~-24.43 to -24.98; aiming (1.0, -24.98) sails clean over the top the
    // whole way through that Z range. This targets the body's true centre
    // (world Y 0.5, Z -24.7) instead.
    const at = [0, 0.5, -24.7];
    const probe = await aimProbe(page, from, at);
    console.log(`  console-bank probe: id=${probe.id} prompt='${probe.prompt}'`);
    assert(probe.id === 'console-bank', `console-bank should resolve via the real E key; got '${probe.id}'`);
    assert(probe.prompt.startsWith('[E]'), `console-bank should show a live [E] prompt; got '${probe.prompt}'`);

    const seenTitles = [];
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('KeyE');
      await waitFrames(page, 2);
      const title = await page.evaluate(() => window.__test.getOverlayTitle());
      console.log(`  console-bank cycle ${i + 1}: '${title}'`);
      assert(title.startsWith('CONSOLE — '), `console-bank overlay should be showing after real E #${i + 1}; got '${title}'`);
      seenTitles.push(title);
    }
    assert(new Set(seenTitles).size === 3, `console-bank should cycle through 3 distinct modes; got ${JSON.stringify(seenTitles)}`);

    await page.keyboard.press('Escape');
    await waitFrames(page, 2);
    assert((await page.evaluate(() => window.__test.isOverlayVisible())) === false, 'console-bank overlay should close on real Escape');
    console.log('[ship-suite] console-bank: NAV/SYSTEMS/PLANET SCAN cycle OK, closed with Escape');
  }

  // -- dimensional-survey-console (portal room / annex): both the housing
  //    box AND its near-coplanar readout screen now carry the id — see the
  //    comment in portalRoomProps.ts for why the screen needed it too.
  {
    const from = [-1.8, 1.7, 18.8];
    // Housing spans world Z 18.10-18.40 (local -3.40..-3.10 at annex worldPos
    // 21.5) — 18.4 sits right on that near edge, a borderline graze; aim at
    // the housing's true centre (world Z 18.25) instead.
    const at = [-2.6, 0.65, 18.25];
    const probe = await aimProbe(page, from, at);
    console.log(`  dimensional-survey-console probe: id=${probe.id} prompt='${probe.prompt}'`);
    assert(probe.id === 'dimensional-survey-console', `survey console should resolve via the real E key; got '${probe.id}'`);
    assert(probe.prompt.startsWith('[E]'), `survey console should show a live [E] prompt; got '${probe.prompt}'`);
    await page.keyboard.press('KeyE');
    await waitFrames(page, 2);
    assert((await page.evaluate(() => window.__test.isOverlayVisible())) === true, 'survey console overlay should open on real E');
    await page.keyboard.press('Escape');
    await waitFrames(page, 2);
  }

  // ── A4: crate-b slide tween ticks for real + the quest start it unlocks ──
  console.log('[ship-suite] A4: crate-b slide tween + quest start, real path');
  {
    const crateFrom = [-1.45, 1.7, 4.2];
    const preX = await page.evaluate(() => window.__test.getCrateBVisualX());
    await page.evaluate((p) => window.__test.teleport(p[0], 1.7, p[2]), crateFrom);
    await waitFrame();
    await aimAndPressE(page, assert, crateFrom, [-1.45, 0.21, 5.2], 'crate-b', 'crate-b (Slide Crate)');
    // PropTween.tick() reads performance.now() directly (wall-clock elapsed,
    // not frame-count-accumulated like tickDoors), so a plain sleep past its
    // 400ms duration is reliable regardless of headless frame-rate variance
    // — same as the fridge/locker door tweens elsewhere in this suite.
    await sleep(550);
    const postX = await page.evaluate(() => window.__test.getCrateBVisualX());
    console.log(`  crate-b visual X: ${preX === null ? 'null' : preX.toFixed(2)} -> ${postX === null ? 'null' : postX.toFixed(2)}`);
    assert(preX !== null && postX !== null, 'crate-b visual group should exist');
    assert(Math.abs(postX - preX) > 0.5, `crate-b should visibly slide a real distance (0.8m) over real frames; ${preX.toFixed(2)} -> ${postX.toFixed(2)}`);

    const panelProbe = await aimProbe(page, crateFrom, [-1.45, 0.05, 5.2]);
    console.log(`  hidden-floor-panel probe (post-slide): id=${panelProbe.id} prompt='${panelProbe.prompt}'`);
    assert(panelProbe.id === 'hidden-floor-panel', `hidden-floor-panel should be real-E-reachable once the crate has visibly moved; got '${panelProbe.id}'`);
    assert(panelProbe.prompt.startsWith('[E]') && panelProbe.prompt.includes('Inspect Panel'), `panel should show a live 'Inspect Panel' prompt; got '${panelProbe.prompt}'`);

    const preQuest = (await page.evaluate(() => window.__test.getState())).questStep;
    await page.keyboard.press('KeyE');
    await waitFrames(page, 2);
    const postQuest = (await page.evaluate(() => window.__test.getState())).questStep;
    console.log(`  quest step: ${preQuest} -> ${postQuest}`);
    if (preQuest === 0) {
      assert(postQuest === 1, `quest should advance 0 -> 1 on first real panel read; got ${postQuest}`);
    } else {
      console.log('  (quest already progressed past step 0 by an earlier verify.mjs test — real reachability is what this proves; the 0->1 transition itself is already covered by verify.mjs Test 8)');
    }
  }

  // ── A5: overlay-leak regression — breaker cabinet ────────────────────────
  console.log('[ship-suite] A5: breaker cabinet overlay-leak regression');
  {
    const from = [-2.0, 1.7, 3.8];
    const at = [-2.89, 1.35, 3.8];
    await page.evaluate((p) => window.__test.teleport(p[0], 1.7, p[2]), from);
    await waitFrame();
    await aimAndPressE(page, assert, from, at, 'breaker-cabinet', 'breaker-cabinet (open)');
    assert((await page.evaluate(() => window.__test.isOverlayVisible())) === true, 'breaker overlay should open on real E');

    // Close by clicking the [ESC] label — NOT the Escape key — the exact
    // path that used to leak (hudOverlay.ts's closeBtn only ever called
    // hideOverlay(), never the owner's own cleanup).
    await clickEscCloseLabel();
    await waitFrames(page, 2);
    assert((await page.evaluate(() => window.__test.isOverlayVisible())) === false, 'breaker overlay should be closed after the [ESC] label click');

    const energyBefore = (await page.evaluate(() => window.__test.getState())).energy;
    await page.keyboard.press('Digit1'); // would drain -20 energy if the handler leaked
    await waitFrames(page, 2);
    const energyAfter = (await page.evaluate(() => window.__test.getState())).energy;
    console.log(`  post-[ESC]-label-close, stray Digit1 — energy ${energyBefore.toFixed(1)} -> ${energyAfter.toFixed(1)} (expect ~unchanged, not -20)`);
    // Energy decays continuously in real time (~0.1/s, per Test 1's own
    // comment) regardless of any interaction, so a few real-clock frames
    // between the two reads naturally drifts it a little. A leaked handler
    // would drain a full -20 on this keypress; assert far below that, not
    // bit-for-bit equality.
    assert(Math.abs(energyAfter - energyBefore) < 2, `breaker handler leaked: a stray Digit1 changed energy (${energyBefore} -> ${energyAfter})`);
    assert((await page.evaluate(() => window.__test.isOverlayVisible())) === false, 'no overlay should have re-appeared from a leaked handler');
    console.log('[ship-suite] A5 PASSED (breaker handler does not survive an [ESC]-label close)');
  }

  // -- console-bank gets the same regression shape (brief calls out both):
  //    close via the [ESC] label, then a stray real Escape, then confirm a
  //    fresh real E still cycles cleanly from mode 0 (no leaked/duplicate handler).
  {
    const from = [0, 1.7, -23.5];
    await page.evaluate((p) => window.__test.teleport(p[0], 1.7, p[2]), from);
    await waitFrame();
    await aimAndPressE(page, assert, from, [0, 0.5, -24.7], 'console-bank', 'console-bank (A5 regression, open)');
    await waitFrames(page, 2);
    await clickEscCloseLabel();
    await waitFrames(page, 2);
    assert((await page.evaluate(() => window.__test.isOverlayVisible())) === false, 'console-bank overlay should close on the [ESC] label click');

    await page.keyboard.press('Escape'); // the stray press the old code left live
    await waitFrames(page, 2);
    assert((await page.evaluate(() => window.__test.isOverlayVisible())) === false, 'a stray Escape after an [ESC]-label close should be a harmless no-op');

    await aimAndPressE(page, assert, from, [0, 0.5, -24.7], 'console-bank', 'console-bank (A5 regression, reopen)');
    await waitFrames(page, 2);
    const title = await page.evaluate(() => window.__test.getOverlayTitle());
    console.log(`  console-bank re-opened after the stray Escape: '${title}' (expect SYSTEMS — mode correctly reset to 0 by the label-click close)`);
    assert(title === 'CONSOLE — SYSTEMS', `console-bank should resume from mode 0 (label-click close resets it); got '${title}'`);
    await page.keyboard.press('Escape');
    await waitFrames(page, 2);
  }

  // ── A7: art check (headed only) ─────────────────────────────────────────
  if (headed) {
    console.log('[ship-suite] A7: art check — cockpit screens/dust, reactor breath, closed door, bunk');

    await page.evaluate((n) => window.__setCam(n), 'cockpit-canopy');
    await waitFrame();
    await sleep(700); // let the ~30fps screen/dust tick run a few cycles
    await page.screenshot({ path: resolve(SHOTS_DIR, 'a7-cockpit-live.png') });
    console.log('[verify] Shot saved: a7-cockpit-live.png (screens + dust motes should read as live, not garbage)');

    await page.evaluate((n) => window.__setCam(n), 'engineering');
    await waitFrame();
    await page.evaluate(() => window.__test.freezeReactorBreath(1));
    await waitFrame();
    await page.screenshot({ path: resolve(SHOTS_DIR, 'a7-reactor-peak.png') });
    console.log('[verify] Shot saved: a7-reactor-peak.png (intensity 4.4 — check the hazard disc does not blow white)');
    await page.evaluate(() => window.__test.freezeReactorBreath(-1));
    await waitFrame();
    await page.screenshot({ path: resolve(SHOTS_DIR, 'a7-reactor-trough.png') });
    console.log('[verify] Shot saved: a7-reactor-trough.png (intensity 2.4)');
    await page.evaluate(() => window.__test.freezeReactorBreath(null));

    // Corridor: one shot with a door CLOSED, framed by the existing
    // qa-doorway QA camera (assembly.ts) — reopened immediately after so the
    // suite still ends on the all-doors-open invariant.
    await page.evaluate(() => window.__test.teleport(0, 1.7, -6.0));
    await waitFrame();
    await aimAndPressE(page, assert, [0, 1.7, -6.0], [0, 2.6, -7], 'corridor-galley', 'corridor-galley (A7 close shot)');
    await waitForDoorSettled();
    await page.evaluate((n) => window.__setCam(n), 'qa-doorway');
    await waitFrame();
    await page.screenshot({ path: resolve(SHOTS_DIR, 'a7-corridor-door-closed.png') });
    console.log('[verify] Shot saved: a7-corridor-door-closed.png (slab should read as a door, not a floating slab)');
    await page.evaluate(() => window.__test.teleport(0, 1.7, -6.0));
    await waitFrame();
    await aimAndPressE(page, assert, [0, 1.7, -6.0], [0, 1.1, -7], 'corridor-galley', 'corridor-galley (A7 reopen)');
    await waitForDoorSettled();

    await page.evaluate((n) => window.__setCam(n), 'quarters-a');
    await waitFrame();
    await page.screenshot({ path: resolve(SHOTS_DIR, 'a7-quarters-bunk.png') });
    console.log('[verify] Shot saved: a7-quarters-bunk.png');
  }

  // ── Contract: leave the shared page in the state the next suite expects ─
  await page.evaluate((n) => window.__setCam(n), 'cockpit');
  await waitFrame();
  await page.evaluate(() => window.__test.resetFlight());
  await waitFrame();

  // The suite takes longer than the 8-second auto-close dwell, so earlier
  // real-E reopens can close again while later checks run. Restore every door
  // through the real raycast and E path immediately before returning.
  const finalDoorTargets = [
    { id: 'cockpit-aft', from: [0, 1.7, -19.0], at: [0, 1.1, -20] },
    ...otherDoors.map(({ id, pos, from }) => ({
      id,
      from,
      at: [pos[0], 0.8, pos[2]],
    })),
    { id: 'corridor-galley', from: [0, 1.7, -6.0], at: [0, 1.1, -7] },
  ];
  for (const { id, from, at } of finalDoorTargets) {
    const disarmIfOpen = () => page.evaluate((i) => {
      const open = window.__test.getDoorOpen(i);
      if (open) window.__test.disarmDoorAutoClose(i);
      return open;
    }, id);
    if (!(await disarmIfOpen())) {
      await aimAndPressE(page, assert, from, at, id, id + ' (suite-exit reopen)');
      await waitForDoorSettled();
      assert(await disarmIfOpen(), 'suite-exit: ' + id + ' should be OPEN after real E');
    }
  }
  await page.evaluate((n) => window.__setCam(n), 'cockpit');
  await waitFrame();
  await page.evaluate(() => window.__test.resetFlight());
  await waitFrame();
  for (const { id } of finalDoorTargets) {
    assert((await page.evaluate((i) => window.__test.getDoorOpen(i), id)) === true, 'final suite state: ' + id + ' should remain OPEN');
  }
  console.log('[ship-suite] All Lane A checks PASSED ✓\n');
}
