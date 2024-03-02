const descriptions = {
    'Acousticness': 'アコースティック感。1に近いほどアコースティック。',
    'Danceability': '踊りやすさ。1に近いほど踊りやすい。',
    'Energy': '曲の激しさ。1に近いほど激しい。',
    'Liveness': 'ライブ感。1に近いほどライブらしい。',
    'Speechiness': '曲中の話し言葉の存在度合い。1に近いほど話し言葉が多い。',
    'Valence': '明るさ。1に近いほど明るい。'
};

interface PlaylistSimplified {
    id: string;
    name: string;
}

let playlistId: string;
let playlistTrackIds: string[] = [];

class DomElements {
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
        playlistTrackIds = [];
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
    
    handlePlaylistFormSubmit(event: Event): void {
        // プレイリストフォームの送信イベントハンドラ
        event.preventDefault();
        playlistId = this.playlistIdInput.value;
        this.fetchPlaylistData(playlistId);
    }
    
    handleSearchFormSubmit(event: Event): void {
        // 検索フォームの送信イベントハンドラ
        event.preventDefault();
        playlistId = this.searchQueryInput.value;
        this.fetchSearchData(playlistId);
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
            calculateAverageAndMode(tracks);
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
            playlistTrackIds.push(item.playlistTrack.track.id);
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
    createSearchResultsTable(results: PlaylistSimplified[]): void {
        this.clearAllTables();
        const table = document.createElement('table');
        results.forEach(result => {
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
        calculateAverageAndMode(tracks);
    }
    
    async fetchAndDisplayPlaylistDetails(result: PlaylistSimplified): Promise<void> {
        document.getElementById('loading').classList.remove('hidden');
        playlistId = result.id;
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

interface IArtist {
    name: string;
}

interface IAudioFeatures {
    tempo: number;
    key: number;
    mode: number;
    acousticness: number;
    danceability: number;
    energy: number;
    liveness: number;
    speechiness: number;
    valence: number;
}

interface ITrack {
    id: string;
    name: string;
    artists: IArtist[];
}

class Track {
    id: string;
    name: string;
    artists: IArtist[];
    audioFeatures: IAudioFeatures;

    constructor(track: ITrack, audioFeatures: IAudioFeatures) {
        this.id = track.id;
        this.name = track.name;
        this.artists = track.artists;
        this.audioFeatures = audioFeatures;
    }
}

class TrackTable {
    tracks: Track[];  // トラックの配列
    
    constructor(tracks: Track[]) {  // コンストラクタ
        this.tracks = tracks;
    }
    
    static handleResponse(response: Response) {  // レスポンスのハンドリング
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    
    static handleError(error: Error) {  // エラーハンドリング
        console.error('There was a problem with the fetch operation: ', error);
    }
    
    createTableHeader(): HTMLTableSectionElement {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Track Name', 'Artist Name', 'BPM', 'Key', 'Mode', 'Acousticness', 'Danceability', 'Energy', /* 'Instrumentalness', */ 'Liveness', 'Speechiness', 'Valence'].forEach((text, index) => {
            const th = this.createHeaderCell(text, index);
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        return thead;
    }
    
    createHeaderCell(text: string, index: number): HTMLTableHeaderCellElement {
        const th = document.createElement('th');
        th.textContent = text;
        if (descriptions[text]) {
            th.title = descriptions[text];
        }
        th.addEventListener('click', (event) => this.handleHeaderCellClick(event, index));
        return th;
    }
    
    handleHeaderCellClick(event: Event, index: number): void {
        const element = event.target as HTMLElement;
        this.toggleSortOrder(element);
        this.resetSortOrderForOtherColumns(element);
        this.sortRows(element, index);
    }
    
    toggleSortOrder(element: HTMLElement): void {
        if (element.classList.contains('asc')) {
            element.classList.replace('asc', 'desc');
        } else if (element.classList.contains('desc')) {
            element.classList.replace('desc', 'asc');
        } else {
            element.classList.add('asc');
        }
    }
    
    resetSortOrderForOtherColumns(element: HTMLElement): void {
        Array.from(element.parentNode.children)
            .filter(e => e !== element)
            .forEach(e => e.classList.remove('asc', 'desc'));
    }
    
    sortRows(element: HTMLElement, index: number): void {
        const table = element.closest('table') as HTMLTableElement;
        const tbody = table.querySelector('tbody') as HTMLTableSectionElement;
        const sortOrder = element.classList.contains('asc') ? -1 : 1;
        
        const rows = Array.from(tbody.rows);
        rows.sort((a, b) => TrackTable.sortRows(a, b, index, sortOrder));
        
        rows.forEach(row => tbody.appendChild(row));
    }
    
    static sortRows(a: HTMLTableRowElement, b: HTMLTableRowElement, columnIndex: number, sortOrder: number): number {  // 行のソート
        const cellA = TrackTable.getSortValue(a.cells[columnIndex].textContent, columnIndex);
        const cellB = TrackTable.getSortValue(b.cells[columnIndex].textContent, columnIndex);
        
        return (cellA > cellB ? 1 : -1) * sortOrder;
    }
    
    private createTableBody(): HTMLTableSectionElement {  // テーブルボディの作成
        const tbody = document.createElement('tbody');
        this.tracks.forEach(track => {
            const row = this.createRow(track);
            tbody.appendChild(row);
        });
        return tbody;
    }
    
    private createRow(track: Track): HTMLTableRowElement {  // 行の作成
        const row = document.createElement('tr');
        [track.name, track.artists[0].name, track.audioFeatures.tempo, this.keyToNote(track.audioFeatures.key), track.audioFeatures.mode, track.audioFeatures.acousticness, track.audioFeatures.danceability, track.audioFeatures.energy, /* track.audioFeatures.instrumentalness, */ track.audioFeatures.liveness, track.audioFeatures.speechiness, track.audioFeatures.valence].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text.toString();
            row.appendChild(td);
        });
        return row;
    }
    
    private keyToNote(key: number): string {  // キーを音符に変換
        const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return NOTES[key];
    }
    
    static getSortValue(cell: string | number, columnIndex: number): string | number {  // ソート値の取得
        const COLUMN_INDEX_NAME_ARTIST = 0;
        const COLUMN_INDEX_OTHERS = 1;
        const COLUMN_INDEX_KEY = 3;
        const COLUMN_INDEX_MODE = 4;
        if (columnIndex === COLUMN_INDEX_NAME_ARTIST || columnIndex === COLUMN_INDEX_OTHERS || columnIndex === COLUMN_INDEX_KEY || columnIndex === COLUMN_INDEX_MODE) {
            return cell;
        } else {
            return parseFloat(cell as string);
        }
    }
    
    createTable(): HTMLTableElement {  // テーブルの作成
        const table = document.createElement('table');
        table.classList.add('playlist-table');
        table.appendChild(this.createTableHeader());
        table.appendChild(this.createTableBody());
        return table;
    }
}

window.addEventListener('resize', checkTableWidth);

function checkTableWidth() {
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

checkTableWidth();

function createTable(visitedPlaylistsDiv: HTMLElement, data: any) {
    let table = getTable(visitedPlaylistsDiv);
    table.appendChild(createTableHeader());
    table.appendChild(createTableBody(table, data));
    visitedPlaylistsDiv.classList.add('hidden');
}

function getTable(visitedPlaylistsDiv: HTMLElement): HTMLTableElement {
    let table = visitedPlaylistsDiv.querySelector('table');
    if (!table) {
        table = document.createElement('table');
        visitedPlaylistsDiv.appendChild(table);
    }
    return table;
}

function createTableHeader(): HTMLTableSectionElement {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.textContent = "参照履歴";
    headerRow.appendChild(headerCell);
    thead.appendChild(headerRow);
    return thead;
}

function createTableBody(table: HTMLTableElement, data: any): HTMLTableSectionElement {
    let tableBody = table.querySelector('tbody');
    if (!tableBody) {
        tableBody = document.createElement('tbody');
        table.appendChild(tableBody);
    }

    data.forEach((playlist: any) => {
        const row = createTableRow(playlist);
        tableBody.appendChild(row);
    });

    return tableBody;
}

function createTableRow(playlist: any) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = playlist.name;
    row.appendChild(nameCell);
    row.addEventListener('click', () => fetchAndDisplayPlaylistDetails(playlist));
    return row;
}

function fetchAndDisplayPlaylistDetails(playlist: any) {
    document.getElementById('loading').classList.remove('hidden');
    fetch(`/java/playlist/${playlist.id}`)
        .then(response => response.json())
        .then(data => {
            const domElements = new DomElements();
            domElements.playlistTracksDiv.innerHTML = '';
            const playlistNameElement = document.createElement('h2');
            playlistNameElement.textContent = `${playlist.name}`;
            domElements.playlistTracksDiv.appendChild(playlistNameElement);

            if (data && Array.isArray(data.tracks)) {
                const tracks = data.tracks.map((item: any) => new Track(item.playlistTrack.track, item.audioFeatures));
                domElements.createTable(tracks);
            } else {
                console.error('Expected data.tracks to be an array but received', data);
            }
            document.getElementById('loading').classList.add('hidden');
        })
        .catch(error => console.error('There was a problem with the fetch operation: ', error));
}

function fetchVisitedPlaylists() {
    fetch('/java/user/visited-playlists', {credentials: 'include'})
        .then(response => response.json())
        .then(data => {
            const visitedPlaylistsDiv = document.getElementById('visitedPlaylists');
            createTable(visitedPlaylistsDiv, data);
        });
}

document.getElementById('clock-icon').addEventListener('click', function () {
    const visitedPlaylistsDiv = document.getElementById('visitedPlaylists');
    visitedPlaylistsDiv.classList.toggle('hidden');
    const button = this as HTMLButtonElement;
    if (button.textContent === '参照履歴を表示') {
        button.textContent = '参照履歴を非表示';
    } else {
        button.textContent = '参照履歴を表示';
    }
});

document.getElementById('spotify-login').addEventListener('click', function () {
    fetch('/java/authorize')
        .then(response => response.text())
        .then(uri => {
            console.log("認証が完了しました");
            console.log(uri);
            window.location.href = uri;
        })
        .catch(error => console.error('There was a problem with the fetch operation: ', error));
});

// ユーザーのプレイリストを取得する関数
async function fetchUserPlaylists() {
    try {
        showLoadingAnimation();
        const data = await fetchPlaylistsFromAPI();
        displayPlaylists(data);
    } catch (error) {
        showMessage(error.message);
    } finally {
        hideLoadingAnimation();
    }
}

// APIからプレイリストを取得する関数
async function fetchPlaylistsFromAPI() {
    const response = await fetch('/java/spotify/user/playlists');
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }
    return response.json();
}

// プレイリストを表示する関数
function displayPlaylists(data: any) {
    const domElements = new DomElements();
    domElements.playlistTracksDiv.innerHTML = '';
    domElements.createSearchResultsTable(data);
}

// ローディングアニメーションを表示する関数
function showLoadingAnimation() {
    document.getElementById('loading').classList.remove('hidden');
}

// ローディングアニメーションを非表示にする関数
function hideLoadingAnimation() {
    document.getElementById('loading').classList.add('hidden');
}

// プレイリスト表示ボタンのクリックイベントに関数を紐付ける
document.getElementById('show-playlists').addEventListener('click', fetchUserPlaylists);

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', () => {
    const domElements = new DomElements();
    domElements.addSubmitEventToForm('playlistForm', domElements.handlePlaylistFormSubmit);
    domElements.addSubmitEventToForm('searchForm', domElements.handleSearchFormSubmit);

    toggleDarkLightMode();
    togglePlaylistSearchOption();
    fetchVisitedPlaylists();
    toggleSideMenu();
    displayLoginResultMessage();
});

function toggleDarkLightMode() {
    const sunIcon = document.getElementById('sun-icon');
    sunIcon.style.transition = 'transform 0.5s';
    sunIcon.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        const rotationDegree = document.body.classList.contains('dark-mode') ? 180 : 0;
        sunIcon.style.transform = `rotate(${rotationDegree}deg)`;
    });
}

function togglePlaylistSearchOption() {
    const playlistIdOption = document.getElementById('playlistIdOption') as HTMLInputElement;
    const searchQueryOption = document.getElementById('searchQueryOption') as HTMLInputElement;
    const playlistForm = document.getElementById('playlistForm');
    const searchForm = document.getElementById('searchForm');
    playlistIdOption.addEventListener('change', () => {
        if (playlistIdOption.checked) {
            playlistForm.classList.remove('hidden');
            searchForm.classList.add('hidden');
        }
    });
    searchQueryOption.addEventListener('change', () => {
        if (searchQueryOption.checked) {
            searchForm.classList.remove('hidden');
            playlistForm.classList.add('hidden');
        }
    });
}

function toggleSideMenu() {
    const openButton = document.getElementById('open');
    const closeButton = document.getElementById('close');
    const sideMenu = document.querySelector('.side-menu');
    
    openButton.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
    });
    closeButton.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
    });
}

function displayLoginResultMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const loginResult = urlParams.get('loginResult');
    
    if (loginResult) {
        let message;
        if (loginResult === 'success') {
            message = 'Spotifyログインに成功しました';
        } else if (loginResult === 'failure') {
            message = 'Spotifyログインに失敗しました';
        }
        if (message) {
            showMessage(message);
        }
    }
}

async function fetchRecommendedTracks(averageTempo: number, averageKey: number, averageDanceability: number, averageEnergy: number, averageAcousticness: number, averageLiveness: number, averageSpeechiness: number, averageValence: number, topFiveArtistNames: string[]) {
    const artistNamesParam = topFiveArtistNames.join(',');
    const data = await fetchRecommendationsFromAPI(averageTempo, averageKey, averageDanceability, averageEnergy, averageAcousticness, averageLiveness, averageSpeechiness, averageValence, artistNamesParam);
    processRecommendationData(data);
}

async function fetchRecommendationsFromAPI(averageTempo: number, averageKey: number, averageDanceability: number, averageEnergy: number, averageAcousticness: number, averageLiveness: number, averageSpeechiness: number, averageValence: number, artistNamesParam: string) {
    const response = await fetch(`/java/recommendations?tempo=${averageTempo}&key=${averageKey}&danceability=${averageDanceability}&energy=${averageEnergy}&acousticness=${averageAcousticness}&liveness=${averageLiveness}&speechiness=${averageSpeechiness}&valence=${averageValence}&modeArtistNames=${artistNamesParam}`);
    if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
    }
    return response.json();
}

function processRecommendationData(data: any) {
    logResponseData(data);
    if (data.tracks) {
        const filteredTracks = data.tracks.filter((track: any) => !playlistTrackIds.includes(track.id));
        logRecommendedTracks(filteredTracks);
        displayRecommendedTracks(filteredTracks);
    } else {
        console.log("No tracks found in the response.");
    }
}

function logResponseData(data: any) {
    console.log("Response data:", data);
}

function logRecommendedTracks(tracks: any[]) {
    console.log("Recommended tracks based on the playlist:");
    tracks.forEach((track: any) => {
        console.log(`- ${track.name} by ${track.artists[0].name}`);
    });
    console.log(playlistTrackIds);
}

function createTrackPairs(tracks: any[]) {
    const trackPairs = [];
    for (let i = 0; i < tracks.length; i += 2) {
        trackPairs.push(tracks.slice(i, i + 2));
    }
    return trackPairs;
}

function createRowForPair(pair: any[], playlistId: string) {
    const row = document.createElement('tr');
    pair.forEach((track: any) => {
        const cell = createCellForTrack(track);
        const addButton = createAddButton(track, playlistId, cell);
        const removeButton = createRemoveButton(track, playlistId, cell, row);
        row.appendChild(cell);
        row.appendChild(addButton);
        row.appendChild(removeButton);
    });
    return row;
}

function createCellForTrack(track: any) {
    const cell = document.createElement('td');
    cell.textContent = `${track.name} by ${track.artists[0].name}`;
    cell.addEventListener('click', () => {
        window.open(`https://open.spotify.com/track/${track.id}`, '_blank');
    });
    return cell;
}

function createTrackButton(track: any, playlistId: string, cell: HTMLElement, row: HTMLTableRowElement, isAddButton: boolean) {
    const button = document.createElement('button');
    button.textContent = isAddButton ? '+' : '-';
    button.className = 'track-button';
    button.addEventListener('click', () => {
        if (!playlistId) {
            console.error('Playlist ID is not set.');
            return;
        }
        const endpoint = isAddButton ? 'addTrack' : 'removeTrack';
        const successMessage = isAddButton ? '楽曲を追加しました！' : '楽曲を削除しました！';
        const errorMessage = isAddButton ? '楽曲を追加できませんでした' : '楽曲を削除できませんでした';

        fetch(`/java/playlist/${endpoint}?trackId=${track.id}&playlistId=${playlistId}`)
            .then(response => {
                if (response.ok) {
                    showMessage(successMessage);
                    cell.style.backgroundColor = isAddButton ? 'lightgreen' : (row.sectionRowIndex % 2 === 0 ? '#FFF' : '#F2F2F2');
                } else {
                    showMessage(errorMessage);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation: ', error);
            });
    });
    return button;
}

function createAddButton(track: any, playlistId: string, cell: HTMLElement) {
    return createTrackButton(track, playlistId, cell, null, true);
}

function createRemoveButton(track: any, playlistId: string, cell: HTMLElement, row: HTMLTableRowElement) {
    return createTrackButton(track, playlistId, cell, row, false);
}

function createHeaderRow(): HTMLTableRowElement {
    const headerRow = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.textContent = "Recommended Tracks";
    headerRow.appendChild(headerCell);
    return headerRow;
}

function createRowsForTrackPairs(trackPairs: any[], playlistId: string): HTMLTableRowElement[] {
    return trackPairs.map(pair => createRowForPair(pair, playlistId));
}

function appendTableToDOM(table: HTMLTableElement) {
    const domElements = new DomElements();
    domElements.playlistTracksDiv.appendChild(table);
}

// 推奨曲を表示する関数
function displayRecommendedTracks(tracks: any[]) {
    const table = document.createElement('table');
    table.classList.add('recommendations-table');
    
    table.appendChild(createHeaderRow());
    
    const trackPairs = createTrackPairs(tracks);
    const rows = createRowsForTrackPairs(trackPairs, playlistId);
    rows.forEach(row => table.appendChild(row));
    
    appendTableToDOM(table);
}

function calculateSum(tracks: Track[]) {
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

function calculateAverage(sum: any, length: number) {
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

function calculateMode(sum: any) {
    return {
        modeKey: mode(sum.keys),
        modeMode: mode(sum.modes),
        topFiveArtistNames: getTopFiveMostFrequentValues(sum.artistNames)
    };
}

function calculateAverageAndMode(tracks: Track[]) {
    const sum = calculateSum(tracks);
    const average = calculateAverage(sum, tracks.length);
    const mode = calculateMode(sum);

    console.log(`Average Tempo: ${average.averageTempo}`);
    console.log(`Average Acousticness: ${average.averageAcousticness}`);
    console.log(`Average Danceability: ${average.averageDanceability}`);
    console.log(`Average Energy: ${average.averageEnergy}`);
    console.log(`Average Liveness: ${average.averageLiveness}`);
    console.log(`Average Speechiness: ${average.averageSpeechiness}`);
    console.log(`Average Valence: ${average.averageValence}`);
    console.log(`Mode Key: ${mode.modeKey}`);
    console.log(`Mode Mode: ${mode.modeMode}`);
    console.log(`Top Five Artist Names: ${mode.topFiveArtistNames}`);
    console.log(`Playlist Track IDs: ${sum.playlistTrackIds}`);

    fetchRecommendedTracks(average.averageTempo, mode.modeKey, average.averageDanceability, average.averageEnergy, average.averageAcousticness, average.averageLiveness, average.averageSpeechiness, average.averageValence, mode.topFiveArtistNames);
}

// 配列の最頻値を取得する関数
function mode(array: any[]) {
    return array.sort((a, b) =>
        array.filter(v => v === a).length
        - array.filter(v => v === b).length
    ).pop();
}

function createFrequencyMap(array: any[]): Record<string, number> {
    const frequency: Record<string, number> = {};
    for (const item of array) {
        frequency[item] = (frequency[item] || 0) + 1;
    }
    return frequency;
}

function getMostFrequentValues(frequency: Record<string, number>, count: number): string[] {
    const sortedKeys = [...Object.keys(frequency)].sort((a, b) => frequency[b] - frequency[a]);
    return sortedKeys.filter(key => frequency[key] > 1).slice(0, count);
}

function getRandomValues(array: string[], count: number): string[] {
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

function getTopFiveMostFrequentValues(array: string[]): string[] {
    const frequency = createFrequencyMap(array);
    const modesCount = 5;
    let modes = getMostFrequentValues(frequency, modesCount);
    const remainingArtists = Object.keys(frequency).filter(key => frequency[key] === 1);
    const additionalModesCount = modesCount - modes.length;
    const additionalModes = getRandomValues(remainingArtists, additionalModesCount);
    return [...modes, ...additionalModes];
}

function createMessageElement(message: string): HTMLDivElement {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    return messageDiv;
}

function applyStylesToElement(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
    Object.assign(element.style, styles);
}

function removeElementAfterDelay(element: HTMLElement, delay: number) {
    setTimeout(() => {
        document.body.removeChild(element);
    }, delay);
}

function showMessage(message: string) {
    const messageDiv = createMessageElement(message);

    const styles = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px',
        backgroundColor: '#2EBD59',
        color: 'white',
        borderRadius: '5px'
    };

    applyStylesToElement(messageDiv, styles);

    document.body.appendChild(messageDiv);

    removeElementAfterDelay(messageDiv, 3000);
}
