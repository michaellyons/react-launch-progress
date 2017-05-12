import React from 'react';
import ReactDOM from 'react-dom';
import { Timeline, ControlledTimeline } from '../src';
import moment from 'moment';
import marked from 'marked';
import './main.css';
var ReactToastr = require("react-toastr");
var {ToastContainer} = ReactToastr;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

const stringThing =
'```javascript\n\
import Timeline from \'react-launch-timeline\' \
\n\
class AwesomeComponent extends Component {\n\
  constructor(props) {\n\
    super(props);\n\
  }\n\
  render() {\n\
    let { dates } = this.props;\n\
    return <Timeline data={dates} />\n\
  }\n\
}\n\
```'

const ControlledDesc =
`Displays progress controlled by component's ***step*** property which indicates position in an array of event objects with a ***date*** key.
`
const TimelineDesc =
`Displays progress through an array of event objects with a ***date*** key determined by current time.
`
const today = moment().startOf('day');
const first_diff = today.date() - today.day();
const first = first_diff == today.date()
              ? moment().date(first_diff - 6).startOf('day')
              : moment().date(first_diff + 1).startOf('day');

const THIS_WEEK = [];

// We'll need a week's worth of days
for (var i = 0; i <= 7; i++) {
  // if (i == 2) continue;
  var date = moment(first).add(i, 'days');
  THIS_WEEK.push({
    name: date.format('ddd DD/MM'),
    date: date.toISOString(),
    onComplete: () => {console.log("Woah!")}
  })
}

// Set Launch Time to abritrary date in future
const launchTime = moment('04-20-2020', 'MM-DD-YYYY');

// Set them Launch Items with T -/+ liftoff times
const timeLineItems = [
  [-15, 'INTERNAL'],
  [-5, 'STARTUP'],
  [0, 'LIFTOFF'],
  [15, 'MAX-Q'],
  [25, 'MECO'],
  [40, 'BOOSTBACK BURN'],
  [50, 'ENTRY BURN'],
  [55, 'STAGE 1 LANDING'],
  [65, 'PAYLOAD ORBIT'],
  [70, 'PROFIT']
];
// Create Launch Timeline with timeline items
const LAUNCH_TIMELINE = timeLineItems.map((item, i) => {
  return {
    name: item[1],
    date: moment(launchTime).add(item[0], 'seconds').toISOString(),
    onStart: () => { console.log(item[1] + ' DID START');},
    onComplete: () => { console.log(item[1] + ' Callback Action');}
  }
});
const SECTION_TITLE_STYLE = {
  margin: '0px 0px 20px 0px',
  padding: 10,
  borderBottom: '1px solid lightgrey'
};
const SECTION_STYLE = {
  padding: 10
}
const COLOR_INPUT_STYLE = {
  position: 'relative',
  height: 34,
  width: 60,
  boxShadow: '0px 0px 4px grey',
  margin: 4,
  borderRadius: 34,
};
const CHECKBOX_INPUT_STYLE = {
  width: 18,
  margin: '0px 36px',
  textAlign: 'center'
};
const OPTION_STYLE = {
};
const OPTION_LABEL_STYLE = {
};
function constructTimeSeries() {
  let THIS_HOUR = [];
  for (let i = 0; i <= 5; i++) {
    // if (i == 2) continue;
    let date = moment().add(i, 'minutes');
    THIS_HOUR.push({
      name: date.format('h:mmA'),
      onComplete: () => {console.log("WOah!", i)},
      date: date.toISOString()
    })
  }
  return THIS_HOUR;
}
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
      titleBkg: '#111111',
      goalColor: '#00fefe',
      goalCompleteColor: '#19fe36',
      textColor: '#FFFFFF',
      labelColor: '#FFFFFF',
      progressColor: '#EEEEEE',
      mainBkg: '#263238',
      dotColor: '#DDDDDD',
      launchProgress: 0,
      THIS_HOUR: constructTimeSeries(),
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
  getSize () {
    return {w: window.innerWidth, h: window.innerHeight}
  }
  changeLaunchProgress(val) {
    let { launchProgress } = this.state;
    launchProgress = val < 0 && launchProgress == 0 ? 0 : launchProgress + val;
    this.setState({launchProgress: launchProgress});
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
    this.setState({launchProgress: 0, done: false});
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
  doStart() {
    this.setState({launch: true, done: false});
    this.refs.mainChart.start();
  }
  launchComplete() {
    this.setState({done: true, launch: false});
    this.addAlert('Launch Completed!', 'Huge work! Such Profit! Wow!');
  }
  buildOptionRow(row, i) {
    return <tr key={row.key || i} style={OPTION_STYLE}>
              <td className='col-xs-2'>{row.component}</td>
              <td className='col-xs-2'>{row.key}</td>
              <td style={OPTION_LABEL_STYLE}>{row.name}</td>
           </tr>
  }
  buildTable(rows) {
    return <table style={{width: '100%'}}>
              <tbody>
                {rows}
              </tbody>
            </table>
  }
  buildColorDiv(key, value) {
    return <div key={key} style={{position: 'relative', margin: '6px 0px', boxShadow: '0px 0px 4px grey', height: 34, width: 60, borderRadius: 34, background: value}}>
          <input
            type='color'
            style={{...COLOR_INPUT_STYLE, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0}}
            value={value}
            onChange={this.handleDataChange.bind(null, key)} />
      </div>
  }
  render() {

    let {
      THIS_HOUR,
      h,
      w,
      launchProgress,
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

    let mainTimeline = LAUNCH_TIMELINE ?
    <Timeline
      ref='mainChart'
      title={'This Week'}
      style={{display: 'flex'}}
      wrapStyle={{zIndex: 2, display: 'flex'}}
      titleBkg={titleBkg}
      mainBkg={mainBkg}
      onComplete={this.launchComplete}
      labelPos={labelPos}
      showDots={showDots}
      showGoal={showGoal}
      showLabels={showLabels}
      showTicks={showTicks}
      progressStyle={{
        fill: progressColor
      }}
      dotStyle={{
        fill: dotColor
      }}
      dotCompleteStyle={{
        fill: dotCompleteColor
      }}
      goalCompleteDotStyle={{
        fill: goalCompleteColor
      }}
      goalDotStyle={{fill: goalColor, stroke: goalStrokeColor}}
      data={THIS_WEEK.map((o, i) => {
        return {...o, onComplete: () => this.addAlert('MARS: '+o.name, 'Step '+i+' Completed!')}
      })} /> :
      null;

      let controlTimeline = LAUNCH_TIMELINE ?
      <ControlledTimeline
        ref='controlChart'
        id='controlChart'
        title={'LAUNCH: RCT 42'}
        style={{display: 'flex'}}
        wrapStyle={{zIndex: 2, display: 'flex'}}
        utc={true}
        timed={false}
        titleBkg={titleBkg}
        margin={{right: 40}}
        mainBkg={mainBkg}
        onComplete={this.launchComplete}
        labelPos={labelPos}
        showDots={showDots}
        showGoal={showGoal}
        showLabels={showLabels}
        showTicks={showTicks}
        step={launchProgress}
        progressStyle={{
          fill: progressColor
        }}
        dotStyle={{
          fill: dotColor
        }}
        dotCompleteStyle={{
          fill: dotCompleteColor
        }}
        goalCompleteDotStyle={{
          fill: goalCompleteColor
        }}
        goalDotStyle={{fill: goalColor, stroke: goalStrokeColor}}
        data={LAUNCH_TIMELINE.map((o, i) => {
          return {...o, onComplete: () => this.addAlert('RCT 42: '+o.name, 'Step '+i+' Completed!')}
        })} /> :
        null;

      let generalOptions = this.buildTable([
        {
          name: 'Title Background',
          key: 'titleBkg',
          component: this.buildColorDiv('titleBkg', titleBkg)
        },
        {
          name: 'Main Background',
          key: 'mainBkg',
          value: mainBkg,
          component: this.buildColorDiv('mainBkg', mainBkg)
        },
        {
          name: 'Text Color',
          key: 'textStyle.fill',
          value: textColor,
          component: this.buildColorDiv('textColor', textColor)
        },
        {
          name: 'Progress Color',
          key: 'progressStyle.fill',
          value: progressColor,
          component: this.buildColorDiv('progressColor', progressColor)
        }
      ].map((item, i) => {
        return this.buildOptionRow(item, i);
      }));
      let dotOptions = this.buildTable([
        {
          name: 'Show Dots',
          key: 'showDots',
          component: <label className="switch">
          <input
            type='checkbox'
            style={CHECKBOX_INPUT_STYLE}
            checked={showDots}
            onChange={this.handleCheckboxChange.bind(null, 'showDots')} />
            <div className="slider round"></div>
            </label>
        },
        {
          name: 'Default Color',
          key: 'dotStyle.fill',
          component: this.buildColorDiv('dotColor', dotColor)
        },
        {
          name: 'Complete Color',
          key: 'dotCompleteStyle.fill',
          component: this.buildColorDiv('dotCompleteColor', dotCompleteColor)
        }
      ].map((item, i) => {
        return this.buildOptionRow(item, i);
      }));
      let goalOptions = this.buildTable([
        {
          name: 'Default Color',
          key: 'goalDotStyle.fill',
          component: this.buildColorDiv('goalColor', goalColor)
        },
        {
          name: 'Complete Color',
          key: 'goalCompleteDotStyle.fill',
          component: this.buildColorDiv('goalCompleteColor', goalCompleteColor)
        }
      ].map((item, i) => {
        return this.buildOptionRow(item, i);
      }));
      let labelOptions = this.buildTable([
        {
          name: 'Show Labels',
          key: 'showLabels',
          component: <label className="switch">
            <input
            type='checkbox'
            style={CHECKBOX_INPUT_STYLE}
            checked={showLabels}
            onChange={this.handleCheckboxChange.bind(null, 'showLabels')} />
            <div className="slider round"></div>
            </label>
        },
        {
          name: 'Show Ticks',
          key: 'showTicks',
          component: <label className="switch">
          <input
            type='checkbox'
            style={CHECKBOX_INPUT_STYLE}
            checked={showTicks}
            onChange={this.handleCheckboxChange.bind(null, 'showTicks')} />
            <div className="slider round"></div>
            </label>
        },
        {
          name: 'Label Color',
          key: 'labelStyle.fill',
          component: this.buildColorDiv('labelColor', labelColor)
        },
        {
          name: 'Label Positions',
          key: 'labelPos',
          component: <select
            style={{width: 110, color: '#333'}}
            onChange={this.handleDataChange.bind(null, 'labelPos')}
            value={labelPos}>
            <option value={'bottom'}>Bottom</option>
            <option value={'top'}>Top</option>
            <option value={'alternate-top'}>Alternate Top</option>
            <option value={'alternate-bot'}>Alternate Bot</option>
            </select>
        }
      ].map(
        (item, i) => this.buildOptionRow(item, i)
      ));
      let controlEnd = launchProgress >= LAUNCH_TIMELINE.length - 1;

    return <div style={{backgroundImage: "url('./itl_streak.jpg')", backgroundPosition: 'left'}}>
            <ToastContainer ref="toaster"
                        toastMessageFactory={ToastMessageFactory}
                        className="toast-top-right" />
            <div className='container' style={{ overflow: 'auto', position: 'relative', color: '#fff', zIndex: 1, paddingBottom: 120}}>
              <div className='' style={{margin: '0px 0px 30px 0px', padding: '20px'}}>
                <div style={{fontSize: 32}}>React Launch Timeline</div>
                <h4>{`npm install react-launch-timeline`}</h4>
                <h4>{`yarn add react-launch-timeline`}</h4>
              </div>

              <div className='' style={{marginBottom: 30, padding: '0px 20px'}}>
                <h3>{`Inspired by SpaceX's clean display for event sequences.`}</h3>
                <h4>{`Depends on D3.js`}</h4>
              </div>


              <div className=' glassSection'>
                <div style={{ padding: 20}}>
                  <span style={{fontSize: 24, marginRight: 12}}>Timeline</span>
                  <div style={{fontSize: 18}} dangerouslySetInnerHTML={{__html: marked(TimelineDesc)}} />
                </div>
              {
                mainTimeline
              }
              </div>
              <div style={{}} className='glassSection'>
                <div style={{padding: 20}}>
                  <span style={{fontSize: 24, marginRight: 12}}>ControlledTimeline</span>
                  <span className='btn-group' style={{margin: '0'}}>
                  <button
                    className={'btn btn-primary '+(!launchProgress && 'disabled')}
                    onClick={ !!launchProgress && this.changeLaunchProgress.bind(null, -1) }>
                    { '-' }
                  </button>
                  <button
                    className={'btn btn-primary '+(controlEnd && 'disabled')}
                    onClick={ !controlEnd && this.changeLaunchProgress.bind(null, 1) }>
                    { '+' }
                  </button>
                  </span>
                  <div>Current Step: { launchProgress } ({ LAUNCH_TIMELINE[launchProgress].name })</div>
                  <div style={{fontSize: 18}} dangerouslySetInnerHTML={{__html: marked(ControlledDesc)}} />
                </div>
                {
                  controlTimeline
                }
              </div>
              <div style={{display: 'none'}} className=' glassSection'>
                <div style={{padding: 20}}>
                  <div style={{fontSize: 24}}>Properties</div>
                  <table>
                    <tbody>
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{background: 'rgba(0,0,0,0.4)'}}>
                <div style={{ fontSize: 32, padding: 10}}>
                  Customization
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                  <div className='col-xs-12' style={SECTION_STYLE}>
                    <h4 style={SECTION_TITLE_STYLE}>General</h4>
                    {generalOptions}
                  </div>
                  <div className='col-xs-12' style={SECTION_STYLE}>
                    <h4 style={SECTION_TITLE_STYLE}>Dots</h4>
                    {dotOptions}
                  </div>
                  <div className='col-xs-12' style={SECTION_STYLE}>
                    <h4 style={SECTION_TITLE_STYLE}>Labels</h4>
                    {labelOptions}
                  </div>
                  <div className='col-xs-12' style={SECTION_STYLE}>
                    <h4 style={SECTION_TITLE_STYLE}>Goal</h4>
                    {goalOptions}
                  </div>
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
