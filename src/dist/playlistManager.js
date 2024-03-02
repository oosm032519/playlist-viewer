var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UIManager } from './uiManager';
import { PlaylistIdManager } from './playlistIdManager';
import { TrackTable } from './trackTable';
import { TrackManager } from './trackManager';
export class PlaylistManager {
    constructor() {
        this.uiManager = new UIManager();
        this.playlistIdManager = PlaylistIdManager.getInstance();
        this.trackManager = new TrackManager();
        // ユーザーのプレイリストを取得する
        this.fetchUserPlaylists = () => this.fetchDataAndUpdateUI(() => this.fetchPlaylistsFromAPI(), (data) => this.uiManager.displayPlaylists(data));
        // プレイリストの詳細を取得し表示する
        this.fetchAndDisplayPlaylistDetails = (playlist) => this.fetchDataAndUpdateUI(() => this.fetchPlaylistDuplicate(playlist.id), (data) => this.uiManager.displayPlaylistDetails(playlist, data));
        // プレイリストフォームの送信イベントハンドラ
        this.handlePlaylistFormSubmit = this.createFormSubmitHandler('playlistId', this.fetchPlaylistData.bind(this));
        // 検索フォームの送信イベントハンドラ
        this.handleSearchFormSubmit = this.createFormSubmitHandler('searchQuery', this.fetchSearchData.bind(this));
        this.uiManager = new UIManager();
    }
    // データ取得とUI更新の共通処理
    fetchDataAndUpdateUI(fetchData, updateUI) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.uiManager.showLoadingAnimation();
                const data = yield fetchData();
                updateUI(data);
            }
            catch (error) {
                this.uiManager.showMessage(error.message);
            }
            finally {
                this.uiManager.hideLoadingAnimation();
            }
        });
    }
    // APIからプレイリストを取得する非同期関数
    fetchPlaylistsFromAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('/java/spotify/user/playlists');
            if (!response.ok) {
                const message = yield response.text();
                throw new Error(message);
            }
            return response.json();
        });
    }
    // プレイリストの詳細を取得する
    fetchPlaylistDuplicate(playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`/java/playlist/${playlistId}`);
            if (!response.ok) {
                throw new Error('There was a problem with the fetch operation');
            }
            return yield response.json();
        });
    }
    // ユーザーが訪れたプレイリストを取得する非同期関数
    fetchVisitedPlaylists() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.fetchDataFromEndpoint('/java/user/visited-playlists');
                this.createAndDisplayTable(data);
            }
            catch (error) {
                console.error('There was a problem with the fetch operation: ', error);
            }
        });
    }
    fetchDataFromEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(endpoint, { credentials: 'include' });
            this.checkResponseStatus(response);
            return yield response.json();
        });
    }
    createAndDisplayTable(data) {
        const visitedPlaylistsDiv = document.getElementById('visitedPlaylists');
        this.uiManager.createUITable(visitedPlaylistsDiv, data);
    }
    // レスポンスのステータスをチェックする関数
    checkResponseStatus(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    // APIからデータを取得する
    fetchDataFromAPI(url, handler) {
        this.resetPlaylistTrackIds();
        this.prepareUIForDataFetching();
        fetch(url)
            .then(TrackTable.handleResponse)
            .then(handler.bind(this))
            .catch(TrackTable.handleError)
            .finally(() => {
            this.uiManager.hideLoadingAnimation();
        });
    }
    // プレイリストのトラックIDをリセットする
    resetPlaylistTrackIds() {
        this.playlistIdManager.playlistTrackIds = [];
    }
    // データ取得のためのUIを準備する
    prepareUIForDataFetching() {
        this.uiManager.clearAllTables();
        this.uiManager.showLoadingAnimation();
    }
    // プレイリストデータを取得する
    fetchPlaylistData(playlistId) {
        this.fetchDataFromAPI(`/java/playlist/${playlistId}`, this.handlePlaylistData);
    }
    // 検索データを取得する
    fetchSearchData(searchQuery) {
        this.fetchDataFromAPI(`/java/search/${searchQuery}`, this.handleSearchData);
    }
    // プレイリストの詳細を取得・表示する
    fetchPlaylistDetails(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/java/playlist/${result.id}`;
            const data = yield this.fetchData(url);
            this.uiManager.validateData(data);
            return data;
        });
    }
    fetchData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${url}`);
            }
            return yield response.json();
        });
    }
    fetchAndDisplayPlaylistDetailsUI(result) {
        return __awaiter(this, void 0, void 0, function* () {
            this.uiManager.toggleLoadingAnimation();
            this.playlistIdManager.playlistId = result.id;
            try {
                yield this.handlePlaylistDetails(result);
            }
            catch (error) {
                console.error(error.message);
                this.uiManager.showMessage(`Error: ${error.message}`);
            }
            finally {
                this.uiManager.toggleLoadingAnimation();
            }
        });
    }
    handlePlaylistDetails(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.fetchPlaylistDetails(result);
            this.uiManager.displayPlaylistDetails(result, data);
        });
    }
    // 共通の処理を行うメソッド
    handleFormSubmit(event, inputId, fetchData) {
        event.preventDefault();
        const inputElement = this.uiManager.getElementById(inputId);
        const inputValue = inputElement.value;
        fetchData(inputValue);
    }
    // フォーム送信イベントハンドラを作成するメソッド
    createFormSubmitHandler(inputId, fetchData) {
        return (event) => {
            this.handleFormSubmit(event, inputId, fetchData);
        };
    }
    // プレイリストデータの処理
    handlePlaylistData(data) {
        this.uiManager.clearAllTables();
        this.processPlaylistData(data);
        this.uiManager.hideLoadingAnimation();
    }
    // 検索データの処理
    handleSearchData(data) {
        this.uiManager.clearAllTables();
        this.uiManager.createSearchResultsTable(data);
        this.uiManager.hideLoadingAnimation();
    }
    // プレイリストデータの処理
    processPlaylistData(data) {
        if (this.uiManager.isValidData(data)) {
            const tracks = this.trackManager.createTracks(data);
            this.uiManager.createDomTable(tracks);
            this.trackManager.calculateAverageAndMode(tracks);
            this.uiManager.displayPlaylistName(data.name);
        }
        else {
            console.error('Expected data.tracks to be an array but received', data);
        }
    }
}
//# sourceMappingURL=playlistManager.js.map