var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TrackRecommendationManager } from './TrackRecommendationManager';
import { TableManager } from './TableManager';
export class TrackManager {
    calculateAverageAndMode(tracks) {
        const tableManager = new TableManager();
        const sum = tableManager.calculateSum(tracks);
        const average = tableManager.calculateAverage(sum, tracks.length);
        const mode = tableManager.calculateMode(sum);
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
        const trackManager = new TrackManager();
        trackManager.fetchRecommendedTracks(average.averageTempo, mode.modeKey, average.averageDanceability, average.averageEnergy, average.averageAcousticness, average.averageLiveness, average.averageSpeechiness, average.averageValence, mode.topFiveArtistNames);
    }
    fetchRecommendedTracks(averageTempo, averageKey, averageDanceability, averageEnergy, averageAcousticness, averageLiveness, averageSpeechiness, averageValence, topFiveArtistNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const artistNamesParam = topFiveArtistNames.join(',');
            const trackRecommendationManager = new TrackRecommendationManager();
            const tableManager = new TableManager();
            const data = yield trackRecommendationManager.fetchRecommendationsFromAPI(averageTempo, averageKey, averageDanceability, averageEnergy, averageAcousticness, averageLiveness, averageSpeechiness, averageValence, artistNamesParam);
            tableManager.processRecommendationData(data);
        });
    }
}
//# sourceMappingURL=TrackManager.js.map