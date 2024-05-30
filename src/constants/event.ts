/**
 * EventTargetのイベントの種類
 * @enum {string}
 */
export const EVENT_TYPE = {
  LOAD: 'load',
  DOMCONTENTLOADED: 'DOMContentLoaded',
  CLICK: 'click',
  DOUBLE_CLICK: 'dblclick',
  MOUSE_DOWN: 'mousedown',
  MOUSE_MOVE: 'mousemove',
  MOUSE_ENTER: 'mouseenter',
  MOUSE_LEAVE: 'mouseleave',
  ANIMATION_START: 'animationstart',
  ANIMATION_END: 'animationend',
  MOUSE_UP: 'mouseup',
  ORIENTATION_CHANGE: 'orientationchange',
  RESIZE: 'resize',
  SCROLL: 'scroll',
  FOCUS: 'focus',
  BLUR: 'blur',
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
