import { descriptions } from './Utils';
export class TrackTable {
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
            if (descriptions[text]) {
                th.title = descriptions[text];
            }
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
                const rows = Array.from(tbody.rows);
                rows.sort((a, b) => TrackTable.sortRows(a, b, index, sortOrder));
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
        table.classList.add('playlist-table');
        table.appendChild(this.createTableHeader());
        table.appendChild(this.createTableBody());
        return table;
    }
}
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
//# sourceMappingURL=TrackTable.js.map