import { type ElementEventCallback } from '@tsTypes/event'

/**
 * イベントに紐づけるコールバックを追加,削除,発火する基底クラス
 */
export abstract class ElementEventHandlerBase {
  protected _callbacks: Array<ElementEventCallback> = []

  constructor() {
    this._callbacks = []
  }

  /**
   * コールバックを追加
   * @param callback
   */
  protected _addCallback(callback: ElementEventCallback): void {
    this._callbacks.push(callback)
  }

  /**
   * コールバックを削除
   * @param callback
   * @returns 削除成功したら true, 失敗したら false
   */
  protected _removeCallback(callback: ElementEventCallback): boolean {
    const index = this._callbacks.indexOf(callback)
    const isFound = index > -1
    if (isFound) {
      this._callbacks.splice(index, 1)
    }
    return isFound
  }

  /**
   * 登録されているコールバックをまとめて呼び出す
   * @param param
   */
  protected _callback(...param: any[]) {
    for (const callback of this._callbacks) {
      callback(...param)
    }
  }
}
