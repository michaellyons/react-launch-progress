'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Dot = require('./common/Dot');

var _Dot2 = _interopRequireDefault(_Dot);

var _Line = require('./common/Line');

var _Line2 = _interopRequireDefault(_Line);

var _d3Shape = require('d3-shape');

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// array of curve functions and tites


var defaultMargin = {
  top: 40, right: 40, bottom: 10, left: 50
};

var Chart = function (_React$Component) {
  _inherits(Chart, _React$Component);

  function Chart(props) {
    _classCallCheck(this, Chart);

    var _this = _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, props));

    _this.state = {
      progress: null,
      width: props.width || 800
    };
    _this.createChart = _this.createChart.bind(_this);
    return _this;
  }

  _createClass(Chart, [{
    key: 'createChart',
    value: function createChart(_self) {
      var _this2 = this;

      var margin = this.props.margin;

      this.margin = margin = Object.assign({}, defaultMargin, margin);
      this.w = this.props.width - (margin.left + margin.right);

      var height = this.props.height - (margin.top + margin.bottom);

      this.h = height;

      this.xScale = (0, _d3Scale.scaleTime)().domain((0, _d3Array.extent)(_self.props.data, function (d) {
        return d[_self.props.xData];
      })).rangeRound([0, this.w]);

      this.yScale = (0, _d3Scale.scaleLinear)().domain([0, height]).range([this.h, 0]);

      this.line = (0, _d3Shape.line)().x(function (d) {
        return d && _this2.xScale(d[_self.props.xData] || 0);
      }).y(function (d) {
        return _this2.yScale(height / 2);
      });

      this.transform = 'translate(' + margin.left + ',' + margin.top + ')';
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

      var _props = this.props,
          title = _props.title,
          data = _props.data,
          complete = _props.complete,
          goalDotStyle = _props.goalDotStyle,
          width = _props.width,
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
          now = _props.now,
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
        var itemDone = dX <= now;
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
          key: 'dot_' + i + progress + itemDone,
          id: 'dot_' + i,
          done: itemDone,
          x: dX,
          y: scaleHalf,
          r: '6',
          style: _extends({
            fill: '#ddd',
            stroke: '#000',
            strokeWidth: 1
          }, itemDone ? dotCompleteStyle : dotStyle) }));
        // If it's the last item, draw line to goal (which was removed)
        if (i === data.length - 1) {
          var firstOrLast = i === 0 || i === _this3.props.data.length - 1;
          return _react2.default.createElement(_Line2.default, {
            path: _this3.line([d, goal]),
            style: {
              stroke: '#666',
              strokeLinecap: firstOrLast ? 'round' : '' },
            key: i,
            strokeWidth: 8 });
        }
        // Return line from point to next point in data
        return _react2.default.createElement(_Line2.default, {
          path: _this3.line([d, data[i + 1]]),
          key: i,
          style: { stroke: '#666', strokeLinecap: i === 0 ? 'round' : '' },
          strokeWidth: 8 });
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
            points: '0,0 300,0 345,24 ' + (width - 40) + ',24 ' + (width - 40) + ', ' + height + ' 0,' + height,
            style: { fill: titleBkg || 'navy', stroke: '', strokeWidth: 1 } }),
          _react2.default.createElement('rect', { fill: mainBkg || 'grey', y: 32, width: width, height: height - 24 }),
          _react2.default.createElement(
            'text',
            {
              id: 'chart_title',
              y: '22',
              x: this.margin.left - 4 || '20',
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
            _react2.default.createElement(_Line2.default, {
              path: this.line([this.props.data[0], goal]),
              key: 'abc',
              style: { strokeLinecap: 'round' },
              stroke: '#666',
              strokeWidth: 14 }),
            elems,
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
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  now: _propTypes2.default.number,
  progress: _propTypes2.default.number,
  labelPos: _propTypes2.default.string,
  title: _propTypes2.default.string,
  titleBkg: _propTypes2.default.string,
  mainBkg: _propTypes2.default.string,
  id: _propTypes2.default.string,
  data: _propTypes2.default.array.isRequired,
  xData: _propTypes2.default.string.isRequired,
  children: _propTypes2.default.object,
  margin: _propTypes2.default.object,
  complete: _propTypes2.default.bool,
  showDots: _propTypes2.default.bool,
  showLabels: _propTypes2.default.bool,
  showTicks: _propTypes2.default.bool,
  goalDotStyle: _propTypes2.default.object,
  goalCompleteDotStyle: _propTypes2.default.object,
  titleStyle: _propTypes2.default.object,
  textStyle: _propTypes2.default.object,
  dotStyle: _propTypes2.default.object,
  dotCompleteStyle: _propTypes2.default.object,
  style: _propTypes2.default.object
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