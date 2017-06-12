import React from 'react';
import ReactDOM from 'react-dom';
import { TimeProgress, StepProgress } from '../src';
import moment from 'moment';
import marked from 'marked';
import ParallaxWrap from './Parallax';
import LazyImage from './LazyImage';
import styleProps from './style_props';

import { TimeProgress as rawTimeProgress} from 'raw-loader!../src/TimeProgress'
import './main.css';
var ReactToastr = require("react-toastr");
var { ToastContainer } = ReactToastr;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
import {
  getSomeSteps,
  getThisWeek,
  getThisDay,
  getThisHour,
  getThisMinute,
  getLaunchTimeline
} from './test_data';

const ProgressCodeString  = () => {
 return (
'```javascript\n\
import { StepProgress } from \'react-launch-progress\' \
\n\
class AwesomeComponent extends Component {\n\
  constructor(props) {\n\
    super(props);\n\
  }\n\
  render() {\n\
    let { steps, step } = this.props;\n\
    return <StepProgress step={step} data={steps} />\n\
  }\n\
}\n\
```')
}
const TimeProgressCodeString  = () => {
 return (
'```javascript\n\
import moment from \'moment\' \n\
import { TimeProgress } from \'react-launch-progress\' \
\n\
class AwesomeComponent extends Component {\n\
  constructor(props) {\n\
    super(props);\n\
  }\n\
  render() {\n\
    let { data } = this.props;\n\
    return <TimeProgress title={"This Week"} data={data} />\n\
  }\n\
}\n\
```')
}

const StepProgressDesc =
`Displays progress controlled by component's ***step*** property which indicates position in an array of steps.
`
const TimeProgressDesc =
`Displays progress determined by present time (now) through an array of objects scaled by a date-string.
`

const THIS_WEEK = getThisWeek();

// Create Launch TimeProgress with timeline items
const LAUNCH_TIMELINE = getLaunchTimeline();
const SOME_STEPS = getSomeSteps();
const SECTION_TITLE_STYLE = {
  margin: '0px 0px 20px 0px',
  padding: '10px 0px',
  borderBottom: '1px solid lightgrey'
};

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'This Week',
      labelPos: 'alternate-top',
      done: false,
      showDots: true,
      showGoal: true,
      showLabels: true,
      showTicks: true,
      showCode: {},
      titleBkg: '#111111',
      goalColor: '#00fefe',
      goalCompleteColor: '#19fe36',
      textColor: '#FFFFFF',
      labelColor: '#FFFFFF',
      progressColor: '#EEEEEE',
      mainBkg: '#263238',
      dotColor: '#DDDDDD',
      demoStep: 0,
      THIS_HOUR: getThisHour(),
      THIS_DAY: getThisDay(),
      THIS_MINUTE: getThisMinute(),
      dotCompleteColor: '#0088d1'
    };
    this.addAlert = this.addAlert.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.getSize = this.getSize.bind(this)
    this.doStart = this.doStart.bind(this)
    this.launchComplete = this.launchComplete.bind(this)
    this.resetLaunch = this.resetLaunch.bind(this)
    this.handleDataChange = this.handleDataChange.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.changeLaunchProgress = this.changeLaunchProgress.bind(this)
    this.minuteComplete = this.minuteComplete.bind(this)
    this.buildPropTable = this.buildPropTable.bind(this)
    this.toggleCode = this.toggleCode.bind(this)
  }
  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
  handleResize () {
    this.setState({ ...this.getSize() })
  }
  hourComplete() {
    setTimeout(() => {
      this.setState({ THIS_HOUR: getThisHour() }, () => {
        this.refs.hourChart.startInterval();
      });
    }, 5000);
  }
  minuteComplete() {
    setTimeout(() => {
      this.setState({ THIS_MINUTE: getThisMinute() }, () => {
        this.refs.minuteChart.startInterval();
      });
    }, 5000);
  }
  getSize () {
    return {w: window.innerWidth, h: window.innerHeight}
  }
  changeLaunchProgress(val) {
    let { demoStep } = this.state;
    if (val > 0) {
      demoStep = demoStep + val <= SOME_STEPS.length - 1 ? demoStep + val : demoStep;
    } else {
      demoStep = demoStep + val >= 0 ? demoStep + val : demoStep;
    }
    this.setState({demoStep});
  }
  addAlert (title = 'Toast!', message = 'This is a toast!') {
    this.refs.toaster.success(
    message,
    title,
    {
      timeOut: 3000,
      extendedTimeOut: 3000,
      preventDuplicates: false
    });
  }
  resetLaunch() {
    this.refs.mainChart.reset();
    this.setState({demoStep: 0, done: false});
  }
  handleDataChange(key, e) {
    let { ...state } = this.state;
    state[key] = e.target.value;
    console.log(key, e.target.value);
    this.setState(state);
  }
  handleCheckboxChange(key) {
    let { ...state } = this.state;
    state[key] = !state[key];
    console.log(key, state[key]);
    this.setState(state);
  }
  toggleCode(key) {
    let { ...state } = this.state;
    let { showCode } = state;
    showCode[key] = !showCode[key];
    console.log(key, showCode[key]);
    this.setState({showCode});
  }
  doStart() {
    this.setState({launch: true, done: false});
    this.refs.mainChart.start();
  }
  launchComplete() {
    this.setState({done: true, launch: false});
    this.addAlert('Launch Completed!', 'Huge work! Such Profit! Wow!');
  }
  buildPropRow(row, i) {
    return <tr key={i}>
              <td className='propKey'>{row.key}</td>
              <td className='propType'>{row.type}</td>
              <td>{row.default}</td>
              <td><div
                style={{margin: ''}}
                dangerouslySetInnerHTML={{__html: marked(row.desc || '')}} /></td>
           </tr>
  }
  buildTable(rows, header = []) {
    return <table className='displayTable' style={{padding: 20, width: '100%'}}>
              <thead>
              <tr>
               {header.map((h, i) => <th style={{}} key={i}>{h}</th>)}
               </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>
  }
  buildPropTable(props) {
    var rows = props.map((item, i) => {
      return this.buildPropRow(item, i);
    });
    return this.buildTable(rows, ['Name', 'Type', 'Default', 'Description']);
  }
  render() {
    let {
      THIS_HOUR,
      THIS_DAY,
      THIS_MINUTE,
      h,
      w,
      showCode,
      demoStep,
      titleBkg,
      progressColor,
      textColor,
      done,
      launch,
      labelPos,
      title,
      mainBkg,
      labelColor,
      showDots,
      showGoal,
      showLabels,
      showTicks,
      goalColor,
      goalCompleteColor,
      goalStrokeColor,
      dotColor,
      dotCompleteColor
    } = this.state;

    // Are we at the end of the launch timeline events?
    let controlEnd = demoStep >= LAUNCH_TIMELINE.length - 1;

    // Gather all of the styles for injection into charts
    let computedStyles = {
      showDots,
      showGoal,
      showLabels,
      showTicks,
      mainBkg,
      titleBkg,
      labelPos,
      progressStyle: {
        fill: progressColor
      },
      dotStyle: {
        fill: dotColor
      },
      dotCompleteStyle: {
        fill: dotCompleteColor
      },
      goalDotStyle: {
        fill: goalColor
      },
      goalCompleteDotStyle: {
        fill: goalCompleteColor
      },
    }

    // Create a StepProgress example.
    let controllProgress = SOME_STEPS ?
        <StepProgress
          ref='controlChart'
          id='controlChart'
          title={'A few steps'}
          {...computedStyles}
          step={demoStep}
          data={SOME_STEPS.map((o, i) => {
            return {...o, onComplete: () => this.addAlert(o.name, 'Arrived at Step '+(i+1)+'!')}
          })} /> :
          null;
    // Create a TimeProgress for this week.
    let ThisWeekProgress = THIS_WEEK ?
    <TimeProgress
      ref='mainChart'
      id={'ThisWeek'}
      title={'This Week'}
      onComplete={this.launchComplete}
      {...computedStyles}
      data={THIS_WEEK.map((o, i) => {
        return {...o, onComplete: () => this.addAlert('MARS: '+o.name, 'Step '+(i+1)+' Completed!')}
      })} /> :
      null;
    // Create a TimeProgress for today.
    let thisDayProgress = THIS_DAY ?
      <TimeProgress
        ref='dayChart'
        id="dayChart"
        title={'This Day'}
        {...computedStyles}
        data={THIS_DAY.map((o, i) => {
          return {...o, onComplete: () => this.addAlert('MARS: '+o.name, 'Step '+i+' Completed!')}
        })} /> :
        null;
    // Create TimeProgress for this hour.
    let thisHourProgress = THIS_HOUR ?
    <TimeProgress
      ref='hourChart'
      id="thisHour"
      title={'This Hour'}
      onComplete={this.hourComplete}
      {...computedStyles}
      data={THIS_HOUR.map((o, i) => {
        return {...o, onComplete: () => this.addAlert('MARS: '+o.name, 'Step '+i+' Completed!')}
      })} /> :
      null;
    // Create TimeProgress for this minute!
    let thisMinuteProgress = THIS_MINUTE ?
    <TimeProgress
      ref='minuteChart'
      id="thisMinute"
      title={'This Minute'}
      onComplete={this.minuteComplete}
      {...computedStyles}
      data={THIS_MINUTE.map((o, i) => {
        return {...o, onComplete: () => this.addAlert('MARS: '+o.name, 'Step '+i+' Completed!')}
      })} /> :
      null;
    let requiredProps = this.buildPropTable([
      {
        key: 'step',
        type: 'integer',
        desc: 'Current step index.'
      },
      {
        key: 'data',
        type: 'Array<String|Object{label:string}>',
        desc: 'Array of strings which represent step names..'
      },
      {
        key: 'speed',
        default: '500',
        type: 'string|number',
        desc: 'Speed of progress animation (pixels/second)'
      }
    ]);
    let timeProgressFunctionalProps = this.buildPropTable([
      {
        key: 'data',
        type: 'Array<Object {date: Date}>',
        desc: 'Array of objects with a date value.'
      },
      {
        key: 'parseSpecifier',
        type: 'string',
        default: '%Y-%m-%dT%H:%M:%S.%LZ',
        desc: 'Date-string specifier with d3-parsable directives.'+
        ' [More Info](https://github.com/d3/d3-time-format/blob/master/README.md#timeParse)'
      }
    ]);

    let StylePropSection = this.buildPropTable(styleProps);

    return <div className='wall'>
            <ToastContainer ref="toaster"
                        toastMessageFactory={ToastMessageFactory}
                        className="toast-top-right" />
            <div style={{width: '100%', position: 'fixed', top: 0, left: 0}}>
            <ParallaxWrap
              full={true}
              background={<LazyImage src={'./crs11_vertical_day2_adjusted.jpg'} />}
              style={{ minHeight: h }}>
              </ParallaxWrap>
              </div>
            <div
              className='container'
              style={{ overflow: 'auto', position: 'relative', color: '#fff', zIndex: 1, paddingBottom: 120}}>
              <div className='' style={{textAlign: 'center', marginBottom: 30, padding: '20px'}}>
                <div style={{fontSize: 32}}>React Launch Progress</div>
                <h4>{`npm install react-launch-progress`}</h4>
                <h4>{`yarn add react-launch-progress`}</h4>
              </div>

              <div className='' style={{textAlign: 'center', marginBottom: 30, padding: '0px 20px'}}>
                <h3>{`Inspired by SpaceX's clean display for event sequences.`}</h3>
                <h4>{`Depends on D3.js`}</h4>
              </div>
              {
                controllProgress
              }
              <div style={{margin: '0px 0px 40px 0px'}} className='pad2 glassSection'>
                <div className='flex' style={{marginBottom: 20}}>
                  <span style={{fontSize: 24, margin: 'auto 0px'}}>{"<StepProgress />"}</span>
                  <div style={{margin: 'auto 8px'}} className='btn-group'>
                  <button className='btn btn-primary' onClick={this.changeLaunchProgress.bind(null, -1)}>
                  {'-'}
                  </button>
                  <button className='btn btn-primary' onClick={this.changeLaunchProgress.bind(null, 1)}>
                  {'+'}
                  </button>
                  </div>
                  <div style={{marginLeft: 'auto'}}>
                  <button
                    className={'btn '+ (showCode['stepProgress'] ? 'btn-disabled' : 'btn-primary')}
                    onClick={this.toggleCode.bind(null, 'stepProgress')}>
                    {showCode['stepProgress'] ? 'Hide Code' : 'Show Code'}
                  </button>
                  </div>
                </div>
                <div style={{fontSize: 18}} dangerouslySetInnerHTML={{__html: marked(StepProgressDesc)}} />
                <div className={'accordion ' + (!showCode['stepProgress'] && 'accordionClosed')}>
                  <div className='accordionContent'>
                    <div
                      style={{margin: '10px 0'}}
                      dangerouslySetInnerHTML={{__html: marked(ProgressCodeString())}} />
                  </div>
                </div>
                <h3 style={SECTION_TITLE_STYLE}>{"Functional Properties"}</h3>
                {requiredProps}
              </div>
              {
                thisMinuteProgress
              }
              <div style={{margin: '0px 0px 40px 0px'}}  className='glassSection'>
                <div className='pad2'>
                  <div className='flex' style={{fontSize: 24, marginBottom: 20}}>
                   <span style={{fontSize: 24, margin: 'auto 0px'}}>
                    {'<TimeProgress />'}
                   </span>
                    <div style={{marginLeft: 'auto'}}>
                    <button
                      className={'btn '+ (showCode['timeProgress'] ? 'btn-disabled' : 'btn-primary')}
                      onClick={this.toggleCode.bind(null, 'timeProgress')}>
                      {showCode['timeProgress'] ? 'Hide Code' : 'Show Code'}
                    </button>
                    </div>
                  </div>
                  <div
                    style={{fontSize: 18}}
                    dangerouslySetInnerHTML={{__html: marked(TimeProgressDesc)}} />
                  <div className={'accordion ' + (!showCode['timeProgress'] && 'accordionClosed')}>
                    <div className='accordionContent'>
                      <div
                        style={{margin: '10px 0'}}
                        dangerouslySetInnerHTML={{__html: marked(TimeProgressCodeString())}} />
                    </div>
                  </div>
                  <h3 style={SECTION_TITLE_STYLE}>{"Functional Properties"}</h3>
                  {timeProgressFunctionalProps}
                </div>
              </div>
              <div style={{marginBottom: 40}} className='glassSection'>
                <div className='pad2'>
                  <h3 style={SECTION_TITLE_STYLE}>{"Examples"}</h3>
                </div>
                <div style={{marginBottom: 40}}>
                  {
                    ThisWeekProgress
                  }
                </div>
                <div style={{marginBottom: 40}}>
                  {
                    thisDayProgress
                  }
                </div>
                <div style={{marginBottom: 40}}>
                  {
                    thisHourProgress
                  }
                </div>
              </div>

              <div className='glassSection'>
                <div className='pad2'>
                  <h3 id="CustomProps" style={SECTION_TITLE_STYLE}>Customization Properties</h3>
                  {StylePropSection}
                </div>
              </div>
            </div>


          </div>
  }
}
// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = () => {

  ReactDOM.render(
    <Demo style={{backgroundColor: 'none'}} />,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./main', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

render();
