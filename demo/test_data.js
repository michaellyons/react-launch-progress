import moment from 'moment';


function getLaunchTimeline() {
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
  // Create Launch TimeProgress with timeline items
  return timeLineItems.map((item, i) => {
    return {
      name: item[1],
      date: launchTime.clone().add(item[0], 'seconds').toISOString(),
      onStart: () => { console.log(item[1] + ' DID START');},
      onComplete: () => { console.log(item[1] + ' Callback Action');}
    }
  });
}

function getSomeSteps (n = 5) {
  let array = [];
  for (var i = 0; i < n; i++) {
    array.push({name: 'Step: '+(i+1)});
  }
  return array;
}

function getThisDay() {
  let THIS_DAY = [];
  let now = moment();
  let hoursOver = now.hours();
  let minutesOver = now.minutes();
  let secondsOver = now.seconds();
  let baseMoment = moment()
                    .subtract(hoursOver, 'hours')
                    .subtract(minutesOver, 'minutes')
                    .subtract(secondsOver, 'seconds')
  for (let i = 0; i <= 24; i++) {
    // if (i == 2) continue;
    let nextMoment = baseMoment.clone().add(((i)), 'hours');
    THIS_DAY.push({
      name: nextMoment.format('h A'),
      onComplete: () => {console.log("Woah!", i)},
      date: nextMoment.toISOString()
    })
  }
  return THIS_DAY;
}

function getThisHour() {
  let THIS_HOUR = [];
  let now = moment();
  let minutesOver = now.minutes();
  let secondsOver = now.seconds();
  let baseMoment = moment()
                    .subtract(minutesOver, 'minutes')
                    .subtract(secondsOver, 'seconds');
  for (let i = 0; i <= 6; i++) {
    // if (i == 2) continue;
    let nextMoment = baseMoment.clone().add(((i) * 10), 'minutes');
    THIS_HOUR.push({
      name: nextMoment.format('h:mm A'),
      onComplete: () => {console.log("Woah!", i)},
      date: nextMoment.toISOString()
    })
  }
  return THIS_HOUR;
}

function getThisMinute() {
  let THIS_MINUTE = [];
  let now = moment();
  let secondsOver = now.seconds();
  for (let i = 0; i <= 1; i++) {
    // if (i == 2) continue;
    let nextMoment = now.clone().add(((i) * 60) - secondsOver, 'seconds');
    THIS_MINUTE.push({
      name: nextMoment.format('h:mm:ss'),
      onComplete: () => {console.log("Woah!", i)},
      date: nextMoment.toISOString()
    })
  }
  return THIS_MINUTE;
}

function getThisWeek() {
  // Get the start of today. 00:00:00
  const today = moment().startOf('day');
  // Get the date of this week's Sunday
  const first_diff = today.date() - today.day();
  // If today is Sunday, set Start to Last Monday
  // Else set Start to Monday
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
  return THIS_WEEK
}

module.exports = {
  getSomeSteps,
  getThisWeek,
  getThisDay,
  getThisHour,
  getThisMinute,
  getLaunchTimeline
}
