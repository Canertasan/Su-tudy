import React, { Component } from "react";
import SideMenu from "../DiscussionComp/SideMenu";
import firebase from "firebase";
import { Typography } from "@material-ui/core";

class NoteComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      description: null,
      title: null,
      userid: null,
      noteImg: null,
      timestamp: null,
      userName: null,
    }
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
    var noteImg;
    console.log("cc", course, chatkey);
    await firebase
      .database()
      .ref("notes")
      .child(course)
      .child(chatkey)
      .once("value")
      .then((data) => {
        descriptionData = data.val().description;
        userid = data.val().userID;
        title = data.val().title;
        timeStamp = data.val().timestamp;
        noteImg = data.val().noteimage;
      });
    if (descriptionData !== undefined && descriptionData) {
      this.setState({
        description: descriptionData,
        title: title,
        noteImg: noteImg,
      });
      this.getUserData(userid);
    }
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

  
  render() {
    return (
      <div style={{ display: "inline" }}>
        <div className="side-menu-div">
          <SideMenu courseName={this.getCourseNameFromUrl()}></SideMenu>
        </div>
        <div className="img-div">
          <div className="new-img-div">
            <iframe src={this.state.noteImg} height="550" width="650"></iframe>
          </div>
        </div>
        <div className="root">
          <div className="genelbirdiv">
            <div className="item_element_notes_img">
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
            </div>
          </div>
        </div>
        <div style={{ marginBottom: "8em", width: "100%", height: "10px" }}>
          <p> </p>
        </div>
      </div>
    );
  }
}

export default NoteComponent;
