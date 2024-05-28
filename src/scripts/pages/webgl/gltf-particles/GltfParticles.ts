import { BaseThreeCanvas } from '@scripts/components/BaseThreeCanvas'
import { GPUComputationRenderer, type Variable } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { InstancedBufferGeometry } from 'three/src/core/InstancedBufferGeometry.js'
import { InstancedBufferAttribute } from 'three/src/core/InstancedBufferAttribute.js'
import { SphereGeometry } from 'three/src/geometries/SphereGeometry.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { AmbientLight } from 'three/src/lights/AmbientLight.js'
import { Mesh } from 'three/src/objects/Mesh.js'
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial.js'
import { Vector2, Vector3, Color, Texture, Fog } from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader.js'

/**
 * shaders
 */
// 位置情報と方向ベクトルを格納すためのシェーダー
import computePositionShader from './shaders/computePositionShader.frag'
import computeUvShader from './shaders/computeUvShader.frag'
// パーティクルの表示用シェーダー
import vertexShader from './shaders/shader.vert'
import fragmentShader from './shaders/shader.frag'

const GLTF_PATH = '/assets/models/red-spider-lily/'
const GLTF_NAME = 'red-spider-lily_particles.gltf'
const GLTF_MESH_NAME = 'PL-QS1310-1all-3'
const TEXTURE_PATH = '/assets/models/red-spider-lily/textures/PL-QS1310-1all-3.jpg'
const PARTICLE_NUM = 20000
const TEXTURE_WIDTH = Math.sqrt(PARTICLE_NUM)
/**
 * IndexページのWEBGL Canvas
 */
class GltfParticles extends BaseThreeCanvas {
  #canvasElement: HTMLCanvasElement
  #GLTFLoader: GLTFLoader
  #light: AmbientLight = new AmbientLight()
  boundOnMouseMove: ({ clientX, clientY }: { clientX: number; clientY: number }) => void
  material: ShaderMaterial | undefined = undefined
  #gltfMesh: Mesh | undefined = undefined
  gpuComputeRenderer: GPUComputationRenderer
  #gpuComputePositionVariables: Variable | undefined
  #gpuComputePositionUniforms: object = {}
  #gpuComputeUvVariables: Variable | undefined
  #gpuComputeUvUniforms: object = {}
  #meshSurfaceSampler: MeshSurfaceSampler | undefined = undefined
  #meshParticle: Mesh | undefined = undefined
  #particleUniforms: object = {}
  #texture: Texture | undefined = undefined
  constructor({ canvasElement }: { canvasElement: HTMLCanvasElement }) {
    super({ canvasElement, orbitControls: true })
    this.#canvasElement = canvasElement
    // lightの追加
    this.scene.add(this.#light)

    // フォグを設定
    // new THREE.Fog(色, 開始距離, 終点距離);
    this.scene.fog = new Fog(0x000000, 50, 2000)

    // particleUniformsの初期化
    this.#particleUniforms = this.#getParticleUniforms()

    // gpucomputeRendererの初期化
    this.#gpuComputePositionUniforms = this.#gpuComputePositionVariables?.material.uniforms as object
    this.#gpuComputeUvUniforms = this.#gpuComputeUvVariables?.material.uniforms as object
    this.gpuComputeRenderer = new GPUComputationRenderer(TEXTURE_WIDTH, TEXTURE_WIDTH, this._renderer)

    // GLTFLoader RGBELoaderの初期化
    this.#GLTFLoader = new GLTFLoader().setPath(GLTF_PATH)
    this.#init()

    // イベント登録
    // this.boundOnMouseMove = this.onMouseMove.bind(this);
    // this._addEventListener();

    console.log('GltfParticles', this.#canvasElement)
  }

  /**
   * パーティクルに渡すUniformを取得する
   */
  #getParticleUniforms() {
    return {
      uTime: {
        value: 0.0,
      },
      uColorOffset: {
        value: 0.2,
      },
      uTextureSize: {
        value: new Vector2(TEXTURE_WIDTH, TEXTURE_WIDTH),
      },
      // uParticleSize: {
      //   value: this._particleSize,
      // },
      texturePosition: { value: null },
      textureUv: { value: null },
      uTexture: { value: this.#texture },
    }
  }

  /**
   * getGeometry
   */
  async #getGeometry(): Promise<Mesh> {
    return new Promise<Mesh>((resolve) => {
      this.#GLTFLoader.load(GLTF_NAME, (object) => {
        console.log(object)
        object.scene.traverse((child) => {
          // main という名前のオブジェクト
          if (child.name === GLTF_MESH_NAME) {
            child.scale.set(60, 60, 60)
            // this.scene.add(child);
            resolve(child as Mesh)
          }
        })
      })
    })
  }

  /**
   * 初期化
   */
  async #init() {
    // gltfの読み込み
    const loader = new TextureLoader() // テクスチャローダーを作成
    this.#texture = await loader.load(TEXTURE_PATH) // テクスチャ読み込み
    this.#texture.flipY = false
    this.#gltfMesh = await this.#getGeometry()
    this.#particleUniforms.uTexture.value = this.#texture
    console.log('texture01', this.#particleUniforms.uTexture.value)
    // サンプラーの初期化
    this.#meshSurfaceSampler = new MeshSurfaceSampler(this.#gltfMesh).build()

    // コンピュートレンダラーの初期化
    this.#initComputeRenderer()

    // meshの初期化
    this.#initParticlesMesh()
  }

  /**
   *
   */
  #initComputeRenderer() {
    // webgl2じゃなかったら半精度浮動小数点を使用する（16bit）
    // if (this._renderer.capabilities.isWebGL2 === false) {
    //   this._gpuCompute.setDataType(THREE.HalfFloatType);
    // }

    // 位置・ベクトル情報を格納するテクスチャ生成/テクスチャに位置・ベクトル情報追加
    this.#initPositionTexture()

    // velVar、posVarに設定されたフラグメントシェーダーそれぞれからテクスチャが参照できるようする為の前準備
    this.gpuComputeRenderer.setVariableDependencies(this.#gpuComputePositionVariables as Variable, [this.#gpuComputePositionVariables as Variable])
    this.gpuComputeRenderer.setVariableDependencies(this.#gpuComputeUvVariables as Variable, [this.#gpuComputeUvVariables as Variable])

    // コンピュートシェーダ処理用のレンダラーの初期化
    this.gpuComputeRenderer.init()
  }

  /**
   *
   */
  #initPositionTexture() {
    // テクスチャから取得したデータ（float型の配列）
    const positionTexture = this.gpuComputeRenderer.createTexture()
    const positionArray = positionTexture.image.data
    const uvTexture = this.gpuComputeRenderer.createTexture()
    const uvArray = uvTexture.image.data

    for (let k = 0, kl = positionArray.length; k < kl; k += 4) {
      // gltfで読み込んだジオメトリの位置情報を挿入する
      // 余ったテクスチャどうしよう
      const pos = new Vector3()
      const normal = new Vector3()
      const color = new Color()
      const uv = new Vector2()
      this.#meshSurfaceSampler?.sample(pos, normal, color, uv)

      // positionの登録
      positionArray[k + 0] = pos.x
      positionArray[k + 1] = pos.y
      positionArray[k + 2] = pos.z
      positionArray[k + 3] = 1.0

      // uvの登録
      uvArray[k + 0] = uv.x
      uvArray[k + 1] = uv.y
      uvArray[k + 2] = 0.0
      uvArray[k + 3] = 0.0
    }
    // console.log("positionArray", positionTexture.image.data);
    // console.log("uvArray", uvTexture.image.data);

    // materialやtextureなどのデータを格納しておくオブジェクトの生成
    this.#gpuComputePositionVariables = this.gpuComputeRenderer.addVariable('texturePosition', computePositionShader, positionTexture)
    this.#gpuComputeUvVariables = this.gpuComputeRenderer.addVariable('textureUv', computeUvShader, uvTexture)
  }

  /**
   *
   */
  #initParticlesMesh() {
    const sphere = new SphereGeometry()
    // パーティクル一粒の見え方制御用マテリアル
    const material = new ShaderMaterial({
      uniforms: this.#particleUniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      // blending: AdditiveBlending,
      depthTest: false,
    })

    // 頂点情報を格納するためのバッファジオメトリ
    const geometry = new InstancedBufferGeometry()
    const vertice = sphere.attributes.position.clone()
    geometry.setAttribute('position', vertice)
    const uv = sphere.attributes.uv.clone()
    geometry.setAttribute('uv', uv)
    const indices = sphere.index.clone()
    geometry.setIndex(indices)
    // 位置情報を格納するfloat型の配列を作成
    const instanceId = new InstancedBufferAttribute(new Int32Array(PARTICLE_NUM * 1), 1)
    for (let i = 0; i < PARTICLE_NUM; i++) {
      instanceId.setX(i, i)
    }
    // ジオメトリのattributeに追加
    geometry.setAttribute('instanceId', instanceId)

    // バッファ使えるようにするおまじない
    material.extensions.drawBuffers = true
    // ポイントメッシュを作成
    this.#meshParticle = new Mesh(geometry, material)
    this.#meshParticle.frustumCulled = false
    this.#meshParticle.matrixAutoUpdate = false
    // ローカル座標の更新
    this.#meshParticle.updateMatrix()

    console.log(this.#meshParticle)
    this.scene.add(this.#meshParticle)
  }

  /**
   * onMouseMoveEvent
   */
  onMouseMove({ clientX, clientY }: { clientX: number; clientY: number }) {
    console.log(clientX, clientY)
    const mouse = new Vector2()
    const worldMouse = new Vector3()
    mouse.x = ((clientX - this._renderer.domElement.offsetLeft) / this._renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -((clientY - this._renderer.domElement.offsetTop) / this._renderer.domElement.clientHeight) * 2 + 1
    worldMouse.set(mouse.x, mouse.y, (this._camera.near + this._camera.far) / (this._camera.near - this._camera.far))
    worldMouse.unproject(this._camera)
    worldMouse.z = 0
    if (this.material) this.material.uniforms.uMouse.value = worldMouse
  }

  /**
   * addEventListener
   */
  protected _addEventListener(): void {
    super._addEventListener()
    // if (this.material) globalMouseMove.add(this.boundOnMouseMove);
  }

  /**
   * update
   */
  update({ time }: { time: number }) {
    // if (this.material) this.material.uniforms.uTime.value = time;
  }

  /**
   * レンダリング
   * @param {object} param0
   * @param {number} param0.time 経過秒数
   */
  render({ time }: { time: number }) {
    super.render({ time })
    if (!this.gpuComputeRenderer || !this.#meshParticle) return
    // computeRendererの更新 GPUComputationRenderer.doRenderTargetsでvariableごとにcompute出来そう
    this.gpuComputeRenderer.compute()
    // テクスチャユニフォームする
    this.#particleUniforms.texturePosition.value = this.gpuComputeRenderer.getCurrentRenderTarget(this.#gpuComputePositionVariables as Variable).texture
    this.#particleUniforms.textureUv.value = this.gpuComputeRenderer.getCurrentRenderTarget(this.#gpuComputeUvVariables as Variable).texture
    this.#particleUniforms.uTexture.value = this.#texture
    // console.log("texture02", this.#particleUniforms);
    // if (this.material) this.update({ time });
  }
}

export { GltfParticles }
