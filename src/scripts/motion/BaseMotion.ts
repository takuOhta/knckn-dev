/**
* モーションのベース処理
*/

// 消すcssプロパティを指定
const REMOVE_CSS_PROPERTY = ["opacity"]

class BaseMotion {

  protected _elTarget: HTMLElement | Array<HTMLElement> | undefined

  public removeCssProperty: Array<string>

  constructor() {
    this.removeCssProperty = REMOVE_CSS_PROPERTY
  }

  /**
  * 初期化
  */
  public init(elTarget: HTMLElement | Array<HTMLElement>, option?: { isSetStyleOff: boolean|null }) {
    const { isSetStyleOff } = option || { isSetStyleOff: null }

    this._elTarget = elTarget

    if (!isSetStyleOff) this._setStyle()
  }

  /**
  * 初期スタイル
  * 継承先で指定
  */
  public _setStyle() {
    // console.log("[BaseMotion._setStyle]")
  }

  /**
  * cssプロパティを消す
  */
  public offStyle() {
    this.removeCssProperty.forEach((property) => {
      if (!this._elTarget) return false
      if (Array.isArray(this._elTarget)) {
        this._elTarget.forEach((elTarget) => elTarget.style.removeProperty(property))
      } else {
        this._elTarget.style.removeProperty(property)
      }
    })
  }

  /**
  * 表示モーション
  */
  public show(option?: { delay?: number | undefined, stagger?: number | undefined, onComplete?: () => void | undefined }) {
    if (option) {
      const { delay, stagger, onComplete } = option
      this._show(delay, stagger, onComplete)
    } else {
      this._show()
    }
  }

  /**
  * 表示モーション
  * 継承先で指定
  */
  public _show(delay?: number | undefined, stagger?: number | undefined, onComplete?: () => void | undefined) {
    // console.log("[BaseMotion._show]")
  }

  /**
  * 非表示モーション
  */
  public out(option?: { delay?: number | undefined, stagger?: number | undefined, onComplete?: () => void | undefined }) {
    if (option) {
      const { delay, stagger, onComplete } = option
      this._out(delay, stagger, onComplete)
      } else {
      this._out()
    }

  }

  /**
  * 非表示モーション
  * 継承先で指定
  */
  public _out(delay?: number | undefined, stagger?: number | undefined, onComplete?: () => void | undefined) {
    // console.log("[BaseMotion._out]")
  }
}

export { BaseMotion }
