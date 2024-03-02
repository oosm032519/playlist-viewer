var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DomElements } from './DomElements';
import { UIManager } from './UIManager';
import { Track } from './Track';
export class PlaylistManager {
    // ユーザーのプレイリストを取得する
    fetchUserPlaylists() {
        try {
            const uiManager = new UIManager();
            uiManager.showLoadingAnimation(); // ローディングアニメーションを表示
            const playlistManager = new PlaylistManager();
            playlistManager.fetchPlaylistsFromAPI().then(data => {
                playlistManager.displayPlaylists(data); // プレイリストを表示
            }).catch(error => {
                const uiManager = new UIManager();
                uiManager.showMessage(error.message); // エラーメッセージを表示
            }).finally(() => {
                const uiManager = new UIManager();
                uiManager.hideLoadingAnimation(); // ローディングアニメーションを非表示にする
            });
        }
        catch (error) {
            const uiManager = new UIManager();
            uiManager.showMessage(error.message); // エラーメッセージを表示
        }
    }
    // プレイリストを表示する
    displayPlaylists(data) {
        const domElements = new DomElements();
        domElements.playlistTracksDiv.innerHTML = '';
        if (Array.isArray(data)) {
            domElements.createSearchResultsTable(data); // 検索結果のテーブルを作成
        }
        else {
            console.error('Expected data to be an array but received', data);
        }
    }
    // プレイリストの詳細を取得し表示する
    fetchAndDisplayPlaylistDetails(playlist) {
        document.getElementById('loading').classList.remove('hidden'); // ローディングアニメーションを表示
        fetch(`/java/playlist/${playlist.id}`)
            .then(response => response.json())
            .then(data => {
            const domElements = new DomElements();
            domElements.playlistTracksDiv.innerHTML = '';
            const playlistNameElement = document.createElement('h2');
            playlistNameElement.textContent = `${playlist.name}`;
            domElements.playlistTracksDiv.appendChild(playlistNameElement); // プレイリスト名を表示
            if (data && Array.isArray(data.tracks)) {
                const tracks = data.tracks.map((item) => new Track(item.playlistTrack.track, item.audioFeatures));
                domElements.createTable(tracks); // テーブルを作成
            }
            else {
                console.error('Expected data.tracks to be an array but received', data);
            }
            document.getElementById('loading').classList.add('hidden'); // ローディングアニメーションを非表示にする
        })
            .catch(error => console.error('There was a problem with the fetch operation: ', error));
    }
    // APIからプレイリストを取得する非同期関数
    fetchPlaylistsFromAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('/java/spotify/user/playlists');
            if (!response.ok) {
                const message = yield response.text();
                throw new Error(message);
            }
            return response.json();
        });
    }
}
//# sourceMappingURL=PlaylistManager.js.map