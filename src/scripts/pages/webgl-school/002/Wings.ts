import { Group } from 'three/src/objects/Group.js'
import { Wing } from '@scripts/pages/webgl-school/002/Wing'
import { animationFrame } from '@scripts/events/AnimationFrameHandler'
import { SimplexNoise } from 'three/examples/jsm/Addons.js'
import { Vector3 } from 'three/src/math/Vector3.js'
class Wings extends Group {
  #size: number
  #wingArr: Array<Wing> = []
  #boundOnUpdate: ({ time }: { time: number }) => void = this.#update.bind(this)
  #noise: SimplexNoise = new SimplexNoise()
  constructor(size: number) {
    super()
    this.#size = size
    this.#initMeshs()
    this.#addEventListener()
  }
  /**
   * initMeshs
   */
  #initMeshs() {
    const speed = 2.0 + Math.random() * 10.0
    const index = (this.#noise.noise(speed, Math.random()) + 1.0) / 2.0
    const color = new Vector3(this.#noise.noise(index, speed), this.#noise.noise(speed, index), this.#noise.noise(index, speed + Math.random() * 0.3))
    for (let i = 0; i < 6; i++) {
      const angle: number = (i * Math.PI) / 3
      const mesh = new Wing(this.#size)
      mesh.rotateZ(angle)
      mesh.material.uniforms.uSpeed.value = speed
      mesh.material.uniforms.uIndex.value = index
      mesh.material.uniforms.uColor.value = color
      this.#wingArr.push(mesh)
      this.add(mesh)
    }
  }
  /**
   * update
   */
  #update({ time }: { time: number }) {
    const speed = this.#wingArr.forEach((wing) => {
      wing.material.uniforms.uTime.value = time
    })
    // this.rotation.z += time * 0.01
  }
  /**
   * イベント登録
   */
  #addEventListener() {
    animationFrame.add(this.#boundOnUpdate)
  }
}

export { Wings }
