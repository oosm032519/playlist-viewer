import {UIManager} from './uiManager'
import {PlaylistManager} from './playlistManager'


export class PageInitializer {
    private uiManager: UIManager;
    private playlistManager: PlaylistManager;
    
    constructor() {
        this.uiManager = new UIManager();
        this.playlistManager = new PlaylistManager();
    }
    
    initializePage() {
        this.setupUIManager();
        this.fetchVisitedPlaylists();
    }
    
    private setupUIManager() {
        this.uiManager.toggleDarkLightMode();
        this.uiManager.togglePlaylistSearchOption();
        this.uiManager.toggleSideMenu();
        this.uiManager.displayLoginResultMessage();
        this.uiManager.addSubmitEventToForm('playlistForm', this.uiManager.handlePlaylistFormSubmit);
        this.uiManager.addSubmitEventToForm('searchForm', this.uiManager.handleSearchFormSubmit);
    }
    
    private fetchVisitedPlaylists() {
        this.playlistManager.fetchVisitedPlaylists();
    }
}

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', () => {
    const pageInitializer = new PageInitializer();
    pageInitializer.initializePage();
});
