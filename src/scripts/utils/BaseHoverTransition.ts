import { EVENT_TYPE } from '@constants/event'
import { ElementMouseEventHandler } from '@scripts/events/ElementMouseEventHandler'
import { ElementFocusEventHandler } from '@scripts/events/ElementFocusEventHandler'
import { globalResize } from '@scripts/events/GlobalEventHandler'
import { isSp } from '@utils/media'
/**
 * マウスホバー時にトランジションを発火、トランジションエンド時にホバー状態を解除するクラス
 */
export class BaseHoverTransition {
  #element: HTMLElement
  #mouseEnterEventHandler: ElementMouseEventHandler
  #mouseLeaveEventHandler: ElementMouseEventHandler
  #focusEventHandler: ElementFocusEventHandler
  #blurEventHandler: ElementFocusEventHandler
  #boundOnMouseenter: () => void = this.#onMouseenter.bind(this)
  #boundOnMouseleave: () => void = this.#onMouseleave.bind(this)
  #boundOnFocus: () => void = this.#onFocus.bind(this)
  #boundOnBlur: () => void = this.#onBlur.bind(this)
  #boudnOnResize: () => void = this.#onResize.bind(this)
  #durationIn = 0
  #durationOut = 0
  #isHoverReal = false // ホバー状態(マウスイベントで取得する)
  #isHoverAnimation = false // ホバー状態(アニメーションと連動)
  #isAnimating = false // アニメーション状態
  #device = isSp() ? 'sp' : 'pc'
  /**
   * ベースホバートランジション
   * @param param0 object
   * @param param0.element HTMLElement
   * @param param0.durationIn number
   * @param param0.durationOut number
   */
  constructor({ element, durationIn, durationOut }: { element: HTMLElement; durationIn: number; durationOut: number }) {
    this.#element = element
    this.#durationIn = durationIn * 1000
    this.#durationOut = durationOut * 1000
    // イベントハンドラー初期化
    this.#mouseEnterEventHandler = new ElementMouseEventHandler({ element, eventType: EVENT_TYPE.MOUSE_MOVE })
    this.#mouseLeaveEventHandler = new ElementMouseEventHandler({ element, eventType: EVENT_TYPE.MOUSE_LEAVE })
    this.#focusEventHandler = new ElementFocusEventHandler({ element, eventType: EVENT_TYPE.FOCUS })
    this.#blurEventHandler = new ElementFocusEventHandler({ element, eventType: EVENT_TYPE.BLUR })

    // リサイズイベント登録
    globalResize.add(this.#boudnOnResize)

    // 初期化
    if (this.#device === 'pc') this.#addEventListeners()
  }

  /**
   * リセット
   */
  #reset(): void {
    // イベント削除
    this.#removeEventListeners()

    // メンバ変数の初期化
    this.#isHoverReal = false
    this.#isHoverAnimation = false
    this.#isAnimating = false

    // SPの場合はイベントを登録しない
    if (isSp()) return
    // イベント登録
    this.#addEventListeners()
  }
  /**
   * マウスエンターイベント
   */
  #onMouseenter(): void {
    this.#isHoverReal = true
    this.#toggle()
  }

  /**
   * マウスリーブイベント
   */
  #onMouseleave(): void {
    this.#isHoverReal = false
    this.#toggle()
  }

  /**
   * フォーカスイベント
   */
  #onFocus(): void {
    this.#isHoverReal = true
    this.#toggle()
  }

  /**
   * ブラーイベント
   */
  #onBlur(): void {
    this.#isHoverReal = false
    this.#toggle()
  }

  /**
   * ホバー状態を判定してアニメーション切り替え
   */
  #toggle() {
    // アニメーション中もしくは実際のホバー状態と現在のホバー状態が同一であれば処理を終了する
    if (this.#isAnimating) return
    if (this.#isHoverReal === this.#isHoverAnimation) return
    // 実際のホバー状態と異なる場合はアニメーションを実行
    this.#isAnimating = true
    if (this.#isHoverReal) {
      // ホバーしていたらインアニメーションを実行（クラスを追加）
      // トランジション完了タイミングにsetTimeoutでイベントを設定
      // アニメーション完了後に再びtoggleを実行してチェック
      this.#element.classList.add('-isHover')
      this.#isHoverAnimation = true
      setTimeout(() => {
        this.#isAnimating = false
        this.#toggle()
      }, this.#durationIn)
    } else {
      // ホバーしていなかったらアウトアニメーションを実行
      // アニメーション完了後に再びtoggleを実行（クラスを削除）
      // アニメーション完了後に再びtoggleを実行してチェック
      this.#element.classList.remove('-isHover')
      this.#isHoverAnimation = false
      setTimeout(() => {
        this.#isAnimating = false
        this.#toggle()
      }, this.#durationOut)
    }
  }

  /**
   * イベント登録
   */
  #addEventListeners(): void {
    this.#mouseEnterEventHandler.add(this.#boundOnMouseenter)
    this.#mouseLeaveEventHandler.add(this.#boundOnMouseleave)
    this.#focusEventHandler.add(this.#boundOnFocus)
    this.#blurEventHandler.add(this.#boundOnBlur)
  }

  /**
   * イベント削除
   */
  #removeEventListeners(): void {
    this.#mouseEnterEventHandler.remove(this.#boundOnMouseenter)
    this.#mouseLeaveEventHandler.remove(this.#boundOnMouseleave)
    this.#focusEventHandler.remove(this.#boundOnFocus)
    this.#blurEventHandler.remove(this.#boundOnBlur)
  }

  /**
   * リサイズ
   */
  #onResize(): void {
    if (this.#device === (isSp() ? 'sp' : 'pc')) return
    this.#reset()
  }
}
