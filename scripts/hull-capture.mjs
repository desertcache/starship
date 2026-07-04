// One-off orchestrator harness: headed screenshots of hull-preview.html (Antigravity audit).
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 5199;
const BASE = `http://localhost:${PORT}`;

const server = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], {
  cwd: ROOT, shell: true, stdio: 'ignore',
});

let up = false;
for (let i = 0; i < 60 && !up; i++) {
  try { up = (await fetch(`${BASE}/hull-preview.html`)).ok; } catch { /* not yet */ }
  if (!up) await new Promise((r) => setTimeout(r, 500));
}
if (!up) { console.error('dev server never came up'); process.exit(1); }

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(`${BASE}/hull-preview.html`);
await page.waitForTimeout(3000);

mkdirSync(resolve(ROOT, 'verify', 'shots'), { recursive: true });
for (const [key, name] of [['3', 'hull-both'], ['1', 'hull-clay'], ['2', 'hull-holo']]) {
  await page.keyboard.press(key);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: resolve(ROOT, 'verify', 'shots', `${name}.png`) });
  console.log(`captured ${name}`);
}

await browser.close();
try { execFileSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' }); } catch { /* already gone */ }
process.exit(0);
