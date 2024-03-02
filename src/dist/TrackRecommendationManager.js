var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PlaylistIdManager } from './PlaylistIdManager';
import { DomElements } from './DomElements';
import { UIManager } from './UIManager';
export class TrackRecommendationManager {
    // APIからレコメンドトラックを取得する非同期関数
    fetchRecommendationsFromAPI(averageTempo, averageKey, averageDanceability, averageEnergy, averageAcousticness, averageLiveness, averageSpeechiness, averageValence, artistNamesParam) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`/java/recommendations?tempo=${averageTempo}&key=${averageKey}&danceability=${averageDanceability}&energy=${averageEnergy}&acousticness=${averageAcousticness}&liveness=${averageLiveness}&speechiness=${averageSpeechiness}&valence=${averageValence}&modeArtistNames=${artistNamesParam}`);
            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }
            return yield response.json();
        });
    }
    // レスポンスデータをログに出力する関数
    logResponseData(data) {
        console.log("Response data:", data);
    }
    // レコメンドトラックをログに出力する関数
    logRecommendedTracks(tracks) {
        const playlistIdManager = PlaylistIdManager.getInstance();
        console.log("Recommended tracks based on the playlist:");
        tracks.forEach((track) => {
            console.log(`- ${track.name} by ${track.artists[0].name}`);
        });
        console.log(playlistIdManager.playlistTrackIds);
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
        const trackRecommendationManager = new TrackRecommendationManager();
        pair.forEach((track) => {
            const cell = trackRecommendationManager.createCellForTrack(track);
            const addButton = trackRecommendationManager.createAddButton(track, playlistId, cell);
            const removeButton = trackRecommendationManager.createRemoveButton(track, playlistId, cell, row);
            row.appendChild(cell);
            row.appendChild(addButton);
            row.appendChild(removeButton);
        });
        return row;
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
        const trackRecommendationManager = new TrackRecommendationManager();
        return trackRecommendationManager.createTrackButton(track, playlistId, cell, null, true);
    }
    // 削除ボタンを作成する関数
    createRemoveButton(track, playlistId, cell, row) {
        const trackRecommendationManager = new TrackRecommendationManager();
        return trackRecommendationManager.createTrackButton(track, playlistId, cell, row, false);
    }
    // トラックボタンを作成する関数
    createTrackButton(track, playlistId, cell, row, isAddButton) {
        const button = document.createElement('button');
        button.textContent = isAddButton ? '+' : '-';
        button.className = 'track-button';
        button.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            if (!playlistId) {
                console.error('Playlist ID is not set.');
                return;
            }
            const endpoint = isAddButton ? 'addTrack' : 'removeTrack';
            const successMessage = isAddButton ? '楽曲を追加しました！' : '楽曲を削除しました！';
            const errorMessage = isAddButton ? '楽曲を追加できませんでした' : '楽曲を削除できませんでした';
            try {
                const response = yield fetch(`/java/playlist/${endpoint}?trackId=${track.id}&playlistId=${playlistId}`);
                if (!response.ok) {
                    throw new Error(errorMessage);
                }
                const uiManager = new UIManager();
                uiManager.showMessage(successMessage);
                cell.style.backgroundColor = isAddButton ? 'lightgreen' : (row.sectionRowIndex % 2 === 0 ? '#FFF' : '#F2F2F2');
            }
            catch (error) {
                console.error('There was a problem with the fetch operation: ', error);
                const uiManager = new UIManager();
                uiManager.showMessage(errorMessage);
            }
        }));
        return button;
    }
    // ヘッダー行を作成する関数
    createHeaderRow() {
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = "Recommended Tracks";
        headerRow.appendChild(headerCell);
        return headerRow;
    }
    // トラックペアの行を作成する関数
    createRowsForTrackPairs(trackPairs, playlistId) {
        const trackRecommendationManager = new TrackRecommendationManager();
        return trackPairs.map(pair => trackRecommendationManager.createRowForPair(pair, playlistId));
    }
    // テーブルをDOMに追加する関数
    appendTableToDOM(table) {
        const domElements = new DomElements();
        domElements.playlistTracksDiv.appendChild(table);
    }
}
//# sourceMappingURL=TrackRecommendationManager.js.map