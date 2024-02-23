import { CANVAS_CONFIG } from "@constants/canvas";
import { Renderer, Camera, Transform, AxesHelper } from "ogl";
import { ScreenUtil } from "@utils/ScreenUtil";
import { animationFrame } from "@scripts/events/AnimationFrameHandler";
import { globalResize } from "@scripts/events/GlobalEventHandler";
import type { OGLRenderingContext } from "ogl";
import { smoothScroll } from "@scripts/SmoothScroll/SmoothScroll";
import { gsapK } from "@utils/AutoKillGSAP";
/**
 * WEBGL Canvas の基底クラス
 */
class BaseOGLCanvas {
  #containerElement: HTMLElement;
  #gl: OGLRenderingContext;
  #renderer: Renderer;
  #scene: Transform;
  #axesHelper: AxesHelper;
  #boundOnResize: () => void;
  #boundOnRender: ({ time }: { time: number }) => void;
  #boundOnScroll: () => void;
  protected _camera: Camera;
  constructor({ element }: { element: HTMLElement }) {
    this.#containerElement = element;
    this.#renderer = new Renderer({
      width: ScreenUtil.width,
      height: ScreenUtil.height,
      dpr: 2,
      alpha: true,
    });
    this.#gl = this.#renderer.gl;
    /**
     * @task DOMとmeshの位置合わせ
     */
    this._camera = new Camera(this.#gl, {
      fov: CANVAS_CONFIG.CAMERA_FOV,
      aspect: ScreenUtil.aspect,
      near: 1,
      far: 100000,
    });
    this.#scene = new Transform();

    this.#axesHelper = new AxesHelper(this.#gl, {});
    this.#axesHelper.setParent(this.#scene);

    this.#boundOnResize = this._onResize.bind(this);
    this.#boundOnRender = this.render.bind(this);
    this.#boundOnScroll = this._onScroll.bind(this);

    this.#initCamera();
    this.#initRenderer();
    this._addEventListener();
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
   * カメラ初期化
   */
  #initCamera() {
    /**
     * @task DOMとmeshの位置合わせ
     */
    const fovRad = (CANVAS_CONFIG.CAMERA_FOV / 2) * (Math.PI / 180);
    const dist = this.height / 2 / Math.tan(fovRad);
    this._camera.position.set(0, 0, dist);
    this._camera.lookAt([0, 0, 0]);
  }

  /**
   * レンダー初期化
   */
  #initRenderer() {
    this.#containerElement.appendChild(this.#gl.canvas as HTMLCanvasElement);
    this.#gl.clearColor(1, 1, 1, 0);
  }

  /**
   * update
   */
  protected _update() {}
  /**
   * レンダリング
   * @param {object} param0
   * @param {number} param0.time 経過秒数
   */
  render({ time }: { time: number }) {
    this.#renderer.render({ scene: this.#scene, camera: this._camera });
    this._update();
  }

  /**
   * スクロールイベント
   */
  protected _onScroll() {}

  /**
   * リサイズ
   */
  protected _onResize() {
    this.#renderer.setSize(window.innerWidth, window.innerHeight);
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
    // スクロールイベント
    // smoothScroll.addOnScroll(this.#boundOnScroll);
  }

  /**
   * イベントリスナー削除
   */
  #removeEventListener() {
    globalResize.remove(this.#boundOnResize);
    animationFrame.remove(this.#boundOnRender);
  }
}

export { BaseOGLCanvas };
