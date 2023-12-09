import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

/**
 * 対象要素のスクロール位置監視
 * @param {HTMLElement} element
 * @param {Object} options
 * @param {string} options.start
 * @param {number} options.scrub
 */

class BaseScrollOvserver {

  element: HTMLElement

  #start: string
  #scrub: number
  #isCurrent: boolean
  #isDisabled: boolean
  #scrollTrigger: ScrollTrigger | null
  #refreshTimer: NodeJS.Timeout | undefined

  constructor(element: HTMLElement, options?: { start?: string, scrub?: number }) {

    this.element = element

    const { start, scrub } = options || { "top bottom" : 0.7 }
    this.#start = start || "top bottom"
    this.#scrub = scrub || 0.7
    this.#isCurrent = false
    this.#isDisabled = false

    this.#scrollTrigger = null

  }

  /**
   * 初期化
    * @protected
   */
  protected init() {
    // console.log("[BaseScrollOvserver.init]" )

    this.#scrollTrigger = ScrollTrigger.create({
      trigger: this.element,
      start: this.#start,
      scrub: this.#scrub,
      onToggle: self => this.onToggle(self),
      onEnter: self => this.onEnter(self),
      onLeave: self => this.onLeave(self),
      onUpdate: self => this.onUpdate(self),
    })
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
    if (this.#isDisabled) return false
    this.#isCurrent = isActive
    // console.log("[BaseScrollOvserver.onToggle]", progress, direction, isActive)

  }

  /**
    * 開始位置を越えた際の処理
    * @protected
    * @param {Object} params
    * @param {number} params.progress
    * @param {number} params.direction
    * @param {boolean} params.isActive
    */
  protected onEnter({ progress, direction, isActive }: { progress: number, direction: number, isActive: boolean }) {
    if (this.#isDisabled) return false
    // console.log("[BaseScrollOvserver.onEnter]", progress, direction, isActive)

  }

  /**
 * 開始位置を越えた際の処理
    * @protected
    * @param {Object} params
    * @param {number} params.progress
    * @param {number} params.direction
    * @param {boolean} params.isActive
    */
  protected onLeave({ progress, direction, isActive }: { progress: number, direction: number, isActive: boolean }) {
    if (this.#isDisabled) return false
    // console.log("[BaseScrollOvserver.onLeave]", progress, direction, isActive)

  }


  /**
    * スクロール位置が変化する度に実行される
    * scrubが有効な場合そのスクロール停止後も処理中は実行される
    * @protected
    * @param {Object} params
    * @param {number} params.progress
    */
  protected onUpdate({ progress }: { progress: number }) {
    if (this.#isDisabled) return false
    // console.log("[BaseScrollOvserver.onUpdate]", progress)

  }

  /**
   * リサイズ処理
   * @protected
   */
  public onGlobalResize() {

    clearTimeout(this.#refreshTimer)
    this.#refreshTimer = setTimeout(() => {
      if (this.#scrollTrigger) this.#scrollTrigger.refresh()
    }, 3e2)

  }


  /**
  * スクロール監視を有効化
  * @public
  */
  public active() {
    this.#isDisabled = false
  }

  /**
    * スクロール監視を無効化
    * @public
    */
  public disable() {
    this.#isDisabled = true
  }

  /**
    * 対象要素が表示エリア内か取得
    * @public
    */
  public get isCurrent(): boolean {
    return this.#isCurrent
  }

}

export {
  BaseScrollOvserver,
}
