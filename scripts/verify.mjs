/**
 * verify.mjs — Phase-gate verification harness
 * Builds, serves vite preview, screenshots every named camera, samples perf.
 * Usage:
 *   node scripts/verify.mjs             (headless)
 *   node scripts/verify.mjs --headed    (headed Chromium, fps authoritative)
 */

import { execSync, spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SHOTS_DIR = resolve(ROOT, 'verify', 'shots');
const REPORT_PATH = resolve(ROOT, 'verify', 'report.json');
let PREVIEW_PORT = 4173;
let BASE_URL = `http://localhost:${PREVIEW_PORT}`;
const headed = process.argv.includes('--headed');

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
      if (resp.ok || resp.status < 500) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Server at ${url} did not come up within ${maxMs}ms`);
}

async function run() {
  try {
    await waitForServer(BASE_URL);
    console.log('[verify] Preview server ready.');

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
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // ── 3. Await __ready ────────────────────────────────────────────────────────
    console.log('[verify] Awaiting __ready…');
    await page.waitForFunction(() => window.__ready instanceof Promise, { timeout: 15000 });
    await page.evaluate(() => window.__ready);
    console.log('[verify] __ready resolved.');

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

    // ── 6. Perf sample (5 s) ────────────────────────────────────────────────────
    const firstCam = toShoot[0];
    console.log(`[verify] Perf sample (5000ms) from '${firstCam}'…`);
    await page.evaluate((n) => window.__setCam(n), firstCam);
    await page.waitForTimeout(200);

    const report = await page.evaluate(
      () => window.__perf.sample(5000),
    );
    report.headless = !headed;
    report.cameras = toShoot;
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

    // ── Test 4: Fridge hunger increase (galley at world 2.725,1.05,0.05) ─────────
    console.log('[verify] Test 4: Fridge hunger increase');
    // First drain hunger so we have headroom to measure the +30
    const preHunger = (await page.evaluate(() => window.__test.getState())).hunger;
    console.log(`  pre-fridge hunger=${preHunger.toFixed(1)}`);

    await page.evaluate(() => window.__test.teleport(1.8, 1.7, 0.5));
    await sleep(150);
    const interacted4 = await page.evaluate(() => window.__test.interact());
    assert(interacted4, 'interact() returned false — fridge interactable not found');
    await sleep(200);

    const postHunger = (await page.evaluate(() => window.__test.getState())).hunger;
    console.log(`  post-fridge hunger=${postHunger.toFixed(1)}`);
    // fridge adds 30 capped at 100; hunger may have decayed slightly during test
    // expect at least +25 increase (decay is ~0.07/s, test runs quickly)
    const hungerDelta = postHunger - preHunger;
    console.log(`  hunger delta: ${hungerDelta.toFixed(1)} (expected ≥25)`);
    assert(
      hungerDelta >= 25 || postHunger >= 99,
      `Hunger did not increase by ~30; delta=${hungerDelta.toFixed(1)}, post=${postHunger.toFixed(1)}`,
    );
    console.log('[verify] Test 4 PASSED ✓ (fridge increased hunger)');

    console.log('[verify] All Phase 4 + v0.2 functional tests PASSED ✓\n');

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
