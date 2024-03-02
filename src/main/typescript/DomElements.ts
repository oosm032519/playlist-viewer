import {PlaylistIdManager} from './PlaylistIdManager'
import {TrackTable} from './TrackTable'
import {TrackManager} from './TrackManager'
import {Track} from './Track'

export interface PlaylistSimplified {
    id: string;
    name: string;
}

export class DomElements {
    getElementById(id: string): HTMLElement {
        return document.getElementById(id);
    }
    
    get playlistForm(): HTMLFormElement {
        return this.getElementById('playlistForm') as HTMLFormElement;
    }
    
    get playlistIdInput(): HTMLInputElement {
        return this.getElementById('playlistId') as HTMLInputElement;
    }
    
    get playlistTracksDiv(): HTMLDivElement {
        return this.getElementById('playlistTracks') as HTMLDivElement;
    }
    
    get searchForm(): HTMLFormElement {
        return this.getElementById('searchForm') as HTMLFormElement;
    }
    
    get searchQueryInput(): HTMLInputElement {
        return this.getElementById('searchQuery') as HTMLInputElement;
    }
    
    get searchResultsDiv(): HTMLDivElement {
        return this.getElementById('searchResults') as HTMLDivElement;
    }
    
    addSubmitEventToForm(formId: string, handler: (event: Event) => void): void {
        const form = this.getElementById(formId) as HTMLFormElement;
        form.addEventListener('submit', handler.bind(this));
    }
    
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
    
    fetchPlaylistData(playlistId: string): void {
        this.fetchDataFromAPI(`/java/playlist/${playlistId}`, this.handlePlaylistData);
    }
    
    fetchSearchData(searchQuery: string): void {
        this.fetchDataFromAPI(`/java/search/${searchQuery}`, this.handleSearchData);
    }
    
    handlePlaylistFormSubmit = (event: Event): void => {
        // プレイリストフォームの送信イベントハンドラ
        event.preventDefault();
        const playlistIdManager = PlaylistIdManager.getInstance();
        playlistIdManager.playlistId = this.playlistIdInput.value;
        this.fetchPlaylistData(playlistIdManager.playlistId);
    }
    
    handleSearchFormSubmit(event: Event): void {
        // 検索フォームの送信イベントハンドラ
        event.preventDefault();
        const playlistIdManager = PlaylistIdManager.getInstance();
        playlistIdManager.playlistId = this.searchQueryInput.value;
        this.fetchSearchData(playlistIdManager.playlistId);
    }
    
    handlePlaylistData(data: any): void {
        // プレイリストデータの処理
        this.clearAllTables();
        this.processPlaylistData(data);
        this.hideLoadingAnimation();
    }
    
    handleSearchData(data: any): void {
        // 検索データの処理
        this.clearAllTables();
        this.createSearchResultsTable(data);
        this.hideLoadingAnimation();
    }
    
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
    
    isValidData(data: any): boolean {
        return data && Array.isArray(data.tracks);
    }
    
    createTracks(data: any): Track[] {
        return data.tracks.map((item: any) => {
            const playlistIdManager = PlaylistIdManager.getInstance();
            playlistIdManager.playlistTrackIds.push(item.playlistTrack.track.id);
            return new Track(item.playlistTrack.track, item.audioFeatures);
        });
    }
    
    displayPlaylistName(name: string): void {
        // プレイリスト名の表示
        if (name) {
            console.log(`Playlist name: ${name}`);
            const playlistNameElement = document.createElement('h2');
            playlistNameElement.textContent = `${name}`;
            this.playlistTracksDiv.insertBefore(playlistNameElement, this.playlistTracksDiv.firstChild);
        }
    }
    
    showLoadingAnimation(): void {
        // ローディングアニメーションの表示
        document.getElementById('loading').classList.remove('hidden');
    }
    
    hideLoadingAnimation(): void {
        // ローディングアニメーションの非表示
        document.getElementById('loading').classList.add('hidden');
    }
    
    clearAllTables(): void {
        // すべてのテーブルのクリア
        this.playlistTracksDiv.innerHTML = '';
        this.searchResultsDiv.innerHTML = '';
    }
    
    createTable(tracks: Track[]): void {
        // テーブルの作成
        this.clearAllTables();
        const trackTable = new TrackTable(tracks);
        this.playlistTracksDiv.appendChild(trackTable.createTable());
    }

// 検索結果を表示するテーブルを作成する関数
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
    
    // 検索結果の各行を作成する関数
    createTableRow(result: PlaylistSimplified): HTMLTableRowElement {
        const row = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = result.name;
        td.addEventListener('click', () => this.fetchAndDisplayPlaylistDetails(result));
        row.appendChild(td);
        return row;
    }
    
    // プレイリストの詳細を取得・表示する関数
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
