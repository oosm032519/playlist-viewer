import { PlaylistManager } from './PlaylistManager';
import { DomElements } from './DomElements';
import { UIManager } from './UIManager';
import { FetchManager } from './FetchManager';
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
// プレイリスト表示ボタンのクリックイベントに関数を紐付ける
const playlistManager = new PlaylistManager();
document.getElementById('show-playlists').addEventListener('click', playlistManager.fetchUserPlaylists);
// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', () => {
    const domElements = new DomElements();
    domElements.addSubmitEventToForm('playlistForm', domElements.handlePlaylistFormSubmit);
    domElements.addSubmitEventToForm('searchForm', domElements.handleSearchFormSubmit);
    const uiManager = new UIManager();
    const fetchManager = new FetchManager();
    uiManager.toggleDarkLightMode();
    uiManager.togglePlaylistSearchOption();
    fetchManager.fetchVisitedPlaylists();
    uiManager.toggleSideMenu();
    uiManager.displayLoginResultMessage();
});
//# sourceMappingURL=main.js.map