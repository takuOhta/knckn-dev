import { BaseThreeCanvas } from '@scripts/components/BaseThreeCanvas'
import { DirectionalLight } from 'three/src/lights/DirectionalLight.js'
import { AmbientLight } from 'three/src/lights/AmbientLight.js'
import { AxesHelper } from 'three/src/helpers/AxesHelper.js'
import { Fog } from 'three/src/scenes/Fog.js'
import { SphereGeometry } from 'three/src/geometries/SphereGeometry.js'
import { ConeGeometry } from 'three/src/geometries/ConeGeometry.js'
import { Mesh } from 'three/src/objects/Mesh.js'
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js'
import { Vector2, Vector3 } from 'three'
import { Raycaster } from 'three/src/core/Raycaster.js'
import { globalMouseMove } from '@scripts/events/GlobalMouseEventHandler'
/**
 * IndexページのWEBGL Canvas
 */
class FlyingPlane extends BaseThreeCanvas {
  #canvasElement: HTMLCanvasElement
  #directionalLight: DirectionalLight
  #ambientLight: AmbientLight
  #axesHelper: AxesHelper
  #sphereMeshs: Array<Mesh> = []
  planeMesh: Mesh | undefined = undefined
  currentTargetSphere: Mesh | undefined = undefined
  targetDirection: Vector3 = new Vector3(0, 0, 0)
  #planeVelocity: Vector3 = new Vector3(0, 0, 0)
  raycaster: Raycaster = new Raycaster()
  mouse = new Vector2()
  constructor({ canvasElement }: { canvasElement: HTMLCanvasElement }) {
    super({ canvasElement, orbitControls: true })
    this.#canvasElement = canvasElement
    // setting light
    this.#directionalLight = new DirectionalLight(0xffffff)
    this.#directionalLight.position.set(1.0, 1.0, 1.0)
    this.#ambientLight = new AmbientLight(0x666666)
    // setting helper
    this.#axesHelper = new AxesHelper(1000)
    // setting raycaster
    this.raycaster = new Raycaster()
    // set fog
    // this.scene.fog = new Fog(0x000000, 5, -FlyingPlane.FAR)
    // init
    this.#addEventListeners()
    this.#init()
    console.log('FlyingPlane', this)
  }
  static SPHERE_SIZE = 100
  static SPHERE_LENGTH = 10
  static FAR = 3000
  static PLANE_SPEED = 0.4
  /**
   * 初期化
   */
  #init() {
    console.log('init')
    this.scene.add(this.#directionalLight)
    this.scene.add(this.#ambientLight)
    this.scene.add(this.#axesHelper)
    // 惑星を作成
    this.#createSphereMesh()
    // 飛行機を作成
    this.planeMesh = this.#createPlaneMesh()
    this.scene.add(this.planeMesh)
    // 目標の惑星を設定
    this.currentTargetSphere = this.#sphereMeshs[0]
  }
  /**
   * createSphereMesh
   */
  #createSphereMesh() {
    for (let i = 0; i < FlyingPlane.SPHERE_LENGTH; i++) {
      const x = ((Math.random() - 0.5) * 2 * this.width) / 2
      const y = ((Math.random() - 0.5) * 2 * this.height) / 2
      const z = (Math.random() - 0.5) * 2 * FlyingPlane.FAR
      const geometry = new SphereGeometry(FlyingPlane.SPHERE_SIZE)
      const material = new MeshStandardMaterial({ color: 0x00ffff })
      const mesh = new Mesh(geometry, material)
      mesh.position.set(x, y, z)
      this.#sphereMeshs.push(mesh)
      this.scene.add(mesh)
    }
  }
  /**
   * createPlaneMesh
   */
  #createPlaneMesh() {
    const geometry = new ConeGeometry(10, 40, 32)
    const material = new MeshStandardMaterial({ color: 0xb22222 })
    const mesh = new Mesh(geometry, material)
    return mesh
  }
  /**
   * update
   */
  override _update({ time }: { time: number }) {
    super._update({ time })
    if (!this.planeMesh || !this.targetDirection || !this.currentTargetSphere) return
    // // マウスと重なったオブジェクトを取得
    // this.raycaster.setFromCamera(this.mouse, this._camera)
    // const intersects = this.raycaster.intersectObjects(this.scene.children)
    // if (intersects.length > 0) {
    //   this.currentTargetSphere.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
    // }
    // 飛行機の目標方向を設定
    // this.currentTargetSphereを中心とした半径SPHERE_SIZE＊1.2の球上の位置を取得
    const cx = this.currentTargetSphere.position.x
    const cy = this.currentTargetSphere.position.y
    const cz = this.currentTargetSphere.position.z
    const angle = new Vector2(0.433 * time, 0.233 * time)
    const radius = FlyingPlane.SPHERE_SIZE * 1.4
    const x = cx + radius * Math.sin(angle.x) * Math.cos(angle.y)
    const y = cy + radius * Math.sin(angle.x) * Math.sin(angle.y)
    const z = cz + radius * Math.cos(angle.x)
    this.targetDirection.set(x, y, z)
    // 飛行機の方向と速度を設定
    this.#planeVelocity.subVectors(this.targetDirection, this.planeMesh.position)
    this.#planeVelocity.multiplyScalar(FlyingPlane.PLANE_SPEED)
    this.planeMesh.position.add(this.#planeVelocity)
    // this.planeMesh.lookAt(this.targetDirection)
  }
  /**
   * addEventListeners
   */
  #addEventListeners() {
    const boundOnMouseMove = this.#onMouseMove.bind(this)
    globalMouseMove.add(boundOnMouseMove)
  }

  #onMouseMove = (event: MouseEvent) => {
    this.mouse.x = (event.clientX / this.width) * 2 - 1
    this.mouse.y = -((event.clientY / this.height) * 2 - 1)
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

export { FlyingPlane }
