const descriptions = {
    'Acousticness': 'アコースティック感。1に近いほどアコースティック。',
    'Danceability': '踊りやすさ。1に近いほど踊りやすい。',
    'Energy': '曲の激しさ。1に近いほど激しい。',
    'Liveness': 'ライブ感。1に近いほどライブらしい。',
    'Speechiness': '曲中の話し言葉の存在度合い。1に近いほど話し言葉が多い。',
    'Valence': '明るさ。1に近いほど明るい。'
};
let playlistId;
let playlistTrackIds = [];
class DomElements {
    get playlistForm() {
        return document.getElementById('playlistForm');
    }
    get playlistIdInput() {
        return document.getElementById('playlistId');
    }
    get playlistTracksDiv() {
        return document.getElementById('playlistTracks');
    }
    get searchForm() {
        return document.getElementById('searchForm');
    }
    get searchQueryInput() {
        return document.getElementById('searchQuery');
    }
    get searchResultsDiv() {
        return document.getElementById('searchResults');
    }
    fetchData() {
        this.playlistForm.addEventListener('submit', this.handlePlaylistFormSubmit.bind(this));
    }
    fetchSearchResults() {
        this.searchForm.addEventListener('submit', this.handleSearchFormSubmit.bind(this));
    }
    fetchPlaylistData(playlistId) {
        playlistTrackIds = [];
        this.clearAllTables();
        this.showLoadingAnimation();
        fetch(`/java/playlist/${playlistId}`)
            .then(TrackTable.handleResponse)
            .then(this.handlePlaylistData.bind(this))
            .catch(TrackTable.handleError);
    }
    fetchSearchData(searchQuery) {
        playlistTrackIds = [];
        this.clearAllTables();
        this.showLoadingAnimation();
        fetch(`/java/search/${searchQuery}`)
            .then(response => response.json())
            .then(this.handleSearchData.bind(this))
            .catch(error => console.error('There was a problem with the fetch operation: ', error));
    }
    handlePlaylistFormSubmit(event) {
        event.preventDefault();
        this.fetchPlaylistData(this.playlistIdInput.value);
    }
    handleSearchFormSubmit(event) {
        event.preventDefault();
        this.fetchSearchData(this.searchQueryInput.value);
    }
    handlePlaylistData(data) {
        this.clearAllTables();
        this.processPlaylistData(data);
        this.hideLoadingAnimation();
    }
    handleSearchData(data) {
        this.clearAllTables();
        this.createSearchResultsTable(data);
        this.hideLoadingAnimation();
    }
    processPlaylistData(data) {
        if (data && Array.isArray(data.tracks)) {
            const tracks = data.tracks.map((item) => {
                playlistTrackIds.push(item.playlistTrack.track.id);
                return new Track(item.playlistTrack.track, item.audioFeatures);
            });
            this.createTable(tracks);
            calculateAverageAndMode(tracks);
            this.displayPlaylistName(data.name);
            console.log(`Playlist ID: ${playlistId}`);
            console.log(`Playlist Track IDs: ${playlistTrackIds}`);
        }
        else {
            console.error('Expected data.tracks to be an array but received', data);
        }
    }
    displayPlaylistName(name) {
        if (name) {
            console.log(`Playlist name: ${name}`);
            const playlistNameElement = document.createElement('h2');
            playlistNameElement.textContent = `${name}`;
            this.playlistTracksDiv.insertBefore(playlistNameElement, this.playlistTracksDiv.firstChild);
        }
    }
    showLoadingAnimation() {
        document.getElementById('loading').classList.remove('hidden');
    }
    hideLoadingAnimation() {
        document.getElementById('loading').classList.add('hidden');
    }
    clearAllTables() {
        this.playlistTracksDiv.innerHTML = '';
        this.searchResultsDiv.innerHTML = '';
    }
    createTable(tracks) {
        this.clearAllTables();
        const trackTable = new TrackTable(tracks);
        this.playlistTracksDiv.appendChild(trackTable.createTable());
    }
    createSearchResultsTable(results) {
        this.clearAllTables();
        const table = document.createElement('table');
        results.forEach(result => {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = result.name;
            td.addEventListener('click', () => {
                document.getElementById('loading').classList.remove('hidden');
                fetch(`/java/playlist/${result.id}`)
                    .then(response => response.json())
                    .then(data => {
                    this.playlistTracksDiv.innerHTML = '';
                    const playlistNameElement = document.createElement('h2');
                    playlistNameElement.textContent = `${result.name}`;
                    this.playlistTracksDiv.appendChild(playlistNameElement);
                    if (data && Array.isArray(data.tracks)) {
                        const tracks = data.tracks.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
                        this.createTable(tracks);
                        calculateAverageAndMode(tracks);
                    }
                    else {
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
    constructor(track, audioFeatures) {
        this.id = track.id;
        this.name = track.name;
        this.artists = track.artists;
        this.audioFeatures = audioFeatures;
    }
}
class TrackTable {
    constructor(tracks) {
        this.tracks = tracks;
    }
    static handleResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    static handleError(error) {
        console.error('There was a problem with the fetch operation: ', error);
    }
    createTableHeader() {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Track Name', 'Artist Name', 'BPM', 'Key', 'Mode', 'Acousticness', 'Danceability', 'Energy', /* 'Instrumentalness', */ 'Liveness', 'Speechiness', 'Valence'].forEach((text, index) => {
            const th = document.createElement('th');
            th.textContent = text;
            if (descriptions[text]) {
                th.title = descriptions[text];
            }
            th.addEventListener('click', (event) => {
                const element = event.target;
                if (element.classList.contains('asc')) {
                    element.classList.replace('asc', 'desc');
                }
                else if (element.classList.contains('desc')) {
                    element.classList.replace('desc', 'asc');
                }
                else {
                    element.classList.add('asc');
                }
                Array.from(element.parentNode.children)
                    .filter(e => e !== element)
                    .forEach(e => e.classList.remove('asc', 'desc'));
                const table = th.closest('table');
                const tbody = table.querySelector('tbody');
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
    static sortRows(a, b, columnIndex, sortOrder) {
        const cellA = TrackTable.getSortValue(a.cells[columnIndex].textContent, columnIndex);
        const cellB = TrackTable.getSortValue(b.cells[columnIndex].textContent, columnIndex);
        return (cellA > cellB ? 1 : -1) * sortOrder;
    }
    createTableBody() {
        const tbody = document.createElement('tbody');
        this.tracks.forEach(track => {
            const row = this.createRow(track);
            tbody.appendChild(row);
        });
        return tbody;
    }
    createRow(track) {
        const row = document.createElement('tr');
        [track.name, track.artists[0].name, track.audioFeatures.tempo, this.keyToNote(track.audioFeatures.key), track.audioFeatures.mode, track.audioFeatures.acousticness, track.audioFeatures.danceability, track.audioFeatures.energy, /* track.audioFeatures.instrumentalness, */ track.audioFeatures.liveness, track.audioFeatures.speechiness, track.audioFeatures.valence].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text.toString();
            row.appendChild(td);
        });
        return row;
    }
    keyToNote(key) {
        const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return NOTES[key];
    }
    static getSortValue(cell, columnIndex) {
        const COLUMN_INDEX_NAME_ARTIST = 0;
        const COLUMN_INDEX_OTHERS = 1;
        const COLUMN_INDEX_KEY = 3;
        const COLUMN_INDEX_MODE = 4;
        if (columnIndex === COLUMN_INDEX_NAME_ARTIST || columnIndex === COLUMN_INDEX_OTHERS || columnIndex === COLUMN_INDEX_KEY || columnIndex === COLUMN_INDEX_MODE) {
            return cell;
        }
        else {
            return parseFloat(cell);
        }
    }
    createTable() {
        const table = document.createElement('table');
        table.classList.add('playlist-table');
        table.appendChild(this.createTableHeader());
        table.appendChild(this.createTableBody());
        return table;
    }
}
window.addEventListener('resize', checkTableWidth);
function checkTableWidth() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
        if (table.offsetWidth > window.innerWidth) {
            table.style.overflowX = 'scroll';
        }
        else {
            table.style.overflowX = 'auto';
        }
    });
}
checkTableWidth();
function fetchVisitedPlaylists() {
    fetch('/java/user/visited-playlists', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
        const visitedPlaylistsDiv = document.getElementById('visitedPlaylists');
        let table = visitedPlaylistsDiv.querySelector('table');
        if (!table) {
            table = document.createElement('table');
            visitedPlaylistsDiv.appendChild(table);
        }
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = "参照履歴";
        headerRow.appendChild(headerCell);
        thead.appendChild(headerRow);
        table.appendChild(thead);
        let tableBody = table.querySelector('tbody');
        if (!tableBody) {
            tableBody = document.createElement('tbody');
            table.appendChild(tableBody);
        }
        data.forEach(playlist => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = playlist.name;
            row.appendChild(nameCell);
            row.addEventListener('click', () => {
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
                        const tracks = data.tracks.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
                        domElements.createTable(tracks);
                    }
                    else {
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
    const button = this;
    if (button.textContent === '参照履歴を表示') {
        button.textContent = '参照履歴を非表示';
    }
    else {
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
function fetchUserPlaylists() {
    document.getElementById('loading').classList.remove('hidden');
    fetch('/java/spotify/user/playlists')
        .then(response => response.json())
        .then(data => {
        const domElements = new DomElements();
        domElements.playlistTracksDiv.innerHTML = '';
        domElements.createSearchResultsTable(data);
        document.getElementById('loading').classList.add('hidden');
    })
        .catch(error => console.error('There was a problem with the fetch operation: ', error));
}
document.getElementById('show-playlists').addEventListener('click', fetchUserPlaylists);
document.addEventListener('DOMContentLoaded', () => {
    const domElements = new DomElements();
    domElements.fetchData();
    domElements.fetchSearchResults();
    const sunIcon = document.getElementById('sun-icon');
    sunIcon.style.transition = 'transform 0.5s';
    sunIcon.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        const rotationDegree = document.body.classList.contains('dark-mode') ? 180 : 0;
        sunIcon.style.transform = `rotate(${rotationDegree}deg)`;
    });
    const playlistIdOption = document.getElementById('playlistIdOption');
    const searchQueryOption = document.getElementById('searchQueryOption');
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
    fetchVisitedPlaylists();
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
function fetchRecommendedTracks(averageTempo, averageKey, averageDanceability, averageEnergy, averageAcousticness, averageLiveness, averageSpeechiness, averageValence, topFiveArtistNames) {
    const artistNamesParam = topFiveArtistNames.join(',');
    fetch(`/java/recommendations?tempo=${averageTempo}&key=${averageKey}&danceability=${averageDanceability}&energy=${averageEnergy}&acousticness=${averageAcousticness}&liveness=${averageLiveness}&speechiness=${averageSpeechiness}&valence=${averageValence}&modeArtistNames=${artistNamesParam}`)
        .then(response => response.json())
        .then(data => {
        console.log("Response data:", data);
        if (data.tracks) {
            console.log("Recommended tracks based on the playlist:");
            const filteredTracks = data.tracks.filter((track) => !playlistTrackIds.includes(track.id)); // Use the global variable playlistTrackIds
            filteredTracks.forEach((track) => {
                console.log(`- ${track.name} by ${track.artists[0].name}`);
            });
            console.log(playlistTrackIds);
            displayRecommendedTracks(filteredTracks);
        }
        else {
            console.log("No tracks found in the response.");
        }
    })
        .catch(error => console.error('There was a problem with the fetch operation: ', error));
}
function displayRecommendedTracks(tracks) {
    const table = document.createElement('table');
    table.classList.add('recommendations-table');
    const headerRow = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.textContent = "Recommended Tracks";
    headerRow.appendChild(headerCell);
    table.appendChild(headerRow);
    const trackPairs = [];
    for (let i = 0; i < tracks.length; i += 2) {
        trackPairs.push(tracks.slice(i, i + 2));
    }
    trackPairs.forEach((pair) => {
        const row = document.createElement('tr');
        pair.forEach((track) => {
            const cell = document.createElement('td');
            cell.textContent = `${track.name} by ${track.artists[0].name}`;
            cell.addEventListener('click', () => {
                window.open(`https://open.spotify.com/track/${track.id}`, '_blank');
            });
            const addButton = document.createElement('button');
            addButton.textContent = '+';
            addButton.className = 'track-button';
            addButton.addEventListener('click', () => {
                showMessage('楽曲を追加しました！');
                fetch(`/java/playlist/addTrack?trackId=${track.id}&playlistId=${playlistId}`)
                    .then(response => response.json())
                    .then(data => {
                    console.log(data);
                })
                    .catch(error => console.error('There was a problem with the fetch operation: ', error));
                cell.style.backgroundColor = 'lightgreen';
            });
            const removeButton = document.createElement('button');
            removeButton.textContent = '-';
            removeButton.className = 'track-button';
            removeButton.addEventListener('click', () => {
                showMessage('楽曲を削除しました！');
                fetch(`/java/playlist/removeTrack?trackId=${track.id}&playlistId=${playlistId}`)
                    .then(response => response.json())
                    .then(data => {
                    console.log(data);
                })
                    .catch(error => console.error('There was a problem with the fetch operation: ', error));
                const rowIndex = row.sectionRowIndex;
                if (rowIndex % 2 === 0) {
                    cell.style.backgroundColor = '#FFF';
                }
                else {
                    cell.style.backgroundColor = '#F2F2F2';
                }
            });
            row.appendChild(cell);
            row.appendChild(addButton);
            row.appendChild(removeButton);
        });
        table.appendChild(row);
    });
    const domElements = new DomElements();
    domElements.playlistTracksDiv.appendChild(table);
}
function calculateAverageAndMode(tracks) {
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
    const averageTempo = totalTempo / tracks.length;
    const averageAcousticness = totalAcousticness / tracks.length;
    const averageDanceability = totalDanceability / tracks.length;
    const averageEnergy = totalEnergy / tracks.length;
    const averageLiveness = totalLiveness / tracks.length;
    const averageSpeechiness = totalSpeechiness / tracks.length;
    const averageValence = totalValence / tracks.length;
    const topFiveArtistNames = getTopFiveModes(artistNames);
    const modeKey = mode(keys);
    const modeMode = mode(modes);
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
    fetchRecommendedTracks(averageTempo, modeKey, averageDanceability, averageEnergy, averageAcousticness, averageLiveness, averageSpeechiness, averageValence, topFiveArtistNames);
}
function mode(array) {
    return array.sort((a, b) => array.filter(v => v === a).length
        - array.filter(v => v === b).length).pop();
}
function getTopFiveModes(array) {
    const frequency = {};
    let maxFrequency = 0;
    let modes = [];
    for (let i in array) {
        frequency[array[i]] = (frequency[array[i]] || 0) + 1;
        if (frequency[array[i]] > maxFrequency) {
            maxFrequency = frequency[array[i]];
            modes = [array[i]];
        }
        else if (frequency[array[i]] === maxFrequency) {
            modes.push(array[i]);
        }
    }
    return modes.slice(0, 5);
}
function showMessage(message) {
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
//# sourceMappingURL=script.js.map