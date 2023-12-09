import { gsap } from 'gsap'

/**
 * utils
 */
import { gsapK } from '@utils/AutoKillGSAP'

/**
 * motion
 */
import { BaseMotion } from '@scripts/motion/BaseMotion'

const SHOW_EASE = "sine.out"
const SHOW_DURATION = 0.6
const OUT_EASE = "sine.out"
const OUT_DURATION = 0.6

// 処理を無効化する際に消すcssプロパティを指定
const REMOVE_CSS_PROPERTY = ["opacity", "display"]

/**
* 要素をフェードで表示/非表示するモーション
*/

class MotionFade extends BaseMotion {
  private _showDuration: number
  private _outDuration: number

  constructor() {
    super()
    this.removeCssProperty = REMOVE_CSS_PROPERTY
    this._showDuration = SHOW_DURATION
    this._outDuration = OUT_DURATION
  }

  /**
  * 初期化
  */
  public init(elTarget: HTMLElement | Array<HTMLElement>, option?: { isSetStyleOff: boolean|null , customDuration: number|null}) {
    this._elTarget = elTarget
    if (!option?.isSetStyleOff) this._setStyle()
    if(option?.customDuration) {
      this._showDuration = option.customDuration
      this._outDuration = option.customDuration
    }
  }

  /**
  * 初期スタイル
  * 継承先で指定
  */
  _setStyle() {
    if (!this._elTarget) return false
    // gsap.set(this._elTarget, {
    //   opacity: 0,
    //   // display: 'none'
    // })
    if(Array.isArray(this._elTarget)) return
    this._elTarget.style.opacity = '0'
  }

  /**
  * 表示モーション
  */
  _show(delay: number | undefined, stagger: number | undefined, onComplete: () => void | undefined) {
    if (!this._elTarget || Array.isArray(this._elTarget) && !this._elTarget[0]) return false
    gsap.set(this._elTarget, {
      display: '',
    })
    gsapK.to(this._elTarget, {
      opacity: 1,
      duration: this._showDuration,
      ease: SHOW_EASE,
      delay,
      stagger,
      onComplete,
    })
  }

  /**
  * 非表示モーション
  */
  _out(delay: number | undefined, stagger: number | undefined, onComplete: () => void | undefined) {
    if (!this._elTarget || Array.isArray(this._elTarget) && !this._elTarget[0]) return false
    gsapK.to(this._elTarget, {
      opacity: 0,
      duration: this._outDuration,
      ease: OUT_EASE,
      delay,
      stagger,
      onComplete: ()=> {
        if(!this._elTarget) return
        gsap.set(this._elTarget, {
          display: 'none',
        })
        if(onComplete) onComplete()
      },
    })

  }

  public clearStyle() {
    if (this._elTarget)
      gsap.set(this._elTarget, {
        clearProps: "opacity",
      })
  }
}

export { MotionFade }
