'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dot = function (_React$Component) {
  _inherits(Dot, _React$Component);

  function Dot() {
    _classCallCheck(this, Dot);

    return _possibleConstructorReturn(this, (Dot.__proto__ || Object.getPrototypeOf(Dot)).apply(this, arguments));
  }

  _createClass(Dot, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _props = this.props,
          r = _props.r,
          x = _props.x,
          y = _props.y;

      if (nextProps.r === r && nextProps.x === x && nextProps.y === y) {
        return false;
      }
      return true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          id = _props2.id,
          style = _props2.style,
          r = _props2.r,
          x = _props2.x,
          y = _props2.y,
          className = _props2.className;

      return _react2.default.createElement(
        'g',
        null,
        _react2.default.createElement('circle', {
          id: id,
          className: className,
          r: r,
          cx: x,
          cy: y,
          style: style })
      );
    }
  }]);

  return Dot;
}(_react2.default.Component);

Dot.propTypes = {
  id: _react2.default.PropTypes.any,
  x: _react2.default.PropTypes.any,
  y: _react2.default.PropTypes.any,
  r: _react2.default.PropTypes.any,
  className: _react2.default.PropTypes.string,
  style: _react2.default.PropTypes.object
};
exports.default = Dot;
;