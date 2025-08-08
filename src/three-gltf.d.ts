declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import { LoadingManager, Group } from 'three';
  export class GLTFLoader {
    constructor(manager?: LoadingManager);
    load(url: string, onLoad: (gltf: { scene: Group }) => void, onProgress?: (e: ProgressEvent<EventTarget>) => void, onError?: (e: any) => void): void;
  }
}
