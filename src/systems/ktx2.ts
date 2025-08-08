import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import * as THREE from 'three';

export function createKTX2Loader(renderer: THREE.WebGLRenderer) {
  const loader = new KTX2Loader();
  // BasisU transcoder path: if you add 'node_modules/three/examples/jsm/libs/basis/' to public, point to it here.
  loader.setTranscoderPath('/basis/');
  loader.detectSupport(renderer);
  return loader;
}
