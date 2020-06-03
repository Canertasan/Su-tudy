import React from "react";
import Menu from "@material-ui/core/Menu";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";

export default function SimpleMenu(event) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (type) => {
    handleClose();
    event.routePath(type, event.props);
  };
  return (
    <div style={{ borderRadius: "50%" }}>
      <Chip
        style={{
          margin: "5px", marginLeft: "20px", backgroundColor: '#6495ed',
          color: '#FFFFFF'
        }}
        label={event.props}
        onClick={handleClick}
      />
      <div>
        <Menu
          id="simple-search-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{ marginTop: "35px", borderRadius: "50%" }}
        >
          <MenuItem onClick={() => handleMenuClick("forum")}>Forum</MenuItem>
          <MenuItem onClick={() => handleMenuClick("notes")}>Notes</MenuItem>
        </Menu>
      </div>
    </div>
  );
}
