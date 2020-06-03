import React from 'react'
import firebase from "firebase";

class SutudySpotifyRedirect extends React.Component {

  state = {
    token: window.location.href.toString().substring(window.location.href.toString().indexOf("=") + 1, window.location.href.toString().indexOf("&"))
  }

  handleToken = (token, timestamp) => {
    if (this.props.userID !== null) {

      firebase
        .database()
        .ref("users")
        .child(this.props.userID)
        .update({
          token: token,
          tokenExpiresIn: timestamp
        }).then(() => window.location.replace("/"));
    }
  }

  componentDidMount() {

    let url = window.location.href.toString();
    const accessToken = url.substring(url.indexOf("=") + 1, url.indexOf("&"));
    this.handleToken(accessToken, Date.now() + 60 * 60 * 1000);
  }

  render() {

    if (this.state.token) {
      return <h1> REDIRECTING... </h1>

    }
    else {
      return <h1> Waiting... </h1>
    }
  }
}

export default SutudySpotifyRedirect;