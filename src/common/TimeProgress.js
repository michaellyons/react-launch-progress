import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { easeLinear } from 'd3-ease'
import Progress from './Progress'
import { timer } from 'd3-timer'
import { interpolate } from 'd3-interpolate'

class ControlledProgress extends Component {
  static propTypes = {
    duration: PropTypes.number,
    progress: PropTypes.number,
    y: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
    style: PropTypes.object,
    tweenDone: PropTypes.func
  }
  static defaultProps = {
    duration: 500
  }
  constructor (props) {
    super(props)
    this.state = {
      width: props.progress || 0,
      step: null,
      stop: false
    }
    this._getStateValue = this._getStateValue.bind(this)
    this.stop = this.stop.bind(this)
    this.goTween = this.goTween.bind(this)
    this.tweenUp = this.tweenUp.bind(this)
    this.tweenDown = this.tweenDown.bind(this)
    this._updateStateValue = this._updateStateValue.bind(this)
  }
  componentDidMount () {
    // console.log('Mount Progress!')
  }
  componentWillUnmount () {
    // console.log('Unmount Timer!')
    this.timer = null
    this.stop()
  }
  componentWillUpdate (nextProps, nextState) {
    if (nextProps.progress !== this.props.progress) {
      let parsedVal = parseFloat(this.props.progress)
      let parsedNext = parseFloat(nextProps.progress)
      let diff = parsedNext - parsedVal
      // console.log("Will Change Value!");
      // If we're growing, tween in the positive direction
      let func
      if (diff > 0) {
        func = this.tweenUp
      } else if (diff < 0) {
        diff = diff * -1
        func = this.tweenDown
      } else {
        return
      }

      this.tween = func('width', this.state.width, parsedNext, this.props.duration).then((timer) => {
        // console.log("Tween End!");
        if (this.props.tweenDone && typeof this.props.tweenDone === 'function') {
          this.props.tweenDone()
        }
        timer.stop()
      })
    }
  }
  stop () {
    this._setStopped = true
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
  tweenUp (prop, start, end, duration = 500, easing = 'Linear') {
    return this.goTween(prop, start, end, duration, 1, easing)
  }
  tweenDown (prop, start, end, duration = 500, easing = 'Linear') {
    console.log('Tween down!')
    return this.goTween(prop, start, end, duration, -1, easing)
  }
  goTween (prop, start, end, duration = 500, direction = 1, easing = 'Linear') {
    // console.log("Tween with Duration ", duration)
    return new Promise((resolve, reject) => {
      let i = interpolate(start, end)
      let easeFun = easeLinear

      /* The timer stops when the callback retuns a truthy value */
      var time = timer((elapsed, d) => {
        if (this._setStopped) { return true }
        // return true;

        let progress = easeFun(elapsed / duration)

        let value = i(progress)

        // num = value;
        if (direction > 0) {
          if (value >= end) {
            // console.log("Hit the Step Point!")
            this._updateStateValue(prop, end)
            resolve(time)
            return true
          }
        } else {
          if (value <= end) {
            // console.log("Hit the Step Point!")
            this._updateStateValue(prop, end)
            resolve(time)
            return true
          }
        }

        this._updateStateValue(prop, value)

        // _self.setState({width: value})
        if (elapsed > duration) {
          this._updateStateValue(prop, end)
          resolve(time)
          return true
        }
      })
    })
  }
  render () {
    let { y, height, style } = this.props
    let theWidth = this.state.width || this.props.width || 0
    let absoluteWidth = theWidth < 0 ? theWidth * -1 : theWidth
    return <Progress
      y={y}
      height={height}
      width={absoluteWidth}
      style={style} />
  }
}

export default ControlledProgress
