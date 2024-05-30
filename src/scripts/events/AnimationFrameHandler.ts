import { gsap } from 'gsap'
import Stats from 'stats.js'

import { GlobalEventHandlerBase } from '@scripts/events/GlobalEventHandlerBase'
import { type AnimationFrameCallback } from '@tsTypes/event'

/**
 * TODO: publicRuntimeConfigに移す
 */
const USE_STATS = false

/**
 * window.requestAnimationFrame にコールバックを紐づけて発火させるクラス。<br>
 * 登録されているコールバックの数をみて自動的に一時停止/再開する。
 */
class AnimationFrameHandler extends GlobalEventHandlerBase {
  #targetFps: number
  #idealDeltaTime: number
  #lastTickerTime: number
  #time: number
  #deltaTime: number
  #frame: number
  #isRunning: boolean
  #isResumeFrame: boolean
  #fpsRatio: number
  #boundOnAnimationFrame: gsap.TickerCallback

  /**
   * @param targetFps 理想のFPS
   */
  constructor(targetFps: number = 60) {
    super()

    this.#targetFps = targetFps
    this.#idealDeltaTime = 1000 / this.#targetFps
    this.#lastTickerTime = 0
    this.#time = 0
    this.#deltaTime = 0
    this.#frame = 0
    this.#isRunning = false
    this.#isResumeFrame = false
    this.#fpsRatio = 1.0

    this.#boundOnAnimationFrame = this._onAnimationFrame.bind(this)
  }

  /**
   * requestAnimationFrame開始時からの経過時間(sec)
   */
  get time(): number {
    return this.#time / 1000
  }

  /**
   * 前フレームからの経過時間
   */
  get deltaTime(): number {
    return this.#deltaTime
  }

  /**
   * フレーム数
   */
  get frame(): number {
    return this.#frame
  }

  /**
   * 理想のFPSと比較した際の現在のFPSの比率
   */
  get fpsRatio(): number {
    return this.#fpsRatio
  }

  /**
   * requestAnimationFrameが回っているかどうか
   */
  get isRunning(): boolean {
    return this.#isRunning
  }

  /**
   * イベントに紐づけるコールバックを追加
   * @param callback
   */
  add(callback: AnimationFrameCallback): void {
    this._addCallback(callback)

    // 停止中 & ひとつめのコールバック追加を合図にループを再開
    const isStopped = !this.#isRunning
    const shouldRestart = this._callbacks.length === 1
    if (isStopped && shouldRestart) {
      this.#isRunning = true
      this.#isResumeFrame = true
      gsap.ticker.add(this.#boundOnAnimationFrame)
    }
  }

  /**
   * イベントに紐づいているコールバックを削除
   * @param callback
   */
  remove(callback: AnimationFrameCallback): void {
    const isRemoved = this._removeCallback(callback)
    if (!isRemoved) {
      return
    }

    const shouldStop = this._callbacks.length === 0
    if (this.#isRunning && shouldStop) {
      gsap.ticker.remove(this.#boundOnAnimationFrame)
      this.#isRunning = false
    }
  }

  /**
   * gsap.ticker のループ
   * @see https://greensock.com/docs/v3/GSAP/gsap.ticker
   * @param time
   * @param deltaTime
   * @param frame
   * @param elapsed
   */
  protected _onAnimationFrame(time: number, deltaTime: number, frame: number, elapsed: number): void {
    this.#deltaTime = (time - this.#lastTickerTime) * 1000

    // ループ再開時は
    if (this.#isResumeFrame) {
      // _lastTimestamp に停止時の時間が入っていて
      // そのままだと _deltaTime がズレるので、１フレームだけ理想値をいれてごまかす
      this.#deltaTime = this.#idealDeltaTime
      this.#isResumeFrame = false
    }

    this.#fpsRatio = this.#deltaTime / this.#idealDeltaTime

    this._callback({
      time: this.time,
      deltaTime: this.deltaTime,
      frame: this.frame,
      fpsRatio: this.fpsRatio,
    })

    if (this.#isRunning) {
      this.#time += this.#deltaTime
      this.#lastTickerTime = time
      this.#frame++
    }
  }
}

/**
 * AnimationFrameHandler（stats.jsでパフォーマンス計測するバージョン）
 */
class AnimationFrameHandlerWithStats extends AnimationFrameHandler {
  #stats: Stats

  constructor(targetFps: number = 60) {
    super(targetFps)

    this.#stats = new Stats()
  }

  /**
   * statsを表示
   */
  showStats(): void {
    document.body.appendChild(this.#stats.dom)
  }

  /**
   * statsを非表示
   */
  hideStats(): void {
    this.#stats.dom.remove()
  }

  /**
   * gsap.ticker のループ
   * @param time
   * @param deltaTime
   * @param frame
   * @param elapsed
   */
  protected override _onAnimationFrame(time: number, deltaTime: number, frame: number, elapsed: number): void {
    this.#stats.begin() // パフォーマンス計測開始

    super._onAnimationFrame(time, deltaTime, frame, elapsed)

    this.#stats.end() // パフォーマンス計測終了
  }
}

export const animationFrame = USE_STATS ? new AnimationFrameHandlerWithStats() : new AnimationFrameHandler()
