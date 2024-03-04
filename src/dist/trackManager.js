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
import { UIManager } from './uiManager';
import { PlaylistIdManager } from './playlistIdManager';
import { MessageManager } from './MessageManager';
export class TrackManager {
    constructor() {
        this.uiManager = new UIManager();
        this.playlistIdManager = PlaylistIdManager.getInstance();
        this.messageManager = new MessageManager();
    }
    calculateAverageAndMode(tracks) {
        const sum = this.calculateSum(tracks);
        const average = this.calculateAverage(sum, tracks.length);
        const mode = this.calculateMode(sum);
        this.fetchRecommendedTracks(average, mode);
    }
    fetchRecommendedTracks(average, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            const artistNamesParam = mode.topFiveArtistNames.join(',');
            const data = yield this.fetchRecommendationsFromAPI(average, mode, artistNamesParam);
            this.uiManager.processRecommendationData(data);
        });
    }
    fetchRecommendationsFromAPI(average, mode, artistNamesParam) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.constructAPIUrl(average, mode, artistNamesParam);
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch recommendations. Status: ${response.status} ${response.statusText}`);
            }
            return yield response.json();
        });
    }
    constructAPIUrl(average, mode, artistNamesParam) {
        return `/java/recommendations?tempo=${average.averageTempo}&key=${mode.modeKey}&danceability=${average.averageDanceability}&energy=${average.averageEnergy}&acousticness=${average.averageAcousticness}&liveness=${average.averageLiveness}&speechiness=${average.averageSpeechiness}&valence=${average.averageValence}&modeArtistNames=${artistNamesParam}`;
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
                yield this.fetchTrack(`/java/playlist/${endpoint}?trackId=${track.id}&playlistId=${playlistId}`);
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
    fetchTrack(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error('There was a problem with the fetch operation');
            }
        });
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
        this.uiManager.playlistTracksDiv.appendChild(table);
    }
    // トラックの合計値を計算する関数
    calculateSum(tracks) {
        let totalTempo = 0;
        let totalAcousticness = 0;
        let totalDanceability = 0;
        let totalEnergy = 0;
        let totalLiveness = 0;
        let totalSpeechiness = 0;
        let totalValence = 0;
        let artistNames = [];
        let keys = [];
        let modes = [];
        let playlistTrackIds = [];
        tracks.forEach(track => {
            totalTempo += track.audioFeatures.tempo;
            totalAcousticness += track.audioFeatures.acousticness;
            totalDanceability += track.audioFeatures.danceability;
            totalEnergy += track.audioFeatures.energy;
            totalLiveness += track.audioFeatures.liveness;
            totalSpeechiness += track.audioFeatures.speechiness;
            totalValence += track.audioFeatures.valence;
            artistNames.push(track.artists[0].name);
            keys.push(track.audioFeatures.key);
            modes.push(track.audioFeatures.mode);
            playlistTrackIds.push(track.id);
        });
        return {
            totalTempo,
            totalAcousticness,
            totalDanceability,
            totalEnergy,
            totalLiveness,
            totalSpeechiness,
            totalValence,
            artistNames,
            keys,
            modes,
            playlistTrackIds
        };
    }
    // 平均値を計算する関数
    calculateAverage(sum, length) {
        return {
            averageTempo: sum.totalTempo / length,
            averageAcousticness: sum.totalAcousticness / length,
            averageDanceability: sum.totalDanceability / length,
            averageEnergy: sum.totalEnergy / length,
            averageLiveness: sum.totalLiveness / length,
            averageSpeechiness: sum.totalSpeechiness / length,
            averageValence: sum.totalValence / length,
        };
    }
    // 最頻値を計算する関数
    calculateMode(sum) {
        return {
            modeKey: this.mode(sum.keys),
            modeMode: this.mode(sum.modes),
            topFiveArtistNames: this.getTopFiveMostFrequentValues(sum.artistNames)
        };
    }
    // 配列の最頻値を取得する関数
    mode(array) {
        return array.sort((a, b) => array.filter(v => v === a).length
            - array.filter(v => v === b).length).pop();
    }
    // 頻度マップを作成する関数
    createFrequencyMap(array) {
        const frequency = {};
        for (const item of array) {
            frequency[item] = (frequency[item] || 0) + 1;
        }
        return frequency;
    }
    // 最頻値を取得する関数
    getMostFrequentValues(frequency, count) {
        const sortedKeys = [...Object.keys(frequency)].sort((a, b) => frequency[b] - frequency[a]);
        return sortedKeys.filter(key => frequency[key] > 1).slice(0, count);
    }
    // 配列からランダムな値を取得する関数
    getRandomValues(array, count) {
        let values = [];
        while (values.length < count && array.length > 0) {
            const randomIndex = Math.floor(Math.random() * array.length);
            const randomValue = array[randomIndex];
            if (!values.includes(randomValue)) {
                values = [...values, randomValue];
                array.splice(randomIndex, 1);
            }
        }
        return values;
    }
    // 最頻値のトップ5を取得する関数
    getTopFiveMostFrequentValues(array) {
        const frequency = this.createFrequencyMap(array);
        const modesCount = 5;
        let modes = this.getMostFrequentValues(frequency, modesCount);
        const remainingArtists = Object.keys(frequency).filter(key => frequency[key] === 1);
        const additionalModesCount = modesCount - modes.length;
        const additionalModes = this.getRandomValues(remainingArtists, additionalModesCount);
        return [...modes, ...additionalModes];
    }
    calculateTrackAverageAndMode(tracks) {
        this.calculateAverageAndMode(tracks);
    }
    // トラックを作成する
    createTracks(data) {
        return data.tracks.map((item) => {
            this.playlistIdManager.playlistTrackIds.push(item.playlistTrack.track.id);
            return new Track(item.playlistTrack.track, item.audioFeatures);
        });
    }
}
//# sourceMappingURL=trackManager.js.map