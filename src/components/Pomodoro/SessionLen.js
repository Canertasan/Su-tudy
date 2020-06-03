import React, { Component } from 'react';
import up from '../../images/up.png';
import down from '../../images/down.png';

class SessionLen extends Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        return (
            <div className='session'>
                <h6 className="heading">Session Length</h6>
                <div className="up-down-div">
                    <img src={down} onClick={this.decreaseCounter} className='up-down' />
                    <p>{this.props.sessionInt}</p>
                    <img src={up} onClick={this.increaseCounter} className='up-down' />
                </div>
            </div>
        );
    }

    decreaseCounter = () => {
        if (this.props.sessionInt === 25) {
            return;
        }
        this.props.decreaseSession();
    }

    increaseCounter = () => {
        if (this.props.sessionInt === 60) {
            return;
        }
        this.props.increaseSession();
    }
}

export default SessionLen;