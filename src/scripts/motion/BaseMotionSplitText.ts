/**
 * utils
 */
import { gsapK } from '@utils/AutoKillGSAP'

/**
 * constants
 */
import { Ease } from '@constants/customEase'

/**
 * motion
 */
import { BaseMotion } from '@scripts/motion/BaseMotion'


// const SHOW_EASE = 'expo.out'
const SHOW_EASE = Ease.easeInOut
const SHOW_DURATION = 1.4
const OUT_EASE = Ease.easeInOut
const OUT_DURATION = 1

/**
* 文字を分割してモーションさせる基本処理
  * @param {Object} param
  * @param {HTMLElement} param.elTarget
  * @param {Boolean} param.isSetStyleOff
*/

class BaseMotionSplitText extends BaseMotion {

  public _elTarget: Array<HTMLElement>
  private _elText: HTMLElement | null
  public _elParagraph: Array<HTMLElement>
  public _elParent: Array<HTMLElement>
  private _fixChars: Array<string>
  private _paragraph: { isCheck: boolean, count: number, startTextNo: number }
  private _textContent: string | null

  constructor() {
    super()

    this._elTarget = []
    this._elText = null
    this._elParent = []
    this._elParagraph = []
    this._fixChars = []
    this._paragraph = {
      isCheck: false,
      count: 0,
      startTextNo: 0,
    }
    this._textContent = null
  }

  /**
  * 初期化
  */
  public init(elTarget: HTMLElement) {
    this._elText = elTarget

    this._splitText()
    this._setStyle()
  }

  /**
  * テキストを分割
  */
  private _splitText() {
    if (!this._elText) return false

    const { textContent } = this._elText
    const chars = textContent ? [...textContent] : []
    this._textContent = textContent
    this._elText.textContent = ''

    chars.forEach((chara) => {
      this._fixChars.push(chara)
    })

    // 段落の追加処理
    const addParagrap = ()=> {
      const elParagraph = this._elText ? [...this._elText.querySelectorAll('.paragraph')] : []
      if (!elParagraph[this._paragraph.count] && this._elText) {
        this._elText.insertAdjacentHTML('beforeend','<span class="paragraph"></span>')
        // this._paragraph.count += 1
      }
    }

    // 最初の段落を追加
    addParagrap()


    this._fixChars.forEach((fixChar)=> {


      if (this._elText) {
        // 段落を追加
        this._elParagraph = [...this._elText.querySelectorAll('.paragraph')] as [HTMLElement]

        if (!fixChar.match(/\S/g)) {
          // 空白の場合
          this._elParagraph[this._paragraph.count].insertAdjacentHTML('beforeend',`<span aria-hidden="true" class="space"><span>${ fixChar }</span></span>`)
          // スペースが入った場合段落を増やして、以降は追加した段落に文字を入れる
          // 段落増やす前に段落の処理する番号を更新
          this._paragraph.count += 1
          addParagrap()
        } else {
          // 文字がある場合
          this._elParagraph[this._paragraph.count].insertAdjacentHTML('beforeend',`<span aria-hidden="true"><span>${ fixChar }</span></span>`)
        }

        if (this._elParagraph[this._paragraph.count]) {
          const charaParentNo = this._elParagraph[this._paragraph.count].children.length - 1
          const elCharaParent = this._elParagraph[this._paragraph.count].children[charaParentNo] as HTMLElement
          const elChara = elCharaParent.children[0] as HTMLElement
          this._elParent.push(elCharaParent)
          this._elTarget.push(elChara)
        }
      }
    })

    this._elText.insertAdjacentHTML('beforeend',`<span data-split-text="hidden-text">${ this._textContent }</span>`)
  }

  /**
  * 初期スタイル
  */
  public _setStyle() {
    if (this._elText) {
      // gsap.set(this._elText.querySelector('[data-split-text="hidden-text"]'), {
      //   position: 'absolute',
      //   width: 1,
      //   height: 1,
      //   overflow: 'hidden',
      //   clip: 'rect(0 0 0 0)',
      //   border: 0,
      //   pointerEvents: 'none'
      // })
      const elHiddenText = this._elText.querySelector<HTMLElement>('[data-split-text="hidden-text"]')
      if (elHiddenText && typeof elHiddenText === 'object') {
        elHiddenText.style.position = 'absolute'
        elHiddenText.style.width = '1'
        elHiddenText.style.height = '1'
        elHiddenText.style.overflow = 'hidden'
        elHiddenText.style.clip = 'rect(0 0 0 0)'
        elHiddenText.style.border = '0'
        elHiddenText.style.pointerEvents = 'none'
      }

      // gsap.set(this._elParent, {
      //   position: 'relative',
      //   overflow: 'hidden',
      //   display: 'inline-block'
      // })
      this._elParent.forEach((elParent) => {
        elParent.style.position = 'absolute'
        elParent.style.overflow = 'hidden'
        elParent.style.display = 'inline-block'
      })

      // gsap.set(this._elTarget, {
      //   position: 'relative',
      //   display: 'inline-block',
      //   rotate: '0.00001deg'
      // })
      this._elTarget.forEach((elTarget) => {
        elTarget.style.position = 'relative'
        elTarget.style.display = 'inline-block'
        elTarget.style.rotate = '0.00001deg'
      })

      // gsap.set(this._elParagraph, {
      //   display: 'inline-block'
      // })
      this._elParagraph.forEach((elParagraph) => {
        elParagraph.style.display = 'inline-block'
      })
    }
    this._addSetStyle()
  }

  /**
  * 初期スタイル 追加処理
  */
  public _addSetStyle() {
    //
  }

  /**
  * 表示モーション
  * 継承先で指定
  */
  public _show(delay?: number | undefined, stagger?: number | undefined, onComplete?: () => void | undefined) {
    if (this._elTarget) {
      gsapK.to(this._elTarget, {
        opacity: 1,
        duration: SHOW_DURATION,
        ease: SHOW_EASE,
        delay,
        stagger: 0.02,
        onComplete,
      })
    }
  }

  /**
  * 非表示モーション
  * 継承先で指定
  */
  public _out(delay?: number | undefined, stagger?: number | undefined, onComplete?: () => void | undefined) {
    if (this._elTarget) gsapK.to(this._elTarget, {
      opacity: 0,
      duration: OUT_DURATION,
      ease: OUT_EASE,
      delay,
      onComplete,
    })
  }
}

export { BaseMotionSplitText }
