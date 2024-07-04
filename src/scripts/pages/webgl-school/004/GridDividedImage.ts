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
  mouse = new Vector2()
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
    this.group.add(this.#axesHelper)
    this.#texture = await loadTexture('/assets/images/webgl-school/004/Johannes_Vermeer_(1632-1675)_-_The_Girl_With_The_Pearl_Earring_(1665).jpg')
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
    if (this.imageMeshArr && this.imageMeshArr.length > 0) this.imageMeshArr.forEach((imageMesh) => imageMesh.update({ time }))

    // // // マウスと重なったオブジェクトを取得
    // if (!this.raycaster) return
    // this.raycaster.setFromCamera(this.mouse, this._camera)
    // const intersects = this.raycaster.intersectObjects(this.imageMeshArr)
    // if (this.imageMeshArr && this.imageMeshArr.length > 0 && intersects.length > 0) {
    //   console.log('intersects[0]', intersects[0])
    //   // intersect.material.uniforms.uStopTime.value = time
    // }
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
    this.mouse.x = event.clientX / this.width
    this.mouse.y = 1 - event.clientY / this.height
    // マウス位置のオフセット
    if (this.imageMeshArr && this.imageMeshArr.length > 0) {
      this.imageMeshArr.forEach((imageMesh, index) => {
        imageMesh.material.uniforms.uMouseOffset.value = new Vector2(this.mouse.x, this.mouse.y)
      })
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
