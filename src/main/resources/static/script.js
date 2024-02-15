const descriptions = {
    'Acousticness': 'アコースティック感。1に近いほどアコースティック。',
    'Danceability': '踊りやすさ。1に近いほど踊りやすい。',
    'Energy': '曲の激しさ。1に近いほど激しい。',
    'Liveness': 'ライブ感。1に近いほどライブらしい。',
    'Speechiness': '曲中の話し言葉の存在度合い。1に近いほど話し言葉が多い。',
    'Valence': '明るさ。1に近いほど明るい。'
};
document.getElementById('theme-toggle').addEventListener('click', function () {
    const body = document.body;
    const sunIcon = document.getElementById('sun-icon');
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        sunIcon.style.transform = 'rotate(180deg)';
    }
    else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        sunIcon.style.transform = 'rotate(0deg)';
    }
});
class DomElements {
    constructor() {
        this.playlistForm = document.getElementById('playlistForm');
        this.playlistIdInput = document.getElementById('playlistId');
        this.playlistTracksDiv = document.getElementById('playlistTracks');
    }
    fetchData() {
        this.playlistForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const playlistId = this.playlistIdInput.value;
            fetch(`/java/playlist/${playlistId}`)
                .then(TrackTable.handleResponse)
                .then(data => {
                this.playlistTracksDiv.innerHTML = '';
                const tracks = data.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
                this.createTable(tracks);
            })
                .catch(TrackTable.handleError);
        });
    }
    createTable(tracks) {
        const trackTable = new TrackTable(tracks);
        this.playlistTracksDiv.appendChild(trackTable.createTable());
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
        return columnIndex === COLUMN_INDEX_NAME_ARTIST || columnIndex === COLUMN_INDEX_OTHERS ? cell : parseFloat(cell);
    }
    createTable() {
        const table = document.createElement('table');
        table.appendChild(this.createTableHeader());
        table.appendChild(this.createTableBody());
        return table;
    }
}
const domElements = new DomElements();
domElements.fetchData();
//# sourceMappingURL=script.js.map