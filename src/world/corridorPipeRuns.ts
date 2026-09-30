/** Corridor ceiling pipe runs and their shared shaft height. */
import * as THREE from 'three';

interface PipeMaterials {
  pipe: THREE.Material;
  orangePipe: THREE.Material;
  clamp: THREE.Material;
}

function pipeGeo(radius: number, length: number, segs = 6): THREE.CylinderGeometry {
  const geo = new THREE.CylinderGeometry(radius, radius, length, segs);
  geo.rotateX(Math.PI / 2);
  return geo;
}

export function buildCeilingPipes(
  group: THREE.Group,
  W: number,
  H: number,
  D: number,
  mats: PipeMaterials,
  _m: THREE.Matrix4,
): number {
  const halfW = W / 2;
  const halfD = D / 2;
  const PIPE_Y_BASE   = H - 0.25;  // 2.75
  const PIPE_X_INNER  = halfW - 0.08; // 1.42
  const PIPE_R_MAIN   = 0.065;
  const PIPE_R_ORANGE = 0.040;
  const PIPE_Y_ORANGE = H - 0.13;

  const mainPipeGeo   = pipeGeo(PIPE_R_MAIN, D, 7);
  const orangePipeGeo = pipeGeo(PIPE_R_ORANGE, D, 6);

  const mainPipeMesh = new THREE.InstancedMesh(mainPipeGeo, mats.pipe, 2);
  mainPipeMesh.name = 'pipes-main';
  _m.setPosition(-PIPE_X_INNER, PIPE_Y_BASE, 0);
  mainPipeMesh.setMatrixAt(0, _m);
  _m.setPosition( PIPE_X_INNER, PIPE_Y_BASE, 0);
  mainPipeMesh.setMatrixAt(1, _m);
  mainPipeMesh.instanceMatrix.needsUpdate = true;
  group.add(mainPipeMesh);

  const orangePipeMesh = new THREE.InstancedMesh(orangePipeGeo, mats.orangePipe, 2);
  orangePipeMesh.name = 'pipes-orange';
  _m.setPosition(-PIPE_X_INNER + 0.08, PIPE_Y_ORANGE, 0);
  orangePipeMesh.setMatrixAt(0, _m);
  _m.setPosition( PIPE_X_INNER - 0.08, PIPE_Y_ORANGE, 0);
  orangePipeMesh.setMatrixAt(1, _m);
  orangePipeMesh.instanceMatrix.needsUpdate = true;
  group.add(orangePipeMesh);

  // Pipe clamp rings
  const CLAMP_SPACING = 2.0;
  const CLAMP_COUNT   = Math.floor(D / CLAMP_SPACING); // 8
  const clampGeo = new THREE.TorusGeometry(PIPE_R_MAIN + 0.025, 0.018, 5, 8);
  clampGeo.rotateY(Math.PI / 2);

  const totalClamps = CLAMP_COUNT * 2;
  const clampMesh = new THREE.InstancedMesh(clampGeo, mats.clamp, totalClamps);
  clampMesh.name = 'pipe-clamps';
  let ci = 0;
  for (let i = 0; i < CLAMP_COUNT; i++) {
    const pz = -halfD + CLAMP_SPACING * (i + 0.5);
    for (const sx of [-PIPE_X_INNER, PIPE_X_INNER]) {
      _m.setPosition(sx, PIPE_Y_BASE, pz);
      clampMesh.setMatrixAt(ci++, _m);
    }
  }
  clampMesh.instanceMatrix.needsUpdate = true;
  group.add(clampMesh);


  return PIPE_Y_BASE;
}
