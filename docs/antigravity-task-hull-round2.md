# TASK BRIEF — Hull round 2 (fix findings from orchestrator review)

> Follow-up to `docs/antigravity-task-hull.md` — same rules, same file ownership
> (the five owned files + your REPORT), same prohibitions (no git, no npm install,
> nothing outside your files). Round 1 was reviewed: the anchors transcription and
> loft skeleton PASSED (containment reads correct in clay mode, dimensions sane,
> determinism verified). Three findings must be fixed.

## Finding 1 — Holo mode is unverifiable (BLOCKER)

In modes 2 and 3 the 1/45 miniature renders as a ~10-pixel tick because the camera
stays framed on the 52m hull. The hologram is the ONLY deliverable that ships in v1.0,
and it currently cannot be reviewed at all.

Fix in `preview.ts`: when mode 2 (Holo only) is active, move/zoom the camera to frame
the miniature so it fills ~60% of the viewport height, slowly orbiting. Mode 1 and 3
keep the current full-scale framing. The reviewer verifies the holo by pressing `2`
and must be able to see: barycentric edge-wire, fresnel rim, scanlines moving,
periodic sweep band, flicker with rare dropouts, dimmed back-faces.

## Finding 2 — Under-detailed: 5.3k tris vs ~25k target

Your "kit of 8 greebles" placed 8 pieces TOTAL. `research-hull.md` §3 specifies a kit
of 8–12 DISTINCT pieces (12–60 tris each) SCATTERED across the hull: seam-biased
placement, zone-weighted density (engineering/aft 1.0, spine 0.5, cockpit 0.2, cargo
doors 0.1), yaw snapped to 90°, scale jitter 0.8–1.2, ~5% surface coverage. That
lands at roughly 150–400 instances and a total hull of ~15–30k tris (hard cap stays
50k). The hologram's edge-glow wireframe is what makes greebles read — a bare hull
looks like a toy. Keep the big-shape read: do NOT exceed ~5% coverage, keep greebles
off the canopy, and keep the silhouette rules intact.

## Finding 3 — Containment must be asserted numerically, not eyeballed

Aft clearance looked borderline in the clay screenshot. Add a computational check in
`preview.ts` (or `buildHull.ts` if cleaner): for every interior slice, compute the
hull's actual profile half-extents at that Z and assert `hullHalfW ≥ slice.halfW + 0.55`
and equivalent for height above AND below `yCenter` (0.55 = MARGIN minus tolerance).
Also assert every porthole/canopy/engine anchor sits within 0.35m of the hull surface
along its normal. Print `CONTAINMENT: PASS` or `CONTAINMENT: FAIL @ z=…` on the
overlay panel. The reviewer will screenshot this line; FAIL blocks acceptance.

## Deliverable

Update the five files as needed, re-verify the checklist from the round-1 brief, and
OVERWRITE `docs/antigravity-hull-REPORT.md` with: new tri count, the containment
line's value, what changed per finding, and any deviations. Do not commit.
