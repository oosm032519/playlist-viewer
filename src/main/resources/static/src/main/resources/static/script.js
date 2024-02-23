const descriptions = {
    'Acousticness': 'アコースティック感。1に近いほどアコースティック。',
    'Danceability': '踊りやすさ。1に近いほど踊りやすい。',
    'Energy': '曲の激しさ。1に近いほど激しい。',
    'Liveness': 'ライブ感。1に近いほどライブらしい。',
    'Speechiness': '曲中の話し言葉の存在度合い。1に近いほど話し言葉が多い。',
    'Valence': '明るさ。1に近いほど明るい。'
};
class DomElements {
    constructor() {
        this.playlistForm = document.getElementById('playlistForm');
        this.playlistIdInput = document.getElementById('playlistId');
        this.playlistTracksDiv = document.getElementById('playlistTracks');
        this.searchForm = document.getElementById('searchForm');
        this.searchQueryInput = document.getElementById('searchQuery');
        this.searchResultsDiv = document.getElementById('searchResults');
    }
    fetchData() {
        this.playlistForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const playlistId = this.playlistIdInput.value;
            // Show loading animation
            document.getElementById('loading').classList.remove('hidden');
            // Clear search results
            this.searchResultsDiv.innerHTML = '';
            fetch(`/java/playlist/${playlistId}`)
                .then(TrackTable.handleResponse)
                .then(data => {
                this.playlistTracksDiv.innerHTML = '';
                if (data && Array.isArray(data.tracks)) {
                    const tracks = data.tracks.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
                    this.createTable(tracks);
                    // Output the playlist name to the console
                    if (data.name) {
                        console.log(`Playlist name: ${data.name}`);
                        // Display the playlist name above the table
                        const playlistNameElement = document.createElement('h2');
                        playlistNameElement.textContent = `${data.name}`;
                        this.playlistTracksDiv.insertBefore(playlistNameElement, this.playlistTracksDiv.firstChild);
                    }
                }
                else {
                    console.error('Expected data.tracks to be an array but received', data);
                }
                // Hide loading animation
                document.getElementById('loading').classList.add('hidden');
            })
                .catch(TrackTable.handleError);
        });
    }
    fetchSearchResults() {
        this.searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchQuery = this.searchQueryInput.value;
            // Show loading animation
            document.getElementById('loading').classList.remove('hidden');
            // Clear playlist tracks
            this.playlistTracksDiv.innerHTML = '';
            fetch(`/java/search/${searchQuery}`)
                .then(response => response.json())
                .then(data => {
                this.searchResultsDiv.innerHTML = '';
                this.createSearchResultsTable(data);
                // Hide loading animation
                document.getElementById('loading').classList.add('hidden');
            })
                .catch(error => console.error('There was a problem with the fetch operation: ', error));
        });
    }
    createTable(tracks) {
        const trackTable = new TrackTable(tracks);
        this.playlistTracksDiv.appendChild(trackTable.createTable());
    }
    createSearchResultsTable(results) {
        const table = document.createElement('table');
        results.forEach(result => {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = result.name;
            // Add click event listener to the table cell
            td.addEventListener('click', () => {
                // Fetch the playlist tracks when the playlist name is clicked
                // Show loading animation
                document.getElementById('loading').classList.remove('hidden');
                fetch(`/java/playlist/${result.id}`)
                    .then(response => response.json())
                    .then(data => {
                    this.playlistTracksDiv.innerHTML = '';
                    // Display the playlist name above the table
                    const playlistNameElement = document.createElement('h2');
                    playlistNameElement.textContent = `${result.name}`;
                    this.playlistTracksDiv.appendChild(playlistNameElement);
                    if (data && Array.isArray(data.tracks)) {
                        const tracks = data.tracks.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
                        this.createTable(tracks);
                    }
                    else {
                        console.error('Expected data.tracks to be an array but received', data);
                    }
                    // Hide loading animation
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
class Track {
    constructor(track, audioFeatures) {
        this.name = track.name;
        this.artists = track.artists;
        this.audioFeatures = audioFeatures;
    }
}
class TrackTable {
    constructor(tracks) {
        this.tracks = tracks;
    }
    static handleResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    static handleError(error) {
        console.error('There was a problem with the fetch operation: ', error);
    }
    createTableHeader() {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Track Name', 'Artist Name', 'BPM', 'Key', 'Mode', 'Acousticness', 'Danceability', 'Energy', /* 'Instrumentalness', */ 'Liveness', 'Speechiness', 'Valence'].forEach((text, index) => {
            const th = document.createElement('th');
            th.textContent = text;
            // Add mouseover listener to the header cell
            if (descriptions[text]) {
                th.title = descriptions[text];
            }
            // Add click listener to the header cell
            th.addEventListener('click', (event) => {
                const element = event.target;
                if (element.classList.contains('asc')) {
                    element.classList.replace('asc', 'desc');
                }
                else if (element.classList.contains('desc')) {
                    element.classList.replace('desc', 'asc');
                }
                else {
                    element.classList.add('asc');
                }
                Array.from(element.parentNode.children)
                    .filter(e => e !== element)
                    .forEach(e => e.classList.remove('asc', 'desc'));
                const table = th.closest('table');
                const tbody = table.querySelector('tbody');
                const sortOrder = th.classList.contains('asc') ? -1 : 1;
                // Convert HTMLCollection to Array and sort
                const rows = Array.from(tbody.rows);
                rows.sort((a, b) => TrackTable.sortRows(a, b, index, sortOrder));
                // Append sorted rows to tbody
                rows.forEach(row => tbody.appendChild(row));
            });
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        return thead;
    }
    static sortRows(a, b, columnIndex, sortOrder) {
        const cellA = TrackTable.getSortValue(a.cells[columnIndex].textContent, columnIndex);
        const cellB = TrackTable.getSortValue(b.cells[columnIndex].textContent, columnIndex);
        return (cellA > cellB ? 1 : -1) * sortOrder;
    }
    createTableBody() {
        const tbody = document.createElement('tbody');
        this.tracks.forEach(track => {
            const row = this.createRow(track);
            tbody.appendChild(row);
        });
        return tbody;
    }
    createRow(track) {
        const row = document.createElement('tr');
        [track.name, track.artists[0].name, track.audioFeatures.tempo, this.keyToNote(track.audioFeatures.key), track.audioFeatures.mode, track.audioFeatures.acousticness, track.audioFeatures.danceability, track.audioFeatures.energy, /* track.audioFeatures.instrumentalness, */ track.audioFeatures.liveness, track.audioFeatures.speechiness, track.audioFeatures.valence].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text.toString();
            row.appendChild(td);
        });
        return row;
    }
    keyToNote(key) {
        const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return NOTES[key];
    }
    static getSortValue(cell, columnIndex) {
        const COLUMN_INDEX_NAME_ARTIST = 0;
        const COLUMN_INDEX_OTHERS = 1;
        const COLUMN_INDEX_KEY = 3;
        const COLUMN_INDEX_MODE = 4;
        if (columnIndex === COLUMN_INDEX_NAME_ARTIST || columnIndex === COLUMN_INDEX_OTHERS || columnIndex === COLUMN_INDEX_KEY || columnIndex === COLUMN_INDEX_MODE) {
            return cell;
        }
        else {
            return parseFloat(cell);
        }
    }
    createTable() {
        const table = document.createElement('table');
        table.appendChild(this.createTableHeader());
        table.appendChild(this.createTableBody());
        return table;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const domElements = new DomElements();
    domElements.fetchData();
    domElements.fetchSearchResults();
    const sunIcon = document.getElementById('sun-icon');
    sunIcon.style.transition = 'transform 0.5s';
    sunIcon.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        const rotationDegree = document.body.classList.contains('dark-mode') ? 180 : 0;
        sunIcon.style.transform = `rotate(${rotationDegree}deg)`;
    });
    const playlistIdOption = document.getElementById('playlistIdOption');
    const searchQueryOption = document.getElementById('searchQueryOption');
    const playlistForm = document.getElementById('playlistForm');
    const searchForm = document.getElementById('searchForm');
    playlistIdOption.addEventListener('change', () => {
        if (playlistIdOption.checked) {
            playlistForm.classList.remove('hidden');
            searchForm.classList.add('hidden');
        }
    });
    searchQueryOption.addEventListener('change', () => {
        if (searchQueryOption.checked) {
            searchForm.classList.remove('hidden');
            playlistForm.classList.add('hidden');
        }
    });
});
window.addEventListener('resize', checkTableWidth);
function checkTableWidth() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
        if (table.offsetWidth > window.innerWidth) {
            table.style.overflowX = 'scroll';
        }
        else {
            table.style.overflowX = 'auto';
        }
    });
}
checkTableWidth();
const loadingElement = document.getElementById('loading');
if (loadingElement) {
    loadingElement.classList.remove('hidden');
}
if (loadingElement) {
    loadingElement.classList.add('hidden');
}
document.addEventListener('DOMContentLoaded', () => {
    fetch('/java/user/visited-playlists', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
        const tableBody = document.querySelector('#visitedPlaylists table tbody');
        data.forEach(playlist => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = playlist.name;
            row.appendChild(nameCell);
            const idCell = document.createElement('td');
            idCell.textContent = playlist.id;
            row.appendChild(idCell);
            tableBody.appendChild(row);
        });
    });
});
document.getElementById('clock-icon').addEventListener('click', function () {
    window.open('mypage.html', '_blank');
});
document.addEventListener('DOMContentLoaded', () => {
    fetch('/java/user/visited-playlists', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
        const tableBody = document.querySelector('#visitedPlaylists table tbody');
        data.forEach(playlist => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = playlist.name;
            row.appendChild(nameCell);
            const idCell = document.createElement('td');
            idCell.textContent = playlist.id;
            row.appendChild(idCell);
            // Add click event listener to the table row
            row.addEventListener('click', () => {
                // Fetch the playlist tracks when the playlist id is clicked
                // Show loading animation
                document.getElementById('loading').classList.remove('hidden');
                fetch(`/java/playlist/${playlist.id}`)
                    .then(response => response.json())
                    .then(data => {
                    const domElements = new DomElements();
                    domElements.playlistTracksDiv.innerHTML = '';
                    // Display the playlist name above the table
                    const playlistNameElement = document.createElement('h2');
                    playlistNameElement.textContent = `${playlist.name}`;
                    domElements.playlistTracksDiv.appendChild(playlistNameElement);
                    if (data && Array.isArray(data.tracks)) {
                        const tracks = data.tracks.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
                        domElements.createTable(tracks);
                    }
                    else {
                        console.error('Expected data.tracks to be an array but received', data);
                    }
                    // Hide loading animation
                    document.getElementById('loading').classList.add('hidden');
                })
                    .catch(error => console.error('There was a problem with the fetch operation: ', error));
            });
            tableBody.appendChild(row);
        });
    });
});
document.getElementById('spotify-login').addEventListener('click', function () {
    fetch('/java/authorize')
        .then(response => response.text())
        .then(uri => {
        console.log(uri);
        window.location.href = uri;
    })
        .catch(error => console.error('There was a problem with the fetch operation: ', error));
});
//# sourceMappingURL=script.js.map