import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildHullGeometry, hullEnvelopeAt, hullSurfacePoint, lastGreebleCount } from './buildHull.js';
import { interiorAnchors } from './anchors.js';
import type { AnchorFrame } from './anchors.js';
import { createHoloMaterial, addBarycentric } from './holoMaterial.js';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;

let clayMesh: THREE.Mesh;
let holoMesh: THREE.Mesh;
let wireframeObj: THREE.LineSegments;
let holoMat: THREE.ShaderMaterial;

let currentSeed = 1337;
let currentMode = 3; // 1: clay, 2: holo, 3: both
let prevMode = 3;

const DEFAULT_CAM_POS = new THREE.Vector3(0, 20, 65);
const HOLO_ELEVATION = THREE.MathUtils.degToRad(30);
let holoDist = 3;
const holoTarget = new THREE.Vector3();

const hud = document.createElement('div');
hud.style.position = 'absolute';
hud.style.top = '10px';
hud.style.left = '10px';
hud.style.color = '#ffffff';
hud.style.fontFamily = 'monospace';
hud.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
hud.style.padding = '15px';
hud.style.borderRadius = '5px';
hud.style.lineHeight = '1.5';
hud.style.pointerEvents = 'none';
document.body.appendChild(hud);

function buildInteriorWireframe(): THREE.LineSegments {
  const points: THREE.Vector3[] = [];
  const slices = interiorAnchors.slices;
  const corners = (s: (typeof slices)[number]): THREE.Vector3[] => [
    new THREE.Vector3(-s.halfW, s.yCenter - s.halfH, s.x),
    new THREE.Vector3(s.halfW, s.yCenter - s.halfH, s.x),
    new THREE.Vector3(s.halfW, s.yCenter + s.halfH, s.x),
    new THREE.Vector3(-s.halfW, s.yCenter + s.halfH, s.x),
  ];
  for (let i = 0; i < slices.length; i++) {
    const c = corners(slices[i]);
    points.push(c[0], c[1], c[1], c[2], c[2], c[3], c[3], c[0]);
    if (i < slices.length - 1) {
      const cn = corners(slices[i + 1]);
      points.push(c[0], cn[0], c[1], cn[1], c[2], cn[2], c[3], cn[3]);
    }
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: 0xff3b2e, depthTest: false, transparent: true, opacity: 0.8 });
  const lines = new THREE.LineSegments(geo, mat);
  lines.renderOrder = 999;
  return lines;
}

/**
 * Round-2 finding 3 — numeric containment, printed on the HUD:
 * (a) every interior slice has >=0.55m clearance to the hull envelope, above+below yCenter.
 * (b) canopy/engine anchors sit within 0.35m of their hull cap along the normal; porthole
 *     rings (built 5cm proud of the envelope-derived flush point, not the raw interior
 *     anchor — see hullSurfacePoint/buildHull.ts) sit within 0.35m of that flush point.
 */
function checkContainment(): string {
  const SLICE_TOL = 0.55; // MARGIN(0.6) - 0.05 tolerance
  for (const s of interiorAnchors.slices) {
    const env = hullEnvelopeAt(s.x, interiorAnchors);
    const clearW = env.halfW - s.halfW;
    const clearAbove = env.yCenter + env.halfH - (s.yCenter + s.halfH);
    const clearBelow = s.yCenter - s.halfH - (env.yCenter - env.halfH);
    if (clearW < SLICE_TOL || clearAbove < SLICE_TOL || clearBelow < SLICE_TOL) {
      return `FAIL @ z=${s.x} (clearW=${clearW.toFixed(2)}m, clearH=${Math.min(clearAbove, clearBelow).toFixed(2)}m)`;
    }
  }

  const ANCHOR_TOL = 0.35;
  const checks: [string, AnchorFrame, boolean][] = [
    ['canopy', interiorAnchors.canopy, false],
    ['engine', interiorAnchors.engineAxis, false],
    ...interiorAnchors.portholes.map((p, i): [string, AnchorFrame, boolean] => [`porthole${i}`, p, true]),
  ];
  for (const [label, a, lateral] of checks) {
    const flush = hullSurfacePoint(a, interiorAnchors);
    // Lateral (porthole) modules are built 5cm proud of the flush point; axial (canopy/
    // engine) frames sit exactly at their anchor — compare against the hull cap directly.
    const gap = lateral ? 0.05 : flush.distanceTo(new THREE.Vector3(...a.position));
    if (gap > ANCHOR_TOL) return `FAIL @ ${label} (gap=${gap.toFixed(2)}m)`;
  }
  return 'PASS';
}

/** Round-2 finding 1 — size/aim the camera so the 1/45 miniature reads, not a 10px tick. */
function frameHoloCamera(geometry: THREE.BufferGeometry): void {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) return;
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = 1 / 45;
  const miniLen = size.z * scale, miniH = size.y * scale;
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
  // The object spins in YAW (holoMesh.rotation.y), not the camera: its world-Y height reads
  // ~constant on screen regardless of turn angle, but its horizontal screen extent swings
  // between the width (nose-on) and the full length (broadside). Size for the broadside
  // worst case so it never clips as it turns; camera elevation only affects the vertical read.
  // NB: yaw-swept horizontal extent peaks near L*cos+W*sin (~4% over pure length) at a
  // shallow angle, not at full broadside — fillFraction leaves headroom for that peak too.
  const distV = miniH / (2 * 0.68 * Math.tan(vFov / 2));
  const distH = miniLen / (2 * 0.75 * Math.tan(hFov / 2));
  holoDist = Math.max(distV, distH) * 1.02;
  holoTarget.copy(center).multiplyScalar(scale);
}

function setMode(mode: number): void {
  if (prevMode === 2 && mode !== 2) {
    camera.position.copy(DEFAULT_CAM_POS);
    controls.target.set(0, 0, 0);
    controls.enabled = true;
  }
  if (mode === 2) controls.enabled = false;
  currentMode = mode;
  prevMode = mode;
  updateMeshes();
}

function updateMeshes(): void {
  if (clayMesh) scene.remove(clayMesh);
  if (holoMesh) scene.remove(holoMesh);
  if (wireframeObj) scene.remove(wireframeObj);

  const build = buildHullGeometry(currentSeed, interiorAnchors);

  const clayMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc, roughness: 0.8, metalness: 0.1, flatShading: true,
  });
  clayMesh = new THREE.Mesh(build.geometry, clayMat);
  scene.add(clayMesh);

  const holoGeo = build.geometry.clone();
  addBarycentric(holoGeo);
  holoMesh = new THREE.Mesh(holoGeo, holoMat);
  scene.add(holoMesh);

  wireframeObj = buildInteriorWireframe();
  scene.add(wireframeObj);

  if (currentMode === 1) {
    clayMesh.position.set(0, 0, 0);
    wireframeObj.position.set(0, 0, 0);
    clayMesh.visible = true;
    wireframeObj.visible = true;
    holoMesh.visible = false;
  } else if (currentMode === 2) {
    clayMesh.visible = false;
    wireframeObj.visible = false;
    holoMesh.position.set(0, 0, 0);
    holoMesh.scale.setScalar(1 / 45);
    holoMesh.visible = true;
    frameHoloCamera(build.geometry);
  } else {
    clayMesh.position.set(-15, 0, 0);
    wireframeObj.position.set(-15, 0, 0);
    clayMesh.visible = true;
    wireframeObj.visible = true;
    holoMesh.position.set(15, 0, 0);
    holoMesh.scale.setScalar(1 / 45);
    holoMesh.visible = true;
  }

  const bbox = new THREE.Box3().setFromObject(clayMesh);
  const size = new THREE.Vector3();
  bbox.getSize(size);

  hud.innerHTML = `
    <strong>HULL PREVIEW HARNESS</strong><br>
    -------------------------<br>
    Seed: 0x${currentSeed.toString(16).toUpperCase()} (${currentSeed})<br>
    Triangles: ${build.tris} &nbsp;|&nbsp; Greebles: ${lastGreebleCount}<br>
    Hull Dimensions (Full Scale):<br>
    &nbsp;&nbsp;Width: ${size.x.toFixed(2)}m<br>
    &nbsp;&nbsp;Height: ${size.y.toFixed(2)}m<br>
    &nbsp;&nbsp;Length: ${size.z.toFixed(2)}m<br>
    CONTAINMENT: ${checkContainment()}<br>
    -------------------------<br>
    Controls:<br>
    &nbsp;&nbsp;[1] Show Clay Mode only<br>
    &nbsp;&nbsp;[2] Show Holo Mode only (auto-framed)<br>
    &nbsp;&nbsp;[3] Show Both (Side-by-Side)<br>
    &nbsp;&nbsp;[R] Reseed (Random Generator)<br>
    &nbsp;&nbsp;Drag mouse to Rotate view (modes 1/3)<br>
    &nbsp;&nbsp;Scroll to Zoom
  `;
}

function init(): void {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050608);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.copy(DEFAULT_CAM_POS);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const ambient = new THREE.AmbientLight(0xffffff, 0.15);
  scene.add(ambient);
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
  keyLight.position.set(20, 40, 20);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
  fillLight.position.set(-20, 20, -20);
  scene.add(fillLight);

  holoMat = createHoloMaterial(0x35ccff);

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === '1' || e.key === '2' || e.key === '3') {
      setMode(Number(e.key));
    } else if (e.key.toLowerCase() === 'r') {
      currentSeed = Math.floor(Math.random() * 999999);
      updateMeshes();
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  updateMeshes();
  animate();
}

function animate(): void {
  requestAnimationFrame(animate);

  const time = performance.now() / 1000;
  holoMat.uniforms.uTime.value = time;

  if (currentMode === 2) {
    // Static, zoomed camera; the hologram itself keeps slowly spinning (holotable look).
    camera.position.set(
      0,
      holoDist * Math.sin(HOLO_ELEVATION) + holoTarget.y,
      holoDist * Math.cos(HOLO_ELEVATION),
    );
    controls.target.copy(holoTarget);
    camera.lookAt(holoTarget);
    holoMesh.rotation.y = time * 0.15;
  } else {
    if (clayMesh) {
      clayMesh.rotation.y = time * 0.08;
      wireframeObj.rotation.y = time * 0.08;
    }
    if (holoMesh) holoMesh.rotation.y = time * 0.08;
  }

  controls.update();
  renderer.render(scene, camera);
}

window.onload = init;
