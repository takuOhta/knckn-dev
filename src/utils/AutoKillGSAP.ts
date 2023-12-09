import { gsap } from 'gsap'
import { GSAP_BUILTIN_PROPERTY_KEYS } from '@constants/gsap'

/**
 * gsapのビルトインプロパティ以外かどうか
 */
const isNotBuiltinProperty = (key: string): boolean => {
  return !GSAP_BUILTIN_PROPERTY_KEYS.some((nonPropKey) => key === nonPropKey)
}

/**
 * GSAPのビルトイン以外のプロパティに対してkillTweensOf()を呼び出す
 * @param target
 * @param properties
 */
const killTweensOf = (target: gsap.TweenTarget, properties: object = {}) => {
  const propertiesToKill: string  = Object.keys(properties).filter(isNotBuiltinProperty).join()
  gsap.killTweensOf(target, propertiesToKill)
}

/**
 * gsapのTween登録直前に自動でkillTweensOfを実行する静的クラス
 */
export class AutoKillGSAP {
  static #timelines: { [name: string]: gsap.core.Timeline } = {}

  /**
   * gsap.to() と同じ
   * @see https://greensock.com/docs/v3/GSAP/gsap.to()
   * @param target
   * @param vars
   */
  static to(target: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween {
    killTweensOf(target, vars)
    return gsap.to(target, vars)
  }

  /**
   * gsap.fromTo() と同じ
   * @see https://greensock.com/docs/v3/GSAP/gsap.fromTo()
   * @param target
   * @param fromVars
   * @param toVars
   */
  static fromTo(target: gsap.TweenTarget, fromVars: gsap.TweenVars, toVars: gsap.TweenVars): gsap.core.Tween {
    killTweensOf(target, toVars)
    return gsap.fromTo(target, fromVars, toVars)
  }

  /**
   * gsap.set() と同じ
   * @see https://greensock.com/docs/v3/GSAP/gsap.set()
   * @param target
   * @param vars
   */
  static set(target: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween {
    killTweensOf(target, vars)
    return gsap.set(target, vars)
  }

  /**
   * gsap.timeline() と同じ
   * @see https://greensock.com/docs/v3/GSAP/gsap.timeline()
   * @param name タイムラインにつける一意の名前
   * @param vars timeline()の引数
   */
  static timeline(name: string, vars?: gsap.TimelineVars): gsap.core.Timeline {
    if (this.#timelines[name] !== undefined) {
      this.#timelines[name].kill()
    }
    this.#timelines[name] = gsap.timeline(vars)
    return this.#timelines[name]
  }
}

export const gsapK = AutoKillGSAP
