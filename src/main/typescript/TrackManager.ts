import {Track} from './Track'
import {TrackRecommendationManager} from './TrackRecommendationManager'
import {TableManager} from './TableManager'

export class TrackManager {
    calculateAverageAndMode(tracks: Track[]) {
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
    
    async fetchRecommendedTracks(averageTempo: number, averageKey: number, averageDanceability: number, averageEnergy: number, averageAcousticness: number, averageLiveness: number, averageSpeechiness: number, averageValence: number, topFiveArtistNames: string[]) {
        const artistNamesParam = topFiveArtistNames.join(',');
        const trackRecommendationManager = new TrackRecommendationManager();
        const tableManager = new TableManager();
        const data = await trackRecommendationManager.fetchRecommendationsFromAPI(averageTempo, averageKey, averageDanceability, averageEnergy, averageAcousticness, averageLiveness, averageSpeechiness, averageValence, artistNamesParam);
        tableManager.processRecommendationData(data);
    }
}
