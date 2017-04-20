import React from 'react';

export default class Line extends React.Component {

  static propTypes = {
    path:         React.PropTypes.string.isRequired,
    stroke:       React.PropTypes.string,
    fill:         React.PropTypes.string,
    strokeWidth:  React.PropTypes.number
  };

  static defaultProps = {
      stroke:       '#53c79f',
      fill:         'none',
      strokeWidth:  3
  }

  render() {
    let { path, stroke, style, fill, strokeWidth } = this.props;
    return (
      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={style}
        />
    );
  }

};
