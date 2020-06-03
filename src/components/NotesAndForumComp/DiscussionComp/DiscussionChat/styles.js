import { deepOrange, grey } from "@material-ui/core/colors";

const styles = (theme) => ({
  content: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },

  leftBox: {
    float: "left",
    clear: "both",
    padding: "10px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    marginTop: "5px",
    color: "white",
    width: "250px",
    borderRadius: "6px",
    marginRight: "5px",
    backgroundColor: deepOrange[500],
  },
  rightBox: {
    float: "right",
    clear: "both",
    padding: "20px",
    paddingLeft: "20px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    marginTop: "10px",
    backgroundColor: "#707BC4",
    color: "white",
    width: "300px",
    borderRadius: "10px",
  },
  sendButtn: {
    color: "blue",
    cursor: "pointer",
    "&:hover": {
      color: "gray",
    },
  },

  chatTextBoxContainer: {
    position: "absolute",
    bottom: "1px",
    left: "315px",
    boxSizing: "border-box",
    overflow: "auto",
    width: "calc(100% - 300px - 50px)",
  },

  chatTextBox: {
    width: "calc(100% - 25px)",
  },
  descSent: {
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    textType: "bold",
    padding: "10px",
    textSize: "50px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    marginTop: "5px",
    color: "white",
    width: "250px",
    borderRadius: "6px",
    backgroundColor: grey[500],
  },
});

export default styles;
