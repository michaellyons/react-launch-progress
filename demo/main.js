import React from 'react';
import ReactDOM from 'react-dom';
import Timeline from '../src';
import moment from 'moment';

const now = moment();
const first_diff = now.date() - now.day();
const first = moment().date(first_diff + 1);

const THIS_WEEK = [];

// We'll need a week's worth of days
for (var i = 0; i <= 7; i++) {
  // if (i == 2) continue;
  var date = moment(first).add(i, 'days');
  THIS_WEEK.push({
    name: date.format('ddd'),
    date: date.format('MM-DD-YYYY')
  })
}

// Set Launch Time to abritrary date in future
const launchTime = moment('04-20-2020');

// Set them Launch Items with T -/+ liftoff times
const timeLineItems = [
  [-60, 'Internal'],
  [-10, 'Startup'],
  [0, 'Liftoff'],
  [35, 'Max Q'],
  [60, 'Meco'],
  [70, 'Boostback Burn'],
  [120, 'Entry Burn'],
  [135, 'Stage 1 Landing'],
  [160, 'Payload Orbit'],
  [190, 'Profit']
];
// Create Launch Timeline with timeline items
const LAUNCH_TIMELINE = timeLineItems.map((item, i) => {
  return {
    name: item[1],
    date: moment(launchTime).add(item[0], 'seconds').format()
  }
});

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'This Week',
      showDots: true,
      showGoal: true,
      titleBkg: '#111111',
      goalColor: '#00fefe',
      textColor: '#FFFFFF',
      mainBkg: '#455A64',
      dotColor: '#DDDDDD',
      dotCompleteColor: '#0088d1'
    };
    this.handleDataChange = this.handleDataChange.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
  }
  componentDidMount() {
    let THIS_HOUR = [];
    for (var i = 0; i <= 2; i++) {
      // if (i == 2) continue;
      let date = moment().add(i, 'minutes');
      THIS_HOUR.push({
        name: date.format('h:mmA'),
        date: date.format()
      })
    }
    this.setState({THIS_HOUR});
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
  render() {

    let { THIS_HOUR, titleBkg, textColor, title, mainBkg, showDots, showGoal, goalColor, goalStrokeColor, dotColor, dotCompleteColor } = this.state;
    let optionLabelStyle = {
      marginLeft: 10
    };
    let optionStyle = {
      marginBottom: 10
    }
    return <div>
            <div className='container'>
              <h1>React Launch Timeline</h1>
              <h4>{`npm install react-launch-timeline`}</h4>
              <h4>{`yarn add react-launch-timeline`}</h4>
              <div>
                <h3>{`Inspired by SpaceX's beautiful display for their launch event sequence.`}</h3>
                <h4>{`Depends on D3.js`}</h4>
              </div>
              <div>
                <div>
                  <h4>General</h4>
                  <div style={optionStyle}>
                  <input
                    type='color'
                    value={titleBkg}
                    onChange={this.handleDataChange.bind(null, 'titleBkg')} />
                  <span style={optionLabelStyle}>Title Background</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      value={mainBkg}
                      onChange={this.handleDataChange.bind(null, 'mainBkg')} />
                    <span style={optionLabelStyle}>Main Background</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      value={textColor}
                      onChange={this.handleDataChange.bind(null, 'textColor')} />
                    <span style={optionLabelStyle}>Text Color</span>
                  </div>
                </div>
                <div>
                  <h4>Dots</h4>
                  <div style={optionStyle}>
                    <input
                      type='checkbox'
                      style={{margin: '0px 15px'}}
                      checked={showDots}
                      onChange={this.handleCheckboxChange.bind(null, 'showDots')} />
                    <span style={optionLabelStyle}>Show Dots</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      value={dotColor}
                      onChange={this.handleDataChange.bind(null, 'dotColor')} />
                    <span style={optionLabelStyle}>Dot Color</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      value={dotCompleteColor}
                      onChange={this.handleDataChange.bind(null, 'dotCompleteColor')} />
                    <span style={optionLabelStyle}>Dot Complete Color</span>
                  </div>
                </div>
                <div>
                  <h4>Goal</h4>
                  <div style={optionStyle}>
                    <input
                      type='checkbox'
                      style={{margin: '0px 15px'}}
                      checked={showGoal}
                      onChange={this.handleCheckboxChange.bind(null, 'showGoal')} />
                    <span style={optionLabelStyle}>Show Goal</span>
                  </div>
                  <div style={optionStyle}>
                    <input
                      type='color'
                      value={goalColor}
                      onChange={this.handleDataChange.bind(null, 'goalColor')} />
                    <span style={optionLabelStyle}>Goal Color</span>
                  </div>
                </div>
              </div>
              <Timeline
                title={'Week Timeline'}
                style={{marginBottom: 20}}
                showNow={true}
                titleBkg={titleBkg}
                textColor={textColor}
                showDots={showDots}
                dotColor={dotColor}
                dotStyle={{
                  fill: dotColor
                }}
                dotCompleteStyle={{
                  fill: dotCompleteColor
                }}
                dotCompleteColor={dotCompleteColor}
                showGoal={showGoal}
                goalDotStyle={{fill: goalColor, stroke: goalStrokeColor}}
                mainBkg={mainBkg}
                data={THIS_WEEK} />
              <Timeline
                title='Next Few Minutes'
                style={{}}
                timed={true}
                utc={true}
                textColor={'#fff'}
                showNow={true}
                data={THIS_HOUR} />
            </div>
            <Timeline
              title='Launch: CRS 420'
              style={{display: 'flex'}}
              wrapStyle={{display: 'flex', position: 'absolute', bottom: 0, width: '100%', left: 0}}
              mainBkg={'#455A64'}
              titleBkg={'#111'}
              timed={false}
              utc={true}
              labelPos={'alternate'}
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
