/**
 * ブラウザ、OS判定
 */

/**
 * IEかどうか
 */
export const isIE = (): boolean => {
  const _ua = window.navigator.userAgent.toLowerCase()
  return /trident|msie/.test(_ua)
}

/**
 * Edgeかどうか
 */
export const isEdge = (): boolean => {
  const _ua = window.navigator.userAgent.toLowerCase()
  return /edg/.test(_ua)
}

/**
 * Chromeかどうか
 */
export const isChrome = (): boolean => {
  const _ua = window.navigator.userAgent.toLowerCase()
  return /chrome/.test(_ua)
}

/**
 * Safari かどうか
 */
export const isSafari = (): boolean => {
  const _ua = window.navigator.userAgent.toLowerCase()
  return (!isEdge() && !isChrome()) ? /safari/.test(_ua) : false
}

/**
 * Windowsかどうか
 */
export const isWindows = (): boolean => {
  const _ua = window.navigator.userAgent.toLowerCase()
  return /windows nt/.test(_ua)
}

/**
 * iPadかどうか
 */
export const isIpad = (): boolean => {
  const _ua = window.navigator.userAgent.toLowerCase()
  return /ipad/.test(_ua) || (/macintosh/.test(_ua) && 'ontouchend' in document)
}

/**
 * iOS端末かどうか
 * @see https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
 */
export const isIos = (): boolean => {
  const _ua = window.navigator.userAgent.toLowerCase()
  return /ipad|iphone|ipod/.test(_ua)
}

/**
 * iOS メジャーバージョンを取得
 */
export const getIosVersion = (): (number | undefined) => {
  const appVersion = window.navigator.appVersion.toLowerCase()
  const match = appVersion.match(/os (\d+)_(\d+)_?(\d+)?/)

  if (!match) {
    return undefined
  }

  return Number(match[1])
}

/**
 * Android端末かどうか
 */
export const isAndroid = (): boolean => {
  const _ua = window.navigator.userAgent.toLowerCase()
  return /android/i.test(_ua)
}

/**
 * Android メジャーバージョンを取得
 */
export const getAndroidVersion = (): (number | undefined) => {
  const _ua = window.navigator.userAgent.toLowerCase()
  const match = _ua.match(/android\s([0-9.]*)/i)

  if (!match) {
    return undefined
  }

  return Number(match[1])
}

/**
 * モバイル端末かどうか
 */
export const isMobile = (): boolean => {
  return (isIos() && !isIpad()) || isAndroid()
}

/**
 * タッチデバイスかどうか
 */
export const isTouchDevice = (): boolean => {
  return ('ontouchstart' in document.documentElement) ? (navigator.maxTouchPoints > 0) : false
}

/**
 * タブレット端末かどうか
 */
export const isTablet = (): boolean => {
  const _ua = window.navigator.userAgent.toLowerCase()
  return isTouchDevice() && !/iphone|android.+mobile/.test(_ua)
}
