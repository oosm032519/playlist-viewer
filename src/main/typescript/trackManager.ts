import {Track} from './track'
import {PlaylistIdManager} from './playlistIdManager'
import {TrackDisplayManager} from './trackDisplayManager'


export class TrackManager {
    private playlistIdManager = PlaylistIdManager.getInstance();
    private trackDisplayManager = new TrackDisplayManager();
    
    // トラックをペアにする関数
    createTrackPairs(tracks: any[]) {
        const trackPairs = [];
        for (let i = 0; i < tracks.length; i += 2) {
            trackPairs.push(tracks.slice(i, i + 2));
        }
        return trackPairs;
    }
    
    // トラックを作成する
    createTracks(data: any): Track[] {
        return data.tracks.map((item: any) => {
            this.playlistIdManager.playlistTrackIds.push(item.playlistTrack.track.id);
            return new Track(item.playlistTrack.track, item.audioFeatures);
        });
    }
    
    // レコメンド曲のデータを処理する関数
    processRecommendationData(data: any) {
        console.log(data);
        const playlistIdManager = PlaylistIdManager.getInstance();
        if (data.tracks) {
            const filteredTracks = data.tracks.filter((track: any) => !playlistIdManager.playlistTrackIds.includes(track.id));
            console.log(filteredTracks);
            this.trackDisplayManager.displayRecommendedTracks(filteredTracks);
        } else {
            console.log("No tracks found in the response.");
        }
    }
}
