import { PlaylistManager } from './playlistManager';
import { MessageManager } from './MessageManager';
import { SideMenuManager } from './sideMenuManager';
import { FormManager } from './formManager';
import { OptionManager } from './optionManager';
export class PageInitializer {
    constructor() {
        this.playlistManager = new PlaylistManager();
        this.messageManager = new MessageManager();
        this.sideMenuManager = new SideMenuManager();
        this.formManager = new FormManager();
        this.optionManager = new OptionManager();
        this.initializePage();
    }
    initializePage() {
        this.setupUIManager();
        this.fetchVisitedPlaylists();
    }
    setupUIManager() {
        this.optionManager.togglePlaylistSearchOption();
        this.sideMenuManager.toggleSideMenu();
        this.messageManager.displayLoginResultMessage();
        this.formManager.addSubmitEventToForm('playlistForm', this.playlistManager.handlePlaylistFormSubmit.bind(this.playlistManager));
        this.formManager.addSubmitEventToForm('searchForm', this.playlistManager.handleSearchFormSubmit.bind(this.playlistManager));
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