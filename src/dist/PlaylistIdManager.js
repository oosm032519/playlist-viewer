export class PlaylistIdManager {
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
//# sourceMappingURL=PlaylistIdManager.js.map