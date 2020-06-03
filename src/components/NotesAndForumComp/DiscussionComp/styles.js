import { deepOrange, grey } from "@material-ui/core/colors";

const styles = (theme) => ({
  discussionComp: {
    margin: "5px",
    border: "thick solid #a8a8a8",
    borderColour: "#efeff5",
    borderWidth: "5px",
    borderRadius: "15px",
    borderType: "solid",
    innerPadding: "30px",
    borderWidth: "thin",
  },
  orange: {
    marginRight: "5px",
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  grey: {
    marginRight: "5px",
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[500],
  },
  root_component: {
    display: "flex",
    margin: "20px",
    weight: "100%",
    cursor: "pointer",
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
});

export default styles;
