import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ForumIcon from "@material-ui/icons/Forum";
import InfoIcon from "@material-ui/icons/Info";
import NotesIcon from "@material-ui/icons/Notes";
import Divider from "@material-ui/core/Divider";
import { withRouter } from "react-router";
class SideMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  handleForumClick() {
    var data = this.getDataFromUrl();
    console.log("data", data);

    if (data !== "forum") {
      var lastPath = "/" + "forum" + "/" + this.getCourseNameFromUrl();
      this.props.history.push(lastPath);
    }
  }
  getDataFromUrl = () => {
    var arr = window.location.href.split("/");
    console.log("arrSM", arr);
    var extractedCourseName = arr[3];
    return extractedCourseName;
  };
  getCourseNameFromUrl = () => {
    var arr = window.location.href.split("/");
    var extractedCourseName = arr[4];
    return extractedCourseName;
  };
  handleNotesClick() {
    var data = this.getDataFromUrl();
    if (data !== "notes") {
      var lastPath = "/" + "notes" + "/" + this.getCourseNameFromUrl();
      this.props.history.push(lastPath);
    }
  }
  render() {
    return (
      <List>
        <h3>{this.props.courseName}</h3>
        <Divider />
        <ListItem
          onClick={() => this.handleForumClick()}
          button
          key={"Forum"}
          // onClick={this.props.handleForumClick()}
        >
          <ListItemIcon>
            <ForumIcon />
          </ListItemIcon>
          <ListItemText primary={"Forum"} />
        </ListItem>
        <Divider />
        <ListItem onClick={() => this.handleNotesClick()} button key={"Notes"}>
          <ListItemIcon>
            <NotesIcon />
          </ListItemIcon>
          <ListItemText primary={"Notes"} />
        </ListItem>
        <Divider />
      </List>
    );
  }
}

export default withRouter(SideMenu);
