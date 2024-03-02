export class PlaylistIdManager {
    private static instance: PlaylistIdManager;
    playlistId: string;
    playlistTrackIds: string[] = [];

    private constructor() {}

    public static getInstance(): PlaylistIdManager {
        if (!PlaylistIdManager.instance) {
            PlaylistIdManager.instance = new PlaylistIdManager();
        }
        return PlaylistIdManager.instance;
    }
}
