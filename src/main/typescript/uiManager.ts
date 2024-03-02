import {PlaylistManager} from './playlistManager'
import {PlaylistIdManager} from './playlistIdManager'
import {Track} from './track'
import {TrackManager} from './trackManager'
import {TrackTable} from './trackTable'

export class UIManager {
    // メッセージを表示するメソッド
    showMessage(message: string) {
        const messageDiv = this.createMessageElement(message);
        this.applyStylesToElement(messageDiv, this.getMessageStyles());
        this.addMessageToDOM(messageDiv);
        this.removeElementAfterDelay(messageDiv, 3000);
    }

    // メッセージ要素を作成するメソッド
    createMessageElement(message: string): HTMLDivElement {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        return messageDiv;
    }

    // メッセージのスタイルを取得するメソッド
    getMessageStyles(): Partial<CSSStyleDeclaration> {
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
    addMessageToDOM(messageDiv: HTMLDivElement): void {
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
    createUITable(visitedPlaylistsDiv: HTMLElement, data: any) {
        // 既存のテーブルを取得または作成
        let table = this.getTable(visitedPlaylistsDiv);
        // 既存のテーブルがある場合は削除
        if (table) {
            visitedPlaylistsDiv.removeChild(table);
        }
        // 新しいテーブルを作成
        table = document.createElement('table');
        visitedPlaylistsDiv.appendChild(table);
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

// フォームの表示を切り替えるメソッド
    toggleFormVisibility(showForm: HTMLElement, hideForm: HTMLElement) {
        showForm.classList.remove('hidden');
        hideForm.classList.add('hidden');
    }

// オプションの変更イベントを監視するメソッド
    addChangeEventToOption(option: HTMLInputElement, showForm: HTMLElement, hideForm: HTMLElement) {
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
    toggleOption(optionId: string, showFormId: string, hideFormId: string) {
        const option = document.getElementById(optionId) as HTMLInputElement;
        const showForm = document.getElementById(showFormId);
        const hideForm = document.getElementById(hideFormId);
        this.addChangeEventToOption(option, showForm, hideForm);
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
        const sideMenu = document.querySelector('.side-menu');
        sideMenu.classList.toggle('open');
    }
    
    // ログイン結果に対応するメッセージのマップ
    private loginMessages: Record<string, string> = {
        'success': 'Spotifyログインに成功しました',
        'failure': 'Spotifyログインに失敗しました'
    };
    
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
    getLoginMessage(loginResult: string): string {
        return this.loginMessages[loginResult];
    }
    
    // 要素にスタイルを適用するメソッド
    applyStylesToElement(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
        Object.assign(element.style, styles);
    }
    
    // 一定時間後に要素を削除するメソッド
    removeElementAfterDelay(element: HTMLElement, delay: number) {
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
            } else {
                // スクロールバーを非表示
                table.style.overflowX = 'auto';
            }
        });
    }
    
    // visitedPlaylistsDivからテーブルを取得する関数
    getTable(visitedPlaylistsDiv: HTMLElement): HTMLTableElement {
        let table = visitedPlaylistsDiv.querySelector('table');
        if (!table) {
            table = document.createElement('table');
            visitedPlaylistsDiv.appendChild(table);
        }
        return table;
    }
    
    // テーブルヘッダーを作成する関数
    createTableHeader(): HTMLTableSectionElement {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = "参照履歴";
        headerRow.appendChild(headerCell);
        thead.appendChild(headerRow);
        return thead;
    }
    
    // テーブルボディを作成する関数
    createTableBody(table: HTMLTableElement, data: any): HTMLTableSectionElement {
        let tableBody = table.querySelector('tbody');
        if (!tableBody) {
            tableBody = document.createElement('tbody');
            table.appendChild(tableBody);
        }
        
        data.forEach((playlist: any) => {
            const row = this.createTableRow(playlist);
            tableBody.appendChild(row);
        });
        
        return tableBody;
    }
    
    // テーブル行を作成する関数
    createTableRow(playlist: any) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = playlist.name;
        row.appendChild(nameCell);
        const playlistManager = new PlaylistManager();
        row.addEventListener('click', () => playlistManager.fetchAndDisplayPlaylistDetails(playlist));
        return row;
    }
    
    // レコメンド曲のデータを処理する関数
    processRecommendationData(data: any) {
        const trackManager = new TrackManager();
        trackManager.logResponseData(data);
        const playlistIdManager = PlaylistIdManager.getInstance();
        if (data.tracks) {
            const filteredTracks = data.tracks.filter((track: any) => !playlistIdManager.playlistTrackIds.includes(track.id));
            trackManager.logRecommendedTracks(filteredTracks);
            this.displayRecommendedTracks(filteredTracks);
        } else {
            console.log("No tracks found in the response.");
        }
    }
    
    // 推奨曲を表示する関数
    displayRecommendedTracks(tracks: any[]) {
        const table = document.createElement('table');
        table.classList.add('recommendations-table');
        const trackManager = new TrackManager();
        table.appendChild(trackManager.createHeaderRow());
        
        const playlistIdManager = PlaylistIdManager.getInstance();
        const trackPairs = trackManager.createTrackPairs(tracks);
        const rows = trackManager.createRowsForTrackPairs(trackPairs, playlistIdManager.playlistId);
        rows.forEach((row: HTMLTableRowElement) => table.appendChild(row));
        
        trackManager.appendTableToDOM(table);
    }
    
    private uiManager: UIManager;
    private playlistIdManager: PlaylistIdManager;
    
    constructor() {
        this.uiManager = this;
        this.playlistIdManager = PlaylistIdManager.getInstance();
    }
    
    // IDに基づいてHTML要素を取得する
    getElementById(id: string): HTMLElement {
        return document.getElementById(id);
    }
    
    // プレイリストフォームを取得する
    get playlistForm(): HTMLFormElement {
        return this.getElementById('playlistForm') as HTMLFormElement;
    }
    
    // プレイリストID入力を取得する
    get playlistIdInput(): HTMLInputElement {
        return this.getElementById('playlistId') as HTMLInputElement;
    }
    
    // プレイリストトラックDivを取得する
    get playlistTracksDiv(): HTMLDivElement {
        return this.getElementById('playlistTracks') as HTMLDivElement;
    }
    
    // 検索フォームを取得する
    get searchForm(): HTMLFormElement {
        return this.getElementById('searchForm') as HTMLFormElement;
    }
    
    // 検索クエリ入力を取得する
    get searchQueryInput(): HTMLInputElement {
        return this.getElementById('searchQuery') as HTMLInputElement;
    }
    
    // 検索結果Divを取得する
    get searchResultsDiv(): HTMLDivElement {
        return this.getElementById('searchResults') as HTMLDivElement;
    }
    
    // フォームに送信イベントを追加する
    addSubmitEventToForm(formId: string, handler: (event: Event) => void): void {
        const form = this.getElementById(formId) as HTMLFormElement;
        form.addEventListener('submit', handler.bind(this));
    }
    
    
    // データが有効かどうかを確認する
    isValidData(data: any): boolean {
        return data && Array.isArray(data.tracks);
    }
    
    // プレイリスト名を表示する
    displayPlaylistName(name: string): void {
        if (name) {
            console.log(`Playlist name: ${name}`);
            const playlistNameElement = document.createElement('h2');
            playlistNameElement.textContent = `${name}`;
            this.playlistTracksDiv.insertBefore(playlistNameElement, this.playlistTracksDiv.firstChild);
        }
    }
    
    // すべてのテーブルをクリアする
    clearAllTables(): void {
        this.playlistTracksDiv.innerHTML = '';
        this.searchResultsDiv.innerHTML = '';
    }
    
    // テーブルを作成する
    createDomTable(tracks: Track[]): void {
        this.clearAllTables();
        const trackTable = new TrackTable(tracks);
        this.playlistTracksDiv.appendChild(trackTable.createTable());
    }
    
    createSearchResultsTable(results: Record<string, any>): void {
        this.clearAllTables();
        if (!Array.isArray(results)) {
            console.error('Expected results to be an array but received', results);
            return;
        }
        const table = this.createTableFromResults(results);
        this.searchResultsDiv.appendChild(table);
    }
    
    createTableFromResults(results: Record<string, any>[]): HTMLTableElement {
        const table = document.createElement('table');
        results.forEach((result: any) => {
            const row = this.createDomTableRow(result);
            table.appendChild(row);
        });
        return table;
    }
    
    // 検索結果の各行を作成する
    createDomTableRow(result: PlaylistSimplified): HTMLTableRowElement {
        const row = document.createElement('tr');
        const td = this.createTableCell(result.name);
        const playlistManager = new PlaylistManager();
        this.addClickListener(td, () => playlistManager.fetchAndDisplayPlaylistDetailsUI(result));
        row.appendChild(td);
        return row;
    }
    
    createTableCell(text: string): HTMLTableCellElement {
        const td = document.createElement('td');
        td.textContent = text;
        return td;
    }
    
    addClickListener(element: HTMLElement, listener: () => void): void {
        element.addEventListener('click', listener);
    }
    
    validateData(data: any): void {
        if (!data || !Array.isArray(data.tracks)) {
            throw new Error('Invalid data: Expected data.tracks to be an array');
        }
    }
    
    displayPlaylistDetails(playlist: any, data: any): void {
        this.playlistTracksDiv.innerHTML = '';
        const trackManager = new TrackManager();
        const playlistNameElement = document.createElement('h2');
        playlistNameElement.textContent = `${playlist.name}`;
        this.playlistTracksDiv.appendChild(playlistNameElement);
        
        if (data && Array.isArray(data.tracks)) {
            const tracks = data.tracks.map((item: any) => new Track(item.playlistTrack.track, item.audioFeatures));
            this.createDomTable(tracks);
            trackManager.calculateTrackAverageAndMode(tracks);
        } else {
            console.error('Expected data.tracks to be an array but received', data);
        }
    }
    
    toggleLoadingAnimation(): void {
        const loadingElement = document.getElementById('loading');
        loadingElement.classList.toggle('hidden');
    }
    
    // プレイリストを表示する
    displayPlaylists(data: any) {
        this.playlistTracksDiv.innerHTML = '';
        if (data && Array.isArray(data)) {
            this.createSearchResultsTable(data);
        } else {
            console.error(`Expected data to be an array but received data of type ${typeof data}`, data);
        }
    }
    
}

export interface PlaylistSimplified {
    id: string;
    name: string;
}

const uiManager = new UIManager();
window.addEventListener('resize', uiManager.checkTableWidth);
uiManager.checkTableWidth();
