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

var _TimeProgress = require('./common/TimeProgress');

var _TimeProgress2 = _interopRequireDefault(_TimeProgress);

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

var TimeProgressWrap = function (_React$Component) {
  _inherits(TimeProgressWrap, _React$Component);

  function TimeProgressWrap(props) {
    _classCallCheck(this, TimeProgressWrap);

    var _this = _possibleConstructorReturn(this, (TimeProgressWrap.__proto__ || Object.getPrototypeOf(TimeProgressWrap)).call(this, props));

    _this.data = [];
    _this.state = {
      updateTime: 0,
      complete: false,
      now: new Date().toISOString(),
      width: props.width || 1000
    };
    _this.getWidth = _this.getWidth.bind(_this);
    _this.handleResize = _this.handleResize.bind(_this);
    _this.complete = _this.complete.bind(_this);
    _this._getStateValue = _this._getStateValue.bind(_this);
    _this._updateStateValue = _this._updateStateValue.bind(_this);
    _this.onComplete = _this.onComplete.bind(_this);
    _this.createChart = _this.createChart.bind(_this);
    _this.runUpdate = _this.runUpdate.bind(_this);
    _this.startInterval = _this.startInterval.bind(_this);
    _this.clearInterval = _this.clearInterval.bind(_this);
    return _this;
  }

  _createClass(TimeProgressWrap, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleResize();
      this.createChart(this);
      this.startInterval();
      window.addEventListener('resize', this.handleResize);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(lastProps, lastState) {}
  }, {
    key: 'startInterval',
    value: function startInterval() {
      if (this.idealSpeed) {
        // console.log("Start Interval with speed: ", this.idealSpeed)
        this.interval = setInterval(this.runUpdate, this.idealSpeed);
      }
    }
  }, {
    key: 'clearInterval',
    value: function (_clearInterval) {
      function clearInterval() {
        return _clearInterval.apply(this, arguments);
      }

      clearInterval.toString = function () {
        return _clearInterval.toString();
      };

      return clearInterval;
    }(function () {
      clearInterval(this.interval);
    })
  }, {
    key: 'runUpdate',
    value: function runUpdate() {
      // console.log("Run Update!", this.props.id);
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
      this.setState({ complete: false });
    }
  }, {
    key: 'complete',
    value: function complete() {
      this.clearInterval();
      this.props.onComplete();
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

      var _self$props = _self.props,
          margin = _self$props.margin,
          xData = _self$props.xData,
          data = _self$props.data,
          parseSpecifier = _self$props.parseSpecifier;

      var parseDate = this.parseDate = (0, _d3TimeFormat.timeParse)(parseSpecifier);

      var parsedData = data.map(function (d, i) {
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
      margin = Object.assign({}, defaultMargin, margin);
      this.w = this.state.width - (margin.left + margin.right);
      this.idealSpeed = this.secondsTotal / this.w;
      this.secondsTotal = (this.extent[1].getTime() - this.extent[0].getTime()) / 1000;

      var height = this.h = this.props.height - (margin.top + margin.bottom);

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
          width = _state.width,
          now = _state.now;

      var _props = this.props,
          height = _props.height,
          title = _props.title,
          mainBkg = _props.mainBkg,
          margin = _props.margin,
          titleBkg = _props.titleBkg,
          data = _props.data,
          parseSpecifier = _props.parseSpecifier,
          id = _props.id,
          xData = _props.xData,
          styles = _objectWithoutProperties(_props, ['height', 'title', 'mainBkg', 'margin', 'titleBkg', 'data', 'parseSpecifier', 'id', 'xData']);

      var complete = void 0;
      var _self = this;
      if (!data) return null;
      var scaleHalf = void 0;
      var endScale = void 0;
      var nowScale = void 0;
      if (data && data.length) {
        this.createChart(_self);

        // Calculate Vertical Center Point
        scaleHalf = this.yScale(this.h / 2);
        // Calculate X-Scaled Value for NOW
        endScale = this.xScale(this.extent[1]);

        // if Now coerces to true, try to parse. else set 0
        nowScale = now ? this.xScale(this.parseDate(now)) : 0;

        // Determine if Completed based on if Now is greater than the End
        complete = nowScale >= endScale;

        // Cap Nowscale at the end scale.
        nowScale = complete ? endScale : nowScale;

        // Calculate percentile progress
        // percentile = nowScale / this.xScale(this.extent[1])
      }

      return _react2.default.createElement(
        'div',
        { ref: 'container', style: _extends({ position: 'relative', height: height }, styles.wrapStyle) },
        _react2.default.createElement(
          _Chart2.default,
          _extends({
            key: width,
            title: title,
            xData: xData,
            xScale: this.xScale,
            titleBkg: titleBkg,
            mainBkg: mainBkg,
            margin: margin,
            id: id,
            now: nowScale,
            data: this.data,
            complete: complete,
            height: height,
            width: width
          }, styles, {
            onComplete: this.complete
          }),
          _react2.default.createElement(_TimeProgress2.default, {
            data: data,
            ref: 'timeline',
            style: _extends({ fill: '#eee' }, styles.progressStyle),
            height: 8,
            tweenDone: function tweenDone() {},
            progress: nowScale,
            duration: this.idealSpeed,
            y: scaleHalf - 4 })
        )
      );
    }
  }]);

  return TimeProgressWrap;
}(_react2.default.Component);

TimeProgressWrap.propTypes = {
  data: _propTypes2.default.array,
  height: _propTypes2.default.number,
  width: _propTypes2.default.number,
  xData: _propTypes2.default.string,
  parseSpecifier: _propTypes2.default.string,
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
  dotColor: _propTypes2.default.string,
  goalColor: _propTypes2.default.string,
  dotCompleteColor: _propTypes2.default.string,
  goalCompleteColor: _propTypes2.default.string,
  progressColor: _propTypes2.default.string,
  textColor: _propTypes2.default.string,
  onComplete: _propTypes2.default.func
};
TimeProgressWrap.defaultProps = {
  title: '',
  xData: 'date',
  height: 100,
  parseSpecifier: '%Y-%m-%dT%H:%M:%S.%LZ',
  margin: {
    top: 40, right: 40, bottom: 10, left: 50
  },
  showDots: true,
  showGoal: true,
  dotCompleteColor: '#0088d1',
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
exports.default = TimeProgressWrap;