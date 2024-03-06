import { TrackButtonManager } from './trackButtonManager';
import { ElementManager } from './elementManager';
export class TrackTableManager {
    constructor() {
        this.trackButtonManager = new TrackButtonManager();
        this.elementManager = new ElementManager();
    }
    // ペアの行を作成する関数
    createRowForPair(pair, playlistId) {
        const row = document.createElement('tr');
        pair.forEach((track) => {
            this.appendTrackToRow(row, track, playlistId);
        });
        return row;
    }
    // トラックを行に追加する関数
    appendTrackToRow(row, track, playlistId) {
        const cell = this.createCellForTrack(track);
        const addButton = this.trackButtonManager.createAddButton(track, playlistId, cell);
        const removeButton = this.trackButtonManager.createRemoveButton(track, playlistId, cell, row);
        row.appendChild(cell);
        row.appendChild(addButton);
        row.appendChild(removeButton);
    }
    // トラックのセルを作成する関数
    createCellForTrack(track) {
        const cell = document.createElement('td');
        cell.textContent = `${track.name} by ${track.artists[0].name}`;
        cell.addEventListener('click', () => {
            window.open(`https://open.spotify.com/track/${track.id}`, '_blank');
        });
        return cell;
    }
    // ヘッダー行を作成する関数
    createHeaderRow() {
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = "Recommended Tracks";
        headerCell.classList.add('text-white', 'bg-green-500', 'text-center', 'py-2', 'hover:bg-green-600', 'transition-colors', 'duration-300', 'ease-in-out');
        headerRow.appendChild(headerCell);
        return headerRow;
    }
    // トラックペアの行を作成する関数
    createRowsForTrackPairs(trackPairs, playlistId) {
        return trackPairs.map(pair => this.createRowForPair(pair, playlistId));
    }
    // テーブルをDOMに追加する関数
    appendTableToDOM(table) {
        this.elementManager.playlistTracksDiv.appendChild(table);
    }
}
//# sourceMappingURL=trackTableManager.js.map