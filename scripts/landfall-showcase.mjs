/**
 * scripts/landfall-showcase.mjs — records the v1.2 LANDFALL showcase video:
 * HOLD → L → the full real-time descent cinematic → the walk-off reveal →
 * hero + vista angles → hatch re-board → HOLD out the cockpit canopy.
 * Saves ~60s webm to verify/capture/landfall-showcase.webm.
 *
 * capture.mjs pattern (video-recording context) driven by the state sequence
 * landfall-loop-capture.mjs proved out. Headed, real GPU, real-time descent.
 * NOTE: no AutomationControlled flag — it un-hides navigator.webdriver and
 * summons the click-to-start overlay over the whole recording.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, renameSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CAP_DIR = resolve(ROOT, 'verify', 'capture');
mkdirSync(CAP_DIR, { recursive: true });
const PORT = 5194;

const VITE_BIN = resolve(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
const server = spawn(process.execPath, [VITE_BIN, 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
  cwd: ROOT, stdio: 'inherit',
});

async function waitForServer(url, maxMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try { const r = await fetch(url); if (r.ok) return; } catch { /* not up */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('server never came up');
}

async function run() {
  try {
    await waitForServer(`http://127.0.0.1:${PORT}`);
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir: CAP_DIR, size: { width: 1280, height: 720 } },
    });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${PORT}/?toasts=0`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__ready instanceof Promise, { timeout: 20000 });
    await page.evaluate(() => window.__ready);
    await page.waitForTimeout(1200);

    // Open on the cockpit: the destination planet fills the canopy at HOLD.
    await page.evaluate(() => {
      window.__test.resetFlight();
      window.__test.engageApproach();
      window.__test.approachTickN(200, 50);
    });
    for (let i = 0; i < 40; i++) {
      const hold = await page.evaluate(() => {
        window.__test.approachTickN(200, 50);
        return window.__test.getApproachInfo()?.holdEngaged;
      });
      if (hold) break;
    }
    await page.evaluate(() => window.__setCam('cockpit'));
    await page.waitForTimeout(4000); // planet at HOLD through the canopy

    // LAND — let the whole descent play in real time (~18s + fades).
    const accepted = await page.evaluate(() => window.__test.engageLanding());
    console.log('[showcase] engageLanding →', accepted);
    if (!accepted) throw new Error('engageLanding declined');
    const t0 = Date.now();
    while (Date.now() - t0 < 30000) {
      const phase = await page.evaluate(() => window.__test.getLandingInfo()?.phase ?? 'NONE');
      if (phase === 'WALK') break;
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(4000); // the walk-off reveal, held

    // Hero + vista angles on the landed ship.
    await page.evaluate(() => window.__setCam('landfall'));
    await page.waitForTimeout(4000);
    await page.evaluate(() => window.__setCam('landfall-descent'));
    await page.waitForTimeout(4000);

    // Re-board: hatch → ship at HOLD, out the canopy again.
    await page.evaluate(() => {
      const ia = window.__test.getActiveInteractables().find((i) => i.id === 'landfall-ship-hatch');
      if (ia) window.__test.teleport(ia.x, ia.y, ia.z);
    });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.evaluate(() => window.__test.interact());
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.__setCam('cockpit'));
    await page.waitForTimeout(5000);

    await context.close(); // flushes video
    await browser.close();

    const files = readdirSync(CAP_DIR).filter((f) => f.endsWith('.webm') && f.startsWith('page'));
    if (files.length) {
      const newest = files
        .map((f) => ({ f, t: statSync(resolve(CAP_DIR, f)).mtimeMs }))
        .sort((a, b) => b.t - a.t)[0].f;
      renameSync(resolve(CAP_DIR, newest), resolve(CAP_DIR, 'landfall-showcase.webm'));
      const size = statSync(resolve(CAP_DIR, 'landfall-showcase.webm')).size;
      console.log(`[showcase] Saved verify/capture/landfall-showcase.webm (${(size / 1e6).toFixed(1)} MB)`);
    }
  } finally {
    server.kill();
  }
}

run().catch((err) => { console.error('[showcase] FAILED:', err); server.kill(); process.exit(1); });
