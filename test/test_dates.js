import * as d3 from 'd3';
var parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
var dates = [];
var now = new Date();
for (var i = 0; i <= 7; i++) {
  dates[i] = {
    date: parseDate(new Date(now.getTime() + 86400000 * i) ),
    name: i
  }
}
export default dates;
