/**
 * src/core/testHooksWorlds.ts — pocket-world + space hooks of the window.__test
 * verify contract (v1.2.1 Stage 0 stub; the worlds/space hardening lane owns
 * this file and adds any hooks its real-path tests need here).
 */
import type { TestApiDeps } from './testApi.js';

// Intentionally empty until the worlds/space lane adds hooks.
export interface WorldsTestHooks {}

export function buildWorldsTestHooks(_deps: TestApiDeps): WorldsTestHooks {
  return {};
}
