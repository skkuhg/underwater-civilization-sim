import * as THREE from 'three';

export function createDomes(scene: THREE.Scene) {
  const group = new THREE.Group();
  scene.add(group);

  const domeMat = new THREE.MeshPhysicalMaterial({
    color: 0x224455,
    metalness: 0.0,
    roughness: 0.3,
    transmission: 0.7,
    transparent: true,
    opacity: 0.9,
    thickness: 2.0,
  });

  for (let i = 0; i < 3; i++) {
    const radius = 5 + i * 2;
    const geo = new THREE.SphereGeometry(radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const m = new THREE.Mesh(geo, domeMat);
    m.position.set(-15 + i * 15, -18, -10 + i * 10);
    group.add(m);

    // simple base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, 1, 24), new THREE.MeshStandardMaterial({ color: 0x22333a }));
    base.position.set(m.position.x, -19.5, m.position.z);
    group.add(base);
  }

  function update(dt: number) {}

  return { group, update };
}
