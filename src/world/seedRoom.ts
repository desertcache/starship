import * as THREE from 'three';

const ROOM_W = 8;
const ROOM_H = 3;
const ROOM_D = 10;

export function buildSeedRoom(scene: THREE.Scene): void {
  const grey = new THREE.MeshLambertMaterial({ color: 0x888888, side: THREE.DoubleSide });
  const floor = new THREE.MeshLambertMaterial({ color: 0x555555, side: THREE.DoubleSide });
  const ceil = new THREE.MeshLambertMaterial({ color: 0x777777, side: THREE.DoubleSide });

  // Floor
  const floorGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_D);
  const floorMesh = new THREE.Mesh(floorGeo, floor);
  floorMesh.rotation.x = -Math.PI / 2;
  scene.add(floorMesh);

  // Ceiling
  const ceilGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_D);
  const ceilMesh = new THREE.Mesh(ceilGeo, ceil);
  ceilMesh.rotation.x = Math.PI / 2;
  ceilMesh.position.y = ROOM_H;
  scene.add(ceilMesh);

  // Walls
  const wallGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_H);
  const wallGeoSide = new THREE.PlaneGeometry(ROOM_D, ROOM_H);

  // Front wall
  const front = new THREE.Mesh(wallGeo, grey);
  front.position.set(0, ROOM_H / 2, -ROOM_D / 2);
  scene.add(front);

  // Back wall
  const back = new THREE.Mesh(wallGeo, grey);
  back.position.set(0, ROOM_H / 2, ROOM_D / 2);
  back.rotation.y = Math.PI;
  scene.add(back);

  // Left wall
  const left = new THREE.Mesh(wallGeoSide, grey);
  left.position.set(-ROOM_W / 2, ROOM_H / 2, 0);
  left.rotation.y = Math.PI / 2;
  scene.add(left);

  // Right wall
  const right = new THREE.Mesh(wallGeoSide, grey);
  right.position.set(ROOM_W / 2, ROOM_H / 2, 0);
  right.rotation.y = -Math.PI / 2;
  scene.add(right);

  // Lighting
  const hemi = new THREE.HemisphereLight(0xffffff, 0x404040, 0.6);
  scene.add(hemi);

  const point = new THREE.PointLight(0xffffff, 1.2, 20);
  point.position.set(0, ROOM_H - 0.3, 0);
  scene.add(point);

  // Ambient fill so nothing is pure black
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
}
