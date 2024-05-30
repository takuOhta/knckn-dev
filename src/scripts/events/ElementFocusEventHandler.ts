import { type EventType } from '@tsTypes/event'
import { CALLBACK_TIMING } from '@constants/event'
import { ElementEventHandler } from '@scripts/events/ElementEventHandler'

/**
 * フォーカス/ブラーイベント にコールバックを紐づけて発火させるクラス。<br>
 * 登録されているコールバックの数をみて自動的に一時停止/再開する。
 */
export class ElementFocusEventHandler extends ElementEventHandler {
  #callback: () => void = () => {}
  constructor({ element, eventType }: { element: HTMLElement; eventType: EventType }) {
    super(element, eventType, CALLBACK_TIMING.EVERYTIME, 0)
  }
  /**
   * フォーカスイベント
   * @param event
   */
  override _onEvent(event: FocusEvent): void {
    const { relatedTarget } = event
    this._callback({ relatedTarget })
  }
}
