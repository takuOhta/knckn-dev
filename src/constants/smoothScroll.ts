import { isMobile, isTablet } from '@utils/navigator'

const isMobileMode: boolean = isMobile() || isTablet()

/**
 * ページ全体の慣性スクロールの設定
 * @studio-freight/lenis
 * https://github.com/studio-freight/lenis#readme
 */
export const OptionsSmoothScroll: {
  lerp: number
} = {
  lerp: isMobileMode ? 1 : 0.08,
}
Object.freeze(OptionsSmoothScroll)

/**
 * 表示セクションの監視に関する設定
 * GSAP ScrollTrigger
 * https://greensock.com/docs/v3/Plugins/ScrollTrigger
 */
export const OptionsOvserverCurrentSection: {
  scrub: number,
  start: string
} = {
  scrub: 1,
  start: "top top",
}
Object.freeze(OptionsOvserverCurrentSection)

/**
 * 表示セクションの監視の処理対象
 */
export const ElementTargetsOvserverCurrentSection: string = '[data-scroll-section="item"]'

/**
 * スクロールモーションに関する設定
 * GSAP ScrollTrigger
 * https://greensock.com/docs/v3/Plugins/ScrollTrigger
 */
export const OptionsOvserverScrollMotion: {
  scrub: number
} = {
  scrub: 1,
}
Object.freeze(OptionsOvserverScrollMotion)

/**
 * スクロールモーションの処理対象
 */
export const ElementTargetsOvserverScrollMotion: string = '[data-scroll-motion="item"]'

/**
 * スクロールモーションに関する設定
 * GSAP ScrollTrigger
 * https://greensock.com/docs/v3/Plugins/ScrollTrigger
 *
 */
export const OptionsOvserverScrollParallax: {
  scrub: number,
  start: string,
  distanceRate: number
} = {
  scrub: isMobileMode ? 1 : 0.5,
  start: "top bottom",
  distanceRate: 0.2, // 要素のラッパーに対して動かす割合。要素個別に指定がない場合デフォルトで反映するもの
}
Object.freeze(OptionsOvserverScrollParallax)

/**
 * スクロールモーションの処理対象
 */
export const ElementTargetsOvserverScrollParallax: string = '[data-scroll-parallax="item"]'
export const ElementTargetsOvserverScrollParallaxChild: string = '[data-scroll-parallax="item-child"]'
export const ElementTargetsOvserverScrollParallaxReverse: string = '[data-scroll-parallax="item-reverse"]'
export const ElementTargetsOvserverScrollParallaxReverseChild: string = '[data-scroll-parallax="item-reverse-child"]'
