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

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  getTopArtists() {
    spotifyApi.getMyTopArtists({ limit: 50 }).then((response) => {
      this.shuffle(response.items);
      let a1 = response.items[0];
      let a2 = response.items[1];
      this.setState({
        topArtists: response.items,
        artist1: { name: a1.name, popularity: a1.popularity },
        artist2: { name: a2.name, popularity: a2.popularity },
      });
    });
  }

  render() {
    return (
      <div className="App">
        <a href="http://localhost:8888"> Login to Spotify </a>
        {this.state.loggedIn && (
          <div>
            <button onClick={() => this.getTopArtists()}>Compare your artists</button>
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
