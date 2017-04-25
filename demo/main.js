import React from 'react';
import ReactDOM from 'react-dom';
import Timeline from '../src';
import moment from 'moment';

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
    this.refs.mainChart.start();
  }
  launchComplete() {
    this.setState({done: true})
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
      marginLeft: 10
    };
    let optionStyle = {
      marginBottom: 10
    }
    let mainTimeline = LAUNCH_TIMELINE ?
    <Timeline
      ref='mainChart'
      title={'Let\'s Launch!'}
      style={{marginBottom: 20}}
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
      data={LAUNCH_TIMELINE} /> :
      null;

    return <div>
            <canvas
              style={{
                zIndex: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                width: w,
                height: h,
                backgroundColor: '#fff'}}>
            </canvas>
            <div className='container' style={{position: 'relative', color: '#000', zIndex: 1, paddingBottom: 120}}>
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

              {mainTimeline}
              <div style={{boxShadow: '0px 0px 4px 0px grey'}}>
              <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <div className='col-xs-12 col-sm-3'>
                  <h4>General</h4>
                  <div style={optionStyle}>
                  <input
                    type='color'
                    style={COLOR_INPUT_STYLE}
                    value={titleBkg}
                    onChange={this.handleDataChange.bind(null, 'titleBkg')} />
                  <span style={optionLabelStyle}>Title Bkg</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={mainBkg}
                      onChange={this.handleDataChange.bind(null, 'mainBkg')} />
                    <span style={optionLabelStyle}>Main Bkg</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={textColor}
                      onChange={this.handleDataChange.bind(null, 'textColor')} />
                    <span style={optionLabelStyle}>Text Color</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={progressColor}
                      onChange={this.handleDataChange.bind(null, 'progressColor')} />
                    <span style={optionLabelStyle}>Progress Color</span>
                  </div>
                </div>
                <div className='col-xs-12 col-sm-3'>
                  <h4>Dots</h4>
                  <div style={optionStyle}>
                    <input
                      type='checkbox'
                      style={CHECKBOX_INPUT_STYLE}
                      checked={showDots}
                      onChange={this.handleCheckboxChange.bind(null, 'showDots')} />
                    <span style={optionLabelStyle}>Show Dots</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={dotColor}
                      onChange={this.handleDataChange.bind(null, 'dotColor')} />
                    <span style={optionLabelStyle}>Dot Color</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={dotCompleteColor}
                      onChange={this.handleDataChange.bind(null, 'dotCompleteColor')} />
                    <span style={optionLabelStyle}>Dot Complete Color</span>
                  </div>
                </div>
                <div className='col-xs-12 col-sm-3'>
                  <h4>Labels</h4>
                  <div style={optionStyle}>
                    <input
                      type='checkbox'
                      style={CHECKBOX_INPUT_STYLE}
                      checked={showLabels}
                      onChange={this.handleCheckboxChange.bind(null, 'showLabels')} />
                    <span style={optionLabelStyle}>Show Labels</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='checkbox'
                      style={CHECKBOX_INPUT_STYLE}
                      checked={showTicks}
                      onChange={this.handleCheckboxChange.bind(null, 'showTicks')} />
                    <span style={optionLabelStyle}>Show Ticks</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={labelColor}
                      onChange={this.handleDataChange.bind(null, 'labelColor')} />
                    <span style={optionLabelStyle}>Label Color</span>
                  </div>
                  <div style={optionStyle}>
                    <select
                      style={{width: 90}}
                      onChange={this.handleDataChange.bind(null, 'labelPos')}
                      value={labelPos}>
                      <option value={'bottom'}>Bottom</option>
                      <option value={'top'}>Top</option>
                      <option value={'alternate-top'}>Alternate Top</option>
                      <option value={'alternate-bot'}>Alternate Bot</option>
                      </select>
                    <span style={optionLabelStyle}>Label Positions</span>
                  </div>
                </div>
                <div className='col-xs-12 col-sm-3'>
                  <h4>Goal</h4>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={goalColor}
                      onChange={this.handleDataChange.bind(null, 'goalColor')} />
                    <span style={optionLabelStyle}>Goal Color</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      style={COLOR_INPUT_STYLE}
                      value={goalCompleteColor}
                      onChange={this.handleDataChange.bind(null, 'goalCompleteColor')} />
                    <span style={optionLabelStyle}>Goal Complete Color</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <Timeline
              title='Launch: CRS 420'
              style={{display: 'flex'}}
              wrapStyle={{zIndex: 1, display: 'flex', position: 'fixed', bottom: 0, width: '100%', left: 0}}
              titleBkg={titleBkg}
              mainBkg={mainBkg}
              timed={false}
              step={launchProgress}
              progress={launchProgress}
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
              utc={true}
              labelPos={labelPos}
              textColor={'#fff'}
              showNow={false}
              data={LAUNCH_TIMELINE} />

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
