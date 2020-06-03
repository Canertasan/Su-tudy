import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import SpotifyPlayer from "react-spotify-web-playback";
import { Grid, Avatar, withStyles } from "@material-ui/core";
import styles from "./styles";
import DefaultPicture from "../../images/spotify.png";

class SutudySpotifyProfile extends React.Component {
  state = {
    displayName: null,
    images: [],
    type: null,
    followers: null,
  };

  componentDidMount() {
    let url = `https://api.spotify.com/v1/me`;
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data.images === [])
        this.setState({
          displayName: data.display_name,
          images: data.images,
          type: data.type,
          followers: data.followers.total,
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Avatar
            src={
              this.state.images.length === 0
                ? DefaultPicture
                : this.state.images[0].url
            }
            className={classes.large}
          />
        </Grid>
        <Grid item xs={9}>
          <h2> {this.state.displayName}</h2>
        </Grid>
      </Grid>
    );
  }
}

class SutudySpotifySearch extends React.Component {
  state = {
    opened: false,
    options: [],
    uris: null,
    offset: null,
  };

  handleChange = (_) => {
    if (_.target.value.length !== 0) {
      let query = _.target.value;
      query = query.replace(" ", "%20");
      console.log(query);
      let url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=20`;
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data && data.tracks && data.tracks.items) {
            this.setState({ trackURI: data.tracks.items[0].uri });

            // let selectedItem = data.tracks.items[0];
            // this.setState({
            //   uris: [selectedItem.album.uri],
            //   offset: selectedItem.track_number - 1,
            // });
            console.log(data.tracks.items);

            let tempOptions = [];
            data.tracks.items.forEach((track) => {
              tempOptions.push({
                name: track.name,
                image: track.album.images[2].url,
                artist: track.artists[0].name,
              });
            });

            this.setState({ options: tempOptions });
          }
        });
    }
  };

  handlePlay = (event, selectedSong) => {
    if (selectedSong !== null) {
      let query = selectedSong.name.replace(" ", "%20");
      let url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`;

      if (selectedSong && selectedSong !== undefined) {
        fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.props.token}`,
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            console.log(data.tracks.items[0]);
            let selectedItem = data.tracks.items[0];
            this.setState(
              {
                uris: [selectedItem.album.uri],
                offset: selectedItem.track_number - 1,
              },
              () => {
                this.props.handleUrisAndOffset(
                  this.state.uris,
                  this.state.offset
                );
              }
            );
          });
      }
    }
  };

  render() {
    return (
      <div>
        <Autocomplete
          id="spotify-search"
          open={this.state.opened}
          onOpen={() => {
            this.setState({ opened: true });
          }}
          onClose={() => {
            this.setState({ opened: false });
          }}
          onChange={(_, selectedSong) => this.handlePlay(_, selectedSong)}
          options={this.state.options}
          filterSelectedOptions
          getOptionLabel={(track) => track.name}
          renderOption={(track) => {
            return (
              <React.Fragment>
                <img
                  alt=""
                  style={{ width: "32px", height: "32px", marginRight: "5px" }}
                  src={track.image}
                ></img>
                {track.name} - {track.artist}
              </React.Fragment>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(_) => this.handleChange(_)}
              label="Search a Song Name"
            />
          )}
        />
      </div>
    );
  }
}

class SutudySpotifyPlayer extends React.Component {
  render() {
    return (
      <div>
        <SpotifyPlayer
          token={this.props.token}
          uris={this.props.uris}
          offset={this.props.offset}
          autoPlay={true}
          name={"Su-tudy Web Player"}
          play={this.props.playing}
          callback={(state) => this.props.handleWidgets(state.status)}
          showSaveIcon={true}
        />
      </div>
    );
  }
}

export { SutudySpotifySearch, SutudySpotifyPlayer };
export default withStyles(styles)(SutudySpotifyProfile);
