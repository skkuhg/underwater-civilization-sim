import * as THREE from 'three';
import { GUI } from 'lil-gui';
import { createWater } from './systems/water';
import { createSky } from './systems/sky';
import { createBiolife } from './systems/biolife';
import { createDomes } from './systems/domes';
import { setupXR } from './systems/xr';
import { setupAudio } from './systems/audio';
import { setupPhysics, stepPhysics } from './systems/physics';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCoral } from './systems/coral';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Add some debug logging
console.log('Three.js version:', THREE.REVISION);

const app = document.getElementById('app')!;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.xr.enabled = true;
app.appendChild(renderer.domElement);

console.log('WebGL renderer capabilities:', renderer.capabilities);

// Scene and Camera
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x00101a, 0.02);
// Bloom selective layer
const BLOOM_LAYER = 1;
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 5, 15);

// Add a simple test cube to verify rendering
const testGeom = new THREE.BoxGeometry(1, 1, 1);
const testMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const testCube = new THREE.Mesh(testGeom, testMat);
testCube.position.set(0, 0, 0);
scene.add(testCube);
// Player rig so we can move in XR
const player = new THREE.Group();
player.name = 'PlayerRig';
player.add(camera);
scene.add(player);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, -10, 0);
controls.minDistance = 2;
controls.maxDistance = 300;

// Lighting
const hemi = new THREE.HemisphereLight(0x88bbff, 0x003344, 0.6);
scene.add(hemi);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(50, 100, -50);
scene.add(dirLight);

// Ground plane (sea floor)
const sandMat = new THREE.MeshStandardMaterial({ color: 0x224444, roughness: 1 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), sandMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -20;
scene.add(ground);

// Systems
const sky = createSky(renderer);
scene.add(sky.mesh);

// const water = createWater(renderer, camera, scene);
// scene.add(water.mesh);

// Temporary simple water plane for debugging
const waterGeom = new THREE.PlaneGeometry(100, 100);
const waterMat = new THREE.MeshBasicMaterial({ color: 0x006994, transparent: true, opacity: 0.7 });
const waterMesh = new THREE.Mesh(waterGeom, waterMat);
waterMesh.rotation.x = -Math.PI / 2;
waterMesh.position.y = 0;
scene.add(waterMesh);

const biolife = createBiolife(scene);
// biolife.group.traverse((o: any) => o.layers?.enable?.(BLOOM_LAYER));
const domes = createDomes(scene);
const coral = createCoral(scene);

// Physics & Audio
const physics = setupPhysics(scene);
const audio = setupAudio(camera);

// Simple bloom setup for debugging
const composer = new EffectComposer(renderer);
const renderScene = new RenderPass(scene, camera);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.85);
composer.addPass(bloomPass);

// Debug fallback
let useComposer = true;

const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
const materials = new Map<any, any>();
function darkenNonBloom(obj: THREE.Object3D) {
  if ((obj as any).isMesh) {
    const mesh = obj as any;
    if (!mesh.layers.test(new THREE.Layers().set(BLOOM_LAYER))) {
      materials.set(mesh, mesh.material);
      mesh.material = darkMaterial;
    }
  }
}
function restoreMaterial(obj: THREE.Object3D) {
  if ((obj as any).isMesh) {
    const mesh = obj as any;
    const mat = materials.get(mesh);
    if (mat) {
      mesh.material = mat;
      materials.delete(mesh);
    }
  }
}

// GUI
const gui = new GUI();
const params = {
  sunElevation: 30,
  sunAzimuth: 180,
  exposure: 1.0,
  waterNormals: 1.0,
  fogDensity: 0.02,
  bloomStrength: 1.2,
  locomotion: 'smooth' as 'smooth'|'teleport',
  moveSpeed: 2.0,
  snapTurnDeg: 30,
};

gui.add(params, 'sunElevation', -5, 85, 0.1).onChange((v: number) => sky.setElevation(v));
gui.add(params, 'sunAzimuth', 0, 360, 0.1).onChange((v: number) => sky.setAzimuth(v));
gui.add(params, 'exposure', 0.1, 2.5, 0.01).onChange((v: number) => (renderer.toneMappingExposure = v));
// gui.add(params, 'waterNormals', 0.1, 2.0, 0.01).onChange((v: number) => water.setNormalScale(v));
gui.add(params, 'bloomStrength', 0.0, 3.0, 0.01).onChange((v: number) => (bloomPass.strength = v));
const loco = gui.addFolder('Locomotion');
loco.add(params, 'locomotion', ['smooth','teleport']).onChange((v: 'smooth'|'teleport') => xr?.setMode?.(v));
loco.add(params, 'moveSpeed', 0.5, 6, 0.1).onChange((v: number) => xr?.setSpeed?.(v));
loco.add(params, 'snapTurnDeg', 15, 90, 1).onChange((v: number) => xr?.setSnapAngle?.(v));

const fogFolder = gui.addFolder('Underwater Fog');
fogFolder.add(params, 'fogDensity', 0.0, 0.1, 0.001).onChange((v: number) => {
  (scene.fog as THREE.FogExp2).density = v;
});

// WebXR
const enterVRBtn = document.getElementById('enterVR') as HTMLButtonElement;
const xr = setupXR(renderer, enterVRBtn, scene, (pos) => console.log('Ripple at:', pos), player);

// Pointer ripple interaction
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function onPointerDown(ev: PointerEvent) {
  pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y=0
  const hit = new THREE.Vector3();
  if (raycaster.ray.intersectPlane(plane, hit)) {
    console.log('Click ripple at:', hit);
  }
  // unlock/resume audio on user gesture
  (audio as any).resume?.();
}
renderer.domElement.addEventListener('pointerdown', onPointerDown);

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize composer size
composer.setSize(window.innerWidth, window.innerHeight);

// Day-night cycle
let time = 0; // seconds
function updateDayNight(dt: number) {
  time += dt;
  const dayLength = 240; // seconds per full cycle
  const t = (time % dayLength) / dayLength; // 0..1
  const elev = Math.sin(t * Math.PI * 2) * 45 + 15; // -30..+60 clamped
  const azi = t * 360;
  sky.setElevation(elev);
  sky.setAzimuth(azi);
  const lightIntensity = THREE.MathUtils.clamp(Math.max(0, Math.sin(t * Math.PI * 2)), 0.05, 1);
  dirLight.intensity = 0.5 + 0.8 * lightIntensity;
  hemi.intensity = 0.3 + 0.5 * lightIntensity;
}

// Animation loop
const clock = new THREE.Clock();
function animate() {
  try {
    const dt = clock.getDelta();
    updateDayNight(dt);
    // water.update(dt);
    biolife.update(dt, camera);
    domes.update?.(dt);
    coral.update(dt);
    stepPhysics(physics, dt);
    // dynamic fog density by depth
    const fog = scene.fog as THREE.FogExp2;
    const depth = Math.max(0, 0 - camera.position.y); // water level at 0
    const base = params.fogDensity; // GUI-controlled base
    fog.density = THREE.MathUtils.clamp(base + depth * 0.002, 0, 0.15);
    controls.update();
    xr?.update?.(dt);
    // Simple render with fallback
    if (useComposer) {
      try {
        composer.render();
      } catch (e) {
        console.warn('Composer failed, falling back to direct render:', e);
        useComposer = false;
        renderer.render(scene, camera);
      }
    } else {
      renderer.render(scene, camera);
    }
  } catch (e) {
    console.error('Animation loop error:', e);
  }
}
renderer.setAnimationLoop(animate);

// Add error handler for renderer
renderer.domElement.addEventListener('webglcontextlost', (e) => {
  console.error('WebGL context lost:', e);
});

console.log('Setup complete. Canvas size:', renderer.domElement.width, 'x', renderer.domElement.height);
