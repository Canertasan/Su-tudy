import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import ProfileButtonLoader from "./ProfileButtonLoader";
import sutudy from "../../images/study1.png";
// import logo from "../../components/logo.png";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { withRouter } from "react-router";
import SimpleMenu from "./SimpleMenu";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import firebase from "firebase";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

class SutudyNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      dropdown: false,
      forumDic: null,
      notesDic: null,
      searchWord: null,
      founded: [],
    };
  }

  gettingForum = async () => {
    await firebase
      .database()
      .ref("forums")
      .once("value")
      .then((data) => {
        this.setState({
          forumDic: data.val(),
        });
      });
  };

  gettingNotes = async () => {
    await firebase
      .database()
      .ref("notes")
      .once("value")
      .then((data) => {
        this.setState({
          notesDic: data.val(),
        });
      });
  };

  componentDidMount() {
    this.gettingForum();
    this.gettingNotes();
  }
  //we do not need to get extra query from firebase. Because those courses are
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.courses !== prevProps.courses) {
      this.setState({
        courses: this.props.courses,
      });
    }
  }

  // getting course name from array(basically indexing)
  gettingCourseName = (courseName) => {
    let splitString = courseName.split(" ");
    return splitString[0] + " " + splitString[1];
  };

  //getting correct url for dynamic routing
  routePath = (path, course) => {
    course = course.replace(" ", "-").toLowerCase();
    var lastPath = "/" + path + "/" + course;
    this.props.history.push(lastPath);
  };

  // when user click our logo, it should go main page
  returnHomePage = () => {
    this.props.history.push("/");
  };

  handleChangeTitle = (e) => {
    if (e.target.value !== "") {
      this.setState({
        searchWord: e.target.value.toLowerCase(),
      });
    } else {
      this.setState({
        searchWord: e.target.value.toLowerCase(),
      });
    }
  };

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
  handleMenuClick = async (url) => {
    this.props.history.replace(url);
    this.handleClose();
  };

  _handleKeyDown = async (e) => {
    this.handleChangeTitle(e);
    var arr = [];
    var description = "";
    var title = "";
    if (e.key === "Enter" && this.state.searchWord !== "") {
      // forum
      var dict = this.state.forumDic;
      for (var key in dict) {
        var valueOfDict = dict[key];
        for (var key2 in valueOfDict) {
          if (
            valueOfDict[key2]["description"] !== "" &&
            valueOfDict[key2]["description"] !== undefined
          ) {
            description = valueOfDict[key2]["description"].toLowerCase();
            title = valueOfDict[key2]["title"].toLowerCase();
            if (
              description.includes(this.state.searchWord) ||
              title.includes(this.state.searchWord)
            ) {
              var courseName = key.toLowerCase();
              courseName = courseName.replace(" ", "-");
              var url = "/forum/" + courseName + "/" + key2;
              var val = "Forum - " + valueOfDict[key2]["title"];
              arr.push([val, url]);
            }
          }
        }
      }
      // notes
      var dict = this.state.notesDic;
      for (var key in dict) {
        var valueOfDict = dict[key];
        for (var key2 in valueOfDict) {
          if (
            valueOfDict[key2]["description"] !== "" &&
            valueOfDict[key2]["description"] !== undefined
          ) {
            description = valueOfDict[key2]["description"].toLowerCase();
            title = valueOfDict[key2]["title"].toLowerCase();
            if (
              description.includes(this.state.searchWord) ||
              title.includes(this.state.searchWord)
            ) {
              var courseName = key.toLowerCase();
              courseName = courseName.replace(" ", "-");
              var url = "/notes/" + courseName + "/" + key2;
              var val = "Notes - " + valueOfDict[key2]["title"];
              arr.push([val, url]);
            }
          }
        }
      }
      this.setState({
        founded: arr,
      });
      this.handleClick(e);
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <AppBar position="fixed" style={{ backgroundColor: "#FFFFFF" }}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <img
              src={sutudy}
              onClick={() => this.returnHomePage()}
              className={classes.logo}
              alt={""}
            />
          </Typography>
          <div>
            {(this.state.courses) ? this.state.courses.map((_course, _index) => {
              _course = this.gettingCourseName(_course);
              if (
                _course.charAt(_course.length - 1) !== "L" &&
                _course.charAt(_course.length - 1) !== "R"
              )
                return (
                  <div key={_index} style={{ float: "left" }}>
                    <SimpleMenu props={_course} routePath={this.routePath} />
                  </div>
                );
              else {
                return null;
              }
            }): null}
          </div>
          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.paddingR}>
              <div className={classes.sutudyBlue}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                {this.props.isSignedIn ? (
                  <InputBase
                    onKeyDown={this._handleKeyDown}
                    placeholder="Search Forum or Notes..."
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{
                      "aria-label": "search",
                    }}
                    //className={classes.sutudyBlue}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
              style={{
                marginTop: "35px",
                borderRadius: "50%",
                minWidth: "15.6em !important",
              }}
            >
              {this.state.founded.length === 0 ? (
                <MenuItem>There isn't any match. Try again</MenuItem>
              ) : (
                this.state.founded.map((_founded, _index) => {
                  return (
                    <div key={_index} style={{ float: "left" }}>
                      <MenuItem
                        onClick={() => this.handleMenuClick(_founded[1])}
                      >
                        {" "}
                        {_founded[0]}
                      </MenuItem>
                    </div>
                  );
                })
              )}
            </Menu>
          </div>
          <div className={classes.sectionDesktop}>
            <ProfileButtonLoader
              toggleSpotify={() => this.props.toggleSpotify()}
              signOut={() => this.props.signOut()}
              isSignedIn={this.props.isSignedIn}
              username={this.props.username}
            />
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(withStyles(styles)(SutudyNavbar));
