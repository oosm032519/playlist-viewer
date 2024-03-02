import {UIManager} from './UIManager'

export class FetchManager {
    
    
    async fetchVisitedPlaylists() {
        fetch('/java/user/visited-playlists', {credentials: 'include'})
            .then(response => response.json())
            .then(data => {
                const visitedPlaylistsDiv = document.getElementById('visitedPlaylists');
                const uiManager = new UIManager();
                uiManager.createTable(visitedPlaylistsDiv, data);
            });
    }
}
