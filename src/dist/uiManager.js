import { PlaylistManager } from './playlistManager';
import { PlaylistIdManager } from './playlistIdManager';
import { Track } from './track';
import { TrackManager } from './trackManager';
import { TrackTable } from './trackTable';
export class UIManager {
    // メッセージを表示するメソッド
    showMessage(message) {
        const messageDiv = this.createMessageElement(message);
        this.addMessageToDOM(messageDiv);
        this.removeElementAfterDelay(messageDiv, 3000);
    }
    // メッセージ要素を作成するメソッド
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = 'fixed bottom-5 right-5 p-2.5 bg-green-500 text-white rounded-full';
        return messageDiv;
    }
    // メッセージをDOMに追加するメソッド
    addMessageToDOM(messageDiv) {
        document.body.appendChild(messageDiv);
    }
    // 一定時間後に要素を削除するメソッド
    removeElementAfterDelay(element, delay) {
        setTimeout(() => {
            document.body.removeChild(element);
        }, delay);
    }
    // ローディングアニメーションを表示するメソッド
    showLoadingAnimation() {
        document.getElementById('loading').classList.remove('hidden');
    }
    // ローディングアニメーションを非表示にするメソッド
    hideLoadingAnimation() {
        document.getElementById('loading').classList.add('hidden');
    }
    // 参照履歴テーブルを作成するメソッド
    createUITable(visitedPlaylistsDiv, data) {
        // 既存のテーブルを取得または作成
        let table = this.getTable(visitedPlaylistsDiv);
        // 既存のテーブルがある場合は削除
        if (table) {
            visitedPlaylistsDiv.removeChild(table);
        }
        // 新しいテーブルを作成
        table = document.createElement('table');
        table.classList.add('divide-y', 'divide-gray-200', 'w-full', 'mx-auto', 'mt-6', 'text-center', 'shadow-md', 'rounded-lg', 'overflow-hidden');
        visitedPlaylistsDiv.appendChild(table);
        // テーブルヘッダーを作成して追加
        const thead = this.createTableHeader();
        thead.classList.add('bg-green-500', 'text-white', 'hover:bg-green-600', 'transition-colors', 'duration-300', 'ease-in-out');
        table.appendChild(thead);
        // テーブルボディを作成して追加
        const tbody = this.createTableBody(table, data);
        tbody.classList.add('divide-y', 'divide-gray-200');
        table.appendChild(tbody);
        // visitedPlaylistsDivを非表示に設定
        visitedPlaylistsDiv.classList.add('hidden');
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
    // フォームの表示を切り替えるメソッド
    toggleFormVisibility(showForm, hideForm) {
        showForm.classList.remove('hidden');
        hideForm.classList.add('hidden');
    }
    // オプションの変更イベントを監視するメソッド
    addChangeEventToOption(option, showForm, hideForm) {
        option.addEventListener('change', () => {
            if (option.checked) {
                this.toggleFormVisibility(showForm, hideForm);
            }
        });
    }
    // プレイリスト検索オプションを切り替えるメソッド
    togglePlaylistSearchOption() {
        this.toggleOption('playlistIdOption', 'playlistForm', 'searchForm');
        this.toggleOption('searchQueryOption', 'searchForm', 'playlistForm');
    }
    // オプションの切り替えを行うメソッド
    toggleOption(optionId, showFormId, hideFormId) {
        const option = document.getElementById(optionId);
        const showForm = document.getElementById(showFormId);
        const hideForm = document.getElementById(hideFormId);
        const labelForOption = document.querySelector(`label[for="${optionId}"]`);
        this.addChangeEventToOption(option, showForm, hideForm);
        // すべてのラジオボタンを取得
        const allOptions = document.querySelectorAll(`input[name="${option.name}"]`);
        allOptions.forEach((otherOption) => {
            otherOption.addEventListener('change', () => {
                if (otherOption !== option) {
                    // 他のラジオボタンが選択されたとき、このラジオボタンのスタイルをデフォルトに戻す
                    labelForOption.classList.remove('bg-green-500', 'text-white');
                    labelForOption.classList.add('bg-white', 'text-green-500');
                }
            });
        });
        option.addEventListener('change', () => {
            if (option.checked) {
                // ラジオボタンが選択されたとき、スタイルを変更
                labelForOption.classList.remove('bg-white', 'text-green-500');
                labelForOption.classList.add('bg-green-500', 'text-white');
            }
        });
    }
    // サイドメニューを切り替えるメソッド
    toggleSideMenu() {
        // ボタンを取得
        const openButton = document.getElementById('open');
        const closeButton = document.getElementById('close');
        // オープンボタンのクリックイベントを追加
        openButton.addEventListener('click', this.toggleMenuClass);
        // クローズボタンのクリックイベントを追加
        closeButton.addEventListener('click', this.toggleMenuClass);
    }
    // サイドメニューのクラスを切り替えるメソッド
    toggleMenuClass() {
        const sideMenu = document.getElementById('side-menu');
        sideMenu.classList.toggle('translate-x-full');
    }
    // ログイン結果メッセージを表示するメソッド
    displayLoginResultMessage() {
        // URLパラメータを取得
        const urlParams = new URLSearchParams(window.location.search);
        const loginResult = urlParams.get('loginResult');
        // メッセージを取得
        const message = this.getLoginMessage(loginResult);
        // メッセージが存在する場合、それを表示
        if (message) {
            this.showMessage(message);
        }
    }
    // ログイン結果に対応するメッセージを取得するメソッド
    getLoginMessage(loginResult) {
        return this.loginMessages[loginResult];
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
            row.classList.add('border', 'border-gray-300', 'odd:bg-white', 'even:bg-gray-100', 'hover:bg-gray-200', 'transition-colors', 'duration-300', 'ease-in-out');
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
        // Tailwind CSS classes for styling the table
        table.classList.add('recommendations-table', 'divide-x', 'divide-y', 'divide-gray-200', 'w-full', 'mx-auto', 'mt-6', 'text-center', 'shadow-md', 'rounded-lg', 'overflow-hidden');
        const trackManager = new TrackManager();
        table.appendChild(trackManager.createHeaderRow());
        const playlistIdManager = PlaylistIdManager.getInstance();
        const trackPairs = trackManager.createTrackPairs(tracks);
        const rows = trackManager.createRowsForTrackPairs(trackPairs, playlistIdManager.playlistId);
        rows.forEach((row) => {
            row.classList.add('hover:bg-gray-200', 'h-20', 'border', 'border-gray-300', 'odd:bg-white', 'even:bg-gray-100', 'transition-colors', 'duration-300', 'ease-in-out');
            table.appendChild(row);
        });
        trackManager.appendTableToDOM(table);
    }
    constructor() {
        // ログイン結果に対応するメッセージのマップ
        this.loginMessages = {
            'success': 'Spotifyログインに成功しました',
            'failure': 'Spotifyログインに失敗しました'
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
    // プレイリストトラックDivを取得する
    get playlistTracksDiv() {
        return this.getElementById('playlistTracks');
    }
    // 検索フォームを取得する
    get searchForm() {
        return this.getElementById('searchForm');
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
    // データが有効かどうかを確認する
    isValidData(data) {
        return data && Array.isArray(data.tracks);
    }
    // プレイリスト名を表示する
    displayPlaylistName(name) {
        if (name) {
            console.log(`Playlist name: ${name}`);
            const playlistNameElement = document.createElement('h2');
            playlistNameElement.textContent = `${name}`;
            playlistNameElement.classList.add('text-4xl', 'font-bold', 'text-green-500', 'mt-4', 'font-sans', 'font-semibold', 'w-full', 'text-center', 'border-b-2', 'border-green-500');
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
        table.classList.add('min-w-full', 'divide-y', 'divide-gray-200', 'shadow-md', 'rounded-lg', 'overflow-hidden');
        results.forEach((result) => {
            const row = this.createDomTableRow(result);
            table.appendChild(row);
        });
        return table;
    }
    // 検索結果の各行を作成する
    createDomTableRow(result) {
        const row = document.createElement('tr');
        row.classList.add('odd:bg-white', 'even:bg-gray-100', 'hover:bg-gray-200', 'transition-colors', 'duration-300', 'ease-in-out');
        const td = this.createTableCell(result.name);
        const playlistManager = new PlaylistManager();
        this.addClickListener(td, () => playlistManager.fetchAndDisplayPlaylistDetailsUI(result));
        row.appendChild(td);
        return row;
    }
    createTableCell(text) {
        const td = document.createElement('td');
        td.textContent = text;
        td.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium', 'text-gray-900');
        return td;
    }
    addClickListener(element, listener) {
        element.addEventListener('click', listener);
    }
    validateData(data) {
        if (!data || !Array.isArray(data.tracks)) {
            throw new Error('Invalid data: Expected data.tracks to be an array');
        }
    }
    displayPlaylistDetails(playlist, data) {
        this.playlistTracksDiv.innerHTML = '';
        const trackManager = new TrackManager();
        const playlistNameElement = document.createElement('h2');
        playlistNameElement.textContent = `${playlist.name}`;
        this.playlistTracksDiv.appendChild(playlistNameElement);
        if (data && Array.isArray(data.tracks)) {
            const tracks = data.tracks.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
            this.createDomTable(tracks);
            trackManager.calculateTrackAverageAndMode(tracks);
        }
        else {
            console.error('Expected data.tracks to be an array but received', data);
        }
    }
    toggleLoadingAnimation() {
        const loadingElement = document.getElementById('loading');
        loadingElement.classList.toggle('hidden');
    }
    // プレイリストを表示する
    displayPlaylists(data) {
        this.playlistTracksDiv.innerHTML = '';
        if (data && Array.isArray(data)) {
            this.createSearchResultsTable(data);
        }
        else {
            console.error(`Expected data to be an array but received data of type ${typeof data}`, data);
        }
    }
}
const uiManager = new UIManager();
window.addEventListener('resize', uiManager.checkTableWidth);
uiManager.checkTableWidth();
//# sourceMappingURL=uiManager.js.map