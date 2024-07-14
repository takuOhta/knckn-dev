import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry.js'
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial.js'
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js'
import { Vector2 } from 'three/src/math/Vector2.js'
import { Mesh } from 'three/src/objects/Mesh.js'

import vertexShader from './shaders/imageMesh.vert'
import fragmentShader from './shaders/imageMesh.frag'
import { globalResize } from '@scripts/events/GlobalEventHandler'

/**
 * WebGL平面メッシュ
 */
class ImageMesh extends Mesh {
  index: number
  /**
   * @param {object} param0
   * @param {number} param0.width
   * @param {number} param0.height
   */
  constructor({ width, height, texture, index, divisionNum }: { width: number; height: number; texture: any; index: number; divisionNum: number }) {
    const geometry = new PlaneGeometry(1, 1, 100, 100)
    const division = Math.sqrt(divisionNum)
    const indexX = Math.floor(index % division)
    const indexY = division - Math.floor(index / division) - 1
    const material = new ShaderMaterial({
      transparent: true,
      uniforms: {
        uTexture: {
          value: texture,
        },
        uResolution: {
          value: new Vector2(width, height),
        },
        udivisionNum: {
          value: divisionNum,
        },
        uIndex: {
          value: new Vector2(indexX, indexY),
        },
        uMouseOffset: {
          value: new Vector2(0.0, 0.0),
        },
        uReset: {
          value: 0.0,
        },
        uTime: {
          value: 0.0,
        },
        uStopTime: {
          value: -8.0,
        },
        uIsSelected: {
          value: false,
        },
      },
      vertexShader,
      fragmentShader,
    })
    super(geometry, material)
    this.index = index
    this.#addEventListener()
    this.setSize(width, height)
  }
  /**
   * サイズ設定
   * @param {number} width
   * @param {number} height
   */
  setSize(width: number, height: number) {
    this.scale.set(width, height, 1)
    // this.material.uniforms.uSize.value.set(width, height)
  }

  /**
   * 更新
   * @param {object} param0
   * @param {number} param0.time
   */
  update({ time }: { time: number }) {
    this.material.uniforms.uTime.value = time
  }

  /**
   * リサイズ
   */
  onResize(width: number, height: number) {
    this.setSize(width, height)
    // this.material.uniforms.uScreenSize.value.copy(ScreenUtil.size)
  }
  /**
   * addEventlistener
   */
  #addEventListener() {
    const boundOnResize = this.onResize.bind(this)
    globalResize.add(boundOnResize)
  }
}

export { ImageMesh }
