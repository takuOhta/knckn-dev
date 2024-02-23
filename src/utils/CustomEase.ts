import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

// GSAP 3のCustomEaseを有効化
gsap.registerPlugin(CustomEase)

//
// dom
//
class CustomEaseGSAP {
  constructor() {}

  static inOut() {
    return CustomEase.create(
      'custom',
      'M0,0 C0.188,0.07 0.3,0.5 0.3,0.5 0.318,0.56 0.432,1.012 1,1 ',
    )
  }

  static inOutBg() {
    return CustomEase.create(
      'custom',
      'M0,0 C0.264,0 0.39,0.288 0.4,0.3 0.406,0.307 0.448,0.39 0.474,0.5 0.496,0.702 0.518,0.759 0.542,0.806 0.558,0.838 0.604,1 1,1 ',
    )
  }
}

export { CustomEaseGSAP }
