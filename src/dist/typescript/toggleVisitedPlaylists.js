"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleVisitedPlaylists = void 0;
class ToggleVisitedPlaylists {
    constructor() {
        this.isVisitedPlaylistsVisible = false;
    }
    toggle() {
        const visitedPlaylistsDiv = document.getElementById('visitedPlaylists');
        visitedPlaylistsDiv.classList.toggle('hidden');
        const button = document.getElementById('visited-playlists');
        this.isVisitedPlaylistsVisible = !this.isVisitedPlaylistsVisible;
        button.textContent = this.isVisitedPlaylistsVisible ? '参照履歴を非表示' : '参照履歴を表示';
    }
}
exports.ToggleVisitedPlaylists = ToggleVisitedPlaylists;
//# sourceMappingURL=toggleVisitedPlaylists.js.map