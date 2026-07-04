// One-off orchestrator harness (Stage D art evidence): collect all 3 relics
// via __test hooks, then screenshot the annex 'portal-room' camera with lit
// sockets + the ignited holotable hologram. Mirrors hull-capture.mjs's headed
// pattern (own vite server + own browser, fully isolated from scripts/verify.mjs
// runs — no shared persistent context, no localStorage carryover, no port reuse).
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 5198;
const BASE = `http://127.0.0.1:${PORT}`;

const server = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
  cwd: ROOT, shell: true, stdio: 'ignore',
});

let up = false;
for (let i = 0; i < 60 && !up; i++) {
  try { up = (await fetch(`${BASE}/`)).ok; } catch { /* not yet */ }
  if (!up) await new Promise((r) => setTimeout(r, 500));
}
if (!up) { console.error('dev server never came up'); process.exit(1); }

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

page.on('console', (msg) => { if (msg.type() === 'error') console.error('[page error]', msg.text()); });

await page.goto(`${BASE}/?toasts=0`);
await page.waitForFunction(() => window.__ready instanceof Promise, { timeout: 15000 });
await page.evaluate(() => window.__ready);
await page.waitForTimeout(600);

const waitFrame = () => page.evaluate(
  () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(undefined)))),
);

async function collectRelic(worldId, relicId) {
  await page.evaluate((id) => window.__test.switchWorld(id), worldId);
  await waitFrame();
  const ias = await page.evaluate(() => window.__test.getActiveInteractables());
  const relic = ias.find((ia) => ia.id === relicId);
  if (!relic) throw new Error(`'${relicId}' interactable not found in ${worldId} (already collected? re-run against a fresh server)`);
  await page.evaluate((p) => window.__test.teleport(p.x, p.y, p.z), relic);
  await waitFrame();
  const ok = await page.evaluate(() => window.__test.interact());
  if (!ok) throw new Error(`interact() returned false collecting '${relicId}' in ${worldId}`);
  console.log(`[portal-ignite] collected ${relicId} (${worldId})`);
}

await collectRelic('verdant', 'verdant-relic');
await collectRelic('ashfall', 'ashfall-relic-core');
await collectRelic('rift', 'rift-relic');

const codex = await page.evaluate(() => window.__test.getCodex());
console.log(`[portal-ignite] relics held: [${codex.relics.join(', ')}]`);
if (codex.relics.length !== 3) throw new Error(`expected all 3 relics; got [${codex.relics.join(', ')}]`);

await page.evaluate(() => window.__test.switchWorld('ship'));
await waitFrame();
await page.evaluate((n) => window.__setCam(n), 'portal-room');
await waitFrame();
// Let the T1 propagating pulses / hologram rotation settle into a
// representative mid-cycle frame before the shot.
await page.waitForTimeout(1200);

mkdirSync(resolve(ROOT, 'verify', 'shots'), { recursive: true });
const shotPath = resolve(ROOT, 'verify', 'shots', 'portal-room-ignited.png');
await page.screenshot({ path: shotPath });
console.log(`[portal-ignite] captured ${shotPath}`);

await browser.close();
try { execFileSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' }); } catch { /* already gone */ }
process.exit(0);
