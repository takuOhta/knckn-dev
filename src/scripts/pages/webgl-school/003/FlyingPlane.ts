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
import { Quaternion } from 'three/src/math/Quaternion.js'
/**
 * IndexページのWEBGL Canvas
 */
class FlyingPlane extends BaseThreeCanvas {
  #canvasElement: HTMLCanvasElement
  #directionalLight: DirectionalLight
  #ambientLight: AmbientLight
  #axesHelper: AxesHelper
  sphereMeshs: Array<Mesh> = []
  planeMesh: Mesh | undefined = undefined
  currentTargetSphere: Mesh | undefined = undefined
  previousTargetSphere: Mesh | undefined = undefined
  targetPosition: Vector3 = new Vector3(0, 0, 0)
  targetDirection: Vector3 = new Vector3(0, 1, 0).normalize()
  raycaster: Raycaster = new Raycaster()
  isRaycasting = false
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
  static PLANE_ROTATION_SPEED = 4.0
  static PLANE_SPEED = 5.0
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
    this.currentTargetSphere = this.sphereMeshs[0]
    this.previousTargetSphere = this.currentTargetSphere
    this.targetPosition = this.currentTargetSphere.position.clone()
    console.log(this.scene.children)
  }
  /**
   * createTargetSphereMesh
   */
  #createTargetSphereMesh() {
    const geometry = new SphereGeometry(10)
    const material = new MeshStandardMaterial({ color: 0xff0000 })
    const mesh = new Mesh(geometry, material)
    this.scene.add(mesh)
    return mesh
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
      const rand = 0.5 + Math.random() * 0.5
      mesh.scale.set(rand, rand, rand)
      this.sphereMeshs.push(mesh)
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
    mesh.position.set(0, FlyingPlane.SPHERE_SIZE * 1.2, 0)
    return mesh
  }
  /**
   * update
   */
  override _update({ time }: { time: number }) {
    super._update({ time })
    if (!this.planeMesh || !this.targetDirection || !this.currentTargetSphere || !this.previousTargetSphere) return

    // 現在の方向を取得
    const previousPosition = this.planeMesh.position.clone()
    const previoustDirection = this.targetDirection.clone()

    // // マウスと重なったオブジェクトを取得
    this.raycaster.setFromCamera(this.mouse, this._camera)
    const intersects = this.raycaster.intersectObjects(this.sphereMeshs)
    if (intersects.length > 0 && this.currentTargetSphere.uuid != intersects[0].object.uuid) {
      this.isRaycasting = true
    }

    // // 飛行機の目標方向を設定
    // this.currentTargetSphereを中心とした半径SPHERE_SIZE＊1.2の球上の位置を取得
    const cx = (this.currentTargetSphere.position.x - this.targetPosition.x) * 0.07
    const cy = (this.currentTargetSphere.position.y - this.targetPosition.y) * 0.07
    const cz = (this.currentTargetSphere.position.z - this.targetPosition.z) * 0.07
    this.targetPosition.add(new Vector3(cx, cy, cz))

    // cameraのlookAtを設定
    this._camera.lookAt(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z)
    // 飛行機の位置を設定
    const angle = new Vector2(0.433 * time, 0.233 * time).multiplyScalar(FlyingPlane.PLANE_SPEED)
    const radius = FlyingPlane.SPHERE_SIZE * this.currentTargetSphere.scale.x * 1.2
    const x = this.targetPosition.x + radius * Math.sin(angle.x) * Math.cos(angle.y)
    const y = this.targetPosition.y + radius * Math.sin(angle.x) * Math.sin(angle.y)
    const z = this.targetPosition.z + radius * Math.cos(angle.x)
    // 一を設定
    this.planeMesh.position.set(x, y, z)

    // 前フレームとの位置と進行方向の差分ベクトルを取得
    const subPositionVector = new Vector3().subVectors(this.planeMesh.position, previousPosition)
    subPositionVector.normalize()
    // 進行方向ベクトりに無機ベクトルをスケールして加算
    this.targetDirection.add(subPositionVector.multiplyScalar(1.0))
    this.targetDirection.normalize()

    // // 飛行機の回転
    const normalAxis = new Vector3().crossVectors(previoustDirection, this.targetDirection)
    normalAxis.normalize()
    const cos = previoustDirection.dot(this.targetDirection)
    const radian = Math.acos(cos)
    const qtn = new Quaternion().setFromAxisAngle(normalAxis, radian)
    this.planeMesh.quaternion.premultiply(qtn)
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
    this.mouse.x = (event.clientX / this.width) * 2 - 1
    this.mouse.y = -((event.clientY / this.height) * 2 - 1)
  }
  #onMouseUp = () => {
    console.log('click')
    if (this.isRaycasting) {
      this.previousTargetSphere = this.currentTargetSphere
      this.currentTargetSphere = this.raycaster.intersectObjects(this.sphereMeshs)[0].object as Mesh
    }
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
