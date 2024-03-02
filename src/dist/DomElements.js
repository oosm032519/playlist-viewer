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
import { TrackTable } from './TrackTable';
import { TrackManager } from './TrackManager';
import { Track } from './Track';
export class DomElements {
    constructor() {
        this.handlePlaylistFormSubmit = (event) => {
            // プレイリストフォームの送信イベントハンドラ
            event.preventDefault();
            const playlistIdManager = PlaylistIdManager.getInstance();
            playlistIdManager.playlistId = this.playlistIdInput.value;
            this.fetchPlaylistData(playlistIdManager.playlistId);
        };
    }
    getElementById(id) {
        return document.getElementById(id);
    }
    get playlistForm() {
        return this.getElementById('playlistForm');
    }
    get playlistIdInput() {
        return this.getElementById('playlistId');
    }
    get playlistTracksDiv() {
        return this.getElementById('playlistTracks');
    }
    get searchForm() {
        return this.getElementById('searchForm');
    }
    get searchQueryInput() {
        return this.getElementById('searchQuery');
    }
    get searchResultsDiv() {
        return this.getElementById('searchResults');
    }
    addSubmitEventToForm(formId, handler) {
        const form = this.getElementById(formId);
        form.addEventListener('submit', handler.bind(this));
    }
    fetchDataFromAPI(url, handler) {
        const playlistIdManager = PlaylistIdManager.getInstance();
        playlistIdManager.playlistTrackIds = [];
        this.clearAllTables();
        this.showLoadingAnimation();
        fetch(url)
            .then(TrackTable.handleResponse)
            .then(handler.bind(this))
            .catch(TrackTable.handleError);
    }
    fetchPlaylistData(playlistId) {
        this.fetchDataFromAPI(`/java/playlist/${playlistId}`, this.handlePlaylistData);
    }
    fetchSearchData(searchQuery) {
        this.fetchDataFromAPI(`/java/search/${searchQuery}`, this.handleSearchData);
    }
    handleSearchFormSubmit(event) {
        // 検索フォームの送信イベントハンドラ
        event.preventDefault();
        const playlistIdManager = PlaylistIdManager.getInstance();
        playlistIdManager.playlistId = this.searchQueryInput.value;
        this.fetchSearchData(playlistIdManager.playlistId);
    }
    handlePlaylistData(data) {
        // プレイリストデータの処理
        this.clearAllTables();
        this.processPlaylistData(data);
        this.hideLoadingAnimation();
    }
    handleSearchData(data) {
        // 検索データの処理
        this.clearAllTables();
        this.createSearchResultsTable(data);
        this.hideLoadingAnimation();
    }
    processPlaylistData(data) {
        if (this.isValidData(data)) {
            const tracks = this.createTracks(data);
            this.createTable(tracks);
            const trackManager = new TrackManager();
            trackManager.calculateAverageAndMode(tracks);
            this.displayPlaylistName(data.name);
        }
        else {
            console.error('Expected data.tracks to be an array but received', data);
        }
    }
    isValidData(data) {
        return data && Array.isArray(data.tracks);
    }
    createTracks(data) {
        return data.tracks.map((item) => {
            const playlistIdManager = PlaylistIdManager.getInstance();
            playlistIdManager.playlistTrackIds.push(item.playlistTrack.track.id);
            return new Track(item.playlistTrack.track, item.audioFeatures);
        });
    }
    displayPlaylistName(name) {
        // プレイリスト名の表示
        if (name) {
            console.log(`Playlist name: ${name}`);
            const playlistNameElement = document.createElement('h2');
            playlistNameElement.textContent = `${name}`;
            this.playlistTracksDiv.insertBefore(playlistNameElement, this.playlistTracksDiv.firstChild);
        }
    }
    showLoadingAnimation() {
        // ローディングアニメーションの表示
        document.getElementById('loading').classList.remove('hidden');
    }
    hideLoadingAnimation() {
        // ローディングアニメーションの非表示
        document.getElementById('loading').classList.add('hidden');
    }
    clearAllTables() {
        // すべてのテーブルのクリア
        this.playlistTracksDiv.innerHTML = '';
        this.searchResultsDiv.innerHTML = '';
    }
    createTable(tracks) {
        // テーブルの作成
        this.clearAllTables();
        const trackTable = new TrackTable(tracks);
        this.playlistTracksDiv.appendChild(trackTable.createTable());
    }
    // 検索結果を表示するテーブルを作成する関数
    createSearchResultsTable(results) {
        this.clearAllTables();
        if (!Array.isArray(results)) {
            console.error('Expected results to be an array but received', results);
            results = [];
        }
        const table = document.createElement('table');
        results.forEach((result) => {
            const row = this.createTableRow(result);
            table.appendChild(row);
        });
        this.searchResultsDiv.appendChild(table);
    }
    // 検索結果の各行を作成する関数
    createTableRow(result) {
        const row = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = result.name;
        td.addEventListener('click', () => this.fetchAndDisplayPlaylistDetails(result));
        row.appendChild(td);
        return row;
    }
    // プレイリストの詳細を取得・表示する関数
    fetchPlaylistDetails(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`/java/playlist/${result.id}`);
            if (!response.ok) {
                throw new Error('There was a problem with the fetch operation');
            }
            const data = yield response.json();
            if (!data || !Array.isArray(data.tracks)) {
                throw new Error('Expected data.tracks to be an array but received ' + data);
            }
            return data;
        });
    }
    displayPlaylistDetails(result, data) {
        this.playlistTracksDiv.innerHTML = '';
        const playlistNameElement = document.createElement('h2');
        playlistNameElement.textContent = `${result.name}`;
        this.playlistTracksDiv.appendChild(playlistNameElement);
        const tracks = data.tracks.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
        this.createTable(tracks);
        const trackManager = new TrackManager();
        trackManager.calculateAverageAndMode(tracks);
    }
    fetchAndDisplayPlaylistDetails(result) {
        return __awaiter(this, void 0, void 0, function* () {
            document.getElementById('loading').classList.remove('hidden');
            const playlistIdManager = PlaylistIdManager.getInstance();
            playlistIdManager.playlistId = result.id;
            try {
                const data = yield this.fetchPlaylistDetails(result);
                this.displayPlaylistDetails(result, data);
            }
            catch (error) {
                console.error(error.message);
            }
            finally {
                document.getElementById('loading').classList.add('hidden');
            }
        });
    }
}
//# sourceMappingURL=DomElements.js.map