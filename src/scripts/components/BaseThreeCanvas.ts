import { gsap } from 'gsap'
import GUI from 'lil-gui'

// three
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js'
import { Group } from 'three/src/objects/Group.js'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js'
import { Scene } from 'three/src/scenes/Scene.js'
import { AxesHelper } from 'three/src/helpers/AxesHelper.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { CANVAS_CONFIG } from '@constants/canvas'

import { animationFrame } from '@scripts/events/AnimationFrameHandler'
import { globalResize } from '@scripts/events/GlobalEventHandler'
import { ScreenUtil } from '@utils/ScreenUtil'
/**
 * 共通 WebGL Canvas
 */
class BaseThreeCanvas {
  /**
   * @param {object} param0
   * @param {HTMLCanvasElement} param0.element [data-canvas="root"]
   */
  protected _canvasElement: HTMLCanvasElement
  scene: Scene
  group: Group
  #scrollY: number
  #axesHelper: AxesHelper
  #orbitControls: OrbitControls
  protected _camera: PerspectiveCamera
  protected _guiParam: object
  protected _gui: GUI
  protected _renderer: WebGLRenderer
  #boundOnResize: () => void
  #boundOnRender: ({ time }: { time: number }) => void
  // #boundOnAnimationFrame: (time: number) => void

  constructor({ canvasElement, orbitControls }: { canvasElement: HTMLCanvasElement; orbitControls?: boolean }) {
    this._canvasElement = canvasElement
    // this._canvasElement.style.height = `${ CANVAS_CONFIG.HEIGHT_SCALE * 100 }%`

    // レンダラー初期化
    this._renderer = new WebGLRenderer({
      canvas: this._canvasElement,
      antialias: true,
      alpha: true,
    })
    this.#initRenderer()
    // カメラ初期化
    const fovRad = (CANVAS_CONFIG.CAMERA_FOV / 2) * (Math.PI / 180)
    const dist = this.height / 2 / Math.tan(fovRad)
    this._camera = new PerspectiveCamera(CANVAS_CONFIG.CAMERA_FOV, this.aspect, 1, 100000)
    this._camera.position.set(0, 0, dist)

    // orbitControles
    if (orbitControls) this.#orbitControls = new OrbitControls(this._camera, this._canvasElement)
    this._gui = new GUI()
    this._guiParam = {}
    this._initGui()

    this.scene = new Scene()
    this.group = new Group()
    this.scene.add(this.group)

    this.#axesHelper = new AxesHelper(200)
    // this.group.add(this.#axesHelper);

    this.#scrollY = 0

    this.#boundOnResize = this.onResize.bind(this)
    this.#boundOnRender = this.render.bind(this)

    this._addEventListener()
    this.addAnimationFrame()

    const time = performance.now() / 1000
    this.render({ time })
    console.log('BaseThreeCanvas constructor')
  }

  /**
   * 幅
   * @returns {number}
   */
  get width() {
    return ScreenUtil.width
  }

  /**
   * 高さ
   * @returns {number}
   */
  get height() {
    return ScreenUtil.height
  }

  /**
   * アスペクト比
   * @returns {number}
   */
  get aspect() {
    return ScreenUtil.aspect
  }

  /**
   * ピクセル比
   * @returns {number}
   */
  get dpr() {
    return Math.min(ScreenUtil.dpr, CANVAS_CONFIG.DPR_MAX)
  }

  /**
   * GUI初期化
   */
  protected _initGui() {
    this._gui.close()

    // for debug
    let isHiddenGui = true
    gsap.set(this._gui.domElement, { autoAlpha: 0 })
    window.addEventListener('keydown', (event) => {
      if (event.key === 'G') {
        if (isHiddenGui) {
          gsap.set(this._gui.domElement, { autoAlpha: 1 })
          isHiddenGui = false
        } else {
          gsap.set(this._gui.domElement, { autoAlpha: 0 })
          isHiddenGui = true
        }
      }
    })
  }

  /**
   * レンダラー初期化
   */
  #initRenderer() {
    const { clientWidth, clientHeight } = this._canvasElement
    this._renderer?.setClearAlpha(0)
    this._renderer?.setPixelRatio(this.dpr)
    this._renderer.setSize(clientWidth, clientHeight, false)
  }

  /**
   * イベントリスナー登録
   */
  protected _addEventListener() {
    globalResize.add(this.#boundOnResize)
  }

  /**
   * イベントリスナー削除
   */
  #removeEventListener() {
    globalResize.remove(this.#boundOnResize)
  }

  /**
   * スクロール量を設定
   * @param {number} scrollY
   */
  setScrollY(scrollY: number) {
    this.#scrollY = scrollY
    // console.log('setScrollY', this.#scrollY)
    // this.#element.style.transform = `translate3d(0, ${ this.#scrollY }px, 0)`
    this.group.position.y = this.#scrollY
  }

  /**
   * canvasサイズ更新
   */
  updateSize() {
    const { width, height, clientWidth, clientHeight } = this._canvasElement

    if (width !== clientWidth || height !== clientHeight) {
      // console.log('canvas resize')
      // this.#width = document.getElementById('__nuxt') ? document.getElementById('__nuxt')?.clientWidth as number: 0
      // this.#height = document.getElementById('__nuxt') ? document.getElementById('__nuxt')?.clientHeight as number: 0
      this._renderer.setSize(clientWidth, clientHeight, false)
    }
  }

  /**
   * レンダリング
   * @param {object} param0
   * @param {number} param0.time 経過秒数
   */
  render({ time }: { time: number }) {
    // console.log('[BaseThreeCanvas.render]')
    this.updateSize()
    this._renderer.render(this.scene, this._camera)
  }

  /**
   * メディア切り替え時
   * @param {boolean} isPc
   */
  onMediaChange(isPc: boolean) {
    // console.log('[BaseThreeCanvas.onMediaChange]', isPc)
  }

  /**
   * リサイズ
   */
  protected onResize() {
    const fovRad = (this._camera.fov / 2) * (Math.PI / 180)
    const dist = this.height / 2 / Math.tan(fovRad)
    this._camera.aspect = this.aspect
    this._camera.position.z = dist
    this._renderer.setPixelRatio(this.dpr)
    this._renderer.setSize(this.width, this.height)
    this._camera.updateProjectionMatrix()
  }

  /**
   * 削除
   * removeEventListener や メモリ解放などを行う
   */
  destroy() {
    // this.gui.destroy()
    console.log('[BaseThreeCanvas.destroy]')
  }

  /**
   * addAnimationFrame
   */
  addAnimationFrame() {
    animationFrame.add(this.#boundOnRender)
  }

  /**
   * removeAnimationFrame
   */
  removeAnimationFrame() {
    animationFrame.remove(this.#boundOnRender)
  }
}

export { BaseThreeCanvas }
