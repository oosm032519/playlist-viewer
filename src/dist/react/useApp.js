var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { Option } from './CombinedContext';
export const useApp = () => {
    const [selectedOption, setSelectedOption] = useState(Option.PlaylistIdOption);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [visitedPlaylists, setVisitedPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [showTracks, setShowTracks] = useState(false);
    const [showVisitedPlaylists, setShowVisitedPlaylists] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const { fetchVisitedPlaylists } = useApi();
    const [playlistId, setPlaylistId] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    useEffect(() => {
        const fetchPlaylists = () => __awaiter(void 0, void 0, void 0, function* () {
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
    useEffect(() => {
        if (showTracks) {
            setShowRecommendations(showTracks);
        }
    }, [showTracks]);
    useEffect(() => {
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
//# sourceMappingURL=useApp.js.map