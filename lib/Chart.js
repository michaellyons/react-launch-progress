'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Dot = require('./common/Dot');

var _Dot2 = _interopRequireDefault(_Dot);

var _Line = require('./common/Line');

var _Line2 = _interopRequireDefault(_Line);

var _d = require('d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// array of curve functions and tites


var Chart = function (_React$Component) {
  _inherits(Chart, _React$Component);

  function Chart(props) {
    _classCallCheck(this, Chart);

    var _this = _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, props));

    _this.state = {
      progress: null,
      width: props.width || 800
    };
    _this.createLineSegment = _this.createLineSegment.bind(_this);
    _this.createChart = _this.createChart.bind(_this);
    return _this;
  }

  _createClass(Chart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(lastProps, lastState) {}
  }, {
    key: 'createChart',
    value: function createChart(_self) {
      var _this2 = this;

      var margin = _self.props.margin;


      this.w = this.state.width - (margin.left + margin.right);

      var height = this.props.height - (margin.top + margin.bottom);

      this.h = height;

      this.xScale = (0, _d.scaleTime)().domain((0, _d.extent)(_self.props.data, function (d) {
        return d[_self.props.xData];
      })).rangeRound([0, this.w]);

      this.yScale = (0, _d.scaleLinear)().domain([0, height]).range([this.h, 0]);

      this.line = (0, _d.line)().curve(_d.curveCardinal).x(function (d) {
        return d && _this2.xScale(d[_self.props.xData] || 0);
      }).y(function (d) {
        return _this2.yScale(height / 2);
      });

      this.transform = 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')';
    }
  }, {
    key: 'createLineSegment',
    value: function createLineSegment(datum, i) {
      return _react2.default.createElement(_Line2.default, { path: this.line(datum), key: i, fill: '#fe001a', strokeWidth: 2 });
    }
  }, {
    key: 'getOffset',
    value: function getOffset(offset, i) {
      switch (offset) {
        case 'alternate-top':
          return i % 2 ? 1 : -1;
        case 'alternate-bot':
          return i % 2 ? -1 : 1;
        case 'top':
          return -1;
        case 'bottom':
        default:
          return 1;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var width = this.state.width;
      var _props = this.props,
          title = _props.title,
          data = _props.data,
          complete = _props.complete,
          goalDotStyle = _props.goalDotStyle,
          goalCompleteDotStyle = _props.goalCompleteDotStyle,
          dotStyle = _props.dotStyle,
          dotCompleteStyle = _props.dotCompleteStyle,
          textStyle = _props.textStyle,
          titleStyle = _props.titleStyle,
          showDots = _props.showDots,
          showLabels = _props.showLabels,
          showTicks = _props.showTicks,
          progress = _props.progress,
          labelPos = _props.labelPos,
          mainBkg = _props.mainBkg,
          titleBkg = _props.titleBkg,
          height = _props.height;

      // Declare Arrays for SVG Elements

      var dots = [];
      var elems = void 0;
      var labels = [];
      var ticks = [];
      var goal = void 0;
      var goalScale = void 0;
      if (!data || !data.length) {
        return null;
      }
      var _self = this;
      this.createChart(_self);
      // Scale half the Height of the Graph Content Area
      // To find Y Value of Horizontal Time Line

      // Grab the Last Element as the Goal
      var scaleHalf = this.yScale(this.h / 2);

      goal = data.pop();

      goalScale = goal ? this.xScale(goal[this.props.xData]) : 0;

      elems = data.map(function (d, i) {
        // Scale for X location of datum
        var dX = _this3.xScale(d[_this3.props.xData]);
        if (isNaN(dX)) return;
        // Offset is multipler for vertical direction of label/ticks
        var offSet = _this3.getOffset(labelPos, i);

        // Push onto Ticks Array
        ticks.push(_react2.default.createElement('line', {
          key: 'tick_' + i,
          strokeWidth: '2',
          stroke: '#ddd',
          x1: _this3.xScale(d[_this3.props.xData]),
          x2: _this3.xScale(d[_this3.props.xData]),
          y1: scaleHalf,
          y2: scaleHalf + 12 * offSet }));
        // Push onto labels array for Item
        labels.push(_react2.default.createElement(
          'text',
          {
            textAnchor: i === 0 ? 'start' : 'middle',
            key: 'label_' + i,
            x: dX,
            y: offSet < 0 ? scaleHalf - 14 : scaleHalf + 28,
            fontFamily: 'Verdana',
            fontSize: '16',
            fill: '#fff',
            style: textStyle },
          d.name
        ));
        // Push onto Dots array for Item
        dots.push(_react2.default.createElement(_Dot2.default, {
          key: 'dot_' + i,
          id: 'dot_' + i,
          x: dX,
          y: scaleHalf,
          r: '6',
          style: _extends({
            fill: '#ddd',
            stroke: '#000',
            strokeWidth: 1
          }, i <= progress ? dotCompleteStyle : dotStyle) }));
        // If it's the last item, draw line to goal (which was removed)
        if (i === data.length - 1) {
          var firstOrLast = i === 0 || i === _this3.props.data.length - 1;
          return _react2.default.createElement(_Line2.default, {
            path: _this3.line([d, goal]),
            style: {
              stroke: '#666',
              strokeLinecap: firstOrLast ? 'round' : '' },
            key: i,
            strokeWidth: 14 });
        }
        // Return line from point to next point in data
        return _react2.default.createElement(_Line2.default, {
          path: _this3.line([d, data[i + 1]]),
          key: i,
          style: { stroke: '#666', strokeLinecap: i === 0 ? 'round' : '' },
          strokeWidth: 14 });
      });
      // Add the Goal Label
      labels.push(_react2.default.createElement(
        'text',
        {
          key: 'goal_label',
          id: 'goal_label',
          x: goalScale,
          y: '50',
          fill: '#fff',
          textAnchor: 'end',
          fontFamily: 'Verdana',
          fontSize: '16',
          style: textStyle },
        goal.name
      ));
      // Add the Goal Dot
      dots.push(_react2.default.createElement(_Dot2.default, {
        key: 'goal_dot' + complete,
        id: 'goal_dot',
        x: this.xScale(goal[this.props.xData]),
        r: '6',
        style: _extends({
          fill: '#ddd',
          stroke: '#00fefe',
          strokeWidth: 2
        }, complete ? goalCompleteDotStyle : goalDotStyle),
        y: scaleHalf }));

      return _react2.default.createElement(
        'div',
        { style: _extends({ width: width }, this.props.style), key: width, ref: 'container' },
        _react2.default.createElement(
          'svg',
          { id: this.props.id, ref: 'svg', width: width, height: height },
          _react2.default.createElement('polygon', {
            points: '0,0 300,0 345,24 ' + (width - 40) + ',24 ' + (width - 40) + ', 250 0,250',
            style: { fill: titleBkg || 'navy', stroke: '', strokeWidth: 1 } }),
          _react2.default.createElement('rect', { fill: mainBkg || 'grey', y: 32, width: width, height: height - 24 }),
          _react2.default.createElement(
            'text',
            {
              id: 'chart_title',
              y: '22',
              x: this.props.margin.left - 4 || '20',
              fontFamily: 'Verdana',
              fontSize: '16',
              fill: '#fff',
              style: titleStyle },
            title
          ),
          _react2.default.createElement(
            'g',
            { transform: this.transform, fill: '#333' },
            showLabels && labels,
            elems,
            _react2.default.createElement(_Line2.default, {
              path: this.line([this.props.data[0], goal]),
              key: 'abc',
              stroke: '#aaa',
              strokeWidth: 8,
              strokeLinecap: 'round' }),
            showTicks && ticks,
            this.props.children,
            _react2.default.createElement(
              'g',
              { id: 'dots' },
              showDots && dots
            )
          )
        )
      );
    }
  }]);

  return Chart;
}(_react2.default.Component);

Chart.propTypes = {
  width: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  progress: _react2.default.PropTypes.number,
  labelPos: _react2.default.PropTypes.string,
  title: _react2.default.PropTypes.string,
  titleBkg: _react2.default.PropTypes.string,
  mainBkg: _react2.default.PropTypes.string,
  id: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.array.isRequired,
  xData: _react2.default.PropTypes.string.isRequired,
  children: _react2.default.PropTypes.object,
  margin: _react2.default.PropTypes.object,
  complete: _react2.default.PropTypes.bool,
  showDots: _react2.default.PropTypes.bool,
  showLabels: _react2.default.PropTypes.bool,
  showTicks: _react2.default.PropTypes.bool,
  goalDotStyle: _react2.default.PropTypes.object,
  goalCompleteDotStyle: _react2.default.PropTypes.object,
  titleStyle: _react2.default.PropTypes.object,
  textStyle: _react2.default.PropTypes.object,
  dotStyle: _react2.default.PropTypes.object,
  dotCompleteStyle: _react2.default.PropTypes.object,
  style: _react2.default.PropTypes.object
};
Chart.defaultProps = {
  width: 800,
  height: 300,
  xData: 'date',
  id: 'event-timeline',
  showDots: true,
  showLabels: true,
  showTicks: true,
  textStyle: {
    fill: '#fff'
  },
  margin: {
    top: 40, right: 40, bottom: 10, left: 50
  }
};
;

module.exports = Chart;