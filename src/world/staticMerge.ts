/**
 * src/world/staticMerge.ts — Lane A1 "headroom" defrag pass (v0.9 RADIANCE).
 *
 * Generic post-build merge utility: walks a room's fully-populated Group tree
 * and merges STATIC sibling meshes (same material, same geometry attribute
 * signature) into fewer draw calls via BufferGeometryUtils.mergeGeometries.
 *
 * Safety model — why this is safe to run unconditionally over every room:
 *
 *   - Recurses into every child Group (never skips a subtree) but only ever
 *     merges within EACH group's own direct Mesh children, and re-adds the
 *     merged result as a child of that SAME group. Ancestor name chains are
 *     therefore always preserved, so:
 *       (a) raycast interactable resolution (interact.ts walks node.name up
 *           the ancestor chain) still finds any interactable whose id
 *           matches a GROUP name — console-bank, fridge, breaker-cabinet,
 *           crate-a/b, locker-a/b, seat-port/starboard, throttle-levers,
 *           reactor-rail, etc. — exactly as before merging, and
 *       (b) shadow-cast keyword classification (assembly.ts shouldCastShadow
 *           walks the same ancestor chain for names like 'reactor'/'bunk'/
 *           'lever'/'rail'/'cabinet') is unaffected — the merged mesh's
 *           parent chain is identical to its source meshes' parent chain.
 *
 *   - Skips (leaves completely untouched) any Mesh that:
 *       1. Has a non-empty `.name`. A handful of leaf meshes are raycast
 *          targets in their OWN right rather than via a named ancestor group
 *          (stove, coffee-cup, bench-fore, bench-aft, save-terminal-shell,
 *          save-terminal-screen, fridge-ration-N, datapad-a/b, ...). Rather
 *          than hand-auditing every named leaf for raycast/shadow/animation
 *          relevance, ANY name is treated as a "leave it alone" signal.
 *          Debug names are the exception, not the rule, across this
 *          codebase, so this costs very little merge yield.
 *       2. Is an InstancedMesh, or not a Mesh at all (Points/Line/Sprite) —
 *          already cheap, or not a geometry-merge candidate.
 *       3. Has a custom onBeforeRender (i.e. overrides the shared
 *          Object3D.prototype no-op) — per-frame animated: reactor pulse
 *          strips, fridge/locker door hinge tweens, etc.
 *       4. Has an array material (multi-material mesh) — defensively
 *          excluded; none currently exist in this codebase.
 *
 *   - Buckets remaining eligible siblings by (material reference, geometry
 *     attribute-key signature) so mergeGeometries() never sees mismatched
 *     attribute sets (guards custom BufferGeometry that lacks normal/uv).
 *
 *   - Bakes each source mesh's LOCAL matrix (relative to the shared parent)
 *     into a CLONE of its geometry before merging. The original geometry
 *     object is never mutated or disposed: several prop builders in this
 *     codebase intentionally share one BufferGeometry across multiple Mesh
 *     instances, sometimes across different rooms (e.g. quartersProps.ts's
 *     module-level geoPost/geoRailX/geoMattress constants are reused by both
 *     quarters-a and quarters-b). Disposing a shared source after merging
 *     room A would risk starving room B's later construction. Only the
 *     ephemeral per-merge clones are disposed; materials are NEVER disposed
 *     (they are shared singletons by convention throughout src/world).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function hasCustomOnBeforeRender(obj: THREE.Object3D): boolean {
  return obj.onBeforeRender !== THREE.Object3D.prototype.onBeforeRender;
}

function attributeSignature(geo: THREE.BufferGeometry): string {
  const keys = Object.keys(geo.attributes).sort();
  const indexed = geo.index ? '1' : '0';
  return `${indexed}|${keys.join(',')}`;
}

/**
 * Debug-only mesh names, individually audited and confirmed to be neither
 * raycast interactable targets (no matching Interactable.id anywhere in
 * interactWiring.ts/interactItems.ts) nor animated (no onBeforeRender, no
 * tween/getter reference). They exist purely so a human reading the source
 * can tell props apart; merging them away is safe. Every OTHER named mesh in
 * the codebase is left alone by the blanket name check below (see file
 * header, exclusion #1).
 *
 * v0.9 A1: kept deliberately small. An earlier, larger version of this list
 * (adding wall-handle-port/stbd, corner-conduits-*, corner-clamps-*,
 * wall-conduits-*, cable-conduit-*, cable-tray-*) produced a visible geometry
 * corruption in the corridor porthole screenshots and was reverted — those
 * merges are NOT safe as currently implemented (root cause not fully
 * isolated; suspect baking a second transform onto an already-translated,
 * previously-merged CylinderGeometry/TorusGeometry). Do not re-add them
 * without a clean before/after screenshot diff proving no artifact.
 */
const SAFE_TO_MERGE_NAMES = new Set<string>([
  'pegboard', 'light-switch-plate',
  'utensil-0', 'utensil-1', 'utensil-2', 'utensil-3', 'utensil-4', 'utensil-5',
]);

function isMergeCandidate(obj: THREE.Object3D): obj is THREE.Mesh {
  if (!(obj instanceof THREE.Mesh)) return false;
  if (obj instanceof THREE.InstancedMesh) return false;
  // Named leaves are left alone (see file header) unless individually
  // pre-cleared as debug-only via SAFE_TO_MERGE_NAMES.
  if (obj.name && !SAFE_TO_MERGE_NAMES.has(obj.name)) return false;
  if (Array.isArray(obj.material)) return false;
  if (hasCustomOnBeforeRender(obj)) return false;
  if (!(obj.geometry instanceof THREE.BufferGeometry)) return false;
  return true;
}

/**
 * Merge eligible static sibling meshes within `node` (its DIRECT children
 * only), then recurse into every child Group. Mutates the tree in place.
 * Call once, after a room's group is fully populated, before returning it.
 */
export function mergeStaticSiblings(node: THREE.Object3D): void {
  // Recurse first — order doesn't matter since each level only ever touches
  // its own direct children, but doing children before the parent keeps any
  // nested merges settled before this level's bucketing reads them.
  for (const child of node.children) {
    if (child instanceof THREE.Group) {
      mergeStaticSiblings(child);
    }
  }

  const buckets = new Map<string, THREE.Mesh[]>();
  for (const child of node.children) {
    if (!isMergeCandidate(child)) continue;
    const mat = child.material as THREE.Material;
    const key = `${mat.uuid}|${attributeSignature(child.geometry)}`;
    const list = buckets.get(key);
    if (list) list.push(child);
    else buckets.set(key, [child]);
  }

  for (const meshes of buckets.values()) {
    if (meshes.length < 2) continue;

    const clones: THREE.BufferGeometry[] = [];
    for (const m of meshes) {
      m.updateMatrix();
      const clone = m.geometry.clone();
      clone.applyMatrix4(m.matrix);
      clones.push(clone);
    }

    const merged = mergeGeometries(clones);
    for (const c of clones) c.dispose();
    if (!merged) continue; // defensive — mismatched attrs; leave originals in place

    const mesh = new THREE.Mesh(merged, meshes[0].material as THREE.Material);
    node.add(mesh);
    for (const m of meshes) node.remove(m);
  }
}
