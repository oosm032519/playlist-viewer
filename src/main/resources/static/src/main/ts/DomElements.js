import { playlistId, playlistTrackIds, setPlaylistTrackIds } from './globals';
import { TrackTable } from './TrackTable';
import { Track } from './Table';
import { calculateAverageAndMode } from './Utils';
export class DomElements {
    get playlistForm() {
        return document.getElementById('playlistForm');
    }
    get playlistIdInput() {
        return document.getElementById('playlistId');
    }
    get playlistTracksDiv() {
        return document.getElementById('playlistTracks');
    }
    get searchForm() {
        return document.getElementById('searchForm');
    }
    get searchQueryInput() {
        return document.getElementById('searchQuery');
    }
    get searchResultsDiv() {
        return document.getElementById('searchResults');
    }
    fetchData() {
        this.playlistForm.addEventListener('submit', this.handlePlaylistFormSubmit.bind(this));
    }
    fetchSearchResults() {
        this.searchForm.addEventListener('submit', this.handleSearchFormSubmit.bind(this));
    }
    fetchPlaylistData(playlistId) {
        setPlaylistTrackIds([]);
        this.clearAllTables();
        this.showLoadingAnimation();
        fetch(`/java/playlist/${playlistId}`)
            .then(TrackTable.handleResponse)
            .then(this.handlePlaylistData.bind(this))
            .catch(TrackTable.handleError);
    }
    fetchSearchData(searchQuery) {
        setPlaylistTrackIds([]);
        this.clearAllTables();
        this.showLoadingAnimation();
        fetch(`/java/search/${searchQuery}`)
            .then(response => response.json())
            .then(this.handleSearchData.bind(this))
            .catch(error => console.error('There was a problem with the fetch operation: ', error));
    }
    handlePlaylistFormSubmit(event) {
        event.preventDefault();
        this.fetchPlaylistData(this.playlistIdInput.value);
    }
    handleSearchFormSubmit(event) {
        event.preventDefault();
        this.fetchSearchData(this.searchQueryInput.value);
    }
    handlePlaylistData(data) {
        this.clearAllTables();
        this.processPlaylistData(data);
        this.hideLoadingAnimation();
    }
    handleSearchData(data) {
        this.clearAllTables();
        this.createSearchResultsTable(data);
        this.hideLoadingAnimation();
    }
    processPlaylistData(data) {
        if (data && Array.isArray(data.tracks)) {
            const tracks = data.tracks.map((item) => {
                playlistTrackIds.push(item.playlistTrack.track.id);
                return new Track(item.playlistTrack.track, item.audioFeatures);
            });
            this.createTable(tracks);
            calculateAverageAndMode(tracks);
            this.displayPlaylistName(data.name);
            console.log(`Playlist ID: ${playlistId}`);
            console.log(`Playlist Track IDs: ${playlistTrackIds}`);
        }
        else {
            console.error('Expected data.tracks to be an array but received', data);
        }
    }
    displayPlaylistName(name) {
        if (name) {
            console.log(`Playlist name: ${name}`);
            const playlistNameElement = document.createElement('h2');
            playlistNameElement.textContent = `${name}`;
            this.playlistTracksDiv.insertBefore(playlistNameElement, this.playlistTracksDiv.firstChild);
        }
    }
    showLoadingAnimation() {
        document.getElementById('loading').classList.remove('hidden');
    }
    hideLoadingAnimation() {
        document.getElementById('loading').classList.add('hidden');
    }
    clearAllTables() {
        this.playlistTracksDiv.innerHTML = '';
        this.searchResultsDiv.innerHTML = '';
    }
    createTable(tracks) {
        this.clearAllTables();
        const trackTable = new TrackTable(tracks);
        this.playlistTracksDiv.appendChild(trackTable.createTable());
    }
    createSearchResultsTable(results) {
        this.clearAllTables();
        const table = document.createElement('table');
        results.forEach(result => {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = result.name;
            td.addEventListener('click', () => {
                document.getElementById('loading').classList.remove('hidden');
                fetch(`/java/playlist/${result.id}`)
                    .then(response => response.json())
                    .then(data => {
                    this.playlistTracksDiv.innerHTML = '';
                    const playlistNameElement = document.createElement('h2');
                    playlistNameElement.textContent = `${result.name}`;
                    this.playlistTracksDiv.appendChild(playlistNameElement);
                    if (data && Array.isArray(data.tracks)) {
                        const tracks = data.tracks.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
                        this.createTable(tracks);
                        calculateAverageAndMode(tracks);
                    }
                    else {
                        console.error('Expected data.tracks to be an array but received', data);
                    }
                    document.getElementById('loading').classList.add('hidden');
                })
                    .catch(error => console.error('There was a problem with the fetch operation: ', error));
            });
            row.appendChild(td);
            table.appendChild(row);
        });
        this.searchResultsDiv.appendChild(table);
    }
}
//# sourceMappingURL=DomElements.js.map