import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./login.css";
import happy from "./../../images/happy-512.png";
import AwesomeSlider from "react-awesome-slider";
import final from "../../images/final.png";
import todolist from "../../images/todolist.png";
import pomodoro from "../../images/pomodoro.png";
import discussion from "../../images/discussion2.png";
import calendar from "../../images/calendar.png";
import AwsSliderStyles from "./styles.scss";

class Login extends Component {
  state = {};
  componentDidMount() {
    if (this.props.userSignedIn !== null) {
      if (this.props.userSignedIn === true) {
        window.setTimeout(() => {
          this.props.history.push("/");
        }, 3000);
      }
    }
  }
  render() {
    return (
      <div className="main">
        {this.props.userSignedIn ? (
          <div className="logged-in">
            <p>
              You are already logged in <img src={happy} alt="Happy" />{" "}
            </p>
            <p className="logged-in-p">
              Get ready to teleport your working space in 3 seconds
            </p>
          </div>
        ) : (
            <div className="not-logged-in">
              <AwesomeSlider
                className="slider"
                cssModule={AwsSliderStyles}
                style={{ height: "670px" }}
              >
                <div data-src={todolist} style={{}}>
                  <p class="descriptions-one" style={{}}>
                    Su-tudy helps Sabanci University students to achieve more.
                    With clear goals, they will conquer those essays, homeworks,
                    midterms and finals!
                </p>
                </div>
                <div data-src={pomodoro}>
                  <p class="descriptions-two">
                    First things first, every student need to learn time
                    management. With Pomodoro schedules, while giving the
                    flexibility to change break and sessions length students will
                    develop their time management skils.
                </p>
                </div>
                <div data-src={calendar}>
                  <p class="descriptions-three">
                    This platform not only focuses on short term goals, like every
                    student, one needs to be aware of upcoming events; that's why
                    we have our old, classic calender.
                </p>
                </div>
                <div data-src={discussion}>
                  <p class="descriptions-four">
                    In Su-tudy, you will be able to share your notes and thoughts
                    about the courses that you currently taking. Also, you will
                    benefit from other students' notes too.
                </p>
                </div>
                <div data-src={final}>
                  <p class="descriptions-five">
                    Don't forget to select the courses that you are taking this
                    semester after you login. Since you got familiar with the
                    interface, let the study session begin!
                </p>
                </div>
              </AwesomeSlider>
            </div>
          )}
      </div>
    );
  }
}

export default withRouter(Login);
