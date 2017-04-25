import React from 'react'

export default class Dot extends React.Component {
  static propTypes = {
    id:React.PropTypes.any,
    x:React.PropTypes.any,
    y:React.PropTypes.any,
    r:React.PropTypes.any,
    className: React.PropTypes.string,
    style:React.PropTypes.object
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
