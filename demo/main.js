import React from 'react';
import ReactDOM from 'react-dom';
import Timeline from '../src';
import moment from 'moment';
var ReactToastr = require("react-toastr");
var {ToastContainer} = ReactToastr; // This is a React Element.
// For Non ES6...
// var ToastContainer = ReactToastr.ToastContainer;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

const now = moment();
const first_diff = now.date() - now.day();
const first = first_diff == now.date() ? moment().date(first_diff - 6) : moment().date(first_diff + 1);

const THIS_WEEK = [];

// We'll need a week's worth of days
for (var i = 0; i <= 7; i++) {
  // if (i == 2) continue;
  var date = moment(first).add(i, 'days');
  THIS_WEEK.push({
    name: date.format('ddd'),
    date: date.format('MM-DD-YYYY'),
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
    date: moment(launchTime).add(item[0], 'seconds').format(),
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
  background: 'none',
  border: 'none',
  width: 90
};
const CHECKBOX_INPUT_STYLE = {
  width: 18,
  margin: '0px 36px',
  textAlign: 'center'
};
function constructTimeSeries() {
  let THIS_HOUR = [];
  for (let i = 0; i <= 5; i++) {
    // if (i == 2) continue;
    let date = moment().add(i, 'minutes');
    THIS_HOUR.push({
      name: date.format('h:mmA'),
      onComplete: () => {console.log("WOah!", i)},
      date: date.format()
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
      extendedTimeOut: 3000
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
  stepComplete(step) {

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
    let optionLabelStyle = {
      padding: 5
    };
    let optionStyle = {
      textAlign: 'center'
    };

    let mainTimeline = LAUNCH_TIMELINE ?
    <Timeline
      ref='mainChart'
      title={'Let\'s Launch!'}
      style={{display: 'flex'}}
      wrapStyle={{zIndex: 2, display: 'flex', position: 'fixed', bottom: 0, width: '100%', left: 0}}
      utc={true}
      timed={true}
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
      data={LAUNCH_TIMELINE.map((o, i) => {
        return {...o, onComplete: this.addAlert.bind(null, o.name, 'Step Completed!')}
      })} /> :
      null;

    return <div className='container' >
            <ToastContainer ref="toaster"
                        toastMessageFactory={ToastMessageFactory}
                        className="toast-top-left" />
            <canvas
              style={{
                zIndex: -1,
                position: 'absolute',
                top: 0,
                left: 0,
                transition: 'all 1s ease-out',
                width: '100%',
                height: h,
                backgroundColor: '#fff'}}>
            </canvas>
            <div style={{ transition: 'all 0.9s ease-out', position: 'relative', color: '#000', zIndex: 1, paddingBottom: 120}}>
              <div style={{marginBottom: 30, textAlign: 'center'}} >
                <h1>React Launch Timeline</h1>
                <h4>{`npm install react-launch-timeline`}</h4>
                <h4>{`yarn add react-launch-timeline`}</h4>
              </div>
              <div style={{marginBottom: 30, textAlign: 'center'}}>
                <h3>{`Inspired by SpaceX's clean display for event sequences.`}</h3>
                <h4>{`Depends on D3.js`}</h4>
              </div>
              <div style={{marginBottom: 30, textAlign: 'center'}}>
              <button
                className='btn btn-lg btn-primary'
                onClick={ done ? this.resetLaunch : this.doStart}>
                { done ? 'Relaunch!' : 'Launch!'}
              </button>
              </div>

              <div>
              <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <div className='col-xs-12' style={SECTION_STYLE}>
                  <h4 style={SECTION_TITLE_STYLE}>General</h4>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={titleBkg}
                      onChange={this.handleDataChange.bind(null, 'titleBkg')} />
                    <div style={optionLabelStyle}>Title Background</div>
                  </div>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={mainBkg}
                      onChange={this.handleDataChange.bind(null, 'mainBkg')} />
                    <div style={optionLabelStyle}>Main Background</div>
                  </div>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={textColor}
                      onChange={this.handleDataChange.bind(null, 'textColor')} />
                    <div style={optionLabelStyle}>Text Color</div>
                  </div>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={progressColor}
                      onChange={this.handleDataChange.bind(null, 'progressColor')} />
                    <div style={optionLabelStyle}>Progress Color</div>
                  </div>
                </div>
                <div className='col-xs-12' style={SECTION_STYLE}>
                  <h4 style={SECTION_TITLE_STYLE}>Dots</h4>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='checkbox'
                      style={CHECKBOX_INPUT_STYLE}
                      checked={showDots}
                      onChange={this.handleCheckboxChange.bind(null, 'showDots')} />
                    <div style={optionLabelStyle}>Show Dots</div>
                  </div>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={dotColor}
                      onChange={this.handleDataChange.bind(null, 'dotColor')} />
                    <div style={optionLabelStyle}>Default Color</div>
                  </div>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={dotCompleteColor}
                      onChange={this.handleDataChange.bind(null, 'dotCompleteColor')} />
                    <div style={optionLabelStyle}>Complete Color</div>
                  </div>
                </div>
                <div className='col-xs-12' style={SECTION_STYLE}>
                  <h4 style={SECTION_TITLE_STYLE}>Labels</h4>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='checkbox'
                      style={CHECKBOX_INPUT_STYLE}
                      checked={showLabels}
                      onChange={this.handleCheckboxChange.bind(null, 'showLabels')} />
                    <div style={optionLabelStyle}>Show Labels</div>
                  </div>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='checkbox'
                      style={CHECKBOX_INPUT_STYLE}
                      checked={showTicks}
                      onChange={this.handleCheckboxChange.bind(null, 'showTicks')} />
                    <div style={optionLabelStyle}>Show Ticks</div>
                  </div>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={labelColor}
                      onChange={this.handleDataChange.bind(null, 'labelColor')} />
                    <div style={optionLabelStyle}>Label Color</div>
                  </div>
                  <div style={optionStyle} className='col-xs-2'>
                    <select
                      style={{width: 110}}
                      onChange={this.handleDataChange.bind(null, 'labelPos')}
                      value={labelPos}>
                      <option value={'bottom'}>Bottom</option>
                      <option value={'top'}>Top</option>
                      <option value={'alternate-top'}>Alternate Top</option>
                      <option value={'alternate-bot'}>Alternate Bot</option>
                      </select>
                    <div style={optionLabelStyle}>Label Positions</div>
                  </div>
                </div>
                <div className='col-xs-12' style={SECTION_STYLE}>
                  <h4 style={SECTION_TITLE_STYLE}>Goal</h4>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={goalColor}
                      onChange={this.handleDataChange.bind(null, 'goalColor')} />
                    <div style={optionLabelStyle}>Default Color</div>
                  </div>
                  <div style={optionStyle} className='col-xs-2'>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={goalCompleteColor}
                      onChange={this.handleDataChange.bind(null, 'goalCompleteColor')} />
                    <div style={optionLabelStyle}>Complete Color</div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            {mainTimeline}
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
