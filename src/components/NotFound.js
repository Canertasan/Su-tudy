import React, { Component } from "react";
import "./notFound.css";
import { withRouter } from "react-router";

class NotFound extends Component {
  state = {};
  // when user click our logo, it should go main page
  handleClick = () => {
    this.props.history.push("/");
  };
  render() {
    return (
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <h1>
              4<span></span>4
            </h1>
          </div>
          <h2>Oops! Page Not Be Found</h2>
          <p>
            Sorry but the page you are looking for does not exist, have been
            removed. name changed or is temporarily unavailable
          </p>
          <button onClick={() => this.handleClick()}>Back to homepage</button>
        </div>
      </div>
    );
  }
}

export default withRouter(NotFound);
