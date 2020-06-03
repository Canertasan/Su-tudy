import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import SutudyAutocomplete from "./SutudyAutocomplete";

const SutudyDialog = (props) => {
  return (
    <Dialog
      open={props.show}
      onClose={props.onHide}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"It seems you didn't select your courses"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This data will be used only for you to access the discussions and
          notes about your courses.
        </DialogContentText>
        <SutudyAutocomplete
          courses={props.courses}
          handleSelectedCourses={(_, sc) => props.handleSelectedCourses(_, sc)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onHide} color="primary">
          Cancel
        </Button>
        <Button onClick={props.handleSaveCourses} color="primary" autoFocus>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SutudyDialog;
