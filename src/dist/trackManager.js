var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Track } from './track';
import { PlaylistIdManager } from './playlistIdManager';
import { MessageManager } from './MessageManager';
import { ElementManager } from './elementManager';
import { TrackDisplayManager } from './trackDisplayManager';
import { TrackFetcher } from './trackFetcher';
export class TrackManager {
    constructor() {
        this.playlistIdManager = PlaylistIdManager.getInstance();
        this.messageManager = new MessageManager();
        this.elementManager = new ElementManager();
        this.trackDisplayManager = new TrackDisplayManager();
    }
    // レスポンスデータをログに出力する関数
    logResponseData(data) {
        console.log("Response data:", data);
    }
    // レコメンドトラックをログに出力する関数
    logRecommendedTracks(tracks) {
        console.log("Recommended tracks based on the playlist:");
        tracks.forEach((track) => {
            console.log(`- ${track.name} by ${track.artists[0].name}`);
        });
        console.log(this.playlistIdManager.playlistTrackIds);
    }
    // トラックをペアにする関数
    createTrackPairs(tracks) {
        const trackPairs = [];
        for (let i = 0; i < tracks.length; i += 2) {
            trackPairs.push(tracks.slice(i, i + 2));
        }
        return trackPairs;
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
        const addButton = this.createAddButton(track, playlistId, cell);
        const removeButton = this.createRemoveButton(track, playlistId, cell, row);
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
    // 追加ボタンを作成する関数
    createAddButton(track, playlistId, cell) {
        return this.createTrackButton(track, playlistId, cell, null, true);
    }
    // 削除ボタンを作成する関数
    createRemoveButton(track, playlistId, cell, row) {
        return this.createTrackButton(track, playlistId, cell, row, false);
    }
    // ボタンを作成する関数
    createButton(isAddButton) {
        const button = document.createElement('button');
        button.textContent = isAddButton ? '+' : '-';
        button.className = 'track-button bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-center text-lg w-10 h-10 flex items-center justify-center';
        return button;
    }
    // メッセージを生成するメソッド
    getMessages(isAddButton) {
        const successMessage = isAddButton ? '楽曲を追加しました！' : '楽曲を削除しました！';
        const errorMessage = isAddButton ? '楽曲を追加できませんでした' : '楽曲を削除できませんでした';
        return { successMessage, errorMessage };
    }
    // エンドポイントを生成するメソッド
    getEndpoint(isAddButton) {
        return isAddButton ? 'addTrack' : 'removeTrack';
    }
    // イベントリスナーのコールバック関数
    handleButtonClick({ track, playlistId, cell, row, isAddButton }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!playlistId) {
                console.error('Playlist ID is not set.');
                return;
            }
            const endpoint = this.getEndpoint(isAddButton);
            const { successMessage, errorMessage } = this.getMessages(isAddButton);
            try {
                const trackFetcher = new TrackFetcher();
                yield trackFetcher.fetchTrack(`/java/playlist/${endpoint}?trackId=${track.id}&playlistId=${playlistId}`);
                this.messageManager.showMessage(successMessage);
                if (isAddButton) {
                    cell.classList.add('bg-green-100');
                }
                else {
                    if (row.sectionRowIndex % 2 === 0) {
                        cell.classList.add('bg-white');
                    }
                    else {
                        cell.classList.add('bg-gray-100');
                    }
                }
            }
            catch (error) {
                console.error('There was a problem with the fetch operation: ', error);
                this.messageManager.showMessage(errorMessage);
            }
        });
    }
    // トラックボタンを作成する関数
    createTrackButton(track, playlistId, cell, row, isAddButton) {
        const button = this.createButton(isAddButton);
        button.classList.add('bg-green-500', 'text-white', 'w-12', 'h-12', 'm-2', 'rounded', 'px-5', 'py-2.5', 'cursor-pointer', 'transition-colors', 'duration-300', 'ease-in-out');
        button.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            return this.handleButtonClick({
                track: track,
                playlistId: playlistId,
                cell: cell,
                row: row,
                isAddButton: isAddButton
            });
        }));
        return button;
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
    // トラックを作成する
    createTracks(data) {
        return data.tracks.map((item) => {
            this.playlistIdManager.playlistTrackIds.push(item.playlistTrack.track.id);
            return new Track(item.playlistTrack.track, item.audioFeatures);
        });
    }
    // レコメンド曲のデータを処理する関数
    processRecommendationData(data) {
        const trackManager = new TrackManager();
        trackManager.logResponseData(data);
        const playlistIdManager = PlaylistIdManager.getInstance();
        if (data.tracks) {
            const filteredTracks = data.tracks.filter((track) => !playlistIdManager.playlistTrackIds.includes(track.id));
            trackManager.logRecommendedTracks(filteredTracks);
            this.trackDisplayManager.displayRecommendedTracks(filteredTracks);
        }
        else {
            console.log("No tracks found in the response.");
        }
    }
}
//# sourceMappingURL=trackManager.js.map