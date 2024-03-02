var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PlaylistManager } from './playlistManager';
import { PlaylistIdManager } from './playlistIdManager';
import { Track } from './track';
import { TrackManager } from './trackManager';
import { TrackTable } from './trackTable';
export class UIManager {
    // メッセージを表示するメソッド
    showMessage(message) {
        const messageDiv = this.createMessageElement(message);
        this.applyStylesToElement(messageDiv, this.getMessageStyles());
        this.addMessageToDOM(messageDiv);
        this.removeElementAfterDelay(messageDiv, 3000);
    }
    // メッセージ要素を作成するメソッド
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        return messageDiv;
    }
    // メッセージのスタイルを取得するメソッド
    getMessageStyles() {
        return {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px',
            backgroundColor: '#2EBD59',
            color: 'white',
            borderRadius: '5px'
        };
    }
    // メッセージをDOMに追加するメソッド
    addMessageToDOM(messageDiv) {
        document.body.appendChild(messageDiv);
    }
    // ローディングアニメーションを表示するメソッド
    showLoadingAnimation() {
        document.getElementById('loading').classList.remove('hidden');
    }
    // ローディングアニメーションを非表示にするメソッド
    hideLoadingAnimation() {
        document.getElementById('loading').classList.add('hidden');
    }
    // テーブルを作成するメソッド
    createUITable(visitedPlaylistsDiv, data) {
        // テーブルを取得または作成
        let table = this.getTable(visitedPlaylistsDiv);
        // テーブルヘッダーを作成して追加
        table.appendChild(this.createTableHeader());
        // テーブルボディを作成して追加
        table.appendChild(this.createTableBody(table, data));
        // visitedPlaylistsDivを非表示に設定
        visitedPlaylistsDiv.classList.add('hidden');
    }
    // ダークモードとライトモードを切り替えるメソッド
    toggleDarkLightMode() {
        // アイコンを取得
        const sunIcon = document.getElementById('sun-icon');
        // アニメーションを設定
        sunIcon.style.transition = 'transform 0.5s';
        // クリックイベントを追加
        sunIcon.addEventListener('click', () => {
            // ダークモードとライトモードを切り替え
            document.body.classList.toggle('dark-mode');
            document.body.classList.toggle('light-mode');
            // アイコンの回転を設定
            const rotationDegree = document.body.classList.contains('dark-mode') ? 180 : 0;
            sunIcon.style.transform = `rotate(${rotationDegree}deg)`;
        });
    }
    // プレイリスト検索オプションを切り替えるメソッド
    togglePlaylistSearchOption() {
        // オプションを取得
        const playlistIdOption = document.getElementById('playlistIdOption');
        const searchQueryOption = document.getElementById('searchQueryOption');
        const playlistForm = document.getElementById('playlistForm');
        const searchForm = document.getElementById('searchForm');
        // プレイリストIDオプションの変更イベントを追加
        playlistIdOption.addEventListener('change', () => {
            if (playlistIdOption.checked) {
                // プレイリストフォームを表示、検索フォームを非表示に設定
                playlistForm.classList.remove('hidden');
                searchForm.classList.add('hidden');
            }
        });
        // 検索クエリオプションの変更イベントを追加
        searchQueryOption.addEventListener('change', () => {
            if (searchQueryOption.checked) {
                // 検索フォームを表示、プレイリストフォームを非表示に設定
                searchForm.classList.remove('hidden');
                playlistForm.classList.add('hidden');
            }
        });
    }
    // サイドメニューを切り替えるメソッド
    toggleSideMenu() {
        // ボタンを取得
        const openButton = document.getElementById('open');
        const closeButton = document.getElementById('close');
        const sideMenu = document.querySelector('.side-menu');
        // オープンボタンのクリックイベントを追加
        openButton.addEventListener('click', () => {
            sideMenu.classList.toggle('open');
        });
        // クローズボタンのクリックイベントを追加
        closeButton.addEventListener('click', () => {
            sideMenu.classList.toggle('open');
        });
    }
    // ログイン結果メッセージを表示するメソッド
    displayLoginResultMessage() {
        // URLパラメータを取得
        const urlParams = new URLSearchParams(window.location.search);
        const loginResult = urlParams.get('loginResult');
        if (loginResult) {
            let message;
            if (loginResult === 'success') {
                // ログイン成功メッセージ
                message = 'Spotifyログインに成功しました';
            }
            else if (loginResult === 'failure') {
                // ログイン失敗メッセージ
                message = 'Spotifyログインに失敗しました';
            }
            if (message) {
                // メッセージを表示
                uiManager.showMessage(message);
            }
        }
    }
    // 要素にスタイルを適用するメソッド
    applyStylesToElement(element, styles) {
        Object.assign(element.style, styles);
    }
    // 一定時間後に要素を削除するメソッド
    removeElementAfterDelay(element, delay) {
        setTimeout(() => {
            document.body.removeChild(element);
        }, delay);
    }
    // テーブルの幅をチェックする関数
    checkTableWidth() {
        // 全てのテーブルを取得
        const tables = document.querySelectorAll('table');
        tables.forEach((table) => {
            // テーブルの幅がウィンドウの幅より大きい場合
            if (table.offsetWidth > window.innerWidth) {
                // スクロールバーを表示
                table.style.overflowX = 'scroll';
            }
            else {
                // スクロールバーを非表示
                table.style.overflowX = 'auto';
            }
        });
    }
    // visitedPlaylistsDivからテーブルを取得する関数
    getTable(visitedPlaylistsDiv) {
        let table = visitedPlaylistsDiv.querySelector('table');
        if (!table) {
            table = document.createElement('table');
            visitedPlaylistsDiv.appendChild(table);
        }
        return table;
    }
    // テーブルヘッダーを作成する関数
    createTableHeader() {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = "参照履歴";
        headerRow.appendChild(headerCell);
        thead.appendChild(headerRow);
        return thead;
    }
    // テーブルボディを作成する関数
    createTableBody(table, data) {
        let tableBody = table.querySelector('tbody');
        if (!tableBody) {
            tableBody = document.createElement('tbody');
            table.appendChild(tableBody);
        }
        data.forEach((playlist) => {
            const row = this.createTableRow(playlist);
            tableBody.appendChild(row);
        });
        return tableBody;
    }
    // テーブル行を作成する関数
    createTableRow(playlist) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = playlist.name;
        row.appendChild(nameCell);
        const playlistManager = new PlaylistManager();
        row.addEventListener('click', () => playlistManager.fetchAndDisplayPlaylistDetails(playlist));
        return row;
    }
    // レコメンド曲のデータを処理する関数
    processRecommendationData(data) {
        const trackManager = new TrackManager();
        trackManager.logResponseData(data);
        const playlistIdManager = PlaylistIdManager.getInstance();
        if (data.tracks) {
            const filteredTracks = data.tracks.filter((track) => !playlistIdManager.playlistTrackIds.includes(track.id));
            trackManager.logRecommendedTracks(filteredTracks);
            this.displayRecommendedTracks(filteredTracks);
        }
        else {
            console.log("No tracks found in the response.");
        }
    }
    // 推奨曲を表示する関数
    displayRecommendedTracks(tracks) {
        const table = document.createElement('table');
        table.classList.add('recommendations-table');
        const trackManager = new TrackManager();
        table.appendChild(trackManager.createHeaderRow());
        const playlistIdManager = PlaylistIdManager.getInstance();
        const trackPairs = trackManager.createTrackPairs(tracks);
        const rows = trackManager.createRowsForTrackPairs(trackPairs, playlistIdManager.playlistId);
        rows.forEach((row) => table.appendChild(row));
        trackManager.appendTableToDOM(table);
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
    constructor() {
        // プレイリストフォームの送信イベントハンドラ
        this.handlePlaylistFormSubmit = (event) => {
            event.preventDefault();
            const playlistIdManager = PlaylistIdManager.getInstance();
            playlistIdManager.playlistId = this.playlistIdInput.value;
            this.fetchPlaylistData(playlistIdManager.playlistId);
        };
        this.uiManager = this;
        this.playlistIdManager = PlaylistIdManager.getInstance();
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
        this.uiManager.showLoadingAnimation();
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
        this.uiManager.hideLoadingAnimation();
    }
    // 検索データの処理
    handleSearchData(data) {
        this.clearAllTables();
        this.createSearchResultsTable(data);
        this.uiManager.hideLoadingAnimation();
    }
    // プレイリストデータの処理
    processPlaylistData(data) {
        if (this.isValidData(data)) {
            const tracks = this.createTracks(data);
            this.createDomTable(tracks);
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
    // すべてのテーブルをクリアする
    clearAllTables() {
        this.playlistTracksDiv.innerHTML = '';
        this.searchResultsDiv.innerHTML = '';
    }
    // テーブルを作成する
    createDomTable(tracks) {
        this.clearAllTables();
        const trackTable = new TrackTable(tracks);
        this.playlistTracksDiv.appendChild(trackTable.createTable());
    }
    createSearchResultsTable(results) {
        this.clearAllTables();
        if (!Array.isArray(results)) {
            console.error('Expected results to be an array but received', results);
            return;
        }
        const table = this.createTableFromResults(results);
        this.searchResultsDiv.appendChild(table);
    }
    createTableFromResults(results) {
        const table = document.createElement('table');
        results.forEach((result) => {
            const row = this.createDomTableRow(result);
            table.appendChild(row);
        });
        return table;
    }
    // 検索結果の各行を作成する
    createDomTableRow(result) {
        const row = document.createElement('tr');
        const td = this.createTableCell(result.name);
        this.addClickListener(td, () => this.fetchAndDisplayPlaylistDetails(result));
        row.appendChild(td);
        return row;
    }
    createTableCell(text) {
        const td = document.createElement('td');
        td.textContent = text;
        return td;
    }
    addClickListener(element, listener) {
        element.addEventListener('click', listener);
    }
    // プレイリストの詳細を取得・表示する
    fetchPlaylistDetails(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/java/playlist/${result.id}`;
            const data = yield this.fetchData(url);
            this.validateData(data);
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
    validateData(data) {
        if (!data || !Array.isArray(data.tracks)) {
            throw new Error('Invalid data: Expected data.tracks to be an array');
        }
    }
    displayPlaylistDetails(result, data) {
        this.playlistTracksDiv.innerHTML = '';
        const playlistNameElement = document.createElement('h2');
        playlistNameElement.textContent = `${result.name}`;
        this.playlistTracksDiv.appendChild(playlistNameElement);
        const tracks = data.tracks.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
        this.createDomTable(tracks);
        this.calculateTrackAverageAndMode(tracks);
    }
    calculateTrackAverageAndMode(tracks) {
        const trackManager = new TrackManager();
        trackManager.calculateAverageAndMode(tracks);
    }
    fetchAndDisplayPlaylistDetails(result) {
        return __awaiter(this, void 0, void 0, function* () {
            this.uiManager.showLoadingAnimation();
            this.playlistIdManager.playlistId = result.id;
            try {
                yield this.handlePlaylistDetails(result);
            }
            catch (error) {
                console.error(error.message);
            }
            finally {
                this.uiManager.hideLoadingAnimation();
            }
        });
    }
    handlePlaylistDetails(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.fetchPlaylistDetails(result);
            this.displayPlaylistDetails(result, data);
        });
    }
}
const uiManager = new UIManager();
window.addEventListener('resize', uiManager.checkTableWidth);
uiManager.checkTableWidth();
//# sourceMappingURL=uiManager.js.map