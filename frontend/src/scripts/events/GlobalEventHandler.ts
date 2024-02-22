import { CALLBACK_TIMING, EVENT_TYPE, PASSIVE } from "@constants/event";
import { GlobalEventHandlerBase } from "@scripts/events/GlobalEventHandlerBase";
import { type CallbackTiming, type EventType, type GlobalEventCallback } from "@tsTypes/event";
import { debounce, throttle } from "@utils/event";

/**
 * window の任意のイベントにコールバックを紐づけて発火させるクラス。<br>
 * 登録されているコールバックの数をみて自動的に一時停止/再開する。
 */
export class GlobalEventHandler extends GlobalEventHandlerBase {
  #eventType: EventType;
  #boundOnEvent: GlobalEventCallback;

  /**
   * @param eventType イベント種別
   * @param callbackTiming コールバック関数を発火するタイミング
   * @param interval コールバック関数の実行間隔
   */
  constructor(eventType: EventType, callbackTiming: CallbackTiming = CALLBACK_TIMING.EVERYTIME, interval: number = 0) {
    super();

    this.#eventType = eventType;

    switch (callbackTiming) {
      case CALLBACK_TIMING.THROTTLE:
        this.#boundOnEvent = throttle(interval, this._onEvent.bind(this));
        break;
      case CALLBACK_TIMING.DEBOUNCE:
        this.#boundOnEvent = debounce(interval, this._onEvent.bind(this));
        break;
      case CALLBACK_TIMING.EVERYTIME:
      default:
        this.#boundOnEvent = this._onEvent.bind(this);
    }
  }

  /**
   * コールバックを追加
   * @param callback
   */
  add(callback: GlobalEventCallback): void {
    console.log("GlobalEventHandler.add", this.#eventType);
    console.log("GlobalEventHandler.add", callback);
    this._addCallback(callback);
    if (this._callbacks.length === 1) {
      window.addEventListener(this.#eventType, this.#boundOnEvent, PASSIVE.TRUE);
    }
  }

  /**
   * イベントに紐づいているコールバックを削除
   * @param callback
   */
  remove(callback: GlobalEventCallback): void {
    const isRemoved = this._removeCallback(callback);
    if (!isRemoved) {
      return;
    }

    if (this._callbacks.length === 0) {
      window.removeEventListener(this.#eventType, this.#boundOnEvent, PASSIVE.TRUE as EventListenerOptions);
    }
  }

  /**
   * 全てのコールバックを呼び出す
   * @param param
   */
  protected override _callback(...param: any[]): void {
    for (const callback of this._callbacks) {
      callback(...param);
    }
  }

  /**
   * イベント時
   * @param event
   */
  protected _onEvent(...arg: any[]): void {
    this._callback();
  }

  /**
   * 強制的にコールバックを呼び出す
   */
  emit(): void {
    this._callback();
  }
}

export const globalOrientationChange = new GlobalEventHandler(EVENT_TYPE.ORIENTATION_CHANGE);
export const globalResize = new GlobalEventHandler(EVENT_TYPE.RESIZE);
