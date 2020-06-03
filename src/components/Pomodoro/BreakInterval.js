import React, { Component } from 'react';
import up from '../../images/up.png';
import down from '../../images/down.png';

class BreakInterval extends Component {


    render() {
        return (
            <div className='break'>
                <h6 className="heading">Break Length</h6>
                <div className="up-down-div">
                    <img src={down} onClick={this.decreaseCounter} className='up-down' />
                    <p>{this.props.breakInt}</p>
                    <img src={up} onClick={this.increaseCounter} className='up-down' />
                </div>
            </div>
        );
    }

    decreaseCounter = () => {
        if (this.props.breakInt === 5) {
            return;
        }
        this.props.decreaseBreak();
    }

    increaseCounter = () => {
        if (this.props.breakInt === 60) {
            return;
        }
        this.props.increaseBreak();
    }

}

export default BreakInterval;