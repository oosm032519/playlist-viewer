import {Track} from './track'
import {TrackFetcher} from './trackFetcher'

export class TrackCalculator {
    private trackFetcher = new TrackFetcher();
    calculateAverageAndMode(tracks: Track[]) {
        const sum = this.calculateSum(tracks);
        const average = this.calculateAverage(sum, tracks.length);
        const mode = this.calculateMode(sum);
        this.trackFetcher.fetchRecommendedTracks(average, mode);
    }
    
    // トラックの合計値を計算する関数
    calculateSum(tracks: Track[]) {
        let totalTempo = 0;
        let totalAcousticness = 0;
        let totalDanceability = 0;
        let totalEnergy = 0;
        let totalLiveness = 0;
        let totalSpeechiness = 0;
        let totalValence = 0;
        let artistNames: string[] = [];
        let keys: number[] = [];
        let modes: number[] = [];
        let playlistTrackIds: string[] = [];
        
        tracks.forEach(track => {
            totalTempo += track.audioFeatures.tempo;
            totalAcousticness += track.audioFeatures.acousticness;
            totalDanceability += track.audioFeatures.danceability;
            totalEnergy += track.audioFeatures.energy;
            totalLiveness += track.audioFeatures.liveness;
            totalSpeechiness += track.audioFeatures.speechiness;
            totalValence += track.audioFeatures.valence;
            artistNames.push(track.artists[0].name);
            keys.push(track.audioFeatures.key);
            modes.push(track.audioFeatures.mode);
            playlistTrackIds.push(track.id);
        });
        
        return {
            totalTempo,
            totalAcousticness,
            totalDanceability,
            totalEnergy,
            totalLiveness,
            totalSpeechiness,
            totalValence,
            artistNames,
            keys,
            modes,
            playlistTrackIds
        };
    }
    
    // 平均値を計算する関数
    calculateAverage(sum: any, length: number) {
        return {
            averageTempo: sum.totalTempo / length,
            averageAcousticness: sum.totalAcousticness / length,
            averageDanceability: sum.totalDanceability / length,
            averageEnergy: sum.totalEnergy / length,
            averageLiveness: sum.totalLiveness / length,
            averageSpeechiness: sum.totalSpeechiness / length,
            averageValence: sum.totalValence / length,
        };
    }
    
    // 最頻値を計算する関数
    calculateMode(sum: any) {
        return {
            modeKey: this.mode(sum.keys),
            modeMode: this.mode(sum.modes),
            topFiveArtistNames: this.getTopFiveMostFrequentValues(sum.artistNames)
        };
    }
    
    // 配列の最頻値を取得する関数
    mode(array: any[]) {
        return array.sort((a, b) =>
            array.filter(v => v === a).length
            - array.filter(v => v === b).length
        ).pop();
    }
    
    // 頻度マップを作成する関数
    createFrequencyMap(array: any[]): Record<string, number> {
        const frequency: Record<string, number> = {};
        for (const item of array) {
            frequency[item] = (frequency[item] || 0) + 1;
        }
        return frequency;
    }
    
    // 最頻値を取得する関数
    getMostFrequentValues(frequency: Record<string, number>, count: number): string[] {
        const sortedKeys = [...Object.keys(frequency)].sort((a, b) => frequency[b] - frequency[a]);
        return sortedKeys.filter(key => frequency[key] > 1).slice(0, count);
    }
    
    // 配列からランダムな値を取得する関数
    getRandomValues(array: string[], count: number): string[] {
        let values: any[] = [];
        while (values.length < count && array.length > 0) {
            const randomIndex = Math.floor(Math.random() * array.length);
            const randomValue = array[randomIndex];
            if (!values.includes(randomValue)) {
                values = [...values, randomValue];
                array.splice(randomIndex, 1);
            }
        }
        return values;
    }
    
    // 最頻値のトップ5を取得する関数
    getTopFiveMostFrequentValues(array: string[]): string[] {
        const frequency = this.createFrequencyMap(array);
        const modesCount = 5;
        let modes = this.getMostFrequentValues(frequency, modesCount);
        const remainingArtists = Object.keys(frequency).filter(key => frequency[key] === 1);
        const additionalModesCount = modesCount - modes.length;
        const additionalModes = this.getRandomValues(remainingArtists, additionalModesCount);
        return [...modes, ...additionalModes];
    }
    
    calculateTrackAverageAndMode(tracks: Track[]): void {
        this.calculateAverageAndMode(tracks);
    }
}
