import React from 'react';
import Chart from './Chart';
import * as d3 from 'd3';
import moment from 'moment';

export default class Timeline extends React.Component {
  static defaultProps = {
    timed: false,
    height: 100
  };
  constructor(props) {
    super(props);
    this.state = {
      updateTime: 0,
      width: props.width || 1000
    };
    this.tick = this.tick.bind(this);
    this.getWidth = this.getWidth.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.clear = this.clear.bind(this);
  }
  componentDidMount() {
    let _self = this;
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
        utc,
        style
    } = this.props;
    let parseDate = utc ?
                  d3.timeParse("%Y-%m-%dT%H:%M:%S%Z") :
                  d3.timeParse("%m-%d-%Y");

    let parsedData = data ? data.map((d, i) => {
      return {
        ...d,
        date: parseDate(d.date)
      };
    }) : [];
    return (<div ref={'container'}>
              <Chart
                key={ timed ? updateTime : width}
                title={ title }
                xData={xData || "date"}
                timed={timed}
                titleBkg={titleBkg}
                mainBkg={mainBkg}
                textColor={textColor}
                labelPos={labelPos}
                clearInterval={this.clear}
                data={ parsedData }
                style={{position: 'relative', ...style}}
                height={height || 100}
                width={width}/>
            </div>)
  }
}
