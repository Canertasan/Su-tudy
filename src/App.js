import React, { Component } from "react";
import "./App.css";
import SutudyNavbar from "./components/SutudyNavbar/SutudyNavbar";
import firebase from "firebase";
import dbConfig from "./db";
import SutudyDialog from "./components/SelectCourseModal/SutudyDialog";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Discussions from "./components/NotesAndForumComp/DiscussionComp/Discussions";
import Notes from "./components/NotesAndForumComp/NotesComp/Notes";
import HomePage from "./components/HomePage";
import NotFound from "./components/NotFound";
import SutudySpotifyRedirect from "./components/SpotifyComp/SutudySpotifyRedirect";
import SpotifyAuthorizationLink from "./components/SpotifyComp/SpotifyAuthorization";
import SutudySpotify from "./components/SpotifyComp/SutudySpotify";
import DiscussionChat from "./components/NotesAndForumComp/DiscussionComp/DiscussionChat/DiscussionChat";
import Login from "./components/Login/Login";
import NotePage from "./components/NotesAndForumComp/NotesComp/NotePage";

class App extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(dbConfig);
    this.state = {
      isSignedIn: null,

      userID: null,
      username: null,
      userData: {},
      modalShow: false,
      allCourses: null,
      allInstructors: null,
      allPlaces: null,
      courseOptions: [],
      selectedCourses: [],
      token: null,
      favorites: {},
      myTopics: {},
      authorizationLink: null,
      isSpotifyOn: true,
      myNotes: {},
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.handleAuthState(!!user);
      this.handleUserID(user.uid);
      this.initiateUser(user);
      this.getUserData(user);
    });
  }

  handleAuthState = (state) => {
    this.setState({
      isSignedIn: state,
    });
  };

  handleUserID = (userID) => {
    this.setState({
      userID: userID,
    });
  };

  handleSelectedCourses = (event, selectedCourses) => {
    console.log(selectedCourses);
    this.setState({
      selectedCourses: selectedCourses,
    });
  };

  handleSaveCourses = () => {
    console.log(this.state.selectedCourses);
    firebase
      .database()
      .ref("users")
      .child(this.state.userID)
      .update({
        courses: this.state.selectedCourses,
      })
      .then(() => {
        this.setModalShow(false);
      })
      .then(() => {
        document.location.replace("./");
      });
  };

  setModalShow = (state) => {
    this.setState({
      modalShow: state,
    });
  };

  populateAllCourseData = async () => {
    await firebase
      .database()
      .ref("courses")
      .once("value")
      .then((data) => {
        this.setState({
          allCourses: data.val(),
        });
      });
    await firebase
      .database()
      .ref("instructors")
      .once("value")
      .then((data) => {
        this.setState({
          allInstructors: data.val(),
        });
      });
    await firebase
      .database()
      .ref("places")
      .once("value")
      .then((data) => {
        this.setState({
          allPlaces: data.val(),
        });
      });

    let courseOptTemp = [];
    this.state.allCourses.forEach((_course) => {
      _course.classes.forEach((_class) => {
        if (_class.type === "") {
          _class.sections.forEach((_section) => {
            let courseName =
              _course.code +
              " - " +
              _section.group +
              " - " +
              _course.name +
              " - " +
              _section.crn;
            courseOptTemp = [...courseOptTemp, courseName];
          });
        } else {
          _class.sections.forEach((_section) => {
            let courseName =
              _course.code +
              _class.type +
              " - " +
              _section.group +
              " - " +
              _course.name +
              " - " +
              _section.crn;
            courseOptTemp = [...courseOptTemp, courseName];
          });
        }
      });
    });
    this.setState({
      courseOptions: courseOptTemp,
    });
  };

  getUserData = (user) => {
    firebase
      .database()
      .ref("users")
      .child(user.uid)
      .once("value")
      .then((data) => {
        console.log("dataVAl", data.val());
        this.setState(
          {
            userData: data.val(),
          },
          () => {
            console.log(this.state.userData);
            if (
              this.state.userData !== {} &&
              this.state.userData !== null &&
              this.state.userData.tokenExpiresIn !== null &&
              this.state.userData.tokenExpiresIn !== undefined
            ) {
              if (this.state.userData.tokenExpiresIn <= Date.now()) {
                window.location.replace(SpotifyAuthorizationLink());
              } else {
                console.log(
                  (this.state.userData.tokenExpiresIn - Date.now()) / 1000 / 60,
                  "dakika sonra token yenilenecek"
                );
                setTimeout(() => {
                  window.location.replace(SpotifyAuthorizationLink());
                }, this.state.userData.tokenExpiresIn - Date.now());
              }
            }
          }
        );
      });
  };

  initiateUser = async (user) => {
    let databaseRef = firebase.database().ref("users").child(user.uid);
    await databaseRef
      .child("username")
      .once("value")
      .then((data) => {
        if (data.val()) {
          console.log("There is some data:", data.val());
          databaseRef
            .child("courses")
            .once("value")
            .then((courses) => {
              if (!courses.val()) {
                this.populateAllCourseData().then(() => {
                  this.setModalShow(true);
                });
              }
            });
        } else {
          databaseRef.update({
            username: user.displayName,
          });
          this.populateAllCourseData().then(() => {
            this.setModalShow(true);
          });
        }
      });
    await databaseRef
      .child("username")
      .once("value")
      .then((data) => {
        if (data.val) {
          console.log("username", data.val());

          this.setState({ username: data.val() });
        }
      });
    await databaseRef
      .child("favorites")
      .once("value")
      .then((data) => {
        if (data.val) {
          console.log("fav", data.val());

          this.setState({ favorites: data.val() });
        }
      });

    await databaseRef
      .child("topics")
      .once("value")
      .then((data) => {
        if (data.val) {
          console.log("topics", data.val());
          this.setState({ myTopics: data.val() });
        }
      });
    await databaseRef
      .child("notes")
      .once("value")
      .then((data) => {
        if (data.val) {
          console.log("notes", data.val());
          this.setState({ myNotes: data.val() });
        }
      });
  };

  toggleSpotify = async () => {
    this.setState({ isSpotifyOn: !this.state.isSpotifyOn });
  };

  signOut = async () => {
    firebase.auth().signOut();
    this.setState({
      isSpotifyOn: false,
    });
  };

  closeSpotify = () => {
    this.setState({ isSpotifyOn: false });
  };

  render() {
    return (
      <div>
        <Router>
          <SutudyDialog
            show={this.state.modalShow}
            handleSaveCourses={() => this.handleSaveCourses()}
            onHide={() => this.setModalShow(false)}
            courses={this.state.courseOptions}
            handleSelectedCourses={(e, sc) => this.handleSelectedCourses(e, sc)}
          />
          <SutudyNavbar
            isSignedIn={this.state.isSignedIn}
            toggleSpotify={() => this.toggleSpotify()}
            signOut={() => this.signOut()}
            username={this.state.userData ? this.state.userData.username : ""}
            courses={this.state.userData ? this.state.userData.courses : ""}
          />
          <SutudySpotify
            isSpotifyOn={this.state.isSpotifyOn}
            userID={this.state.userID}
            token={
              this.state.userData !== null ? this.state.userData.token : null
            }
          />
          <Switch>
            <Route
              path="/"
              exact
              component={() => (
                <HomePage
                  token={
                    this.state.userData !== null
                      ? this.state.userData.token
                      : null
                  }
                  user={this.state.userData}
                  userID={this.state.userID}
                  userSignedIn={this.state.isSignedIn}
                />
              )}
            />
            <Route
              path="/login"
              exact
              component={() => <Login userSignedIn={this.state.isSignedIn} />}
            />
            <Route
              path="/forum/:courseName/:chatKey"
              component={() => (
                <DiscussionChat
                  courses={
                    this.state.userData ? this.state.userData.courses : ""
                  }
                  userID={this.state.userID}
                />
              )}
            />
            <Route
              path="/forum/:courseName"
              component={() => (
                <Discussions
                  courses={
                    this.state.userData ? this.state.userData.courses : ""
                  }
                  username={this.state.username}
                  userID={this.state.userID}
                  favorites={this.state.favorites}
                  myTopics={this.state.myTopics}
                />
              )}
            />
            <Route
              path="/notes/:courseName/:chatKey"
              component={() => (
                <NotePage
                  courses={
                    this.state.userData ? this.state.userData.courses : ""
                  }
                  userID={this.state.userID}
                  myNotes={this.state.myNotes}
                />
              )}
            />
            <Route
              path="/notes/:courseName"
              component={() => (
                <Notes
                  courses={
                    this.state.userData ? this.state.userData.courses : ""
                  }
                  userID={this.state.userID}
                />
              )}
            />
            <Route
              path="/callback"
              component={() => (
                <SutudySpotifyRedirect userID={this.state.userID} />
              )}
            />
            <Route path="*" component={NotFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
