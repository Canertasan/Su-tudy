import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import { Avatar, Tooltip } from "@material-ui/core";
import styles from "./../styles";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import "@firebase/auth";
import "./notesComp.css";
import StarBorderIcon from "@material-ui/icons/StarBorder";


class NotesComponent extends Component {
  state = {
    userName: null,
    imageURL: null,
  };

  componentDidMount = () => {
    this.getUserData();
  };

  getUserData = () => {
    firebase
      .database()
      .ref("users")
      .child(this.props.userID)
      .once("value")
      .then((data) => {
        if (data.val()) {
          this.setState({
            userName: data.val().username,
          });
        }
      });
  };

  getTimeDifference = () => {
    var date = new Date();
    var timestamp = date.getTime();
    var difference = timestamp - this.props.timestamp;
    var yearDifference = Math.floor(difference / 1000 / 60 / 60 / 24 / 30 / 12);
    if (yearDifference !== 0) {
      return yearDifference + " years ago";
    } else {
      var monthDifference = Math.floor(difference / 1000 / 60 / 60 / 24 / 30);
      if (monthDifference !== 0) {
        return monthDifference + " months ago";
      } else {
        var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        if (daysDifference !== 0) {
          return daysDifference + " days ago";
        } else {
          var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
          if (hoursDifference !== 0) {
            return hoursDifference + " hours ago";
          } else {
            var minDifference = Math.floor(difference / 1000 / 60);
            if (minDifference !== 0) {
              return minDifference + " minutes ago";
            } else {
              var secDifference = Math.floor(difference / 1000);
              return secDifference + " seconds ago";
            }
          }
        }
      }
    }
  };
  handleClick() {
    console.log("clicked", this.props.chatKey);
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div className="avatar-typo">
              <Tooltip title={this.state.userName}>
                <Avatar
                  alt={this.state.userName}
                  src="/broken-image.jpg"
                  className={classes.sutudyBlue}
                />
              </Tooltip>
              <Typography className={classes.heading}>
                {" "}
                {this.props.title}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                className="time"
              >
                {this.getTimeDifference()}
              </Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className="expansion-desc-note" style={{ width: "100vw" }}>
              <Typography>{this.props.description}</Typography>
              <Button
                variant="outlined"
                color="primary"
                href={this.props.url}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  left: "50%",
                  marginTop: "10px",
                  transform: "translateX(-50%)",
                }}
              >
                Preview Note

              </Button>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(NotesComponent);
