import { Track } from './track';
import { PlaylistIdManager } from './playlistIdManager';
import { TrackDisplayManager } from './trackDisplayManager';
export class TrackManager {
    constructor() {
        this.playlistIdManager = PlaylistIdManager.getInstance();
        this.trackDisplayManager = new TrackDisplayManager();
    }
    // トラックをペアにする関数
    createTrackPairs(tracks) {
        const trackPairs = [];
        for (let i = 0; i < tracks.length; i += 2) {
            trackPairs.push(tracks.slice(i, i + 2));
        }
        return trackPairs;
    }
    // トラックを作成する
    createTracks(data) {
        return data.tracks.map((item) => {
            this.playlistIdManager.playlistTrackIds.push(item.playlistTrack.track.id);
            return new Track(item.playlistTrack.track, item.audioFeatures);
        });
    }
    // レコメンド曲のデータを処理する関数
    processRecommendationData(data) {
        console.log(data);
        const playlistIdManager = PlaylistIdManager.getInstance();
        if (data.tracks) {
            const filteredTracks = data.tracks.filter((track) => !playlistIdManager.playlistTrackIds.includes(track.id));
            console.log(filteredTracks);
            this.trackDisplayManager.displayRecommendedTracks(filteredTracks);
        }
        else {
            console.log("No tracks found in the response.");
        }
    }
}
//# sourceMappingURL=trackManager.js.map