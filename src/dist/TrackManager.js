var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TableManager } from './TableManager';
import { TrackRecommendationManager } from './TrackRecommendationManager';
export class TrackManager {
    // トラックの平均値と最頻値を計算する
    calculateAverageAndMode(tracks) {
        const tableManager = new TableManager();
        // 合計値を計算する
        const sum = tableManager.calculateSum(tracks);
        // 平均値を計算する
        const average = tableManager.calculateAverage(sum, tracks.length);
        // 最頻値を計算する
        const mode = tableManager.calculateMode(sum);
        // 平均値と最頻値をログに出力する
        console.log(`Average Tempo: ${average.averageTempo}`);
        console.log(`Average Acousticness: ${average.averageAcousticness}`);
        console.log(`Average Danceability: ${average.averageDanceability}`);
        console.log(`Average Energy: ${average.averageEnergy}`);
        console.log(`Average Liveness: ${average.averageLiveness}`);
        console.log(`Average Speechiness: ${average.averageSpeechiness}`);
        console.log(`Average Valence: ${average.averageValence}`);
        console.log(`Mode Key: ${mode.modeKey}`);
        console.log(`Mode Mode: ${mode.modeMode}`);
        console.log(`Top Five Artist Names: ${mode.topFiveArtistNames}`);
        console.log(`Playlist Track IDs: ${sum.playlistTrackIds}`);
        // レコメンドトラックを取得する
        const trackManager = new TrackManager();
        trackManager.fetchRecommendedTracks(average.averageTempo, mode.modeKey, average.averageDanceability, average.averageEnergy, average.averageAcousticness, average.averageLiveness, average.averageSpeechiness, average.averageValence, mode.topFiveArtistNames);
    }
    // レコメンドトラックを取得する非同期関数
    fetchRecommendedTracks(averageTempo, averageKey, averageDanceability, averageEnergy, averageAcousticness, averageLiveness, averageSpeechiness, averageValence, topFiveArtistNames) {
        return __awaiter(this, void 0, void 0, function* () {
            // アーティスト名をパラメータに変換する
            const artistNamesParam = topFiveArtistNames.join(',');
            const trackRecommendationManager = new TrackRecommendationManager();
            const tableManager = new TableManager();
            // APIからレコメンドトラックを取得する
            const data = yield trackRecommendationManager.fetchRecommendationsFromAPI(averageTempo, averageKey, averageDanceability, averageEnergy, averageAcousticness, averageLiveness, averageSpeechiness, averageValence, artistNamesParam);
            // レコメンドトラックのデータを処理する
            tableManager.processRecommendationData(data);
        });
    }
}
//# sourceMappingURL=TrackManager.js.map