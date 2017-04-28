import React from 'react'
import Dot from './common/Dot'
import Line from './common/Line'
// array of curve functions and tites
import { line, curveCardinal, extent, scaleTime, scaleLinear } from 'd3'
const defaultMargin = {
  top: 40, right: 40, bottom: 10, left: 50
}
class Chart extends React.Component {
  static propTypes = {
    width:React.PropTypes.number,
    height:React.PropTypes.number,
    progress:React.PropTypes.number,
    labelPos:React.PropTypes.string,
    title:React.PropTypes.string,
    titleBkg:React.PropTypes.string,
    mainBkg:React.PropTypes.string,
    id:React.PropTypes.string,
    data:React.PropTypes.array.isRequired,
    xData:React.PropTypes.string.isRequired,
    children:React.PropTypes.object,
    margin:React.PropTypes.object,
    complete: React.PropTypes.bool,
    showDots: React.PropTypes.bool,
    showLabels: React.PropTypes.bool,
    showTicks: React.PropTypes.bool,
    goalDotStyle:React.PropTypes.object,
    goalCompleteDotStyle:React.PropTypes.object,
    titleStyle:React.PropTypes.object,
    textStyle:React.PropTypes.object,
    dotStyle:React.PropTypes.object,
    dotCompleteStyle:React.PropTypes.object,
    style:React.PropTypes.object
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
    this.createLineSegment = this.createLineSegment.bind(this)
    this.createChart = this.createChart.bind(this)
  }
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (lastProps, lastState) {
  }
  createChart (_self) {
    let { margin } = _self.props
    margin = Object.assign({}, defaultMargin, margin)
    this.w = this.state.width - (margin.left + margin.right)

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
            .curve(curveCardinal)
            .x((d) => {
              return d && this.xScale(d[_self.props.xData] || 0)
            })
            .y((d) => {
              return this.yScale(height / 2)
            })

    this.transform = 'translate(' + margin.left + ',' + margin.top + ')'
  }
  createLineSegment (datum, i) {
    return <Line path={this.line(datum)} key={i} fill={'#fe001a'} strokeWidth={2} />
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
    let { width } = this.state

    let { title,
          data,
          complete,
          goalDotStyle,
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
    var scaleHalf = this.yScale(this.h / 2)

    goal = data.pop()

    goalScale = goal ? this.xScale(goal[this.props.xData]) : 0

    elems = data.map((d, i) => {
            // Scale for X location of datum
      let dX = this.xScale(d[this.props.xData])
      if (isNaN(dX)) return
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
        key={'dot_' + i}
        id={'dot_' + i}
        x={dX}
        y={scaleHalf}
        r={'6'}
        style={{
          fill: '#ddd',
          stroke: '#000',
          strokeWidth: 1,
          ...(i <= progress ? dotCompleteStyle : dotStyle)
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
          strokeWidth={14} />
      }
      // Return line from point to next point in data
      return <Line
        path={this.line([d, data[i + 1]])}
        key={i}
        style={{ stroke: '#666', strokeLinecap: i === 0 ? 'round' : '' }}
        strokeWidth={14} />
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
            points={`0,0 300,0 345,24 ${width - 40},24 ${width - 40}, 250 0,250`}
            style={{ fill: (titleBkg || 'navy'), stroke:'', strokeWidth:1 }} />

          <rect fill={mainBkg || 'grey'} y={32} width={width} height={height - 24} />

          <text
            id={'chart_title'}
            y='22'
            x={this.props.margin.left - 4 || '20'}
            fontFamily='Verdana'
            fontSize='16'
            fill={'#fff'}
            style={titleStyle}>
            {title}
          </text>

          <g transform={this.transform} fill='#333'>
            { showLabels && labels }
            { elems }
            <Line
              path={this.line([this.props.data[0], goal])}
              key={'abc'}
              stroke={'#aaa'}
              strokeWidth={8}
              strokeLinecap={'round'} />
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
