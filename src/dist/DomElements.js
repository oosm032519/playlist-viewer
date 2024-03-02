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
        // プレイリストフォームの送信イベントハンドラ
        this.handlePlaylistFormSubmit = (event) => {
            event.preventDefault();
            const playlistIdManager = PlaylistIdManager.getInstance();
            playlistIdManager.playlistId = this.playlistIdInput.value;
            this.fetchPlaylistData(playlistIdManager.playlistId);
        };
    }
    // IDに基づいてHTML要素を取得する
    getElementById(id) {
        return document.getElementById(id);
    }
    // プレイリストフォームを取得する
    get playlistForm() {
        return this.getElementById('playlistForm');
    }
    // プレイリストID入力を取得する
    get playlistIdInput() {
        return this.getElementById('playlistId');
    }
    // プレイリストトラックDivを取得する
    get playlistTracksDiv() {
        return this.getElementById('playlistTracks');
    }
    // 検索フォームを取得する
    get searchForm() {
        return this.getElementById('searchForm');
    }
    // 検索クエリ入力を取得する
    get searchQueryInput() {
        return this.getElementById('searchQuery');
    }
    // 検索結果Divを取得する
    get searchResultsDiv() {
        return this.getElementById('searchResults');
    }
    // フォームに送信イベントを追加する
    addSubmitEventToForm(formId, handler) {
        const form = this.getElementById(formId);
        form.addEventListener('submit', handler.bind(this));
    }
    // APIからデータを取得する
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
    // プレイリストデータを取得する
    fetchPlaylistData(playlistId) {
        this.fetchDataFromAPI(`/java/playlist/${playlistId}`, this.handlePlaylistData);
    }
    // 検索データを取得する
    fetchSearchData(searchQuery) {
        this.fetchDataFromAPI(`/java/search/${searchQuery}`, this.handleSearchData);
    }
    // 検索フォームの送信イベントハンドラ
    handleSearchFormSubmit(event) {
        event.preventDefault();
        const playlistIdManager = PlaylistIdManager.getInstance();
        playlistIdManager.playlistId = this.searchQueryInput.value;
        this.fetchSearchData(playlistIdManager.playlistId);
    }
    // プレイリストデータの処理
    handlePlaylistData(data) {
        this.clearAllTables();
        this.processPlaylistData(data);
        this.hideLoadingAnimation();
    }
    // 検索データの処理
    handleSearchData(data) {
        this.clearAllTables();
        this.createSearchResultsTable(data);
        this.hideLoadingAnimation();
    }
    // プレイリストデータの処理
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
    // データが有効かどうかを確認する
    isValidData(data) {
        return data && Array.isArray(data.tracks);
    }
    // トラックを作成する
    createTracks(data) {
        return data.tracks.map((item) => {
            const playlistIdManager = PlaylistIdManager.getInstance();
            playlistIdManager.playlistTrackIds.push(item.playlistTrack.track.id);
            return new Track(item.playlistTrack.track, item.audioFeatures);
        });
    }
    // プレイリスト名を表示する
    displayPlaylistName(name) {
        if (name) {
            console.log(`Playlist name: ${name}`);
            const playlistNameElement = document.createElement('h2');
            playlistNameElement.textContent = `${name}`;
            this.playlistTracksDiv.insertBefore(playlistNameElement, this.playlistTracksDiv.firstChild);
        }
    }
    // ローディングアニメーションを表示する
    showLoadingAnimation() {
        document.getElementById('loading').classList.remove('hidden');
    }
    // ローディングアニメーションを非表示にする
    hideLoadingAnimation() {
        document.getElementById('loading').classList.add('hidden');
    }
    // すべてのテーブルをクリアする
    clearAllTables() {
        this.playlistTracksDiv.innerHTML = '';
        this.searchResultsDiv.innerHTML = '';
    }
    // テーブルを作成する
    createTable(tracks) {
        this.clearAllTables();
        const trackTable = new TrackTable(tracks);
        this.playlistTracksDiv.appendChild(trackTable.createTable());
    }
    // 検索結果を表示するテーブルを作成する
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
    // 検索結果の各行を作成する
    createTableRow(result) {
        const row = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = result.name;
        td.addEventListener('click', () => this.fetchAndDisplayPlaylistDetails(result));
        row.appendChild(td);
        return row;
    }
    // プレイリストの詳細を取得・表示する
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