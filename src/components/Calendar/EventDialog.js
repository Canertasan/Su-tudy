import React, { Component } from "react";
//import Dialog from "@material-ui/core/Dialog";
import Calendar from "./Calendar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

export default class EventDialog extends React.Component {
  constructor() {
    super();
  }

  // handleClose = () => {
  //   this.setState({
  //     open: !this.state.open,
  //   });
  // };
  render() {
    return (
      <div>
        <div>
          <Dialog
            open={this.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {/* Event: {this.state.title} */}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {/* {this.state.start} */}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.removeEvent} color="primary">
                Yes
              </Button>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                No
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}
