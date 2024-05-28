import { BaseOGLCanvas } from '@scripts/components/BaseOGLCanvas'
import { Color, Program, Triangle, Transform, Mesh } from 'ogl'
import vertexShader from './shaders/triangle-screen-shader.vert'
import fragmentShader from './shaders/triangle-screen-shader.frag'
/**
 * IndexページのWEBGL Canvas
 */
class TriangleScreenShaderCanvas extends BaseOGLCanvas {
  #element: HTMLElement
  #group: Transform = new Transform()
  #programArr: Array<Program> = []
  #meshArr: Array<Mesh> = []
  constructor({ element }: { element: HTMLElement }) {
    super({ element })
    this.#element = element

    // meshの初期化
    this.#initMesh()
  }

  /**
   * メッシュの初期化
   */
  #initMesh() {
    const geometry = new Triangle(super.gl)
    const program = new Program(super.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(0.3, 0.2, 0.5) },
      },
    })
    this.#programArr.push(program)
    this.#meshArr.push(new Mesh(super.gl, { geometry, program }))
    this.#meshArr.forEach((mesh) => {
      super.scene.addChild(mesh)
    })
  }

  /**
   * メッシュのリサイズ
   */
  #setMeshSize() {
    this.#meshArr.forEach((mesh) => {
      const width = this.#element.offsetWidth
      const height = this.#element.offsetHeight
      mesh.scale.set(width, height, 1)
    })
  }

  /**
   * update
   */
  #update({ time }: { time: number }) {
    this.#programArr.forEach((program) => {
      program.uniforms.uTime.value = time
    })
  }

  /**
   * レンダリング
   * @param {object} param0
   * @param {number} param0.time 経過秒数
   */
  render({ time }: { time: number }) {
    super.render({ time })
    this.#update({ time })
  }

  /**
   * リサイズ
   */
  // override _onResize() {
  //   super._onResize();
  //   ScreenUtil.resize();
  //   this.#setMeshSize();
  // }
}

export { TriangleScreenShaderCanvas }
