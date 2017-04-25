import React from 'react'

export default class Line extends React.Component {
  static propTypes = {
    path:         React.PropTypes.string.isRequired,
    stroke:       React.PropTypes.string,
    fill:         React.PropTypes.string,
    style:        React.PropTypes.object,
    strokeWidth:  React.PropTypes.number
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
