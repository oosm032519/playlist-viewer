function getDomElements() {
    return {
        playlistForm: document.getElementById('playlistForm'),
        playlistIdInput: document.getElementById('playlistId'),
        playlistTracksDiv: document.getElementById('playlistTracks')
    };
}

function keyToNote(key) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return notes[key];
}

function createTable(tracks) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create table header
    const headerRow = document.createElement('tr');
    ['Track Name', 'Artist Name', 'BPM', 'Key', 'Mode', 'Acousticness', 'Danceability', 'Energy', /* 'Instrumentalness', */ 'Liveness', 'Speechiness', 'Valence'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create table body
    tracks.forEach(track => {
        const row = document.createElement('tr');
        [track.name, track.artists[0].name, track.audioFeatures.tempo, keyToNote(track.audioFeatures.key), track.audioFeatures.mode, track.audioFeatures.acousticness, track.audioFeatures.danceability, track.audioFeatures.energy, /* track.audioFeatures.instrumentalness, */ track.audioFeatures.liveness, track.audioFeatures.speechiness, track.audioFeatures.valence].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function fetchDataAndCreateTable(domElements) {
    domElements.playlistForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const playlistId = domElements.playlistIdInput.value;

        fetch(`/java/playlist/${playlistId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                domElements.playlistTracksDiv.innerHTML = '';
                const tracks = data.map(item => item.playlistTrack.track);
                tracks.forEach(track => {
                    track.audioFeatures = data.find(item => item.playlistTrack.track.id === track.id).audioFeatures;
                });
                domElements.playlistTracksDiv.appendChild(createTable(tracks));
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation: ', error);
            });
    });
}



const domElements = getDomElements();
fetchDataAndCreateTable(domElements);
