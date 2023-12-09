import { BREAKPOINT } from '@constants/breakpoint'

/**
 * SP幅かどうか
 * @returns SP幅の場合：true, それ以外：false
 */
export const isSp = (): boolean => {
  return window.matchMedia(`screen and (max-width: ${ BREAKPOINT.SP_MAX }px)`).matches
}

/**
 * PC幅かどうか
 * @returns PC幅の場合：true, それ以外：false
 */
export const isPc = (): boolean => {
  return window.matchMedia(`screen and (min-width: ${ BREAKPOINT.PC_MIN }px)`).matches
}
