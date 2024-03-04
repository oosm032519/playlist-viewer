export class SideMenuManager {
    
    // サイドメニューを切り替えるメソッド
    toggleSideMenu() {
        // ボタンを取得
        const openButton = document.getElementById('open');
        const closeButton = document.getElementById('close');
        
        // オープンボタンのクリックイベントを追加
        openButton.addEventListener('click', this.toggleMenuClass);
        // クローズボタンのクリックイベントを追加
        closeButton.addEventListener('click', this.toggleMenuClass);
    }
    
    // サイドメニューのクラスを切り替えるメソッド
    toggleMenuClass() {
        const sideMenu = document.getElementById('side-menu');
        sideMenu.classList.toggle('translate-x-full');
    }
}
