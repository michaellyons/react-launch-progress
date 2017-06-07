'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Chart = require('./Chart');

var _Chart2 = _interopRequireDefault(_Chart);

var _Progress = require('./common/Progress');

var _Progress2 = _interopRequireDefault(_Progress);

var _d3Shape = require('d3-shape');

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _d3TimeFormat = require('d3-time-format');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultMargin = {
  top: 40, right: 40, bottom: 10, left: 50
};

var Timeline = function (_React$Component) {
  _inherits(Timeline, _React$Component);

  function Timeline(props) {
    _classCallCheck(this, Timeline);

    var _this = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, props));

    _this.data = [];
    _this.parse = (0, _d3TimeFormat.timeParse)('%Y-%m-%dT%H:%M:%SZ');
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
    _this.runUpdate = _this.runUpdate.bind(_this);
    return _this;
  }

  _createClass(Timeline, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleResize();
      setInterval(this.runUpdate, 1000);
      window.addEventListener('resize', this.handleResize);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(lastProps, lastState) {}
  }, {
    key: 'runUpdate',
    value: function runUpdate() {
      this.setState({ now: new Date().toISOString() });
    }
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

      margin = Object.assign({}, defaultMargin, margin);
      this.w = this.state.width - (margin.left + margin.right);

      var height = this.props.height - (margin.top + margin.bottom);

      this.h = height;

      this.xScale = (0, _d3Scale.scaleTime)().domain(this.extent).rangeRound([0, this.w]);

      this.yScale = (0, _d3Scale.scaleLinear)().domain([0, height]).range([this.h, 0]);

      this.line = (0, _d3Shape.line)().x(function (d) {
        return d && _this2.xScale(d[_self.props.xData] || 0);
      }).y(function (d) {
        return _this2.yScale(height / 2);
      });

      this.transform = 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')';
    }
  }, {
    key: 'doThing',
    value: function doThing() {
      var _props = this.props,
          data = _props.data,
          step = _props.step;
      // console.log('Do thing! ', step);

      var stepFocus = step;
      var datum = data[stepFocus];
      // If item has onComplete function, call it
      if (datum.onComplete && typeof datum.onComplete === 'function') {
        datum.onComplete();
      }

      // On Last Item? run on Complete
      if (stepFocus === data.length - 1) {
        this.onComplete(step);
      } else {
        this.setState({ completed: step });
      }
    }
  }, {
    key: 'onComplete',
    value: function onComplete(step) {
      // console.log('Done with Timeline!')
      // this.refs.timeline.stop()
      this.setState({ completed: step });
      if (this.props.onComplete) {
        this.props.onComplete();
      }
    }
  }, {
    key: 'start',
    value: function start() {
      this.setState({ play: true, complete: false });
      var data = this.props.data;

      if (data[0].onComplete && typeof data[0].onComplete === 'function') {
        data[0].onComplete();
      }
      this.refs.timeline.start();
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          completed = _state.completed,
          width = _state.width,
          now = _state.now;
      var _props2 = this.props,
          labelPos = _props2.labelPos,
          height = _props2.height,
          title = _props2.title,
          mainBkg = _props2.mainBkg,
          margin = _props2.margin,
          titleBkg = _props2.titleBkg,
          step = _props2.step,
          data = _props2.data,
          id = _props2.id,
          xData = _props2.xData,
          showDots = _props2.showDots,
          showLabels = _props2.showLabels,
          showTicks = _props2.showTicks,
          titleStyle = _props2.titleStyle,
          textStyle = _props2.textStyle,
          progressStyle = _props2.progressStyle,
          dotStyle = _props2.dotStyle,
          dotCompleteStyle = _props2.dotCompleteStyle,
          goalCompleteDotStyle = _props2.goalCompleteDotStyle,
          goalDotStyle = _props2.goalDotStyle,
          wrapStyle = _props2.wrapStyle,
          style = _props2.style;


      var complete = completed === data.length - 1;
      var _self = this;
      if (!data) return null;
      var parseDate = (0, _d3TimeFormat.timeParse)('%Y-%m-%dT%H:%M:%S.%LZ');
      var parsedData = void 0;
      var scaleHalf = void 0;
      var endScale = void 0;
      var nowVal = void 0;
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
        this.extent = (0, _d3Array.extent)(parsedData, function (d) {
          return d[xData];
        });
        this.createChart(_self);

        // Calculate Vertical Center Point
        scaleHalf = this.yScale(this.h / 2);
        // Calculate X-Scaled Value for NOW
        endScale = this.xScale(this.extent[1]);
        nowVal = this.xScale(parseDate(now));
        nowVal = nowVal >= endScale ? endScale : nowVal;
        // Calculate percentile progress
        // percentile = nowVal / this.xScale(this.extent[1])
      }

      return _react2.default.createElement(
        'div',
        { ref: 'container', style: _extends({ position: 'relative', height: height }, wrapStyle) },
        _react2.default.createElement(
          _Chart2.default,
          {
            key: width,
            title: title,
            xData: xData,
            titleBkg: titleBkg,
            titleStyle: titleStyle,
            progress: step,
            completeScale: nowVal,
            textStyle: textStyle,
            mainBkg: mainBkg,
            margin: margin,
            id: id,
            now: nowVal,
            labelPos: labelPos,
            complete: complete,
            completed: completed,
            data: this.data,
            dotStyle: dotStyle,
            dotCompleteStyle: dotCompleteStyle,
            goalDotStyle: goalDotStyle,
            goalCompleteDotStyle: goalCompleteDotStyle,
            showDots: showDots,
            showLabels: showLabels,
            showTicks: showTicks,
            style: _extends({ position: 'relative' }, style),
            height: height,
            width: width },
          _react2.default.createElement(_Progress2.default, {
            id: 'chart_progress',
            style: _extends({ fill: '#eee' }, progressStyle),
            height: 8,
            width: nowVal,
            y: scaleHalf - 4 })
        )
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

Timeline.propTypes = {
  data: _propTypes2.default.array,
  progress: _propTypes2.default.number,
  step: _propTypes2.default.number,
  height: _propTypes2.default.number,
  width: _propTypes2.default.number,
  xData: _propTypes2.default.string,
  id: _propTypes2.default.string,
  labelPos: _propTypes2.default.string,
  title: _propTypes2.default.string,
  titleBkg: _propTypes2.default.string,
  mainBkg: _propTypes2.default.string,
  margin: _propTypes2.default.object,
  showDots: _propTypes2.default.bool,
  showLabels: _propTypes2.default.bool,
  showTicks: _propTypes2.default.bool,
  goalDotStyle: _propTypes2.default.object,
  goalCompleteDotStyle: _propTypes2.default.object,
  titleStyle: _propTypes2.default.object,
  textStyle: _propTypes2.default.object,
  dotStyle: _propTypes2.default.object,
  dotCompleteStyle: _propTypes2.default.object,
  progressStyle: _propTypes2.default.object,
  wrapStyle: _propTypes2.default.object,
  style: _propTypes2.default.object,
  onComplete: _propTypes2.default.func
};
Timeline.defaultProps = {
  title: '',
  xData: 'date',
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