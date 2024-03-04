import { TableManager } from './tableManager';
import { Track } from './track';
import { ElementManager } from './elementManager';
import { TrackCalculator } from './TrackCalculator';
export class PlaylistDisplayManager {
    constructor() {
        this.tableManager = new TableManager();
        this.elementManager = new ElementManager();
        this.trackCalculator = new TrackCalculator();
    }
    displayPlaylistName(name) {
        if (name) {
            console.log(`Playlist name: ${name}`);
            const playlistNameElement = document.createElement('h2');
            playlistNameElement.textContent = `${name}`;
            playlistNameElement.classList.add('text-4xl', 'font-bold', 'text-green-500', 'mt-4', 'font-sans', 'font-semibold', 'w-full', 'text-center', 'border-b-2', 'border-green-500');
            this.elementManager.playlistTracksDiv.insertBefore(playlistNameElement, this.elementManager.playlistTracksDiv.firstChild);
        }
    }
    displayPlaylistDetails(playlist, data) {
        this.elementManager.playlistTracksDiv.innerHTML = '';
        const playlistNameElement = document.createElement('h2');
        playlistNameElement.textContent = `${playlist.name}`;
        this.elementManager.playlistTracksDiv.appendChild(playlistNameElement);
        if (data && Array.isArray(data.tracks)) {
            const tracks = data.tracks.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
            this.tableManager.createDomTable(tracks);
            this.trackCalculator.calculateTrackAverageAndMode(tracks);
        }
        else {
            console.error('Expected data.tracks to be an array but received', data);
        }
    }
    displayPlaylists(data) {
        this.elementManager.playlistTracksDiv.innerHTML = '';
        if (data && Array.isArray(data)) {
            this.tableManager.createSearchResultsTable(data);
        }
        else {
            console.error(`Expected data to be an array but received data of type ${typeof data}`, data);
        }
    }
}
//# sourceMappingURL=playlistDisplayManager.js.map