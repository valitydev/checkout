import React from 'react';

class Checkmark extends React.Component {

    constructor(props) {
        super(props);
        this.styles = {
            circle: {
                strokeDasharray: '240px',
                strokeDashoffset: '480px'
            },
            path: {
                strokeDasharray: '50px',
                strokeDashoffset: '0px'
            }
        };
    }

    render() {
        return <div className="checkmark icon icon--order-success svg" ref={(element) => {this.element = element;}}>
            <svg width={72} height={72}>
                <g fill="none" stroke="#8EC343" strokeWidth={2}>
                    <circle cx={36} cy={36} r={35} style={this.styles.circle} />
                    <path d="M17.417,37.778l9.93,9.909l25.444-25.393" style={this.styles.path} />
                </g>
            </svg>
        </div>
    }
}

export default Checkmark;
