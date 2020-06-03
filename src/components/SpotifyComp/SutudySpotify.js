import React from 'react'
import { SutudySpotifySearch, SutudySpotifyPlayer } from './SutudySpotifyWidgets'
import SutudySpotifyProfile from './SutudySpotifyWidgets'
import { Paper, withStyles, Grid, AppBar } from '@material-ui/core';
import SpotifyAuthorizationLink from './SpotifyAuthorization';
import styles from './styles'
import spotifyLogo from "../../images/spotify.png";
class SutudySpotify extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      uris: null,
      offset: 0,
      playing: false,
      isReady: false,
    }
  }

  handleUrisAndOffset = (uris, offset) => {
    this.setState({
      uris: uris,
      offset: offset,
      playing: true
    });
  }

  handleWidgets = (_state) => {
    console.log(_state);
    if (_state === "READY") {
      this.setState({ isReady: true });
    }
    if (_state === "ERROR") {
      window.location.replace(SpotifyAuthorizationLink());
    }
  }

  render() {
    const { classes, isSpotifyOn, userID } = this.props
    if (!this.props.token) {
      return (
        <AppBar position="fixed" className={isSpotifyOn && userID ? classes.appBarShow : classes.appBarHide}>
          <div className={classes.root}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={12}>
                <Paper className={classes.paper} xs={12}>
                  <img
                    src={spotifyLogo}
                    onClick={() => this.handleClick()}
                    className={classes.logo}
                    alt={""}
                  />

                  <h3 onClick={() => {
                    if (this.props.userID !== null && this.props.userID !== undefined) {
                      window.location.replace(SpotifyAuthorizationLink())
                    }
                    else {
                      this.props.closeSpotify();
                      window.location.replace("/authorization-needed");
                    }
                  }}>
                    Login with Spotify
                  </h3>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </AppBar>
      )
    }
    else {
      return (
        <AppBar position="fixed" className={isSpotifyOn ? classes.appBarShow : classes.appBarHide}>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper} xs={3}>
                  <Grid container spacing={3}>
                    {this.state.isReady ?
                      <Grid item xs={3}>
                        <SutudySpotifyProfile token={this.props.token} />
                      </Grid>
                      : null
                    }
                    <Grid item xs={this.state.isReady ? 6 : 12}>
                      {!this.state.isReady ? <h4 style={{ align: "center" }} > TRYING TO CONNECT SPOTIFY </h4> : null}
                      <SutudySpotifyPlayer token={this.props.token} offset={this.state.offset} uris={this.state.uris} playing={this.state.playing} handleWidgets={(_) => this.handleWidgets(_)} />
                    </Grid>
                    {this.state.isReady ? <Grid item xs={3}>
                      <SutudySpotifySearch token={this.props.token} handleUrisAndOffset={(u, o) => this.handleUrisAndOffset(u, o)} />
                    </Grid> : null}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </AppBar>
      )
    }
  }
}

export default withStyles(styles)(SutudySpotify);