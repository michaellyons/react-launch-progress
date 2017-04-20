import React from 'react';
import Dot from './common/Dot';
import Line from './common/Line';

// array of curve functions and tites
import * as d3 from 'd3';

class Chart extends React.Component {
    static propTypes = {
        width:React.PropTypes.number,
        height:React.PropTypes.number,
        id:React.PropTypes.string,
        data:React.PropTypes.array.isRequired,
        xData:React.PropTypes.string.isRequired,
        margin:React.PropTypes.object,
        yMaxBuffer:React.PropTypes.number,
        fill:React.PropTypes.string
    };
    static defaultProps = {
        width: 800,
        height: 300,
        xData: 'date',
        id: 'event-timeline',
        showGoal: true,
        showDots: true,
        margin:{
            top: 40, right: 40, bottom: 10, left: 50
        },
        yMaxBuffer:10
    };
    constructor(props) {
      super(props);
      this.state = {
          progress: null,
          width: props.width || 800
      };
      this.handleResize = this.handleResize.bind(this);
      this.getWidth = this.getWidth.bind(this);
      this.createLineSegment = this.createLineSegment.bind(this);
      this.createChart = this.createChart.bind(this);
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    handleResize() {
        this.setState({width: this.getWidth()});
    }
    getWidth() {
        return this.refs.container.offsetWidth;
    }
    componentDidUpdate(lastProps, lastState) {
    }
    createChart(_self){
        let { yMin, margin } = _self.props;

        this.w = this.state.width - (margin.left + margin.right);
        let height = this.props.height - (margin.top + margin.bottom);
        this.h = height;

        this.xScale = d3.scaleTime()
            .domain(d3.extent(_self.props.data, function (d) {
                return d[_self.props.xData];
            }))
            .rangeRound([0, this.w]);
        let yMinVal = yMin ? yMin :
                        d3.min(this.props.data, function(d){
                            return d[_self.props.yData]-_self.props.yMinBuffer;
                        });
        this.yScale = d3.scaleLinear()
            .domain([0,height])
            .range([this.h, 0]);

        this.line = d3.line()
            .curve(d3.curveCardinal)
            .x((d) => {
                return d && this.xScale(d[_self.props.xData]);
            })
            .y((d) => {
                return this.yScale(height/2);
            });

        this.transform='translate(' + this.props.margin.left + ',' + this.props.margin.top + ')';
    }
    createLineSegment(datum, i) {
      return <Line path={this.line(datum)} key={i} fill={'#fe001a'} strokeWidth={2} />
    }
    getOffset(offset, i) {
      switch(offset) {
        case 'alternate':
          return i % 2 ? 1 : -1;
        case 'top':
          return -1;
        case 'bottom':
        default:
          return 1;
      }
    }
    render() {

        let { width } = this.state;

        let { title,
              progressStyle,
              showGoal,
              goalDotStyle,
              dotStyle,
              dotCompleteStyle,
              showDots,
              labelPos,
              mainBkg,
              margin,
              titleBkg,
              textColor,
              height } = this.props;

        // Height minus margin
        let heightMargind = height - (margin.top + margin.bottom)
        // Declare Arrays for SVG Elements
        let dots = [];
        let elems;
        let labels = [];
        let ticks = [];
        let goal;
        let progress;

        if (!this.props.data || !this.props.data.length) {
          return null;
        }
        let _self = this;
        this.createChart(_self);
        let extent;

        if (this.props.data != null && this.props.data.length) {
          // Grab the Last Element as the Goal
          extent = d3.extent(_self.props.data, function (d) {
              return d[_self.props.xData];
          })
          goal = this.props.data.pop();

          let goalScale = goal ? this.xScale(goal[this.props.xData]) : 0;

          // Create Obj representing Now
          let nowObj = {
            date: new Date()
          };

          // Get the Scale Value of the Progress
          let nowScaleVal = this.xScale(nowObj.date);

          // If Now is greater than goal, then we're done
          let done = nowScaleVal > goalScale;
          // Create the Progress Line
          progress = <Line
                      ref='progress'
                      path={this.line([this.props.data[0], (done ? goal : nowObj)])}
                      stroke={'#eee'}
                      strokeWidth={8}
                      strokeLinecap={'round'}
                      style={{...progressStyle}}/>

          // Add the Dot representing current progress (now)
          // dots.push(<Dot x={this.xScale(new Date()) + 3} r={6} style={{fill: '#fe001a'}} key={'a'} y={this.yScale(goal[this.props.yData])} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip} /> )

          // Scale half the Height of the Graph Content Area
          // To find Value of Horizontal Time Line
          let scaleHalf = this.yScale(heightMargind/2);

          // Add the Goal Dot
          if (goal && showGoal) dots.push(<Dot id={'goal_dot'} x={this.xScale(goal[this.props.xData])} r={'6'} style={{fill: '#ddd', stroke: '#00fefe', strokeWidth: 2, ...goalDotStyle}} key='b' y={scaleHalf} /> )

          elems = this.props.data.map((d, i) => {
            // Scale for X location of datum
            let dX = this.xScale(d[this.props.xData]);

            // Offset is multipler for vertical direction of label/ticks
            let offSet = this.getOffset(labelPos, i);

            // Push onto Ticks Array
            ticks.push(<line
              key={'tick_'+i}
              strokeWidth={'2'}
              stroke={'#ddd'}
              x1={this.xScale(d[this.props.xData])}
              x2={this.xScale(d[this.props.xData])}
              y1={scaleHalf}
              y2={scaleHalf + (12 * offSet)} />)
            // Push onto labels array for Item
            labels.push(<text textAnchor={i == 0 ? 'start' : 'middle'} key={'label_'+i} x={dX} y={offSet < 0 ? scaleHalf - 14 : scaleHalf + 28} fill={textColor || '#000'} fontFamily="Verdana" fontSize="16">{d.name}</text>)
            // Push onto Dots array for Item
            dots.push(<Dot key={'dot'+i} x={dX} y={scaleHalf} r={'6'} style={{fill: '#ddd', stroke: '#000', strokeWidth: 1, ...(dX < nowScaleVal ? dotCompleteStyle : dotStyle)}} /> )
            // If it's the last item, draw line to goal (which was removed)
            if (i == this.props.data.length - 1) return <Line path={this.line([d, goal])} style={{stroke: '#666', strokeLinecap: i == 0 ? 'round' : ''}} key={i} strokeWidth={14} />;
            // Return line from point to next point in data
            return <Line path={this.line([d, this.props.data[i+1]])} key={i} style={{stroke: '#666', strokeLinecap: i == 0 ? 'round' : ''}} strokeWidth={14} />;
          })
        }
        return (
            <div style={this.props.style} key={width} ref={'container'}>
                <svg id={this.props.id} ref='svg' width={width} height={height}>
                    <polygon points={`0,0 300,0 345,24 ${width - 40},24 ${width - 40}, 250 0,250`} style={{fill: (titleBkg || 'navy'),stroke:'',strokeWidth:1}} />
                    <rect fill={mainBkg || 'grey'} y={32} width={width} height={height - 31} />
                    <text id={'chart_title'} y="22" x={this.props.margin.left - 4 || "20"} fill={textColor || '#000'} fontFamily="Verdana" fontSize="16">
                      {title}
                    </text>
                    <text id={'goal_label'} x={this.state.width - 6} y="50" fill={textColor || '#000'} textAnchor="end" fontFamily="Verdana" fontSize="16">
                      {goal && goal.name}
                    </text>
                    <g transform={this.transform} fill='#333'>
                      { labels }
                      { elems }
                      <Line path={this.line([this.props.data[0], goal])} key={'abc'} stroke={'#aaa'} strokeWidth={8} strokeLinecap={'round'} />
                      { progress }
                      { ticks }
                      <g id="dots">
                      { showDots && dots }
                      </g>
                    </g>
                </svg>
            </div>
        );
    }
};

module.exports = Chart;
