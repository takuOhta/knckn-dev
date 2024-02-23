import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { animationFrame } from "@scripts/events/AnimationFrameHandler";

/**
 * SmoothScroll
 */
class SmoothScroll extends Lenis {
  constructor() {
    super();

    // add event
    this.#addEventListener();
  }

  /**
   * initialize
   */
  #init() {
    //
  }

  /**
   * init ScrollTrigger
   */
  initScrollTrigger() {
    gsap.ticker.lagSmoothing(0);
  }

  /**
   * onAnimationFrame
   */
  #onAnimationFrame(time: number) {
    // lenisのアップデート
    this.raf(time * 1000);
    // スクロールトリガーのアップデート
    ScrollTrigger.update();
  }

  /**
   * addEventListener
   */
  #addEventListener() {
    // update scroll position
    animationFrame.add(({ time }) => this.raf(time * 1000));
  }
}
const smoothScroll = new SmoothScroll();
export { SmoothScroll, smoothScroll };
