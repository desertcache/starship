# v1.2.1 recovery and verification — 2026-09-29

Plan: `docs/plan-v1.2.1-hardening.md`.

## Result

All interrupted hardening lanes and Stage 2 cleanup are merged locally. The public repository remains v1.2 `8122e05`; no publication was performed. Current tested implementation is `9e7df41` (browser bundle `index-m95a2Lwt.js`). Root's final documentation/strict-sweep commit and local tag contain the same application code.

## Recovered work

- Stage 0 and lane C were already on local main `6552798`.
- Landing lane `2bb52a8` merged as `7f74797`.
- Ship lane follow-up `404281a` merged as `e45694e`.
- Hero texture follow-up `c5e40c7` merged as `f7b8d043`.
- Cleanup commits: `41ec1f1` damping/preview/contracts, `51bf491` ship source splits and live-frame door checks, `899a56d` remaining room/destination splits, `e78a127` effects splits and spawn-setup timing.
- Review fixes: `1cb59cc` duplicate landing requests, `4514c9f` W-key hold across frame rates, `9e7df41` fade-complete screenshot waits.

Luna agents at max effort owned disjoint source files. Existing worktrees and their untracked AGENTS.md files were preserved. No npm install or dependency changes.

## Verification evidence

- Fresh typecheck, JavaScript syntax, whitespace, and every-TypeScript-source <=300-line checks passed.
- Full standard headless: 16/16 functional tests plus A/B/C/D real-input suites passed. Strict sweeps: zero name-contract and zero dead-hook violations. D1: five texture classes had exact pixel and next-RNG parity. D2: 7.90 ms maximum including spawn setup (5.00 ms setup).
- Final standard headed after timing-only test adjustments: 16/16 plus every real-input suite passed; **131 FPS / p95 8.2 ms**, measured at the worst-probed camera `cockpit-canopy`. Deferred texture runtime-order frame: **6.20 ms**, setup 2.30 ms. Binding budget is >=60 FPS, p95 <=18 ms, <=500k triangles.
- Real W into the closed door stopped at z=-19.66; the open-door pass reached z=-21.74. Real auto-close passed. Real E sleep/console/crate/overlay/relic/hatch routes passed.
- Final L suite: two real L taps, duplicate rejection, standing on surface, real W, LOD refinement, five hatch angles, real E reboard, preserved HOLD/trueDist, reset restores pointer-look.
- Real-time landing capture: ENTRY -> BRAKE -> TOUCHDOWN -> WALK -> reboard -> HOLD -> repeat engagement passed. `trueDist` remained exactly `8796.307673572288` before and after.
- Root inspected every fresh headed and loop screenshot (45 PNGs), including reactor peak/trough and corrected visible landing captures. No visual regression requiring a change was found.
- Independent code review found no remaining actionable issue after the three guard gaps were fixed.

The full headless run precedes the final screenshot-id/wait and W-duration adjustments; the final full headed run covers those changes. A separate cold-headless door proof on the final build passed after an actual cockpit screenshot plus 600 ms, with closed/open WASD at z=-19.53/-21.63. A custom no-flush runner had failed due to insufficient render warm-up; it is not a substitute for the standard harness. No game code was changed to accommodate it.

Logs/reports are in ignored `verify/`: `resume-headless-20260929.log`, `resume-headed-20260929-r2.log`, `resume-headless-report.json`, `resume-headed-report.json`, and `resume-loop-20260929.log`. A new ~72-second showcase is at `verify/capture/v1.2.1-9e7df41/showcase.webm` (9,209,128 bytes). Earlier captures were preserved.

## Review and operational decisions

- Door tests must observe real rendered-frame movement/auto-close before simulation fast-forward; direct tick hooks alone cannot prove main-loop wiring.
- HOLD remains frozen off-ship, so landing requests need both a pending guard and a ship-world guard.
- Texture budgets include synchronous setup and a queued slice before a same-frame spawn, matching production order; retries retain every observed maximum.
- The deferred queue's inspected runtime path is bounded by the seven-hero cap, advances one job per tick, and cancels before disposal. No added external-input/network/eval/HTML sink path was found in the inspected diff. The earlier Claude 429 review was not treated as a review result.
- PowerShell non-terminating errors can still execute later writes. Use `$ErrorActionPreference = 'Stop'`, inspect actual diffs after errors, and use `git commit --only -- <owned paths>` in a shared checkout.
- The installed Starship skill still has stale v1.0/manual-gh-pages text. Current Actions-on-main deployment is authoritative; a push publishes publicly and needs Sam's approval.

## Pending publication

The completed build is local. Public main and the live game remain v1.2 until Sam authorizes publishing. No remaining hardening implementation or verification blocker is known. Future visual/feature work remains a separate campaign.
