import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import styles from "./styles.js";
import firebase from "firebase";

class DiscussionChatComponent extends Component {
  state = {
    userName: "",
  };

  getTimeDifference = () => {
    if (this.props.timestamp !== "empty")
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(this.props.timestamp);
  };
  componentWillMount = () => {
    this.getUserData();
  };
  getUserData = async () => {
    if (this.props.userID !== undefined)
      await firebase
        .database()
        .ref("users")
        .child(this.props.userID)
        .once("value")
        .then((data) => {
          if (data.val()) {
            console.log("dataval", data.val());
            this.setState({
              userName: data.val().username,
            });
          }
        });
  };
  render() {
    return (
      <div style={{ display: "block", width: "100%", marginTop: "20px" }}>
        <Typography style={{}}>{this.props.description}</Typography>

        <Typography
          style={{
            fontSize: "14px",
            color: "blue",
            float: "right",
          }}
        >
          {this.state.userName}
        </Typography>
        <Typography
          style={{
            display: "inline",
            marginRight: "15px",
            fontSize: "13px",
            color: "grey",
            float: "right",
          }}
        >
          {this.getTimeDifference()}
        </Typography>
      </div>
    );
  }
}
export default withStyles(styles)(DiscussionChatComponent);
