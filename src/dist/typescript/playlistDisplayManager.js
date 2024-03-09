"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistDisplayManager = void 0;
const tableManager_1 = require("./tableManager");
const track_1 = require("./track");
const elementManager_1 = require("./elementManager");
const trackCalculator_1 = require("./trackCalculator");
class PlaylistDisplayManager {
    constructor() {
        this.tableManager = new tableManager_1.TableManager();
        this.elementManager = new elementManager_1.ElementManager();
        this.trackCalculator = new trackCalculator_1.TrackCalculator();
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
            const tracks = data.tracks.map((item) => new track_1.Track(item.playlistTrack.track, item.audioFeatures));
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
exports.PlaylistDisplayManager = PlaylistDisplayManager;
//# sourceMappingURL=playlistDisplayManager.js.map