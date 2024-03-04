import {TrackManager} from './trackManager'

export class TrackFetcher {
    private trackManager = new TrackManager();
    async fetchRecommendedTracks(average: any, mode: any) {
        const artistNamesParam = mode.topFiveArtistNames.join(',');
        const data = await this.fetchRecommendationsFromAPI(average, mode, artistNamesParam);
        this.trackManager.processRecommendationData(data);
    }
    
    async fetchRecommendationsFromAPI(average: any, mode: any, artistNamesParam: string) {
        const url = this.constructAPIUrl(average, mode, artistNamesParam);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch recommendations. Status: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    
    constructAPIUrl(average: any, mode: any, artistNamesParam: string) {
        return `/java/recommendations?tempo=${average.averageTempo}&key=${mode.modeKey}&danceability=${average.averageDanceability}&energy=${average.averageEnergy}&acousticness=${average.averageAcousticness}&liveness=${average.averageLiveness}&speechiness=${average.averageSpeechiness}&valence=${average.averageValence}&modeArtistNames=${artistNamesParam}`;
    }

    async fetchTrack(url: string) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('There was a problem with the fetch operation');
        }
    }
}
