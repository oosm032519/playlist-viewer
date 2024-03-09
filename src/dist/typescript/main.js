"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playlistManager_1 = require("./playlistManager");
const pageInitializer_1 = require("./pageInitializer");
const toggleVisitedPlaylists_1 = require("./toggleVisitedPlaylists");
const spotifyAuthorizer_1 = require("./spotifyAuthorizer");
const tableManager_1 = require("./tableManager");
class Main {
    constructor() {
        new pageInitializer_1.PageInitializer();
        this.toggleVisitedPlaylists = new toggleVisitedPlaylists_1.ToggleVisitedPlaylists();
        this.spotifyAuthorizer = new spotifyAuthorizer_1.SpotifyAuthorizer();
        this.playlistManager = new playlistManager_1.PlaylistManager();
        this.tableManager = new tableManager_1.TableManager();
        this.addEventListeners();
        window.addEventListener('resize', this.tableManager.checkTableWidth);
        this.tableManager.checkTableWidth();
    }
    addEventListeners() {
        document.getElementById('visited-playlists').addEventListener('click', () => this.toggleVisitedPlaylists.toggle());
        document.getElementById('spotify-login').addEventListener('click', () => this.spotifyAuthorizer.authorize());
        document.getElementById('show-playlists').addEventListener('click', () => this.playlistManager.fetchUserPlaylists());
    }
}
new Main();
//# sourceMappingURL=main.js.map