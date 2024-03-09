"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackTable = void 0;
const descriptionManager_1 = require("./descriptionManager");
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
        thead.classList.add('bg-green-500', 'text-white', 'hover:bg-green-600', 'transition-colors', 'duration-300', 'ease-in-out');
        const headerRow = document.createElement('tr');
        ['Track Name', 'Artist Name', 'BPM', 'Key', 'Mode', 'Acousticness', 'Danceability', 'Energy', /* 'Instrumentalness', */ 'Liveness', 'Speechiness', 'Valence'].forEach((text, index) => {
            const th = this.createHeaderCell(text, index);
            th.classList.add('px-4', 'py-2');
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        return thead;
    }
    createHeaderCell(text, index) {
        const th = document.createElement('th');
        th.textContent = text;
        const descriptions = new descriptionManager_1.DescriptionManager();
        if (descriptions.descriptions[text]) {
            th.title = descriptions.descriptions[text];
        }
        th.addEventListener('click', (event) => this.handleHeaderCellClick(event, index));
        return th;
    }
    handleHeaderCellClick(event, index) {
        const element = event.target;
        this.toggleSortOrder(element);
        this.resetSortOrderForOtherColumns(element);
        this.sortRows(element, index);
    }
    toggleSortOrder(element) {
        if (element.classList.contains('asc')) {
            element.classList.replace('asc', 'desc');
        }
        else if (element.classList.contains('desc')) {
            element.classList.replace('desc', 'asc');
        }
        else {
            element.classList.add('asc');
        }
    }
    resetSortOrderForOtherColumns(element) {
        Array.from(element.parentNode.children)
            .filter(e => e !== element)
            .forEach(e => e.classList.remove('asc', 'desc'));
    }
    sortRows(element, index) {
        const table = element.closest('table');
        const tbody = table.querySelector('tbody');
        const sortOrder = element.classList.contains('asc') ? -1 : 1;
        const rows = Array.from(tbody.rows);
        rows.sort((a, b) => TrackTable.sortRows(a, b, index, sortOrder));
        rows.forEach(row => tbody.appendChild(row));
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
        row.classList.add('hover:bg-gray-300', 'h-20', 'odd:bg-white', 'even:bg-gray-100', 'transition-colors', 'duration-300', 'ease-in-out');
        [track.name, track.artists[0].name, track.audioFeatures.tempo, this.keyToNote(track.audioFeatures.key), track.audioFeatures.mode, track.audioFeatures.acousticness, track.audioFeatures.danceability, track.audioFeatures.energy, /* track.audioFeatures.instrumentalness, */ track.audioFeatures.liveness, track.audioFeatures.speechiness, track.audioFeatures.valence].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text.toString();
            td.classList.add('border', 'border-gray-200', 'px-4', 'py-2'); // Tailwind CSS classes to add border and padding
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
        table.classList.add('playlist-table', 'divide-y', 'divide-gray-200', 'divide-x', 'w-full', 'mx-auto', 'mt-6', 'text-center', 'shadow-md', 'rounded-lg', 'overflow-hidden');
        table.appendChild(this.createTableHeader());
        table.appendChild(this.createTableBody());
        return table;
    }
}
exports.TrackTable = TrackTable;
//# sourceMappingURL=trackTable.js.map