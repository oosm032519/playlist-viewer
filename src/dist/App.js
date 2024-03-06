import React, { Component } from 'react';
import { PlaylistManager } from './playlistManager';
import { PageInitializer } from './pageInitializer';
import { ToggleVisitedPlaylists } from './toggleVisitedPlaylists';
import { SpotifyAuthorizer } from './spotifyAuthorizer';
import { TableManager } from './TableManager';
class Main extends Component {
    constructor(props) {
        super(props);
        this.toggleVisitedPlaylists = new ToggleVisitedPlaylists();
        this.spotifyAuthorizer = new SpotifyAuthorizer();
        this.playlistManager = new PlaylistManager();
        this.tableManager = new TableManager();
    }
    componentDidMount() {
        new PageInitializer();
        this.addEventListeners();
        window.addEventListener('resize', this.tableManager.checkTableWidth);
        this.tableManager.checkTableWidth();
    }
    addEventListeners() {
        document.getElementById('visited-playlists').addEventListener('click', () => this.toggleVisitedPlaylists.toggle());
        document.getElementById('spotify-login').addEventListener('click', () => this.spotifyAuthorizer.authorize());
        document.getElementById('show-playlists').addEventListener('click', () => this.playlistManager.fetchUserPlaylists());
    }
    render() {
        return (React.createElement("div", null));
    }
}
export default Main;
//# sourceMappingURL=App.js.map
