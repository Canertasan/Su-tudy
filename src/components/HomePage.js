import React, { Component } from "react";
import ListComp from "./ListComp/ListComponent";
import Pomodoro from "./Pomodoro/pomodoro.js";
import Calendar from "./Calendar/Calendar.js";
import { withRouter } from "react-router-dom";

import "./homepage.css";

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: this.props.user,
      userid: this.props.userID,
    };
  }

  componentDidMount() {
    if (this.props.userSignedIn !== null) {
      if (this.props.userSignedIn === false) {
        this.props.history.push("/login");
      }
    }
  }

  state = {};

  render() {
    return (
      <div className="homepage">
        {/* /To put the components in specific locations I divided the page into two. Please follow the design when locating your component/ */}
        <div className="leftside">
          <ListComp user={this.props.user} userID={this.props.userID} />
          <Pomodoro userID={this.props.userID} />
        </div>
        <div className="rightside">
          <Calendar userID={this.props.userID} />

        </div>
        <div style={{ marginBottom: "8em", width: "100%", height: "10px", }}><p> </p></div>
      </div>
    );
  }
}

export default withRouter(HomePage);
