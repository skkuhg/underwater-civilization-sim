declare module 'three/examples/jsm/controls/OrbitControls.js' {
  import { Camera, EventDispatcher, MOUSE, TOUCH, Vector3 } from 'three';
  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    object: Camera;
    domElement: HTMLElement;
    enabled: boolean;
    target: Vector3;
    minDistance: number;
    maxDistance: number;
    enableDamping: boolean;
    update(): boolean;
  }
}
