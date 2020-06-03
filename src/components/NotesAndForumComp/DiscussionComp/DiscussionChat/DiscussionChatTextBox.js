import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import TextField from "@material-ui/core/TextField";
import Send from "@material-ui/icons/Send";
class DiscussionChatTextBox extends Component {
  state = {
    msg: "",
  };
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField
          placeholder="Bir mesaj girin"
          onKeyUp={(e) => this.userTyping(e)}
          id={"chattextbox" + this.props.chatKey}
          className={classes.chatTextBox}
        ></TextField>
        <Send onClick={this.saveMessage} className={classes.sendButtn}></Send>
      </div>
    );
  }
  userTyping = (msg) => {
    msg.keyCode === 13
      ? this.saveMessage()
      : this.setState({ msg: msg.target.value });
    document.getElementById("chattextbox" + this.props.chatKey).placeholder =
      "";
  };
  saveMessage = () => {
    this.props.saveDiscMessage(this.state.msg, this.props.chatKey);
    document.getElementById("chattextbox" + this.props.chatKey).value = "";
  };
}

export default withStyles(styles)(DiscussionChatTextBox);
