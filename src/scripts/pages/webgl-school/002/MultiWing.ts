import { BaseThreeCanvas } from '@scripts/components/BaseThreeCanvas'
import { DirectionalLight } from 'three/src/lights/DirectionalLight.js'
import { AmbientLight } from 'three/src/lights/AmbientLight.js'
import { AxesHelper } from 'three/src/helpers/AxesHelper.js'
import { Mesh } from 'three/src/objects/Mesh.js'
import { Group } from 'three/src/objects/Group.js'
import { Wings } from '@scripts/pages/webgl-school/002/Wings'
import { Vector2 } from 'three/src/math/Vector2.js'
import { Vector3 } from 'three/src/math/Vector3.js'
import { SimplexNoise } from 'three/examples/jsm/Addons.js'
import { Fog } from 'three/src/scenes/Fog.js'
/**
 * IndexページのWEBGL Canvas
 */
class MultiWing extends BaseThreeCanvas {
  #canvasElement: HTMLCanvasElement
  #directionalLight: DirectionalLight
  #ambientLight: AmbientLight
  #axesHelper: AxesHelper
  wings: Array<Group> = []
  #noise: SimplexNoise = new SimplexNoise()
  constructor({ canvasElement }: { canvasElement: HTMLCanvasElement }) {
    super({ canvasElement, orbitControls: true })
    this.#canvasElement = canvasElement
    // setting light
    this.#directionalLight = new DirectionalLight(0xffffff)
    this.#directionalLight.position.set(1.0, 1.0, 1.0)
    this.#ambientLight = new AmbientLight(0xffffff)
    // setting helper
    this.#axesHelper = new AxesHelper(1000)
    // set fog
    this.scene.fog = new Fog(0x000000, 5, 100)
    // init
    this.#init()
    console.log('MultiWing', this.#canvasElement)
  }
  static LENGTH = 200
  static SIZE = 60
  static FAR = 400
  /**
   * 初期化
   */
  #init() {
    console.log('init')
    this.scene.add(this.#directionalLight)
    this.scene.add(this.#ambientLight)
    // this.scene.add(this.#axesHelper)
    // 羽を作成
    this.#createWings()
    this.wings.forEach((wing) => {
      this.scene.add(wing)
    })
  }
  /**
   * メッシュの初期化
   */
  #createWings() {
    for (let i = 0; i < MultiWing.LENGTH; i++) {
      const wings = new Wings(MultiWing.SIZE)
      const rand = new Vector3((Math.random() - 0.5) * 2.0, (Math.random() - 0.5) * 2.0, (Math.random() - 0.5) * 2.0)
      const angle = new Vector2((rand.x + rand.y) * Math.PI * 2, (rand.x + rand.x) * Math.PI * 2)
      const radius = MultiWing.FAR + Math.random() * 20
      const x = radius * Math.sin(angle.x) * Math.cos(angle.y)
      const y = radius * Math.sin(angle.x) * Math.sin(angle.y)
      const z = radius * Math.cos(angle.x)
      wings.lookAt(-x * 10, -y * 10, -z * 10)
      wings.position.set(x, y, z)
      this.wings.push(wings)
    }
  }

  /**
   * update
   */
  override _update({ time }: { time: number }) {
    super._update({ time })

    //　カメラの回転
    {
      const angle = new Vector2(0.433 * time, 0.233 * time)
      const radius = 20000 + 5000 * Math.cos(time * 0.8) * Math.sin(time * 0.4)
      const x = radius * Math.sin(angle.x) * Math.cos(angle.y)
      const y = radius * Math.sin(angle.x) * Math.sin(angle.y)
      const z = radius * Math.cos(angle.x)
      this._camera.position.set(x, y, z)
      this._camera.lookAt(0, 0, 0)
    }
    // 羽の回転
    if (!this.wings || this.wings.length < 1) return
    this.wings.forEach((wings, index) => {
      // wings.lookAt(this._camera.position)
    })
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

export { MultiWing }
