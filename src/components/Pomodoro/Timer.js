import React, { Component } from "react";
import alarm from "./alarm.mp3";
import alarmoff from "../../images/alarmoff.png";
import alarmon from "../../images/alarmonnn.png";
import start from "../../images/start.png";
import stop from "../../images/stop.png";
import refresh from "../../images/refresh.png";
import firebase from "firebase";

class Timer extends Component {
  constructor() {
    super();
    this.state = {
      isSession: true,
      intervalId: 0,
      start: false,
      play: false,
    };
    this.audio = new Audio(alarm);
    this.audio.volume = 0.2;
    this.audio.onended = () => {
      this.setState({
        play: false,
      });
    };
  }

  render() {
    return (
      <div>
        <div className="timer-container">
          <p className="timerName">
            {this.state.isSession === true ? "--Session--" : "--Break--"}
          </p>
          <p className="timer">{this.props.timerMin}</p>
          <p className="timer">
            {this.props.timerMin && this.props.timerSec === 0
              ? ":00"
              : this.props.timerSec < 10
                ? ":0" + this.props.timerSec
                : ":" + this.props.timerSec}
          </p>
        </div>
        <div className="timer-actions">
          <img
            onClick={this.playTimer}
            disabled={!this.state.start}
            src={start}
            className="start-timer" />
          <img
            onClick={this.stopTimer}
            disabled={this.state.start}
            src={stop}
            className="stop-timer" />
          <img
            onClick={this.resetTimer}
            src={refresh}
            className="refresh-timer" />
          <img
            className="alarm-onoff"
            src={this.state.play ? alarmon : alarmoff}
            onClick={this.pauseAlarm} />
        </div>
      </div>
    );
  }
  pauseAlarm = () => {
    //Stops alarm from biping
    this.audio.pause();
    this.setState({
      play: false,
    });
  };

  playTimer = () => {
    console.log("player timer", this.state.start)
    if (!this.state.start) {
      console.log("player timer")
      this.props.onPlayStopTimer(true);
      let intervalId = setInterval(this.decreaseTimer, 1000);
      firebase
        .database()
        .ref("users")
        .child(this.props.userID)
        .child("pomodoroData")
        .update({
          isSession: this.state.isSession,
          startTime: Date.now(),
          timerMin: this.props.timerMin,
          timerSec: this.props.timerSec,
          isPlay: true,
          intervalId: intervalId,
        });
      this.setState({
        intervalId: intervalId,
        start: true,
      });
    }
  };

  componentDidMount() {
    if (this.props.userID)
      firebase
        .database()
        .ref("users")
        .child(this.props.userID)
        .child("pomodoroData")
        .once("value")
        .then((data) => {
          let pomodoroData = data.val();
          if (pomodoroData !== null) {
            if (pomodoroData.isPlay) {
              let intervalId = setInterval(this.decreaseTimer, 1000);
              this.onPlayStopTimer(pomodoroData.isPlay);
              this.setState({
                intervalId: intervalId,
                start: pomodoroData.isPlay,
                isSession: pomodoroData.isSession,
              });
              console.log("componentmount intervalID", this.state.intervalId);
            }
            else {
              this.setState({
                intervalId: pomodoroData.intervalId,
                start: pomodoroData.isPlay,
                isSession: pomodoroData.isSession,
              });
            }
            console.log("component mounted", this.state.start);
          }
        });
  }
  componentDidUpdate(prevProps) {
    if (this.props.isPlay !== prevProps.isPlay) {
      if (this.props.isPlay) {
        console.log('component', this.props.isPlay)
        this.setState({
          start: this.props.isPlay,
        })
        // setInterval(this.decreaseTimer, 1000);
      } else {
        console.log('component updated', this.props.isPlay)
        // this.onPlayStopTimer(this.props.isPlay)
      }
    }
    if (this.props.intervalId !== prevProps.intervalId) {
      this.setState({
        intervalId: this.props.intervalId,
      })
    }
  }

  decreaseTimer = async () => {
    switch (this.props.timerSec) {
      case 0:
        if (this.props.timerMin <= 0) {
          if (this.state.isSession) {
            //if its currently session
            if (this.props.timerSec <= 0) {
              //switching from session to break
              console.log("SESSİON TO BREAK", this.props.breakLen);
              await firebase
                .database()
                .ref("users")
                .child(this.props.userID)
                .child("pomodoroData")
                .update({
                  isSession: !this.state.isSession,
                  timerMin: this.props.breakLen,
                  timerSec: 0,
                  startTime: Date.now(),
                });
              this.setState({
                isSession: false,
                play: true,
              });
              this.props.toggleInterval(this.state.isSession);
              await this.audio.play();
            }
          } else {
            //its on break
            if (this.props.timerSec <= 0) {
              await firebase
                .database()
                .ref("users")
                .child(this.props.userID)
                .child("pomodoroData")
                .update({
                  isSession: !this.state.isSession,
                  timerMin: this.props.sessionLen,
                  timerSec: 0,
                  startTime: Date.now(),
                });
              this.setState({
                isSession: true,
                play: true,
              });
              this.props.toggleInterval(this.state.isSession);
              await this.audio.play();
            }
          }
        } else {
          this.props.updateTimerMin();
          this.props.updateTimerSec();
        }
        // } else {
        //   //timer min 0 degilse
        //   this.props.updateTimerMin();
        //   this.props.updateTimerSec();
        //   if (this.props.timerSec === 0) {
        //     // 1:00
        //     //switching from break to session
        //     this.setState({
        //       play: true,
        //     });
        //     this.audio.play();
        //     this.props.toggleInterval(this.state.isSession);
        //   }
        // }
        break;
      default:
        this.props.decreaseTimerSecOne();
        break;
    }
  };

  stopTimer = () => {
    console.log("stop timer", this.state.start)
    if (this.state.start) {
      console.log("stop timer")
      firebase
        .database()
        .ref("users")
        .child(this.props.userID)
        .child("pomodoroData")
        .update({
          isSession: this.state.isSession,
          startTime: Date.now(),
          timerMin: this.props.timerMin,
          timerSec: this.props.timerSec,
          isPlay: false,
          intervalId: 0,
        });
      console.log(this.state.intervalId);
      clearInterval(this.state.intervalId);
      this.props.onPlayStopTimer(false);
      this.setState({
        start: false,
      });
    }
  };

  resetTimer = () => {
    firebase
      .database()
      .ref("users")
      .child(this.props.userID)
      .child("pomodoroData")
      .remove()

    clearInterval(this.state.intervalId);
    this.props.resetTimer();
    this.props.onPlayStopTimer(false);
    this.props.refreshTimerSec();
    this.setState({
      isSession: true,
      start: false,
    });
  };

  onPlayStopTimer = () => {
    this.props.onPlayStopTimer();
  };
}

export default Timer;
