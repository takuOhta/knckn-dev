
import Lenis from '@studio-freight/lenis'
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

import { animationFrame } from '@scripts/events/AnimationFrameHandler'
import { globalResize } from '@scripts/events/GlobalEventHandler'

import {
  OptionsSmoothScroll,
  OptionsOvserverCurrentSection,
  ElementTargetsOvserverCurrentSection,
  OptionsOvserverScrollMotion,
  ElementTargetsOvserverScrollMotion,
  OptionsOvserverScrollParallax,
  ElementTargetsOvserverScrollParallax,
} from '@constants/smoothScroll';

import { OvserverCurrentSection } from '@scripts/SmoothScroll/OvserverCurrentSection';
import { OvserverScrollMotion } from '@scripts/SmoothScroll/OvserverScrollMotion';
import { OvserverScrollParallax } from '@scripts/SmoothScroll/OvserverScrollParallax';

/**
 * 慣性スクロール処理
 * @studio-freight/lenis
 * https://github.com/studio-freight/lenis#readme
 */

class SmoothScroll {

  #elSections: Array<HTMLElement>
  #elMotionItems: Array<HTMLElement>
  #elParallaxItems: Array<HTMLElement>

  #lenis: Lenis

  #currentSection: Array<OvserverCurrentSection>
  #scrollMotion: Array<OvserverScrollMotion>
  #scrollParallax: Array<OvserverScrollParallax>

  #addOnScroll: Array<() => void>

  #boundOnScroll: () => void
  #boundOnAnimationFrame: () => void
  #boundOnGlobalResize: () => void

  constructor() {

    //
    // element
    //
    this.#elSections = []
    this.#elMotionItems = []
    this.#elParallaxItems = []

    //
    // function
    //
    this.#lenis = new Lenis(OptionsSmoothScroll)

    this.#currentSection = []
    this.#scrollMotion = []
    this.#scrollParallax = []

    this.#addOnScroll = []

    this.#boundOnScroll = this.#onScroll.bind(this)
    this.#boundOnAnimationFrame = this.#onAnimationFrame.bind(this)
    this.#boundOnGlobalResize = this.#onGlobalResize.bind(this)
  }

  /**
   * 初期化
   * @param {HTMLElement} element
   */
  public init(element: HTMLElement) {
    // console.log("[SmoothScroll.init]", this.#lenis)

    // スクロール時に監視対象のセクション
    this.#elSections = [...element.querySelectorAll(ElementTargetsOvserverCurrentSection)] as Array<HTMLElement>
    if (this.#elSections[0]) {
      this.#elSections.forEach((elTarget, index) => {
        elTarget.setAttribute("data-scroll-section-no", index+"")
        this.#currentSection[index] = new OvserverCurrentSection(elTarget, OptionsOvserverCurrentSection)
      })
    }

    // スクロールモーション制御対象を確認
    this.#elMotionItems = [...element.querySelectorAll(ElementTargetsOvserverScrollMotion)] as Array<HTMLElement>
    if (this.#elMotionItems[0]) {
      this.#elMotionItems.forEach((elTarget, index) => {
        this.#scrollMotion[index] = new OvserverScrollMotion(elTarget, OptionsOvserverScrollMotion)
      })
    }

    // スクロールモーション制御対象を確認
    this.#elParallaxItems = [...element.querySelectorAll(ElementTargetsOvserverScrollParallax)] as Array<HTMLElement>
    if (this.#elParallaxItems[0]) {
      this.#elParallaxItems.forEach((elTarget, index) => {
        const propsStart = elTarget.dataset.scrollParallaxStart
        const {
          scrub,
          start,
          distanceRate,
        } = OptionsOvserverScrollParallax
        this.#scrollParallax[index] = new OvserverScrollParallax(elTarget, {
          scrub,
          start: propsStart || start,
          distanceRate,
        })
      })
    }

    this.#onGlobalResize()
    this.#addEventListener()
  }

  /**
    * 現在のスクロール値
    * @type {number}
    */
  public get animatedScroll(): number {
    const { animatedScroll } = this.#lenis
    return animatedScroll
  }

  /**
    * スクロールの方向
    * 0: 停止、1: 上にスクロール、-1: 下にスクロール
    * @type {number}
    */
  public get direction(): number {
    const { direction } = this.#lenis
    return direction
  }

  /**
    * ブラウザが登録した現在のスクロール値
    * @type {number}
    */
  public get actualScroll(): number {
    const { actualScroll } = this.#lenis
    return actualScroll
  }

  /**
    * 最大スクロール値
    * @type {number}
    */
  public get limit(): number {
    const { limit } = this.#lenis
    return limit
  }

  /**
    * 0から1までのページ全体のスクロール進行状況
    * @type {number}
    */
  public get progress(): number {
    const { progress } = this.#lenis
    return progress
  }

  /**
  * スクロールアニメーションを処理しているか
  * @type {boolean}
  */
  public get isScrolling(): boolean {
    const { isScrolling } = this.#lenis
    return isScrolling
  }

  /**
  * 現在表示エリアにあるセクションの番号を返す
  * @type {number}
  */
  public get currentNo(): number {
    if (!this.#currentSection[0]) return 0
    let current = 0
    this.#currentSection.some((section, index) => {
      if (section.isCurrent) {
        current = index
        return true
      }
    })
    return current
  }

  /**
    * 指定した位置までスクロールします
     * @param {number | string | HTMLElement} target
    * @param {Object} options
    * @param {number} options.offset
    * @param {number} options.lerp
    * @param {number} options.duration
    * @param {function} options.easing
    * @param {boolean} options.immediate
    * @param {boolean} options.lock
    * @param {boolean} options.force
    * @param {function} options.onComplete
    */
  public scrollTo(
    target: number | string | HTMLElement,
    options: {
      offset: number,
      lerp: number,
      duration: number,
      easing: (t: number) => number,
      immediate: boolean,
      lock: boolean,
      force: boolean,
      onComplete: () => void
    },
  ) {
    this.#lenis.scrollTo(target, options)
  }

  /**
    * 指定した値をスクロール値にセットします
     * @param {number | string | HTMLElement} target
    */
  public setScroll(target: number | string | HTMLElement) {
    this.#lenis.setScroll(target)
  }

  /**
    * 処理を開始
    */
  public start() {
    this.#lenis.start()
  }

  /**
    * 処理を停止
    */
  public stop() {
    this.#lenis.stop()
  }

  /**
   * スクロール時の処理
   */
  #onScroll() {
    // console.log("[SmoothScroll.onScroll]")
    if (this.#addOnScroll[0]) this.#addOnScroll.forEach((addOnScroll) => addOnScroll())
  }

  /**
   * requestAnimationFrame
   */
  #onAnimationFrame() {
    // console.log("[SmoothScroll.onAnimationFrame]")
    // console.log("document.activeElement", document.activeElement)
    this.#lenis.raf(animationFrame.time * 1000)
    ScrollTrigger.update()

    // 参考サイトではオフにしていたが、gsap側は推奨してないので一旦デフォルト値で進める
    // gsap.ticker.lagSmoothing(0)
  }

  /**
   * window リサイズ
   */
  #onGlobalResize() {
    if (this.#scrollParallax[0]) this.#scrollParallax.forEach((scrollParallax) => scrollParallax.onGlobalResize())
    if (this.#scrollMotion[0]) this.#scrollMotion.forEach((scrollMotion) => scrollMotion.onGlobalResize())
    if (this.#currentSection[0]) this.#currentSection.forEach((currentSection) => currentSection.onGlobalResize())
  }

  /**
   * イベント登録
   */
  #addEventListener() {
    this.#lenis.on("scroll",this.#boundOnScroll)
    animationFrame.add(this.#boundOnAnimationFrame)
    globalResize.add(this.#boundOnGlobalResize)
  }

  /**
   * イベント削除
   */
  #removeEventListener() {
    animationFrame.remove(this.#boundOnAnimationFrame)
    globalResize.remove(this.#boundOnGlobalResize)
  }

  /**
   * スクロール時に処理を追加
   * @param { function } callback
   */
  addOnScroll(callback: ()=> void) {
    this.#addOnScroll.push(callback)
  }

  /**
   * スクロール時に追加した処理を削除
   * @param { function } callback
   */
  removeOnScroll(callback: ()=> void) {
    const index = this.#addOnScroll.indexOf(callback)
    if (index >= 0) this.#addOnScroll.splice(index, 1)
  }

  /**
   * 表示セクション切り替え時に処理を追加
   * @param { Object } params
   * @param { number } params.no
   * @param { function } params.callback
   */
  addOnToggleOvserverCurrentSection({ no, callback }: { no: number, callback: ()=> void }) {
    this.#currentSection[no].addOnToggle(callback)
  }

  /**
   * 表示セクション切り替え時に処理を追加
   * @param { Object } params
   * @param { number } params.no
   * @param { function } params.callback
   */
  removeOnToggleOvserverCurrentSection({ no, callback }: { no: number, callback: ()=> void }) {
    this.#currentSection[no].removeOnToggle(callback)
  }

  /**
   * 削除
   */
  destroy() {
    this.#lenis.destroy()
    this.#removeEventListener()
  }
}

const smoothScroll = new SmoothScroll()

export {
  smoothScroll,
}
