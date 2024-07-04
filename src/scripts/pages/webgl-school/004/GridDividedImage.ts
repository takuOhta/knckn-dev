import { BaseThreeCanvas } from '@scripts/components/BaseThreeCanvas'
import { DirectionalLight } from 'three/src/lights/DirectionalLight.js'
import { AmbientLight } from 'three/src/lights/AmbientLight.js'
import { AxesHelper } from 'three/src/helpers/AxesHelper.js'
import { Fog } from 'three/src/scenes/Fog.js'
import { Mesh } from 'three/src/objects/Mesh.js'
import { Vector2, Vector3 } from 'three'
import { Raycaster } from 'three/src/core/Raycaster.js'
import { globalMouseMove } from '@scripts/events/GlobalMouseEventHandler'
import { ImageMesh } from '@scripts/pages/webgl-school/004/ImageMesh'
import { TextureLoader } from 'three/src/loaders/TextureLoader.js'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
const texLoader = new TextureLoader()
/**
 * テクスチャ読み込み
 * @param {string} src
 * @returns {Promise<Texture>}
 */
const loadTexture = (src: string) => {
  return new Promise((resolve, reject) => {
    texLoader.load(src, resolve, undefined, reject)
  })
}

/**
 * テクスチャ（配列）読み込み
 */
const loadTextures = (srcs: Array<string>) => {
  return Promise.all(srcs.map((src) => loadTexture(src)))
}
/**
 * IndexページのWEBGL Canvas
 */
class GridDividedImage extends BaseThreeCanvas {
  #element: HTMLElement
  #canvasElement: HTMLCanvasElement
  #imageContainerElement: HTMLElement
  #imageElementArr: Array<HTMLElement>
  #directionalLight: DirectionalLight
  #ambientLight: AmbientLight
  #axesHelper: AxesHelper
  imageMeshArr: Array<ImageMesh> = []
  #texture: any
  raycaster: Raycaster = new Raycaster()
  isRaycasting = false
  mouse = new Vector2(0, 0)
  targetMousePoint = new Vector2(0, 0)
  resetPct: number = 0
  static FAR = 100
  constructor({ element }: { element: HTMLElement }) {
    const canvasElement = element.querySelector<HTMLCanvasElement>('canvas')!
    super({ canvasElement, orbitControls: false })
    this.#element = element
    this.#canvasElement = canvasElement
    this.#imageContainerElement = element.querySelector<HTMLElement>('[data-giriddividedimage="container"]')!
    this.#imageElementArr = [...element.querySelectorAll<HTMLElement>('[data-giriddividedimage="image"]')]
    // setting light
    this.#directionalLight = new DirectionalLight(0xffffff)
    this.#directionalLight.position.set(1.0, 1.0, 1.0)
    this.#ambientLight = new AmbientLight(0x666666)
    // setting helper
    this.#axesHelper = new AxesHelper(1000)
    // setting raycaster
    this.raycaster = new Raycaster()
    // set fog
    // this.scene.fog = new Fog(0x000000, 5, GridDividedImage.FAR)
    // init
    // this._renderer.setClearColor(0x000000, 0)
    this.#init()
    console.log('Divis', this)
  }
  /**
   * 初期化
   */
  async #init() {
    console.log('init')
    this.#addEventListeners()
    this.group.add(this.#directionalLight)
    this.group.add(this.#ambientLight)
    // this.group.add(this.#axesHelper)
    this.#texture = await loadTexture('https://picsum.photos/1920/1080')
    this.#initPlanes()
    this.imageMeshArr.forEach((imageMesh) => this.group.add(imageMesh))
  }

  /**
   * PlaneMeshを配置
   */
  #initPlanes() {
    this.#imageElementArr.forEach((imageElement, index) => {
      const imageMesh = new ImageMesh({ width: imageElement.clientWidth, height: imageElement.clientHeight, texture: this.#texture, index, divisionNum: this.#imageElementArr.length })
      // メッシュの位置を調整
      const x = imageElement.getBoundingClientRect().left - this.width / 2 + imageMesh.scale.x / 2
      const y = -(imageElement.getBoundingClientRect().top + window.scrollY) + this.height / 2 - imageMesh.scale.y / 2
      imageMesh.position.set(x, y, 0)
      this.imageMeshArr.push(imageMesh)
    })
  }

  /**
   * update
   */
  override _update({ time }: { time: number }) {
    super._update({ time })
    if (!this.imageMeshArr || this.imageMeshArr.length <= 0) return

    const subX = this.targetMousePoint.x - this.mouse.x
    const subY = this.targetMousePoint.y - this.mouse.y

    this.mouse.x += subX * 0.05
    this.mouse.y += subY * 0.05

    // マウス位置のオフセット
    this.imageMeshArr.forEach((imageMesh, index) => {
      imageMesh.material.uniforms.uMouseOffset.value = new Vector2(this.mouse.x, this.mouse.y)
      imageMesh.material.uniforms.uReset.value = this.resetPct
    })

    // meshのアップデート
    this.imageMeshArr.forEach((imageMesh) => imageMesh.update({ time }))

    // リセット値のアップデート
    if (this.resetPct <= 0.0) return
    this.resetPct -= 0.005
  }
  /**
   * addEventListeners
   */
  #addEventListeners() {
    const boundOnMouseMove = this.#onMouseMove.bind(this)
    const boundOnMouseUp = this.#onMouseUp.bind(this)
    globalMouseMove.add(boundOnMouseMove)
    document.addEventListener('mouseup', boundOnMouseUp, false)
  }

  #onMouseMove = (event: MouseEvent) => {
    // マウス位置の更新
    this.targetMousePoint.x = event.clientX / this.width
    this.targetMousePoint.y = 1.0 - event.clientY / this.height

    // // マウスと重なったオブジェクトを取得
    if (!this.raycaster) return
    this.raycaster.setFromCamera(this.mouse, this._camera)
    const intersects = this.raycaster.intersectObjects(this.scene.children)
    if (intersects.length > 0) {
      // リセット値の更新
      if (this.resetPct < 1.0) {
        this.resetPct += 0.02
      }

      // console.log('intersects[0]', intersects[0])
      // intersects[0].material.uniforms.uStopTime.value = time
    }
  }
  #onMouseUp = () => {
    console.log('click')
  }

  /**
   * レンダリング
   * @param {object} param0
   * @param {number} param0.time 経過秒数
   */
  override render({ time }: { time: number }) {
    super.render({ time })
  }
}

export { GridDividedImage }
