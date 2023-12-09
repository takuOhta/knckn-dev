import { gsap } from "gsap"
import { isMobile, isTablet } from '@utils/navigator'

import {
  ElementTargetsOvserverScrollParallaxChild,
  ElementTargetsOvserverScrollParallaxReverse,
  ElementTargetsOvserverScrollParallaxReverseChild,
} from '@constants/smoothScroll';

import { BaseScrollOvserver } from '@scripts/SmoothScroll/BaseScrollOvserver';

/**
 * スクロール視差効果の処理
 * @param {HTMLElement} element
 * @param {Object} options
 * @param {string} options.start
 * @param {number} options.scrub
 * @param {number} options.distanceRate
 */

class OvserverScrollParallax extends BaseScrollOvserver {

  elTarget: HTMLElement
  elTargetReverse: HTMLElement
  elTargetReverseChild: HTMLElement

  dir: string
  dirMinus: number
  progress: number
  distance: number
  rate: number
  isElChildReverse: boolean
  setter: Function
  setterReverse: Function

  constructor(element: HTMLElement, options?: { start?: string, scrub?: number, distanceRate?: number }) {
    super(element, options)

    //
    // element
    //
    this.elTarget = element.querySelector(ElementTargetsOvserverScrollParallaxChild) as HTMLElement
    this.elTargetReverse = element.querySelector(ElementTargetsOvserverScrollParallaxReverse) as HTMLElement
    this.elTargetReverseChild = element.querySelector(ElementTargetsOvserverScrollParallaxReverseChild) as HTMLElement

    //
    // state
    //

    this.dir = element.dataset.scrollParallaxDir || "y"
    this.dirMinus = element.dataset.scrollParallaxDirMinus ? -1 : 1
    this.progress = 0
    this.distance = 0
    this.rate = (Number(element.dataset.scrollParallaxRate) || options?.distanceRate) as number
    // if (isMobile) this.rate = this.rate * 0.5
    // 逆向きにアニメーションさせる子要素があるか判定
    this.isElChildReverse = this.elTargetReverse ? true : false

    //
    // function
    //

    this.setter = gsap.quickSetter(this.elTarget, this.dir, "px")
    this.setterReverse = this.isElChildReverse ? gsap.quickSetter(this.elTargetReverseChild, this.dir, "px") : () => {}

    this.init()
  }

  /**
   * 初期化
    * @protected
   */
  protected init() {
    super.init()
    // console.log("[OvserverScrollParallax.init]")
    gsap.set(this.elTarget, { willChange: "transform" })
    if (this.isElChildReverse) gsap.set(this.elTargetReverseChild, { willChange: "transform" })
  }

  /**
   * 視差効果アニメーション
   */
  public animation() {
    // console.log("[OvserverScrollParallax.animation]", this.progress, this.distance * this.progress)
    this.setter(this.distance * this.progress)
    if (this.isElChildReverse) this.setterReverse(this.distance * this.progress * -1)
  }

  /**
    * スクロール位置が変化する度に実行される
    * scrubが有効な場合そのスクロール停止後も処理中は実行される
    * @protected
    * @param {Object} params
    * @param {number} params.progress
    */
  protected onUpdate({ progress }: { progress: number }) {
    if (progress >= 1) return false
    super.onUpdate({ progress })
    this.progress = progress
    this.animation()
  }

  /**
   * リサイズ処理
   * @protected
   */
  onGlobalResize() {
    super.onGlobalResize()
    this.distance = this.element.clientHeight * this.rate * this.dirMinus
    // console.log("[OvserverScrollParallax.onGlobalResize]", this.distance)
  }
}

export {
  OvserverScrollParallax,
}
