/** Pure helpers shared by the portal surface implementation. */
import type * as THREE from 'three';
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 0xffffffff;
}

export function rootScene(obj: THREE.Object3D): THREE.Scene | null {
  let n: THREE.Object3D | null = obj;
  while (n) { if ((n as THREE.Scene).isScene) return n as THREE.Scene; n = n.parent; }
  return null;
}
