import * as THREE from 'three';

export function setupPhysics(scene: THREE.Scene) {
  // Minimal placeholder physics state
  return { objects: [] as THREE.Object3D[] };
}

export function stepPhysics(state: { objects: THREE.Object3D[] }, dt: number) {
  // Placeholder simple buoyancy demo: gently float objects tagged with userData.buoyant
  for (const o of state.objects) {
    if ((o as any).userData?.buoyant) {
      o.position.y += Math.sin(performance.now() * 0.001) * 0.005;
    }
  }
}
