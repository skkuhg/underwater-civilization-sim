declare module 'three/examples/jsm/postprocessing/EffectComposer.js' {
  import { WebGLRenderer, WebGLRenderTarget } from 'three';
  export class EffectComposer {
    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
    addPass(pass: any): void;
    setSize(w: number, h: number): void;
    render(dt?: number): void;
  }
}
declare module 'three/examples/jsm/postprocessing/RenderPass.js' {
  import { Camera, Scene } from 'three';
  export class RenderPass {
    constructor(scene: Scene, camera: Camera);
  }
}
declare module 'three/examples/jsm/postprocessing/UnrealBloomPass.js' {
  import { Vector2 } from 'three';
  export class UnrealBloomPass {
    constructor(resolution: Vector2, strength?: number, radius?: number, threshold?: number);
    strength: number;
  }
}
declare module 'three/examples/jsm/postprocessing/ShaderPass.js' {
  export class ShaderPass {
    constructor(shader: any, textureID?: string);
    renderToScreen?: boolean;
  }
}
declare module 'three/examples/jsm/loaders/KTX2Loader.js' {
  import { WebGLRenderer, Texture } from 'three';
  export class KTX2Loader {
    setTranscoderPath(path: string): this;
    detectSupport(renderer: WebGLRenderer): this;
    load(url: string, onLoad: (texture: Texture) => void): void;
  }
}
