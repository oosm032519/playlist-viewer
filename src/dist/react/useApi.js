var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useCallback, useContext } from 'react';
import CombinedContext from './CombinedContext';
import { RecommendationCalculator } from './RecommendationCalculator';
import PlaylistIdContext from './PlaylistIdContext';
export function useApi() {
    const { setPlaylists, setSelectedPlaylist } = useContext(CombinedContext);
    const { setPlaylistId } = useContext(PlaylistIdContext);
    const fetchPlaylistById = (playlistId) => __awaiter(this, void 0, void 0, function* () {
        console.log('fetchPlaylistByIdが呼び出されました');
        const response = yield fetch(`/java/playlist/${playlistId}`);
        const playlist = yield response.json();
        console.log(playlist);
        setSelectedPlaylist(playlist);
        setPlaylistId(playlistId);
        return playlist;
    });
    const fetchPlaylistsByName = (searchQuery) => __awaiter(this, void 0, void 0, function* () {
        console.log('fetchPlaylistsByNameが呼び出されました');
        const response = yield fetch(`/java/search/${searchQuery}`);
        const playlists = yield response.json();
        console.log(playlists);
        setPlaylists(playlists);
        return playlists;
    });
    const fetchVisitedPlaylists = () => __awaiter(this, void 0, void 0, function* () {
        console.log('fetchVisitedPlaylistsが呼び出されました');
        const response = yield fetch('/java/user/visited-playlists');
        const visitedPlaylists = yield response.json();
        console.log(visitedPlaylists);
        return visitedPlaylists;
    });
    const fetchRecommendations = useCallback((tracks) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log('fetchRecommendationsが呼び出されました');
        const modeArtistNames = RecommendationCalculator.calculateModeArtistNames(tracks);
        const averageValues = RecommendationCalculator.calculateAverageValues(tracks);
        const mode = RecommendationCalculator.calculateMode(tracks);
        const endpoint = `/java/recommendations?tempo=${averageValues.averageTempo}&key=${averageValues.modeKey}&danceability=${averageValues.averageDanceability}&energy=${averageValues.averageEnergy}&acousticness=${averageValues.averageAcousticness}&liveness=${averageValues.averageLiveness}&speechiness=${averageValues.averageSpeechiness}&valence=${averageValues.averageValence}&timeSignature=${averageValues.timeSignature}&durationMs=${averageValues.durationMs}&mode=${mode}&instrumentalness=${averageValues.instrumentalness}&loudness=${averageValues.loudness}&modeArtistNames=${modeArtistNames}`;
        const response = yield fetch(endpoint);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        if ((_a = response.headers.get("content-type")) === null || _a === void 0 ? void 0 : _a.includes("application/json")) {
            const data = yield response.json();
            console.log(data);
            if (data && data.tracks) {
                const trackIds = tracks.map(track => track.audioFeatures.id);
                const uniqueRecommendations = data.tracks.filter((track) => !trackIds.includes(track.id));
                console.log(uniqueRecommendations);
                return uniqueRecommendations;
            }
            else {
                console.error('data or data.tracks is null or undefined');
                return [];
            }
        }
        else {
            console.error('Received non-JSON response');
            return [];
        }
    }), []);
    return { fetchPlaylistById, fetchPlaylistsByName, fetchVisitedPlaylists, fetchRecommendations };
}
//# sourceMappingURL=useApi.js.map