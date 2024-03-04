var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PlaylistIdManager } from './playlistIdManager';
import { TrackTable } from './trackTable';
import { TrackManager } from './trackManager';
import { MessageManager } from './MessageManager';
import { LoadingAnimationManager } from './loadingAnimationManager';
import { TableManager } from './tableManager';
import { PlaylistDisplayManager } from './playlistDisplayManager';
import { ValidationManager } from './validationManager';
import { ElementManager } from './elementManager';
import { TrackCalculator } from './TrackCalculator';
export class PlaylistManager {
    constructor() {
        this.tableManager = new TableManager();
        this.playlistIdManager = PlaylistIdManager.getInstance();
        this.trackManager = new TrackManager();
        this.messageManager = new MessageManager();
        this.loadingAnimationManager = new LoadingAnimationManager();
        this.playlistDisplayManager = new PlaylistDisplayManager();
        this.validationManager = new ValidationManager();
        this.elementManager = new ElementManager();
        this.trackCalculator = new TrackCalculator();
        // ユーザーのプレイリストを取得する
        this.fetchUserPlaylists = () => this.fetchDataAndUpdateUI(() => this.fetchPlaylistsFromAPI(), (data) => this.playlistDisplayManager.displayPlaylists(data));
        // プレイリストの詳細を取得し表示する
        this.fetchAndDisplayPlaylistDetails = (playlist) => this.fetchDataAndUpdateUI(() => {
            this.playlistIdManager.playlistId = playlist.id;
            return this.fetchPlaylistDuplicate(playlist.id);
        }, (data) => this.playlistDisplayManager.displayPlaylistDetails(playlist, data));
        // プレイリストフォームの送信イベントハンドラ
        this.handlePlaylistFormSubmit = this.createFormSubmitHandler('playlistId', this.fetchPlaylistData.bind(this));
        // 検索フォームの送信イベントハンドラ
        this.handleSearchFormSubmit = this.createFormSubmitHandler('searchQuery', this.fetchSearchData.bind(this));
    }
    // データ取得とUI更新の共通処理
    fetchDataAndUpdateUI(fetchData, updateUI) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.loadingAnimationManager.showLoadingAnimation();
                const data = yield fetchData();
                updateUI(data);
            }
            catch (error) {
                this.messageManager.showMessage(error.message);
            }
            finally {
                this.loadingAnimationManager.hideLoadingAnimation();
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
            this.playlistIdManager.playlistId = playlistId;
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
        this.tableManager.createUITable(visitedPlaylistsDiv, data);
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
            this.loadingAnimationManager.hideLoadingAnimation();
        });
    }
    // プレイリストのトラックIDをリセットする
    resetPlaylistTrackIds() {
        this.playlistIdManager.playlistTrackIds = [];
    }
    // データ取得のためのUIを準備する
    prepareUIForDataFetching() {
        this.tableManager.clearAllTables();
        this.loadingAnimationManager.showLoadingAnimation();
    }
    // プレイリストデータを取得する
    fetchPlaylistData(playlistId) {
        this.playlistIdManager.playlistId = playlistId;
        this.fetchDataFromAPI(`/java/playlist/${playlistId}`, this.handlePlaylistData);
    }
    // 検索データを取得する
    fetchSearchData(searchQuery) {
        this.fetchDataFromAPI(`/java/search/${searchQuery}`, (data) => {
            console.log("Search results:", data); // 検索結果をコンソールに表示
            this.handleSearchData(data);
        });
    }
    // プレイリストの詳細を取得・表示する
    fetchPlaylistDetails(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/java/playlist/${result.id}`;
            this.playlistIdManager.playlistId = result.id;
            const data = yield this.fetchData(url);
            this.validationManager.validateData(data);
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
            this.loadingAnimationManager.toggleLoadingAnimation();
            this.playlistIdManager.playlistId = result.id;
            try {
                yield this.handlePlaylistDetails(result);
            }
            catch (error) {
                console.error(error.message);
                this.messageManager.showMessage(`Error: ${error.message}`);
            }
            finally {
                this.loadingAnimationManager.toggleLoadingAnimation();
            }
        });
    }
    handlePlaylistDetails(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.fetchPlaylistDetails(result);
            this.playlistDisplayManager.displayPlaylistDetails(result, data);
        });
    }
    // フォーム送信イベントハンドラを作成するメソッド
    createFormSubmitHandler(inputId, fetchData) {
        return (event) => {
            event.preventDefault();
            const inputElement = this.elementManager.getElementById(inputId);
            const inputValue = inputElement.value.trim(); // 空白を削除
            if (inputValue) { // 入力が空でないことを確認
                fetchData(inputValue);
            }
            else {
                this.messageManager.showMessage('検索クエリを入力してください');
            }
        };
    }
    // プレイリストデータの処理
    handlePlaylistData(data) {
        this.tableManager.clearAllTables();
        this.processPlaylistData(data);
        this.loadingAnimationManager.hideLoadingAnimation();
    }
    // 検索データの処理
    handleSearchData(data) {
        this.tableManager.clearAllTables();
        if (data && Array.isArray(data)) { // データが配列であることを確認
            this.tableManager.createSearchResultsTable(data);
        }
        else {
            console.error('Expected data to be an array but received', data);
            this.messageManager.showMessage('検索結果が見つかりませんでした');
        }
        this.loadingAnimationManager.hideLoadingAnimation();
    }
    // プレイリストデータの処理
    processPlaylistData(data) {
        if (this.validationManager.isValidData(data)) {
            const tracks = this.trackManager.createTracks(data);
            this.tableManager.createDomTable(tracks);
            this.trackCalculator.calculateAverageAndMode(tracks);
            this.playlistDisplayManager.displayPlaylistName(data.name);
        }
        else {
            console.error('Expected data.tracks to be an array but received', data);
        }
    }
}
//# sourceMappingURL=playlistManager.js.map