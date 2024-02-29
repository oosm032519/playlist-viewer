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
    get playlistForm(): HTMLFormElement {
        return document.getElementById('playlistForm') as HTMLFormElement;
    }
    
    get playlistIdInput(): HTMLInputElement {
        return document.getElementById('playlistId') as HTMLInputElement;
    }
    
    get playlistTracksDiv(): HTMLDivElement {
        return document.getElementById('playlistTracks') as HTMLDivElement;
    }
    
    get searchForm(): HTMLFormElement {
        return document.getElementById('searchForm') as HTMLFormElement;
    }
    
    get searchQueryInput(): HTMLInputElement {
        return document.getElementById('searchQuery') as HTMLInputElement;
    }
    
    get searchResultsDiv(): HTMLDivElement {
        return document.getElementById('searchResults') as HTMLDivElement;
    }
    
    fetchData(): void {
        // プレイリストフォームの送信イベントにハンドラを設定
        this.playlistForm.addEventListener('submit', this.handlePlaylistFormSubmit.bind(this));
    }
    
    fetchSearchResults(): void {
        // 検索フォームの送信イベントにハンドラを設定
        this.searchForm.addEventListener('submit', this.handleSearchFormSubmit.bind(this));
    }
    
    fetchPlaylistData(playlistId: string): void {
        // プレイリストデータの取得
        playlistTrackIds = [];
        this.clearAllTables();
        this.showLoadingAnimation();
        fetch(`/java/playlist/${playlistId}`)
            .then(TrackTable.handleResponse)
            .then(this.handlePlaylistData.bind(this))
            .catch(TrackTable.handleError);
    }
    
    fetchSearchData(searchQuery: string): void {
        // 検索データの取得
        playlistTrackIds = [];
        this.clearAllTables();
        this.showLoadingAnimation();
        fetch(`/java/search/${searchQuery}`)
            .then(response => response.json())
            .then(this.handleSearchData.bind(this))
            .catch(error => console.error('There was a problem with the fetch operation: ', error));
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
        // プレイリストデータの詳細な処理
        if (data && Array.isArray(data.tracks)) {
            const tracks = data.tracks.map((item: any) => {
                playlistTrackIds.push(item.playlistTrack.track.id);
                return new Track(item.playlistTrack.track, item.audioFeatures);
            });
            this.createTable(tracks);
            calculateAverageAndMode(tracks);
            this.displayPlaylistName(data.name);
            console.log(`Playlist ID: ${playlistId}`);
            console.log(`Playlist Track IDs: ${playlistTrackIds}`);
        } else {
            console.error('Expected data.tracks to be an array but received', data);
        }
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
    
    createSearchResultsTable(results: PlaylistSimplified[]): void {
        // 検索結果テーブルの作成
        this.clearAllTables();
        const table = document.createElement('table');
        results.forEach(result => {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = result.name;
            td.addEventListener('click', () => {
                document.getElementById('loading').classList.remove('hidden');
                
                playlistId = result.id;
                
                fetch(`/java/playlist/${result.id}`)
                    .then(response => response.json())
                    .then(data => {
                        this.playlistTracksDiv.innerHTML = '';
                        const playlistNameElement = document.createElement('h2');
                        playlistNameElement.textContent = `${result.name}`;
                        this.playlistTracksDiv.appendChild(playlistNameElement);
                        
                        if (data && Array.isArray(data.tracks)) {
                            const tracks = data.tracks.map((item: any) => new Track(item.playlistTrack.track, item.audioFeatures));
                            this.createTable(tracks);
                            calculateAverageAndMode(tracks);
                        } else {
                            console.error('Expected data.tracks to be an array but received', data);
                        }
                        document.getElementById('loading').classList.add('hidden');
                    })
                    .catch(error => console.error('There was a problem with the fetch operation: ', error));
            });
            
            row.appendChild(td);
            table.appendChild(row);
        });
        this.searchResultsDiv.appendChild(table);
    }
}

class Track {
    id: string;
    name: string;
    artists: { name: string }[];
    audioFeatures: {
        tempo: number;
        key: number;
        mode: number;
        acousticness: number;
        danceability: number;
        energy: number;
        liveness: number;
        speechiness: number;
        valence: number;
    };
    
    constructor(track: any, audioFeatures: any) {
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
    
    createTableHeader(): HTMLTableSectionElement {  // テーブルヘッダーの作成
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Track Name', 'Artist Name', 'BPM', 'Key', 'Mode', 'Acousticness', 'Danceability', 'Energy', /* 'Instrumentalness', */ 'Liveness', 'Speechiness', 'Valence'].forEach((text, index) => {
            const th = document.createElement('th');
            th.textContent = text;
            if (descriptions[text]) {
                th.title = descriptions[text];
            }
            
            // クリックイベントの追加
            th.addEventListener('click', (event) => {
                const element = event.target as HTMLElement;
                
                // ソート順の切り替え
                if (element.classList.contains('asc')) {
                    element.classList.replace('asc', 'desc');
                } else if (element.classList.contains('desc')) {
                    element.classList.replace('desc', 'asc');
                } else {
                    element.classList.add('asc');
                }
                
                // 他の列のソート順をリセット
                Array.from(element.parentNode.children)
                    .filter(e => e !== element)
                    .forEach(e => e.classList.remove('asc', 'desc'));
                
                // 行のソート
                const table = th.closest('table') as HTMLTableElement;
                const tbody = table.querySelector('tbody') as HTMLTableSectionElement;
                const sortOrder = th.classList.contains('asc') ? -1 : 1;
                
                const rows = Array.from(tbody.rows);
                rows.sort((a, b) => TrackTable.sortRows(a, b, index, sortOrder));
                
                rows.forEach(row => tbody.appendChild(row));
            });
            
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        return thead;
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

function fetchVisitedPlaylists() {
    // ユーザーの訪問したプレイリストを取得
    fetch('/java/user/visited-playlists', {credentials: 'include'})
        .then(response => response.json())
        .then(data => {
            const visitedPlaylistsDiv = document.getElementById('visitedPlaylists');
            let table = visitedPlaylistsDiv.querySelector('table');
            if (!table) {
                // テーブルが存在しない場合、新たに作成
                table = document.createElement('table');
                visitedPlaylistsDiv.appendChild(table);
            }
            
            // テーブルヘッダーの作成
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headerCell = document.createElement('th');
            headerCell.textContent = "参照履歴";
            headerRow.appendChild(headerCell);
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            let tableBody = table.querySelector('tbody');
            if (!tableBody) {
                // テーブルボディが存在しない場合、新たに作成
                tableBody = document.createElement('tbody');
                table.appendChild(tableBody);
            }
            data.forEach(playlist => {
                // 各プレイリストに対して行を作成
                const row = document.createElement('tr');
                
                const nameCell = document.createElement('td');
                nameCell.textContent = playlist.name;
                row.appendChild(nameCell);
                
                // 行がクリックされたときのイベントリスナーを設定
                row.addEventListener('click', () => {
                    document.getElementById('loading').classList.remove('hidden');
                    
                    // プレイリストの詳細を取得
                    fetch(`/java/playlist/${playlist.id}`)
                        .then(response => response.json())
                        .then(data => {
                            const domElements = new DomElements();
                            domElements.playlistTracksDiv.innerHTML = '';
                            const playlistNameElement = document.createElement('h2');
                            playlistNameElement.textContent = `${playlist.name}`;
                            domElements.playlistTracksDiv.appendChild(playlistNameElement);
                            
                            // プレイリストのトラックを取得し、テーブルを作成
                            if (data && Array.isArray(data.tracks)) {
                                const tracks = data.tracks.map((item: any) => new Track(item.playlistTrack.track, item.audioFeatures));
                                domElements.createTable(tracks);
                            } else {
                                console.error('Expected data.tracks to be an array but received', data);
                            }
                            document.getElementById('loading').classList.add('hidden');
                        })
                        .catch(error => console.error('There was a problem with the fetch operation: ', error));
                });
                
                tableBody.appendChild(row);
            });
            visitedPlaylistsDiv.classList.add('hidden');
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
function fetchUserPlaylists() {
    // ローディングアニメーションを表示
    document.getElementById('loading').classList.remove('hidden');
    
    // プレイリストを取得するAPIを呼び出す
    fetch('/java/spotify/user/playlists')
        .then(response => response.json())
        .then(data => {
            const domElements = new DomElements();
            // プレイリストの表示エリアをクリア
            domElements.playlistTracksDiv.innerHTML = '';
            // プレイリストを表示
            domElements.createSearchResultsTable(data);
            // ローディングアニメーションを非表示にする
            document.getElementById('loading').classList.add('hidden');
        })
        .catch(error => console.error('There was a problem with the fetch operation: ', error));
}

// プレイリスト表示ボタンのクリックイベントに関数を紐付ける
document.getElementById('show-playlists').addEventListener('click', fetchUserPlaylists);

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', () => {
    const domElements = new DomElements();
    // データの取得と検索結果の取得を行う
    domElements.fetchData();
    domElements.fetchSearchResults();
    
    // ダークモードとライトモードの切り替え処理
    const sunIcon = document.getElementById('sun-icon');
    sunIcon.style.transition = 'transform 0.5s';
    sunIcon.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        const rotationDegree = document.body.classList.contains('dark-mode') ? 180 : 0;
        sunIcon.style.transform = `rotate(${rotationDegree}deg)`;
    });
    
    // プレイリストIDオプションと検索クエリオプションの切り替え処理
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
    
    // 訪問したプレイリストの取得
    fetchVisitedPlaylists();
    
    // サイドメニューの開閉処理
    const openButton = document.getElementById('open');
    const closeButton = document.getElementById('close');
    const sideMenu = document.querySelector('.side-menu');
    
    openButton.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
    });
    closeButton.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
    });
});

// 平均値とアーティスト名を元に推奨曲を取得する関数
function fetchRecommendedTracks(averageTempo: number, averageKey: number, averageDanceability: number, averageEnergy: number, averageAcousticness: number, averageLiveness: number, averageSpeechiness: number, averageValence: number, topFiveArtistNames: string[]) {
    // アーティスト名をカンマ区切りの文字列に変換
    const artistNamesParam = topFiveArtistNames.join(',');
    // 推奨曲を取得するAPIを呼び出す
    fetch(`/java/recommendations?tempo=${averageTempo}&key=${averageKey}&danceability=${averageDanceability}&energy=${averageEnergy}&acousticness=${averageAcousticness}&liveness=${averageLiveness}&speechiness=${averageSpeechiness}&valence=${averageValence}&modeArtistNames=${artistNamesParam}`)
        .then(response => response.json())
        .then(data => {
            // レスポンスデータをログに出力
            console.log("Response data:", data);
            if (data.tracks) {
                // プレイリストに基づいた推奨曲をログに出力
                console.log("Recommended tracks based on the playlist:");
                // プレイリストに含まれない曲をフィルタリング
                const filteredTracks = data.tracks.filter((track: any) => !playlistTrackIds.includes(track.id));
                // 各曲の名前とアーティスト名をログに出力
                filteredTracks.forEach((track: any) => {
                    console.log(`- ${track.name} by ${track.artists[0].name}`);
                });
                // プレイリストの曲IDをログに出力
                console.log(playlistTrackIds);
                // 推奨曲を表示
                displayRecommendedTracks(filteredTracks);
            } else {
                // レスポンスに曲が含まれていない場合、ログに出力
                console.log("No tracks found in the response.");
            }
        })
        .catch(error => console.error('There was a problem with the fetch operation: ', error));
}

// 推奨曲を表示する関数
function displayRecommendedTracks(tracks: any[]) {
    // テーブルを作成
    const table = document.createElement('table');
    table.classList.add('recommendations-table');
    // ヘッダーロウを作成
    const headerRow = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.textContent = "Recommended Tracks";
    headerRow.appendChild(headerCell);
    table.appendChild(headerRow);
    
    // 曲をペアに分割
    const trackPairs = [];
    for (let i = 0; i < tracks.length; i += 2) {
        trackPairs.push(tracks.slice(i, i + 2));
    }
    
    // 各ペアに対して行を作成
    trackPairs.forEach((pair: any[]) => {
        const row = document.createElement('tr');
        
        pair.forEach((track: any) => {
            // セルを作成し、曲名とアーティスト名を設定
            const cell = document.createElement('td');
            cell.textContent = `${track.name} by ${track.artists[0].name}`;
            // セルがクリックされたときにSpotifyで曲を開くイベントリスナーを設定
            cell.addEventListener('click', () => {
                window.open(`https://open.spotify.com/track/${track.id}`, '_blank');
            });
            // 追加ボタンと削除ボタンを作成
            const addButton = document.createElement('button');
            addButton.textContent = '+';
            addButton.className = 'track-button';
            const removeButton = document.createElement('button');
            removeButton.textContent = '-';
            removeButton.className = 'track-button';
            
            // 追加ボタンがクリックされたときのイベントリスナーを設定
            addButton.addEventListener('click', () => {
                // プレイリストIDが設定されていない場合、エラーメッセージをログに出力
                if (!playlistId) {
                    console.error('Playlist ID is not set.');
                    return;
                }
                // 曲をプレイリストに追加するAPIを呼び出す
                fetch(`/java/playlist/addTrack?trackId=${track.id}&playlistId=${playlistId}`)
                    .then(response => {
                        // レスポンスが成功した場合、メッセージを表示し、セルの背景色を変更
                        if (response.ok) {
                            showMessage('楽曲を追加しました！');
                            cell.style.backgroundColor = 'lightgreen';
                        } else {
                            // レスポンスが失敗した場合、メッセージを表示
                            showMessage('楽曲を追加できませんでした');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // レスポンスデータをログに出力
                        console.log(data);
                    })
                    .catch(error => {
                        // フェッチ操作で問題が発生した場合、エラーメッセージをログに出力
                        console.error('There was a problem with the fetch operation: ', error);
                    });
            });
            
            // 削除ボタンがクリックされたときのイベントリスナーを設定
            removeButton.addEventListener('click', () => {
                // プレイリストIDが設定されていない場合、エラーメッセージをログに出力
                if (!playlistId) {
                    console.error('Playlist ID is not set.');
                    return;
                }
                // 曲をプレイリストから削除するAPIを呼び出す
                fetch(`/java/playlist/removeTrack?trackId=${track.id}&playlistId=${playlistId}`)
                    .then(response => {
                        // レスポンスが成功した場合、メッセージを表示
                        if (response.ok) {
                            showMessage('楽曲を削除しました！');
                        } else {
                            // レスポンスが失敗した場合、メッセージを表示
                            showMessage('楽曲を削除できませんでした');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // レスポンスデータをログに出力
                        console.log(data);
                    })
                    .catch(error => {
                        // フェッチ操作で問題が発生した場合、エラーメッセージをログに出力
                        console.error('There was a problem with the fetch operation: ', error);
                    });
                // セルの背景色を元に戻す
                const rowIndex = row.sectionRowIndex;
                if (rowIndex % 2 === 0) {
                    cell.style.backgroundColor = '#FFF';
                } else {
                    cell.style.backgroundColor = '#F2F2F2';
                }
            });
            // セルとボタンを行に追加
            row.appendChild(cell);
            row.appendChild(addButton);
            row.appendChild(removeButton);
        });
        // 行をテーブルに追加
        table.appendChild(row);
    });
    // テーブルをDOMに追加
    const domElements = new DomElements();
    domElements.playlistTracksDiv.appendChild(table);
}

// トラックの平均値と最頻値を計算する関数
function calculateAverageAndMode(tracks: Track[]) {
    // 各特性の合計値を初期化
    let totalTempo = 0;
    let totalAcousticness = 0;
    let totalDanceability = 0;
    let totalEnergy = 0;
    let totalLiveness = 0;
    let totalSpeechiness = 0;
    let totalValence = 0;
    // アーティスト名、キー、モードの配列を初期化
    let artistNames: string[] = [];
    let keys: number[] = [];
    let modes: number[] = [];
    // プレイリストのトラックIDを初期化
    playlistTrackIds = [];
    
    // 各トラックに対して特性の合計値を計算し、アーティスト名、キー、モードを配列に追加
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
    
    // 各特性の平均値を計算
    const averageTempo = totalTempo / tracks.length;
    const averageAcousticness = totalAcousticness / tracks.length;
    const averageDanceability = totalDanceability / tracks.length;
    const averageEnergy = totalEnergy / tracks.length;
    const averageLiveness = totalLiveness / tracks.length;
    const averageSpeechiness = totalSpeechiness / tracks.length;
    const averageValence = totalValence / tracks.length;
    
    // アーティスト名の上位5つを取得
    const topFiveArtistNames = getTopFiveModes(artistNames);
    // キーとモードの最頻値を取得
    const modeKey = mode(keys);
    const modeMode = mode(modes);
    
    // 各特性の平均値と最頻値をログに出力
    console.log(`Average Tempo: ${averageTempo}`);
    console.log(`Average Acousticness: ${averageAcousticness}`);
    console.log(`Average Danceability: ${averageDanceability}`);
    console.log(`Average Energy: ${averageEnergy}`);
    console.log(`Average Liveness: ${averageLiveness}`);
    console.log(`Average Speechiness: ${averageSpeechiness}`);
    console.log(`Average Valence: ${averageValence}`);
    console.log(`Mode Key: ${modeKey}`);
    console.log(`Mode Mode: ${modeMode}`);
    console.log(`Top Five Artist Names: ${topFiveArtistNames}`);
    console.log(`Playlist Track IDs: ${playlistTrackIds}`);
    // 推奨曲を取得
    fetchRecommendedTracks(averageTempo, modeKey, averageDanceability, averageEnergy, averageAcousticness, averageLiveness, averageSpeechiness, averageValence, topFiveArtistNames);
}

// 配列の最頻値を取得する関数
function mode(array: any[]) {
    return array.sort((a, b) =>
        array.filter(v => v === a).length
        - array.filter(v => v === b).length
    ).pop();
}

// 配列の上位5つの最頻値を取得する関数
function getTopFiveModes(array: any[]) {
    const frequency = {};
    let modes = [];
    
    // 各要素の出現回数を計算
    for (let i in array) {
        frequency[array[i]] = (frequency[array[i]] || 0) + 1;
    }

    // 出現回数順に要素をソート
    const sortedKeys = Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
    const remainingArtists = sortedKeys.filter(key => frequency[key] === 1);

    // 上位5つの最頻値を取得
    for (let key of sortedKeys) {
        if (modes.length >= 5) break;
        if (frequency[key] > 1) {
            modes.push(key);
        }
    }

    // 最頻値が5つ未満の場合、ランダムに要素を追加
    while (modes.length < 5 && remainingArtists.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingArtists.length);
        const randomArtist = remainingArtists[randomIndex];
        if (!modes.includes(randomArtist)) {
            modes.push(randomArtist);
            remainingArtists.splice(randomIndex, 1);
        }
    }
    
    return modes;
}

// メッセージを表示する関数
function showMessage(message: string) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.bottom = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.padding = '10px';
    messageDiv.style.backgroundColor = '#2EBD59';
    messageDiv.style.color = 'white';
    messageDiv.style.borderRadius = '5px';
    document.body.appendChild(messageDiv);
    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 3000);
}
