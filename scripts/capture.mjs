/**
 * capture.mjs — records a showcase video of the running game.
 * Builds, serves preview, opens headed Chromium with video recording,
 * holds each named camera for a few seconds (the space streams past),
 * then saves the webm to verify/capture/.
 * Usage: node scripts/capture.mjs
 */

import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync, readdirSync, renameSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CAP_DIR = resolve(ROOT, 'verify', 'capture');
mkdirSync(CAP_DIR, { recursive: true });

const VITE_BIN = resolve(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
console.log('[capture] Building…');
execFileSync(process.execPath, [VITE_BIN, 'build'], { cwd: ROOT, stdio: 'inherit' });

async function findFreePort(start) {
  const { createServer } = await import('node:net');
  return new Promise((res) => {
    const s = createServer();
    s.listen(start, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
    s.on('error', () => res(findFreePort(start + 1)));
  });
}

const PORT = await findFreePort(4180);
console.log(`[capture] Preview on ${PORT}…`);
const server = spawn(process.execPath, [VITE_BIN, 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: ROOT, stdio: 'inherit',
});
let serverExited = false;
server.on('exit', () => { serverExited = true; });

async function waitForServer(url, maxMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (serverExited) throw new Error('preview server died');
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch { /* not up */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('server never came up');
}

// Camera tour: [name, holdMs]
const TOUR = [
  ['cockpit-canopy', 9000],
  ['porthole-space', 7000],
  ['corridor', 6000],
  ['engineering', 5000],
  ['cargo-bay', 5000],
  ['cockpit', 6000],
];

async function run() {
  try {
    await waitForServer(`http://localhost:${PORT}`);
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir: CAP_DIR, size: { width: 1280, height: 720 } },
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${PORT}/?toasts=0`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__ready instanceof Promise, { timeout: 20000 });
    await page.evaluate(() => window.__ready);
    await page.waitForTimeout(1200); // settle + warmup

    for (const [cam, hold] of TOUR) {
      console.log(`[capture] ${cam} (${hold}ms)`);
      await page.evaluate((n) => window.__setCam(n), cam);
      await page.waitForTimeout(hold);
    }

    await context.close(); // flushes video
    await browser.close();

    // Playwright names the file with a hash — rename newest to showcase.webm
    const files = readdirSync(CAP_DIR).filter((f) => f.endsWith('.webm'));
    if (files.length) {
      const newest = files[files.length - 1];
      renameSync(resolve(CAP_DIR, newest), resolve(CAP_DIR, 'showcase.webm'));
      console.log('[capture] Saved verify/capture/showcase.webm');
    }
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error('[capture] FAILED:', err);
  server.kill();
  process.exit(1);
});
