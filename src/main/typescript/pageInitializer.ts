import {PlaylistManager} from './playlistManager'
import {MessageManager} from './MessageManager'
import {SideMenuManager} from './sideMenuManager'
import {FormManager} from './formManager'
import {OptionManager} from './optionManager'

export class PageInitializer {
    private playlistManager = new PlaylistManager();
    private messageManager = new MessageManager();
    private sideMenuManager = new SideMenuManager();
    private formManager = new FormManager();
    private optionManager = new OptionManager();

    constructor() {
        this.initializePage();
    }
    
    private initializePage() {
        this.setupUIManager();
        this.fetchVisitedPlaylists();
    }
    
    private setupUIManager() {
        this.optionManager.togglePlaylistSearchOption();
        this.sideMenuManager.toggleSideMenu();
        this.messageManager.displayLoginResultMessage();
        this.formManager.addSubmitEventToForm('playlistForm', this.playlistManager.handlePlaylistFormSubmit.bind(this.playlistManager));
        this.formManager.addSubmitEventToForm('searchForm', this.playlistManager.handleSearchFormSubmit.bind(this.playlistManager));
    }
    
    private fetchVisitedPlaylists() {
        this.playlistManager.fetchVisitedPlaylists();
    }
}

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', () => {
    new PageInitializer();
});
