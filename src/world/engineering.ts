/**
 * Engineering room — Phase 3b prop dressing.
 * 6W × 3H × 7D aft room. Fore wall has the corridor door.
 * Centerpiece: pulsing reactor column with guard rail, hazard accents,
 * conduit wall panels, breaker cabinet, crates.
 */
import * as THREE from 'three';
import { buildRoom } from './roomBuilder.js';
import type { RoomModule } from './types.js';
import {
  buildReactor,
  buildReactorRail,
  buildWallConduits,
  buildBreakerCabinet,
  buildCrates,
} from './engineeringProps.js';

/** Engineering — 6W x 3H x 7D. Aft end of ship. */
export function buildEngineering(): RoomModule {
  const W = 6;
  const H = 3;
  const D = 7;

  const { group, colliders } = buildRoom({
    width: W,
    height: H,
    depth: D,
    doors: [
      // Fore wall connects to galley
      { wall: 'fore', gapW: 1.4, gapH: 2.2, offset: 0 },
    ],
  });

  group.name = 'engineering';

  // ── Reactor column ────────────────────────────────────────────────────────
  const { group: reactorGroup, collider: reactorCollider } = buildReactor(H);
  group.add(reactorGroup);
  colliders.push(reactorCollider);

  // ── Guard rail arc ─────────────────────────────────────────────────────────
  const { group: railGroup, collider: railCollider } = buildReactorRail(H);
  group.add(railGroup);
  colliders.push(railCollider);

  // ── Wall conduit panels, accent panels, hazard stripes ────────────────────
  buildWallConduits(group, W, H, D);

  // ── Breaker cabinet (port wall, toward fore) ──────────────────────────────
  const { group: cabGroup, collider: cabCollider } = buildBreakerCabinet(H, D, W / 2);
  group.add(cabGroup);
  colliders.push(cabCollider);

  // ── Crates (fore-port corner) ─────────────────────────────────────────────
  const crates = buildCrates(W / 2, D / 2);
  for (const { group: cg, collider: cc } of crates) {
    group.add(cg);
    colliders.push(cc);
  }

  // ── Warm red-orange point light at the reactor base ────────────────────────
  // v0.5 Stage 2: this is the reactor's hot-core uplight. Brighter + redder +
  // decay=2 so it glows the column and hazard ring while corners fall dark.
  const reactorLight = new THREE.PointLight(0xff5519, 3.0, 5.5, 2);
  reactorLight.position.set(0, 1.2, 1.0);
  group.add(reactorLight);

  // ── Camera: frame the glowing reactor column as the hero ──────────────────
  // Stand fore-center, looking aft toward the reactor. Shows reactor + rails +
  // hazard ring + wall panels in one shot.
  const localCamPos  = new THREE.Vector3(0.4, 1.55, -2.2);
  const localCamLook = new THREE.Vector3(0.0, 1.4, 1.0);

  return {
    group,
    colliders,
    interactables: [],
    cameras: [
      {
        name: 'engineering',
        position: localCamPos,
        lookAt: localCamLook,
      },
    ],
  };
}
