import { PlaylistManager } from './PlaylistManager';
import { PlaylistIdManager } from './PlaylistIdManager';
import { TrackRecommendationManager } from './TrackRecommendationManager';
export class TableManager {
    checkTableWidth() {
        // 全てのテーブルを取得
        const tables = document.querySelectorAll('table');
        tables.forEach((table) => {
            // テーブルの幅がウィンドウの幅より大きい場合
            if (table.offsetWidth > window.innerWidth) {
                // スクロールバーを表示
                table.style.overflowX = 'scroll';
            }
            else {
                // スクロールバーを非表示
                table.style.overflowX = 'auto';
            }
        });
    }
    getTable(visitedPlaylistsDiv) {
        let table = visitedPlaylistsDiv.querySelector('table');
        if (!table) {
            table = document.createElement('table');
            visitedPlaylistsDiv.appendChild(table);
        }
        return table;
    }
    createTableHeader() {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = "参照履歴";
        headerRow.appendChild(headerCell);
        thead.appendChild(headerRow);
        return thead;
    }
    createTableBody(table, data) {
        let tableBody = table.querySelector('tbody');
        if (!tableBody) {
            tableBody = document.createElement('tbody');
            table.appendChild(tableBody);
        }
        data.forEach((playlist) => {
            const row = tableManager.createTableRow(playlist);
            tableBody.appendChild(row);
        });
        return tableBody;
    }
    createTableRow(playlist) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = playlist.name;
        row.appendChild(nameCell);
        const playlistManager = new PlaylistManager();
        row.addEventListener('click', () => playlistManager.fetchAndDisplayPlaylistDetails(playlist));
        return row;
    }
    processRecommendationData(data) {
        const trackRecommendationManager = new TrackRecommendationManager();
        trackRecommendationManager.logResponseData(data);
        const playlistIdManager = PlaylistIdManager.getInstance();
        if (data.tracks) {
            const filteredTracks = data.tracks.filter((track) => !playlistIdManager.playlistTrackIds.includes(track.id));
            trackRecommendationManager.logRecommendedTracks(filteredTracks);
            const tableManager = new TableManager();
            tableManager.displayRecommendedTracks(filteredTracks);
        }
        else {
            console.log("No tracks found in the response.");
        }
    }
    // 推奨曲を表示する関数
    displayRecommendedTracks(tracks) {
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
    calculateSum(tracks) {
        let totalTempo = 0;
        let totalAcousticness = 0;
        let totalDanceability = 0;
        let totalEnergy = 0;
        let totalLiveness = 0;
        let totalSpeechiness = 0;
        let totalValence = 0;
        let artistNames = [];
        let keys = [];
        let modes = [];
        let playlistTrackIds = [];
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
    calculateAverage(sum, length) {
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
    calculateMode(sum) {
        return {
            modeKey: tableManager.mode(sum.keys),
            modeMode: tableManager.mode(sum.modes),
            topFiveArtistNames: tableManager.getTopFiveMostFrequentValues(sum.artistNames)
        };
    }
    // 配列の最頻値を取得する関数
    mode(array) {
        return array.sort((a, b) => array.filter(v => v === a).length
            - array.filter(v => v === b).length).pop();
    }
    createFrequencyMap(array) {
        const frequency = {};
        for (const item of array) {
            frequency[item] = (frequency[item] || 0) + 1;
        }
        return frequency;
    }
    getMostFrequentValues(frequency, count) {
        const sortedKeys = [...Object.keys(frequency)].sort((a, b) => frequency[b] - frequency[a]);
        return sortedKeys.filter(key => frequency[key] > 1).slice(0, count);
    }
    getRandomValues(array, count) {
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
    getTopFiveMostFrequentValues(array) {
        const tableManager = new TableManager();
        const frequency = tableManager.createFrequencyMap(array);
        const modesCount = 5;
        let modes = tableManager.getMostFrequentValues(frequency, modesCount);
        const remainingArtists = Object.keys(frequency).filter(key => frequency[key] === 1);
        const additionalModesCount = modesCount - modes.length;
        const additionalModes = tableManager.getRandomValues(remainingArtists, additionalModesCount);
        return [...modes, ...additionalModes];
    }
}
const tableManager = new TableManager;
window.addEventListener('resize', tableManager.checkTableWidth);
tableManager.checkTableWidth();
//# sourceMappingURL=TableManager.js.map