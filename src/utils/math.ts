
/**
 * ランダムな数
 * min(含む)からmax(含む)までのランダムな数
 *
 * @param min 最小値
 * @param max 最大値
 * @returns
 */
export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 * -指定値から+指定値までのランダムな数
 *
 * @param val
 * @returns
 */
export const range = (val: number): number => {
  return random(-val, val)
}

/**
 * 値の範囲を変換する
 *
 * @param num マッピングする値
 * @param fromMin 変換前の最小値
 * @param fromMax 変換前の最大値
 * @param toMin 変換後の最小値
 * @param toMax 変換後の最大値
 * @returns
 */
export const map = (num: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number => {
  if (num <= fromMin) return toMin
  if (num >= fromMax) return toMax

  const p = (toMax - toMin) / (fromMax - fromMin)
  return (num - fromMin) * p + toMin
}

/**
 * 度数法をラジアンに変換
 *
 * @param degree 角度（度数法）
 * @returns
 */
export const deg2rad = (degree: number) => {
  return degree * Math.PI / 180
}

/**
 * 二点間の補間
 *
 * @param x
 * @param y
 * @param a
 * @returns
 */
export const lerp = (x: number, y: number, a: number): number => {
  return x * (1 - a) + y * a
}

/**
 * 減衰
 *
 * @export
 * @param x
 * @param y
 * @param lambda
 * @param deltaTime
 * @returns
 */
export const damp = (x: number, y: number, lambda: number, deltaTime: number) => {
  return lerp(x, y, 1 - Math.exp(-lambda * deltaTime))
}

/**
 * GLSL の mix と同じ
 *
 * @param x
 * @param y
 * @param a
 * @returns
 */
export const mix = (x: number, y: number, a: number): number => {
  return x * (1 - a) + y * a
}

/**
 * GLSL の clamp と同じ
 *
 * @param x
 * @param y
 * @param a
 * @returns
 */
export const clamp = (x: number, y: number, a: number): number => {
  return Math.max(Math.min(x, a), y)
}

/**
 * 指定した位に小数を丸める
 *
 * @param num 丸める小数
 * @param place 丸める位
 * @returns 丸めた小数
 */
export const roundDecimal = (num: number, place: number): number => {
  const exponentiation = 10 ** place
  return Math.round(num * exponentiation) / exponentiation
}

/**
 * スライダーのようなループするインデックスを取得
 *
 * @param index インデックス（ループ範囲外も対象）
 * @param length インデックスのループ数
 * @returns ループした後のインデックス
 */
export const getLoopIndex = (index: number, length: number): number => {
  return (index + length) % length
}

/**
 * 少し特徴のあるsin波形
 *
 * @param radian
 * @returns
 */
export const sin1 = (radian: number): number => {
  return Math.sin(radian) + Math.sin(2 * radian)
}

/**
 * 少し特徴のあるsin波形 2
 *
 * @param radian
 * @returns
 */
export const sin2 = (radian: number): number => {
  return (
    Math.sin(radian) +
    Math.sin(2.2 * radian + 5.52) +
    Math.sin(2.9 * radian + 0.93) +
    Math.sin(4.6 * radian + 8.94)
  ) / 4
}

/**
 * 少し特徴のあるcos波形
 *
 * @param radian
 * @returns
 */
export const cos1 = (radian: number): number => {
  return Math.cos(radian) + Math.cos(2 * radian)
}

/**
 * 少し特徴のあるcos波形 2
 *
 * @param radian
 * @returns
 */
export const cos2 = (radian: number): number => {
  return (
    Math.cos(radian) +
    Math.cos(2.2 * radian + 5.52) +
    Math.cos(2.9 * radian + 0.93) +
    Math.cos(4.6 * radian + 8.94)
  ) / 4
}
