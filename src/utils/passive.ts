import { unknown } from "astro/zod"

/**
 * addEventListener で指定する options のオブジェクト<br>
 * passive に対応しているブラウザであれば passive を有効にする options、passive 非対応のブラウザであれば false を返す
 * @see https://developer.mozilla.org/ja/docs/Web/API/EventTarget/addEventListener#safely_detecting_option_support
 */
let passiveSupported = false
try {
  const options = {
    get passive() {
      passiveSupported = true
      return false
    },
  }
  window.addEventListener('test', <EventListenerOrEventListenerObject>unknown, options)
  window.removeEventListener('test', <EventListenerOrEventListenerObject>unknown)

} catch(err) {
  passiveSupported = false
}

const passiveOptions:any = passiveSupported ? { passive: true } : false

/**
 * @return {object|boolean}
 */
export { passiveOptions }
