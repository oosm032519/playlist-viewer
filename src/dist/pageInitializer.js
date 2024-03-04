import { UIManager } from './uiManager';
import { PlaylistManager } from './playlistManager';
import { MessageManager } from './MessageManager';
export class PageInitializer {
    constructor() {
        this.uiManager = new UIManager();
        this.playlistManager = new PlaylistManager();
        this.messageManager = new MessageManager();
        this.initializePage();
    }
    initializePage() {
        this.setupUIManager();
        this.fetchVisitedPlaylists();
    }
    setupUIManager() {
        this.uiManager.togglePlaylistSearchOption();
        this.uiManager.toggleSideMenu();
        this.messageManager.displayLoginResultMessage();
        this.uiManager.addSubmitEventToForm('playlistForm', this.playlistManager.handlePlaylistFormSubmit.bind(this.playlistManager));
        this.uiManager.addSubmitEventToForm('searchForm', this.playlistManager.handleSearchFormSubmit.bind(this.playlistManager));
    }
    fetchVisitedPlaylists() {
        this.playlistManager.fetchVisitedPlaylists();
    }
}
// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', () => {
    new PageInitializer();
});
//# sourceMappingURL=pageInitializer.js.map