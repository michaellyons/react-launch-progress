import React from 'react';
import Chart from './Chart';
import * as d3 from 'd3';

export default class Timeline extends React.Component {
  static defaultProps = {
    title: 'Timeline',
    xData: 'date',
    timed: false,
    height: 100,
    showDots: true,
    showGoal: true
  };
  constructor(props) {
    super(props);
    this.parse = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
    this.state = {
      updateTime: 0,
      complete: false,
      width: props.width || 1000
    };
    this.tick = this.tick.bind(this);
    this.getWidth = this.getWidth.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.complete = this.complete.bind(this);
    this.clear = this.clear.bind(this);
  }
  componentDidMount() {
    let _self = this;
    this.parse = this.props.utc ?
                  d3.timeParse("%Y-%m-%dT%H:%M:%S%Z") :
                  d3.timeParse("%m-%d-%Y");
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    if (this.props.timed) {
      this.interval = setInterval(() => {
        console.log("Tick!");
        _self.tick();
      }, 1000)
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.clear();
  }
  handleResize() {
      this.setState({width: this.getWidth()});
  }
  getWidth() {
      return this.refs.container.offsetWidth;
  }
  tick() {
    this.setState({updateTime: this.state.updateTime+1})
  }
  clear() {
    clearInterval(this.interval);
  }
  complete() {
    clear();
    this.setState({complete: true});
  }
  render() {
    let { updateTime, width } = this.state;
    let {
        textColor,
        labelPos,
        height,
        timed,
        title,
        mainBkg,
        titleBkg,
        data,
        xData,
        dotColor,
        dotCompleteColor,
        showDots,
        showLabels,
        showTicks,
        showGoal,
        goalColor,
        dotStyle,
        dotCompleteStyle,
        goalDotStyle,
        utc,
        wrapStyle,
        style
    } = this.props;
    let _self = this;
    let parseDate = utc ?
                  d3.timeParse("%Y-%m-%dT%H:%M:%S%Z") :
                  d3.timeParse("%m-%d-%Y");

    let extent;
    let parsedData = [];
    if (data) {

      parsedData = data.map((d, i) => {
        return {
          ...d,
          date: _self.parse(d.date)
        };
      });
      extent = d3.extent(parsedData, function (d) {
          return d[xData];
      });
    }
    return (<div ref={'container'} style={{position: 'relative', height: height, ...wrapStyle}}>
              <Chart
                key={ timed ? updateTime : width }
                title={ title }
                xData={xData || "date"}
                timed={timed}
                titleBkg={titleBkg}
                mainBkg={mainBkg}
                textColor={textColor}
                labelPos={labelPos}
                clearInterval={this.clear}
                data={ parsedData }
                dotStyle={dotStyle}
                dotCompleteStyle={dotCompleteStyle}
                goalDotStyle={goalDotStyle}
                showGoal={showGoal}
                showDots={showDots}
                showLabels={showLabels}
                showTicks={showTicks}
                style={{position: 'relative', ...style}}
                height={height || 100}
                width={width}/>
            </div>)
  }
}
