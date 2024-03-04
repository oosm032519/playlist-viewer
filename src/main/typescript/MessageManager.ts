export class MessageManager {
    
    // ログイン結果に対応するメッセージのマップ
    private loginMessages: Record<string, string> = {
        'success': 'Spotifyログインに成功しました',
        'failure': 'Spotifyログインに失敗しました'
    };

// メッセージを表示するメソッド
    showMessage(message: string) {
        const messageDiv = this.createMessageElement(message);
        this.addMessageToDOM(messageDiv);
        this.removeElementAfterDelay(messageDiv, 3000);
    }

// メッセージ要素を作成するメソッド
    createMessageElement(message: string): HTMLDivElement {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = 'fixed bottom-5 right-5 p-2.5 bg-green-500 text-white rounded-full';
        return messageDiv;
    }

// メッセージをDOMに追加するメソッド
    addMessageToDOM(messageDiv: HTMLDivElement): void {
        document.body.appendChild(messageDiv);
    }

// 一定時間後に要素を削除するメソッド
    removeElementAfterDelay(element: HTMLElement, delay: number) {
        setTimeout(() => {
            document.body.removeChild(element);
        }, delay);
    }
    
    
    // ログイン結果メッセージを表示するメソッド
    displayLoginResultMessage() {
        // URLパラメータを取得
        const urlParams = new URLSearchParams(window.location.search);
        const loginResult = urlParams.get('loginResult');
        
        // メッセージを取得
        const message = this.getLoginMessage(loginResult);
        
        // メッセージが存在する場合、それを表示
        if (message) {
            this.showMessage(message);
        }
    }
    
    // ログイン結果に対応するメッセージを取得するメソッド
    getLoginMessage(loginResult: string): string {
        return this.loginMessages[loginResult];
    }
}
