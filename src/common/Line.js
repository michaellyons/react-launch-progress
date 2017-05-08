import React from 'react'
import PropTypes from 'prop-types'

export default class Line extends React.Component {
  static propTypes = {
    path:         PropTypes.string.isRequired,
    stroke:       PropTypes.string,
    fill:         PropTypes.string,
    style:        PropTypes.object,
    strokeWidth:  PropTypes.number
  };

  static defaultProps = {
    stroke:       '#53c79f',
    fill:         'none',
    strokeWidth:  3
  }
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }
  render () {
    let { path, stroke, style, fill, strokeWidth } = this.props
    return (
      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={style}
        />
    )
  }
};
