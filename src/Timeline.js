import React from 'react'
import PropTypes from 'prop-types'
import Chart from './Chart'
import Progress from './common/Progress'

import { line } from 'd3-shape'
import { extent } from 'd3-array'
import { scaleTime, scaleLinear } from 'd3-scale'
import { timeParse } from 'd3-time-format'

const defaultMargin = {
  top: 40, right: 40, bottom: 10, left: 50
}

export default class Timeline extends React.Component {
  static propTypes = {
    progress: PropTypes.number,
    step: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
    xData: PropTypes.string,
    id: PropTypes.string,
    labelPos: PropTypes.string,
    title: PropTypes.string,
    titleBkg: PropTypes.string,
    mainBkg: PropTypes.string,
    data: PropTypes.array,
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
    onComplete: PropTypes.func
  };
  static defaultProps = {
    title: 'Timeline',
    xData: 'date',
    height: 100,
    margin:{
      top: 40, right: 40, bottom: 10, left: 50
    },
    showDots: true,
    showGoal: true,
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
    this.parse = timeParse('%Y-%m-%dT%H:%M:%SZ')
    this.state = {
      updateTime: 0,
      complete: false,
      completed: props.progress || 0,
      progress: null,
      width: props.width || 1000
    }
    this.getWidth = this.getWidth.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.complete = this.complete.bind(this)
    this._getStateValue = this._getStateValue.bind(this)
    this._updateStateValue = this._updateStateValue.bind(this)
    this.onComplete = this.onComplete.bind(this)
    this.createChart = this.createChart.bind(this)
    this.doThing = this.doThing.bind(this)
  }
  componentDidMount () {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }
  componentDidUpdate (lastProps, lastState) {
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
    this.setState({ completed: this.props.progress || 0, complete: false })
  }
  complete () {
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
    let { margin } = _self.props
    margin = Object.assign({}, defaultMargin, margin)
    this.w = this.state.width - (margin.left + margin.right)

    let height = this.props.height - (margin.top + margin.bottom)

    this.h = height

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
  doThing () {
    let { data, step } = this.props
    // console.log('Do thing! ', step);
    let stepFocus = step
    let datum = data[stepFocus]
    // If item has onComplete function, call it
    if (datum.onComplete && typeof datum.onComplete === 'function') {
      datum.onComplete()
    }

    // On Last Item? run on Complete
    if (stepFocus === data.length - 1) {
      this.onComplete(step)
    } else {
      this.setState({ completed: step })
    }
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
      completed,
      width
    } = this.state
    let {
      labelPos,
      height,
      title,
      mainBkg,
      margin,
      titleBkg,
      step,
      data,
      id,
      xData,
      showDots,
      showLabels,
      showTicks,
      titleStyle,
      textStyle,
      progressStyle,
      dotStyle,
      dotCompleteStyle,
      goalCompleteDotStyle,
      goalDotStyle,
      wrapStyle,
      style
    } = this.props

    let complete = completed === data.length - 1
    let _self = this
    if (!data) return null
    let parseDate = timeParse('%Y-%m-%dT%H:%M:%S.%LZ')
    let parsedData
    let scaleHalf
    let now = new Date().toISOString()
    let nowVal
    if (data && data.length) {
      parsedData = data.map((d, i) => {
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
      this.createChart(_self)

      // Calculate Vertical Center Point
      scaleHalf = this.yScale(this.h / 2)
      // Calculate X-Scaled Value for NOW
      nowVal = this.xScale(parseDate(now))
      // Calculate percentile progress
      // percentile = nowVal / this.xScale(this.extent[1])
    }

    return (
      <div ref={'container'} style={{ position: 'relative', height: height, ...wrapStyle }}>
        <Chart
          key={width}
          title={title}
          xData={xData}
          titleBkg={titleBkg}
          titleStyle={titleStyle}
          progress={step}
          completeScale={nowVal}
          textStyle={textStyle}
          mainBkg={mainBkg}
          margin={margin}
          id={id}
          labelPos={labelPos}
          complete={complete}
          completed={completed}
          data={this.data}
          dotStyle={dotStyle}
          dotCompleteStyle={dotCompleteStyle}
          goalDotStyle={goalDotStyle}
          goalCompleteDotStyle={goalCompleteDotStyle}
          showDots={showDots}
          showLabels={showLabels}
          showTicks={showTicks}
          style={{ position: 'relative', ...style }}
          height={height}
          width={width}>
          <Progress
            ref='timeline2'
            id={'chart_progress'}
            style={{ fill: '#eee', ...progressStyle }}
            height={8}
            width={nowVal}
            y={scaleHalf - 4} />
        </Chart>
      </div>)
  }
}
