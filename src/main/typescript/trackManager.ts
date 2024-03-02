import {Track} from './track'
import {UIManager} from './uiManager'
import {PlaylistIdManager} from './playlistIdManager'

export class TrackManager {
    private uiManager = new UIManager();
    private playlistIdManager = PlaylistIdManager.getInstance();
    
    calculateAverageAndMode(tracks: Track[]) {
        const sum = this.calculateSum(tracks);
        const average = this.calculateAverage(sum, tracks.length);
        const mode = this.calculateMode(sum);
        this.fetchRecommendedTracks(average, mode);
    }
    
    async fetchRecommendedTracks(average: any, mode: any) {
        const artistNamesParam = mode.topFiveArtistNames.join(',');
        const data = await this.fetchRecommendationsFromAPI(average, mode, artistNamesParam);
        this.uiManager.processRecommendationData(data);
    }
    
    async fetchRecommendationsFromAPI(average: any, mode: any, artistNamesParam: string) {
        const url = this.constructAPIUrl(average, mode, artistNamesParam);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }
        return await response.json();
    }
    
    constructAPIUrl(average: any, mode: any, artistNamesParam: string) {
        return `/java/recommendations?tempo=${average.averageTempo}&key=${mode.modeKey}&danceability=${average.averageDanceability}&energy=${average.averageEnergy}&acousticness=${average.averageAcousticness}&liveness=${average.averageLiveness}&speechiness=${average.averageSpeechiness}&valence=${average.averageValence}&modeArtistNames=${artistNamesParam}`;
    }
    
    // レスポンスデータをログに出力する関数
    logResponseData(data: any) {
        console.log("Response data:", data);
    }
    
    // レコメンドトラックをログに出力する関数
    logRecommendedTracks(tracks: any[]) {
        console.log("Recommended tracks based on the playlist:");
        tracks.forEach((track: any) => {
            console.log(`- ${track.name} by ${track.artists[0].name}`);
        });
        console.log(this.playlistIdManager.playlistTrackIds);
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
            this.appendTrackToRow(row, track, playlistId);
        });
        return row;
    }

// トラックを行に追加する関数
    appendTrackToRow(row: HTMLTableRowElement, track: any, playlistId: string) {
        const cell = this.createCellForTrack(track);
        const addButton = this.createAddButton(track, playlistId, cell);
        const removeButton = this.createRemoveButton(track, playlistId, cell, row);
        row.appendChild(cell);
        row.appendChild(addButton);
        row.appendChild(removeButton);
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

// ボタンを作成する関数
    createButton(isAddButton: boolean): HTMLButtonElement {
        const button = document.createElement('button');
        button.textContent = isAddButton ? '+' : '-';
        button.className = 'track-button';
        return button;
    }

// メッセージを生成するメソッド
    getMessages(isAddButton: boolean) {
        const successMessage = isAddButton ? '楽曲を追加しました！' : '楽曲を削除しました！';
        const errorMessage = isAddButton ? '楽曲を追加できませんでした' : '楽曲を削除できませんでした';
        return {successMessage, errorMessage};
    }

// エンドポイントを生成するメソッド
    getEndpoint(isAddButton: boolean) {
        return isAddButton ? 'addTrack' : 'removeTrack';
    }

// イベントリスナーのコールバック関数
    async handleButtonClick({track, playlistId, cell, row, isAddButton}: {
        track: any,
        playlistId: string,
        cell: HTMLElement,
        row: HTMLTableRowElement,
        isAddButton: boolean
    }) {
        if (!playlistId) {
            console.error('Playlist ID is not set.');
            return;
        }
        const endpoint = this.getEndpoint(isAddButton);
        const {successMessage, errorMessage} = this.getMessages(isAddButton);
        
        try {
            await this.fetchTrack(`/java/playlist/${endpoint}?trackId=${track.id}&playlistId=${playlistId}`);
            this.uiManager.showMessage(successMessage);
            cell.style.backgroundColor = isAddButton ? 'lightgreen' : (row.sectionRowIndex % 2 === 0 ? '#FFF' : '#F2F2F2');
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
            this.uiManager.showMessage(errorMessage);
        }
    }

// トラックボタンを作成する関数
    createTrackButton(track: any, playlistId: string, cell: HTMLElement, row: HTMLTableRowElement, isAddButton: boolean) {
        const button = this.createButton(isAddButton);
        button.addEventListener('click', async () => this.handleButtonClick({
            track: track,
            playlistId: playlistId,
            cell: cell,
            row: row,
            isAddButton: isAddButton
        }));
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
        this.uiManager.playlistTracksDiv.appendChild(table);
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
    
    calculateTrackAverageAndMode(tracks: Track[]): void {
        this.calculateAverageAndMode(tracks);
    }
    
    // トラックを作成する
    createTracks(data: any): Track[] {
        return data.tracks.map((item: any) => {
            this.playlistIdManager.playlistTrackIds.push(item.playlistTrack.track.id);
            return new Track(item.playlistTrack.track, item.audioFeatures);
        });
    }
}
