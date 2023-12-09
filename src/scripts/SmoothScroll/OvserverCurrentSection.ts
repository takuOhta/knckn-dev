import { BaseScrollOvserver } from '@scripts/SmoothScroll/BaseScrollOvserver';


/**
 * 現在表示しているセクションを監視
 * @param {HTMLElement} element
 * @param {Object} options
 * @param {string} options.start
 * @param {number} options.scrub
 */

class OvserverCurrentSection extends BaseScrollOvserver {

  #addOnToggle: Array<() => void>

  constructor(element: HTMLElement, options?: { start?: string, scrub?: number }) {
    super(element, options)

    //
    // state
    //

    //
    // function
    //
    this.#addOnToggle = []

    this.init()
  }

  /**
   * 初期化
    * @protected
   */
  protected init() {
    super.init()
    // console.log("[OvserverCurrentSection.init]")
  }

  /**
    * 切り替わった際の処理
    * @protected
    * @param {Object} params
    * @param {number} params.progress
    * @param {number} params.direction
    * @param {boolean} params.isActive
    */
  protected onToggle({
    progress,
    direction,
    isActive,
  }: {
    progress: number,
    direction: number,
    isActive: boolean,
  }) {
    super.onToggle({ progress, direction, isActive })
    if (!this.#addOnToggle[0]) return false
    this.#addOnToggle.forEach((addOnToggle)=> addOnToggle())
  }

  /**
   * 表示セクションが切り替わる際に処理を追加
   * @param {Function} callback
   */
  public addOnToggle(callback: () => void) {
    this.#addOnToggle.push(callback)
  }

  /**
   * 表示セクションが切り替わる際に処理を追加
   * @param {Function} callback
   */
  public removeOnToggle(callback: () => void) {
    const index = this.#addOnToggle.indexOf(callback)
    if (index >= 0) this.#addOnToggle.splice(index, 1)
  }
}

export {
  OvserverCurrentSection,
}
