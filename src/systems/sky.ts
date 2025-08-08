import * as THREE from 'three';
import skyVert from '../shaders/sky.vert.glsl?raw';
import skyFrag from '../shaders/sky.frag.glsl?raw';

export function createSky(renderer: THREE.WebGLRenderer) {
  const uniforms = {
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uTurbidity: { value: 2.0 },
    uRayleigh: { value: 1.0 },
    uMieCoefficient: { value: 0.005 },
    uMieDirectionalG: { value: 0.8 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: skyVert,
    fragmentShader: skyFrag,
    side: THREE.BackSide,
    depthWrite: false,
  });

  const geometry = new THREE.SphereGeometry(1000, 32, 16);
  const mesh = new THREE.Mesh(geometry, material);

  function setElevation(deg: number) {
    const phi = THREE.MathUtils.degToRad(90 - deg);
    const theta = THREE.MathUtils.degToRad(0);
    const sun = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
    uniforms.uSunDir.value.copy(sun.normalize());
  }

  function setAzimuth(deg: number) {
    const elevate = 90 - THREE.MathUtils.radToDeg(Math.acos(uniforms.uSunDir.value.y));
    const phi = THREE.MathUtils.degToRad(90 - elevate);
    const theta = THREE.MathUtils.degToRad(deg);
    const sun = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
    uniforms.uSunDir.value.copy(sun.normalize());
  }

  return { mesh, setElevation, setAzimuth };
}
