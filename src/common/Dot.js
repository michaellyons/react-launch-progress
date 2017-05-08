import React from 'react'
import PropTypes from 'prop-types'

export default class Dot extends React.Component {
  static propTypes = {
    id: PropTypes.any,
    x: PropTypes.any,
    y: PropTypes.any,
    r: PropTypes.any,
    className:  PropTypes.string,
    style: PropTypes.object
  };
  shouldComponentUpdate (nextProps, nextState) {
    let { r, x, y } = this.props
    if (
        nextProps.r === r &&
        nextProps.x === x &&
        nextProps.y === y
      ) { return false }
    return true
  }
  render () {
    let { id, style, r, x, y, className } = this.props
    return (
      <g>
        <circle
          id={id}
          className={className}
          r={r}
          cx={x}
          cy={y}
          style={style} />
      </g>
    )
  }
};
