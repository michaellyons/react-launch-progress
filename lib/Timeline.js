'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Chart = require('./Chart');

var _Chart2 = _interopRequireDefault(_Chart);

var _Dot = require('./common/Dot');

var _Dot2 = _interopRequireDefault(_Dot);

var _AnimatedProgress = require('./common/AnimatedProgress');

var _AnimatedProgress2 = _interopRequireDefault(_AnimatedProgress);

var _d = require('d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// let lastBlurTime = 0

var Timeline = function (_React$Component) {
  _inherits(Timeline, _React$Component);

  function Timeline(props) {
    _classCallCheck(this, Timeline);

    var _this = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, props));

    _this.data = [];
    _this.parse = (0, _d.timeParse)('%Y-%m-%dT%H:%M:%S%Z');
    _this.state = {
      updateTime: 0,
      complete: false,
      completed: props.progress || 0,
      progress: null,
      width: props.width || 1000
    };
    _this.getWidth = _this.getWidth.bind(_this);
    _this.handleResize = _this.handleResize.bind(_this);
    _this.complete = _this.complete.bind(_this);
    _this._getStateValue = _this._getStateValue.bind(_this);
    _this._updateStateValue = _this._updateStateValue.bind(_this);
    _this.onComplete = _this.onComplete.bind(_this);
    _this.createChart = _this.createChart.bind(_this);
    _this.doThing = _this.doThing.bind(_this);
    return _this;
  }

  _createClass(Timeline, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(lastProps, lastState) {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }
  }, {
    key: 'handleResize',
    value: function handleResize() {
      this.setState({ width: this.getWidth() });
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.refs.container.offsetWidth;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.setState({ completed: this.props.progress || 0, complete: false });
    }
  }, {
    key: 'complete',
    value: function complete() {
      this.setState({ complete: true, play: false });
    }
  }, {
    key: '_getStateValue',
    value: function _getStateValue(prop) {
      return this.state[prop];
    }
  }, {
    key: '_updateStateValue',
    value: function _updateStateValue(prop, value, resolve) {
      var state = _objectWithoutProperties(this.state, []);

      state[prop] = value;
      this.setState(state);
    }
  }, {
    key: 'createChart',
    value: function createChart(_self) {
      var _this2 = this;

      var margin = _self.props.margin;


      this.w = this.state.width - (margin.left + margin.right);

      var height = this.props.height - (margin.top + margin.bottom);

      this.h = height;

      this.xScale = (0, _d.scaleTime)().domain(this.extent).rangeRound([0, this.w]);

      this.yScale = (0, _d.scaleLinear)().domain([0, height]).range([this.h, 0]);

      this.line = (0, _d.line)().curve(_d.curveCardinal).x(function (d) {
        return d && _this2.xScale(d[_self.props.xData] || 0);
      }).y(function (d) {
        return _this2.yScale(height / 2);
      });

      this.transform = 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')';
    }
  }, {
    key: 'doThing',
    value: function doThing(step) {
      var _props = this.props,
          data = _props.data,
          timed = _props.timed;

      var stepFocus = timed ? step + 1 : step;
      var datum = timed ? data[stepFocus] : data[step];
      if (datum.onComplete && typeof datum.onComplete === 'function') {
        datum.onComplete();
      }
      if (stepFocus === data.length - 1) {
        this.onComplete();
      } else {
        this.setState({ completed: step + 1 });
      }
    }
  }, {
    key: 'onComplete',
    value: function onComplete() {
      // console.log('Done with Timeline!')
      this.refs.timeline.stop();
      this.setState({ complete: true });
      if (this.props.onComplete) {
        this.props.onComplete();
      }
    }
  }, {
    key: 'start',
    value: function start() {
      this.setState({ play: true, complete: false });
      this.refs.timeline.start();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _state = this.state,
          play = _state.play,
          complete = _state.complete,
          completed = _state.completed,
          width = _state.width;
      var _props2 = this.props,
          labelPos = _props2.labelPos,
          height = _props2.height,
          timed = _props2.timed,
          duration = _props2.duration,
          title = _props2.title,
          progress = _props2.progress,
          mainBkg = _props2.mainBkg,
          titleBkg = _props2.titleBkg,
          data = _props2.data,
          xData = _props2.xData,
          showDots = _props2.showDots,
          showLabels = _props2.showLabels,
          showTicks = _props2.showTicks,
          autoStart = _props2.autoStart,
          titleStyle = _props2.titleStyle,
          textStyle = _props2.textStyle,
          progressStyle = _props2.progressStyle,
          dotStyle = _props2.dotStyle,
          dotCompleteStyle = _props2.dotCompleteStyle,
          goalCompleteDotStyle = _props2.goalCompleteDotStyle,
          goalDotStyle = _props2.goalDotStyle,
          utc = _props2.utc,
          wrapStyle = _props2.wrapStyle,
          style = _props2.style;


      var _self = this;
      if (!data) return null;
      var parseDate = utc ? (0, _d.timeParse)('%Y-%m-%dT%H:%M:%S%Z') : (0, _d.timeParse)('%m-%d-%Y');
      var parsedData = void 0;
      var eventPoints = void 0;
      var scaleHalf = void 0;
      var dots = [];
      if (data && data.length) {
        parsedData = data.map(function (d, i) {
          return _extends({}, d, {
            date: parseDate(d.date)
          });
        }).sort(function (a, b) {
          if (!a || !b) return 0;
          if (!a[xData] || !b[xData]) return 0;
          return a[xData].getTime() - b[xData].getTime();
        });
        this.data = parsedData;
        this.extent = (0, _d.extent)(parsedData, function (d) {
          return d[xData];
        });
        this.createChart(_self);
        scaleHalf = this.yScale(this.h / 2);
        eventPoints = parsedData.map(function (d, i) {
          var xVal = _this3.xScale(d.date);
          dots.push(_react2.default.createElement(_Dot2.default, {
            key: 'dots' + i,
            x: xVal,
            y: scaleHalf,
            r: '6',
            style: _extends({
              fill: '#ddd',
              stroke: '#000',
              strokeWidth: 1
            }, i <= completed ? dotCompleteStyle : dotStyle) }));
          return _extends({
            x: xVal
          }, d);
        });
      }

      var aProgLine = timed ? _react2.default.createElement(_AnimatedProgress2.default, {
        key: 'progLine2',
        ref: 'timeline',
        id: 'chart_progress',
        style: _extends({ fill: '#eee' }, progressStyle),
        height: 8,
        autoStart: play || autoStart,
        data: this.data,
        onPointComplete: this.doThing,
        points: eventPoints,
        timed: timed,
        y: scaleHalf - 4,
        step: completed,
        duration: duration,
        complete: complete,
        start: eventPoints[completed],
        end: this.xScale(this.extent[1]) }) : _react2.default.createElement(_AnimatedProgress2.default, {
        key: 'progLine2',
        id: 'chart_progress',
        ref: 'timeline',
        style: _extends({ fill: '#eee' }, progressStyle),
        height: 8,
        timed: timed,
        complete: complete,
        data: this.data,
        onPointComplete: this.doThing,
        points: eventPoints,
        y: scaleHalf - 4,
        step: progress,
        duration: 1000,
        start: eventPoints[progress],
        end: this.xScale(this.extent[1]) });
      return _react2.default.createElement(
        'div',
        { ref: 'container', style: _extends({ position: 'relative', height: height }, wrapStyle) },
        _react2.default.createElement(
          _Chart2.default,
          {
            key: timed ? width + completed : width + completed,
            title: title,
            xData: xData || 'date',
            timed: timed,
            titleBkg: titleBkg,
            titleStyle: titleStyle,
            progress: completed,
            textStyle: textStyle,
            mainBkg: mainBkg,
            labelPos: labelPos,
            complete: complete,
            data: this.data,
            dotStyle: dotStyle,
            dotCompleteStyle: dotCompleteStyle,
            goalDotStyle: goalDotStyle,
            goalCompleteDotStyle: goalCompleteDotStyle,
            showDots: showDots,
            showLabels: showLabels,
            showTicks: showTicks,
            style: _extends({ position: 'relative' }, style),
            height: height || 100,
            width: width },
          aProgLine
        )
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

Timeline.propTypes = {
  progress: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  width: _react2.default.PropTypes.number,
  xData: _react2.default.PropTypes.string,
  labelPos: _react2.default.PropTypes.string,
  title: _react2.default.PropTypes.string,
  titleBkg: _react2.default.PropTypes.string,
  mainBkg: _react2.default.PropTypes.string,
  duration: _react2.default.PropTypes.number,
  data: _react2.default.PropTypes.array,
  margin: _react2.default.PropTypes.object,
  autoStart: _react2.default.PropTypes.bool,
  showDots: _react2.default.PropTypes.bool,
  showLabels: _react2.default.PropTypes.bool,
  showTicks: _react2.default.PropTypes.bool,
  utc: _react2.default.PropTypes.bool,
  timed: _react2.default.PropTypes.bool,
  goalDotStyle: _react2.default.PropTypes.object,
  goalCompleteDotStyle: _react2.default.PropTypes.object,
  titleStyle: _react2.default.PropTypes.object,
  textStyle: _react2.default.PropTypes.object,
  dotStyle: _react2.default.PropTypes.object,
  dotCompleteStyle: _react2.default.PropTypes.object,
  progressStyle: _react2.default.PropTypes.object,
  wrapStyle: _react2.default.PropTypes.object,
  style: _react2.default.PropTypes.object,
  onComplete: _react2.default.PropTypes.func
};
Timeline.defaultProps = {
  title: 'Timeline',
  xData: 'date',
  timed: false,
  height: 100,
  margin: {
    top: 40, right: 40, bottom: 10, left: 50
  },
  showDots: true,
  showGoal: true,
  textStyle: {
    fontSize: '14px',
    fill: '#fffff'
  },
  dotCompleteStyle: {
    fill: '#0088d1'
  },
  goalCompleteDotStyle: {
    fill: 'darkgreen'
  }
};
exports.default = Timeline;