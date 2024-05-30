import { EVENT_TYPE } from '@constants/event'
import { GlobalEventHandler } from '@scripts/events/GlobalEventHandler'

/**
 * ScrollEvent にコールバックを紐づけて発火させるクラス。<br>
 * 登録されているコールバックの数をみて自動的に一時停止/再開する。
 */
class GlobalScrollEventHandler extends GlobalEventHandler {
  protected override _onEvent() {
    const { scrollX, scrollY } = window
    this._callback({ scrollX, scrollY })
  }

  /**
   * 強制的にコールバックを呼び出す
   */
  override emit() {
    this._onEvent()
  }
}

export const globalScroll = new GlobalScrollEventHandler(EVENT_TYPE.SCROLL)
