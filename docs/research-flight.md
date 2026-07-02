# Spaceflight feel + orbit-to-surface transitions — research notes (for v1.1 "SOVEREIGN")

External AI research run, 2026-07-02. Input to the v1.1 design pass. Headline validation: our "ship stationary, universe moves" architecture has a direct AAA precedent — **KSP's Krakensbane** (above ~750 m/s KSP switches to a craft-stationary frame and subtracts craft velocity from everything else; shipped as the fix for high-velocity float error).

## 1. The load-bearing primitive

Frame-rate-independent exponential damp — reuse for input, velocity, camera pos, camera rot, FOV:

```js
function damp(current, target, lambda, dt) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}
```

λ calibration: ~0.6 dreamy / ~6 responsive / ~40 near-instant (Eiserloh GDC weights converted). Third-person cameras: λ=5 smooth follow, 8-12 snappy, 2-4 cinematic. Unreal SpringArm defaults: CameraLagSpeed = RotationLagSpeed = 10.

## 2. Rotational input pipeline (Freelancer/Star Fox lineage)

1. Smooth raw input: λ 10-15 keyboard (20+ analog).
2. Damp angular velocity toward `input × maxRate`: **λ_rot 6-10** (below 5 = freighter, above 12 = no inertia illusion).
3. **Asymmetric max rates ON PURPOSE**: pitch 1.8-2.5 rad/s, yaw 1.0-1.4 (always slower — reads aircraft-like), roll 3-4. Symmetric = security camera.
4. **Auto-bank into yaw**: `targetRoll = -yawInput × bank(25-45°)`, blend λ 5-8. Single highest-ROI feel trick in the genre.

## 3. Velocity model

Exponential approach to target speed, NOT force integration: `speed = damp(speed, throttle*maxSpeed, λ_v, dt)`. **Asymmetric λ**: accel 1.5-2.5, decel 0.8-1.2 (satisfying coast). Lateral bleed λ 2-4 ("drift through the turn"; 0 = Newtonian-floaty, full = on-rails). In our architecture this is the UNIVERSE's velocity relative to the ship — same math, negated.

## 4. Chase camera

- **Position lag λ 5-8, rotation slerp λ 2.5-4 — rotation MUST lag slower**; the differential (ship banks within the frame before the camera catches up) IS the sense of piloting.
- Arm offset ≈ (0, 1.5-2.5, 8-12) ship-lengths-ish; look-at a LEAD POINT `shipPos + forward × 15-25`, not the ship (ship sits low in frame, rotation legible).
- Speed pull-back: arm +15-30% at max speed, λ 2-3 (boost visibly "leaves the camera behind").
- **FOV widening**: base 60-70 + boost **12-20°** on `smoothstep(0.4, 1.0, speed/max)`, λ 3-4, widen faster than narrow. <10° subliminal, >25° edge smear. Cheapest speed tool we have.

## 5. Camera shake — trauma system (Eiserloh GDC, primary source)

shake = trauma² ; 3D = ROTATIONAL shake only; per-channel Perlin at different seeds (never raw random): yaw = maxYaw × shake × noise(seed,t), pitch seed+1, roll seed+2. Max angles ~1.5° pitch/yaw, 2.5° roll; noise 15-25 Hz. Continuous speed shake: `trauma = 0.3 × smoothstep(0.7, 1.0, speed/max)`, spike 0.5-0.6 on boost engage. Apply to render transform only. Squared response = cruise invisible, boost blooms.

## 6. Star streaking

Stars as LineSegments, tail = `starPos - relVelocity × streakScale`, `streakLength = clamp(k×(speed - v_thresh), 0, maxLen)`. Onset at **~40-50% max cruise** (streaks at low speed read as a bug). Full streaks (20-40 unit lines) only at boost; brightness +30-50% with speed. Wrapping cube ~800-1000 units; recycle trailing→leading hemisphere. 2-3 parallax shells at 1.0×/0.5×/0.25× universe velocity — physically wrong, perceptually essential. (We already have the 2-shell scroll architecture; this extends it to steerable vectors + streaks.)

## 7. Orbit→surface: the cheat catalog (ranked by how much they cheat)

- **Outer Wilds**: cheat by MINIATURIZATION then fake nothing — planets hundreds of meters, distances tiny, flying down IS the transition. **Best fit for far plane 2000**: planets 100-400 units radius, orbits <1500, atmosphere haze shell does the "reads as a world" work.
- **KSP**: dual-scene — physics local space + 1/6000-scale "Scaled Space" subscene with its own camera layered UNDER the main render. Three.js translation: two Scenes, `renderer.autoClear = false`, render far scene w/ own camera → clear depth → render gameplay. **Dissolves the far-plane-2000 constraint entirely.**
- **NMS**: genuinely streams, but the FEEL is non-rendering cheats — small planets, no scale references, **approach speed ∝ distance-to-surface** (approach always ~constant time), pulse-drive hard-disengage near planets, atmosphere entry buries LOD streaming under plasma glow/shake/audio, auto-level stops you aiming at unstreamed terrain, landing = autopilot micro-cutscene.
- **Elite Dangerous**: the descent is a **locked flight corridor as a disguised streaming window** — glide at constant 2500 m/s, entry angle clamped -5°…-60°, ends at 3 km. Fixed speed + clamped pitch = predictable view direction = guaranteed streaming budget. Player experiences a skill moment; engine experiences a loading screen.
- **Starfield (cautionary)**: impostor planets + cut-to-black into a separate cell — the CUT is what made the seam legible, not the swap. Their fix (Free Lanes) went the Elite direction.

## 8. The cheat stack for our build

1. **Fixed-render-distance planet scaling (core cheat)**: never let rendered distance exceed ~1500; park at 1500 and scale so ANGULAR SIZE stays correct: `renderScale = trueRadius × (1500/trueDistance)`. Angular size IS distance in space. Hand to gameplay scene at 1:1 when true distance <1500.
2. **Arrival-time-normalized approach** (NMS): `approachSpeed ∝ distanceToSurface`, clamped → closing always takes ~8-15s.
3. **The curtain**: scene swap during 0.5-1.0s of ≥80% screen coverage from a DIEGETIC effect (cloud deck best, plasma bloom second). Crossfade, never cut to black. Trigger: planet angular size >~60-70% vertical FOV.
4. **Elite the descent**: on commit, lock speed + clamp pitch -10°…-50° for 4-6s — reads as atmosphere physics, IS the loading screen. Pre-warm surface scene (`renderer.compile` + texture uploads) before it starts; the swap-frame hitch is the one artifact that exposes the seam.
5. **Cutscene grammar**: preserve ship screen-space position + apparent motion direction + FOV across the swap — match those three and the brain writes off terrain pop and lighting change as "weather." NMS-style control seizure for final touchdown.
6. **Surface horizon fakes**: curved-world vertex shader `pos.y -= dist²/(2×R_fake)`, R_fake 2000-5000 (Animal Crossing bend) + exponential height fog + skydome haze gradient → 3km tile reads as a planet.

Sourced: damp math, Eiserloh shake, Elite glide numbers, KSP scaled-space/Krakensbane, Outer Wilds/Starfield facts. Tune-by-feel (training-data calibration): λ values, bank angles, FOV amounts, streak thresholds.

**v1.1 build order implied**: two-scene renderer + damp() primitive first; prototype fixed-distance planet scaling with a single textured sphere before ANY landing choreography — it's the piece that sells or breaks the illusion. THRESHOLD's WorldManager already gives us the scene-swap + surface-world machinery; landings = pocket worlds seeded from the approached body.
