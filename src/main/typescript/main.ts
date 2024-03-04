import {PlaylistManager} from './playlistManager'
import {PageInitializer} from './pageInitializer'
import {ToggleVisitedPlaylists} from './toggleVisitedPlaylists'
import {SpotifyAuthorizer} from './spotifyAuthorizer'
import {TableManager} from './TableManager'

class Main {
    private toggleVisitedPlaylists: ToggleVisitedPlaylists;
    private spotifyAuthorizer: SpotifyAuthorizer;
    private playlistManager: PlaylistManager;
    private tableManager: TableManager;

    constructor() {
        new PageInitializer();
        this.toggleVisitedPlaylists = new ToggleVisitedPlaylists();
        this.spotifyAuthorizer = new SpotifyAuthorizer();
        this.playlistManager = new PlaylistManager();
        this.tableManager = new TableManager();
        this.addEventListeners();
        window.addEventListener('resize', this.tableManager.checkTableWidth);
        this.tableManager.checkTableWidth();
    }

    private addEventListeners() {
        document.getElementById('visited-playlists').addEventListener('click', () => this.toggleVisitedPlaylists.toggle());
        document.getElementById('spotify-login').addEventListener('click', () => this.spotifyAuthorizer.authorize());
        document.getElementById('show-playlists').addEventListener('click', () => this.playlistManager.fetchUserPlaylists());
    }
}

new Main();
