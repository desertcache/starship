/**
 * verify.mjs — Phase-gate verification harness
 * Builds, serves vite preview, screenshots every named camera, samples perf.
 * Usage:
 *   node scripts/verify.mjs             (headless, default quality)
 *   node scripts/verify.mjs --headed    (headed Chromium, fps authoritative)
 *   node scripts/verify.mjs --quality   (append ?quality=high to URL — enables SSAO + shadows)
 *   node scripts/verify.mjs --headed --quality   (both)
 *
 * --quality is a permanent harness flag; it appends ?quality=high to every page
 * navigation so SSAOPass and shadow maps are active for the full perf sample.
 * Default (no flag) loads the plain URL — zero cost, verify-budget baseline.
 */

import { execSync, spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SHOTS_DIR = resolve(ROOT, 'verify', 'shots');
const REPORT_PATH = resolve(ROOT, 'verify', 'report.json');
let PREVIEW_PORT = 4173;
let BASE_URL = `http://localhost:${PREVIEW_PORT}`;
const headed  = process.argv.includes('--headed');
/** When true, appends ?quality=high to every URL opened by the harness. */
const quality = process.argv.includes('--quality');
/** Extra URL params passed via --flags=key=val&key2=val2 (isolation matrix runs).
 *  e.g. node scripts/verify.mjs --flags=ssao=0
 *       node scripts/verify.mjs "--flags=ssao=0&shadows=0"
 *  Appended AFTER the standard params. Defaults unchanged when omitted. */
const flagsArg = process.argv.find((a) => a.startsWith('--flags='));
const extraFlags = flagsArg ? flagsArg.slice('--flags='.length) : '';
/** Build the full page URL, always suppressing room toasts (?toasts=0) and
 *  optionally appending the quality param. Toasts are suppressed so screenshots
 *  never capture mid-display "COCKPIT" / "CREW QUARTERS" labels over subjects.
 *  --flags= extra params are appended last for isolation matrix runs. */
function pageUrl(base) {
  let params = quality ? 'toasts=0&quality=high' : 'toasts=0';
  if (extraFlags) params += '&' + extraFlags;
  return `${base}/?${params}`;
}

mkdirSync(SHOTS_DIR, { recursive: true });

// ── 1. Build ──────────────────────────────────────────────────────────────────
console.log('[verify] Building…');
// Use node + local vite binary directly to avoid Windows PATH issues
// when node_modules was installed via WSL (no .cmd wrappers exist).
const VITE_BIN_PATH = resolve(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
try {
  execSync(`node "${VITE_BIN_PATH}" build`, { cwd: ROOT, stdio: 'inherit' });
} catch {
  // Fallback to npm run build (works in WSL / Unix environments)
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
}

// Stamp THIS build. The port-probe below has an unavoidable race under parallel
// worktree lanes: probe says "free", then a sibling lane's preview can win the
// actual bind, and waitForServer would happily verify the SIBLING's stale build
// (silently — screenshots would look like an unmodified baseline). The stamp is
// served from dist/ and re-checked after the server comes up; mismatch = hard fail.
const BUILD_STAMP = randomUUID();
writeFileSync(resolve(ROOT, 'dist', 'verify-stamp.txt'), BUILD_STAMP);

// ── 2. Serve vite preview ─────────────────────────────────────────────────────
// Find a free port starting from 4173.
// Bind 127.0.0.1 explicitly — vite preview binds IPv4, and an IPv6-only probe
// reports "free" while a stale IPv4 server still holds the port.
async function findFreePort(start) {
  const { createServer } = await import('node:net');
  return new Promise((resolve) => {
    const s = createServer();
    s.listen(start, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
    s.on('error', () => resolve(findFreePort(start + 1)));
  });
}

PREVIEW_PORT = await findFreePort(4173);
BASE_URL = `http://localhost:${PREVIEW_PORT}`;

console.log(`[verify] Starting preview server on port ${PREVIEW_PORT}…`);
// Spawn vite directly (no shell): on Windows, shell:true makes server.kill()
// kill the cmd wrapper and orphan the real server, which then serves stale
// builds to the next verify run.
const VITE_BIN = resolve(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
const server = spawn(
  process.execPath,
  [VITE_BIN, 'preview', '--port', String(PREVIEW_PORT), '--strictPort'],
  { cwd: ROOT, stdio: 'inherit' },
);

let serverExited = false;
server.on('exit', (code) => {
  serverExited = true;
  if (code !== 0 && code !== null) {
    console.error(`[verify] Preview server exited with code ${code}`);
  }
});

async function waitForServer(url, maxMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (serverExited) {
      throw new Error('Preview server died during startup (port conflict?). Refusing to verify against a stale server.');
    }
    try {
      const resp = await fetch(url);
      if (resp.status >= 200 && resp.status <= 299) return;
      if (resp.status >= 400 && resp.status <= 499) {
        throw new Error(`Server returned ${resp.status} for ${url} — check build output or route config.`);
      }
      // 5xx / redirects: keep retrying
    } catch (err) {
      if (err instanceof Error && err.message.startsWith('Server returned 4')) throw err;
      // connection refused / other: not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Server at ${url} did not come up within ${maxMs}ms`);
}

async function run() {
  try {
    await waitForServer(BASE_URL);

    // Confirm the server on our port is serving OUR build (see BUILD_STAMP note).
    const stampResp = await fetch(`${BASE_URL}/verify-stamp.txt`);
    const servedStamp = stampResp.ok ? (await stampResp.text()).trim() : '<missing>';
    if (servedStamp !== BUILD_STAMP) {
      throw new Error(
        `Build-stamp mismatch: expected ${BUILD_STAMP}, server on port ${PREVIEW_PORT} ` +
        `returned ${servedStamp}. Another process (parallel lane?) owns this port — ` +
        `refusing to verify against a foreign/stale build.`,
      );
    }
    console.log('[verify] Preview server ready (build stamp verified).');

    const browser = await chromium.launch({ headless: !headed });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') console.error('[page error]', msg.text());
    });

    console.log('[verify] Navigating…');
    await page.goto(pageUrl(BASE_URL), { waitUntil: 'networkidle' });

    // ── 3. Await __ready ────────────────────────────────────────────────────────
    console.log('[verify] Awaiting __ready…');
    await page.waitForFunction(() => window.__ready instanceof Promise, { timeout: 15000 });
    await page.evaluate(() => window.__ready);
    console.log('[verify] __ready resolved.');

    // Allow a couple of render frames to stabilise after the first frame signal.
    // Without this, the first camera screenshot can capture a blank WebGL canvas
    // (preserveDrawingBuffer is false — backbuffer cleared between frames).
    await page.waitForTimeout(600);

    // ── 4. Discover registered cameras ─────────────────────────────────────────
    const camNames = await page.evaluate(() => {
      // __setCam is registered; peek at window for cam list via the helper
      // We expose the list through a temp call pattern — the registry is internal,
      // so we iterate by trying known names. Instead, we added __camNames in main.
      return window.__camNames ?? [];
    });

    // Fallback: try both seed cameras
    const toShoot = camNames.length > 0
      ? camNames
      : ['seed-room', 'seed-room-corner'];

    // ── 5. Screenshot each camera ───────────────────────────────────────────────
    for (const name of toShoot) {
      console.log(`[verify] Camera: ${name}`);
      const ok = await page.evaluate((n) => window.__setCam(n), name);
      if (!ok) {
        console.warn(`[verify] __setCam(${name}) returned false — cam not registered?`);
      }
      await page.waitForTimeout(800);
      const shotPath = resolve(SHOTS_DIR, `${name}.png`);
      await page.screenshot({ path: shotPath });
      console.log(`[verify] Shot saved: ${shotPath}`);
    }

    // ── 6. Perf sample — worst camera first, then full 5s sample ─────────────────
    // Phase 1: 1s quick sample per camera to find the worst (lowest fps).
    console.log('[verify] Probing each camera (1000ms each) to find worst…');
    let worstCam = toShoot[0];
    let worstFps = Infinity;
    for (const camName of toShoot) {
      await page.evaluate((n) => window.__setCam(n), camName);
      await page.waitForTimeout(200);
      const probe = await page.evaluate(() => window.__perf.sample(1000));
      console.log(`[verify]   ${camName}: ${probe.avgFps} fps`);
      if (probe.avgFps < worstFps) {
        worstFps = probe.avgFps;
        worstCam = camName;
      }
    }
    console.log(`[verify] Worst camera: '${worstCam}' (${worstFps} fps) — running full 5s sample there.`);

    // Phase 2: full 5s sample from worst camera
    await page.evaluate((n) => window.__setCam(n), worstCam);
    await page.waitForTimeout(200);

    const report = await page.evaluate(
      () => window.__perf.sample(5000),
    );
    report.headless = !headed;
    report.qualityHigh = quality;
    report.cameras = toShoot;
    report.perfCamera = worstCam;
    report.timestamp = new Date().toISOString();

    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    console.log('[verify] report.json written:', report);

    // ── 7. Functional tests (Phase 4) ──────────────────────────────────────────
    console.log('\n[verify] ── Phase 4 functional tests ──');

    // Helpers
    const sleep = (ms) => page.waitForTimeout(ms);

    function assert(condition, message) {
      if (!condition) {
        throw new Error(`ASSERTION FAILED: ${message}`);
      }
    }

    // Ensure the SHIP world is active before the ship functional tests — the
    // perf phase above may have left a pocket-world camera (e.g. dev-void-qa)
    // active, which would swap the interaction scene/list out from under them.
    await page.evaluate(() => window.__test.switchWorld('ship'));
    await sleep(150);

    // ── Test 1: Sleep (bunk-a in quarters-a) ───────────────────────────────────
    // quarters-a world offset: (-4, 0, -16).
    // Bunk world centre: (-4, 0.84, -17.98). Teleport player adjacent, within radius.
    console.log('[verify] Test 1: Sleep (bunk-a)');
    const preState = await page.evaluate(() => window.__test.getState());
    console.log(`  pre-sleep  — clock=${preState.clock.toFixed(1)} energy=${preState.energy.toFixed(1)}`);

    // Drain energy below 100 so we can verify it was restored
    await page.evaluate(() => window.__test.teleport(-4, 1.7, -16.5));
    await sleep(150); // let a frame render so raycast has position

    // Headless: proximity interact (no pointer lock needed)
    const interacted1 = await page.evaluate(() => window.__test.interact());
    assert(interacted1, 'interact() returned false — no interactable found near bunk-a');

    // Wait for fade out + hold + fade in (~350+250+350 = 950ms; add 600ms buffer)
    console.log('[verify] Waiting for sleep fade animation (1600ms)…');
    await sleep(1600);

    const postSleep = await page.evaluate(() => window.__test.getState());
    console.log(`  post-sleep — clock=${postSleep.clock.toFixed(1)} energy=${postSleep.energy.toFixed(1)}`);

    const clockDelta = postSleep.clock - preState.clock;
    console.log(`  clock delta: ${clockDelta.toFixed(1)} ship-minutes (expected ~480 + a few ticks)`);
    // Allow up to 10 extra ship-minutes for real-time ticking during the wait period
    // (1 real-s = 1 ship-min, so 1.6s wait = ~1.6 extra ticks; 10 gives plenty of headroom).
    assert(
      clockDelta >= 479 && clockDelta <= 492,
      `clock did not advance ~480 ship-minutes; delta=${clockDelta.toFixed(2)}`,
    );
    // Energy was set to 100 but decays slightly during the wait period (~0.1/s × 1.6s = 0.16)
    assert(
      postSleep.energy >= 99.5,
      `energy was not restored to ~100; got ${postSleep.energy}`,
    );
    console.log('[verify] Test 1 PASSED ✓ (sleep advanced clock 8h, energy=100)');

    // ── Test 2: Eat (stove in galley) ──────────────────────────────────────────
    // galley world offset: (0, 0, -1).
    // Stove world centre: (2.725, 0.91, -1.60). Teleport player nearby.
    console.log('[verify] Test 2: Eat (stove in galley)');
    const preEat = await page.evaluate(() => window.__test.getState());
    console.log(`  pre-eat  — hunger=${preEat.hunger.toFixed(1)}`);

    await page.evaluate(() => window.__test.teleport(1.0, 1.7, -1.6));
    await sleep(150);

    const interacted2 = await page.evaluate(() => window.__test.interact());
    assert(interacted2, 'interact() returned false — no interactable found near stove');

    // Brief fade: 280+150+280 = 710ms + buffer
    console.log('[verify] Waiting for eat fade animation (1000ms)…');
    await sleep(1000);

    const postEat = await page.evaluate(() => window.__test.getState());
    console.log(`  post-eat — hunger=${postEat.hunger.toFixed(1)}`);
    // Hunger was set to 100 but decays slightly during wait period (~0.07/s × 1s = 0.07)
    assert(
      postEat.hunger >= 99.5,
      `hunger was not restored to ~100; got ${postEat.hunger}`,
    );
    console.log('[verify] Test 2 PASSED ✓ (hunger=100 after eat)');

    console.log('[verify] All Phase 4 functional tests PASSED ✓\n');

    // ── Test 3: Door toggle (corridor-galley door at world 0,0,-7) ──────────────
    // Door starts OPEN. Teleport player next to it, interact → should close.
    // Then interact again → should re-open.
    console.log('[verify] Test 3: Door toggle (corridor-galley)');
    const doorId = 'corridor-galley';

    const preToggleOpen = await page.evaluate((id) => window.__test.getDoorOpen(id), doorId);
    console.log(`  pre-toggle: isDoorOpen=${preToggleOpen}`);
    assert(preToggleOpen === true, `Door '${doorId}' should start OPEN; got closed`);

    // Teleport adjacent to door
    await page.evaluate(() => window.__test.teleport(0, 1.7, -6.0));
    await sleep(150);

    const interacted3a = await page.evaluate(() => window.__test.interact());
    assert(interacted3a, 'interact() returned false — door interactable not found');
    await sleep(600); // let animation run

    const afterClose = await page.evaluate((id) => window.__test.getDoorOpen(id), doorId);
    console.log(`  after close interact: isDoorOpen=${afterClose}`);
    assert(afterClose === false, `Door should be CLOSED after first interact; got open`);

    // Toggle back open
    await page.evaluate(() => window.__test.teleport(0, 1.7, -6.0));
    await sleep(150);
    const interacted3b = await page.evaluate(() => window.__test.interact());
    assert(interacted3b, 'interact() returned false on second door interact');
    await sleep(600);

    const afterReopen = await page.evaluate((id) => window.__test.getDoorOpen(id), doorId);
    console.log(`  after reopen interact: isDoorOpen=${afterReopen}`);
    assert(afterReopen === true, `Door should be OPEN after second interact; got closed`);
    console.log('[verify] Test 3 PASSED ✓ (door toggled closed then re-opened)');

    // ── Test 4: Fridge ration restores DRAINED hunger (strict) ───────────────────
    // Hunger sits near 100 after Test 2, which made a delta assertion vacuous.
    // Drain to 50 via the test hook so the +30 ration effect is actually measured.
    console.log('[verify] Test 4: Fridge ration restores drained hunger');
    await page.evaluate(() => window.__test.resetFridge());
    await page.evaluate(() => window.__test.setHunger(50));
    const preHunger = (await page.evaluate(() => window.__test.getState())).hunger;
    console.log(`  pre-fridge hunger=${preHunger.toFixed(1)} (drained via test hook)`);

    await page.evaluate(() => window.__test.teleport(1.8, 1.7, 0.5));
    await sleep(150);
    const opened4 = await page.evaluate(() => window.__test.interact()); // opens the door
    assert(opened4, 'interact() returned false — fridge interactable not found');
    await sleep(500); // door tween
    await page.evaluate(() => window.__test.teleport(1.8, 1.7, 0.5));
    await sleep(150);
    const took4 = await page.evaluate(() => window.__test.interact()); // takes a ration
    assert(took4, 'interact() returned false — take-ration step failed');
    await sleep(200);

    const postHunger = (await page.evaluate(() => window.__test.getState())).hunger;
    const hungerDelta = postHunger - preHunger;
    console.log(`  post-fridge hunger=${postHunger.toFixed(1)} delta=${hungerDelta.toFixed(1)} (strict ≥25)`);
    assert(hungerDelta >= 25, `Ration did not restore hunger; delta=${hungerDelta.toFixed(1)}`);
    console.log('[verify] Test 4 PASSED ✓ (ration restored ~+30 hunger from a drained state)');

    console.log('[verify] All Phase 4 + v0.2 functional tests PASSED ✓\n');

    // ── Test 5: Fridge door open → take ration → assert hunger + door state ─────
    // Galley worldPos (0,0,-1). Fridge interact pos ≈ (2.45, 1.05, 0.05) world.
    console.log('[verify] Test 5: Fridge door state machine');
    // Reset fridge to known closed+full state (Test 4 left it open, stock 2)
    await page.evaluate(() => window.__test.resetFridge());
    await page.evaluate(() => window.__test.setHunger(60));
    await sleep(100);

    // Step 5a: teleport near fridge and interact (should OPEN, no hunger change)
    await page.evaluate(() => window.__test.teleport(1.8, 1.7, 0.5));
    await sleep(150);

    const preOpenFridge = await page.evaluate(() => window.__test.getState());
    console.log(`  pre-open  — hunger=${preOpenFridge.hunger.toFixed(1)} (fridge still closed)`);

    const interacted5a = await page.evaluate(() => window.__test.interact());
    assert(interacted5a, 'Test 5: first interact() returned false — fridge not found');
    await sleep(500); // let door tween run

    const stateAfterOpen = await page.evaluate(() => window.__test.getFridgeState());
    console.log(`  after open — fridgeState=${stateAfterOpen.state} stock=${stateAfterOpen.stock}`);
    assert(stateAfterOpen.state === 'open', `Fridge should be OPEN after first interact; got ${stateAfterOpen.state}`);

    // Step 5b: interact again → should TAKE RATION (hunger +30)
    await page.evaluate(() => window.__test.teleport(1.8, 1.7, 0.5));
    await sleep(150);

    const interacted5b = await page.evaluate(() => window.__test.interact());
    assert(interacted5b, 'Test 5: second interact() returned false — fridge take ration failed');
    await sleep(200);

    const postRation = await page.evaluate(() => window.__test.getState());
    console.log(`  post-take — hunger=${postRation.hunger.toFixed(1)}`);
    const hungerDelta5 = postRation.hunger - preOpenFridge.hunger;
    console.log(`  hunger delta: ${hungerDelta5.toFixed(1)} (expected ~+30)`);
    assert(
      hungerDelta5 >= 25,
      `Hunger did not increase by ~30 after taking ration; delta=${hungerDelta5.toFixed(1)}`,
    );

    const stateAfterRation = await page.evaluate(() => window.__test.getFridgeState());
    assert(stateAfterRation.state === 'open', `Fridge should still be OPEN after taking ration; got ${stateAfterRation.state}`);
    assert(stateAfterRation.stock === 2, `Stock should be 2 after one ration taken; got ${stateAfterRation.stock}`);
    console.log(`  stock remaining: ${stateAfterRation.stock} ✓`);

    // Step 5c: drain remaining rations then close
    await page.evaluate(() => window.__test.teleport(1.8, 1.7, 0.5));
    await sleep(100);
    await page.evaluate(() => window.__test.interact()); // take ration 2
    await sleep(100);
    await page.evaluate(() => window.__test.teleport(1.8, 1.7, 0.5));
    await sleep(100);
    await page.evaluate(() => window.__test.interact()); // take ration 3
    await sleep(100);
    await page.evaluate(() => window.__test.teleport(1.8, 1.7, 0.5));
    await sleep(100);
    await page.evaluate(() => window.__test.interact()); // close
    await sleep(500); // let door tween close

    const stateAfterClose = await page.evaluate(() => window.__test.getFridgeState());
    console.log(`  after close — fridgeState=${stateAfterClose.state}`);
    assert(stateAfterClose.state === 'closed', `Fridge should be CLOSED after cycle; got ${stateAfterClose.state}`);

    console.log('[verify] Test 5 PASSED ✓ (fridge open→ration+30→close cycle verified)');
    console.log('[verify] All 5 functional tests PASSED ✓\n');

    // ── Test 6: Door auto-close regression (corridor-galley) ────────────────────
    // Open + arm the door via interact, walk far away (cockpit), then run the
    // auto-close check with the dwell-timer overridden and assert the door shut.
    console.log('[verify] Test 6: Door auto-close regression (corridor-galley)');
    const acDoorId = 'corridor-galley';

    // Ensure the door is OPEN and ARMED. Interacting arms auto-close; after the
    // prior tests the door is open, so toggle twice to land on open+armed.
    await page.evaluate(() => window.__test.teleport(0, 1.7, -6.0));
    await sleep(150);
    if (await page.evaluate((id) => window.__test.getDoorOpen(id), acDoorId)) {
      // It's open — close then reopen so it ends open AND armed.
      await page.evaluate(() => window.__test.interact()); // close + arm
      await sleep(600);
      await page.evaluate(() => window.__test.teleport(0, 1.7, -6.0));
      await sleep(150);
      await page.evaluate(() => window.__test.interact()); // reopen (still armed)
      await sleep(600);
    } else {
      await page.evaluate(() => window.__test.interact()); // open + arm
      await sleep(600);
    }
    const acOpenBefore = await page.evaluate((id) => window.__test.getDoorOpen(id), acDoorId);
    console.log(`  door open + armed before walk-away: isDoorOpen=${acOpenBefore}`);
    assert(acOpenBefore === true, 'Test 6: door should be OPEN (and armed) before auto-close check');

    // Walk far away (cockpit). Wait a couple frames so tickInteract threads the
    // new player position into doors.ts before we force the check.
    await page.evaluate(() => window.__test.teleport(0, 1.7, -22.5));
    await sleep(250);

    const acClosed = await page.evaluate(() => window.__test.forceDoorAutoCloseCheck());
    console.log(`  forceDoorAutoCloseCheck() closed: [${acClosed.join(', ')}]`);
    await sleep(600); // let the close animation run

    const acOpenAfter = await page.evaluate((id) => window.__test.getDoorOpen(id), acDoorId);
    console.log(`  after auto-close check: isDoorOpen=${acOpenAfter}`);
    assert(acClosed.includes(acDoorId), `Test 6: ${acDoorId} should have auto-closed; closed=[${acClosed.join(', ')}]`);
    assert(acOpenAfter === false, 'Test 6: door should be CLOSED after auto-close check');
    console.log('[verify] Test 6 PASSED ✓ (armed door auto-closed when player walked away)');

    // ── Test 7: Scan API smoke ──────────────────────────────────────────────────
    // getScan() returns null or a well-formed ScanData. With the deterministic
    // t=0 hero cast in view, it must be NON-null.
    console.log('[verify] Test 7: Scan API smoke');
    const scan = await page.evaluate(() => window.__test.getScan());
    console.log(`  getScan() → ${scan ? JSON.stringify(scan) : 'null'}`);
    assert(scan !== null, 'Test 7: getScan() should be NON-null with the deterministic t=0 hero in range');
    assert(typeof scan.name === 'string' && scan.name.length > 0, 'Test 7: scan.name must be a non-empty string');
    assert(typeof scan.class === 'string' && scan.class.length > 0, 'Test 7: scan.class must be a non-empty string');
    assert(typeof scan.composition === 'string' && scan.composition.length > 0, 'Test 7: scan.composition must be a non-empty string');
    assert(typeof scan.distanceKm === 'number' && scan.distanceKm > 0, 'Test 7: scan.distanceKm must be a positive number');
    console.log(`[verify] Test 7 PASSED ✓ (scan locked onto '${scan.name}' — ${scan.class}, ${scan.distanceKm} km)`);

    // ── Test 8: Quest progression 0→1→2→3 ───────────────────────────────────────
    // Drive the 3-step quest: reveal+read hidden panel (0→1), boost reactor
    // breaker (1→2), file the field report at the save terminal (2→3).
    console.log('[verify] Test 8: Quest progression 0→1→2→3');
    const q0 = (await page.evaluate(() => window.__test.getState())).questStep;
    console.log(`  quest step (start): ${q0}`);
    assert(q0 === 0, `Test 8: quest should start at 0; got ${q0}`);

    // Step 0→1: slide crate (reveal panel) + read panel. The crate sits at the
    // same XZ as the panel and always wins the proximity check headlessly, so
    // this step is driven via the dedicated hook (same pattern as the breaker).
    const q1 = await page.evaluate(() => window.__test.questRevealAndReadPanel());
    console.log(`  after panel read: ${q1}`);
    assert(q1 === 1, `Test 8: quest should be 1 after reading panel; got ${q1}`);

    // Step 1→2: breaker [2] Boost Reactor (overlay + Digit2 path; headless hook).
    const q2 = await page.evaluate(() => window.__test.questAdvanceViaBreaker());
    console.log(`  after breaker boost: ${q2}`);
    assert(q2 === 2, `Test 8: quest should be 2 after breaker boost; got ${q2}`);

    // Step 2→3: file report at the save terminal (world -1.44,1.55,-16) via a
    // real proximity interact — the terminal is alone within range here.
    await page.evaluate(() => window.__test.teleport(-1.44, 1.7, -16));
    await sleep(200);
    const savedInteract = await page.evaluate(() => window.__test.interact());
    assert(savedInteract, 'Test 8: interact() returned false near save terminal');
    await sleep(200);
    const q3 = (await page.evaluate(() => window.__test.getState())).questStep;
    console.log(`  after save terminal: ${q3}`);
    assert(q3 === 3, `Test 8: quest should be 3 (complete) after filing report; got ${q3}`);
    console.log('[verify] Test 8 PASSED ✓ (quest advanced 0→1→2→3)');

    console.log('[verify] All 8 functional tests PASSED ✓\n');

    // ── Test 9: Portal roundtrip via the dev-void proof world ───────────────────
    // ship → switchWorld('dev') → assert active + player near dev spawn →
    // return portal (real traversal + fade) → assert back on ship + spawn +
    // tests 1-8 ship state intact. (Stage D repoints this at 'verdant'.)
    console.log('[verify] Test 9: Portal roundtrip (dev-void)');
    const w0 = await page.evaluate(() => window.__test.getActiveWorld());
    assert(w0 === 'ship', `Test 9: expected 'ship' active at start; got ${w0}`);
    const quest9 = (await page.evaluate(() => window.__test.getState())).questStep;

    // Enter dev (headless synchronous switch → teleports to dev spawn).
    await page.evaluate(() => window.__test.switchWorld('dev'));
    await sleep(200);
    const w1 = await page.evaluate(() => window.__test.getActiveWorld());
    console.log(`  after switchWorld('dev'): active=${w1}`);
    assert(w1 === 'dev', `Test 9: getActiveWorld should be 'dev'; got ${w1}`);

    const dp = await page.evaluate(() => window.__test.getPlayerPos());
    const spawnDist = Math.hypot(dp.x - 0, dp.z - 8);
    console.log(`  dev player pos (${dp.x.toFixed(2)}, ${dp.y.toFixed(2)}, ${dp.z.toFixed(2)}) — dist to spawn ${spawnDist.toFixed(2)}`);
    assert(spawnDist < 2.0, `Test 9: player should spawn near the dev pad; dist=${spawnDist.toFixed(2)}`);

    // Return via the return portal interactable (real traversal → fade).
    await page.evaluate(() => window.__test.teleport(0, 1.7, -5.0));
    await sleep(150);
    const returned = await page.evaluate(() => window.__test.interact());
    assert(returned, 'Test 9: return-portal interact() returned false');
    console.log('[verify] Waiting for portal fade transition (1300ms)…');
    await sleep(1300);

    const w2 = await page.evaluate(() => window.__test.getActiveWorld());
    console.log(`  after return portal: active=${w2}`);
    assert(w2 === 'ship', `Test 9: should be back on 'ship'; got ${w2}`);

    const sp = await page.evaluate(() => window.__test.getPlayerPos());
    const shipDist = Math.hypot(sp.x - 0, sp.z - 16);
    console.log(`  ship player pos (${sp.x.toFixed(2)}, ${sp.y.toFixed(2)}, ${sp.z.toFixed(2)}) — dist to arrival ${shipDist.toFixed(2)}`);
    assert(shipDist < 3.0, `Test 9: player should arrive near the ship spawn; dist=${shipDist.toFixed(2)}`);

    const quest9b = (await page.evaluate(() => window.__test.getState())).questStep;
    assert(quest9b === quest9, `Test 9: ship quest state changed across roundtrip (${quest9} → ${quest9b})`);
    console.log('[verify] Test 9 PASSED ✓ (ship → dev → ship; spawn + return + state intact)');

    console.log('[verify] All 9 functional tests PASSED ✓\n');

    await browser.close();
    console.log('[verify] Done. ✓');
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error('[verify] FAILED:', err);
  server.kill();
  process.exit(1);
});
