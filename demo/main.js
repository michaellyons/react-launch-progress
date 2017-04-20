import React from 'react';
import ReactDOM from 'react-dom';
import Timeline from '../src';
import moment from 'moment';

var now = moment();
var first_diff = now.date() - now.day();
var first = moment().date(first_diff + 1);
var last = first + 6;

var THIS_WEEK = [];

for (var i = 0; i <= 8; i++) {
  // if (i == 2) continue;
  var date = moment(first).add(i, 'days');
  THIS_WEEK.push({
    name: date.format('ddd'),
    date: date.format('MM-DD-YYYY'),
    type: i
  })
}
var launchTime = moment('04-20-2020');
let timeLineItems = [
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
]
const LAUNCH_TIMELINE = timeLineItems.map((item, i) => {
  return {
    name: item[1],
    date: moment(launchTime).add(item[0], 'seconds').format(),
    type: i
  }
});

class Demo extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let THIS_HOUR = [];
    for (var i = 0; i <= 6; i++) {
      // if (i == 2) continue;
      let date = moment().add(i, 'minutes');
      THIS_HOUR.push({
        name: date.format('h:mmA'),
        date: date.format(),
        type: i
      })
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
              <Timeline
                title='Week Timeline'
                style={{marginBottom: 20}}
                showNow={true}
                titleBkg={'#111'}
                textColor={'#fff'}
                mainBkg={'#455A64'}
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
            <div style={{height: '100%', width: '100%'}}>
              <svg>
              </svg>
            </div>
            <Timeline
              title='Launch: CRS 420'
              style={{display: 'flex', position: 'absolute', bottom: 0, width: '100%', left: 0}}
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
