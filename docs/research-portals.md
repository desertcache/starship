# Portal render-target correctness — research notes

External AI research run, 2026-07-02. MANDATORY read for anyone touching `src/fx/portalSurface.ts`. Verdict up front: our RT architecture is correct (stencil portals are architecturally hostile to GTAOPass — it re-renders the scene for its G-buffer and produces wrong AO inside stencil regions); spend the effort on projected UVs and the HDR pipeline below.

## 1. Virtual camera math

Chain: player camera world matrix → source-portal local → 180° flip about portal up (front of A maps to back of B) → destination-portal local → world.

```ts
const FLIP = new THREE.Matrix4().makeRotationY(Math.PI);
const _srcInv = new THREE.Matrix4();
const _portalXform = new THREE.Matrix4();

/** Convention: both portal quads face +Z into their rooms. */
function updateVirtualCamera(
  playerCam: THREE.PerspectiveCamera,
  src: THREE.Object3D,           // portal in scene A
  dst: THREE.Object3D,           // linked portal in scene B
  vCam: THREE.PerspectiveCamera, // matrixAutoUpdate = false
): THREE.Matrix4 {
  _srcInv.copy(src.matrixWorld).invert();
  _portalXform.copy(dst.matrixWorld).multiply(FLIP).multiply(_srcInv);

  vCam.matrixWorld.multiplyMatrices(_portalXform, playerCam.matrixWorld);
  vCam.matrixWorld.decompose(vCam.position, vCam.quaternion, vCam.scale);
  vCam.matrixWorldInverse.copy(vCam.matrixWorld).invert();

  vCam.projectionMatrix.copy(playerCam.projectionMatrix);
  return _portalXform; // needed by the projected-UV shader
}
```

Portal nodes must stay rigid (rotation + translation only) — non-uniform scale smears the view.

## 2. UV mapping: use CAPTURED-VP PROJECTED UVs, not screen-space

With a stale RT (our 30Hz case) screen-space UVs pin the image to the SCREEN → portal content rubber-bands during camera motion ("swimming"). Projected UVs through the view-projection matrix captured at RT render time pin the image to the PORTAL PLANE — timewarp reprojection applied to a portal; residual error is only parallax of off-plane geometry. Degrades gracefully; costs one mat4 multiply. Use unconditionally.

```glsl
// vertex
uniform mat4 uCapturedVP;   // vCam.projectionMatrix * vCam.matrixWorldInverse AT CAPTURE TIME
uniform mat4 uPortalXform;  // the matrix from §1, frozen at capture time
varying vec4 vClipCap;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vClipCap = uCapturedVP * (uPortalXform * wp);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
// fragment: divide THERE (perspective-correct), then remap
//   vec2 uv = (vClipCap.xy / vClipCap.w) * 0.5 + 0.5;
```

Snapshot `uCapturedVP`/`uPortalXform` at capture time — feeding live values rebuilds screen-space UVs with extra steps.

RT settings: `LinearFilter` min/mag, `generateMipmaps:false`, **`type: HalfFloatType`**, **`samples: 4`** (WebGL2 MSAA, auto-resolved).

## 3. Near-plane clipping (geometry between virtual cam and destination plane)

Two options:

**(a) Preferred for our half-res case — `renderer.clippingPlanes`**: set a world-space plane at the destination portal around the RT render, restore `[]` after. Per-fragment clip in every material (marginally slower), but zero depth warp, no traversal degeneracy, no sign gymnastics. Several shipped Three.js portal implementations use this precisely because Lengyel's trick punishes debugging time.

**(b) Lengyel oblique frustum** (the `THREE.Reflector` code) — rewrite the projection's third row so near plane = portal plane. Pitfalls if used: depth distribution collapses at glancing angles (no depth-reading post in the RT pass; never combine with `logarithmicDepthBuffer`); traversal degeneracy as the camera reaches the plane (`|distanceToPoint| < ε` → skip the clip that frame, hide the sliver with the frame mesh); wrong plane side = fully black RT (guard with `distanceToPoint` sign check); anything calling `updateProjectionMatrix()` on the vCam stomps it (reapply every frame; treat as write-only); manually `.invert()` into `projectionMatrixInverse` or depth-reconstruction silently breaks; `bias ~0.003` if the destination frame z-fights the clip.

## 4. Artifacts & mitigations (half-res, 30Hz)

- **Swimming** → §2 projected UVs (architectural fix). Adaptive refresh: full-rate when portal screen coverage >10-15% or camera angular velocity high; 30Hz when small/distant; round-robin if multiple live (we cap at 1 live anyway).
- **Aliasing in the RT** → `samples: 4` fixes geometric edges; shading shimmer only fixable by content or full-rate. Bilinear upsample softness is a feature; don't sharpen.
- **Quad-edge** → main-pass SMAA handles the silhouette. If ever cropping the RT to the portal's screen rect: 2-4px gutter + half-texel UV inset. A portal frame mesh covering the boundary is standard engineering, not cowardice.
- **Tone mapping**: r152+ applies tone mapping/sRGB ONLY to the default framebuffer → the RT render is scene-linear automatically. Pipeline: HalfFloat RT (UnsignedByte clips highlights → ACES rolls portal content differently + bloom through portals dies — the #1 "portal looks flat" cause) → portal quad ShaderMaterial passes the sample RAW (raw ShaderMaterial has no tonemapping/colorspace chunks — correct by default; if MeshBasicMaterial, leave `map.colorSpace` at NoColorSpace) → quad writes linear HDR into the composer buffer → GTAO/bloom treat it like any surface → OutputPass applies ACES exactly once. Bright objects through portals bloom correctly for free. SMAA stays AFTER OutputPass (wants tone-mapped LDR — already our order).
- **What can't be recovered**: AO *within* scene B (the quad is a flat wall to GTAO — stable, believable; bake/vertex-AO scene B if floaty). 30Hz strobe on animated scene-B content — schedule those portals full-rate or freeze unobserved animations.

## 5. Stencil portals — rejected

Viable only with color-only post chains. GTAOPass re-renders the scene itself for normals/depth → wrong AO inside the portal region (halos, shimmer); oblique-warped scene-B depths in the shared buffer lie to any depth-linearizing pass. Our RT design composes with the entire pass stack precisely because the portal is an ordinary textured surface. (FYI if ever needed: composer needs a custom `WebGLRenderTarget` with `stencilBuffer:true`; `WebGLRenderer` `stencil` default flipped to `false` ~r163.)
