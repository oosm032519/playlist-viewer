import {UIManager} from './UIManager'

export class FetchManager {
    // ユーザーが訪れたプレイリストを取得する非同期関数
    async fetchVisitedPlaylists() {
        // '/java/user/visited-playlists'エンドポイントからデータを取得
        fetch('/java/user/visited-playlists', {credentials: 'include'})
            .then(response => response.json())  // レスポンスをJSONに変換
            .then(data => {
                // 訪れたプレイリストを表示するためのdiv要素を取得
                const visitedPlaylistsDiv = document.getElementById('visitedPlaylists');
                // UIManagerインスタンスを作成
                const uiManager = new UIManager();
                // テーブルを作成してdiv要素に追加
                uiManager.createTable(visitedPlaylistsDiv, data);
            });
    }
}
