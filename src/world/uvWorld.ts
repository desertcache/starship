/**
 * World-aligned UV utility — lane B1 Surfaces.
 *
 * Rewrites UVs on a PlaneGeometry so that one UV unit equals one texture
 * tile of size tileW × tileH metres.  With RepeatWrapping the UV grid is
 * continuous across every wall segment, doorway strip, and window pane that
 * shares the same world-space axis — seams align perfectly even when the mesh
 * is split into separate PlaneGeometry objects.
 *
 * Contract (frozen — later lanes import with this exact signature):
 *   applyWorldUVs(geo, planeW, planeH, tileW, tileH, uOffsetMeters, vOffsetMeters)
 *
 * u = (xLocal + planeW/2 + uOffsetMeters) / tileW
 * v = (yLocal + planeH/2 + vOffsetMeters) / tileH
 *
 * For vertical wall planes (PlaneGeometry, rotated into place):
 *   xLocal  = position along the wall's horizontal axis
 *   yLocal  = height
 *   uOffset = segment's world offset along its wall axis
 *   vOffset = segment bottom Y (usually 0 for floor-to-ceiling segments)
 *
 * For horizontal floor/ceiling planes:
 *   xLocal  = local X (= world X if room group is at origin)
 *   yLocal  = local Z (= world Z)
 *   uOffset = room's world X offset
 *   vOffset = room's world Z offset
 *
 * After calling this, set material.map.repeat = (1,1) + RepeatWrapping;
 * the UVs themselves carry all tiling information.
 */
import * as THREE from 'three';

/**
 * Rewrite the UV attribute of a PlaneGeometry for a continuous world-locked grid.
 *
 * @param geo            PlaneGeometry to modify in-place
 * @param planeW         World-space width  of this specific plane (metres)
 * @param planeH         World-space height of this specific plane (metres)
 * @param tileW          Texture tile width  in metres (one U unit)
 * @param tileH          Texture tile height in metres (one V unit)
 * @param uOffsetMeters  World position of this plane's left/bottom edge along U axis
 * @param vOffsetMeters  World position of this plane's left/bottom edge along V axis
 */
export function applyWorldUVs(
  geo: THREE.BufferGeometry,
  planeW: number,
  planeH: number,
  tileW: number,
  tileH: number,
  uOffsetMeters: number,
  vOffsetMeters: number,
): void {
  const position = geo.attributes.position;
  const uvAttr   = geo.attributes.uv;

  if (!uvAttr || !position) return;

  const count = position.count;

  for (let i = 0; i < count; i++) {
    // PlaneGeometry vertices: x in [-planeW/2, +planeW/2], y in [-planeH/2, +planeH/2]
    const xLocal = position.getX(i);
    const yLocal = position.getY(i);

    const u = (xLocal + planeW / 2 + uOffsetMeters) / tileW;
    const v = (yLocal + planeH / 2 + vOffsetMeters) / tileH;

    uvAttr.setXY(i, u, v);
  }

  uvAttr.needsUpdate = true;
}
