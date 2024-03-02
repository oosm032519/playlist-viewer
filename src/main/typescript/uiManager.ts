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
        const playlistIdOption = document.getElementById('playlistIdOption') as HTMLInputElement;
        const searchQueryOption = document.getElementById('searchQueryOption') as HTMLInputElement;
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
            } else if (loginResult === 'failure') {
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
    
    // トラックの合計値を計算する関数
    calculateSum(tracks: Track[]) {
        let totalTempo = 0;
        let totalAcousticness = 0;
        let totalDanceability = 0;
        let totalEnergy = 0;
        let totalLiveness = 0;
        let totalSpeechiness = 0;
        let totalValence = 0;
        let artistNames: string[] = [];
        let keys: number[] = [];
        let modes: number[] = [];
        let playlistTrackIds: string[] = [];
        
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
    calculateAverage(sum: any, length: number) {
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
    calculateMode(sum: any) {
        return {
            modeKey: this.mode(sum.keys),
            modeMode: this.mode(sum.modes),
            topFiveArtistNames: this.getTopFiveMostFrequentValues(sum.artistNames)
        };
    }
    
    // 配列の最頻値を取得する関数
    mode(array: any[]) {
        return array.sort((a, b) =>
            array.filter(v => v === a).length
            - array.filter(v => v === b).length
        ).pop();
    }
    
    // 頻度マップを作成する関数
    createFrequencyMap(array: any[]): Record<string, number> {
        const frequency: Record<string, number> = {};
        for (const item of array) {
            frequency[item] = (frequency[item] || 0) + 1;
        }
        return frequency;
    }
    
    // 最頻値を取得する関数
    getMostFrequentValues(frequency: Record<string, number>, count: number): string[] {
        const sortedKeys = [...Object.keys(frequency)].sort((a, b) => frequency[b] - frequency[a]);
        return sortedKeys.filter(key => frequency[key] > 1).slice(0, count);
    }
    
    // 配列からランダムな値を取得する関数
    getRandomValues(array: string[], count: number): string[] {
        let values: any[] = [];
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
    getTopFiveMostFrequentValues(array: string[]): string[] {
        const frequency = this.createFrequencyMap(array);
        const modesCount = 5;
        let modes = this.getMostFrequentValues(frequency, modesCount);
        const remainingArtists = Object.keys(frequency).filter(key => frequency[key] === 1);
        const additionalModesCount = modesCount - modes.length;
        const additionalModes = this.getRandomValues(remainingArtists, additionalModesCount);
        return [...modes, ...additionalModes];
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
    
    // APIからデータを取得する
    fetchDataFromAPI(url: string, handler: (data: any) => void): void {
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
    fetchPlaylistData(playlistId: string): void {
        this.fetchDataFromAPI(`/java/playlist/${playlistId}`, this.handlePlaylistData);
    }
    
    // 検索データを取得する
    fetchSearchData(searchQuery: string): void {
        this.fetchDataFromAPI(`/java/search/${searchQuery}`, this.handleSearchData);
    }
    
    // プレイリストフォームの送信イベントハンドラ
    handlePlaylistFormSubmit = (event: Event): void => {
        event.preventDefault();
        const playlistIdManager = PlaylistIdManager.getInstance();
        playlistIdManager.playlistId = this.playlistIdInput.value;
        this.fetchPlaylistData(playlistIdManager.playlistId);
    }
    
    // 検索フォームの送信イベントハンドラ
    handleSearchFormSubmit(event: Event): void {
        event.preventDefault();
        const playlistIdManager = PlaylistIdManager.getInstance();
        playlistIdManager.playlistId = this.searchQueryInput.value;
        this.fetchSearchData(playlistIdManager.playlistId);
    }
    
    // プレイリストデータの処理
    handlePlaylistData(data: any): void {
        this.clearAllTables();
        this.processPlaylistData(data);
        this.uiManager.hideLoadingAnimation();
    }
    
    // 検索データの処理
    handleSearchData(data: any): void {
        this.clearAllTables();
        this.createSearchResultsTable(data);
        this.uiManager.hideLoadingAnimation();
    }
    
    // プレイリストデータの処理
    processPlaylistData(data: any): void {
        if (this.isValidData(data)) {
            const tracks = this.createTracks(data);
            this.createDomTable(tracks);
            const trackManager = new TrackManager();
            trackManager.calculateAverageAndMode(tracks);
            this.displayPlaylistName(data.name);
        } else {
            console.error('Expected data.tracks to be an array but received', data);
        }
    }
    
    // データが有効かどうかを確認する
    isValidData(data: any): boolean {
        return data && Array.isArray(data.tracks);
    }
    
    // トラックを作成する
    createTracks(data: any): Track[] {
        return data.tracks.map((item: any) => {
            const playlistIdManager = PlaylistIdManager.getInstance();
            playlistIdManager.playlistTrackIds.push(item.playlistTrack.track.id);
            return new Track(item.playlistTrack.track, item.audioFeatures);
        });
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
        this.addClickListener(td, () => this.fetchAndDisplayPlaylistDetails(result));
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
    
    // プレイリストの詳細を取得・表示する
    async fetchPlaylistDetails(result: PlaylistSimplified): Promise<any> {
        const url = `/java/playlist/${result.id}`;
        const data = await this.fetchData(url);
        this.validateData(data);
        return data;
    }
    
    async fetchData(url: string): Promise<any> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        return await response.json();
    }
    
    validateData(data: any): void {
        if (!data || !Array.isArray(data.tracks)) {
            throw new Error('Invalid data: Expected data.tracks to be an array');
        }
    }
    
    displayPlaylistDetails(result: PlaylistSimplified, data: any): void {
        this.playlistTracksDiv.innerHTML = '';
        const playlistNameElement = document.createElement('h2');
        playlistNameElement.textContent = `${result.name}`;
        this.playlistTracksDiv.appendChild(playlistNameElement);
        const tracks = data.tracks.map((item: any) => new Track(item.playlistTrack.track, item.audioFeatures));
        this.createDomTable(tracks);
        this.calculateTrackAverageAndMode(tracks);
    }
    
    calculateTrackAverageAndMode(tracks: Track[]): void {
        const trackManager = new TrackManager();
        trackManager.calculateAverageAndMode(tracks);
    }
    
    async fetchAndDisplayPlaylistDetails(result: PlaylistSimplified): Promise<void> {
        this.uiManager.showLoadingAnimation();
        this.playlistIdManager.playlistId = result.id;
        try {
            await this.handlePlaylistDetails(result);
        } catch (error) {
            console.error(error.message);
        } finally {
            this.uiManager.hideLoadingAnimation();
        }
    }
    
    private async handlePlaylistDetails(result: PlaylistSimplified): Promise<void> {
        const data = await this.fetchPlaylistDetails(result);
        this.displayPlaylistDetails(result, data);
    }
}

export interface PlaylistSimplified {
    id: string;
    name: string;
}

const uiManager = new UIManager();
window.addEventListener('resize', uiManager.checkTableWidth);
uiManager.checkTableWidth();
