"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistIdManager = void 0;
class PlaylistIdManager {
    constructor() {
        this.playlistTrackIds = [];
    }
    static getInstance() {
        if (!PlaylistIdManager.instance) {
            PlaylistIdManager.instance = new PlaylistIdManager();
        }
        return PlaylistIdManager.instance;
    }
}
exports.PlaylistIdManager = PlaylistIdManager;
//# sourceMappingURL=playlistIdManager.js.map