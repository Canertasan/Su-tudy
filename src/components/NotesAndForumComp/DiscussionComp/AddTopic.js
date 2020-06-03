import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import firebase from "firebase";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import "./forum.css";
import AddIcon from "@material-ui/icons/Add";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs(props) {
  const [content, setContent] = useState(0);
  const [titleEntred, settitleEntred] = useState(0);

  const handleChangeContent = (event) => {
    setContent(event.target.value);
  };

  const handleChangeTitle = (event) => {
    settitleEntred(event.target.value);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const getCourseNameFromUrl = () => {
    var arr = window.location.href.split("/");
    var extractedCourseName = arr[arr.length - 1]
      .toUpperCase()
      .replace("-", " ");
    return extractedCourseName;
  };
  const handleClose = async () => {
    //firebase integration
    var counter = null;
    var courseName = getCourseNameFromUrl();
    var date = new Date();
    console.log("add topic user id", props.userID);
    if (titleEntred !== 0 && content !== 0) {
      await firebase
        .database()
        .ref("forums")
        .child(courseName)
        .once("value")
        .then((data) => {
          if (data.val() !== null) {
            counter = data.val().last_entry_count + 1;
          } else {
            counter = 0;
            firebase
              .database()
              .ref("forums")
              .child(courseName)
              .set({ last_entry_count: 0 });
          }
        });
      await firebase
        .database()
        .ref("forums")
        .child(courseName)
        .update({
          last_entry_count: counter,
          [counter]: {
            description: content,
            timestamp: date.getTime(),
            title: titleEntred,
            userID: props.userID,
            username: props.username,
            chats: {
              last_entry_count_chat: -1,
            },
          },
        });
      await firebase
        .database()
        .ref("users")
        .child(props.userID)
        .child("topics")
        .child(getCourseNameFromUrl())
        .update({
          [counter]: {
            title: titleEntred,
          },
        });
      setOpen(false);
      window.location.reload();
    } else {
      alert("You cannot leave empty section.");
    }
  };

  const handleCloseExit = () => {
    setOpen(false);
  };

  return (
    <div className="div-new-topic">
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <AddIcon style={{ fontSize: "22px", marginRight: "10px" }}></AddIcon>{" "}
        Add New Topic
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseExit}>
          Topic Add Form
        </DialogTitle>
        <DialogContent dividers>
          <div className="new-note-forum">
            <TextField
              id="filled-multiline-flexible"
              label="Headings"
              multiline
              rowsMax={4}
              onChange={handleChangeTitle}
              variant="filled"
            />
            <TextField
              id="filled-multiline-static"
              label="Description"
              multiline
              rows={6}
              variant="filled"
              onChange={handleChangeContent}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
