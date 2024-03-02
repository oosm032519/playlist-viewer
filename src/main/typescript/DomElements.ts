import {PlaylistIdManager} from './PlaylistIdManager'
import {TrackTable} from './TrackTable'
import {TrackManager} from './TrackManager'
import {Track} from './Track'

export interface PlaylistSimplified {
    id: string;
    name: string;
}

export class DomElements {
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
        this.showLoadingAnimation();
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
        this.hideLoadingAnimation();
    }
    
    // 検索データの処理
    handleSearchData(data: any): void {
        this.clearAllTables();
        this.createSearchResultsTable(data);
        this.hideLoadingAnimation();
    }
    
    // プレイリストデータの処理
    processPlaylistData(data: any): void {
        if (this.isValidData(data)) {
            const tracks = this.createTracks(data);
            this.createTable(tracks);
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
    
    // ローディングアニメーションを表示する
    showLoadingAnimation(): void {
        document.getElementById('loading').classList.remove('hidden');
    }
    
    // ローディングアニメーションを非表示にする
    hideLoadingAnimation(): void {
        document.getElementById('loading').classList.add('hidden');
    }
    
    // すべてのテーブルをクリアする
    clearAllTables(): void {
        this.playlistTracksDiv.innerHTML = '';
        this.searchResultsDiv.innerHTML = '';
    }
    
    // テーブルを作成する
    createTable(tracks: Track[]): void {
        this.clearAllTables();
        const trackTable = new TrackTable(tracks);
        this.playlistTracksDiv.appendChild(trackTable.createTable());
    }

    // 検索結果を表示するテーブルを作成する
    createSearchResultsTable(results: Record<string, any>): void {
        this.clearAllTables();
        if (!Array.isArray(results)) {
            console.error('Expected results to be an array but received', results);
            results = [];
        }
        const table = document.createElement('table');
        results.forEach((result: any) => {
            const row = this.createTableRow(result);
            table.appendChild(row);
        });
        this.searchResultsDiv.appendChild(table);
    }
    
    // 検索結果の各行を作成する
    createTableRow(result: PlaylistSimplified): HTMLTableRowElement {
        const row = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = result.name;
        td.addEventListener('click', () => this.fetchAndDisplayPlaylistDetails(result));
        row.appendChild(td);
        return row;
    }
    
    // プレイリストの詳細を取得・表示する
    async fetchPlaylistDetails(result: PlaylistSimplified): Promise<any> {
        const response = await fetch(`/java/playlist/${result.id}`);
        if (!response.ok) {
            throw new Error('There was a problem with the fetch operation');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data.tracks)) {
            throw new Error('Expected data.tracks to be an array but received ' + data);
        }
        return data;
    }
    
    displayPlaylistDetails(result: PlaylistSimplified, data: any): void {
        this.playlistTracksDiv.innerHTML = '';
        const playlistNameElement = document.createElement('h2');
        playlistNameElement.textContent = `${result.name}`;
        this.playlistTracksDiv.appendChild(playlistNameElement);
        const tracks = data.tracks.map((item: any) => new Track(item.playlistTrack.track, item.audioFeatures));
        this.createTable(tracks);
        const trackManager = new TrackManager();
        trackManager.calculateAverageAndMode(tracks);
    }
    
    async fetchAndDisplayPlaylistDetails(result: PlaylistSimplified): Promise<void> {
        document.getElementById('loading').classList.remove('hidden');
        const playlistIdManager = PlaylistIdManager.getInstance();
        playlistIdManager.playlistId = result.id;
        try {
            const data = await this.fetchPlaylistDetails(result);
            this.displayPlaylistDetails(result, data);
        } catch (error) {
            console.error(error.message);
        } finally {
            document.getElementById('loading').classList.add('hidden');
        }
    }
}
