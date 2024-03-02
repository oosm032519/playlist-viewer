import { TableManager } from './TableManager';
export class UIManager {
    // メッセージを表示するメソッド
    showMessage(message) {
        // UIManagerのインスタンスを作成
        const uiManager = new UIManager();
        // メッセージ要素を作成
        const messageDiv = uiManager.createMessageElement(message);
        // スタイルを定義
        const styles = {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px',
            backgroundColor: '#2EBD59',
            color: 'white',
            borderRadius: '5px'
        };
        // 要素にスタイルを適用
        uiManager.applyStylesToElement(messageDiv, styles);
        // メッセージをDOMに追加
        document.body.appendChild(messageDiv);
        // 一定時間後にメッセージを削除
        uiManager.removeElementAfterDelay(messageDiv, 3000);
    }
    // ローディングアニメーションを表示するメソッド
    showLoadingAnimation() {
        document.getElementById('loading').classList.remove('hidden');
    }
    // ローディングアニメーションを非表示にするメソッド
    hideLoadingAnimation() {
        document.getElementById('loading').classList.add('hidden');
    }
    // テーブルを作成するメソッド
    createTable(visitedPlaylistsDiv, data) {
        // TableManagerのインスタンスを作成
        const tableManager = new TableManager();
        // テーブルを取得または作成
        let table = tableManager.getTable(visitedPlaylistsDiv);
        // テーブルヘッダーを作成して追加
        table.appendChild(tableManager.createTableHeader());
        // テーブルボディを作成して追加
        table.appendChild(tableManager.createTableBody(table, data));
        // visitedPlaylistsDivを非表示に設定
        visitedPlaylistsDiv.classList.add('hidden');
    }
    // ダークモードとライトモードを切り替えるメソッド
    toggleDarkLightMode() {
        // アイコンを取得
        const sunIcon = document.getElementById('sun-icon');
        // アニメーションを設定
        sunIcon.style.transition = 'transform 0.5s';
        // クリックイベントを追加
        sunIcon.addEventListener('click', () => {
            // ダークモードとライトモードを切り替え
            document.body.classList.toggle('dark-mode');
            document.body.classList.toggle('light-mode');
            // アイコンの回転を設定
            const rotationDegree = document.body.classList.contains('dark-mode') ? 180 : 0;
            sunIcon.style.transform = `rotate(${rotationDegree}deg)`;
        });
    }
    // プレイリスト検索オプションを切り替えるメソッド
    togglePlaylistSearchOption() {
        // オプションを取得
        const playlistIdOption = document.getElementById('playlistIdOption');
        const searchQueryOption = document.getElementById('searchQueryOption');
        const playlistForm = document.getElementById('playlistForm');
        const searchForm = document.getElementById('searchForm');
        // プレイリストIDオプションの変更イベントを追加
        playlistIdOption.addEventListener('change', () => {
            if (playlistIdOption.checked) {
                // プレイリストフォームを表示、検索フォームを非表示に設定
                playlistForm.classList.remove('hidden');
                searchForm.classList.add('hidden');
            }
        });
        // 検索クエリオプションの変更イベントを追加
        searchQueryOption.addEventListener('change', () => {
            if (searchQueryOption.checked) {
                // 検索フォームを表示、プレイリストフォームを非表示に設定
                searchForm.classList.remove('hidden');
                playlistForm.classList.add('hidden');
            }
        });
    }
    // サイドメニューを切り替えるメソッド
    toggleSideMenu() {
        // ボタンを取得
        const openButton = document.getElementById('open');
        const closeButton = document.getElementById('close');
        const sideMenu = document.querySelector('.side-menu');
        // オープンボタンのクリックイベントを追加
        openButton.addEventListener('click', () => {
            sideMenu.classList.toggle('open');
        });
        // クローズボタンのクリックイベントを追加
        closeButton.addEventListener('click', () => {
            sideMenu.classList.toggle('open');
        });
    }
    // ログイン結果メッセージを表示するメソッド
    displayLoginResultMessage() {
        // URLパラメータを取得
        const urlParams = new URLSearchParams(window.location.search);
        const loginResult = urlParams.get('loginResult');
        if (loginResult) {
            let message;
            if (loginResult === 'success') {
                // ログイン成功メッセージ
                message = 'Spotifyログインに成功しました';
            }
            else if (loginResult === 'failure') {
                // ログイン失敗メッセージ
                message = 'Spotifyログインに失敗しました';
            }
            if (message) {
                // メッセージを表示
                const uiManager = new UIManager();
                uiManager.showMessage(message);
            }
        }
    }
    // メッセージ要素を作成するメソッド
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        return messageDiv;
    }
    // 要素にスタイルを適用するメソッド
    applyStylesToElement(element, styles) {
        Object.assign(element.style, styles);
    }
    // 一定時間後に要素を削除するメソッド
    removeElementAfterDelay(element, delay) {
        setTimeout(() => {
            document.body.removeChild(element);
        }, delay);
    }
}
//# sourceMappingURL=UIManager.js.map