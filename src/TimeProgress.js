import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Chart from './Chart'
import TimeProgress from './common/TimeProgress'
import { line } from 'd3-shape'
import { extent } from 'd3-array'
import { scaleTime, scaleLinear } from 'd3-scale'
import { timeParse } from 'd3-time-format'

const defaultMargin = {
  top: 40, right: 40, bottom: 10, left: 50
}
/**
 * General component description.
 */
class TimeProgressChart extends Component {
  static propTypes = {
    data: PropTypes.array,
    height: PropTypes.number,
    width: PropTypes.number,
    xData: PropTypes.string,
    parseSpecifier: PropTypes.string,
    id: PropTypes.string,
    labelPos: PropTypes.string,
    title: PropTypes.string,
    titleBkg: PropTypes.string,
    mainBkg: PropTypes.string,
    margin: PropTypes.object,
    showDots: PropTypes.bool,
    showLabels: PropTypes.bool,
    showTicks: PropTypes.bool,
    goalDotStyle:PropTypes.object,
    goalCompleteDotStyle:PropTypes.object,
    titleStyle:PropTypes.object,
    textStyle:PropTypes.object,
    dotStyle:PropTypes.object,
    dotCompleteStyle:PropTypes.object,
    progressStyle:PropTypes.object,
    wrapStyle:PropTypes.object,
    style:PropTypes.object,
    dotColor: PropTypes.string,
    goalColor: PropTypes.string,
    dotCompleteColor: PropTypes.string,
    goalCompleteColor: PropTypes.string,
    progressColor: PropTypes.string,
    textColor: PropTypes.string,
    onComplete: PropTypes.func
  };
  static defaultProps = {
    title: '',
    xData: 'date',
    height: 100,
    parseSpecifier: '%Y-%m-%dT%H:%M:%S.%LZ',
    margin:{
      top: 40, right: 40, bottom: 10, left: 50
    },
    showDots: true,
    showGoal: true,
    dotCompleteColor: '#0088d1',
    textStyle: {
      fontSize: '14px',
      fill: '#fffff'
    },
    dotCompleteStyle: {
      fill: '#0088d1'
    },
    goalCompleteDotStyle: {
      fill: 'darkgreen'
    }
  };
  constructor (props) {
    super(props)
    this.data = []
    this.state = {
      updateTime: 0,
      complete: false,
      now: new Date().toISOString(),
      width: props.width || 1000
    }
    this.getWidth = this.getWidth.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.complete = this.complete.bind(this)
    this._getStateValue = this._getStateValue.bind(this)
    this._updateStateValue = this._updateStateValue.bind(this)
    this.onComplete = this.onComplete.bind(this)
    this.createChart = this.createChart.bind(this)
    this.runUpdate = this.runUpdate.bind(this)
    this.startInterval = this.startInterval.bind(this)
    this.clearInterval = this.clearInterval.bind(this)
  }
  componentDidMount () {
    this.handleResize()
    this.createChart(this)
    this.startInterval()
    window.addEventListener('resize', this.handleResize)
  }
  componentDidUpdate (lastProps, lastState) {
  }
  startInterval () {
    if (this.idealSpeed) {
      // console.log("Start Interval with speed: ", this.idealSpeed)
      this.interval = setInterval(this.runUpdate, this.idealSpeed)
    }
  }
  clearInterval () {
    clearInterval(this.interval)
  }
  runUpdate () {
    // console.log("Run Update!", this.props.id);
    this.setState({ now: new Date().toISOString() })
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }
  handleResize () {
    this.setState({ width: this.getWidth() })
  }
  getWidth () {
    return this.refs.container.offsetWidth
  }
  reset () {
    this.setState({ complete: false })
  }
  complete () {
    this.clearInterval()
    this.props.onComplete()
    this.setState({ complete: true, play: false })
  }
  _getStateValue (prop) {
    return this.state[prop]
  }
  _updateStateValue (prop, value, resolve) {
    let { ...state } = this.state
    state[prop] = value
    this.setState(state)
  }
  createChart (_self) {
    let { margin, xData, data, parseSpecifier } = _self.props
    let parseDate = this.parseDate = timeParse(parseSpecifier)

    let parsedData = data.map((d, i) => {
      return {
        ...d,
        date: parseDate(d.date)
      }
    }).sort((a, b) => {
      if (!a || !b) return 0
      if (!a[xData] || !b[xData]) return 0
      return a[xData].getTime() - b[xData].getTime()
    })
    this.data = parsedData
    this.extent = extent(parsedData, function (d) {
      return d[xData]
    })
    margin = Object.assign({}, defaultMargin, margin)
    this.w = this.state.width - (margin.left + margin.right)
    if (this.extent[1] && this.extent[0]) {
      this.secondsTotal = (this.extent[1].getTime() - this.extent[0].getTime()) / 1000
    }
    this.idealSpeed = this.secondsTotal / this.w

    let height = this.h = this.props.height - (margin.top + margin.bottom)

    this.xScale = scaleTime()
          .domain(this.extent)
          .rangeRound([0, this.w])

    this.yScale = scaleLinear()
          .domain([0, height])
          .range([this.h, 0])

    this.line = line()
          .x((d) => {
            return d && this.xScale(d[_self.props.xData] || 0)
          })
          .y((d) => {
            return this.yScale(height / 2)
          })

    this.transform = 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')'
  }
  onComplete (step) {
    // console.log('Done with Timeline!')
    // this.refs.timeline.stop()
    this.setState({ completed: step })
    if (this.props.onComplete) {
      this.props.onComplete()
    }
  }
  start () {
    this.setState({ play: true, complete: false })
    let { data } = this.props
    if (data[0].onComplete && typeof data[0].onComplete === 'function') {
      data[0].onComplete()
    }
    this.refs.timeline.start()
  }
  render () {
    let {
      width,
      now
    } = this.state
    let {
      height,
      margin,
      data,
      parseSpecifier,
      id,
      xData,
      ...styles
    } = this.props

    let complete
    let _self = this
    if (!data) return null
    let scaleHalf
    let endScale
    let nowScale
    if (data && data.length) {
      this.createChart(_self)

      // Calculate Vertical Center Point
      scaleHalf = this.yScale(this.h / 2)
      // Calculate X-Scaled Value for NOW
      endScale = this.xScale(this.extent[1])

      // if Now coerces to true, try to parse. else set 0
      nowScale = now ? this.xScale(this.parseDate(now)) : 0

      // Determine if Completed based on if Now is greater than the End
      complete = nowScale >= endScale

      // Cap Nowscale at the end scale.
      nowScale = complete ? endScale : nowScale

      // Calculate percentile progress
      // percentile = nowScale / this.xScale(this.extent[1])
    }

    return (
      <div ref={'container'} style={{ position: 'relative', height: height, ...styles.wrapStyle }}>
        <Chart
          key={width}
          xData={xData}
          xScale={this.xScale}
          margin={margin}
          id={id}
          now={nowScale}
          data={this.data}
          complete={complete}
          {...styles}
          width={width}
          height={height}
          onComplete={this.complete}
          >
          <TimeProgress
            ref={'timeline'}
            id={'chart_progress'}
            style={{ fill: '#eee', ...styles.progressStyle }}
            height={8}
            tweenDone={() => {}}
            progress={nowScale}
            duration={this.idealSpeed}
            y={scaleHalf - 4} />
        </Chart>
      </div>)
  }
}
export default TimeProgressChart
