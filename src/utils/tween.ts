import { damp } from '@utils/math'
import { animationFrame } from '@scripts/events/AnimationFrameHandler'

class tween {

  private _position:number
  private _distance:number
  private _alphaSpeed:number

  constructor(option:any) {
    this._position = option.position
    this._distance = option.position
    this._alphaSpeed = option.speed
  }
  step(value:number, deltaTime:number) {
    const e = damp(this._position, value, this._alphaSpeed * animationFrame.fpsRatio, deltaTime)

    this._distance = e - this._position
    this._position = e

  }
  reset() {
    this._position = 0, this._distance = 0
  }

  setSpeed(val:number) {
    this._alphaSpeed = val
  }

  setPosition(val:number) {
    this._position = val
  }

  get getState() {
    return {
      position: this._position,
      distance: this._distance,
      alphaSpeed: this._alphaSpeed,
    }
  }
}

export {
  tween,
}
