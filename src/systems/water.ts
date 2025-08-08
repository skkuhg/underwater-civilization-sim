import * as THREE from 'three';
import waterVert from '../shaders/water.vert.glsl?raw';
import waterFrag from '../shaders/water.frag.glsl?raw';

export function createWater(renderer: THREE.WebGLRenderer, camera: THREE.Camera, scene: THREE.Scene) {
  const uniforms = {
    uTime: { value: 0 },
    uNormalScale: { value: 1.0 },
    uWaterLevel: { value: 0.0 },
    uShallowColor: { value: new THREE.Color(0x1a6a7a) },
    uDeepColor: { value: new THREE.Color(0x042a33) },
    uCameraPos: { value: new THREE.Vector3() },
    uLightDir: { value: new THREE.Vector3(0.5, 1.0, -0.5).normalize() },
  uRippleCenter: { value: new THREE.Vector2(0, 0) },
  uRippleTime: { value: -1000 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: waterVert,
    fragmentShader: waterFrag,
    transparent: true,
  });

  const geom = new THREE.PlaneGeometry(2000, 2000, 1, 1);
  const mesh = new THREE.Mesh(geom, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = uniforms.uWaterLevel.value;
  mesh.renderOrder = 0;

  function update(dt: number) {
    uniforms.uTime.value += dt;
    camera.getWorldPosition(uniforms.uCameraPos.value);
  }

  function setNormalScale(v: number) {
    uniforms.uNormalScale.value = v;
  }

  function triggerRipple(worldPos: THREE.Vector3) {
    uniforms.uRippleCenter.value.set(worldPos.x, worldPos.z);
    uniforms.uRippleTime.value = uniforms.uTime.value;
  }

  return { mesh, update, setNormalScale, triggerRipple };
}
