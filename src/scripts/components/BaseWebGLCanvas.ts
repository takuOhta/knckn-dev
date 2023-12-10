import { CANVAS_CONFIG } from "@constants/canvas";
import { Renderer, Camera, Transform, Program, Mesh, AxesHelper } from "ogl";
import { Plane, Sphere, Box } from "ogl";
import { ScreenUtil } from "@utils/ScreenUtil";
import { animationFrame } from "@scripts/events/AnimationFrameHandler";
import { globalResize } from "@scripts/events/GlobalEventHandler";
import type { OGLRenderingContext } from "ogl";
class BaseWebGLCanvas {
  #containerElement: HTMLDivElement;
  #gl: OGLRenderingContext;
  #renderer: Renderer;
  #scene: Transform;
  #axesHelper: AxesHelper;
  #addOnUpdate: Array<() => void>;
  #boundOnResize: () => void;
  #boundOnRender: ({ time }: { time: number }) => void;
  protected _camera: Camera;
  constructor({ element }: { element: HTMLDivElement }) {
    this.#containerElement = element;
    this.#renderer = new Renderer({ dpr: 2 });
    this.#gl = this.#renderer.gl;
    /**
     * @task DOMとmeshの位置合わせ
     */
    this._camera = new Camera(this.#gl, { fov: 35 });
    this.#scene = new Transform();

    this.#axesHelper = new AxesHelper(this.#gl, {});

    this.#addOnUpdate = [];
    this.#boundOnResize = this._onResize.bind(this);
    this.#boundOnRender = this.#render.bind(this);

    this.#initCamera();
    this.#initRenderer();
    this._addEventListener();
    this._onResize();

    const time = performance.now() / 1000;
    this.#render({ time });
  }

  /**
   * 幅
   * @returns {number}
   */
  get width() {
    return ScreenUtil.width;
  }

  /**
   * 高さ
   * @returns {number}
   */
  get height() {
    return ScreenUtil.height;
  }

  /**
   * アスペクト比
   * @returns {number}
   */
  get aspect() {
    return ScreenUtil.aspect;
  }

  /**
   * ピクセル比
   * @returns {number}
   */
  get dpr() {
    return Math.min(ScreenUtil.dpr, CANVAS_CONFIG.DPR_MAX);
  }

  /**
   * gl
   */
  get gl() {
    return this.#gl;
  }

  /**
   * scene
   */
  get scene() {
    return this.#scene;
  }

  /**
   * add update
   */
  addOnUpdate(callback: () => void) {
    this.#addOnUpdate.push(callback);
  }

  /**
   * カメラ初期化
   */
  #initCamera() {
    /**
     * @task DOMとmeshの位置合わせ
     */
    const fovRad = (CANVAS_CONFIG.CAMERA_FOV / 2) * (Math.PI / 180);
    // const dist = this.height / 2 / Math.tan(fovRad);
    this._camera.position.set(0, 1, 7);
    this._camera.lookAt([0, 0, 0]);
  }

  /**
   * レンダー初期化
   */
  #initRenderer() {
    this.#containerElement.appendChild(this.#gl.canvas as HTMLCanvasElement);
    this.#gl.clearColor(1, 1, 1, 1);
  }

  /**
   * update
   */
  #update() {
    this.#addOnUpdate.forEach((callback) => {
      callback();
    });
  }
  /**
   * レンダリング
   * @param {object} param0
   * @param {number} param0.time 経過秒数
   */
  #render({ time }: { time: number }) {
    console.log("[BaseWebGlCanvas.render]", this.#renderer);
    this.#renderer.render({ scene: this.#scene, camera: this._camera });
    this.#update();
  }

  /**
   * リサイズ
   */
  protected _onResize() {
    console.log("resize");
    this.#renderer.setSize(ScreenUtil.width, ScreenUtil.height);
    this._camera.perspective({
      aspect: this.#gl.canvas.width / this.#gl.canvas.height,
    });
  }

  /**
   * イベントリスナー登録
   */
  protected _addEventListener() {
    globalResize.add(this.#boundOnResize);
    animationFrame.add(this.#boundOnRender);
  }

  /**
   * イベントリスナー削除
   */
  #removeEventListener() {
    globalResize.remove(this.#boundOnResize);
    animationFrame.remove(this.#boundOnRender);
  }
}

export { BaseWebGLCanvas };
