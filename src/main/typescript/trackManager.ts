import {Track} from './track'
import {UIManager} from './uiManager'
import {PlaylistIdManager} from './playlistIdManager'

export class TrackManager {
    // トラックの平均値と最頻値を計算する
    calculateAverageAndMode(tracks: Track[]) {
        const uiManager = new UIManager();
        // 合計値を計算する
        const sum = uiManager.calculateSum(tracks);
        // 平均値を計算する
        const average = uiManager.calculateAverage(sum, tracks.length);
        // 最頻値を計算する
        const mode = uiManager.calculateMode(sum);
        
        // 平均値と最頻値をログに出力する
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
        
        // レコメンドトラックを取得する
        const trackManager = new TrackManager();
        trackManager.fetchRecommendedTracks(average.averageTempo, mode.modeKey, average.averageDanceability, average.averageEnergy, average.averageAcousticness, average.averageLiveness, average.averageSpeechiness, average.averageValence, mode.topFiveArtistNames);
    }
    
    // レコメンドトラックを取得する非同期関数
    async fetchRecommendedTracks(averageTempo: number, averageKey: number, averageDanceability: number, averageEnergy: number, averageAcousticness: number, averageLiveness: number, averageSpeechiness: number, averageValence: number, topFiveArtistNames: string[]) {
        // アーティスト名をパラメータに変換する
        const artistNamesParam = topFiveArtistNames.join(',');
        const uiManager = new UIManager();
        // APIからレコメンドトラックを取得する
        const data = await this.fetchRecommendationsFromAPI(averageTempo, averageKey, averageDanceability, averageEnergy, averageAcousticness, averageLiveness, averageSpeechiness, averageValence, artistNamesParam);
        // レコメンドトラックのデータを処理する
        uiManager.processRecommendationData(data);
    }
    
    // APIからレコメンドトラックを取得する非同期関数
    async fetchRecommendationsFromAPI(averageTempo: number, averageKey: number, averageDanceability: number, averageEnergy: number, averageAcousticness: number, averageLiveness: number, averageSpeechiness: number, averageValence: number, artistNamesParam: string) {
        const response = await fetch(`/java/recommendations?tempo=${averageTempo}&key=${averageKey}&danceability=${averageDanceability}&energy=${averageEnergy}&acousticness=${averageAcousticness}&liveness=${averageLiveness}&speechiness=${averageSpeechiness}&valence=${averageValence}&modeArtistNames=${artistNamesParam}`);
        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }
        return await response.json();
    }
    
    // レスポンスデータをログに出力する関数
    logResponseData(data: any) {
        console.log("Response data:", data);
    }
    
    // レコメンドトラックをログに出力する関数
    logRecommendedTracks(tracks: any[]) {
        const playlistIdManager = PlaylistIdManager.getInstance();
        console.log("Recommended tracks based on the playlist:");
        tracks.forEach((track: any) => {
            console.log(`- ${track.name} by ${track.artists[0].name}`);
        });
        console.log(playlistIdManager.playlistTrackIds);
    }
    
    // トラックをペアにする関数
    createTrackPairs(tracks: any[]) {
        const trackPairs = [];
        for (let i = 0; i < tracks.length; i += 2) {
            trackPairs.push(tracks.slice(i, i + 2));
        }
        return trackPairs;
    }
    
    // ペアの行を作成する関数
    createRowForPair(pair: any[], playlistId: string) {
        const row = document.createElement('tr');
        pair.forEach((track: any) => {
            const cell = this.createCellForTrack(track);
            const addButton = this.createAddButton(track, playlistId, cell);
            const removeButton = this.createRemoveButton(track, playlistId, cell, row);
            row.appendChild(cell);
            row.appendChild(addButton);
            row.appendChild(removeButton);
        });
        return row;
    }
    
    // トラックのセルを作成する関数
    createCellForTrack(track: any) {
        const cell = document.createElement('td');
        cell.textContent = `${track.name} by ${track.artists[0].name}`;
        cell.addEventListener('click', () => {
            window.open(`https://open.spotify.com/track/${track.id}`, '_blank');
        });
        return cell;
    }
    
    // 追加ボタンを作成する関数
    createAddButton(track: any, playlistId: string, cell: HTMLElement) {
        return this.createTrackButton(track, playlistId, cell, null, true);
    }
    
    // 削除ボタンを作成する関数
    createRemoveButton(track: any, playlistId: string, cell: HTMLElement, row: HTMLTableRowElement) {
        return this.createTrackButton(track, playlistId, cell, row, false);
    }

// トラックボタンを作成する関数
    createTrackButton(track: any, playlistId: string, cell: HTMLElement, row: HTMLTableRowElement, isAddButton: boolean) {
        const button = document.createElement('button');
        button.textContent = isAddButton ? '+' : '-';
        button.className = 'track-button';
        const uiManager = new UIManager();
        
        button.addEventListener('click', async () => {
            if (!playlistId) {
                console.error('Playlist ID is not set.');
                return;
            }
            const endpoint = isAddButton ? 'addTrack' : 'removeTrack';
            const successMessage = isAddButton ? '楽曲を追加しました！' : '楽曲を削除しました！';
            const errorMessage = isAddButton ? '楽曲を追加できませんでした' : '楽曲を削除できませんでした';
            
            try {
                await this.fetchTrack(`/java/playlist/${endpoint}?trackId=${track.id}&playlistId=${playlistId}`);
                uiManager.showMessage(successMessage);
                cell.style.backgroundColor = isAddButton ? 'lightgreen' : (row.sectionRowIndex % 2 === 0 ? '#FFF' : '#F2F2F2');
            } catch (error) {
                console.error('There was a problem with the fetch operation: ', error);
                uiManager.showMessage(errorMessage);
            }
        });
        return button;
    }
    
    async fetchTrack(url: string) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('There was a problem with the fetch operation');
        }
    }
    
    // ヘッダー行を作成する関数
    createHeaderRow(): HTMLTableRowElement {
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = "Recommended Tracks";
        headerRow.appendChild(headerCell);
        return headerRow;
    }
    
    // トラックペアの行を作成する関数
    createRowsForTrackPairs(trackPairs: any[], playlistId: string): HTMLTableRowElement[] {
        return trackPairs.map(pair => this.createRowForPair(pair, playlistId));
    }
    
    // テーブルをDOMに追加する関数
    appendTableToDOM(table: HTMLTableElement) {
        const uiManager = new UIManager();
        uiManager.playlistTracksDiv.appendChild(table);
    }
}
