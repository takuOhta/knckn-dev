import { CALLBACK_TIMING, EVENT_TYPE } from '@constants/event'

/**
 * GlobalEventで呼び出されるコールバック関数
 */
export type GlobalEventCallback = (...arg: any[]) => void

/**
 * イベント種別
 */
export type EventType = typeof EVENT_TYPE[keyof typeof EVENT_TYPE]

/**
 * コールバックを発火するタイミング
 */
export type CallbackTiming = typeof  CALLBACK_TIMING[keyof typeof CALLBACK_TIMING]

/**
 * AnimationFrameHandlerで発火するコールバック関数の引数
 */
export type AnimationFrameCallbackArg = {
  time: number;
  deltaTime: number;
  frame: number;
  fpsRatio: number;
}

/**
 * AnimationFrameHandlerで発火するコールバック関数
 */
export type AnimationFrameCallback = (arg: AnimationFrameCallbackArg) => void
