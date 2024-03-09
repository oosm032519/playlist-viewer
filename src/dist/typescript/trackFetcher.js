"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackFetcher = void 0;
const trackManager_1 = require("./trackManager");
class TrackFetcher {
    constructor() {
        this.trackManager = new trackManager_1.TrackManager();
    }
    fetchRecommendedTracks(average, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            const artistNamesParam = mode.topFiveArtistNames.join(',');
            const data = yield this.fetchRecommendationsFromAPI(average, mode, artistNamesParam);
            this.trackManager.processRecommendationData(data);
        });
    }
    fetchRecommendationsFromAPI(average, mode, artistNamesParam) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.constructAPIUrl(average, mode, artistNamesParam);
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch recommendations. Status: ${response.status} ${response.statusText}`);
            }
            return yield response.json();
        });
    }
    constructAPIUrl(average, mode, artistNamesParam) {
        return `/java/recommendations?tempo=${average.averageTempo}&key=${mode.modeKey}&danceability=${average.averageDanceability}&energy=${average.averageEnergy}&acousticness=${average.averageAcousticness}&liveness=${average.averageLiveness}&speechiness=${average.averageSpeechiness}&valence=${average.averageValence}&modeArtistNames=${artistNamesParam}`;
    }
    fetchTrack(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error('There was a problem with the fetch operation');
            }
        });
    }
}
exports.TrackFetcher = TrackFetcher;
//# sourceMappingURL=trackFetcher.js.map