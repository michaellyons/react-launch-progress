import React from 'react';

import * as d3 from 'd3';

export default class Dot extends React.Component {
    static propTypes = {
        data:React.PropTypes.array,
        xData:React.PropTypes.string.isRequired,
        yData:React.PropTypes.string.isRequired,
        x:React.PropTypes.any,
        y:React.PropTypes.any,
        r:React.PropTypes.any,
        format:React.PropTypes.string,
        removeFirstAndLast:React.PropTypes.bool
    };
    render() {

        var _self=this;

        return(
            <g>
            <circle className="dot" r={_self.props.r} cx={_self.props.x} cy={_self.props.y}
                        style={_self.props.style}
                        onMouseOver={_self.props.showToolTip} onMouseOut={_self.props.hideToolTip}
                         />
            </g>
        );
    }
};
