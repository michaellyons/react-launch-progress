import React from 'react'
import PropTypes from 'prop-types'
import Dot from './common/Dot'
import Line from './common/Line'
// array of curve functions and tites
import { line } from 'd3-shape'
import { extent } from 'd3-array'
import { scaleTime, scaleLinear } from 'd3-scale'

const defaultMargin = {
  top: 40, right: 40, bottom: 10, left: 50
}
class Chart extends React.Component {
  static propTypes = {
    width:PropTypes.number,
    height:PropTypes.number,
    progress:PropTypes.number,
    labelPos:PropTypes.string,
    title:PropTypes.string,
    titleBkg:PropTypes.string,
    mainBkg:PropTypes.string,
    id:PropTypes.string,
    data:PropTypes.array.isRequired,
    xData:PropTypes.string.isRequired,
    children:PropTypes.object,
    margin:PropTypes.object,
    complete: PropTypes.bool,
    completed: PropTypes.number,
    completeScale:PropTypes.number,
    showDots: PropTypes.bool,
    showLabels: PropTypes.bool,
    showTicks: PropTypes.bool,
    goalDotStyle:PropTypes.object,
    goalCompleteDotStyle:PropTypes.object,
    titleStyle:PropTypes.object,
    textStyle:PropTypes.object,
    dotStyle:PropTypes.object,
    dotCompleteStyle:PropTypes.object,
    style:PropTypes.object
  };
  static defaultProps = {
    width: 800,
    height: 300,
    xData: 'date',
    id: 'event-timeline',
    showDots: true,
    showLabels: true,
    showTicks: true,
    textStyle: {
      fill: '#fff'
    },
    margin:{
      top: 40, right: 40, bottom: 10, left: 50
    }
  };
  constructor (props) {
    super(props)
    this.state = {
      progress: null,
      width: props.width || 800
    }
    this.createChart = this.createChart.bind(this)
  }
  createChart (_self) {
    let { margin } = this.props
    this.margin = margin = Object.assign({}, defaultMargin, margin)
    this.w = this.props.width - (margin.left + margin.right)

    let height = this.props.height - (margin.top + margin.bottom)

    this.h = height

    this.xScale = scaleTime()
            .domain(extent(_self.props.data, function (d) {
              return d[_self.props.xData]
            }))
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

    this.transform = 'translate(' + margin.left + ',' + margin.top + ')'
  }
  getOffset (offset, i) {
    switch (offset) {
      case 'alternate-top':
        return i % 2 ? 1 : -1
      case 'alternate-bot':
        return i % 2 ? -1 : 1
      case 'top':
        return -1
      case 'bottom':
      default:
        return 1
    }
  }
  render () {
    let { title,
          data,
          complete,
          completed,
          completeScale,
          goalDotStyle,
          width,
          goalCompleteDotStyle,
          dotStyle,
          dotCompleteStyle,
          textStyle,
          titleStyle,
          showDots,
          showLabels,
          showTicks,
          progress,
          labelPos,
          mainBkg,
          titleBkg,
          height } = this.props

    // Declare Arrays for SVG Elements
    let dots = []
    let elems
    let labels = []
    let ticks = []
    let goal
    let goalScale
    if (!data || !data.length) {
      return null
    }
    let _self = this
    this.createChart(_self)
    // Scale half the Height of the Graph Content Area
    // To find Y Value of Horizontal Time Line

    // Grab the Last Element as the Goal
    let scaleHalf = this.yScale(this.h / 2)

    goal = data.pop()

    goalScale = goal ? this.xScale(goal[this.props.xData]) : 0

    elems = data.map((d, i) => {
      // Scale for X location of datum
      let dX = this.xScale(d[this.props.xData])
      if (isNaN(dX)) return
      let itemDone = i <= completed
      // Offset is multipler for vertical direction of label/ticks
      let offSet = this.getOffset(labelPos, i)

      // Push onto Ticks Array
      ticks.push(<line
        key={'tick_' + i}
        strokeWidth={'2'}
        stroke={'#ddd'}
        x1={this.xScale(d[this.props.xData])}
        x2={this.xScale(d[this.props.xData])}
        y1={scaleHalf}
        y2={scaleHalf + (12 * offSet)} />)

      // Push onto labels array for Item
      labels.push(<text
        textAnchor={i === 0 ? 'start' : 'middle'}
        key={'label_' + i}
        x={dX}
        y={offSet < 0 ? scaleHalf - 14 : scaleHalf + 28}
        fontFamily='Verdana'
        fontSize='16'
        fill={'#fff'}
        style={textStyle}>
        {d.name}
      </text>)

      // Push onto Dots array for Item
      dots.push(<Dot
        key={'dot_' + i + progress + itemDone}
        id={'dot_' + i}
        done={i <= progress}
        x={dX}
        y={scaleHalf}
        r={'6'}
        style={{
          fill: '#ddd',
          stroke: '#000',
          strokeWidth: 1,
          ...(dX <= completeScale ? dotCompleteStyle : dotStyle)
        }} />)
            // If it's the last item, draw line to goal (which was removed)
      if (i === data.length - 1) {
        let firstOrLast = i === 0 || i === this.props.data.length - 1
        return <Line
          path={this.line([d, goal])}
          style={{
            stroke: '#666',
            strokeLinecap: firstOrLast ? 'round' : '' }}
          key={i}
          strokeWidth={8} />
      }
      // Return line from point to next point in data
      return <Line
        path={this.line([d, data[i + 1]])}
        key={i}
        style={{ stroke: '#666', strokeLinecap: i === 0 ? 'round' : '' }}
        strokeWidth={8} />
    })
    // Add the Goal Label
    labels.push(
      <text
        key={'goal_label'}
        id={'goal_label'}
        x={goalScale}
        y='50'
        fill={'#fff'}
        textAnchor='end'
        fontFamily='Verdana'
        fontSize='16'
        style={textStyle}>
        { goal.name}
      </text>
    )
    // Add the Goal Dot
    dots.push(
      <Dot
        key={'goal_dot' + complete}
        id={'goal_dot'}
        x={this.xScale(goal[this.props.xData])}
        r={'6'}
        style={{
          fill: '#ddd',
          stroke: '#00fefe',
          strokeWidth: 2,
          ...(complete ? goalCompleteDotStyle : goalDotStyle)
        }}
        y={scaleHalf} />)

    return (
      <div style={{ width: width, ...this.props.style }} key={width} ref={'container'}>
        <svg id={this.props.id} ref='svg' width={width} height={height}>

          <polygon
            points={`0,0 300,0 345,24 ${width - 40},24 ${width - 40}, ${height} 0,${height}`}
            style={{ fill: (titleBkg || 'navy'), stroke:'', strokeWidth:1 }} />

          <rect fill={mainBkg || 'grey'} y={32} width={width} height={height - 24} />

          <text
            id={'chart_title'}
            y='22'
            x={this.margin.left - 4 || '20'}
            fontFamily='Verdana'
            fontSize='16'
            fill={'#fff'}
            style={titleStyle}>
            {title}
          </text>

          <g transform={this.transform} fill='#333'>
            { showLabels && labels }
            <Line
              path={this.line([this.props.data[0], goal])}
              key={'abc'}
              style={{ strokeLinecap: 'round' }}
              stroke={'#666'}
              strokeWidth={14} />
            { elems }
            { showTicks && ticks }
            { this.props.children }
            <g id='dots'>
              { showDots && dots }
            </g>
          </g>
        </svg>
      </div>
    )
  }
};

module.exports = Chart
