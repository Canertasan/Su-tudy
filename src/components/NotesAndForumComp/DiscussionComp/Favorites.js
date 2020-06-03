import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import { Avatar, Tooltip } from "@material-ui/core";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Divider from "@material-ui/core/Divider";

import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import "../NotesComp/notesComp.css";
class Favorites extends Component {
  state = {
    itemData: null,
  };
  componentWillMount = () => {};
  componentDidUpdate = (prevProps) => {
    if (
      this.props.favorited !== undefined &&
      this.props.favorited !== [] &&
      prevProps.favorited !== this.props.favorited
    ) {
      this.setState({ itemData: this.props.favorited });
      console.log("this", this.props.favorited);
    }
  };
  getCourseNameInfo = () => {
    var arr = window.location.href.split("/");
    var extractedCourseName = arr[arr.length - 1];
    return extractedCourseName;
  };
  handleClick = (chatKey) => {
    console.log("chatkey", chatKey);
    var lastPath = "/forum/" + this.getCourseNameInfo() + "/" + chatKey;
    this.props.history.push({
      pathname: lastPath,
    });
  };
  getItemCount = () => {
    if (this.state.itemData !== undefined && this.state.itemData !== null) {
      console.log("leng1", this.state.itemData);
      var keys = Object.keys(this.state.itemData);
      return keys.length;
    } else {
      return "0";
    }
  };
  getFavoriteTitle = () => {};
  render() {
    return (
      <div>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div style={{ display: "inline" }}>
              <Typography> {this.props.type} </Typography>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                className="time"
                style={{ display: "inline" }}
              >
                {this.getItemCount() +
                  " " +
                  (this.props.type === "Favorites" ? "Favs" : "Topics")}
              </Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className="expansion-desc-note" style={{ width: "100vw" }}>
              {this.state.itemData ? (
                this.state.itemData.map((_item, _index) => {
                  return (
                    <div
                      key={_index}
                      onClick={() => this.handleClick(_item[0])}
                      style={{ margin: "10px", cursor: "pointer" }}
                      className="favorite-div"
                    >
                      <StarBorderIcon
                        style={{
                          display: "inline",
                          fontSize: "18px",
                          marginTop: "10px",
                        }}
                      ></StarBorderIcon>
                      <Typography
                        className="click-typ"
                        style={{
                          display: "inline",
                          marginTop: "10px",
                          marginLeft: "15px",
                        }}
                      >
                        {_item[1]}
                      </Typography>
                      <Divider
                        className="classes"
                        style={{ light: "true", backgroundColor: "black" }}
                      ></Divider>
                    </div>
                  );
                })
              ) : (
                <Typography variant="h7" gutterBottom>
                  Nothing Added
                </Typography>
              )}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withRouter(Favorites);
