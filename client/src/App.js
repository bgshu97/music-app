import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      topArtists: [],
      artist1: { name: '', popularity: 0 },
      artist2: { name: '', popularity: 0 },
    };
  }
  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      this.setState({
        nowPlaying: {
          name: response.item.name,
          albumArt: response.item.album.images[0].url,
        },
      });
    });
  }

  getTopArtists() {
    spotifyApi.getMyTopArtists().then((response) => {
      console.log(response);
      this.setState({
        topArtists: response.items,
      });
      console.log(this.state.topArtists);
    });
    this.getRandomArtist();
  }

  getRandomArtist() {
    if (this.state.topArtists) {
      let a1 = this.state.topArtists[Math.floor(Math.random() * this.state.topArtists.length)];
      let a2 = this.state.topArtists[Math.floor(Math.random() * this.state.topArtists.length)];
      this.state.artist1.name = a1.name;
      this.state.artist1.popularity = a1.popularity;
      this.state.artist2.name = a2.name;
      this.state.artist2.popularity = a2.popularity;
    }
  }
  render() {
    return (
      <div className="App">
        <a href="http://localhost:8888"> Login to Spotify </a>
        <div>Now Playing: {this.state.nowPlaying.name}</div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }} alt="" />
        </div>
        {this.state.loggedIn && (
          <div>
            <button onClick={() => this.getNowPlaying()}>Check Now Playing</button>
            <button onClick={() => this.getTopArtists()}>Check Top Artists</button>
          </div>
        )}
        <div>
          Who is more popular? {this.state.artist1.name} or {this.state.artist2.name}?
        </div>
      </div>
    );
  }
}

export default App;
