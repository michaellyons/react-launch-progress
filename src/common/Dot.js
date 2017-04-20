import React from 'react';

export default class Dot extends React.Component {
    static propTypes = {
        x:React.PropTypes.any,
        y:React.PropTypes.any,
        r:React.PropTypes.any,
        className: React.PropTypes.string,
        style:React.PropTypes.object
    };
    render() {
        let _self = this;

        return(
            <g>
            <circle
              id={_self.props.id}
              className={_self.props.className}
              r={_self.props.r}
              cx={_self.props.x}
              cy={_self.props.y}
              style={_self.props.style} />
            </g>
        );
    }
};
