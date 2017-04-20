import React from 'react';

import * as d3 from 'd3';

export default class Dots extends React.Component {
    static propTypes = {
        data:React.PropTypes.array,
        xData:React.PropTypes.string.isRequired,
        yData:React.PropTypes.string.isRequired,
        x:React.PropTypes.func,
        y:React.PropTypes.func,
        r:React.PropTypes.string,
        format:React.PropTypes.string,
        removeFirstAndLast:React.PropTypes.bool
    };
    render() {

        var _self=this;

        //remove last & first point

        var data=[];

        if (this.props.removeFirstAndLast){
            for(var i=1;i<this.props.data.length-1;++i){
                data[i-1]=this.props.data[i];
            }
        } else {
            data=this.props.data;
        }

        var circles=data.map(function(d,i){
            if (d.type !== _self.props.type) return;
            return (
                <circle className="dot" r={_self.props.r} cx={_self.props.x(d[_self.props.xData])} cy={_self.props.y(d[_self.props.yData])}
                            key={i}
                            style={_self.props.style}
                            onMouseOver={_self.props.showToolTip} onMouseOut={_self.props.hideToolTip}
                            data-key={d3.timeFormat(_self.props.format)(d[_self.props.xData])} data-value={d[_self.props.yData]}/>)
        });

        return(
            <g>
                {circles}
            </g>
        );
    }
};
