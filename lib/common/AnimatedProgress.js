'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnimatedProgress = function (_Component) {
  _inherits(AnimatedProgress, _Component);

  function AnimatedProgress(props) {
    _classCallCheck(this, AnimatedProgress);

    var _this = _possibleConstructorReturn(this, (AnimatedProgress.__proto__ || Object.getPrototypeOf(AnimatedProgress)).call(this, props));

    var step = props.points ? props.points[props.step] : null;
    _this.state = {
      width: step ? step.x : 0,
      step: null,
      stop: false
    };
    _this._getStateValue = _this._getStateValue.bind(_this);
    _this.start = _this.start.bind(_this);
    _this.tweenToNext = _this.tweenToNext.bind(_this);
    _this.tweenFromLast = _this.tweenFromLast.bind(_this);
    _this.stop = _this.stop.bind(_this);
    _this.tween = _this.tween.bind(_this);
    _this._updateStateValue = _this._updateStateValue.bind(_this);
    return _this;
  }

  _createClass(AnimatedProgress, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('Mount Animated Progress!');
      var autoStart = this.props.autoStart;

      if (autoStart) {
        this.start();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      console.log('Unmount Timer!');
      this.timer = null;
      this._setStopped = true;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(lastProps, lastState) {
      var step = this.props.step;

      if (lastProps.step !== step) {
        console.log('Step Change!');
        this.start();
      }
    }
  }, {
    key: 'start',
    value: function start() {
      var _props = this.props,
          timed = _props.timed,
          step = _props.step;

      this._setStopped = false;
      console.log('Start Animation', step);
      if (timed) {
        this.tweenToNext();
      } else {
        if (step === 0) {
          this.tweenToNext();
        } else {
          this.tweenFromLast();
        }
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._setStopped = true;
    }
  }, {
    key: 'tweenToNext',
    value: function tweenToNext() {
      var _props2 = this.props,
          onComplete = _props2.onComplete,
          points = _props2.points,
          step = _props2.step;

      var currPoint = points[step];
      var nextPoint = points[step + 1];
      if (!nextPoint) {
        console.log('No Next Point!');
        if (onComplete && typeof onComplete === 'function') {
          onComplete();
        }
        return;
      }
      console.log('Will Tween to Next!');
      var dur = nextPoint.date.getTime() - currPoint.date.getTime();
      this.tween('width', currPoint.x, nextPoint.x, dur);
    }
  }, {
    key: 'tweenFromLast',
    value: function tweenFromLast() {
      var _props3 = this.props,
          points = _props3.points,
          step = _props3.step;

      var currPoint = points[step];
      var lastPoint = points[step - 1];
      if (!lastPoint) {
        return;
      }
      var dur = currPoint.date.getTime() - lastPoint.date.getTime();
      this.tween('width', lastPoint.x, currPoint.x, dur);
    }
    /**
    * Get state value
    * if the prop is not in state regular property
    */

  }, {
    key: '_getStateValue',
    value: function _getStateValue(prop) {
      var v = this.state && this.state[prop];
      return v === undefined ? this[prop] : v;
    }

    /**
    * Set value to state
    * if the prop is not in state, set value to regular property with force update
    */

  }, {
    key: '_updateStateValue',
    value: function _updateStateValue(prop, v) {
      if (typeof v !== 'number') {
        return false;
      }
      if (this.state && this.state[prop] !== undefined) {
        var state = {};
        state[prop] = v;
        this.setState(state);
      } else {
        var _state = _objectWithoutProperties(this.state, []);

        _state[prop] = v;
        this.setState(_state);
      }
    }
  }, {
    key: 'tween',
    value: function tween(prop, start, end) {
      var _this2 = this;

      var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;
      var easing = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'Linear';

      // console.log("Tween with Duration ", duration)
      return new Promise(function (resolve, reject) {
        var i = (0, _d.interpolate)(start, end);
        var easeFun = _d.easeLinear;

        /* The timer stops when the callback retuns a truthy value */
        (0, _d.timer)(function (elapsed, d) {
          if (_this2._setStopped) {
            return true;
          }

          var progress = easeFun(elapsed / duration);

          var value = i(progress);

          // num = value;
          _this2._updateStateValue(prop, value);

          if (value >= end) {
            // console.log("Hit the Step Point!");
            if (_this2.props.step >= _this2.props.points.length) {
              console.log('Done?!');
            } else {
              _this2.props.onPointComplete(_this2.props.step);
            }
            return true;
          }
          // _self.setState({width: value})
          if (elapsed > duration) {
            _this2._updateStateValue(prop, end);
            resolve();
            return true;
          }
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var theWidth = this.state.width || this.props.width || 0;
      var absoluteWidth = theWidth < 0 ? theWidth * -1 : theWidth;
      var _props4 = this.props,
          y = _props4.y,
          height = _props4.height,
          style = _props4.style;

      return _react2.default.createElement('rect', {
        y: y,
        height: height,
        style: style,
        transform: 'scale(' + absoluteWidth + ',1)',
        width: 1 });
    }
  }]);

  return AnimatedProgress;
}(_react.Component);

AnimatedProgress.propTypes = {
  onComplete: _react2.default.PropTypes.func,
  onPointComplete: _react2.default.PropTypes.func,
  points: _react2.default.PropTypes.array,
  step: _react2.default.PropTypes.number,
  timed: _react2.default.PropTypes.bool,
  autoStart: _react2.default.PropTypes.bool,
  y: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  width: _react2.default.PropTypes.number,
  style: _react2.default.PropTypes.object
};
exports.default = AnimatedProgress;