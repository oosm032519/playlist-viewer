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
exports.useApp = void 0;
const react_1 = require("react");
const useApi_1 = require("./useApi");
const CombinedContext_1 = require("./CombinedContext");
const useApp = () => {
    const [selectedOption, setSelectedOption] = (0, react_1.useState)(CombinedContext_1.Option.PlaylistIdOption);
    const [playlists, setPlaylists] = (0, react_1.useState)([]);
    const [selectedPlaylist, setSelectedPlaylist] = (0, react_1.useState)(null);
    const [visitedPlaylists, setVisitedPlaylists] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [showPlaylists, setShowPlaylists] = (0, react_1.useState)(false);
    const [showTracks, setShowTracks] = (0, react_1.useState)(false);
    const [showVisitedPlaylists, setShowVisitedPlaylists] = (0, react_1.useState)(false);
    const [showRecommendations, setShowRecommendations] = (0, react_1.useState)(false);
    const { fetchVisitedPlaylists } = (0, useApi_1.useApi)();
    const [playlistId, setPlaylistId] = (0, react_1.useState)(null);
    const [message, setMessage] = (0, react_1.useState)(null);
    const [messageType, setMessageType] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchPlaylists = () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('fetchPlaylistsが呼び出されました');
            setIsLoading(true);
            try {
                const visitedPlaylists = yield fetchVisitedPlaylists();
                setVisitedPlaylists(visitedPlaylists);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        });
        fetchPlaylists();
    }, []);
    (0, react_1.useEffect)(() => {
        console.log('showPlaylistsが変更されました');
        setShowRecommendations(showTracks);
    }, [showTracks]);
    (0, react_1.useEffect)(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const loginResult = urlParams.get('loginResult');
        if (loginResult === 'success') {
            setMessage("Spotifyへのログインが完了しました");
            setMessageType('success');
        }
    }, []);
    return {
        selectedOption,
        setSelectedOption,
        playlists,
        setPlaylists,
        selectedPlaylist,
        setSelectedPlaylist,
        visitedPlaylists,
        setVisitedPlaylists,
        isLoading,
        setIsLoading,
        showPlaylists,
        setShowPlaylists,
        showTracks,
        setShowTracks,
        showVisitedPlaylists,
        setShowVisitedPlaylists,
        showRecommendations,
        setShowRecommendations,
        playlistId,
        setPlaylistId,
        message,
        setMessage,
        messageType,
        setMessageType,
    };
};
exports.useApp = useApp;
//# sourceMappingURL=useApp.js.map