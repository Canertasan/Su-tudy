import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import { Typography } from "@material-ui/core";
import "@firebase/auth";
import firebase from "firebase";
import "../forum.css";
import { withRouter } from "react-router-dom";
import "./disscussionChat.css";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import DiscussionChatComponent from "./DiscussionChatComponent";
import SideMenu from "../SideMenu";
import Favorites from "./../Favorites";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import AddAnswer from "./AddAnswer";
import ChatBox from "./DiscussionChatTextBox";
import Divider from "@material-ui/core/Divider";

class DiscussionChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      userName: null,
      description: null,
      userID: null,
      chatKey: null,
      title: null,
    };
  }
  componentDidMount = () => {
    this.setState({
      userID: this.props.userID,
      chatKey: this.getChatKeyNameFromUrl(),
    });
    this.getData(this.getCourseNameFromUrl(), this.getChatKeyNameFromUrl());
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.chat !== undefined && this.props.chat !== prevProps.chat) {
      this.getData(this.getCourseNameFromUrl(), this.getChatKeyNameFromUrl());
    }
    if (this.state.chatKey !== this.getChatKeyNameFromUrl()) {
      this.setState({
        chatKey: this.getChatKeyNameFromUrl(),
      });
      this.getData(this.getCourseNameFromUrl(), this.getChatKeyNameFromUrl());
    }
  };
  getData = async (course, chatkey) => {
    var descriptionData;
    var title;
    var userid;
    var timeStamp;
    var chats;
    console.log("cc", course, chatkey);
    await firebase
      .database()
      .ref("forums")
      .child(course)
      .child(chatkey)
      .once("value")
      .then((data) => {
        descriptionData = data.val().description;
        userid = data.val().userID;
        title = data.val().title;
        timeStamp = data.val().timestamp;
        chats = data.val().chats;
      });
    if (descriptionData !== undefined && descriptionData) {
      this.setState({
        description: descriptionData,
        title: title,
        timestamp: timeStamp,
      });
      this.updateChats(chats);
      this.getUserData(userid);
    }
  };
  getTimeDifference = (timestamp) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(timestamp);
  };
  updateChats = (chat) => {
    if (chat !== undefined && chat !== null) {
      var keys = Object.keys(chat);
      var secondaryKeys = Object.keys(chat[keys[0]]);
      var chatData = [];
      for (var i = keys.length - 2; i >= 0; i--) {
        chatData.push([
          chat[keys[i]][secondaryKeys[0]],
          chat[keys[i]][secondaryKeys[1]],
          chat[keys[i]][secondaryKeys[2]],
        ]);
      }
      this.setState({ chats: chatData });
      console.log("chatData", chatData);
    }
  };
  getCourseNameFromUrl = () => {
    var arr = window.location.href.split("/");
    var extractedCourseName = arr[4].toUpperCase().replace("-", " ");
    return extractedCourseName;
  };
  getChatKeyNameFromUrl = () => {
    var arr = window.location.href.split("/");
    var chatkey = arr[5].toUpperCase().replace("-", " ");
    return chatkey;
  };
  getUserData = async (userid) => {
    if (userid !== undefined)
      await firebase
        .database()
        .ref("users")
        .child(userid)
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
    const { classes } = this.props;
    return (
      <div style={{ display: "inline" }}>
        <div className="side-menu-div">
          <SideMenu>{this.getChatKeyNameFromUrl()}</SideMenu>
        </div>
        <div className="favorites-div">
          <div className="new-topic-div">
            <AddAnswer
              props={this.state.userID}
            />
          </div>
        </div>
        <div className="root">
          <div className="item_element_chat">
            <Typography style={{ display: "inline", fontWeight: "bold" }}>
              {this.state.description !== undefined
                ? this.state.title
                : ""}
              {/* {this.state.title.toUpperCase()} */}
            </Typography>
            <Typography style={{ marginTop: "20px", marginBottom: "10px" }}>
              {this.state.description !== undefined
                ? this.state.description
                : ""}
            </Typography>
            <StarBorderIcon
              style={{ color: "black", fontSize: "18px" }}
              onClick={() => this.handleClick()}
            ></StarBorderIcon>
            <Typography
              style={{
                display: "inline",
                fontSize: "14px",
                color: "blue",
                float: "right",
              }}
            >
              {this.state.userName}
            </Typography>
            <Typography
              className="date-typography"
              style={{ marginRight: "15px", fontSize: "12px", float: "right" }}
            >
              {this.getTimeDifference(this.state.timestamp)}
            </Typography>
            <Divider></Divider>
            {this.state.chats !== undefined ? (
              this.state.chats.map((_chat, _index) => {
                return (
                  <div>
                    <DiscussionChatComponent
                      description={_chat[0]}
                      userID={_chat[2]}
                      timestamp={_chat[1]}
                      key={_index}
                    ></DiscussionChatComponent>
                    <Divider style={{ width: "100%" }}></Divider>
                  </div>
                );
              })
            ) : (
                <p>No reply for this subject.</p>
              )}{" "}
          </div>
        </div>
        <div style={{ marginBottom: "8em", width: "100%", height: "10px" }}>
          <p> </p>
        </div>
      </div>
    );
  }
}

export default withRouter(DiscussionChat);
