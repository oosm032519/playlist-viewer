import {PlaylistSimplified} from './playlistSimplified'
import {PlaylistIdManager} from './playlistIdManager'
import {TrackTable} from './trackTable'
import {TrackManager} from './trackManager'
import {MessageManager} from './MessageManager'
import {LoadingAnimationManager} from './loadingAnimationManager'
import {TableManager} from './tableManager'
import {PlaylistDisplayManager} from './playlistDisplayManager'
import {ValidationManager} from './validationManager'
import {ElementManager} from './elementManager'
import {TrackCalculator} from './TrackCalculator'

export class PlaylistManager {
    private tableManager = new TableManager();
    private playlistIdManager = PlaylistIdManager.getInstance();
    private trackManager = new TrackManager();
    private messageManager = new MessageManager();
    private loadingAnimationManager = new LoadingAnimationManager();
    private playlistDisplayManager = new PlaylistDisplayManager()
    private validationManager = new ValidationManager();
    private elementManager = new ElementManager();
    private trackCalculator = new TrackCalculator();

    // データ取得とUI更新の共通処理
    async fetchDataAndUpdateUI(fetchData: () => Promise<any>, updateUI: (data: any) => void) {
        try {
            this.loadingAnimationManager.showLoadingAnimation();
            const data = await fetchData();
            updateUI(data);
        } catch (error) {
            this.messageManager.showMessage(error.message);
        } finally {
            this.loadingAnimationManager.hideLoadingAnimation();
        }
    }

    // ユーザーのプレイリストを取得する
    fetchUserPlaylists = () => this.fetchDataAndUpdateUI(
        () => this.fetchPlaylistsFromAPI(),
        (data) => this.playlistDisplayManager.displayPlaylists(data)
    );

    // プレイリストの詳細を取得し表示する
    fetchAndDisplayPlaylistDetails = (playlist: any) => this.fetchDataAndUpdateUI(
        () => {
            this.playlistIdManager.playlistId = playlist.id;
            return this.fetchPlaylistDuplicate(playlist.id)
        },
        (data) => this.playlistDisplayManager.displayPlaylistDetails(playlist, data)
    );
    
    // APIからプレイリストを取得する非同期関数
    async fetchPlaylistsFromAPI() {
        const response = await fetch('/java/spotify/user/playlists');
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message);
        }
        return response.json();
    }
    
    // プレイリストの詳細を取得する
    async fetchPlaylistDuplicate(playlistId: string) {
        this.playlistIdManager.playlistId = playlistId;
        const response = await fetch(`/java/playlist/${playlistId}`);
        if (!response.ok) {
            throw new Error('There was a problem with the fetch operation');
        }
        return await response.json();
    }
    
    // ユーザーが訪れたプレイリストを取得する非同期関数
    async fetchVisitedPlaylists() {
        try {
            const data = await this.fetchDataFromEndpoint('/java/user/visited-playlists');
            this.createAndDisplayTable(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
        }
    }
    
    async fetchDataFromEndpoint(endpoint: string) {
        const response = await fetch(endpoint, {credentials: 'include'});
        this.checkResponseStatus(response);
        return await response.json();
    }
    
    createAndDisplayTable(data: any) {
        const visitedPlaylistsDiv = document.getElementById('visitedPlaylists');
        this.tableManager.createUITable(visitedPlaylistsDiv, data);
    }
    
    // レスポンスのステータスをチェックする関数
    checkResponseStatus(response: Response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    // APIからデータを取得する
    fetchDataFromAPI(url: string, handler: (data: any) => void): void {
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
    resetPlaylistTrackIds(): void {
        this.playlistIdManager.playlistTrackIds = [];
    }

    // データ取得のためのUIを準備する
    prepareUIForDataFetching(): void {
        this.tableManager.clearAllTables();
        this.loadingAnimationManager.showLoadingAnimation();
    }
    
    // プレイリストデータを取得する
    fetchPlaylistData(playlistId: string): void {
        this.playlistIdManager.playlistId = playlistId;
        this.fetchDataFromAPI(`/java/playlist/${playlistId}`, this.handlePlaylistData);
    }
    
    // 検索データを取得する
    fetchSearchData(searchQuery: string): void {
        this.fetchDataFromAPI(`/java/search/${searchQuery}`, (data) => {
            console.log("Search results:", data);  // 検索結果をコンソールに表示
            this.handleSearchData(data);
        });
    }
    
    // プレイリストの詳細を取得・表示する
    async fetchPlaylistDetails(result: PlaylistSimplified): Promise<any> {
        const url = `/java/playlist/${result.id}`;
        this.playlistIdManager.playlistId = result.id;
        const data = await this.fetchData(url);
        this.validationManager.validateData(data);
        return data;
    }
    
    async fetchData(url: string): Promise<any> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        return await response.json();
    }
    
    async fetchAndDisplayPlaylistDetailsUI(result: PlaylistSimplified): Promise<void> {
        this.loadingAnimationManager.toggleLoadingAnimation();
        this.playlistIdManager.playlistId = result.id;
        try {
            await this.handlePlaylistDetails(result);
        } catch (error) {
            console.error(error.message);
            this.messageManager.showMessage(`Error: ${error.message}`);
        } finally {
            this.loadingAnimationManager.toggleLoadingAnimation();
        }
    }
    
    private async handlePlaylistDetails(result: PlaylistSimplified): Promise<void> {
        const data = await this.fetchPlaylistDetails(result);
        this.playlistDisplayManager.displayPlaylistDetails(result, data);
    }

// フォーム送信イベントハンドラを作成するメソッド
    createFormSubmitHandler(inputId: string, fetchData: (id: string) => void): (event: Event) => void {
        return (event: Event) => {
            event.preventDefault();
            const inputElement = this.elementManager.getElementById(inputId) as HTMLInputElement;
            const inputValue = inputElement.value.trim();  // 空白を削除
            if (inputValue) {  // 入力が空でないことを確認
                fetchData(inputValue);
            } else {
                this.messageManager.showMessage('検索クエリを入力してください');
            }
        };
    }

    // プレイリストフォームの送信イベントハンドラ
    handlePlaylistFormSubmit = this.createFormSubmitHandler('playlistId', this.fetchPlaylistData.bind(this));

    // 検索フォームの送信イベントハンドラ
    handleSearchFormSubmit = this.createFormSubmitHandler('searchQuery', this.fetchSearchData.bind(this));
    
    // プレイリストデータの処理
    handlePlaylistData(data: any): void {
        this.tableManager.clearAllTables();
        this.processPlaylistData(data);
        this.loadingAnimationManager.hideLoadingAnimation();
    }

// 検索データの処理
    handleSearchData(data: any): void {
        this.tableManager.clearAllTables();
        if (data && Array.isArray(data)) {  // データが配列であることを確認
            this.tableManager.createSearchResultsTable(data);
        } else {
            console.error('Expected data to be an array but received', data);
            this.messageManager.showMessage('検索結果が見つかりませんでした');
        }
        this.loadingAnimationManager.hideLoadingAnimation();
    }
    
    // プレイリストデータの処理
    processPlaylistData(data: any): void {
        if (this.validationManager.isValidData(data)) {
            const tracks = this.trackManager.createTracks(data);
            this.tableManager.createDomTable(tracks);
            this.trackCalculator.calculateAverageAndMode(tracks);
            this.playlistDisplayManager.displayPlaylistName(data.name);
        } else {
            console.error('Expected data.tracks to be an array but received', data);
        }
    }
}
