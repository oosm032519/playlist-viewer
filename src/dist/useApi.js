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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApi = void 0;
const react_1 = require("react");
const CombinedContext_1 = __importDefault(require("./CombinedContext"));
const RecommendationCalculator_1 = require("./RecommendationCalculator");
const PlaylistIdContext_1 = __importDefault(require("./PlaylistIdContext"));
function useApi() {
    const { setPlaylists, setSelectedPlaylist, setMessage, setMessageType } = (0, react_1.useContext)(CombinedContext_1.default);
    const { setPlaylistId } = (0, react_1.useContext)(PlaylistIdContext_1.default);
    const fetchPlaylistById = (playlistId) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('fetchPlaylistByIdが呼び出されました');
            const response = yield fetch(`/java/playlist/${playlistId}`);
            const playlist = yield response.json();
            console.log(playlist);
            setSelectedPlaylist(playlist);
            setPlaylistId(playlistId);
            return playlist;
        }
        catch (error) {
            setMessage('プレイリストの取得に失敗しました。');
            setMessageType('error');
        }
    });
    const fetchPlaylistsByName = (searchQuery) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('fetchPlaylistsByNameが呼び出されました');
            const response = yield fetch(`/java/search/${searchQuery}`);
            const playlists = yield response.json();
            console.log(playlists);
            setPlaylists(playlists);
            return playlists;
        }
        catch (error) {
            setMessage('プレイリストの検索に失敗しました。');
            setMessageType('error');
        }
    });
    const fetchVisitedPlaylists = () => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('fetchVisitedPlaylistsが呼び出されました');
            const response = yield fetch('/java/user/visited-playlists');
            const visitedPlaylists = yield response.json();
            console.log(visitedPlaylists);
            return visitedPlaylists;
        }
        catch (error) {
            setMessage('訪問したプレイリストの取得に失敗しました。');
            setMessageType('error');
        }
    });
    const fetchRecommendations = (0, react_1.useCallback)((tracks) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            console.log('fetchRecommendationsが呼び出されました');
            const modeArtistNames = RecommendationCalculator_1.RecommendationCalculator.calculateModeArtistNames(tracks);
            const averageValues = RecommendationCalculator_1.RecommendationCalculator.calculateAverageValues(tracks);
            const mode = RecommendationCalculator_1.RecommendationCalculator.calculateMode(tracks);
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
        }
        catch (error) {
            setMessage('おすすめの曲の取得に失敗しました。');
            setMessageType('error');
        }
    }), []);
    const fetchUserPlaylists = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/java/spotify/user/playlists');
        if (!response.ok) {
            const message = yield response.text();
            throw new Error(message);
        }
        return yield response.json();
    }), []);
    return { fetchPlaylistById, fetchPlaylistsByName, fetchVisitedPlaylists, fetchRecommendations, fetchUserPlaylists };
}
exports.useApi = useApi;
//# sourceMappingURL=useApi.js.map