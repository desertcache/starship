/**
 * Cockpit prop dressing — Phase 3b.
 * Console bank, pilot seats, center pedestal, accent details.
 * All geometry is local-space (room origin = center of floor).
 * Room: 6W x 3H x 5D. Fore wall at Z = -2.5.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { AABB } from './types.js';

const COL_GUNMETAL = 0x1c1e22;
const COL_TEAL     = 0x46e0d8;
const COL_ORANGE   = 0xc7641e;

const matGunmetal = new THREE.MeshLambertMaterial({ color: COL_GUNMETAL });
const matOrange   = new THREE.MeshLambertMaterial({ color: COL_ORANGE });
const matTealDot  = new THREE.MeshBasicMaterial({ color: COL_TEAL });

// ── Animated screen shader ────────────────────────────────────────────────────

const VERT = `varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

const FRAG = `precision mediump float;
uniform float uTime;varying vec2 vUv;
float grid(vec2 u,float r){vec2 g=abs(fract(u*r)-.5);return 1.-smoothstep(0.,.03,min(g.x,g.y));}
float wave(vec2 u,float t){float y=.25+.07*sin(u.x*12.+t*.5)+.032*sin(u.x*25.+t*.8+1.1);return 1.-smoothstep(0.,.015,abs(u.y-y));}
float schema(vec2 u,float t){vec2 q=vec2(u.x,fract(u.y+t*.05));
float r=0.;
r=max(r,step(.60,q.x)*step(q.x,.63)*step(.28,q.y)*step(q.y,.72));
r=max(r,step(.28,q.y)*step(q.y,.31)*step(.28,q.x)*step(q.x,.63));
r=max(r,step(.18,q.x)*step(q.x,.21)*step(.48,q.y)*step(q.y,.82));
r=max(r,step(.63,q.y)*step(q.y,.66)*step(.16,q.x)*step(q.x,.60));
r=max(r,step(.70,q.x)*step(q.x,.90)*step(.55,q.y)*step(q.y,.58));
return r;}
void main(){
  vec3 teal=vec3(.27,.88,.85);
  vec3 col=vec3(.04,.06,.10);
  col+=teal*grid(vUv,10.)*.25;
  col+=teal*wave(vUv,uTime);
  col+=teal*schema(vUv,uTime);
  if(vUv.y<.12)col+=teal*step(fract(vUv.x*5.+uTime*.12),.5)*.7;
  float bx=step(.82,vUv.x)*step(vUv.x,.97)*step(.03,vUv.y)*step(vUv.y,.10);
  col+=vec3(.78,.39,.12)*bx*step(.5,fract(uTime*.8+.1));
  gl_FragColor=vec4(clamp(col,0.,1.),1.);}`;

function makeScreenMat(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0.0 } },
    vertexShader: VERT,
    fragmentShader: FRAG,
    side: THREE.DoubleSide,
  });
}

function tickScreen(
  _r: THREE.WebGLRenderer, _s: THREE.Scene, _c: THREE.Camera,
  _g: THREE.BufferGeometry, mat: THREE.Material,
): void {
  const sm = mat as THREE.ShaderMaterial;
  if (sm.uniforms?.['uTime'] !== undefined) {
    sm.uniforms['uTime'].value = performance.now() / 1000;
  }
}

// ── Console bank ───────────────────────────────────────────────────────────────

function buildConsoleBank(group: THREE.Group): AABB {
  const BW = 4.6, BD = 0.55, BH = 0.75, TH = 0.22;
  const FZ = -2.48, CZ = FZ + BD / 2;

  const baseBox = new THREE.BoxGeometry(BW, BH, BD);
  baseBox.translate(0, BH / 2, 0);
  const capBox = new THREE.BoxGeometry(BW, TH, BD);
  capBox.translate(0, BH + TH / 2, 0);
  const body = new THREE.Mesh(mergeGeometries([baseBox, capBox]), matGunmetal);
  body.position.set(0, 0, CZ);
  group.add(body);

  // Orange accent stripe at junction
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(BW, 0.03, BD + 0.01), matOrange);
  stripe.position.set(0, BH + 0.015, CZ);
  group.add(stripe);

  // 3 animated screens on the aft (player-facing) face of the cap
  const SW = 1.18, SH = 0.34;
  const SZ = FZ + BD + 0.005, SY = BH + TH * 0.5;
  for (const sx of [-1.45, 0, 1.45]) {
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(SW + 0.06, SH + 0.06, 0.025), matGunmetal);
    bezel.position.set(sx, SY, SZ);
    group.add(bezel);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), makeScreenMat());
    scr.position.set(sx, SY, SZ + 0.014);
    scr.onBeforeRender = tickScreen;
    group.add(scr);
  }

  // Orange indicator dots along top edge
  const dotGeo = new THREE.SphereGeometry(0.018, 6, 4);
  const indMat = new THREE.MeshBasicMaterial({ color: COL_ORANGE });
  for (let i = 0; i < 5; i++) {
    const d = new THREE.Mesh(dotGeo, indMat);
    d.position.set(-1.8 + i * 0.9, BH + TH + 0.025, FZ + BD - 0.04);
    group.add(d);
  }

  // Teal underlight strip
  const strip = new THREE.Mesh(new THREE.BoxGeometry(BW - 0.1, 0.03, 0.015), matTealDot);
  strip.position.set(0, 0.08, FZ + BD - 0.01);
  group.add(strip);

  return { minX: -BW / 2, minY: 0, minZ: FZ, maxX: BW / 2, maxY: BH + TH + 0.06, maxZ: FZ + BD };
}

// ── Pilot seat ────────────────────────────────────────────────────────────────

function buildSeat(group: THREE.Group, x: number, ry: number): AABB {
  const Z = 0.3;
  const ped = new THREE.BoxGeometry(0.18, 0.42, 0.18); ped.translate(0, 0.21, 0);
  const pan = new THREE.BoxGeometry(0.52, 0.08, 0.50); pan.translate(0, 0.45, 0);
  const bk  = new THREE.BoxGeometry(0.52, 0.58, 0.09); bk.translate(0, 0.75, -0.21);
  const hd  = new THREE.BoxGeometry(0.36, 0.22, 0.09); hd.translate(0, 1.30, -0.21);
  const body = new THREE.Mesh(mergeGeometries([ped, pan, bk, hd]), matGunmetal);
  body.position.set(x, 0, Z); body.rotation.y = ry;
  group.add(body);

  // Orange accent stripe
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.10), matOrange);
  stripe.position.set(x, 0.72, Z - 0.21); stripe.rotation.y = ry;
  group.add(stripe);

  // Armrests
  for (const side of [-1, 1] as const) {
    const ag = new THREE.BoxGeometry(0.06, 0.04, 0.38);
    ag.translate(side * 0.29, 0.50, 0);
    const arm = new THREE.Mesh(ag, matGunmetal);
    arm.position.set(x, 0, Z); arm.rotation.y = ry;
    group.add(arm);
  }

  return { minX: x - 0.35, minY: 0, minZ: Z - 0.35, maxX: x + 0.35, maxY: 1.55, maxZ: Z + 0.35 };
}

// ── Center pedestal ───────────────────────────────────────────────────────────

function buildCenterPedestal(group: THREE.Group): AABB {
  const Z = 0.25;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.52, 0.28), matGunmetal);
  body.position.set(0, 0.26, Z); group.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.34), matOrange);
  top.position.set(0, 0.535, Z); group.add(top);

  for (const side of [-1, 1] as const) {
    const lx = side * 0.095;
    const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.030, 0.06, 8), matGunmetal);
    sock.position.set(lx, 0.595, Z); group.add(sock);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.22, 8), matOrange);
    shaft.position.set(lx, 0.72, Z); shaft.rotation.x = 0.18; group.add(shaft);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), matOrange);
    knob.position.set(lx, 0.83, Z + 0.04); group.add(knob);
  }

  return { minX: -0.20, minY: 0, minZ: Z - 0.20, maxX: 0.20, maxY: 0.90, maxZ: Z + 0.20 };
}

// ── Accent details ────────────────────────────────────────────────────────────

function buildAccents(group: THREE.Group): void {
  // Hazard orange strips on port + starboard walls
  const hg = new THREE.BoxGeometry(0.04, 0.18, 0.60);
  const pm = new THREE.Mesh(hg, matOrange); pm.position.set(-2.96, 0.55, -1.2); group.add(pm);
  const sm = new THREE.Mesh(hg, matOrange); sm.position.set( 2.96, 0.55, -1.2); group.add(sm);

  // Status lights — teal/orange/green dots near ceiling on both walls
  const dg = new THREE.SphereGeometry(0.022, 6, 4);
  const defs: Array<[number, number, number, number]> = [
    [-2.96, 2.20, -1.8, COL_TEAL], [-2.96, 2.20, -1.6, COL_TEAL],
    [-2.96, 2.20, -1.4, COL_ORANGE], [-2.96, 2.20, -1.2, 0x22ee44],
    [ 2.96, 2.20, -1.8, COL_TEAL], [ 2.96, 2.20, -1.4, COL_ORANGE],
  ];
  for (const [lx, ly, lz, col] of defs) {
    const dot = new THREE.Mesh(dg, new THREE.MeshBasicMaterial({ color: col }));
    dot.position.set(lx, ly, lz); group.add(dot);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface CockpitPropsResult { colliders: AABB[] }

/** Dress the cockpit room group with all Phase 3b props. Mutates `group`. */
export function addCockpitProps(group: THREE.Group): CockpitPropsResult {
  const colliders: AABB[] = [];
  colliders.push(buildConsoleBank(group));
  colliders.push(buildSeat(group, -0.90,  0.07)); // port, inboard tilt
  colliders.push(buildSeat(group,  0.90, -0.07)); // starboard, inboard tilt
  colliders.push(buildCenterPedestal(group));
  buildAccents(group);
  return { colliders };
}
