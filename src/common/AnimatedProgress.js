import React, { Component } from 'react'
// import { interpolate, easeLinear, timer } from 'd3'
import { easeLinear } from 'd3-ease'
import { timer } from 'd3-timer'
import { interpolate } from 'd3-interpolate'

class AnimatedProgress extends Component {
  static propTypes = {
    onComplete: React.PropTypes.func,
    points: React.PropTypes.array,
    step: React.PropTypes.number,
    timed: React.PropTypes.bool,
    y: React.PropTypes.number,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    style: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      width: props.width,
      step: null,
      stop: false
    }
    this._getStateValue = this._getStateValue.bind(this)
    this.start = this.start.bind(this)
    this.tweenToNext = this.tweenToNext.bind(this)
    this.tweenFromLast = this.tweenFromLast.bind(this)
    this.stop = this.stop.bind(this)
    this.tween = this.tween.bind(this)
    this._updateStateValue = this._updateStateValue.bind(this)
  }
  componentDidMount () {
  }
  componentWillUnmount () {
    // console.log('Unmount Timer!')
    this.timer = null
    this._setStopped = true
  }
  componentDidUpdate (lastProps, lastState) {
    let { width } = this.props
    if (lastProps.width !== width) {
      console.log('Step Change!')
      this.tween('width', this.state.width, width, 1000)
    }
  }
  start () {
    let { timed, step } = this.props
    this._setStopped = false
    // console.log('Start Animation', step)
    if (timed) {
      this.tweenToNext()
    } else {
      if (step === 0) {
        this.tweenToNext()
      } else {
        this.tweenFromLast()
      }
    }
  }
  stop () {
    this._setStopped = true
  }
  tweenToNext () {
    let { onComplete, points, step } = this.props
    let currPoint = points[step]
    let nextPoint = points[step + 1]
    if (!nextPoint) {
      // console.log('No Next Point!')
      if (onComplete && typeof onComplete === 'function') { onComplete() }
      return
    }
    // console.log('Will Tween to Next!')
    let dur = nextPoint.date.getTime() - currPoint.date.getTime()
    this.tween('width', currPoint.x, nextPoint.x, dur)
  }
  tweenFromLast () {
    let { points, step } = this.props
    let currPoint = points[step]
    let lastPoint = points[step - 1]
    if (!lastPoint) {
      return
    }
    let dur = currPoint.date.getTime() - lastPoint.date.getTime()
    this.tween('width', lastPoint.x, currPoint.x, dur)
  }
  /**
  * Get state value
  * if the prop is not in state regular property
  */
  _getStateValue (prop) {
    let v = this.state && this.state[prop]
    return v === undefined ? this[prop] : v
  }

  /**
  * Set value to state
  * if the prop is not in state, set value to regular property with force update
  */
  _updateStateValue (prop, v) {
    if (typeof v !== 'number') {
      return false
    }
    if (this.state && this.state[prop] !== undefined) {
      let state = {}
      state[prop] = v
      this.setState(state)
    } else {
      let { ...state } = this.state
      state[prop] = v
      this.setState(state)
    }
  }
  tween (prop, start, end, duration = 500, easing = 'Linear') {
    // console.log("Tween with Duration ", duration)
    return new Promise((resolve, reject) => {
      let i = interpolate(start, end)
      let easeFun = easeLinear

      /* The timer stops when the callback retuns a truthy value */
      timer((elapsed, d) => {
        if (this._setStopped) { return true }

        let progress = easeFun(elapsed / duration)

        let value = i(progress)

        // num = value;
        this._updateStateValue(prop, value)

        if (value >= end) {
          // console.log("Hit the Step Point!");
          return true
        }
        // _self.setState({width: value})
        if (elapsed > duration) {
          this._updateStateValue(prop, end)
          resolve()
          return true
        }
      })
    })
  }
  render () {
    let theWidth = this.state.width || 0
    let absoluteWidth = theWidth < 0 ? theWidth * -1 : theWidth
    let { y, height, style } = this.props
    return <rect
      y={y}
      height={height}
      style={style}
      transform={'scale(' + (absoluteWidth) + ',1)'}
      width={1} />
  }
}

export default AnimatedProgress
