/**
 * utils
 */
import { gsapK } from '@utils/AutoKillGSAP'

/**
 * motion
 */
import { BaseMotion } from '@scripts/motion/BaseMotion'

const SHOW_EASE = "sine.out"
const SHOW_DURATION = 0.3
const OUT_EASE = "sine.out"
const OUT_DURATION = 0.3

/**
* 要素をフェードで表示/非表示するモーション
*/

class MotionDisplayFade extends BaseMotion {
  constructor() {
    super()
  }

  /**
  * 初期化
  */
  public init(elTarget: HTMLElement | Array<HTMLElement>, option?: { isSetStyleOff: boolean|null }) {

    this._elTarget = elTarget
    if (!option?.isSetStyleOff) this._setStyle()
  }

  /**
  * 初期スタイル
  * 継承先で指定
  */
  _setStyle() {
    if (!this._elTarget) return false
    // if (this._elTarget)
    //   gsap.set(this._elTarget, {
    //     opacity: 0,
    //     display: 'none'
    //   })
    if(Array.isArray(this._elTarget)) return
    this._elTarget.style.opacity = '0'
    this._elTarget.style.display = 'none'
  }

  /**
  * 表示モーション
  */
  _show(delay: number | undefined, stagger: number | undefined, onComplete: () => void | undefined) {
    if (this._elTarget) {
      gsapK.to(this._elTarget, {
        opacity: 1,
        display: 'block',
        duration: SHOW_DURATION,
        ease: SHOW_EASE,
        delay,
        stagger,
        onComplete,
      })
    }
  }

  /**
  * 非表示モーション
  */
  _out(delay: number | undefined, stagger: number | undefined, onComplete: () => void | undefined) {
    if (this._elTarget) {
      gsapK.to(this._elTarget, {
        opacity: 0,
        display: 'none',
        duration: OUT_DURATION,
        ease: OUT_EASE,
        delay,
        stagger,
        onComplete: ()=> {
          if(onComplete) onComplete()
        },
      })
    }
  }
}

export { MotionDisplayFade }
