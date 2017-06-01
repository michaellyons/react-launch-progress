'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Ease = require('d3-ease');

var _Progress = require('./Progress');

var _Progress2 = _interopRequireDefault(_Progress);

var _d3Timer = require('d3-timer');

var _d3Interpolate = require('d3-interpolate');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ControlledProgress = function (_Component) {
  _inherits(ControlledProgress, _Component);

  function ControlledProgress(props) {
    _classCallCheck(this, ControlledProgress);

    var _this = _possibleConstructorReturn(this, (ControlledProgress.__proto__ || Object.getPrototypeOf(ControlledProgress)).call(this, props));

    _this.state = {
      width: props.progress || 0,
      step: null,
      stop: false
    };
    _this._getStateValue = _this._getStateValue.bind(_this);
    _this.stop = _this.stop.bind(_this);
    _this.goTween = _this.goTween.bind(_this);
    _this.tweenUp = _this.tweenUp.bind(_this);
    _this.tweenDown = _this.tweenDown.bind(_this);
    _this._updateStateValue = _this._updateStateValue.bind(_this);
    return _this;
  }

  _createClass(ControlledProgress, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // console.log('Mount Progress!')
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // console.log('Unmount Timer!')
      this.timer = null;
      this.stop();
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      var _this2 = this;

      if (nextProps.progress !== this.props.progress) {
        var parsedVal = parseFloat(this.props.progress);
        var parsedNext = parseFloat(nextProps.progress);
        // console.log("Will Change Value!");
        // If we're growing, tween in the positive direction
        var func;
        if (parsedNext > parsedVal) {
          func = this.tweenUp;
        } else {
          func = this.tweenDown;
        }
        this.tween = func('width', this.state.width, parsedNext, this.props.duration).then(function (timer) {
          // console.log("Tween End!");
          _this2.props.tweenDone();
          timer.stop();
        });
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._setStopped = true;
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
    key: 'tweenUp',
    value: function tweenUp(prop, start, end) {
      var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;
      var easing = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'Linear';

      return this.goTween(prop, start, end, duration, 1, easing);
    }
  }, {
    key: 'tweenDown',
    value: function tweenDown(prop, start, end) {
      var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;
      var easing = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'Linear';

      return this.goTween(prop, start, end, duration, -1, easing);
    }
  }, {
    key: 'goTween',
    value: function goTween(prop, start, end) {
      var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;

      var _this3 = this;

      var direction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var easing = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'Linear';

      // console.log("Tween with Duration ", duration)
      return new Promise(function (resolve, reject) {
        var i = (0, _d3Interpolate.interpolate)(start, end);
        var easeFun = _d3Ease.easeLinear;

        /* The timer stops when the callback retuns a truthy value */
        var time = (0, _d3Timer.timer)(function (elapsed, d) {
          if (_this3._setStopped) {
            return true;
          }
          // return true;

          var progress = easeFun(elapsed / duration);

          var value = i(progress);

          // num = value;
          if (direction > 0) {
            if (value >= end) {
              // console.log("Hit the Step Point!")
              _this3._updateStateValue(prop, end);
              resolve(time);
              return true;
            }
          } else {
            if (value <= end) {
              // console.log("Hit the Step Point!")
              _this3._updateStateValue(prop, end);
              resolve(time);
              return true;
            }
          }

          _this3._updateStateValue(prop, value);

          // _self.setState({width: value})
          if (elapsed > duration) {
            _this3._updateStateValue(prop, end);
            resolve(time);
            return true;
          }
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          y = _props.y,
          height = _props.height,
          style = _props.style;

      var theWidth = this.state.width || this.props.width || 0;
      var absoluteWidth = theWidth < 0 ? theWidth * -1 : theWidth;
      return _react2.default.createElement(_Progress2.default, {
        y: y,
        height: height,
        width: absoluteWidth,
        style: style });
    }
  }]);

  return ControlledProgress;
}(_react.Component);

ControlledProgress.propTypes = {
  duration: _propTypes2.default.number,
  progress: _propTypes2.default.number,
  y: _propTypes2.default.number,
  height: _propTypes2.default.number,
  width: _propTypes2.default.number,
  style: _propTypes2.default.object,
  tweenDone: _propTypes2.default.func
};
exports.default = ControlledProgress;