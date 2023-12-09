import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

// GSAP 3のCustomEaseを有効化
gsap.registerPlugin(CustomEase)

/**
 * イベント名
 */
const Ease: gsap.Ease = {
  easeOut: CustomEase.create("custom", "M0,0 C0.08,0 0.294,0.055 0.335,0.082 0.428,0.142 0.466,0.292 0.498,0.502 0.532,0.73 0.586,0.88 0.64,0.928 0.679,0.962 0.698,1 1,1 "),
  easeIn: CustomEase.create("custom", "M0,0 C0.08,0 0.294,0.055 0.335,0.082 0.428,0.142 0.466,0.292 0.498,0.502 0.532,0.73 0.586,0.88 0.64,0.928 0.679,0.962 0.698,1 1,1 "),
  easeInOut: CustomEase.create("custom", "M0,0 C0.08,0 0.294,0.055 0.335,0.082 0.428,0.142 0.466,0.292 0.498,0.502 0.532,0.73 0.586,0.88 0.64,0.928 0.679,0.962 0.698,1 1,1 "),
}

Object.freeze(Ease)

export {
  Ease,
}
