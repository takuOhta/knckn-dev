import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry.js'
import { Mesh } from 'three/src/objects/Mesh.js'
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial.js'
import { DoubleSide } from 'three/src/constants.js'
// パーティクルの表示用シェーダー
import vertexShader from './shaders/shader.vert'
import fragmentShader from './shaders/shader.frag'
import { UniformsUtils } from 'three/src/renderers/shaders/UniformsUtils.js'
import { ShaderLib } from 'three/src/renderers/shaders/ShaderLib.js'
import { Vector3 } from 'three/src/math/Vector3.js'
class Wing extends Mesh {
  #size: number
  #Curvature: number = 0.5 // 羽の曲率
  material: ShaderMaterial
  constructor(size: number) {
    super()
    this.#size = size
    // ジオメトリーの作成
    this.#initGeometry()
    // マテリアルの作成
    const uniforms = UniformsUtils.clone(ShaderLib.phong.uniforms)

    this.material = new ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: DoubleSide,
      lights: true,
      uniforms: Object.assign(uniforms, {
        uSize: { value: this.#size },
        uCurvature: { value: this.#Curvature },
        uSpeed: { value: 0 },
        uTime: { value: 0.0 },
        uIndex: { value: 0.0 },
        uColor: { value: new Vector3(0, 0, 0) },
      }),
    }) as ShaderMaterial
  }
  /**
   * 3角形のジオメトリーを作成する
   */
  #initGeometry() {
    // プレーンのジオメトリーを作成
    this.geometry = new PlaneGeometry(this.#size, this.#size, 10, 10)
    this.geometry.translate(0, -this.#size / 2, 0)
  }
}

export { Wing }
