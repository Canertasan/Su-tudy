import React, { Component } from "react";
import firebase from "firebase";
import DiscussionComponent from "./DiscussionComponent";
import "@firebase/auth";
import "./../NotesComp/notesComp.css";
import "./forum.css";
import { Typography } from "@material-ui/core";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import AddTopic from "./AddTopic";
import { withRouter } from "react-router-dom";
import Favorites from "./Favorites";
import SideMenu from "./SideMenu";
class Discussions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseName: null,
      courses: [],
      userid: null,
      forumData: [],
      favoriteData: [],
      myTopicData: [],
      image: null,
      url: "",
      storage: firebase.storage(),
      previewImgStatus: "hide-image",
      discData: {},
      favoriteKeys: {},
      myTopicKeys: {},
    };
  }

  componentDidMount = () => {
    console.log(`ismount`);
    this.setState({ userid: this.props.userID });
    this.setState({ courses: this.props.courses });
    console.log(`ismountfinsh`);
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
      if (this.isUserCourse(urlCourse)) {
        this.setState({ courseName: urlCourse });
        this.getData(urlCourse);
      } else {
        this.setState({ courseName: null });
        this.props.history.push("/not-found");
      }
    }
    if (this.props.userID !== this.state.userid) {
      this.setState({ userid: this.props.userID });
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
  addFavorite = async (chatKey, titleEntred) => {
    console.log("add fav", chatKey, titleEntred);
    await firebase
      .database()
      .ref("users")
      .child(this.props.userID)
      .child("favorites")
      .child(this.state.courseName)
      .update({
        [chatKey]: {
          title: titleEntred,
        },
      });
    window.location.reload();

    //this.updateFavorites();
  };
  updateFavorites = async () => {
    var a;
    await firebase
      .database()
      .ref("users")
      .child(this.props.userID)
      .child("favorites")
      .once("value")
      .then((data) => {
        if (data.val) {
          console.log("favdata", data.val());
          a = data.val();
        }
      });
    this.setState({ favoriteData: a });
  };
  getData = async (course) => {
    var userID;
    var userData = {};
    await firebase
      .database()
      .ref("forums")
      .child(course)
      .once("value")
      .then((data) => {
        userData = data.val();
      });
    if (userData !== undefined && userData && userData !== {}) {
      var keys = Object.keys(userData);
      var secondaryKeys = Object.keys(userData[keys[0]]);
      var forumData = [];
      let databaseRef = firebase.database().ref("users");
      for (var i = keys.length - 2; i >= 0; i--) {
        userID = userData[keys[i]][secondaryKeys[4]];
        console.log("user index", userData[index]);
        var index = keys[i];
        forumData.push([
          userData[index][secondaryKeys[0]],
          userData[index][secondaryKeys[1]],
          userData[index][secondaryKeys[2]],
          userData[index][secondaryKeys[3]],
          userData[index][secondaryKeys[4]],
          index,
          userData[index][secondaryKeys[5]],
        ]);
      }
      this.setState({ forumData });
      this.handleFavorites();
      this.handleTopics();
    } else {
      this.setState({ forumData: null, favoriteData: null });
    }
  };
  handleFavorites = () => {
    var favorites = this.props.favorites;
    if (favorites !== null && favorites !== undefined) {
      var keys = Object.keys(favorites);
      var favoriteData = [];
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] === this.state.courseName) {
          var secondaryKeys = Object.keys(favorites[keys[i]]);
          for (var a = 0; a < secondaryKeys.length; a++) {
            favoriteData.push([
              secondaryKeys[a],
              favorites[keys[i]][secondaryKeys[a]].title,
            ]);
          }
        }
        this.setState({ favoriteData });
      }
    }
  };

  handleTopics = () => {
    if (this.props.myTopics !== null) {
      console.log(`mytopics`, this.props.myTopics);
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
    });
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
            type={"My Topics"}
          ></Favorites>
          <Favorites
            favorited={this.state.favoriteData}
            style={{ margin: "30px" }}
            type={"Favorites"}
          ></Favorites>
          <div className="new-topic-div">
            <AddTopic
              userID={this.props.userID}
              username={this.props.username}
            />
          </div>
        </div>
        <div className="root">
          <div className="genelbirdiv">
            {this.state.forumData ? (
              this.state.forumData.map((_forum, _index) => {
                return (
                  <div className="item_element" key={_index}>
                    <DiscussionComponent
                      handleFavClick={this.addFavorite}
                      title={_forum[3]}
                      description={_forum[1]}
                      userID={_forum[4]}
                      timestamp={_forum[2]}
                      chats={_forum[0]}
                      userName={_forum[6]}
                      courseName={this.props.courseName}
                      saveDiscussion={this.saveDiscussion}
                      chatKey={_forum[5]}
                      onClick={() => {
                        this.handleForumClick(_forum);
                      }}
                    />
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
export default withRouter(Discussions);
