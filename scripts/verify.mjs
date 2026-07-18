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
// 127.0.0.1 explicitly (not 'localhost') end to end — the free-port probe,
// the preview server's own bind, and every fetch/navigation all need to agree
// on IPv4, or a parallel-repo lane bound on ::1 can pass the probe as "free"
// while still serving stale content on the same port number.
const PREVIEW_HOST = '127.0.0.1';
let PREVIEW_PORT = 4173;
let BASE_URL = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;
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
    s.listen(start, PREVIEW_HOST, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
    s.on('error', () => resolve(findFreePort(start + 1)));
  });
}

PREVIEW_PORT = await findFreePort(4173);
BASE_URL = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;

console.log(`[verify] Starting preview server on ${PREVIEW_HOST}:${PREVIEW_PORT}…`);
// Spawn vite directly (no shell): on Windows, shell:true makes server.kill()
// kill the cmd wrapper and orphan the real server, which then serves stale
// builds to the next verify run. --host pins the bind to IPv4 explicitly —
// vite's default 'localhost' host can resolve/bind ::1, which the IPv4-only
// port probe above can't see (a stale IPv4 server on the same port number
// would otherwise look "free" and get silently verified instead).
const VITE_BIN = resolve(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
const server = spawn(
  process.execPath,
  [VITE_BIN, 'preview', '--host', PREVIEW_HOST, '--port', String(PREVIEW_PORT), '--strictPort'],
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
    // Wait for one ACTUALLY-RENDERED frame (double rAF, resolved from inside
    // the page) rather than a fixed real-time sleep. At ~1fps SwiftShader a
    // 150ms wait doesn't guarantee the game's own rAF loop has ticked even
    // once with the new teleported position, so tickInteract() (and anything
    // gated on it, like a fresh raycast/proximity target) can still be
    // reading stale state when the very next line calls interact(). Always
    // call this right after __test.teleport(), before interacting.
    const waitFrame = () => page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(undefined)))),
    );

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

    // Lane D defensive reset: the perf-probe above __setCam()s through every
    // registered camera (including 'chase') and picks the worst-fps one for
    // the 5s sample — if that happens to be 'chase', the flight-view shim is
    // still parked in 'exterior' here, and tickChaseCam() would keep
    // hijacking camera.position every ship-world frame, corrupting every
    // teleport()-then-interact() call below. One frame is enough for
    // chaseCam's own next-tick sync to restore fov/up/layers.
    await page.evaluate(() => window.__test.setFlightView('interior'));
    await waitFrame();

    // ── Test 1: Sleep (bunk-a in quarters-a) ───────────────────────────────────
    // quarters-a world offset: (-4, 0, -16).
    // Bunk world centre: (-4, 0.84, -17.98). Teleport player adjacent, within radius.
    console.log('[verify] Test 1: Sleep (bunk-a)');
    const preState = await page.evaluate(() => window.__test.getState());
    console.log(`  pre-sleep  — clock=${preState.clock.toFixed(1)} energy=${preState.energy.toFixed(1)}`);

    // Drain energy below 100 so we can verify it was restored
    await page.evaluate(() => window.__test.teleport(-4, 1.7, -16.5));
    await waitFrame();
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
    await waitFrame();
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
    await waitFrame();
    await sleep(150);

    const interacted3a = await page.evaluate(() => window.__test.interact());
    assert(interacted3a, 'interact() returned false — door interactable not found');
    await sleep(600); // let animation run

    const afterClose = await page.evaluate((id) => window.__test.getDoorOpen(id), doorId);
    console.log(`  after close interact: isDoorOpen=${afterClose}`);
    assert(afterClose === false, `Door should be CLOSED after first interact; got open`);

    // Toggle back open
    await page.evaluate(() => window.__test.teleport(0, 1.7, -6.0));
    await waitFrame();
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
    await waitFrame();
    await sleep(150);
    const opened4 = await page.evaluate(() => window.__test.interact()); // opens the door
    assert(opened4, 'interact() returned false — fridge interactable not found');
    await sleep(500); // door tween
    await page.evaluate(() => window.__test.teleport(1.8, 1.7, 0.5));
    await waitFrame();
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
    await waitFrame();
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
    await waitFrame();
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
    await waitFrame();
    await sleep(100);
    await page.evaluate(() => window.__test.interact()); // take ration 2
    await sleep(100);
    await page.evaluate(() => window.__test.teleport(1.8, 1.7, 0.5));
    await waitFrame();
    await sleep(100);
    await page.evaluate(() => window.__test.interact()); // take ration 3
    await sleep(100);
    await page.evaluate(() => window.__test.teleport(1.8, 1.7, 0.5));
    await waitFrame();
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
    await waitFrame();
    await sleep(150);
    if (await page.evaluate((id) => window.__test.getDoorOpen(id), acDoorId)) {
      // It's open — close then reopen so it ends open AND armed.
      await page.evaluate(() => window.__test.interact()); // close + arm
      await sleep(600);
      await page.evaluate(() => window.__test.teleport(0, 1.7, -6.0));
      await waitFrame();
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
    await waitFrame();
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
    await waitFrame();
    await sleep(200);
    const savedInteract = await page.evaluate(() => window.__test.interact());
    assert(savedInteract, 'Test 8: interact() returned false near save terminal');
    await sleep(200);
    const q3 = (await page.evaluate(() => window.__test.getState())).questStep;
    console.log(`  after save terminal: ${q3}`);
    assert(q3 === 3, `Test 8: quest should be 3 (complete) after filing report; got ${q3}`);
    console.log('[verify] Test 8 PASSED ✓ (quest advanced 0→1→2→3)');

    console.log('[verify] All 8 functional tests PASSED ✓\n');

    // ── Test 9: Portal roundtrip via VERDANT ────────────────────────────────────
    // ship → annex → real gate interact (traversal + fade) → assert active
    // 'verdant' + player near its spawn → real return-portal interact → assert
    // back on 'ship' + player near the annex arrival pad + tests 1-8 state
    // intact. devVoid stays registered (now the creature bench, unreachable in
    // normal play) but is no longer what this roundtrip exercises.
    console.log('[verify] Test 9: Portal roundtrip (verdant)');
    const w0 = await page.evaluate(() => window.__test.getActiveWorld());
    assert(w0 === 'ship', `Test 9: expected 'ship' active at start; got ${w0}`);
    const quest9 = (await page.evaluate(() => window.__test.getState())).questStep;

    // doors-OPEN invariant covers the new cargo→annex door too.
    const annexDoorOpen = await page.evaluate(() => window.__test.getDoorOpen('cargo-annex'));
    assert(annexDoorOpen === true, `Test 9: 'cargo-annex' door should start OPEN; got ${annexDoorOpen}`);

    // Walk into the annex, then query the LIVE world position of the verdant
    // gate's portal interactable (queried, never hardcoded — its position is
    // synced every frame off the actual mesh, per portalSurface.ts).
    await page.evaluate(() => window.__test.teleport(0, 1.7, 21.5));
    await waitFrame();
    const annexIas = await page.evaluate(() => window.__test.getActiveInteractables());
    const verdantGate = annexIas.find((ia) => ia.id === 'portal-verdant');
    assert(verdantGate, "Test 9: 'portal-verdant' interactable not found in the annex");

    await page.evaluate((p) => window.__test.teleport(p.x, p.y, p.z), verdantGate);
    await waitFrame();
    const entered = await page.evaluate(() => window.__test.interact());
    assert(entered, 'Test 9: verdant-gate interact() returned false');
    console.log('[verify] Waiting for portal fade transition (1300ms)…');
    await sleep(1300);

    const w1 = await page.evaluate(() => window.__test.getActiveWorld());
    console.log(`  after entering the verdant gate: active=${w1}`);
    assert(w1 === 'verdant', `Test 9: getActiveWorld should be 'verdant'; got ${w1}`);

    const dp = await page.evaluate(() => window.__test.getPlayerPos());
    const spawnDist = Math.hypot(dp.x - 0, dp.z - 26);
    console.log(`  verdant player pos (${dp.x.toFixed(2)}, ${dp.y.toFixed(2)}, ${dp.z.toFixed(2)}) — dist to spawn ${spawnDist.toFixed(2)}`);
    assert(spawnDist < 2.0, `Test 9: player should spawn near the verdant pad; dist=${spawnDist.toFixed(2)}`);

    // Return via verdant's OWN return-portal interactable (real traversal → fade).
    const verdantIas = await page.evaluate(() => window.__test.getActiveInteractables());
    const returnPortal = verdantIas.find((ia) => ia.id === 'portal-ship');
    assert(returnPortal, "Test 9: 'portal-ship' return interactable not found in verdant");
    await page.evaluate((p) => window.__test.teleport(p.x, p.y, p.z), returnPortal);
    await waitFrame();
    const returned = await page.evaluate(() => window.__test.interact());
    assert(returned, 'Test 9: return-portal interact() returned false');
    console.log('[verify] Waiting for portal fade transition (1300ms)…');
    await sleep(1300);

    const w2 = await page.evaluate(() => window.__test.getActiveWorld());
    console.log(`  after return portal: active=${w2}`);
    assert(w2 === 'ship', `Test 9: should be back on 'ship'; got ${w2}`);

    const sp = await page.evaluate(() => window.__test.getPlayerPos());
    const shipDist = Math.hypot(sp.x - 0, sp.z - 18.75);
    console.log(`  ship player pos (${sp.x.toFixed(2)}, ${sp.y.toFixed(2)}, ${sp.z.toFixed(2)}) — dist to annex arrival pad (0, 18.75) ${shipDist.toFixed(2)}`);
    assert(shipDist < 3.0, `Test 9: player should arrive within 3.0 of the annex arrival pad; dist=${shipDist.toFixed(2)}`);

    const quest9b = (await page.evaluate(() => window.__test.getState())).questStep;
    assert(quest9b === quest9, `Test 9: ship quest state changed across roundtrip (${quest9} → ${quest9b})`);
    console.log('[verify] Test 9 PASSED ✓ (ship → verdant → ship; spawn + return + state intact)');

    console.log('[verify] All 9 functional tests PASSED ✓\n');

    // ── Test 10: Codex / relic / save-load roundtrip ────────────────────────────
    // Scan one verdant creature (dupe-guarded) → collect the verdant relic →
    // reload the ACTUAL page (fresh JS state, same localStorage) → assert both
    // survived AND that the socket lights + relic stop being offered purely
    // from boot-time state (no live pickup event fires on a fresh page load).
    console.log('[verify] Test 10: Codex / relic / save-load roundtrip');

    const codexBefore = await page.evaluate(() => window.__test.getCodex());
    assert(codexBefore.scans.length === 0, `Test 10: expected a clean codex before this test; got ${JSON.stringify(codexBefore.scans)}`);
    assert(codexBefore.relics.length === 0, `Test 10: expected no relics before this test; got ${JSON.stringify(codexBefore.relics)}`);

    await page.evaluate(() => window.__test.switchWorld('verdant'));
    await waitFrame();

    // Scan a creature. Position is queried live (creatures wander) rather than
    // hardcoded — any verdant-grazer/-skitterer instance works.
    const t10Ias = await page.evaluate(() => window.__test.getActiveInteractables());
    const t10Creature = t10Ias.find((ia) => ia.id.startsWith('verdant-grazer') || ia.id.startsWith('verdant-skitterer'));
    assert(t10Creature, 'Test 10: no verdant creature interactable found');
    const t10SpeciesId = t10Creature.id.replace(/-\d+$/, '');

    await page.evaluate((p) => window.__test.teleport(p.x, p.y, p.z), t10Creature);
    await waitFrame();
    const t10Scanned = await page.evaluate(() => window.__test.interact());
    assert(t10Scanned, 'Test 10: creature interact() returned false');

    const codexAfterScan = await page.evaluate(() => window.__test.getCodex());
    assert(codexAfterScan.scans.includes(t10SpeciesId), `Test 10: codex should include '${t10SpeciesId}'; got ${JSON.stringify(codexAfterScan.scans)}`);
    console.log(`  scanned '${t10SpeciesId}' — codex now [${codexAfterScan.scans.join(', ')}]`);

    // Dupe scan — re-locate the (moved) creature and interact again; codex
    // must NOT double-count.
    const t10IasAgain = await page.evaluate(() => window.__test.getActiveInteractables());
    const t10CreatureAgain = t10IasAgain.find((ia) => ia.id.startsWith(t10SpeciesId));
    assert(t10CreatureAgain, `Test 10: '${t10SpeciesId}' instance vanished before the dupe-scan check`);
    await page.evaluate((p) => window.__test.teleport(p.x, p.y, p.z), t10CreatureAgain);
    await waitFrame();
    const t10DupeScanned = await page.evaluate(() => window.__test.interact());
    assert(t10DupeScanned, 'Test 10: dupe creature interact() returned false');
    const codexAfterDupe = await page.evaluate(() => window.__test.getCodex());
    assert(codexAfterDupe.scans.length === codexAfterScan.scans.length, `Test 10: dupe scan changed codex length (${codexAfterScan.scans.length} → ${codexAfterDupe.scans.length})`);
    console.log('[verify]   dupe scan did not double-count ✓');

    // Collect the verdant relic.
    const t10IasForRelic = await page.evaluate(() => window.__test.getActiveInteractables());
    const t10Relic = t10IasForRelic.find((ia) => ia.id === 'verdant-relic');
    assert(t10Relic, "Test 10: 'verdant-relic' interactable not found (already collected earlier in this run?)");
    await page.evaluate((p) => window.__test.teleport(p.x, p.y, p.z), t10Relic);
    await waitFrame();
    const t10Collected = await page.evaluate(() => window.__test.interact());
    assert(t10Collected, 'Test 10: relic interact() returned false');
    const codexAfterRelic = await page.evaluate(() => window.__test.getCodex());
    assert(codexAfterRelic.relics.includes('verdant'), `Test 10: relics should include 'verdant'; got ${JSON.stringify(codexAfterRelic.relics)}`);
    console.log(`  collected the verdant relic — relics now [${codexAfterRelic.relics.join(', ')}]`);

    await page.evaluate(() => window.__test.switchWorld('ship'));
    await waitFrame();

    // ── Reload the actual page — fresh JS state, same localStorage. Proves
    // the roundtrip through REAL persistence, not just leftover memory. ─────
    console.log('[verify] Reloading page to exercise the loadState() roundtrip…');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__ready instanceof Promise, { timeout: 15000 });
    await page.evaluate(() => window.__ready);
    await page.waitForTimeout(600);

    const codexAfterReload = await page.evaluate(() => window.__test.getCodex());
    assert(codexAfterReload.scans.includes(t10SpeciesId), `Test 10: codex scan lost across reload; got ${JSON.stringify(codexAfterReload.scans)}`);
    assert(codexAfterReload.relics.includes('verdant'), `Test 10: relic lost across reload; got ${JSON.stringify(codexAfterReload.relics)}`);
    console.log('[verify]   codex + relic survived saveState()/loadState() ✓');

    // Relic persistence: must not be re-offered after the reload.
    await page.evaluate(() => window.__test.switchWorld('verdant'));
    await waitFrame();
    const t10IasPostReload = await page.evaluate(() => window.__test.getActiveInteractables());
    assert(!t10IasPostReload.some((ia) => ia.id === 'verdant-relic'), 'Test 10: collected relic was re-offered after reload');
    console.log('[verify]   collected relic not re-offered after reload ✓');

    // Socket lighting: state-driven, not event-driven — this is a FRESH page
    // load, so no pickup event could possibly have fired this session.
    await page.evaluate(() => window.__test.switchWorld('ship'));
    await waitFrame();
    await page.evaluate((n) => window.__setCam(n), 'portal-room');
    await waitFrame();
    await sleep(150);
    const socketColor = await page.evaluate(() => window.__test.getRelicSocketColor('verdant'));
    assert(socketColor, "Test 10: 'relic-socket-verdant' mesh not found");
    console.log(`  verdant relic socket color after reload: ${JSON.stringify(socketColor)}`);
    assert(socketColor.g > 1.2, `Test 10: verdant relic socket should read LIT (g>1.2, biome-tinted) after reload; got g=${socketColor.g.toFixed(3)}`);

    console.log('[verify] Test 10 PASSED ✓ (codex + relic + save/load + socket-lit-on-reload)');

    console.log('[verify] All 10 functional tests PASSED ✓\n');

    // ── Test 11: Flight model (v1.1 SOVEREIGN Stage 1 Lane A) ────────────────
    // Headless has no pointer lock, so the model is driven directly via
    // setFlightInput + flightTickN (fixed dt, synchronous — deterministic,
    // no real-RAF waits needed). tickFlight only runs while 'ship' is active
    // (main.ts gates it on activeId === 'ship', same as the director), so
    // pin the world first.
    console.log('[verify] Test 11: Flight model');
    await page.evaluate(() => window.__test.switchWorld('ship'));
    await waitFrame();

    const getFlightPlain = () => page.evaluate(() => {
      const f = window.__test.getFlight();
      return {
        mode: f.mode,
        speed: f.speed,
        throttle: f.throttle,
        headingDeg: f.headingDeg,
        pitchDeg: f.pitchDeg,
        bankDeg: f.bankDeg,
        qLen: f.attitude.length(),
        flowW: { x: f.flowW.x, y: f.flowW.y, z: f.flowW.z },
      };
    });

    // Boot state — no input has touched flight state yet (Tests 1-10 never
    // call setFlightInput; tickFlight ran with all-zero input the whole time,
    // which is a fixed point of the model: speed/attitude never drift).
    const boot = await getFlightPlain();
    console.log(`  boot — mode=${boot.mode} speed=${boot.speed.toFixed(3)} flowW=(${boot.flowW.x.toFixed(2)},${boot.flowW.y.toFixed(2)},${boot.flowW.z.toFixed(2)}) |q|=${boot.qLen.toFixed(6)}`);
    assert(boot.mode === 'CRUISE', `Test 11: boot mode should be CRUISE; got ${boot.mode}`);
    assert(Math.abs(boot.speed - 14) < 0.05, `Test 11: boot speed should be ~14 (throttle 0.35 × MAX_SPEED_CRUISE 40); got ${boot.speed}`);
    assert(
      Math.abs(boot.flowW.x) < 0.01 && Math.abs(boot.flowW.y) < 0.01 && Math.abs(boot.flowW.z - 14) < 0.1,
      `Test 11: boot flowW should be ~(0,0,14); got (${boot.flowW.x},${boot.flowW.y},${boot.flowW.z})`,
    );
    assert(Math.abs(boot.qLen - 1) < 1e-6, `Test 11: boot attitude should be unit-length; got |q|=${boot.qLen}`);

    // Switch OFF 'ship' for the rest of this test. flightTickN() bypasses the
    // world gate entirely (it calls tickFlight() directly, testApi.ts), but
    // the REAL animate() loop in main.ts does NOT — it only calls tickFlight()
    // while activeId === 'ship'. Leaving 'ship' active here would let that
    // live rAF loop tick the model with uncontrolled wall-clock dt IN
    // ADDITION to every flightTickN() call below (headless SwiftShader frames
    // arrive every ~400-500ms per the perf probe above, and several land
    // during the page.evaluate() round trips this test makes) — silently
    // breaking the "deterministic, no real-RAF" guarantee flightTickN exists
    // to provide. Parking on 'verdant' freezes that live path completely.
    await page.evaluate(() => window.__test.switchWorld('verdant'));
    await waitFrame();

    // Auto-bank: yaw=1, short burst (~0.5s). Checked EARLY and separately from
    // the heading assertion below on purpose — verified empirically against
    // this exact tuning that sustained yaw while significantly auto-banked
    // couples into real 3-axis attitude drift (the nose comes off the
    // horizontal plane, which eventually swings bankDeg back through zero;
    // this is genuine rotation coupling from local-axis quaternion
    // integration, not a bug — see flightModel.ts step 3). A 30-tick window
    // sits comfortably before that drift, while still being well past
    // INPUT_SMOOTH_LAMBDA/AUTO_BANK_LAMBDA's ~0.15-0.2s settle time.
    await page.evaluate(() => window.__test.setFlightInput({ yaw: 1 }));
    await page.evaluate(() => window.__test.flightTickN(30, 16.6));
    const afterBankBurst = await getFlightPlain();
    console.log(`  after 30 ticks yaw=1 — heading=${afterBankBurst.headingDeg.toFixed(2)} bank=${afterBankBurst.bankDeg.toFixed(2)}`);
    assert(afterBankBurst.bankDeg < -15, `Test 11: auto-bank should read clearly negative for yaw=1; got bank=${afterBankBurst.bankDeg}`);

    // Continue yaw=1 to 120 ticks total (~2s) — heading swings substantially.
    // Sign convention (flightState.ts header): positive yaw input sweeps the
    // nose toward -X, i.e. headingDeg trends negative and wraps into the
    // 150-280° band well before 120 ticks at MAX_YAW_RATE.
    await page.evaluate(() => window.__test.flightTickN(90, 16.6));
    const afterYawFull = await getFlightPlain();
    console.log(`  after 120 ticks yaw=1 — heading=${afterYawFull.headingDeg.toFixed(2)} bank=${afterYawFull.bankDeg.toFixed(2)} |q|=${afterYawFull.qLen.toFixed(6)}`);
    assert(
      afterYawFull.headingDeg > 150 && afterYawFull.headingDeg < 280,
      `Test 11: heading should have swung substantially in the documented (yaw=1) direction; got ${afterYawFull.headingDeg}`,
    );
    assert(Math.abs(afterYawFull.qLen - 1) < 1e-6, `Test 11: attitude should stay unit-length under sustained rotation; got |q|=${afterYawFull.qLen}`);

    // Zero input → angularVel damps toward 0. FlightSnapshot has no angularVel
    // field (frozen §4 interface) — use heading/bank STABILITY as the
    // observable proxy: once truly damped to ~0, further ticks barely move them.
    await page.evaluate(() => window.__test.setFlightInput({ yaw: 0 }));
    await page.evaluate(() => window.__test.flightTickN(120, 16.6));
    const settled = await getFlightPlain();
    await page.evaluate(() => window.__test.flightTickN(10, 16.6));
    const settledMore = await getFlightPlain();
    const headingDrift = Math.abs(settledMore.headingDeg - settled.headingDeg);
    const bankDrift = Math.abs(settledMore.bankDeg - settled.bankDeg);
    console.log(`  post-zero settle — heading drift/10 ticks=${headingDrift.toFixed(4)}° bank drift=${bankDrift.toFixed(4)}°`);
    assert(
      headingDrift < 0.05 && bankDrift < 0.05,
      `Test 11: angularVel should have damped to ~0 (heading/bank should have stopped moving); drift=${headingDrift}/${bankDrift}`,
    );

    // Throttle: bump throttleDelta, tick, confirm speed rises monotonically
    // toward the (now higher) target with no overshoot > 1%. An exponential
    // damp toward a non-decreasing target is monotonic and bounded by
    // construction — this asserts it holds through the real tick sequence.
    await page.evaluate(() => window.__test.setFlightInput({ throttleDelta: 1 }));
    let prevSpeed = (await getFlightPlain()).speed;
    let monotonic = true;
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => window.__test.flightTickN(10, 16.6));
      const s = (await getFlightPlain()).speed;
      if (s < prevSpeed - 1e-6) monotonic = false;
      prevSpeed = s;
    }
    await page.evaluate(() => window.__test.setFlightInput({ throttleDelta: 0 }));
    for (let i = 0; i < 8; i++) {
      await page.evaluate(() => window.__test.flightTickN(15, 16.6));
      const s = (await getFlightPlain()).speed;
      if (s < prevSpeed - 1e-6) monotonic = false;
      prevSpeed = s;
    }
    const afterThrottle = await getFlightPlain();
    const speedTarget = afterThrottle.throttle * 40; // MAX_SPEED_CRUISE (flightTuning.ts)
    console.log(`  throttle after ramp+hold=${afterThrottle.throttle.toFixed(4)} speed=${afterThrottle.speed.toFixed(3)} target=${speedTarget.toFixed(3)} monotonic=${monotonic}`);
    assert(monotonic, 'Test 11: speed should rise monotonically toward the throttle target with no dips');
    assert(afterThrottle.speed <= speedTarget * 1.01, `Test 11: speed should not overshoot target by >1%; speed=${afterThrottle.speed} target=${speedTarget}`);
    assert(afterThrottle.speed > 14, `Test 11: speed should have risen above the boot cruise speed; got ${afterThrottle.speed}`);

    // Restore 'ship' so the run ends on the world every prior test expects.
    await page.evaluate(() => window.__test.switchWorld('ship'));
    await waitFrame();

    console.log('[verify] Test 11 PASSED ✓ (boot state, auto-bank, heading sweep, angularVel damp, monotonic speed, unit attitude)\n');

    console.log('[verify] All 11 functional tests PASSED ✓\n');

    // ── Test 12: Universe coherence (rig rotation + flow-generalized despawn) ──
    // v1.1 SOVEREIGN Stage 1 Lane C — universeRig's group.quaternion is set to
    // the ship attitude's inverse each frame (design §2); a 180° yaw must flip
    // world-fixed landmarks (the hero sun) to the opposite hemisphere, and the
    // rolling cast must stay well-formed under fast off-nominal flow. Driven
    // entirely via the LANE-C flightShim test hooks (shimYaw180 / shimSetFlow)
    // — Lane A's real flightState replaces the shim at merge; these hooks
    // move with it. Numbered 12 per the design doc (T11 is Lane A's flight-
    // model test, appended separately).
    console.log('[verify] Test 12: Universe coherence (rig rotation + flow)');

    await page.evaluate(() => window.__test.switchWorld('ship'));
    await sleep(150);

    const info0 = await page.evaluate(() => window.__test.getUniverseInfo());
    console.log(`  boot — bodyCount=${info0.bodyCount} flowDir=${JSON.stringify(info0.flowDir)} sunBearing=${JSON.stringify(info0.sunBearing)}`);
    assert(info0.bodyCount > 0, 'Test 12: expected at least one live body (signature cast) before the rotation check');
    assert(
      info0.sunBearing.some((v) => Math.abs(v) > 1e-6),
      'Test 12: sunBearing should be non-zero (hero-sun object not found, or sitting at the origin?)',
    );

    // (a) 180° yaw must flip the sun's rendered bearing to the opposite
    // hemisphere — proof the rig rotation actually reaches world-fixed content.
    await page.evaluate(() => window.__test.shimYaw180());
    await waitFrame();

    const infoYawed = await page.evaluate(() => window.__test.getUniverseInfo());
    console.log(`  post-yaw — sunBearing=${JSON.stringify(infoYawed.sunBearing)}`);
    const bearingDot =
      info0.sunBearing[0] * infoYawed.sunBearing[0] +
      info0.sunBearing[1] * infoYawed.sunBearing[1] +
      info0.sunBearing[2] * infoYawed.sunBearing[2];
    console.log(`  bearing dot product: ${bearingDot.toFixed(4)} (expect < 0 — opposite hemisphere)`);
    assert(bearingDot < 0, `Test 12: sun bearing did not flip to the opposite hemisphere after a 180° yaw; dot=${bearingDot.toFixed(4)}`);

    // getScan() must stay well-formed (or null) through the rotation — no throw.
    const scanAfterYaw = await page.evaluate(() => window.__test.getScan());
    console.log(`  getScan() after yaw → ${scanAfterYaw ? JSON.stringify(scanAfterYaw) : 'null'}`);
    assert(
      scanAfterYaw === null ||
        (typeof scanAfterYaw.name === 'string' && typeof scanAfterYaw.distanceKm === 'number'),
      'Test 12: getScan() returned a malformed object after the yaw',
    );

    // (b) Elevated flow (0,0,60), identity attitude restored: over 10 real
    // seconds (dt is real-elapsed-time-derived, so "simulated" here means
    // wall-clock) the HERO_CAP invariant must hold and the scan API must keep
    // returning well-formed data — proof the flow-generalized despawn axis
    // doesn't explode the cast under off-nominal speed.
    await page.evaluate(() => window.__test.shimSetFlow(0, 0, 60));
    await waitFrame();
    console.log('[verify]   driving 10s of elevated flow (0,0,60)…');
    await sleep(10000);

    const infoFast = await page.evaluate(() => window.__test.getUniverseInfo());
    console.log(`  post-fast-flight — bodyCount=${infoFast.bodyCount}`);
    assert(infoFast.bodyCount <= 7, `Test 12: bodyCount exceeded the HERO_CAP under fast flow; got ${infoFast.bodyCount}`);

    const scanAfterFast = await page.evaluate(() => window.__test.getScan());
    console.log(`  getScan() after fast flight → ${scanAfterFast ? JSON.stringify(scanAfterFast) : 'null'}`);
    assert(
      scanAfterFast === null ||
        (typeof scanAfterFast.name === 'string' && typeof scanAfterFast.distanceKm === 'number' && scanAfterFast.distanceKm > 0),
      'Test 12: getScan() returned a malformed object after fast flight',
    );

    // Restore boot-equivalent shim state for any downstream consumers.
    await page.evaluate(() => window.__test.shimSetFlow(0, 0, 14));
    await waitFrame();

    console.log('[verify] Test 12 PASSED ✓ (rig rotation flips world-fixed bearing; cast stays well-formed under fast flow)');

    console.log('[verify] All 12 functional tests PASSED ✓\n');

    // ── Test 13b: Exterior hull + chase camera view toggle (Lane D) ────────────
    // __setCam('chase') flips the flight-view shim to 'exterior' via the camera
    // registry (teleportToCamera → shim setView + snapChaseConverged, see
    // core/cameras.ts) — the full-scale hull (layer 1) becomes visible to the
    // (now layer 0+1) camera. __setCam('cockpit') flips back: view resets to
    // 'interior' and the camera drops layer 1 again (hull invisible from
    // inside, per design D4). getHullInfo().layer1 reads the ACTIVE CAMERA's
    // current layer-1 state (not the hull mesh's, which never changes), so the
    // same hook proves the toggle both ways. chase.png itself is already
    // captured for free by the generic per-camera screenshot sweep above.
    console.log('[verify] Test 13b: Exterior hull + chase cam view toggle');

    await page.evaluate((n) => window.__setCam(n), 'chase');
    await waitFrame();
    await sleep(200);

    const chaseHull = await page.evaluate(() => window.__test.getHullInfo());
    console.log(`  chase — present=${chaseHull.present} layer1=${chaseHull.layer1} tris=${chaseHull.tris}`);
    assert(chaseHull.present, "Test 13b: 'exterior-hull' mesh not found in the scene");
    assert(chaseHull.layer1 === true, `Test 13b: camera should see layer 1 in chase view; got ${chaseHull.layer1}`);
    assert(chaseHull.tris > 0, `Test 13b: exterior hull should have triangles; got ${chaseHull.tris}`);

    await page.evaluate((n) => window.__setCam(n), 'cockpit');
    await waitFrame();
    await sleep(200);

    const cockpitHull = await page.evaluate(() => window.__test.getHullInfo());
    console.log(`  cockpit — layer1=${cockpitHull.layer1}`);
    assert(cockpitHull.layer1 === false, `Test 13b: camera should NOT see layer 1 back in interior view; got ${cockpitHull.layer1}`);

    console.log('[verify] Test 13b PASSED ✓ (chase view shows hull on layer 1; cockpit view hides it)');

    console.log('[verify] All 13 functional tests PASSED ✓\n');

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
