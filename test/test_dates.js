import * as d3 from 'd3';
var parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");

function getTestDates(parsed = false) {
  var dates = [];
  var now = new Date();
  for (let i = 0; i <= 7; i++) {
    let date = new Date(now.getTime() + 86400000 * i)
    dates[i] = {
      date: parsed ? parseDate(date) : date.toUTCString(),
      name: i
    }
  }
  return dates;
}
module.exports = getTestDates;
