/**
 * EventTargetのイベントの種類
 * @enum {string}
 */
export const EVENT_TYPE = {
  CLICK: 'click',
  DOUBLE_CLICK: 'dblclick',
  MOUSE_DOWN: 'mousedown',
  MOUSE_MOVE: 'mousemove',
  MOUSE_UP: 'mouseup',
  ORIENTATION_CHANGE: 'orientationchange',
  RESIZE: 'resize',
  SCROLL: 'scroll',
} as const

/**
 * コールバックを呼び出すタイミングの種類
 * @enum {string}
 */
export const CALLBACK_TIMING = {
  EVERYTIME: 'everytime',
  THROTTLE: 'throttle',
  DEBOUNCE: 'debounce',
} as const

/**
 * passiveオプション
 * true: preventDefault()を呼び出さない
 * false: preventDefault()を呼び出す
 * @enum {{ passive: boolean }}
 */
export const PASSIVE = {
  TRUE: { passive: true },
  FALSE: { passive: false },
} as const
