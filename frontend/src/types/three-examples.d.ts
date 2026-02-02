declare module "three/examples/jsm/controls/OrbitControls" {
  import type { Camera, EventDispatcher } from "three";

  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    enableDamping: boolean;
    enableZoom: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    update(): void;
    dispose(): void;
    addEventListener(type: string, listener: (event: unknown) => void): void;
  }
}

declare module "three/examples/jsm/postprocessing/EffectComposer" {
  import type { WebGLRenderer, WebGLRenderTarget } from "three";
  import type { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
  import type { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

  export class EffectComposer {
    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
    addPass(pass: RenderPass | UnrealBloomPass): void;
    render(deltaTime?: number): void;
    setSize(width: number, height: number): void;
    dispose(): void;
  }
}

declare module "three/examples/jsm/postprocessing/RenderPass" {
  import type { Camera, Scene } from "three";

  export class RenderPass {
    constructor(scene: Scene, camera: Camera);
  }
}

declare module "three/examples/jsm/postprocessing/UnrealBloomPass" {
  import type { Vector2 } from "three";

  export class UnrealBloomPass {
    constructor(resolution: Vector2, strength: number, radius: number, threshold: number);
  }
}
