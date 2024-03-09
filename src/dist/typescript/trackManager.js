"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackManager = void 0;
const track_1 = require("./track");
const playlistIdManager_1 = require("./playlistIdManager");
const trackDisplayManager_1 = require("./trackDisplayManager");
class TrackManager {
    constructor() {
        this.playlistIdManager = playlistIdManager_1.PlaylistIdManager.getInstance();
        this.trackDisplayManager = new trackDisplayManager_1.TrackDisplayManager();
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
            return new track_1.Track(item.playlistTrack.track, item.audioFeatures);
        });
    }
    // レコメンド曲のデータを処理する関数
    processRecommendationData(data) {
        console.log(data);
        const playlistIdManager = playlistIdManager_1.PlaylistIdManager.getInstance();
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
exports.TrackManager = TrackManager;
//# sourceMappingURL=trackManager.js.map