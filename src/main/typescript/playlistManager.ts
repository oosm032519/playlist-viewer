import {UIManager} from './uiManager'
import {Track} from './track'

export class PlaylistManager {
    // ユーザーのプレイリストを取得する
    fetchUserPlaylists() {
        try {
            const uiManager = new UIManager();
            uiManager.showLoadingAnimation();  // ローディングアニメーションを表示
            const playlistManager = new PlaylistManager();
            playlistManager.fetchPlaylistsFromAPI().then(data => {  // APIからプレイリストを取得
                playlistManager.displayPlaylists(data);  // プレイリストを表示
            }).catch(error => {
                const uiManager = new UIManager();
                uiManager.showMessage(error.message);  // エラーメッセージを表示
            }).finally(() => {
                const uiManager = new UIManager();
                uiManager.hideLoadingAnimation();  // ローディングアニメーションを非表示にする
            });
        } catch (error) {
            const uiManager = new UIManager();
            uiManager.showMessage(error.message);  // エラーメッセージを表示
        }
    }
    
    // プレイリストを表示する
    displayPlaylists(data: any) {
        const uiManager = new UIManager();
        uiManager.playlistTracksDiv.innerHTML = '';
        if (Array.isArray(data)) {
            uiManager.createSearchResultsTable(data);  // 検索結果のテーブルを作成
        } else {
            console.error('Expected data to be an array but received', data);
        }
    }
    
    // プレイリストの詳細を取得し表示する
    fetchAndDisplayPlaylistDetails(playlist: any) {
        document.getElementById('loading').classList.remove('hidden');  // ローディングアニメーションを表示
        fetch(`/java/playlist/${playlist.id}`)
            .then(response => response.json())
            .then(data => {
                const uiManager = new UIManager();
                uiManager.playlistTracksDiv.innerHTML = '';
                const playlistNameElement = document.createElement('h2');
                playlistNameElement.textContent = `${playlist.name}`;
                uiManager.playlistTracksDiv.appendChild(playlistNameElement);  // プレイリスト名を表示
                
                if (data && Array.isArray(data.tracks)) {
                    const tracks = data.tracks.map((item: any) => new Track(item.playlistTrack.track, item.audioFeatures));
                    uiManager.createDomTable(tracks);  // テーブルを作成
                } else {
                    console.error('Expected data.tracks to be an array but received', data);
                }
                document.getElementById('loading').classList.add('hidden');  // ローディングアニメーションを非表示にする
            })
            .catch(error => console.error('There was a problem with the fetch operation: ', error));
    }
    
    // APIからプレイリストを取得する非同期関数
    async fetchPlaylistsFromAPI() {
        const response = await fetch('/java/spotify/user/playlists');
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message);
        }
        return response.json();
    }
    
    // ユーザーが訪れたプレイリストを取得する非同期関数
    async fetchVisitedPlaylists() {
        try {
            // '/java/user/visited-playlists'エンドポイントからデータを取得
            const response = await fetch('/java/user/visited-playlists', {credentials: 'include'});
            
            // レスポンスがOKでない場合、エラーをスロー
            this.checkResponseStatus(response);
            
            const data = await response.json();  // レスポンスをJSONに変換
            
            // 訪れたプレイリストを表示するためのdiv要素を取得
            const visitedPlaylistsDiv = document.getElementById('visitedPlaylists');
            
            // UIManagerインスタンスを作成
            const uiManager = new UIManager();
            
            // テーブルを作成してdiv要素に追加
            uiManager.createUITable(visitedPlaylistsDiv, data);
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
        }
    }
    
    // レスポンスのステータスをチェックする関数
    checkResponseStatus(response: Response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
}
