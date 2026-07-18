// spike-capture.mjs — Stage 0 SPIKE headed proof (v1.1 SOVEREIGN).
// Pattern-matched on hull-capture.mjs (own vite server, own headed browser,
// taskkill cleanup) + portal-ignite-capture.mjs (__ready wait via window.__test
// precedent, now window.__spike). Drives ?spike=planet through 5 reference
// states, screenshots each, then stress-tests the angular-size invariant with
// a 50-point log-spaced sweep. Prints `SPIKE-REPORT: {...}` and exits nonzero
// if maxAngErr does not stay below 1e-6.
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 5201;
const BASE = `http://127.0.0.1:${PORT}`;
const SHOTS_DIR = resolve(ROOT, 'verify', 'spike');

const server = spawn(
  'npx', ['vite', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
  { cwd: ROOT, shell: true, stdio: 'ignore' },
);

let up = false;
for (let i = 0; i < 60 && !up; i++) {
  try { up = (await fetch(`${BASE}/`)).ok; } catch { /* not yet */ }
  if (!up) await new Promise((r) => setTimeout(r, 500));
}
if (!up) { console.error('[spike-capture] dev server never came up'); process.exit(1); }

mkdirSync(SHOTS_DIR, { recursive: true });

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (msg) => { if (msg.type() === 'error') console.error('[page error]', msg.text()); });

let failed = false;
try {
  await page.goto(`${BASE}/?spike=planet&toasts=0`, { waitUntil: 'networkidle' });
  // waitForFunction(fn, arg, options) — arg must be explicit or a passed
  // options-shaped 2nd argument is silently swallowed as `arg`, and the
  // (unrelated) default 30s timeout applies instead.
  await page.waitForFunction(() => window.__ready instanceof Promise, undefined, { timeout: 15000 });
  await page.evaluate(() => window.__ready);
  await page.waitForTimeout(600);

  const hasSpike = await page.evaluate(() => typeof window.__spike !== 'undefined');
  if (!hasSpike) throw new Error('window.__spike not installed — ?spike=planet did not activate the spike module');

  // ── Phase A: reference-distance screenshots ────────────────────────────────
  const STEPS = [
    { label: '90000', dist: 90000, cam: 'spike-far' },
    { label: '9000', dist: 9000, cam: 'spike-mid' },
    { label: '2000', dist: 2000, cam: 'spike-mid' }, // just ABOVE the 1500 park boundary
    { label: '1400', dist: 1400, cam: 'spike-mid' }, // just BELOW it — checks the seam
  ];

  for (const step of STEPS) {
    await page.evaluate((d) => window.__spike.setDist(d), step.dist);
    await page.waitForTimeout(500);
    const ok = await page.evaluate((n) => window.__setCam(n), step.cam);
    if (!ok) console.warn(`[spike-capture] __setCam('${step.cam}') returned false`);
    await page.waitForTimeout(500);
    const shotPath = resolve(SHOTS_DIR, `${step.label}.png`);
    await page.screenshot({ path: shotPath });
    const r = await page.evaluate(() => window.__spike.getReport());
    console.log(
      `[spike-capture] ${step.label} -> ${shotPath} | angularDeg=${r.angularDeg.toFixed(2)} ` +
      `renderScale=${r.renderScale.toFixed(1)} renderDist=${r.renderDist.toFixed(1)} holdEngaged=${r.holdEngaged}`,
    );
  }

  // 'hold' — reset ABOVE the natural HOLD-trigger distance (~8800u for this
  // body) and let the scripted closure run for real. The '1400' step above
  // parked trueDist well inside the natural hold zone, which would make
  // resume() a no-op if we didn't reset first.
  console.log('[spike-capture] hold: resetting to 90000 and resuming the scripted approach…');
  await page.evaluate(() => window.__spike.setDist(90000));
  await page.evaluate(() => window.__spike.resume());
  await page.waitForFunction(() => window.__spike.getReport().holdEngaged === true, undefined, { timeout: 90000 });
  await page.waitForTimeout(500);
  const okHold = await page.evaluate((n) => window.__setCam(n), 'spike-hold');
  if (!okHold) console.warn(`[spike-capture] __setCam('spike-hold') returned false`);
  await page.waitForTimeout(500);
  const holdShot = resolve(SHOTS_DIR, 'hold.png');
  await page.screenshot({ path: holdShot });
  const holdReport = await page.evaluate(() => window.__spike.getReport());
  console.log(
    `[spike-capture] hold -> ${holdShot} | angularDeg=${holdReport.angularDeg.toFixed(2)} ` +
    `trueDist=${holdReport.trueDist.toFixed(1)} renderScale=${holdReport.renderScale.toFixed(1)}`,
  );

  // ── Phase B: full log-spaced sweep — stress the angular-size invariant ─────
  await page.evaluate(() => window.__spike.setDist(90000)); // pause + reset before the sweep
  const N = 50;
  const lo = Math.log(90000);
  const hi = Math.log(50);
  for (let i = 0; i < N; i++) {
    const d = Math.exp(lo + (hi - lo) * (i / (N - 1)));
    await page.evaluate((dd) => window.__spike.setDist(dd), d);
  }

  const finalReport = await page.evaluate(() => window.__spike.getReport());
  console.log('SPIKE-REPORT:', JSON.stringify(finalReport));

  if (!(finalReport.maxAngErr < 1e-6)) {
    console.error(`[spike-capture] FAILED: maxAngErr ${finalReport.maxAngErr} did not stay below 1e-6`);
    failed = true;
  } else {
    console.log('[spike-capture] PASSED — angular-size invariant held across the whole run.');
  }
} catch (err) {
  console.error('[spike-capture] FAILED:', err);
  failed = true;
} finally {
  await browser.close();
  try { execFileSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' }); } catch { /* already gone */ }
}

process.exit(failed ? 1 : 0);
