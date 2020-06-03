import React, { Component } from "react";
import firebase from "firebase";
import "@firebase/auth";
import "./../NotesComp/notesComp.css";
import "./notesComp.css";
import "./../DiscussionComp/forum.css";
import { Typography } from "@material-ui/core";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import AddNote from "./AddNote";
import { withRouter } from "react-router-dom";
import Favorites from "./../DiscussionComp/Favorites";
import SideMenu from "./../DiscussionComp/SideMenu";
import NotesComponent from "./NotesComponent";

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseName: null,
      courses: [],
      userid: null,
      userData: {},
      noteData: [],
      image: null,
      storage: firebase.storage(),
      previewImgStatus: "hide-image",
      favoriteData: [],
      myTopicData: [],
      url: "",
      discData: {},
      favoriteKeys: {},
      myTopicKeys: {},
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
    this.setState({ userid: this.props.userID });
    this.setState({ courses: this.props.courses });
  };

  getCourseNameFromUrl = () => {
    var arr = window.location.href.split("/");
    var extractedCourseName = arr[4].toUpperCase().replace("-", " ");
    return extractedCourseName;
  };
  getCourseNameInfo = () => {
    var arr = window.location.href.split("/");
    var extractedCourseName = arr[arr.length - 1];
    return extractedCourseName;
  };
  componentDidUpdate = (prevProps) => {
    var urlCourse = this.getCourseNameFromUrl();
    if (
      this.state.courseName !== urlCourse &&
      !this.isUserCourse(this.state.courseName) &&
      this.state.courses !== undefined
    ) {
      console.log("AA");
      if (this.isUserCourse(urlCourse)) {
        this.setState({ courseName: urlCourse });
        this.getNoteData(urlCourse);
      } else {
        this.setState({ courseName: null });
        this.props.history.push("/not-found");
      }
    }
  };
  gettingCourseName = (courseName) => {
    let splitString = courseName.split(" ");
    return splitString[0] + " " + splitString[1];
  };
  isUserCourse = (course) => {
    if (
      this.state.courses !== undefined &&
      this.state.courses.length &&
      course !== null &&
      course !== undefined
    ) {
      var tempArr = this.state.courses;
      for (var i = 0; i < tempArr.length; i++) {
        tempArr[i] = this.gettingCourseName(tempArr[i]);
        if (tempArr[i] === course) {
          return true;
        }
      }
      return false;
    }
    return false;
  };
  getNoteData = async (course) => {
    var userID;
    var userData = {};
    await firebase
      .database()
      .ref("notes")
      .child(course)
      .once("value")
      .then((data) => {
        userData = data.val();
      });
    if (userData !== undefined && userData && userData !== {}) {
      var keys = Object.keys(userData);
      var secondaryKeys = Object.keys(userData[keys[0]]);
      var noteData = [];
      for (var i = keys.length - 2; i >= 0; i--) {
        noteData.push([
          userData[keys[i]][secondaryKeys[0]],
          userData[keys[i]][secondaryKeys[1]],
          userData[keys[i]][secondaryKeys[2]],
          userData[keys[i]][secondaryKeys[3]],
          userData[keys[i]][secondaryKeys[4]],
          userData[keys[i]][secondaryKeys[5]],
          keys[i],
        ]);
        this.setState({ noteData });
      }
    } else {
      this.setState({ noteData: null });
    }
  };

  updateFavorites = () => {
    //TODO
  };
  handleTopics = () => {
    if (this.props.myTopics !== null) {
      console.log(this.props.myTopics);
      var myTopics = this.props.myTopics;
      var keys = Object.keys(myTopics);
      var myTopicData = [];
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] === this.state.courseName) {
          console.log("mytopics", myTopics[keys[i]]);
          var secondaryKeys = Object.keys(myTopics[keys[i]]);
          for (var a = 0; a < secondaryKeys.length; a++) {
            myTopicData.push([
              secondaryKeys[a],
              myTopics[keys[i]][secondaryKeys[a]].title,
            ]);
          }
        }
        this.setState({ myTopicData });
      }
    }
  };
  saveDiscussion = async (msg, chatKey) => {
    var counter = null;
    var date = new Date();
    await firebase
      .database()
      .ref("forums")
      .child(this.props.courseName)
      .child(chatKey)
      .child("chats")
      .once("value")
      .then((data) => {
        if (data.val() !== null) {
          counter = data.val().last_entry_count_chat + 1;
        } else {
          counter = 0;
          firebase
            .database()
            .ref("forums")
            .child(this.props.courseName)
            .child(chatKey)
            .child("chats")
            .set({ last_entry_count_chat: 0 });
        }
      });
    await firebase
      .database()
      .ref("forums")
      .child(this.props.courseName)
      .child(chatKey)
      .child("chats")
      .update({
        last_entry_count_chat: counter,
        [counter]: {
          content: msg,
          timestamp: date.getTime(),
          userID: this.state.userid,
        },
      });
  };
  handleForumClick = (_forum) => {
    var lastPath = "/forum/" + this.getCourseNameInfo() + "/" + _forum[5];
    this.props.history.push({
      pathname: lastPath,
      state: {
        description: _forum[1],
        chats: _forum[0],
        chatKey: _forum[5],
        title: _forum[3],
        userName: _forum[6],
        userID: this.state.userID,
        timestamp: _forum[2],
      },
    });
  };
  directNote = (_note) => {
    var lastPath = "/notes/" + this.getCourseNameInfo() + "/" + _note[6];
    // this.props.history.push(lastPath);
    return lastPath;
  };
  render() {
    return (
      <div style={{ display: "inline" }}>
        <div className="side-menu-div">
          <SideMenu courseName={this.getCourseNameFromUrl()}></SideMenu>
        </div>
        <div className="favorites-div">
          <Favorites
            favorited={this.state.myTopicData}
            favoriteKeys={this.state.myTopicKeys}
            type={"My Notes"}
          ></Favorites>
          <div className="new-topic-div">
            <AddNote userID={this.props.userID} />
          </div>
        </div>
        <div className="root">
          <div className="notes_div">
            {this.state.noteData ? (
              this.state.noteData.map((_note, _index) => {
                return (
                  <div className="item_element_notes" key={_index}>
                    <NotesComponent
                      url={this.directNote(_note)}
                      key={_index}
                      title={_note[4]}
                      description={_note[0]}
                      userID={_note[5]}
                      timestamp={_note[3]}
                      imgURL={_note[1]}
                    />{" "}
                  </div>
                );
              })
            ) : (
              <div className="no-note-diss">
                <Typography variant="h5" gutterBottom>
                  In this course there isn't forum discussions yet
                </Typography>
                <SentimentVeryDissatisfiedIcon />
              </div>
            )}
          </div>
        </div>
        <div style={{ marginBottom: "8em", width: "100%", height: "10px" }}>
          <p> </p>
        </div>
      </div>
    );
  }
}
export default withRouter(Notes);
