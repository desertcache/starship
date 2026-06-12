import * as THREE from 'three';

// Shared greybox materials — Phase 1 placeholder palette.
// Re-used across all rooms to keep draw calls low.

export const matWall = new THREE.MeshLambertMaterial({ color: 0xb0aa9e, side: THREE.FrontSide });
export const matFloor = new THREE.MeshLambertMaterial({ color: 0x4a4a50, side: THREE.FrontSide });
export const matCeiling = new THREE.MeshLambertMaterial({ color: 0x888880, side: THREE.FrontSide });
