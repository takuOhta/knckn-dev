/**
 * utils
 */
import { gsapK } from '@utils/AutoKillGSAP'
import { random } from '@utils/math'

/**
 * constants
 */
import { Ease } from '@constants/customEase'

/**
 * motion
 */
import { BaseMotionSplitText } from '@scripts/motion/BaseMotionSplitText'


const SHOW_EASE = 'expo.out'
const SHOW_DURATION = 1
const OUT_EASE = Ease.easeInOut
const OUT_DURATION = 1

/**
* 分割した文字をで表示/非表示するモーション
  * @param {Object} param
  * @param {HTMLElement} param.elTarget
  * @param {Boolean} param.isSetStyleOff
*/

class MotionSplitText extends BaseMotionSplitText {

  private _fromPosition: Array<number>

  constructor() {
    super()

    this._fromPosition = []
  }

  /**
  * 初期スタイル 追加処理
  */
  _addSetStyle() {
    if (!this._elTarget) return false
      // gsap.set(this._elTarget, {
      //   y: 201 + '%',
      //   willChange: 'transform'
      // })
      const y = 201 + '%'
      this._elTarget.forEach((elTarget) => {
        elTarget.style.transform = `translate(0, ${ y })`
        elTarget.style.willChange = 'transform'
      })
  }


  /**
  * 表示モーション
  * 継承先で指定
  */
  _show(delay?: number | undefined, stagger?: number | undefined, onComplete?: () => void | undefined) {
    if (this._elTarget) {
      this._elTarget.forEach((elTarget: HTMLElement, index: number)=> {
        const randomDelay = random(0, 0.2)
        const transformDelay =  0.025 * index + randomDelay
        gsapK.fromTo(elTarget, {
          y: 201 + '%',
        },{
          y: 0 + '%',
          duration: SHOW_DURATION,
          ease: SHOW_EASE,
          delay: delay ? delay + transformDelay : transformDelay,
          onComplete,
        })

      })
    }
  }

  /**
  * 非表示モーション
  * 継承先で指定
  */
  _out(delay?: number | undefined, stagger?: number | undefined, onComplete?: () => void | undefined) {
    if (this._elTarget) gsapK.to(this._elTarget, {
      y: -200 + '%',
      duration: OUT_DURATION,
      ease: OUT_EASE,
      delay,
      onComplete,
    })
  }
}

export { MotionSplitText }