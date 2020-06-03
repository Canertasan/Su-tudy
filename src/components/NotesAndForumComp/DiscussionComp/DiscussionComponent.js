import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import "./forum.css";
import { Typography } from "@material-ui/core";
import { Avatar, Tooltip } from "@material-ui/core";
import firebase from "firebase";
import "@firebase/auth";
import "../NotesComp/notesComp.css";
import Divider from "@material-ui/core/Divider";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
/*
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

import DiscussionChatComponent from "./DiscussionChat/DiscussionChatComponent";
import DiscussionChatTextBox from "./DiscussionChat/DiscussionChatTextBox";*/

class DiscussionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      chats: [],
      courseName: null,
    };
  }
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
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(this.props.timestamp);
  };
  handleClick = () => {
    console.log("clicked", this.props.chatKey);
    this.props.handleFavClick(this.props.chatKey, this.props.title);
  };
  updateFavorites = () => {
    //TODO
  };
  getCourseNameFromUrl = () => {
    var arr = window.location.href.split("/");
    console.log("arr", arr);
    var extractedCourseName = arr[4].toUpperCase().replace("-", " ");
    console.log("ext Coursename", extractedCourseName);
    return extractedCourseName;
  };
  render() {
    const { classes } = this.props;
    /*start*/

    return (
      <div>
        <Typography
          style={{ display: "inline", fontWeight: "bold" }}
          onClick={() => {
            this.props.onClick(this.props._forum);
          }}
        >
          {this.props.title.toUpperCase()}
        </Typography>

        <Typography
          className="description-typography"
          style={{ marginTop: "20px", marginBottom: "10px" }}
          onClick={() => {
            this.props.onClick(this.props._forum);
          }}
        >
          {this.props.description.length > 145
            ? this.props.description.substring(0, 145) + "..."
            : this.props.description}
        </Typography>
        <div style={{ display: "inline" }}>
          {/* <ReplyAllIcon
            style={{ fontSize: "18px", marginRight: "20px" }}
          ></ReplyAllIcon> */}

          <StarBorderIcon
            style={{ color: "black", fontSize: "18px" }}
            onClick={() => this.handleClick()}
          ></StarBorderIcon>
          <div style={{ float: "right" }}>
            <Typography
              style={{
                display: "inline",
                marginRight: "15px",
                fontSize: "13px",
              }}
            >
              {this.getTimeDifference()}
            </Typography>
            <Typography className="username-typography">
              {this.props.userName}
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DiscussionComponent);
