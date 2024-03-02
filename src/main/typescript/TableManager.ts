import {TrackRecommendationManager} from './TrackRecommendationManager'
import {PlaylistIdManager} from './PlaylistIdManager'
import {Track} from './Track'
import {PlaylistManager} from './PlaylistManager'

export class TableManager {
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
        const trackRecommendationManager = new TrackRecommendationManager();
        trackRecommendationManager.logResponseData(data);
        const playlistIdManager = PlaylistIdManager.getInstance();
        if (data.tracks) {
            const filteredTracks = data.tracks.filter((track: any) => !playlistIdManager.playlistTrackIds.includes(track.id));
            trackRecommendationManager.logRecommendedTracks(filteredTracks);
            const tableManager = new TableManager();
            tableManager.displayRecommendedTracks(filteredTracks);
        } else {
            console.log("No tracks found in the response.");
        }
    }
    
    // 推奨曲を表示する関数
    displayRecommendedTracks(tracks: any[]) {
        const table = document.createElement('table');
        table.classList.add('recommendations-table');
        const trackRecommendationManager = new TrackRecommendationManager();
        table.appendChild(trackRecommendationManager.createHeaderRow());
        
        const playlistIdManager = PlaylistIdManager.getInstance();
        const trackPairs = trackRecommendationManager.createTrackPairs(tracks);
        const rows = trackRecommendationManager.createRowsForTrackPairs(trackPairs, playlistIdManager.playlistId);
        rows.forEach(row => table.appendChild(row));
        
        trackRecommendationManager.appendTableToDOM(table);
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
}
const tableManager = new TableManager;
window.addEventListener('resize', tableManager.checkTableWidth);
tableManager.checkTableWidth();
