import { BaseScrollOvserver } from '@scripts/SmoothScroll/BaseScrollOvserver';
import { MotionFade } from '@scripts/motion/MotionFade';
import { MotionSplitText } from '@scripts/motion/MotionSplitText';


/**
 * スクロールモーションの監視
 * @param {HTMLElement} element
 * @param {Object} options
 * @param {string} options.start
 * @param {number} options.scrub
 */

class OvserverScrollMotion extends BaseScrollOvserver {

  type: string
  isAnimationIn: boolean

  motion: MotionFade | MotionSplitText | null

  constructor(element: HTMLElement, options?: { start?: string, scrub?: number }) {
    super(element, options)

    //
    // state
    //

    this.type = element.dataset.scrollMotionType || "fade"
    this.isAnimationIn = false

    //
    // function
    //
    this.motion = null

    this.init()
  }

  /**
   * 初期化
   * @protected
   */
  protected init() {
    super.init()
    // console.log("[OvserverScrollMotion.init]")

    if (this.type === "split-text") {
      this.motion = new MotionSplitText()
    } else if (this.type === "fade")  {
      this.motion = new MotionFade()
    }
    this.motion?.init(this.element)
  }

  /**
   * 表示アニメーション処理
   * @public
   */
  public animationIn() {
    if (this.isAnimationIn || !this.motion) return false
    // console.log("[OvserverScrollMotion.animationIn]", this.motion)
    this.motion.show({stagger: 0.02, onComplete: ()=> { this.isAnimationIn = true }})

  }

  /**
    * 切り替わった際の処理
    * @protected
    * @param {Object} params
    * @param {number} params.progress
    * @param {number} params.direction
    * @param {boolean} params.isActive
    */
  protected onToggle({ progress, direction, isActive }: { progress: number, direction: number, isActive: boolean }) {
    super.onToggle({ progress, direction, isActive })
    // console.log("[OvserverScrollMotion.onToggle]", progress, direction, isActive)
    if(!super.isCurrent) return false
    this.animationIn()
  }
}

export {
  OvserverScrollMotion,
}
