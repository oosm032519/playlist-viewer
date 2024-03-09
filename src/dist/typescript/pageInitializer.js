"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageInitializer = void 0;
const playlistManager_1 = require("./playlistManager");
const MessageManager_1 = require("./MessageManager");
const sideMenuManager_1 = require("./sideMenuManager");
const formManager_1 = require("./formManager");
const optionManager_1 = require("./optionManager");
class PageInitializer {
    constructor() {
        this.playlistManager = new playlistManager_1.PlaylistManager();
        this.messageManager = new MessageManager_1.MessageManager();
        this.sideMenuManager = new sideMenuManager_1.SideMenuManager();
        this.formManager = new formManager_1.FormManager();
        this.optionManager = new optionManager_1.OptionManager();
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
exports.PageInitializer = PageInitializer;
// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', () => {
    new PageInitializer();
});
//# sourceMappingURL=pageInitializer.js.map