import { type GlobalEventCallback } from '@tsTypes/event'
/**
 * cite: Throttling and debouncing in JavaScript - codeburst
 * @see https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
 */

/**
 * 連続するイベントを一定時間おきにしか発火しないようにする
 * @param interval 実行感覚（ミリ秒）
 * @param fn 実行する関数
 * @returns
 */
export const throttle = (interval: number, fn: GlobalEventCallback): GlobalEventCallback => {
  let lastTime = performance.now() - interval
  return (...args: any[]) => {
    const time = performance.now()
    if (time - lastTime < interval) {
      return
    }

    lastTime = time
    fn(...args)
  }
}

/**
 * 一定時間内に連続するイベントの最後にだけ発火させる
 * @param interval 実行間隔（ミリ秒）
 * @param fn 実行する関数
 * @returns
 */
export const debounce = (interval: number, fn: GlobalEventCallback): GlobalEventCallback => {
  let timerId: number = 0
  return (...args: any[]) => {}
  // process.clientが存在しないとエラーが出るため一時的にコメントアウト
  if (process.client) {
    return (...args) => {
      if (timerId > 0) {
        clearTimeout(timerId)
      }

      timerId = window.setTimeout(() => {
        fn(...args)
        timerId = 0
      }, interval)
    }
  }

  // return (...args) => {
  //   fn(...args)
  // }
}
