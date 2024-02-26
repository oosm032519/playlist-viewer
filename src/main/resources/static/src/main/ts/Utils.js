import { DomElements } from './DomElements';
import { Track } from './Table';
import { playlistId, playlistTrackIds, setPlaylistTrackIds } from './globals';
export const descriptions = {
    'Acousticness': 'アコースティック感。1に近いほどアコースティック。',
    'Danceability': '踊りやすさ。1に近いほど踊りやすい。',
    'Energy': '曲の激しさ。1に近いほど激しい。',
    'Liveness': 'ライブ感。1に近いほどライブらしい。',
    'Speechiness': '曲中の話し言葉の存在度合い。1に近いほど話し言葉が多い。',
    'Valence': '明るさ。1に近いほど明るい。'
};
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
export function calculateAverageAndMode(tracks) {
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
    setPlaylistTrackIds([]);
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
//# sourceMappingURL=Utils.js.map