import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Progress extends Component {
  static propTypes = {
    y: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
    style: PropTypes.object
  }
  render () {
    let { y, height, width, style } = this.props
    let theWidth = width || 0
    let absoluteWidth = theWidth < 0 ? theWidth * -1 : theWidth
    return <rect
      y={y}
      height={height}
      style={style}
      transform={'scale(' + (absoluteWidth) + ',1)'}
      width={1} />
  }
}

export default Progress
