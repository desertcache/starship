/**
 * Shared structural-geometry constants.
 */

/**
 * Anti-z-fight surface epsilon (5mm) — the codebase's long-standing "5mm
 * proud" rule (see fx/glow.ts, corridorPortholes.ts), now a named constant
 * for structural trim.
 *
 * Sign conventions:
 *  - Trim face that would land ON a wall plane, co-facing → shift the box
 *    so the face sits SURFACE_EPS INTO the room (proud of the wall).
 *  - Trim resting ON the floor → SINK the box by SURFACE_EPS (bottom face
 *    buried below y=0; no visible gap, no coplanar plane, no shared edge).
 *  - Trim hanging FROM the ceiling → RAISE by SURFACE_EPS (top face hidden
 *    above y=H; no visible slit).
 *
 * Positional epsilons survive mergeStaticSiblings/mergeGeometries (matrices
 * are baked into geometry). Never use polygonOffset/renderOrder for this —
 * materials are shared singletons and meshes merge per material.
 */
export const SURFACE_EPS: number = 0.005;
