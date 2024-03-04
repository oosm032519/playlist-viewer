import {UIManager} from './uiManager'
import {PlaylistManager} from './playlistManager'
import {MessageManager} from './MessageManager'
import {SideMenuManager} from './sideMenuManager'

export class PageInitializer {
    private uiManager = new UIManager();
    private playlistManager = new PlaylistManager();
    private messageManager = new MessageManager();
    private sideMenuManager = new SideMenuManager();

    constructor() {
        this.initializePage();
    }
    
    private initializePage() {
        this.setupUIManager();
        this.fetchVisitedPlaylists();
    }
    
    private setupUIManager() {
        this.uiManager.togglePlaylistSearchOption();
        this.sideMenuManager.toggleSideMenu();
        this.messageManager.displayLoginResultMessage();
        this.uiManager.addSubmitEventToForm('playlistForm', this.playlistManager.handlePlaylistFormSubmit.bind(this.playlistManager));
        this.uiManager.addSubmitEventToForm('searchForm', this.playlistManager.handleSearchFormSubmit.bind(this.playlistManager));
    }
    
    private fetchVisitedPlaylists() {
        this.playlistManager.fetchVisitedPlaylists();
    }
}

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', () => {
    new PageInitializer();
});
