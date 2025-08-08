import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createCoral(scene: THREE.Scene) {
  const group = new THREE.Group();
  scene.add(group);

  const materials = [
    new THREE.MeshStandardMaterial({ color: 0xff6688, roughness: 1 }),
    new THREE.MeshStandardMaterial({ color: 0xffcc66, roughness: 1 }),
    new THREE.MeshStandardMaterial({ color: 0x66ffcc, roughness: 1 }),
  ];

  function makeProceduralPatch(origin: THREE.Vector3) {
    const count = 80;
    const geo = new THREE.ConeGeometry(0.4, 1.2, 6, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff8866, roughness: 1 });
    const inst = new THREE.InstancedMesh(geo, mat, count);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.copy(origin).add(new THREE.Vector3((Math.random()-0.5)*10, -19.6 + Math.random()*0.6, (Math.random()-0.5)*10));
      dummy.rotation.set(Math.random()*0.2, Math.random()*Math.PI*2, Math.random()*0.2);
      const s = 0.6 + Math.random()*0.8;
      dummy.scale.set(s, 1.5*s, s);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      // randomly enable bloom layer for some instances by duplicating a few emissive cones
    }
    inst.instanceMatrix.needsUpdate = true;
    group.add(inst);
  }

  // Fallback procedural reefs
  makeProceduralPatch(new THREE.Vector3(10, -19, -10));
  makeProceduralPatch(new THREE.Vector3(-20, -19, 5));

  // Try to load GLTF coral if present
  const loader = new GLTFLoader();
  loader.load(
    '/assets/coral.glb',
    (gltf) => {
      const coralRoot = gltf.scene;
      coralRoot.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const m = o as THREE.Mesh;
          m.castShadow = false;
          m.receiveShadow = true;
        }
      });
      coralRoot.position.set(5, -19.5, 8);
      coralRoot.scale.setScalar(2.5);
      group.add(coralRoot);
    },
    undefined,
    () => {
      // ignore missing file
    }
  );

  function update(dt: number) {
    // subtle sway for life-like feel
    const t = performance.now() * 0.001;
    group.rotation.y = Math.sin(t * 0.1) * 0.02;
  }

  return { group, update };
}
