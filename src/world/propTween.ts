/**
 * src/world/propTween.ts — lightweight easeInOut tween registry for prop
 * animations (hinge doors, sliding crates).
 *
 * Usage:
 *   const tween = createPropTween(400, (v) => { obj.rotation.y = v * MAX; });
 *   tween.start(0, 1); // open
 *   tween.start(1, 0); // close
 *   // attach to a mesh via mesh.onBeforeRender = () => tween.tick();
 *
 * All tweens are self-ticked via onBeforeRender on an invisible driver mesh.
 */

export interface PropTween {
  /** Kick off tween from current value toward `target`. */
  start(from: number, to: number): void;
  /** Per-frame tick. Call from onBeforeRender. Returns current value. */
  tick(): number;
  /** Read current value without ticking. */
  value(): number;
  /** True when tween has reached its target and is idle. */
  idle(): boolean;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Create a prop tween.
 * @param durationMs - tween duration in milliseconds.
 * @param onUpdate   - callback receiving the EASED value (0…1 range).
 */
export function createPropTween(
  durationMs: number,
  onUpdate: (easedValue: number) => void,
): PropTween {
  let _from = 0;
  let _to   = 0;
  let _t    = 0;        // raw progress 0..1
  let _dir  = 0;        // +1 or -1 or 0=idle
  let _startMs = 0;

  const durationSec = durationMs / 1000;

  function tick(): number {
    if (_dir === 0) return easeInOut(_t);
    const now = performance.now();
    const elapsed = (now - _startMs) / 1000;
    const rawProgress = Math.min(elapsed / durationSec, 1);
    _t = _from + (_to - _from) * rawProgress;
    if (rawProgress >= 1) _dir = 0;
    const eased = easeInOut(_t);
    onUpdate(eased);
    return eased;
  }

  return {
    start(from: number, to: number): void {
      _from    = from;
      _to      = to;
      _t       = from;
      _dir     = to > from ? 1 : -1;
      _startMs = performance.now();
    },
    tick,
    value(): number {
      return easeInOut(_t);
    },
    idle(): boolean {
      return _dir === 0;
    },
  };
}
