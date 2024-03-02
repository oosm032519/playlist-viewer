import { PlaylistManager } from './playlistManager';
import { PageInitializer } from './pageInitializer';
import { ToggleVisitedPlaylists } from './toggleVisitedPlaylists';
import { SpotifyAuthorizer } from './spotifyAuthorizer';
class Main {
    constructor() {
        new PageInitializer();
        this.toggleVisitedPlaylists = new ToggleVisitedPlaylists();
        this.spotifyAuthorizer = new SpotifyAuthorizer();
        this.playlistManager = new PlaylistManager();
        this.addEventListeners();
    }
    addEventListeners() {
        document.getElementById('visited-playlists').addEventListener('click', () => this.toggleVisitedPlaylists.toggle());
        document.getElementById('spotify-login').addEventListener('click', () => this.spotifyAuthorizer.authorize());
        document.getElementById('show-playlists').addEventListener('click', () => this.playlistManager.fetchUserPlaylists());
    }
}
new Main();
//# sourceMappingURL=main.js.map