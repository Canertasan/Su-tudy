import React, { Component } from "react";
import BreakInt from "./BreakInterval.js";
import SessionLen from "./SessionLen.js";
import Timer from "./Timer.js";
import "./timer.css";
import firebase from "firebase";

class Pomodoro extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      breakLen: 10,
      sessionLen: 25,
      timerMin: 25,
      timerSec: 0,
      isPlay: false,
      intervalId: 0,
      // isSession: false,
    };
  }

  componentWillUnmount() {
    console.log("UNMOUNT POMODORO");
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.props.userID) {
      this._isMounted &&
        firebase
          .database()
          .ref("users")
          .child(this.props.userID)
          .child("pomodoroData")
          .once("value")
          .then((data) => {
            if (this._isMounted) {
              let pomodoroData = data.val();
              if (pomodoroData !== null) {
                console.log("component did mount", pomodoroData.isPlay);
                console.log(pomodoroData);
                let realDeal =
                  pomodoroData.timerMin * 60 * 1000 +
                  pomodoroData.timerSec * 1000;
                let pastTime = realDeal - (Date.now() - pomodoroData.startTime);
                let allseconds = (pastTime / 1000) | 0;
                let minutes = (allseconds / 60) | 0;
                let seconds = allseconds - minutes * 60;
                if (pomodoroData.intervalId !== 0) {
                  console.log("IF");
                  this.setState({
                    timerMin: minutes,
                    timerSec: seconds,
                    isPlay: pomodoroData.isPlay,
                    intervalId: pomodoroData.intervalId,
                  });
                }
                else {
                  console.log("ELSE", pomodoroData.timerSec);
                  this.setState({
                    timerMin: pomodoroData.timerMin,
                    timerSec: pomodoroData.timerSec,
                    isPlay: pomodoroData.isPlay,
                  });
                }
              }
            }
          });
    } else {
      setTimeout(() => {
        this.componentDidMount();
      }, 2500);
    }
  }

  onIncreaseBreakLen = () => {
    this.setState((prevState) => {
      return {
        breakLen: prevState.breakLen + 1,
      };
    });
  };

  onDecreaseBreakLen = () => {
    this.setState((prevState) => {
      return {
        breakLen: prevState.breakLen - 1,
      };
    });
  };

  onIncreaseSessionLen = () => {
    this.setState((prevState) => {
      return {
        sessionLen: prevState.sessionLen + 5,
        timerMin: prevState.sessionLen + 5,
      };
    });
  };

  onDecreaseSessionLen = () => {
    this.setState((prevState) => {
      return {
        sessionLen: prevState.sessionLen - 5,
        timerMin: prevState.sessionLen - 5,
      };
    });
  };

  onUpdateTimerMinute = () => {
    this.setState((prevState) => {
      return {
        timerMin: prevState.timerMin - 1,
      };
    });
  };

  onToggleInterval = (isSession) => {
    if (isSession) {
      //if break is finished
      this.setState({
        timerMin: this.state.sessionLen,
      });
    } else {
      this.setState({
        timerMin: this.state.breakLen,
      });
    }
  };

  onResetTimer = () => {
    this.setState({
      timerMin: this.state.sessionLen,
    });
  };

  onPlayStopTimer = (isPlay) => {
    this.setState({
      isPlay: isPlay,
    });
  };

  updateTimerSec = () => {
    this.setState({
      timerSec: 59,
    });
  };

  decreaseTimerSecOne = () => {
    this.setState((prevState) => {
      return {
        timerSec: prevState.timerSec - 1,
      };
    });
  };

  refreshTimerSec = () => {
    this.setState({
      timerSec: 0,
    });
  };

  render() {
    return (
      <div className="pomodoro">
        <h1 className="title">Pomodoro Clock</h1>
        <div className="interval-container">
          <BreakInt
            breakInt={this.state.breakLen}
            increaseBreak={this.onIncreaseBreakLen}
            decreaseBreak={this.onDecreaseBreakLen}
          ></BreakInt>
          <SessionLen
            sessionInt={this.state.sessionLen}
            increaseSession={this.onIncreaseSessionLen}
            decreaseSession={this.onDecreaseSessionLen}
          ></SessionLen>
        </div>
        <Timer
          breakLen={this.state.breakLen}
          sessionLen={this.state.sessionLen}
          isPlay={this.state.isPlay}
          userID={this.props.userID}
          refreshTimerSec={this.refreshTimerSec}
          timerSec={this.state.timerSec}
          timerMin={this.state.timerMin}
          updateTimerSec={this.updateTimerSec}
          breakTimer={this.state.breakLen}
          decreaseTimerSecOne={this.decreaseTimerSecOne}
          updateTimerMin={this.onUpdateTimerMinute}
          toggleInterval={this.onToggleInterval}
          resetTimer={this.onResetTimer}
          onPlayStopTimer={this.onPlayStopTimer}
        ></Timer>
      </div>
    );
  }
}

export default Pomodoro;
