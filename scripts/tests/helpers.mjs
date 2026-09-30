/**
 * scripts/tests/helpers.mjs — v1.2.1 real-input-path helpers shared by the
 * lane suites (ship.mjs / landing.mjs / worlds.mjs).
 *
 * Drive the game the way a player does: pose the REAL camera, let
 * tickInteract()'s own name-resolved raycast pick a target, read the live [E]
 * prompt, then press the real key through Playwright (window keydown →
 * player/interact.ts). __test.interact()'s distance fallback is what let 15
 * unnamed interactables ship — never use it to prove a player can reach
 * something.
 */

/** Resolve after `n` real rendered frames (tickInteract runs once per frame). */
export async function waitFrames(page, n = 3) {
  await page.evaluate((count) => new Promise((resolve) => {
    let left = count;
    const step = () => {
      left -= 1;
      if (left <= 0) resolve(undefined);
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), n);
}

/** Wait until the HUD fade overlay is fully transparent before a screenshot. */
export async function waitForFadeClear(page) {
  await page.waitForFunction(() => {
    const fade = document.getElementById('scene-fade');
    return fade !== null && Number.parseFloat(getComputedStyle(fade).opacity) <= 0.01;
  }, null, { timeout: 30000 });
}

/**
 * Pose the real camera at `from` looking at `at` ([x,y,z] arrays; pass eye
 * height for `from[1]` while standing — the controller re-clamps y every
 * frame), wait for tickInteract() to raycast, and report what the REAL E key
 * would do: `{ id, prompt }` (id null / prompt '' when nothing resolves).
 */
export async function aimProbe(page, from, at, frames = 3) {
  await page.evaluate(
    ([f, a]) => window.__test.aimFrom(f[0], f[1], f[2], a[0], a[1], a[2]),
    [from, at],
  );
  await waitFrames(page, frames);
  return page.evaluate(() => ({
    id: window.__test.getInteractTarget(),
    prompt: window.__test.getPromptText(),
  }));
}

/**
 * Aim, assert the real E key resolves `expectId` with a live `[E]` prompt,
 * then press the real E key and let two frames run. Returns the probe.
 */
export async function aimAndPressE(page, assert, from, at, expectId, label) {
  const probe = await aimProbe(page, from, at);
  assert(
    probe.id === expectId,
    `${label}: the real E key should target '${expectId}'; got '${probe.id}' (prompt '${probe.prompt}')`,
  );
  assert(
    probe.prompt.startsWith('[E]'),
    `${label}: a live [E] prompt should show for '${expectId}'; got '${probe.prompt}'`,
  );
  await page.keyboard.press('KeyE');
  await waitFrames(page, 2);
  return probe;
}

/**
 * Aim at `at` from `n` evenly spaced bearings on a ring of radius `r` at eye
 * height `y`, and count how many resolve `expectId` through the real E-key
 * raycast. Some bearings legitimately sit inside walls/props, so callers
 * assert a floor that fits the target, not n/n. Returns { hits, total, misses }.
 */
export async function aimSweep(page, at, expectId, { r = 1.6, y = 1.7, n = 8 } = {}) {
  let hits = 0;
  const misses = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const from = [at[0] + Math.cos(a) * r, y, at[2] + Math.sin(a) * r];
    const probe = await aimProbe(page, from, at);
    if (probe.id === expectId) hits += 1;
    else misses.push({ bearingDeg: Math.round((a * 180) / Math.PI), got: probe.id });
  }
  return { hits, total: n, misses };
}
