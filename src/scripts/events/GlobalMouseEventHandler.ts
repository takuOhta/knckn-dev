import { EVENT_TYPE } from '@constants/event'
import { GlobalEventHandler } from '@scripts/events/GlobalEventHandler'

/**
 * MouseEvent にコールバックを紐づけて発火させるクラス。<br>
 * 登録されているコールバックの数をみて自動的に一時停止/再開する。
 */
export class GlobalMouseEventHandler extends GlobalEventHandler {
  /**
   * マウスイベント
   * @param event
   */
  override _onEvent(event: MouseEvent): void {
    const { clientX, clientY } = event
    this._callback({ clientX, clientY })
  }
}

export const globalClick = new GlobalMouseEventHandler(EVENT_TYPE.CLICK)
export const globalDoubleClick = new GlobalMouseEventHandler(EVENT_TYPE.DOUBLE_CLICK)
export const globalMouseDown = new GlobalMouseEventHandler(EVENT_TYPE.MOUSE_DOWN)
export const globalMouseMove = new GlobalMouseEventHandler(EVENT_TYPE.MOUSE_MOVE)
export const globalMouseUp = new GlobalMouseEventHandler(EVENT_TYPE.MOUSE_UP)
