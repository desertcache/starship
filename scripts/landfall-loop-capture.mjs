/**
 * TEMP orchestrator gate — drives the full HOLD → LAND → descent → walk →
 * re-board → HOLD loop with real frames, screenshotting each descent phase.
 * portal-ignite-capture.mjs pattern. DELETE after the gate.
 */
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const VITE_BIN = resolve(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
const PORT = 5195;

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
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto(`http://127.0.0.1:${PORT}/?toasts=0`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__ready instanceof Promise, { timeout: 20000 });
    await page.evaluate(() => window.__ready);
    await page.waitForTimeout(800);

    const shot = (name) => page.screenshot({ path: resolve(ROOT, 'verify', 'shots', `loop-${name}.png`) });
    const info = () => page.evaluate(() => ({
      world: window.__test.getActiveWorld(),
      mode: window.__test.getFlight().mode,
      landing: window.__test.getLandingInfo ? window.__test.getLandingInfo() : 'NO HOOK',
    }));

    // 1. Fast-forward to HOLD (Test 14 recipe).
    await page.evaluate(() => { window.__test.resetFlight(); window.__test.engageApproach(); });
    await page.evaluate(() => window.__test.approachTickN(200, 50));
    let holdInfo = null;
    for (let i = 0; i < 40; i++) {
      holdInfo = await page.evaluate(() => {
        window.__test.approachTickN(200, 50);
        return window.__test.getApproachInfo();
      });
      if (holdInfo && holdInfo.holdEngaged) break;
    }
    console.log('[loop] HOLD:', JSON.stringify(holdInfo && { holdEngaged: holdInfo.holdEngaged, trueDist: holdInfo.trueDist }));

    // 2. LAND.
    const accepted = await page.evaluate(() => window.__test.engageLanding());
    console.log('[loop] engageLanding →', accepted);
    if (!accepted) throw new Error('engageLanding declined at HOLD');
    await page.waitForTimeout(900); // fade
    console.log('[loop] post-land:', JSON.stringify(await info()));

    // 3. Real-frame descent, screenshot per phase transition + mid-phase.
    const seen = new Set();
    const t0 = Date.now();
    while (Date.now() - t0 < 30000) {
      const st = await info();
      const phase = st.landing && st.landing.phase;
      if (phase && !seen.has(phase)) {
        seen.add(phase);
        await page.waitForTimeout(phase === 'ENTRY' ? 2500 : 1500); // mid-phase
        await shot(`phase-${phase}`);
        console.log(`[loop] phase ${phase}: alt=${st.landing.altitude?.toFixed(0)} chunks=${st.landing.chunksResident}`);
      }
      if (phase === 'WALK') break;
      await page.waitForTimeout(400);
    }
    const walkState = await info();
    console.log('[loop] at WALK:', JSON.stringify(walkState));
    await shot('walk-ship');

    // 4. Walk to the hatch and re-board.
    const rawHatch = await page.evaluate(() => {
      const ia = window.__test.getActiveInteractables().find((i) => i.id === 'landfall-ship-hatch');
      return ia ? JSON.stringify(ia) : 'NOT FOUND';
    });
    console.log('[loop] raw hatch entry:', rawHatch);
    const hatch = await page.evaluate(() => {
      const ia = window.__test.getActiveInteractables().find((i) => i.id === 'landfall-ship-hatch');
      if (!ia) return null;
      const p = ia.position ?? ia.pos ?? ia;
      if (typeof p.x !== 'number') return null;
      window.__test.teleport(p.x, p.y, p.z);
      return { x: p.x, y: p.y, z: p.z };
    });
    console.log('[loop] hatch:', JSON.stringify(hatch));
    if (!hatch) throw new Error('landfall-ship-hatch interactable not found');
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const boarded = await page.evaluate(() => window.__test.interact());
    console.log('[loop] interact →', boarded);
    await page.waitForTimeout(900); // fade

    // 5. Assert back on ship at HOLD.
    for (let i = 0; i < 5; i++) { await page.waitForTimeout(200); }
    const final = await info();
    const app = await page.evaluate(() => window.__test.getApproachInfo());
    console.log('[loop] FINAL:', JSON.stringify(final), 'approach:', JSON.stringify(app && { holdEngaged: app.holdEngaged, trueDist: app.trueDist }));
    await shot('reboard-ship');

    // 6. Repeatability.
    const again = await page.evaluate(() => window.__test.engageLanding());
    console.log('[loop] engageLanding again →', again);

    await browser.close();
    console.log('[loop] done');
  } finally {
    server.kill();
  }
}

run().catch((err) => { console.error('[loop] FAILED:', err); server.kill(); process.exit(1); });
