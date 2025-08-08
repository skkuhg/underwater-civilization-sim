import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createBiolife(scene: THREE.Scene) {
  const group = new THREE.Group();
  scene.add(group);

  const creatures: { m: THREE.Mesh; phase: number; speed: number; base: THREE.Vector3 }[] = [];
  const glow = new THREE.MeshStandardMaterial({ color: 0x33ccff, emissive: 0x1188ff, emissiveIntensity: 2, metalness: 0, roughness: 1 });

  const loader = new GLTFLoader();
  loader.load(
    '/assets/jellyfish.glb',
    (gltf) => {
      // Instantiate multiple jellyfish instances
      for (let i = 0; i < 12; i++) {
        const inst = gltf.scene.clone(true);
        inst.position.set((Math.random() - 0.5) * 60, -6 - Math.random() * 10, (Math.random() - 0.5) * 60);
        inst.scale.setScalar(0.5 + Math.random() * 0.8);
        group.add(inst);
        inst.traverse((o: any)=> o.layers?.enable?.(1));
        creatures.push({ m: inst as unknown as THREE.Mesh, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.6, base: inst.position.clone() });
      }
    },
    undefined,
    () => {
      // Fallback to simple glowing orbs
      for (let i = 0; i < 30; i++) {
        const geo = new THREE.SphereGeometry(0.3, 16, 16);
        const m = new THREE.Mesh(geo, glow);
        m.position.set((Math.random() - 0.5) * 60, -5 - Math.random() * 10, (Math.random() - 0.5) * 60);
  group.add(m);
  m.layers.enable(1);
        creatures.push({ m, phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() * 0.8, base: m.position.clone() });
      }
    }
  );

  function update(dt: number, camera: THREE.Camera) {
    const camPos = new THREE.Vector3();
    camera.getWorldPosition(camPos);
    for (const c of creatures) {
      c.phase += dt * c.speed;
      const r = 2.0;
      c.m.position.x = c.base.x + Math.sin(c.phase) * r;
      c.m.position.z = c.base.z + Math.cos(c.phase * 0.8) * r;
      c.m.position.y = c.base.y + Math.sin(c.phase * 0.7) * 0.8;
      const dist = c.m.position.distanceTo(camPos);
      const targetIntensity = THREE.MathUtils.mapLinear(Math.min(dist, 15), 0, 15, 4.0, 1.0);
      const mat = (c.m as any).material as THREE.MeshStandardMaterial | undefined;
      if (mat && 'emissiveIntensity' in mat) {
        mat.emissiveIntensity = targetIntensity;
      }
    }
  }

  return { group, update };
}
