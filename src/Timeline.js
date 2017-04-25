import React from 'react'
import Chart from './Chart'
import Dot from './common/Dot'
import AnimatedProgress from './common/AnimatedProgress'
import { line, curveCardinal, extent, scaleTime, scaleLinear, timeParse } from 'd3'

// let lastBlurTime = 0

export default class Timeline extends React.Component {
  static propTypes = {
    progress: React.PropTypes.number,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    xData: React.PropTypes.string,
    labelPos: React.PropTypes.string,
    title: React.PropTypes.string,
    titleBkg: React.PropTypes.string,
    mainBkg: React.PropTypes.string,
    duration: React.PropTypes.number,
    data: React.PropTypes.array,
    margin: React.PropTypes.object,
    autoStart: React.PropTypes.bool,
    showDots: React.PropTypes.bool,
    showLabels: React.PropTypes.bool,
    showTicks: React.PropTypes.bool,
    utc: React.PropTypes.bool,
    timed: React.PropTypes.bool,
    goalDotStyle:React.PropTypes.object,
    goalCompleteDotStyle:React.PropTypes.object,
    titleStyle:React.PropTypes.object,
    textStyle:React.PropTypes.object,
    dotStyle:React.PropTypes.object,
    dotCompleteStyle:React.PropTypes.object,
    progressStyle:React.PropTypes.object,
    wrapStyle:React.PropTypes.object,
    style:React.PropTypes.object,
    onComplete: React.PropTypes.func
  };
  static defaultProps = {
    title: 'Timeline',
    xData: 'date',
    timed: false,
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
    this.parse = timeParse('%Y-%m-%dT%H:%M:%S%Z')
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
          .curve(curveCardinal)
          .x((d) => {
            return d && this.xScale(d[_self.props.xData] || 0)
          })
          .y((d) => {
            return this.yScale(height / 2)
          })

    this.transform = 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')'
  }
  doThing (step) {
    let { data, timed } = this.props
    let stepFocus = timed ? step + 1 : step
    let datum = timed ? data[stepFocus] : data[step]
    if (datum.onComplete && typeof datum.onComplete === 'function') {
      datum.onComplete()
    }
    if (stepFocus === data.length - 1) {
      this.onComplete(step)
    } else {
      this.setState({ completed: step + 1 })
    }
  }
  onComplete (step) {
    // console.log('Done with Timeline!')
    this.refs.timeline.stop()
    this.setState({ complete: true, play: false, completed: step + 1 })
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
    let { play, complete, completed, width } = this.state
    let {
        labelPos,
        height,
        timed,
        duration,
        title,
        progress,
        mainBkg,
        titleBkg,
        data,
        xData,
        showDots,
        showLabels,
        showTicks,
        autoStart,
        titleStyle,
        textStyle,
        progressStyle,
        dotStyle,
        dotCompleteStyle,
        goalCompleteDotStyle,
        goalDotStyle,
        utc,
        wrapStyle,
        style
    } = this.props

    let _self = this
    if (!data) return null
    let parseDate = utc
                  ? timeParse('%Y-%m-%dT%H:%M:%S%Z')
                  : timeParse('%m-%d-%Y')
    let parsedData
    let eventPoints
    let scaleHalf
    let dots = []
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
      scaleHalf = this.yScale(this.h / 2)
      eventPoints = parsedData.map((d, i) => {
        let xVal = this.xScale(d.date)
        dots.push(<Dot
          key={'dots' + i}
          x={xVal}
          y={scaleHalf}
          r={'6'}
          style={{
            fill: '#ddd',
            stroke: '#000',
            strokeWidth: 1,
            ...(i <= completed ? dotCompleteStyle : dotStyle) }} />)
        return {
          x: xVal,
          ...d
        }
      })
    }

    let aProgLine = timed
                ? <AnimatedProgress
                  key={'progLine2'}
                  ref='timeline'
                  id={'chart_progress'}
                  style={{ fill: '#eee', ...progressStyle }}
                  height={8}
                  autoStart={play || autoStart}
                  data={this.data}
                  onPointComplete={this.doThing}
                  points={eventPoints}
                  timed={timed}
                  y={scaleHalf - 4}
                  step={completed}
                  duration={duration}
                  complete={complete}
                  start={eventPoints[completed]}
                  end={this.xScale(this.extent[1])} />
                  : <AnimatedProgress
                    key={'progLine2'}
                    id={'chart_progress'}
                    ref='timeline'
                    style={{ fill: '#eee', ...progressStyle }}
                    height={8}
                    timed={timed}
                    complete={complete}
                    data={this.data}
                    onPointComplete={this.doThing}
                    points={eventPoints}
                    y={scaleHalf - 4}
                    step={progress}
                    duration={1000}
                    start={eventPoints[progress]}
                    end={this.xScale(this.extent[1])} />
    return (<div ref={'container'} style={{ position: 'relative', height: height, ...wrapStyle }}>
      <Chart
        key={timed ? width + completed : width + completed}
        title={title}
        xData={xData || 'date'}
        timed={timed}
        titleBkg={titleBkg}
        titleStyle={titleStyle}
        progress={completed}
        textStyle={textStyle}
        mainBkg={mainBkg}
        labelPos={labelPos}
        complete={complete}
        data={this.data}
        dotStyle={dotStyle}
        dotCompleteStyle={dotCompleteStyle}
        goalDotStyle={goalDotStyle}
        goalCompleteDotStyle={goalCompleteDotStyle}
        showDots={showDots}
        showLabels={showLabels}
        showTicks={showTicks}
        style={{ position: 'relative', ...style }}
        height={height || 100}
        width={width}>
        {aProgLine}
      </Chart>
    </div>)
  }
}
