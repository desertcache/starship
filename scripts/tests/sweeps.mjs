/**
 * scripts/tests/sweeps.mjs — v1.2.1 mechanical contract sweeps
 * (orchestrator-owned; logic lives in src/core/testSweeps.ts).
 *
 *  NAME  every interactable in every registered world resolves through the
 *        real E key's name-only raycast (a same-named, hittable, nearby mesh).
 *  HOOK  no onBeforeRender hook sits where three.js never calls it (a Group /
 *        Object3D, or a mesh whose material is visible:false).
 *
 * Strict integration gate: every registered world must satisfy both
 * contracts before the build can pass.
 */
const STRICT = true;

export async function runSweeps({ page, assert }) {
  console.log('[verify] Sweep: interactable name contract + dead render hooks');
  const names = await page.evaluate(() => window.__test.sweepNameContract());
  const hooks = await page.evaluate(() => window.__test.sweepDeadHooks());
  for (const v of names) console.log(`[verify]   NAME  ${v.world}/${v.id}: ${v.reason}`);
  for (const v of hooks) console.log(`[verify]   HOOK  ${v.world}: ${v.path} (${v.reason})`);
  const mode = STRICT ? '' : ' (report-only until v1.2.1 integration)';
  console.log(`[verify] Sweep: ${names.length} name-contract + ${hooks.length} dead-hook violation(s)${mode}`);
  if (STRICT) {
    assert(names.length === 0, `Sweep: ${names.length} interactable(s) unreachable by the real E key`);
    assert(hooks.length === 0, `Sweep: ${hooks.length} onBeforeRender hook(s) three.js will never call`);
  }
}
