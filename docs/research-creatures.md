# Bone-less procedural creature animation & steering — research notes

External AI research run, 2026-07-02. MANDATORY read for the creature-engine lane (`src/fx/creatures/`). All established technique (Reynolds steering, Overgrowth-school locomotion, GPG critically-damped spring).

**Master update order (load-bearing):** steer → integrate planar → gait phase from distance moved → foot IK → terrain-fit body → secondary springs → orient to velocity. Secondary motion runs LAST (reads the final body transform).

## 1. Quadruped gait

**The anti-foot-skate trick: drive gait phase by DISTANCE TRAVELLED, not time.** One leg cycle per stride-length covered → stance foot sweeps back exactly as far as the body moves forward → world-space foot stationary at any speed.

```ts
type Leg = 'FL' | 'FR' | 'HL' | 'HR';
// Trot: diagonal pairs, duty ~0.55 (best-looking cheap default).
const TROT: Record<Leg, number> = { FL: 0.0, HR: 0.0, FR: 0.5, HL: 0.5 };
// Walk: 4-beat lateral, duty 0.75 → always 3 feet planted, never tips.
const WALK: Record<Leg, number> = { HL: 0.0, FL: 0.25, HR: 0.5, FR: 0.75 };

interface GaitParams {
  strideMin: number; strideMax: number; strideGain: number;
  stepHeight: number; duty: number;   // duty = fraction of cycle foot is down
}
const strideLength = (speed: number, p: GaitParams) =>
  Math.min(p.strideMax, p.strideMin + p.strideGain * speed);
const advancePhase = (phase: number, speed: number, dt: number, p: GaitParams) =>
  (phase + (speed * dt) / strideLength(speed, p)) % 1;
```

**Duty factor IS the gait selector** (>0.5 walk/amble, <0.5 run with suspension) — retune duty + offsets, don't write new gait code.

**Foot trajectory** (stance drag-back / swing arc):

```ts
function footTarget(legPhase: number, L: number, p: GaitParams): [number, number] {
  const s = ((legPhase % 1) + 1) % 1;
  if (s < p.duty) { const u = s / p.duty; return [L * (0.5 - u), 0]; }          // STANCE
  const u = (s - p.duty) / (1 - p.duty);                                        // SWING
  return [L * (-0.5 + u), p.stepHeight * Math.sin(Math.PI * u)];
}
```

**2-bone analytic IK** (law-of-cosines; transform hierarchies only, in-doctrine):

```ts
function twoBoneIK(tx: number, ty: number, upper: number, lower: number,
                   kneeForward = 1): [hip: number, knee: number] {
  const reach = upper + lower - 1e-4;
  const d = Math.min(Math.hypot(tx, ty), reach);
  const clamp = (c: number) => Math.min(1, Math.max(-1, c));
  const knee = Math.acos(clamp((upper*upper + lower*lower - d*d) / (2*upper*lower)));
  const cosHip = clamp((upper*upper + d*d - lower*lower) / (2*upper*d));
  const hip = Math.atan2(ty, tx) + kneeForward * Math.acos(cosHip);
  return [hip, kneeForward * (Math.PI - knee)];
}
```

**Terrain fit**: we have analytic `h(x,z)` → use the ANALYTIC gradient (`n = normalize(−∂h/∂x, 1, −∂h/∂z)`), never finite differences. Average normal over the four foot positions, align body up-vector, height = mean foot-ground height, build basis directly (no atan2/Euler):

```ts
function fitBodyToTerrain(feet: THREE.Vector3[], heading: THREE.Vector3,
                          h: (x:number,z:number)=>number,
                          grad: (x:number,z:number)=>[number,number]) {
  let gy = 0; const nAcc = new THREE.Vector3();
  for (const f of feet) {
    gy += h(f.x, f.z);
    const [gx, gz] = grad(f.x, f.z);
    nAcc.add(new THREE.Vector3(-gx, 1, -gz).normalize());
  }
  const up = nAcc.normalize();
  const right = new THREE.Vector3().crossVectors(heading, up).normalize();
  const fwd   = new THREE.Vector3().crossVectors(up, right).normalize();
  return { groundY: gy / feet.length, right, up, fwd };
}
```

Spring `groundY` and the up-vector so ridge crests ease in. `makeBasis(right, up, fwd.negate())` for Three's −Z-forward.

## 2. Secondary motion — sells the life

Two primitives, both correct under variable dt (per-frame `lerp(a,b,0.1)` is a frame-rate-dependent bug):

```ts
const damp = (a: number, b: number, lambda: number, dt: number) =>
  b + (a - b) * Math.exp(-lambda * dt);

// Critically-damped spring, implicit-Euler exact form (GPG4) —
// unconditionally stable at any dt/omega. omega ≈ 5/settleTime.
function spring(x: number, v: number, target: number, omega: number, dt: number):
  [number, number] {
  const f = 1 + 2*dt*omega, oo = omega*omega, hoo = dt*oo, hhoo = dt*hoo;
  const detInv = 1 / (f + hhoo);
  return [(f*x + dt*v + hhoo*target) * detInv, (v + hoo*(target - x)) * detInv];
}
```

**Head look-at**: smooth the TARGET POINT, not the rotation (head "notices" then tracks = attention); cone-clamp ±~57°:

```ts
function headLook(head: THREE.Object3D, desired: THREE.Vector3,
                  look: THREE.Vector3, lambda: number, dt: number) {
  look.set(damp(look.x, desired.x, lambda, dt),
           damp(look.y, desired.y, lambda, dt),
           damp(look.z, desired.z, lambda, dt));
  head.lookAt(look);
  head.rotation.y = THREE.MathUtils.clamp(head.rotation.y, -1.0, 1.0);
}
```

**Spine bob** coupled to gait phase — 2× per stride vertical, 1× lateral weight-shift:

```ts
function bodyBob(phase: number, amp: number, sway: number) {
  const p = phase * Math.PI * 2;
  return { dy: amp*Math.sin(2*p), droll: sway*Math.sin(p), dz: 0.5*sway*Math.cos(p) };
}
```

**Tail/antenna/tentacle = chained springs**, snappier omega at base, looser toward tip, hard length constraint after:

```ts
class SpringChain {
  pos: THREE.Vector3[]; vel: THREE.Vector3[];
  constructor(public segLen: number, public omega0: number, n: number, root: THREE.Vector3) {
    this.pos = Array.from({length: n}, () => root.clone());
    this.vel = Array.from({length: n}, () => new THREE.Vector3());
  }
  update(root: THREE.Vector3, dt: number) {
    let anchor = root;
    for (let i = 0; i < this.pos.length; i++) {
      const omega = this.omega0 * (1 - 0.5 * i / this.pos.length);
      for (const ax of ['x','y','z'] as const) {
        const [nx, nv] = spring(this.pos[i][ax], this.vel[i][ax], anchor[ax], omega, dt);
        this.pos[i][ax] = nx; this.vel[i][ax] = nv;
      }
      const dir = this.pos[i].clone().sub(anchor);
      if (dir.lengthSq() > 1e-8) this.pos[i].copy(anchor).add(dir.setLength(this.segLen));
      anchor = this.pos[i];
    }
  }
}
```

Antenna: same class, higher omega0, + tiny noise on the root target every frame so it NEVER fully rests — a perfectly still appendage reads as dead. Orient segments base→tip with `lookAt`.

## 3. Jellyfish & glider

**Jelly: the ASYMMETRIC pulse is the propulsion** — fast contract, slow relax; thrust only while contracting; drag always → net drift. Symmetric sine = throbbing balloon going nowhere.

```ts
function bellPulse(phase: number): number {          // 0 open, 1 contracted
  const s = ((phase % 1) + 1) % 1, ss = (t: number) => t*t*(3 - 2*t);
  const contract = 0.3;
  return s < contract ? ss(s / contract) : 1 - ss((s - contract) / (1 - contract));
}
const bellScale = (c: number, squash = 0.35) =>
  ({ radial: 1 - squash*c, vertical: 1 + 0.6*squash*c });

function updateJelly(st: {pos:THREE.Vector3; vel:THREE.Vector3; phase:number; cPrev:number},
                     thrust: number, drag: number, buoyancy: number, freq: number, dt: number) {
  st.phase = (st.phase + freq*dt) % 1;
  const c = bellPulse(st.phase), dc = (c - st.cPrev) / dt; st.cPrev = c;
  st.vel.y += (Math.max(0, dc) * thrust + buoyancy) * dt;
  st.vel.multiplyScalar(Math.exp(-drag * dt));
  st.pos.addScaledVector(st.vel, dt);
}
```

SpringChain per tentacle off the bell rim, driven by bell vertical motion; slow sin on X/Z for drift.

**Glider: Lemniscate of Gerono** (analytic velocity free via derivative) + bank ∝ turn-rate × speed:

```ts
function gliderPath(t: number, A: number, B: number, baseY: number, climb: number) {
  const pos = new THREE.Vector3(A*Math.sin(t), baseY + climb*Math.sin(2*t), (B/2)*Math.sin(2*t));
  const vel = new THREE.Vector3(A*Math.cos(t), 2*climb*Math.cos(2*t), B*Math.cos(2*t));
  return { pos, vel };
}
function gliderOrientation(vel: THREE.Vector3, turnRate: number, speed: number,
                           bankGain: number, maxBank: number): THREE.Quaternion {
  const fwd = vel.clone().normalize();
  const bank = THREE.MathUtils.clamp(-bankGain * turnRate * speed, -maxBank, maxBank);
  let up = new THREE.Vector3(0,1,0).applyAxisAngle(fwd, bank);
  const right = new THREE.Vector3().crossVectors(fwd, up).normalize();
  up.crossVectors(right, fwd).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(right, up, fwd.clone().negate()));
}
```

`turnRate` = change in heading-yaw/sec, smoothed with `damp`. Pitch comes from `vel.y` through `fwd`.

## 4. Steering — six anti-jitter levers (jitter = stiff correction around equilibrium, not randomness)

```ts
interface Agent { pos: THREE.Vector3; vel: THREE.Vector3; seed: number; }
const limit = (v: THREE.Vector3, m: number) => v.lengthSq() > m*m ? v.setLength(m) : v;

// Wander via CONTINUOUS noise => C1-smooth => cannot jitter.
// Per-agent seed offset is MANDATORY or the herd steers identically.
function wander(a: Agent, t: number, noise2D:(x:number,y:number)=>number,
                freq: number, strength: number) {
  return new THREE.Vector3(noise2D(t*freq + a.seed, 0), 0,
                           noise2D(0, t*freq + a.seed + 100)).multiplyScalar(strength);
}
const seek = (a: Agent, tgt: THREE.Vector3, s: number) => tgt.clone().sub(a.pos).setLength(s).sub(a.vel);
const flee = (a: Agent, thr: THREE.Vector3, s: number) => a.pos.clone().sub(thr).setLength(s).sub(a.vel);

// 3-rule herd. n=6 => O(n^2) is nothing; do NOT build a spatial hash.
function herd(a: Agent, others: Agent[], r: number) {
  const coh = new THREE.Vector3(), ali = new THREE.Vector3(), sep = new THREE.Vector3();
  let n = 0;
  for (const o of others) {
    if (o === a) continue;
    const d = a.pos.distanceTo(o.pos);
    if (d > r || d < 1e-5) continue;
    coh.add(o.pos); ali.add(o.vel);
    sep.addScaledVector(a.pos.clone().sub(o.pos), 1/(d*d));  // smooth 1/d², no cutoff pop
    n++;
  }
  if (n) { coh.divideScalar(n).sub(a.pos); ali.divideScalar(n); }
  return { coh, ali, sep };
}

// Integrate in FORCE space; never set velocity directly.
function updateAgent(a: Agent, others: Agent[], t: number, dt: number, cfg: SteerCfg) {
  const { coh, ali, sep } = herd(a, others, cfg.neighborR);
  const fleeW = cfg.threat ? Math.exp(-a.pos.distanceTo(cfg.threat) / cfg.fleeRange) : 0;
  const steer = new THREE.Vector3()
    .addScaledVector(wander(a, t, cfg.noise, cfg.wanderFreq, cfg.wanderStrength), cfg.wWander)
    .addScaledVector(coh, cfg.wCohesion)
    .addScaledVector(ali, cfg.wAlign)
    .addScaledVector(sep, cfg.wSeparation);
  if (cfg.threat) steer.addScaledVector(flee(a, cfg.threat, cfg.maxSpeed), fleeW * cfg.wFlee);
  limit(steer, cfg.maxForce);                                        // maxForce ≪ maxSpeed
  if (steer.lengthSq() < cfg.deadZone*cfg.deadZone) steer.set(0,0,0);
  a.vel.addScaledVector(steer, dt);
  a.vel.multiplyScalar(Math.exp(-cfg.drag * dt));
  limit(a.vel, cfg.maxSpeed);
  a.pos.addScaledVector(a.vel, dt);
}
```

Levers: (1) continuous-noise wander, (2) maxForce ≪ maxSpeed, (3) dead-zone, (4) exponential drag, (5) 1/d² separation, (6) per-agent seed. Orient body to `vel` through the look-lag spring, never instantly.

## Risk radar

- **speed→0 freezes feet mid-swing** (statue with a leg up). Below a speed threshold: blend legs to neutral stand + slow sin breathing bob. Non-optional.
- **Distance-phase only kills FORWARD skate; turning skates outer feet.** If it reads badly: world-space foot-lock (latch world pos on stance entry, blend IK target to it).
- **Clamp dt** (`Math.min(dt, 1/30)`) — main loop already caps at 0.05; keep it. `pos += vel·dt` teleports on tab-refocus otherwise.
- **Analytic terrain gradient**, never finite differences.

**Build order:** trotting quadruped on FLAT ground first (distance-phase + foot-plant is the load-bearing system); terrain-fit, springs, steering layer on cleanly. Ship the grazer walking before touching the jellyfish.
