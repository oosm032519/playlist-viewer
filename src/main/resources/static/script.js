document.getElementById('playlistForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const playlistId = document.getElementById('playlistId').value;

    fetch('/playlist/' + playlistId)
        .then(response => response.json())
        .then(data => {
            const playlistTracksDiv = document.getElementById('playlistTracks');
            playlistTracksDiv.innerHTML = '';

            data.forEach(track => {
                const trackDiv = document.createElement('div');
                trackDiv.textContent = track.name; // ここでは曲名を表示していますが、表示する情報は曲情報の内容によります
                playlistTracksDiv.appendChild(trackDiv);
            });
        });
});
