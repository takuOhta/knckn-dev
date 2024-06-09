import { type Vec2 } from '@tsTypes/math'
import { globalResize } from '@scripts/events/GlobalEventHandler'
/**
 * ウィンドウサイズ取得用の静的クラス
 */
export class ScreenUtil {
  static #size: Vec2 = {
    // x: process.client ? window.innerWidth : 0,
    // y: process.client ? window.innerHeight : 0,
    x: window.innerWidth,
    y: window.innerHeight,
  }

  /**
   * ウィンドウサイズ
   */
  static get size(): Vec2 {
    return Object.assign({}, this.#size)
  }

  /**
   * ウィンドウの幅
   */
  static get width(): number {
    return this.#size.x
  }

  /**
   * ウィンドウの高さ
   */
  static get height(): number {
    return this.#size.y
  }

  /**
   * 幅・高さの小さい方
   */
  static get min(): number {
    return Math.min(this.width, this.height)
  }

  /**
   * 幅高さの大きい方
   */
  static get max(): number {
    return Math.max(this.width, this.height)
  }

  /**
   * ウィンドウの中心座標
   */
  static get center(): Vec2 {
    return {
      x: this.width / 2,
      y: this.height / 2,
    }
  }

  /**
   * ウィンドウのアスペクト比
   */
  static get aspect(): number {
    return this.width / this.height
  }

  static get dpr(): number {
    return window.devicePixelRatio
  }

  /**
   * リサイズ
   */
  static resize(): void {
    this.#size.x = window.innerWidth
    this.#size.y = window.innerHeight
  }
}
